package runde.boardgames.exception

import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException

class BadRequestException(
  message: String,
) : ResponseStatusException(HttpStatus.BAD_REQUEST, message)
