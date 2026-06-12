package runde.boardgames.service

import org.springframework.stereotype.Service
import runde.boardgames.dto.PlayCalendarDto
import runde.boardgames.dto.PlayDto
import runde.boardgames.repository.PlayRepository
import java.time.LocalDate

@Service
class PlayService(
  private val playRepository: PlayRepository,
) {
  fun getAllById(bggId: Int): List<PlayDto> = playRepository.findAllById(bggId)

  fun getAllByYearAndMonth(
    year: Int,
    month: Int,
  ): List<PlayCalendarDto> = playRepository.findAllByYearAndMonth(year = year, month = month)

  fun recordPlay(playDto: PlayDto): Boolean = playRepository.recordPlay(playDto)

  fun deletePlay(
    bggId: Int,
    playedOn: LocalDate,
  ) {
    playRepository.deletePlay(bggId, playedOn)
  }
}
