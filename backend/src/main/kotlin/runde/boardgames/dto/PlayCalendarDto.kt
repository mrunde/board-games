package runde.boardgames.dto

import java.time.LocalDate

data class PlayCalendarDto(
  val bggId: Int,
  val name: String,
  val isExpansion: Boolean,
  val imageUrl: String,
  val playedOn: LocalDate,
)
