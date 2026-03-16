package runde.boardgames.exception

import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException

class NotFoundException(
  message: String,
) : ResponseStatusException(HttpStatus.NOT_FOUND, message)
