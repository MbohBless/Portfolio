package com.portfolio.repositories

import com.portfolio.models.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.Instant
import java.util.UUID

class BlogPostRepository {
    fun findAll(publishedOnly: Boolean = false, limit: Int = 50, offset: Long = 0): List<BlogPostDTO> = transaction {
        val query = if (publishedOnly) {
            BlogPosts.select { BlogPosts.published eq true }
        } else {
            BlogPosts.selectAll()
        }

        query.orderBy(BlogPosts.publishedAt to SortOrder.DESC)
            .limit(limit, offset)
            .map { it.toBlogPostDTO() }
    }

    fun count(publishedOnly: Boolean = false): Long = transaction {
        if (publishedOnly) {
            BlogPosts.select { BlogPosts.published eq true }.count()
        } else {
            BlogPosts.selectAll().count()
        }
    }

    fun findById(id: UUID): BlogPostDTO? = transaction {
        BlogPosts.select { BlogPosts.id eq id }
            .map { it.toBlogPostDTO() }
            .singleOrNull()
    }

    fun findBySlug(slug: String): BlogPostDTO? = transaction {
        BlogPosts.select { BlogPosts.slug eq slug }
            .map { it.toBlogPostDTO() }
            .singleOrNull()
    }

    fun incrementViews(id: UUID) = transaction {
        BlogPosts.update({ BlogPosts.id eq id }) {
            it[views] = views + 1
        }
    }

    fun create(request: CreateBlogPostRequest): BlogPostDTO = transaction {
        val id = BlogPosts.insertAndGetId {
            it[title] = request.title
            it[slug] = request.slug
            it[excerpt] = request.excerpt
            it[contentUrl] = request.contentUrl
            it[coverImageUrl] = request.coverImageUrl
            it[tags] = request.tags
            it[published] = request.published
            it[publishedAt] = if (request.published) Instant.now() else null
            it[readingTime] = request.readingTime
            it[views] = 0
            it[createdAt] = Instant.now()
            it[updatedAt] = Instant.now()
        }

        findById(id.value)!!
    }

    fun update(id: UUID, request: UpdateBlogPostRequest): BlogPostDTO? = transaction {
        val current = findById(id)
        val wasUnpublished = current?.published == false
        val nowPublished = request.published == true

        val updateCount = BlogPosts.update({ BlogPosts.id eq id }) {
            request.title?.let { title -> it[BlogPosts.title] = title }
            request.slug?.let { slug -> it[BlogPosts.slug] = slug }
            request.excerpt?.let { exc -> it[excerpt] = exc }
            request.contentUrl?.let { url -> it[contentUrl] = url }
            request.coverImageUrl?.let { url -> it[coverImageUrl] = url }
            request.tags?.let { t -> it[tags] = t }
            request.published?.let { pub -> it[published] = pub }
            request.readingTime?.let { time -> it[readingTime] = time }

            // Set publishedAt only on first publish
            if (wasUnpublished && nowPublished && current?.publishedAt == null) {
                it[publishedAt] = Instant.now()
            }

            it[updatedAt] = Instant.now()
        }

        if (updateCount > 0) findById(id) else null
    }

    fun delete(id: UUID): Boolean = transaction {
        BlogPosts.deleteWhere { BlogPosts.id eq id } > 0
    }

    private fun ResultRow.toBlogPostDTO() = BlogPostDTO(
        id = this[BlogPosts.id].value.toString(),
        title = this[BlogPosts.title],
        slug = this[BlogPosts.slug],
        excerpt = this[BlogPosts.excerpt],
        contentUrl = this[BlogPosts.contentUrl],
        coverImageUrl = this[BlogPosts.coverImageUrl],
        tags = this[BlogPosts.tags].toList(),
        published = this[BlogPosts.published],
        publishedAt = this[BlogPosts.publishedAt]?.toString(),
        readingTime = this[BlogPosts.readingTime],
        views = this[BlogPosts.views],
        createdAt = this[BlogPosts.createdAt].toString(),
        updatedAt = this[BlogPosts.updatedAt].toString()
    )
}
