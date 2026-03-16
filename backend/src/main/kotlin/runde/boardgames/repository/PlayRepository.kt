package runde.boardgames.repository

import org.jetbrains.exposed.sql.insertIgnore
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository
import runde.boardgames.dto.PlayDto
import runde.boardgames.entity.Play

@Repository
class PlayRepository {
  fun recordPlay(playDto: PlayDto) =
    transaction {
      Play.insertIgnore {
        it[Play.bggId] = playDto.bggId
        it[Play.playedOn] = playDto.playedOn
      }
    }
}
