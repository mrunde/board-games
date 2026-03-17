package runde.boardgames.util

import org.springframework.stereotype.Component
import runde.boardgames.config.properties.ImageProperties

@Component
class ImageUrlResolver(
  private val imageProperties: ImageProperties,
) {
  fun toPublicUrl(imagePath: String?): String? {
    if (imagePath.isNullOrBlank()) return null
    val trimmedBase =
      imageProperties.publicBase
        .trimStart('/')
        .trimEnd('/')
    return "${imageProperties.baseUrl}/board-games/$trimmedBase/${imagePath.trimStart('/')}"
  }
}
