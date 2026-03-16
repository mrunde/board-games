package runde.boardgames.exception.handler

import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class ApiExceptionHandler {
  @ExceptionHandler(DataIntegrityViolationException::class)
  fun handleDataIntegrityViolationException(
    e: DataIntegrityViolationException,
  ): ResponseEntity<Map<String, String>> {
    val msg = e.mostSpecificCause.message ?: e.message ?: "Data integrity violation"

    val status =
      when {
        msg.contains("duplicate key", ignoreCase = true) -> HttpStatus.CONFLICT
        msg.contains("violates foreign key", ignoreCase = true) -> HttpStatus.BAD_REQUEST
        msg.contains("violates check constraint", ignoreCase = true) -> HttpStatus.BAD_REQUEST
        else -> HttpStatus.BAD_REQUEST
      }

    return ResponseEntity.status(status).body(mapOf("error" to msg))
  }
}
