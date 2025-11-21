package com.portfolio.routes

import com.portfolio.models.LoginRequest
import com.portfolio.models.LoginResponse
import com.portfolio.models.UserDTO
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive

fun Route.authRoutes() {
    route("/auth") {
        post("/login") {
            val request = call.receive<LoginRequest>()
            val supabaseUrl = call.application.environment.config.property("supabase.url").getString()
            val supabaseKey = call.application.environment.config.property("supabase.key").getString()

            try {
                val client = HttpClient()
                val response: HttpResponse = client.post("$supabaseUrl/auth/v1/token?grant_type=password") {
                    headers {
                        append("apikey", supabaseKey)
                        append("Content-Type", "application/json")
                    }
                    setBody("""{"email":"${request.email}","password":"${request.password}"}""")
                }

                if (response.status.isSuccess()) {
                    val body = response.bodyAsText()
                    val jsonResponse = Json.parseToJsonElement(body).jsonObject

                    val accessToken = jsonResponse["access_token"]?.jsonPrimitive?.content
                    val refreshToken = jsonResponse["refresh_token"]?.jsonPrimitive?.content
                    val user = jsonResponse["user"]?.jsonObject

                    if (accessToken != null && refreshToken != null && user != null) {
                        call.respond(
                            LoginResponse(
                                accessToken = accessToken,
                                refreshToken = refreshToken,
                                user = UserDTO(
                                    id = user["id"]?.jsonPrimitive?.content ?: "",
                                    email = user["email"]?.jsonPrimitive?.content ?: "",
                                    name = user["user_metadata"]?.jsonObject?.get("name")?.jsonPrimitive?.content,
                                    avatarUrl = user["user_metadata"]?.jsonObject?.get("avatar_url")?.jsonPrimitive?.content,
                                    role = user["role"]?.jsonPrimitive?.content ?: "admin"
                                )
                            )
                        )
                    } else {
                        call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "Invalid credentials"))
                    }
                } else {
                    call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "Invalid credentials"))
                }

                client.close()
            } catch (e: Exception) {
                call.application.environment.log.error("Login failed", e)
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "Login failed"))
            }
        }

        post("/refresh") {
            // Implement token refresh logic using Supabase
            // Similar to login but using refresh_token grant type
            call.respond(HttpStatusCode.NotImplemented, mapOf("message" to "Refresh endpoint not yet implemented"))
        }
    }
}
