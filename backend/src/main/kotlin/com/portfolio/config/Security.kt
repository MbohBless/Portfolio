package com.portfolio.config

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.response.*

fun Application.configureSecurity() {
    val jwtSecret = environment.config.property("supabase.jwtSecret").getString()
    val supabaseUrl = environment.config.property("supabase.url").getString()

    authentication {
        jwt("auth-jwt") {
            // Supabase uses HS256 signing
            verifier(
                JWT
                    .require(Algorithm.HMAC256(jwtSecret))
                    .withIssuer(supabaseUrl)
                    .build()
            )

            validate { credential ->
                // Validate JWT payload
                val userId = credential.payload.getClaim("sub").asString()
                val email = credential.payload.getClaim("email").asString()
                val role = credential.payload.getClaim("role").asString()

                if (userId != null && email != null) {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            }

            challenge { _, _ ->
                call.respond(
                    HttpStatusCode.Unauthorized,
                    mapOf(
                        "error" to "Unauthorized",
                        "message" to "Invalid or expired token"
                    )
                )
            }
        }
    }
}

// Extension to get user ID from JWT
val ApplicationCall.userId: String?
    get() = principal<JWTPrincipal>()?.payload?.getClaim("sub")?.asString()

val ApplicationCall.userEmail: String?
    get() = principal<JWTPrincipal>()?.payload?.getClaim("email")?.asString()

val ApplicationCall.userRole: String?
    get() = principal<JWTPrincipal>()?.payload?.getClaim("role")?.asString()
