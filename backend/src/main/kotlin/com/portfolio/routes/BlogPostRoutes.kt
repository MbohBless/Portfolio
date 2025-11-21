package com.portfolio.routes

import com.portfolio.config.userId
import com.portfolio.models.CreateBlogPostRequest
import com.portfolio.models.PaginatedResponse
import com.portfolio.models.UpdateBlogPostRequest
import com.portfolio.repositories.BlogPostRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.util.UUID
import kotlin.math.ceil

fun Route.blogPostRoutes() {
    val repository = BlogPostRepository()

    route("/blog-posts") {
        // Public: List published blog posts with pagination
        get {
            val publishedOnly = call.request.queryParameters["published"]?.toBoolean() ?: true
            val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 1
            val pageSize = call.request.queryParameters["pageSize"]?.toIntOrNull()?.coerceIn(1, 100) ?: 20

            val offset = ((page - 1) * pageSize).toLong()
            val posts = repository.findAll(publishedOnly, pageSize, offset)
            val totalCount = repository.count(publishedOnly)
            val totalPages = ceil(totalCount.toDouble() / pageSize).toInt()

            call.respond(
                PaginatedResponse(
                    data = posts,
                    page = page,
                    pageSize = pageSize,
                    totalCount = totalCount.toInt(),
                    totalPages = totalPages
                )
            )
        }

        // Public: Get single blog post by slug or ID
        get("/{identifier}") {
            val identifier = call.parameters["identifier"] ?: return@get call.respond(
                HttpStatusCode.BadRequest,
                mapOf("error" to "Missing identifier")
            )

            val post = try {
                repository.findById(UUID.fromString(identifier))
            } catch (e: IllegalArgumentException) {
                repository.findBySlug(identifier)
            }

            if (post != null) {
                // Increment view count
                try {
                    repository.incrementViews(UUID.fromString(post.id))
                } catch (e: Exception) {
                    // Log but don't fail the request
                    call.application.environment.log.warn("Failed to increment views", e)
                }

                call.respond(post)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Blog post not found"))
            }
        }

        // Admin routes
        authenticate("auth-jwt") {
            post {
                if (call.userId == null) {
                    return@post call.respond(HttpStatusCode.Unauthorized)
                }

                val request = call.receive<CreateBlogPostRequest>()
                val post = repository.create(request)
                call.respond(HttpStatusCode.Created, post)
            }

            put("/{id}") {
                if (call.userId == null) {
                    return@put call.respond(HttpStatusCode.Unauthorized)
                }

                val id = call.parameters["id"]?.let { UUID.fromString(it) }
                    ?: return@put call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID"))

                val request = call.receive<UpdateBlogPostRequest>()
                val updated = repository.update(id, request)

                if (updated != null) {
                    call.respond(updated)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Blog post not found"))
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
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Blog post not found"))
                }
            }
        }
    }
}
