package runde.boardgames.repository

import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.max
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.upsert
import org.springframework.stereotype.Repository
import runde.boardgames.dto.GameDetailDto
import runde.boardgames.dto.GameDto
import runde.boardgames.entity.Game
import runde.boardgames.entity.Play
import runde.boardgames.entity.toGameDto
import runde.boardgames.service.AssetService
import java.math.BigDecimal
import java.time.LocalDate

@Repository
class GameRepository(
  private val assetService: AssetService,
) {
  fun findById(bggId: Int): GameDto? =
    transaction {
      Game
        .selectAll()
        .where { Game.bggId eq bggId }
        .singleOrNull()
        ?.toGameDto()
    }

  fun findByIdWithLastPlayed(bggId: Int): Pair<GameDto, LocalDate?>? =
    transaction {
      val lastPlayedExpr = Play.playedOn.max()

      (Game leftJoin Play)
        .select(Game.columns + lastPlayedExpr)
        .where { Game.bggId eq bggId }
        .groupBy(*Game.columns.toTypedArray())
        .singleOrNull()
        ?.let { row ->
          row.toGameDto() to row[lastPlayedExpr]
        }
    }

  fun findExpansionsWithLastPlayed(mainGameId: Int): List<Pair<GameDto, LocalDate?>> =
    transaction {
      val lastPlayedExpr = Play.playedOn.max()

      (Game leftJoin Play)
        .select(Game.columns + lastPlayedExpr)
        .where { Game.mainGameId eq mainGameId }
        .groupBy(*Game.columns.toTypedArray())
        .orderBy(Game.name to SortOrder.ASC)
        .map { row ->
          row.toGameDto() to row[lastPlayedExpr]
        }
    }

  fun findAllWithExpansions(): List<GameDetailDto> =
    transaction {
      val lastPlayed = Play.playedOn.max()

      val rows =
        (Game leftJoin Play)
          .select(Game.columns + lastPlayed)
          .groupBy(*Game.columns.toTypedArray())
          .map { row ->
            row.toGameDto() to row[lastPlayed]
          }

      val byMainId: Map<Int?, List<Pair<GameDto, LocalDate?>>> =
        rows.groupBy { it.first.mainGameId }

      val mainGames =
        byMainId[null]
          .orEmpty()
          .sortedBy { it.first.name }

      mainGames.map { mainGame ->
        val gameFiles = assetService.getGameFiles(mainGame.first.bggId)

        GameDetailDto.fromGameDto(
          gameWithLastPlayed = mainGame,
          expansionsWithLastPlayed =
            (byMainId[mainGame.first.bggId].orEmpty())
              .sortedBy { it.first.name },
          files = gameFiles,
          assetService = assetService,
        )
      }
    }

  fun upsert(game: GameDto): GameDto =
    transaction {
      Game.upsert {
        it[bggId] = game.bggId
        it[name] = game.name
        it[ratingBgg] = BigDecimal.valueOf(game.ratingBgg)
        it[ratingPersonal] = game.ratingPersonal
        it[playingTimeMin] = game.playingTimeMin
        it[playingTimeMax] = game.playingTimeMax
        it[complexity] = BigDecimal.valueOf(game.complexity)
        it[playersMin] = game.playersMin
        it[playersMax] = game.playersMax
        it[playersRecMin] = game.playersRecMin
        it[playersRecMax] = game.playersRecMax
        it[mainGameId] = game.mainGameId
      }

      requireNotNull(findById(game.bggId))
    }

  fun deleteById(bggId: Int) =
    transaction {
      Game.deleteWhere { Game.bggId eq bggId }
    }
}
