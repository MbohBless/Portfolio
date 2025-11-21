package com.portfolio.routes

import com.portfolio.config.userId
import com.portfolio.models.CreateProjectRequest
import com.portfolio.models.UpdateProjectRequest
import com.portfolio.repositories.ProjectRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.util.UUID

fun Route.projectRoutes() {
    val repository = ProjectRepository()

    route("/projects") {
        // Public: List all published projects
        get {
            val publishedOnly = call.request.queryParameters["published"]?.toBoolean() ?: true
            val projects = repository.findAll(publishedOnly)
            call.respond(projects)
        }

        // Public: Get single project by ID or slug
        get("/{identifier}") {
            val identifier = call.parameters["identifier"] ?: return@get call.respond(
                HttpStatusCode.BadRequest,
                mapOf("error" to "Missing identifier")
            )

            val project = try {
                // Try UUID first
                repository.findById(UUID.fromString(identifier))
            } catch (e: IllegalArgumentException) {
                // If not UUID, try slug
                repository.findBySlug(identifier)
            }

            if (project != null) {
                call.respond(project)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Project not found"))
            }
        }

        // Admin routes (require authentication)
        authenticate("auth-jwt") {
            post {
                if (call.userId == null) {
                    return@post call.respond(HttpStatusCode.Unauthorized)
                }

                val request = call.receive<CreateProjectRequest>()
                val project = repository.create(request)
                call.respond(HttpStatusCode.Created, project)
            }

            put("/{id}") {
                if (call.userId == null) {
                    return@put call.respond(HttpStatusCode.Unauthorized)
                }

                val id = call.parameters["id"]?.let { UUID.fromString(it) }
                    ?: return@put call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID"))

                val request = call.receive<UpdateProjectRequest>()
                val updated = repository.update(id, request)

                if (updated != null) {
                    call.respond(updated)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Project not found"))
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
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Project not found"))
                }
            }
        }
    }
}
