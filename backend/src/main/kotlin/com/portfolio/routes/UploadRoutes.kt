package com.portfolio.routes

import com.portfolio.config.userId
import com.portfolio.models.UploadResponse
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.io.File
import java.util.UUID

fun Route.uploadRoutes() {
    route("/upload") {
        authenticate("auth-jwt") {
            post {
                val userId = call.userId
                    ?: return@post call.respond(HttpStatusCode.Unauthorized)

                val multipart = call.receiveMultipart()
                var uploadResponse: UploadResponse? = null

                try {
                    multipart.forEachPart { part ->
                        when (part) {
                            is PartData.FileItem -> {
                                val fileName = part.originalFileName ?: UUID.randomUUID().toString()
                                val mimeType = part.contentType?.toString() ?: "application/octet-stream"
                                val fileBytes = part.streamProvider().readBytes()

                                // Validate file size (max 100MB)
                                if (fileBytes.size > 100 * 1024 * 1024) {
                                    throw IllegalArgumentException("File too large. Max size is 100MB")
                                }

                                // Validate MIME type
                                val allowedTypes = listOf(
                                    "image/jpeg", "image/png", "image/webp", "image/gif",
                                    "application/pdf",
                                    "video/mp4", "video/webm"
                                )

                                if (mimeType !in allowedTypes) {
                                    throw IllegalArgumentException("File type not allowed: $mimeType")
                                }

                                // Generate storage path
                                val extension = fileName.substringAfterLast(".", "")
                                val storagePath = "uploads/${java.time.LocalDate.now()}/${UUID.randomUUID()}.$extension"

                                // TODO: Upload to Supabase Storage
                                // For now, just return a mock response
                                // In production, use Supabase Storage client:
                                // val supabaseUrl = call.application.environment.config.property("supabase.url").getString()
                                // val supabaseKey = call.application.environment.config.property("supabase.key").getString()
                                // val bucket = call.application.environment.config.property("supabase.storageBucket").getString()
                                // Upload file using Supabase Storage API

                                val publicUrl = "https://placeholder.supabase.co/storage/v1/object/public/portfolio-files/$storagePath"

                                uploadResponse = UploadResponse(
                                    id = UUID.randomUUID().toString(),
                                    url = publicUrl,
                                    storagePath = storagePath,
                                    mimeType = mimeType,
                                    sizeBytes = fileBytes.size.toLong()
                                )
                            }
                            else -> {}
                        }
                        part.dispose()
                    }

                    if (uploadResponse != null) {
                        call.respond(HttpStatusCode.Created, uploadResponse!!)
                    } else {
                        call.respond(HttpStatusCode.BadRequest, mapOf("error" to "No file uploaded"))
                    }
                } catch (e: IllegalArgumentException) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to e.message))
                } catch (e: Exception) {
                    call.application.environment.log.error("Upload failed", e)
                    call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "Upload failed"))
                }
            }

            delete("/{fileId}") {
                val userId = call.userId
                    ?: return@delete call.respond(HttpStatusCode.Unauthorized)

                val fileId = call.parameters["fileId"]
                    ?: return@delete call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Missing file ID"))

                // TODO: Delete from Supabase Storage
                // For now, just return success
                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}
