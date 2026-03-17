package runde.boardgames.entity

import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.date
import runde.boardgames.dto.PlayDto

object Play : Table("board_games.play") {
  val bggId =
    integer(
      "bgg_id",
    ).references(Game.bggId, onDelete = ReferenceOption.CASCADE)

  val playedOn = date("played_on")

  override val primaryKey = PrimaryKey(bggId, playedOn, name = "pk_play")
}

fun ResultRow.toPlayDto() =
  PlayDto(
    bggId = this[Play.bggId],
    playedOn = this[Play.playedOn],
  )
