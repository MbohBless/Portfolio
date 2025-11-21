package com.portfolio

import com.portfolio.config.configureDatabase
import com.portfolio.config.configureSecurity
import com.portfolio.routes.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.calllogging.*
import io.ktor.server.plugins.compression.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.http.*
import kotlinx.serialization.json.Json
import org.slf4j.event.Level

fun main(args: Array<String>) {
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}

fun Application.module() {
    // Install plugins
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
            ignoreUnknownKeys = true
        })
    }

    install(CORS) {
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Options)
        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.ContentType)

        // Allow frontend origins
        val frontendUrls = environment.config.propertyOrNull("app.frontendUrls")?.getList()
            ?: listOf("http://localhost:3000", "http://localhost:3001")

        frontendUrls.forEach { url ->
            allowHost(url.removePrefix("http://").removePrefix("https://"), schemes = listOf("http", "https"))
        }

        allowCredentials = true
        maxAgeInSeconds = 3600
    }

    install(Compression) {
        gzip {
            priority = 1.0
        }
        deflate {
            priority = 10.0
            minimumSize(1024)
        }
    }

    install(CallLogging) {
        level = Level.INFO
        filter { call -> call.request.local.uri.startsWith("/") }
    }

    install(StatusPages) {
        exception<Throwable> { call, cause ->
            call.application.environment.log.error("Unhandled exception", cause)
            call.respond(
                HttpStatusCode.InternalServerError,
                mapOf(
                    "error" to "Internal Server Error",
                    "message" to (cause.message ?: "Unknown error"),
                    "timestamp" to System.currentTimeMillis()
                )
            )
        }

        status(HttpStatusCode.NotFound) { call, _ ->
            call.respond(
                HttpStatusCode.NotFound,
                mapOf("error" to "Not Found", "message" to "The requested resource was not found")
            )
        }

        status(HttpStatusCode.Unauthorized) { call, _ ->
            call.respond(
                HttpStatusCode.Unauthorized,
                mapOf("error" to "Unauthorized", "message" to "Authentication required")
            )
        }
    }

    // Configure database
    configureDatabase()

    // Configure JWT authentication
    configureSecurity()

    // Configure routes
    routing {
        // Health check
        get("/health") {
            call.respond(
                mapOf(
                    "status" to "healthy",
                    "timestamp" to System.currentTimeMillis()
                )
            )
        }

        // API routes
        authRoutes()
        projectRoutes()
        publicationRoutes()
        blogPostRoutes()
        uploadRoutes()
        searchRoutes()
    }
}
