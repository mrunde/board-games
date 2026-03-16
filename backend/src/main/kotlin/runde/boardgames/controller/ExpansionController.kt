package runde.boardgames.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import runde.boardgames.dto.ExpansionDto
import runde.boardgames.service.ExpansionService

@RestController
@RequestMapping("/api/expansions")
class ExpansionController(
  private val expansionService: ExpansionService,
) {
  @GetMapping("/{bggId}")
  fun getExpansionById(
    @PathVariable bggId: Int,
  ): ResponseEntity<ExpansionDto> = ResponseEntity.ok(expansionService.getExpansionById(bggId))
}
