package runde.boardgames.config.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app.images")
data class ImageProperties(
  var path: String,
  var publicBase: String,
)
