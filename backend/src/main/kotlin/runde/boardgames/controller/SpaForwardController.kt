package runde.boardgames.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class SpaForwardController {
  @GetMapping(
    value = [
      "/",
      "/games",
      "/games/{bggId}",
      "/expansions",
      "/expansions/{bggId}",
    ],
  )
  fun forward(): String = "forward:/index.html"
}
