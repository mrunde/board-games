package runde.boardgames.entity

import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.Table
import runde.boardgames.dto.GameDto

object Game : Table("board_games.game") {
  val bggId = integer("bgg_id")
  val name = varchar("name", 50).uniqueIndex()

  val ratingBgg = decimal("rating_bgg", 3, 2)
  val ratingPersonal = integer("rating_personal").nullable()

  val playingTimeMin = integer("playing_time_min")
  val playingTimeMax = integer("playing_time_max")

  val weight = decimal("weight", 3, 2)

  val playersMin = integer("players_min")
  val playersMax = integer("players_max")
  val playersRecMin = integer("players_rec_min")
  val playersRecMax = integer("players_rec_max")

  val mainGameId = optReference("main_game_id", bggId, onDelete = ReferenceOption.RESTRICT)

  override val primaryKey = PrimaryKey(bggId, name = "pk_game")
}

fun ResultRow.toGameDto(): GameDto =
  GameDto(
    bggId = this[Game.bggId],
    name = this[Game.name],
    ratingBgg = this[Game.ratingBgg].toDouble(),
    ratingPersonal = this[Game.ratingPersonal],
    playingTimeMin = this[Game.playingTimeMin],
    playingTimeMax = this[Game.playingTimeMax],
    weight = this[Game.weight].toDouble(),
    playersMin = this[Game.playersMin],
    playersMax = this[Game.playersMax],
    playersRecMin = this[Game.playersRecMin],
    playersRecMax = this[Game.playersRecMax],
    mainGameId = this[Game.mainGameId],
  )
