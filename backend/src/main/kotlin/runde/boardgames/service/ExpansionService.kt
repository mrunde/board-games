package runde.boardgames.service

import org.springframework.stereotype.Service
import runde.boardgames.dto.ExpansionDto
import runde.boardgames.exception.NotFoundException
import runde.boardgames.repository.GameRepository
import runde.boardgames.util.ImageUrlResolver

@Service
class ExpansionService(
  private val gameRepository: GameRepository,
  private val imageUrlResolver: ImageUrlResolver,
) {
  fun getExpansionById(bggId: Int): ExpansionDto {
    val expansionWithLastPlayed =
      gameRepository.findByIdWithLastPlayed(bggId)
        ?: throw NotFoundException("Expansion not found with id: $bggId")
    return ExpansionDto.fromGameDto(
      gameDto = expansionWithLastPlayed.first,
      lastPlayed = expansionWithLastPlayed.second,
      imageUrlResolver = imageUrlResolver,
    )
  }
}
