package runde.boardgames.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import runde.boardgames.dto.GameDetailDto
import runde.boardgames.dto.GameDto
import runde.boardgames.exception.BadRequestException
import runde.boardgames.exception.NotFoundException
import runde.boardgames.repository.GameRepository

@Service
class GameService(
  private val gameRepository: GameRepository,
) {
  @Transactional(readOnly = true)
  fun getByIdWithExpansions(bggId: Int): GameDetailDto {
    // Get the main game
    val mainGameWithLastPlayed = gameRepository.findByIdWithLastPlayed(bggId)
    if (mainGameWithLastPlayed == null || mainGameWithLastPlayed.first.mainGameId != null) {
      throw NotFoundException("Game not found with id: $bggId")
    }
    // Get its expansions
    val expansionsWithLastPlayed = gameRepository.findExpansionsWithLastPlayed(bggId)
    // Return the game details
    return GameDetailDto.fromGameDto(mainGameWithLastPlayed, expansionsWithLastPlayed)
  }

  @Transactional(readOnly = true)
  fun getAll(): List<GameDto> = gameRepository.findAll()

  @Transactional(readOnly = true)
  fun getAllWithExpansions(
    minPlayers: Int?,
    maxPlayers: Int?,
    sort: String,
    dir: String,
  ): List<GameDetailDto> {
    if (minPlayers != null && minPlayers < 1) {
      throw BadRequestException("minPlayers must be greater or equal 1")
    }
    if (maxPlayers != null && maxPlayers < 1) {
      throw BadRequestException("maxPlayers must be greater or equal 1")
    }
    if (minPlayers != null && maxPlayers != null && minPlayers > maxPlayers) {
      throw BadRequestException("maxPlayers must be greater than minPlayers")
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
              minPlayers,
              maxPlayers,
            )

          // Filter the expansions
          val matchingExpansions =
            game.expansions
              .filter { expansion ->
                matchesPlayers(expansion.playersMin, expansion.playersMax, minPlayers, maxPlayers)
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

  @Transactional
  fun upsertGame(gameDto: GameDto): GameDto {
    validateMainGameId(gameDto)
    return gameRepository.upsert(gameDto)
  }

  @Transactional
  fun deleteGame(bggId: Int) = gameRepository.deleteById(bggId)

  private fun matchesPlayers(
    gameMin: Int,
    gameMax: Int,
    minPlayers: Int?,
    maxPlayers: Int?,
  ): Boolean {
    if (minPlayers != null && (gameMin > minPlayers || gameMax < minPlayers)) {
      return false
    }
    if (maxPlayers != null && (gameMin > maxPlayers || gameMax < maxPlayers)) {
      return false
    }
    return true
  }

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

        "weight" -> compareBy { it.weight }

        else -> throw BadRequestException(
          "Unsupported sort=$sort. Use name, lastPlayed, ratingBgg, ratingPersonal, weight.",
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
