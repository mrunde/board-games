package runde.boardgames.service

import org.springframework.stereotype.Service
import runde.boardgames.dto.PlayDto
import runde.boardgames.repository.PlayRepository

@Service
class PlayService(
  private val playRepository: PlayRepository,
) {
  fun getAllById(bggId: Int): List<PlayDto> = playRepository.findAllById(bggId)

  fun recordPlay(playDto: PlayDto) {
    playRepository.recordPlay(playDto)
  }
}
