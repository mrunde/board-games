package runde.boardgames.config

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Configuration
import runde.boardgames.config.properties.AssetProperties

@Configuration
@EnableConfigurationProperties(AssetProperties::class)
class AppConfig
