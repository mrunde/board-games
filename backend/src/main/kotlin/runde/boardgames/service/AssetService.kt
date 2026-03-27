package runde.boardgames.service

import org.springframework.stereotype.Service
import runde.boardgames.config.properties.AssetProperties
import runde.boardgames.dto.AssetFileDto
import java.nio.file.Files
import java.nio.file.Path

@Service
class AssetService(
  private val assetProperties: AssetProperties,
) {
  private val basePath: Path = Path.of(assetProperties.path)

  fun getGameImageUrl(bggId: Int): String = publicUrl("games/$bggId/$bggId.jpg")

  fun getExpansionImageUrl(bggId: Int): String = publicUrl("expansions/$bggId/$bggId.jpg")

  fun getGameFiles(bggId: Int): List<AssetFileDto> = listFiles(category = "games", bggId = bggId)

  fun getExpansionFiles(bggId: Int): List<AssetFileDto> =
    listFiles(category = "expansions", bggId = bggId)

  private fun publicUrl(relativePath: String): String {
    val publicBase = assetProperties.publicBase.trim('/')

    return "${assetProperties.baseUrl}/board-games/$publicBase/$relativePath"
  }

  private fun listFiles(
    category: String,
    bggId: Int,
  ): List<AssetFileDto> {
    val dir = basePath.resolve(category).resolve(bggId.toString())
    if (!Files.isDirectory(dir)) return emptyList()

    Files.list(dir).use { paths ->
      return paths
        .toList()
        .asSequence()
        .filter { Files.isRegularFile(it) }
        .map { it.fileName.toString() }
        .filterNot { it.equals("$bggId.jpg", ignoreCase = true) }
        .mapNotNull { fileName -> toAssetFileDto(category, bggId, fileName) }
        .sortedBy { it.label }
        .toList()
    }
  }

  private fun toAssetFileDto(
    category: String,
    bggId: Int,
    fileName: String,
  ): AssetFileDto? {
    val regex =
      Regex("^${Regex.escape(bggId.toString())}_(.+)_([a-z]{2})\\.pdf$", RegexOption.IGNORE_CASE)
    val match = regex.matchEntire(fileName) ?: return null

    val language = match.groupValues[2].lowercase()
    val label = match.groupValues[1].replace("_", " ").trim()

    return AssetFileDto(
      fileName = fileName,
      url = publicUrl("$category/$bggId/$fileName"),
      language = language,
      label = label,
    )
  }
}
