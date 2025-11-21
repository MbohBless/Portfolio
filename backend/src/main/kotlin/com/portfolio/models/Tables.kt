package com.portfolio.models

import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.javatime.timestamp

object Users : UUIDTable("users") {
    val email = text("email").uniqueIndex()
    val name = text("name").nullable()
    val avatarUrl = text("avatar_url").nullable()
    val role = text("role").default("admin")
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
}

object Projects : UUIDTable("projects") {
    val title = text("title")
    val slug = text("slug").uniqueIndex()
    val description = text("description").nullable()
    val techStack = array<String>("tech_stack")
    val githubUrl = text("github_url").nullable()
    val demoUrl = text("demo_url").nullable()
    val thumbnailUrl = text("thumbnail_url").nullable()
    val images = array<String>("images")
    val published = bool("published").default(false)
    val displayOrder = integer("display_order").default(0)
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
}

object Publications : UUIDTable("publications") {
    val title = text("title")
    val slug = text("slug").uniqueIndex()
    val authors = array<String>("authors")
    val year = integer("year")
    val venue = text("venue").nullable()
    val doi = text("doi").nullable()
    val arxivId = text("arxiv_id").nullable()
    val pdfUrl = text("pdf_url").nullable()
    val abstract = text("abstract").nullable()
    val tags = array<String>("tags")
    val published = bool("published").default(false)
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
}

object BlogPosts : UUIDTable("blog_posts") {
    val title = text("title")
    val slug = text("slug").uniqueIndex()
    val excerpt = text("excerpt").nullable()
    val contentUrl = text("content_url").nullable()
    val coverImageUrl = text("cover_image_url").nullable()
    val tags = array<String>("tags")
    val published = bool("published").default(false)
    val publishedAt = timestamp("published_at").nullable()
    val readingTime = integer("reading_time").default(0)
    val views = integer("views").default(0)
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
}

object MediaFiles : UUIDTable("media_files") {
    val originalName = text("original_name")
    val storagePath = text("storage_path")
    val url = text("url")
    val mimeType = text("mime_type")
    val sizeBytes = long("size_bytes")
    val uploadedBy = reference("uploaded_by", Users, onDelete = ReferenceOption.SET_NULL).nullable()
    val metadata = text("metadata").default("{}")
    val createdAt = timestamp("created_at")
}
