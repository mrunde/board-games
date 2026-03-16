package runde.boardgames.config

import jakarta.annotation.PostConstruct
import org.jetbrains.exposed.sql.Database
import org.springframework.context.annotation.Configuration
import javax.sql.DataSource

@Configuration
class ExposedConfig(
  private val datasource: DataSource,
) {
  @PostConstruct
  fun init() {
    Database.connect(datasource)
  }
}
