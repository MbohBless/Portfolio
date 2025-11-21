package com.portfolio.routes

import com.portfolio.config.userId
import com.portfolio.models.CreatePublicationRequest
import com.portfolio.models.UpdatePublicationRequest
import com.portfolio.repositories.PublicationRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.util.UUID

fun Route.publicationRoutes() {
    val repository = PublicationRepository()

    route("/publications") {
        // Public: List all published publications
        get {
            val publishedOnly = call.request.queryParameters["published"]?.toBoolean() ?: true
            val publications = repository.findAll(publishedOnly)
            call.respond(publications)
        }

        // Public: Get single publication by ID or slug
        get("/{identifier}") {
            val identifier = call.parameters["identifier"] ?: return@get call.respond(
                HttpStatusCode.BadRequest,
                mapOf("error" to "Missing identifier")
            )

            val publication = try {
                repository.findById(UUID.fromString(identifier))
            } catch (e: IllegalArgumentException) {
                repository.findBySlug(identifier)
            }

            if (publication != null) {
                call.respond(publication)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Publication not found"))
            }
        }

        // Admin routes
        authenticate("auth-jwt") {
            post {
                if (call.userId == null) {
                    return@post call.respond(HttpStatusCode.Unauthorized)
                }

                val request = call.receive<CreatePublicationRequest>()
                val publication = repository.create(request)
                call.respond(HttpStatusCode.Created, publication)
            }

            put("/{id}") {
                if (call.userId == null) {
                    return@put call.respond(HttpStatusCode.Unauthorized)
                }

                val id = call.parameters["id"]?.let { UUID.fromString(it) }
                    ?: return@put call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID"))

                val request = call.receive<UpdatePublicationRequest>()
                val updated = repository.update(id, request)

                if (updated != null) {
                    call.respond(updated)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Publication not found"))
                }
            }

            delete("/{id}") {
                if (call.userId == null) {
                    return@delete call.respond(HttpStatusCode.Unauthorized)
                }

                val id = call.parameters["id"]?.let { UUID.fromString(it) }
                    ?: return@delete call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID"))

                val deleted = repository.delete(id)
                if (deleted) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Publication not found"))
                }
            }
        }
    }
}
