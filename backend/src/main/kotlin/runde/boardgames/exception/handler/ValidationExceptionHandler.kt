package runde.boardgames.exception.handler

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class ValidationExceptionHandler {
  @ExceptionHandler(MethodArgumentNotValidException::class)
  fun handleMethodArgumentNotValidException(
    e: MethodArgumentNotValidException,
  ): ResponseEntity<Map<String, Any>> {
    val errors =
      e.bindingResult.fieldErrors.map {
        mapOf(
          "field" to it.field,
          "message" to (it.defaultMessage ?: "Invalid value"),
        )
      }
    return ResponseEntity.badRequest().body(
      mapOf(
        "error" to "Validation failed",
        "details" to errors,
      ),
    )
  }
}
