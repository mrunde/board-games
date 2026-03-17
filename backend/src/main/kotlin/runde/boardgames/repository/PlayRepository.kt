package runde.boardgames.repository

import org.jetbrains.exposed.sql.insertIgnore
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository
import runde.boardgames.dto.PlayDto
import runde.boardgames.entity.Play
import runde.boardgames.entity.toPlayDto

@Repository
class PlayRepository {
  fun findAllById(bggId: Int): List<PlayDto> =
    transaction {
      Play
        .selectAll()
        .where { Play.bggId eq bggId }
        .map { row -> row.toPlayDto() }
    }

  fun recordPlay(playDto: PlayDto) =
    transaction {
      Play.insertIgnore {
        it[Play.bggId] = playDto.bggId
        it[Play.playedOn] = playDto.playedOn
      }
    }
}
