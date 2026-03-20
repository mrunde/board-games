package runde.boardgames.dto

import runde.boardgames.util.ImageUrlResolver
import java.time.LocalDate

data class GameDetailDto(
  val bggId: Int,
  val name: String,
  val imageUrl: String?,
  val ratingBgg: Double,
  val ratingPersonal: Int?,
  val playingTimeMin: Int,
  val playingTimeMax: Int,
  val complexity: Double,
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
      imageUrlResolver: ImageUrlResolver,
    ): GameDetailDto =
      GameDetailDto(
        bggId = gameWithLastPlayed.first.bggId,
        name = gameWithLastPlayed.first.name,
        imageUrl = imageUrlResolver.toPublicUrl("games/${gameWithLastPlayed.first.bggId}.jpg"),
        ratingBgg = gameWithLastPlayed.first.ratingBgg,
        ratingPersonal = gameWithLastPlayed.first.ratingPersonal,
        playingTimeMin = gameWithLastPlayed.first.playingTimeMin,
        playingTimeMax = gameWithLastPlayed.first.playingTimeMax,
        complexity = gameWithLastPlayed.first.complexity,
        playersMin = gameWithLastPlayed.first.playersMin,
        playersMax = gameWithLastPlayed.first.playersMax,
        playersRecMin = gameWithLastPlayed.first.playersRecMin,
        playersRecMax = gameWithLastPlayed.first.playersRecMax,
        lastPlayed = gameWithLastPlayed.second,
        expansions =
          expansionsWithLastPlayed.map {
            ExpansionDto.fromGameDto(
              gameDto = it.first,
              lastPlayed = it.second,
              imageUrlResolver = imageUrlResolver,
            )
          },
      )
  }
}

data class ExpansionDto(
  val bggId: Int,
  val name: String,
  val imageUrl: String?,
  val ratingBgg: Double,
  val ratingPersonal: Int?,
  val playingTimeMin: Int,
  val playingTimeMax: Int,
  val complexity: Double,
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
      imageUrlResolver: ImageUrlResolver,
    ): ExpansionDto =
      ExpansionDto(
        bggId = gameDto.bggId,
        name = gameDto.name,
        imageUrl = imageUrlResolver.toPublicUrl("expansions/${gameDto.bggId}.jpg"),
        ratingBgg = gameDto.ratingBgg,
        ratingPersonal = gameDto.ratingPersonal,
        playingTimeMin = gameDto.playingTimeMin,
        playingTimeMax = gameDto.playingTimeMax,
        complexity = gameDto.complexity,
        playersMin = gameDto.playersMin,
        playersMax = gameDto.playersMax,
        playersRecMin = gameDto.playersRecMin,
        playersRecMax = gameDto.playersRecMax,
        lastPlayed = lastPlayed,
        mainGameId = gameDto.mainGameId,
      )
  }
}
