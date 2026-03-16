package runde.boardgames.controller

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import runde.boardgames.dto.PlayDto
import runde.boardgames.service.PlayService

@RestController
@RequestMapping("/api/plays")
class PlayController(
  private val playService: PlayService,
) {
  @PostMapping
  fun recordPlay(
    @Valid @RequestBody playDto: PlayDto,
  ): ResponseEntity<Unit> {
    playService.recordPlay(playDto)
    return ResponseEntity.status(HttpStatus.CREATED).build()
  }

  @PostMapping("/game/{bggId}/today")
  fun recordPlayToday(
    @PathVariable bggId: Int,
  ): ResponseEntity<Unit> {
    playService.recordPlayToday(bggId)
    return ResponseEntity.status(HttpStatus.CREATED).build()
  }
}
