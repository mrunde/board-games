package runde.boardgames.dto

import runde.boardgames.service.AssetService
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
  val files: List<AssetFileDto>,
  val expansions: List<ExpansionDto>,
) {
  companion object {
    fun fromGameDto(
      gameWithLastPlayed: Pair<GameDto, LocalDate?>,
      expansionsWithLastPlayed: List<Pair<GameDto, LocalDate?>>,
      files: List<AssetFileDto>,
      assetService: AssetService,
    ): GameDetailDto =
      GameDetailDto(
        bggId = gameWithLastPlayed.first.bggId,
        name = gameWithLastPlayed.first.name,
        imageUrl = assetService.getGameImageUrl(gameWithLastPlayed.first.bggId),
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
        files = files,
        expansions =
          expansionsWithLastPlayed.map {
            ExpansionDto.fromGameDto(
              gameDto = it.first,
              lastPlayed = it.second,
              files = emptyList(),
              assetService = assetService,
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
  val files: List<AssetFileDto>,
  val mainGameId: Int?,
) {
  companion object {
    fun fromGameDto(
      gameDto: GameDto,
      lastPlayed: LocalDate?,
      files: List<AssetFileDto>,
      assetService: AssetService,
    ): ExpansionDto =
      ExpansionDto(
        bggId = gameDto.bggId,
        name = gameDto.name,
        imageUrl = assetService.getExpansionImageUrl(gameDto.bggId),
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
        files = files,
        mainGameId = gameDto.mainGameId,
      )
  }
}
