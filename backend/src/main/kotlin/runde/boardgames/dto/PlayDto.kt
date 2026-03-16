package runde.boardgames.dto

import jakarta.validation.constraints.PastOrPresent
import jakarta.validation.constraints.Positive
import org.jetbrains.annotations.NotNull
import java.time.LocalDate

data class PlayDto(
  @field:NotNull
  @field:Positive
  val bggId: Int,
  @field:NotNull
  @field:PastOrPresent(message = "playedOn cannot be in the future")
  val playedOn: LocalDate = LocalDate.now(),
)
