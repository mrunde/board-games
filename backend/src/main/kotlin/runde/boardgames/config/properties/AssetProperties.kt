package runde.boardgames.config.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app.assets")
data class AssetProperties(
  var baseUrl: String,
  var path: String,
  var publicBase: String,
)
