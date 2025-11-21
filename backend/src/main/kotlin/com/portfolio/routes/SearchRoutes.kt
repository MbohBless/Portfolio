package com.portfolio.routes

import com.portfolio.models.SearchResponse
import com.portfolio.repositories.SearchRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.searchRoutes() {
    val repository = SearchRepository()

    route("/search") {
        get {
            val query = call.request.queryParameters["q"]
                ?: return@get call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "Missing query parameter 'q'")
                )

            if (query.isBlank() || query.length < 2) {
                return@get call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "Query must be at least 2 characters")
                )
            }

            val maxResults = call.request.queryParameters["limit"]?.toIntOrNull()?.coerceIn(1, 100) ?: 20

            try {
                val results = repository.search(query, maxResults)
                call.respond(
                    SearchResponse(
                        results = results,
                        query = query,
                        totalResults = results.size
                    )
                )
            } catch (e: Exception) {
                call.application.environment.log.error("Search failed", e)
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Search failed", "message" to e.message)
                )
            }
        }
    }
}
