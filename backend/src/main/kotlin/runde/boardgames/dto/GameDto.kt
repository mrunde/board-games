package runde.boardgames.dto

import jakarta.validation.constraints.AssertTrue
import jakarta.validation.constraints.DecimalMax
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Positive
import jakarta.validation.constraints.Size
import org.jetbrains.annotations.NotNull

data class GameDto(
  @field:NotNull
  @field:Positive
  val bggId: Int,
  @field:NotBlank
  @field:Size(max = 50)
  val name: String,
  @field:NotNull
  @field:DecimalMin("1.00")
  @field:DecimalMax("9.99")
  val ratingBgg: Double,
  @field:Min(1)
  @field:Max(10)
  val ratingPersonal: Int?,
  @field:NotNull
  @field:Min(0)
  val playingTimeMin: Int,
  @field:NotNull
  @field:Min(0)
  val playingTimeMax: Int,
  @field:NotNull
  @field:DecimalMin("1.00")
  @field:DecimalMax("9.99")
  val weight: Double,
  @field:NotNull
  @field:Min(1)
  val playersMin: Int,
  @field:NotNull
  @field:Min(1)
  val playersMax: Int,
  @field:NotNull
  @field:Min(1)
  val playersRecMin: Int,
  @field:NotNull
  @field:Min(1)
  val playersRecMax: Int,
  @field:Positive
  val mainGameId: Int?,
) {
  @AssertTrue(message = "playingTimeMax must not be less than playingTimeMin")
  fun isPlayingTimeValid(): Boolean = playingTimeMax >= playingTimeMin

  @AssertTrue(message = "playersMax must not be less than playersMin")
  fun isPlayersValid(): Boolean = playersMax >= playersMin

  @AssertTrue(message = "playersRecMax must not be less than playersRecMin")
  fun isPlayersRecValid(): Boolean = playersRecMax >= playersRecMin

  @AssertTrue(message = "recommended players must be within playersMin..playersMax")
  fun isPlayersRecWithinRange(): Boolean =
    playersRecMin >= playersMin && playersRecMax <= playersMax
}
