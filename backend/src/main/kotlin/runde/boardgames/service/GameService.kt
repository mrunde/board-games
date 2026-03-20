package runde.boardgames.service

import org.springframework.stereotype.Service
import runde.boardgames.dto.GameDetailDto
import runde.boardgames.dto.GameDto
import runde.boardgames.exception.BadRequestException
import runde.boardgames.exception.NotFoundException
import runde.boardgames.repository.GameRepository
import runde.boardgames.util.ImageUrlResolver

@Service
class GameService(
  private val gameRepository: GameRepository,
  private val imageUrlResolver: ImageUrlResolver,
) {
  fun getByIdWithExpansions(bggId: Int): GameDetailDto {
    // Get the main game
    val mainGameWithLastPlayed = gameRepository.findByIdWithLastPlayed(bggId)
    if (mainGameWithLastPlayed == null || mainGameWithLastPlayed.first.mainGameId != null) {
      throw NotFoundException("Game not found with id: $bggId")
    }
    // Get its expansions
    val expansionsWithLastPlayed = gameRepository.findExpansionsWithLastPlayed(bggId)
    // Return the game details
    return GameDetailDto.fromGameDto(
      mainGameWithLastPlayed,
      expansionsWithLastPlayed,
      imageUrlResolver,
    )
  }

  fun getAllWithExpansions(
    players: Int?,
    sort: String,
    dir: String,
  ): List<GameDetailDto> {
    if (players != null && players < 1) {
      throw BadRequestException("Players must be greater or equal 1")
    }

    val games = gameRepository.findAllWithExpansions()

    val filtered =
      games
        .asSequence()
        .map { game ->
          // Check the main game
          val matchingMainGame =
            matchesPlayers(
              game.playersMin,
              game.playersMax,
              players,
            )

          // Filter the expansions
          val matchingExpansions =
            game.expansions
              .filter { expansion ->
                matchesPlayers(expansion.playersMin, expansion.playersMax, players)
              }

          when {
            matchingMainGame -> game
            matchingExpansions.isNotEmpty() -> game.copy(expansions = matchingExpansions)
            else -> null
          }
        }.filterNotNull()
        .toList()

    return sortGames(filtered, sort, dir)
  }

  fun upsertGame(gameDto: GameDto): GameDto {
    validateMainGameId(gameDto)
    return gameRepository.upsert(gameDto)
  }

  fun deleteGame(bggId: Int) = gameRepository.deleteById(bggId)

  private fun matchesPlayers(
    gameMin: Int,
    gameMax: Int,
    players: Int?,
  ): Boolean = !(players != null && (gameMin > players || gameMax < players))

  private fun sortGames(
    items: List<GameDetailDto>,
    sort: String,
    dir: String,
  ): List<GameDetailDto> {
    val comparator =
      when (sort.lowercase()) {
        "name" -> compareBy<GameDetailDto> { it.name.lowercase() }

        "lastplayed" -> compareBy { it.lastPlayed }

        "ratingbgg" -> compareBy { it.ratingBgg }

        "ratingpersonal" -> compareBy { it.ratingPersonal }

        "complexity" -> compareBy { it.complexity }

        else -> throw BadRequestException(
          "Unsupported sort=$sort. Use name, lastPlayed, ratingBgg, ratingPersonal, complexity.",
        )
      }

    val normalizedDir = dir.lowercase()
    val sorted =
      when (normalizedDir) {
        "asc" -> items.sortedWith(comparator)
        "desc" -> items.sortedWith(comparator.reversed())
        else -> throw BadRequestException("Unsupported dir=$dir. Use asc or desc.")
      }

    // For lastPlayed desc, put nulls last
    if (sort.equals("lastPlayed", ignoreCase = true) && normalizedDir == "desc") {
      return sorted.sortedWith(compareBy { it.lastPlayed == null })
    }

    return sorted
  }

  private fun validateMainGameId(gameDto: GameDto) {
    val mainGameId = gameDto.mainGameId ?: return
    // Check for same ID
    if (mainGameId == gameDto.bggId) {
      throw BadRequestException("mainGameId must not be the same as bggId")
    }
    // Check for existing main game
    val mainGame = gameRepository.findById(mainGameId)
    if (mainGame == null) {
      throw BadRequestException("mainGameId=$mainGameId does not exist")
    }
    if (mainGame.mainGameId != null) {
      throw BadRequestException("mainGameId=$mainGameId must point to a main game")
    }
  }
}
