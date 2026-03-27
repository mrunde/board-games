package runde.boardgames.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import runde.boardgames.config.properties.AssetProperties

@Configuration
class StaticResourceConfig(
  private val assetProperties: AssetProperties,
) : WebMvcConfigurer {
  override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
    registry
      .addResourceHandler("${assetProperties.publicBase}/**")
      .addResourceLocations("file:${assetProperties.path.trimEnd('/')}/")
  }
}
