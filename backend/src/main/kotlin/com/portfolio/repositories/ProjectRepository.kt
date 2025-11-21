package com.portfolio.repositories

import com.portfolio.models.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.Instant
import java.util.UUID

class ProjectRepository {
    fun findAll(publishedOnly: Boolean = false): List<ProjectDTO> = transaction {
        val query = if (publishedOnly) {
            Projects.select { Projects.published eq true }
        } else {
            Projects.selectAll()
        }

        query.orderBy(Projects.displayOrder to SortOrder.ASC)
            .map { it.toProjectDTO() }
    }

    fun findById(id: UUID): ProjectDTO? = transaction {
        Projects.select { Projects.id eq id }
            .map { it.toProjectDTO() }
            .singleOrNull()
    }

    fun findBySlug(slug: String): ProjectDTO? = transaction {
        Projects.select { Projects.slug eq slug }
            .map { it.toProjectDTO() }
            .singleOrNull()
    }

    fun create(request: CreateProjectRequest): ProjectDTO = transaction {
        val id = Projects.insertAndGetId {
            it[title] = request.title
            it[slug] = request.slug
            it[description] = request.description
            it[techStack] = request.techStack
            it[githubUrl] = request.githubUrl
            it[demoUrl] = request.demoUrl
            it[thumbnailUrl] = request.thumbnailUrl
            it[images] = request.images
            it[published] = request.published
            it[displayOrder] = request.displayOrder
            it[createdAt] = Instant.now()
            it[updatedAt] = Instant.now()
        }

        findById(id.value)!!
    }

    fun update(id: UUID, request: UpdateProjectRequest): ProjectDTO? = transaction {
        val updateCount = Projects.update({ Projects.id eq id }) {
            request.title?.let { title -> it[Projects.title] = title }
            request.slug?.let { slug -> it[Projects.slug] = slug }
            request.description?.let { desc -> it[description] = desc }
            request.techStack?.let { stack -> it[techStack] = stack }
            request.githubUrl?.let { url -> it[githubUrl] = url }
            request.demoUrl?.let { url -> it[demoUrl] = url }
            request.thumbnailUrl?.let { url -> it[thumbnailUrl] = url }
            request.images?.let { imgs -> it[images] = imgs }
            request.published?.let { pub -> it[published] = pub }
            request.displayOrder?.let { order -> it[displayOrder] = order }
            it[updatedAt] = Instant.now()
        }

        if (updateCount > 0) findById(id) else null
    }

    fun delete(id: UUID): Boolean = transaction {
        Projects.deleteWhere { Projects.id eq id } > 0
    }

    private fun ResultRow.toProjectDTO() = ProjectDTO(
        id = this[Projects.id].value.toString(),
        title = this[Projects.title],
        slug = this[Projects.slug],
        description = this[Projects.description],
        techStack = this[Projects.techStack].toList(),
        githubUrl = this[Projects.githubUrl],
        demoUrl = this[Projects.demoUrl],
        thumbnailUrl = this[Projects.thumbnailUrl],
        images = this[Projects.images].toList(),
        published = this[Projects.published],
        displayOrder = this[Projects.displayOrder],
        createdAt = this[Projects.createdAt].toString(),
        updatedAt = this[Projects.updatedAt].toString()
    )
}
