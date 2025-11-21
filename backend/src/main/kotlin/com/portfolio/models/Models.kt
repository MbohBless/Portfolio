package com.portfolio.models

import kotlinx.serialization.Serializable
import java.time.LocalDateTime
import java.util.UUID

// DTOs (Data Transfer Objects) for API
@Serializable
data class ProjectDTO(
    val id: String? = null,
    val title: String,
    val slug: String,
    val description: String? = null,
    val techStack: List<String> = emptyList(),
    val githubUrl: String? = null,
    val demoUrl: String? = null,
    val thumbnailUrl: String? = null,
    val images: List<String> = emptyList(),
    val published: Boolean = false,
    val displayOrder: Int = 0,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

@Serializable
data class PublicationDTO(
    val id: String? = null,
    val title: String,
    val slug: String,
    val authors: List<String>,
    val year: Int,
    val venue: String? = null,
    val doi: String? = null,
    val arxivId: String? = null,
    val pdfUrl: String? = null,
    val abstract: String? = null,
    val tags: List<String> = emptyList(),
    val published: Boolean = false,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

@Serializable
data class BlogPostDTO(
    val id: String? = null,
    val title: String,
    val slug: String,
    val excerpt: String? = null,
    val contentUrl: String? = null,
    val coverImageUrl: String? = null,
    val tags: List<String> = emptyList(),
    val published: Boolean = false,
    val publishedAt: String? = null,
    val readingTime: Int = 0,
    val views: Int = 0,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

@Serializable
data class MediaFileDTO(
    val id: String? = null,
    val originalName: String,
    val storagePath: String,
    val url: String,
    val mimeType: String,
    val sizeBytes: Long,
    val uploadedBy: String? = null,
    val metadata: Map<String, String> = emptyMap(),
    val createdAt: String? = null
)

@Serializable
data class UserDTO(
    val id: String,
    val email: String,
    val name: String? = null,
    val avatarUrl: String? = null,
    val role: String = "admin"
)

@Serializable
data class LoginRequest(
    val email: String,
    val password: String
)

@Serializable
data class LoginResponse(
    val accessToken: String,
    val refreshToken: String,
    val user: UserDTO
)

@Serializable
data class SearchResult(
    val id: String,
    val title: String,
    val excerpt: String,
    val type: String, // 'project', 'publication', 'blog'
    val slug: String,
    val rank: Float
)

@Serializable
data class SearchResponse(
    val results: List<SearchResult>,
    val query: String,
    val totalResults: Int
)

@Serializable
data class PaginatedResponse<T>(
    val data: List<T>,
    val page: Int,
    val pageSize: Int,
    val totalCount: Int,
    val totalPages: Int
)

@Serializable
data class ErrorResponse(
    val error: String,
    val message: String,
    val timestamp: Long = System.currentTimeMillis()
)

@Serializable
data class SuccessResponse(
    val message: String,
    val data: String? = null
)

// Request DTOs for creating/updating
@Serializable
data class CreateProjectRequest(
    val title: String,
    val slug: String,
    val description: String? = null,
    val techStack: List<String> = emptyList(),
    val githubUrl: String? = null,
    val demoUrl: String? = null,
    val thumbnailUrl: String? = null,
    val images: List<String> = emptyList(),
    val published: Boolean = false,
    val displayOrder: Int = 0
)

@Serializable
data class UpdateProjectRequest(
    val title: String? = null,
    val slug: String? = null,
    val description: String? = null,
    val techStack: List<String>? = null,
    val githubUrl: String? = null,
    val demoUrl: String? = null,
    val thumbnailUrl: String? = null,
    val images: List<String>? = null,
    val published: Boolean? = null,
    val displayOrder: Int? = null
)

@Serializable
data class CreatePublicationRequest(
    val title: String,
    val slug: String,
    val authors: List<String>,
    val year: Int,
    val venue: String? = null,
    val doi: String? = null,
    val arxivId: String? = null,
    val pdfUrl: String? = null,
    val abstract: String? = null,
    val tags: List<String> = emptyList(),
    val published: Boolean = false
)

@Serializable
data class UpdatePublicationRequest(
    val title: String? = null,
    val slug: String? = null,
    val authors: List<String>? = null,
    val year: Int? = null,
    val venue: String? = null,
    val doi: String? = null,
    val arxivId: String? = null,
    val pdfUrl: String? = null,
    val abstract: String? = null,
    val tags: List<String>? = null,
    val published: Boolean? = null
)

@Serializable
data class CreateBlogPostRequest(
    val title: String,
    val slug: String,
    val excerpt: String? = null,
    val contentUrl: String? = null,
    val coverImageUrl: String? = null,
    val tags: List<String> = emptyList(),
    val published: Boolean = false,
    val readingTime: Int = 0
)

@Serializable
data class UpdateBlogPostRequest(
    val title: String? = null,
    val slug: String? = null,
    val excerpt: String? = null,
    val contentUrl: String? = null,
    val coverImageUrl: String? = null,
    val tags: List<String>? = null,
    val published: Boolean? = null,
    val readingTime: Int? = null
)

@Serializable
data class UploadResponse(
    val id: String,
    val url: String,
    val storagePath: String,
    val mimeType: String,
    val sizeBytes: Long
)
