package runde.boardgames.repository

import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository
import runde.boardgames.dto.PlayCalendarDto
import runde.boardgames.dto.PlayDto
import runde.boardgames.entity.Game
import runde.boardgames.entity.Play
import runde.boardgames.entity.toPlayDto
import runde.boardgames.service.AssetService
import java.time.LocalDate

@Repository
class PlayRepository(
  private val assetService: AssetService,
) {
  fun findAllById(bggId: Int): List<PlayDto> =
    transaction {
      Play
        .selectAll()
        .where { Play.bggId eq bggId }
        .orderBy(Play.playedOn to SortOrder.DESC)
        .map { row -> row.toPlayDto() }
    }

  fun findAllByYearAndMonth(
    year: Int,
    month: Int,
  ): List<PlayCalendarDto> =
    transaction {
      val from = LocalDate.of(year, month, 1)
      val to = from.plusMonths(1)

      (Play innerJoin Game)
        .selectAll()
        .where { (Play.playedOn greaterEq from) and (Play.playedOn less to) }
        .orderBy(Play.playedOn to SortOrder.ASC, Game.name to SortOrder.ASC)
        .map { row ->
          val bggId = row[Game.bggId]
          val isExpansion = row[Game.mainGameId] != null
          val imageUrl =
            if (isExpansion) {
              assetService.getExpansionImageUrl(bggId)
            } else {
              assetService.getGameImageUrl(bggId)
            }

          PlayCalendarDto(
            bggId = bggId,
            name = row[Game.name],
            isExpansion = isExpansion,
            imageUrl = imageUrl,
            playedOn = row[Play.playedOn],
          )
        }
    }

  fun recordPlay(playDto: PlayDto): Boolean =
    transaction {
      val existingPlay = findByIdAndDate(playDto.bggId, playDto.playedOn)

      if (existingPlay != null) {
        false
      }
      Play.insert {
        it[Play.bggId] = playDto.bggId
        it[Play.playedOn] = playDto.playedOn
      }
      true
    }

  fun deletePlay(
    bggId: Int,
    playedOn: LocalDate,
  ) = transaction {
    Play.deleteWhere { (Play.bggId eq bggId) and (Play.playedOn eq playedOn) }
  }

  private fun findByIdAndDate(
    bggId: Int,
    playedOn: LocalDate,
  ): PlayDto? =
    transaction {
      Play
        .selectAll()
        .where { (Play.bggId eq bggId) and (Play.playedOn eq playedOn) }
        .singleOrNull()
        ?.toPlayDto()
    }
}
