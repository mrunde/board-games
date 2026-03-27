package runde.boardgames.service

import org.springframework.stereotype.Service
import runde.boardgames.dto.ExpansionDto
import runde.boardgames.exception.NotFoundException
import runde.boardgames.repository.GameRepository

@Service
class ExpansionService(
  private val gameRepository: GameRepository,
  private val assetService: AssetService,
) {
  fun getExpansionById(bggId: Int): ExpansionDto {
    // Get the expansion
    val expansionWithLastPlayed =
      gameRepository.findByIdWithLastPlayed(bggId)
        ?: throw NotFoundException("Expansion not found with id: $bggId")
    // Get the assets
    val expansionFiles = assetService.getExpansionFiles(bggId)
    // Return the expansion details
    return ExpansionDto.fromGameDto(
      gameDto = expansionWithLastPlayed.first,
      lastPlayed = expansionWithLastPlayed.second,
      files = expansionFiles,
      assetService = assetService,
    )
  }
}
