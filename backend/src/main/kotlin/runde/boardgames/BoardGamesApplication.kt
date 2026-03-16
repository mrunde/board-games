package runde.boardgames

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class BoardGamesApplication

fun main(args: Array<String>) {
  runApplication<BoardGamesApplication>(*args)
}
