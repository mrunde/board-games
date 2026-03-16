package runde.boardgames.dto

import java.time.LocalDate

data class GameDetailDto(
  val bggId: Int,
  val name: String,
  val ratingBgg: Double,
  val ratingPersonal: Int?,
  val playingTimeMin: Int,
  val playingTimeMax: Int,
  val weight: Double,
  val playersMin: Int,
  val playersMax: Int,
  val playersRecMin: Int,
  val playersRecMax: Int,
  val lastPlayed: LocalDate?,
  val expansions: List<ExpansionDto>,
) {
  companion object {
    fun fromGameDto(
      gameWithLastPlayed: Pair<GameDto, LocalDate?>,
      expansionsWithLastPlayed: List<Pair<GameDto, LocalDate?>>,
    ): GameDetailDto =
      GameDetailDto(
        bggId = gameWithLastPlayed.first.bggId,
        name = gameWithLastPlayed.first.name,
        ratingBgg = gameWithLastPlayed.first.ratingBgg,
        ratingPersonal = gameWithLastPlayed.first.ratingPersonal,
        playingTimeMin = gameWithLastPlayed.first.playingTimeMin,
        playingTimeMax = gameWithLastPlayed.first.playingTimeMax,
        weight = gameWithLastPlayed.first.weight,
        playersMin = gameWithLastPlayed.first.playersMin,
        playersMax = gameWithLastPlayed.first.playersMax,
        playersRecMin = gameWithLastPlayed.first.playersRecMin,
        playersRecMax = gameWithLastPlayed.first.playersRecMax,
        lastPlayed = gameWithLastPlayed.second,
        expansions = expansionsWithLastPlayed.map { ExpansionDto.fromGameDto(it.first, it.second) },
      )
  }
}

data class ExpansionDto(
  val bggId: Int,
  val name: String,
  val ratingBgg: Double,
  val ratingPersonal: Int?,
  val playingTimeMin: Int,
  val playingTimeMax: Int,
  val weight: Double,
  val playersMin: Int,
  val playersMax: Int,
  val playersRecMin: Int,
  val playersRecMax: Int,
  val lastPlayed: LocalDate?,
  val mainGameId: Int?,
) {
  companion object {
    fun fromGameDto(
      gameDto: GameDto,
      lastPlayed: LocalDate?,
    ): ExpansionDto =
      ExpansionDto(
        bggId = gameDto.bggId,
        name = gameDto.name,
        ratingBgg = gameDto.ratingBgg,
        ratingPersonal = gameDto.ratingPersonal,
        playingTimeMin = gameDto.playingTimeMin,
        playingTimeMax = gameDto.playingTimeMax,
        weight = gameDto.weight,
        playersMin = gameDto.playersMin,
        playersMax = gameDto.playersMax,
        playersRecMin = gameDto.playersRecMin,
        playersRecMax = gameDto.playersRecMax,
        lastPlayed = lastPlayed,
        mainGameId = gameDto.mainGameId,
      )
  }
}
