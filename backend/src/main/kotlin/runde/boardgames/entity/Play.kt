package runde.boardgames.entity

import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.date

object Play : Table("board_games.play") {
  val bggId =
    integer(
      "bgg_id",
    ).references(Game.bggId, onDelete = ReferenceOption.CASCADE)

  val playedOn = date("played_on")

  override val primaryKey = PrimaryKey(bggId, playedOn, name = "pk_play")
}
