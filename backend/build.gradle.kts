val ktor_version: String = "2.3.7"
val kotlin_version: String = "1.9.22"
val logback_version: String = "1.4.14"
val exposed_version: String = "0.46.0"
val hikari_version: String = "5.1.0"
val supabase_version: String = "2.1.2"

plugins {
    kotlin("jvm") version "1.9.22"
    kotlin("plugin.serialization") version "1.9.22"
    id("io.ktor.plugin") version "2.3.7"
    application
}

group = "com.portfolio"
version = "1.0.0"

application {
    mainClass.set("com.portfolio.ApplicationKt")

    val isDevelopment: Boolean = project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}

repositories {
    mavenCentral()
}

dependencies {
    // Ktor Core
    implementation("io.ktor:ktor-server-core-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-netty-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-content-negotiation-jvm:$ktor_version")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm:$ktor_version")

    // Ktor Features
    implementation("io.ktor:ktor-server-cors-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-compression-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-call-logging-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-status-pages-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-auth-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-auth-jwt-jvm:$ktor_version")

    // Ktor Client (for Supabase API calls)
    implementation("io.ktor:ktor-client-core:$ktor_version")
    implementation("io.ktor:ktor-client-cio:$ktor_version")
    implementation("io.ktor:ktor-client-content-negotiation:$ktor_version")

    // Database
    implementation("org.jetbrains.exposed:exposed-core:$exposed_version")
    implementation("org.jetbrains.exposed:exposed-dao:$exposed_version")
    implementation("org.jetbrains.exposed:exposed-jdbc:$exposed_version")
    implementation("org.jetbrains.exposed:exposed-java-time:$exposed_version")
    implementation("org.postgresql:postgresql:42.7.1")
    implementation("com.zaxxer:HikariCP:$hikari_version")

    // Supabase Client
    implementation("io.github.jan-tennert.supabase:storage-kt:$supabase_version")
    implementation("io.github.jan-tennert.supabase:postgrest-kt:$supabase_version")

    // Logging
    implementation("ch.qos.logback:logback-classic:$logback_version")

    // Config
    implementation("io.ktor:ktor-server-config-yaml:$ktor_version")

    // Testing
    testImplementation("io.ktor:ktor-server-tests-jvm:$ktor_version")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")
}

tasks {
    create("stage").dependsOn("installDist")
}

ktor {
    fatJar {
        archiveFileName.set("portfolio-backend.jar")
    }

    docker {
        jreVersion.set(JavaVersion.VERSION_17)
        localImageName.set("portfolio-backend")
        imageTag.set("latest")

        externalRegistry.set(
            io.ktor.plugin.features.DockerImageRegistry.dockerHub(
                appName = provider { "portfolio-backend" },
                username = providers.environmentVariable("DOCKER_HUB_USERNAME"),
                password = providers.environmentVariable("DOCKER_HUB_PASSWORD")
            )
        )
    }
}
