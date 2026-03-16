package runde.boardgames.service

import org.springframework.stereotype.Service
import runde.boardgames.dto.PlayDto
import runde.boardgames.repository.PlayRepository
import java.time.LocalDate

@Service
class PlayService(
  private val playRepository: PlayRepository,
) {
  fun recordPlay(playDto: PlayDto) {
    playRepository.recordPlay(playDto)
  }

  fun recordPlayToday(bggId: Int) {
    recordPlay(PlayDto(bggId, LocalDate.now()))
  }
}
