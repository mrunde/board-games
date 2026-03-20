plugins {
  kotlin("jvm") version "2.2.21"
  kotlin("plugin.spring") version "2.2.21"
  id("org.springframework.boot") version "4.0.2"
  id("io.spring.dependency-management") version "1.1.7"
}

group = "runde"
version = "0.2.1"
description = "board-games"

java {
  toolchain {
    languageVersion = JavaLanguageVersion.of(21)
  }
}

repositories {
  mavenCentral()
}

val exposedVersion = "0.61.0"
val openApiVersion = "3.0.1"

dependencies {
  // Spring Boot
  implementation("org.springframework.boot:spring-boot-starter-actuator")
  implementation("org.springframework.boot:spring-boot-starter-jdbc")
  implementation("org.springframework.boot:spring-boot-starter-validation")
  implementation("org.springframework.boot:spring-boot-starter-webmvc")

  // OpenAPI
  implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:$openApiVersion")

  // Exposed
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.exposed:exposed-core:$exposedVersion")
  implementation("org.jetbrains.exposed:exposed-dao:$exposedVersion")
  implementation("org.jetbrains.exposed:exposed-java-time:$exposedVersion")
  implementation("org.jetbrains.exposed:exposed-jdbc:$exposedVersion")

  // Flyway migrations
  implementation("org.flywaydb:flyway-core")

  // Postgres driver
  runtimeOnly("org.postgresql:postgresql")

  testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
  testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")

  testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
  compilerOptions {
    freeCompilerArgs.addAll("-Xjsr305=strict", "-Xannotation-default-target=param-property")
  }
}

tasks.withType<Test> {
  useJUnitPlatform()
}
