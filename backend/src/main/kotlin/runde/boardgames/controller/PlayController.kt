package runde.boardgames.controller

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import runde.boardgames.dto.PlayCalendarDto
import runde.boardgames.dto.PlayDto
import runde.boardgames.service.PlayService
import java.time.LocalDate

@RestController
@RequestMapping("/api/plays")
class PlayController(
  private val playService: PlayService,
) {
  @GetMapping("/{bggId}")
  fun getAllById(
    @PathVariable("bggId") bggId: Int,
  ): List<PlayDto> = playService.getAllById(bggId)

  @GetMapping("/{year}/{month}")
  fun getAllByYearAndMonth(
    @PathVariable("year") year: Int,
    @PathVariable("month") month: Int,
  ): List<PlayCalendarDto> = playService.getAllByYearAndMonth(year = year, month = month)

  @PostMapping
  fun recordPlay(
    @Valid @RequestBody playDto: PlayDto,
  ): ResponseEntity<Unit> {
    val isCreated = playService.recordPlay(playDto)
    return if (isCreated) {
      ResponseEntity.status(HttpStatus.CREATED).build()
    } else {
      ResponseEntity.status(HttpStatus.CONFLICT).build()
    }
  }

  @DeleteMapping("/{bggId}/{playedOn}")
  fun deletePlay(
    @PathVariable("bggId") bggId: Int,
    @PathVariable("playedOn") playedOn: LocalDate,
  ): ResponseEntity<Unit> {
    playService.deletePlay(bggId, playedOn)
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build()
  }
}
