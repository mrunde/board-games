package runde.boardgames.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import runde.boardgames.config.properties.ImageProperties

@Configuration
class StaticResourceConfig(
  private val imageProperties: ImageProperties,
) : WebMvcConfigurer {
  override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
    registry
      .addResourceHandler("${imageProperties.publicBase}/**")
      .addResourceLocations("file:${imageProperties.path.trimEnd('/')}/")
  }
}
