package runde.boardgames.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import runde.boardgames.dto.ExpansionDto
import runde.boardgames.exception.NotFoundException
import runde.boardgames.repository.GameRepository

@Service
class ExpansionService(
  private val gameRepository: GameRepository,
) {
  @Transactional(readOnly = true)
  fun getExpansionById(bggId: Int): ExpansionDto {
    val expansionWithLastPlayed =
      gameRepository.findByIdWithLastPlayed(bggId)
        ?: throw NotFoundException("Expansion not found with id: $bggId")
    return ExpansionDto.fromGameDto(expansionWithLastPlayed.first, expansionWithLastPlayed.second)
  }
}
