package runde.boardgames.controller

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import runde.boardgames.dto.GameDetailDto
import runde.boardgames.dto.GameDto
import runde.boardgames.service.GameService

@RestController
@RequestMapping("/api/games")
class GameController(
  private val gameService: GameService,
) {
  @GetMapping("/{bggId}")
  fun getGameByIdWithExpansions(
    @PathVariable bggId: Int,
  ): ResponseEntity<GameDetailDto> = ResponseEntity.ok(gameService.getByIdWithExpansions(bggId))

  @GetMapping
  fun getAllGamesWithExpansions(
    @RequestParam(required = false) minPlayers: Int?,
    @RequestParam(required = false) maxPlayers: Int?,
    @RequestParam(required = false, defaultValue = "name") sort: String,
    @RequestParam(required = false, defaultValue = "asc") dir: String,
  ): List<GameDetailDto> =
    gameService.getAllWithExpansions(
      minPlayers = minPlayers,
      maxPlayers = maxPlayers,
      sort = sort,
      dir = dir,
    )

  @PostMapping
  fun addGame(
    @Valid @RequestBody gameDto: GameDto,
  ): ResponseEntity<GameDto> =
    ResponseEntity.status(HttpStatus.CREATED).body(gameService.upsertGame(gameDto))

  @PutMapping("/{bggId}")
  fun updateGameById(
    @PathVariable bggId: Int,
    @Valid @RequestBody gameDto: GameDto,
  ): ResponseEntity<GameDto> {
    if (bggId != gameDto.bggId) return ResponseEntity.badRequest().build()

    return ResponseEntity.ok(gameService.upsertGame(gameDto))
  }

  @DeleteMapping("/{bggId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  fun deleteGameById(
    @PathVariable bggId: Int,
  ) = gameService.deleteGame(bggId)
}
