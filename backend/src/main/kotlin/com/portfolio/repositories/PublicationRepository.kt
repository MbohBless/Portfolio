package com.portfolio.repositories

import com.portfolio.models.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.Instant
import java.util.UUID

class PublicationRepository {
    fun findAll(publishedOnly: Boolean = false): List<PublicationDTO> = transaction {
        val query = if (publishedOnly) {
            Publications.select { Publications.published eq true }
        } else {
            Publications.selectAll()
        }

        query.orderBy(Publications.year to SortOrder.DESC)
            .map { it.toPublicationDTO() }
    }

    fun findById(id: UUID): PublicationDTO? = transaction {
        Publications.select { Publications.id eq id }
            .map { it.toPublicationDTO() }
            .singleOrNull()
    }

    fun findBySlug(slug: String): PublicationDTO? = transaction {
        Publications.select { Publications.slug eq slug }
            .map { it.toPublicationDTO() }
            .singleOrNull()
    }

    fun create(request: CreatePublicationRequest): PublicationDTO = transaction {
        val id = Publications.insertAndGetId {
            it[title] = request.title
            it[slug] = request.slug
            it[authors] = request.authors
            it[year] = request.year
            it[venue] = request.venue
            it[doi] = request.doi
            it[arxivId] = request.arxivId
            it[pdfUrl] = request.pdfUrl
            it[abstract] = request.abstract
            it[tags] = request.tags
            it[published] = request.published
            it[createdAt] = Instant.now()
            it[updatedAt] = Instant.now()
        }

        findById(id.value)!!
    }

    fun update(id: UUID, request: UpdatePublicationRequest): PublicationDTO? = transaction {
        val updateCount = Publications.update({ Publications.id eq id }) {
            request.title?.let { title -> it[Publications.title] = title }
            request.slug?.let { slug -> it[Publications.slug] = slug }
            request.authors?.let { auths -> it[authors] = auths }
            request.year?.let { y -> it[year] = y }
            request.venue?.let { v -> it[venue] = v }
            request.doi?.let { d -> it[doi] = d }
            request.arxivId?.let { a -> it[arxivId] = a }
            request.pdfUrl?.let { url -> it[pdfUrl] = url }
            request.abstract?.let { abs -> it[abstract] = abs }
            request.tags?.let { t -> it[tags] = t }
            request.published?.let { pub -> it[published] = pub }
            it[updatedAt] = Instant.now()
        }

        if (updateCount > 0) findById(id) else null
    }

    fun delete(id: UUID): Boolean = transaction {
        Publications.deleteWhere { Publications.id eq id } > 0
    }

    private fun ResultRow.toPublicationDTO() = PublicationDTO(
        id = this[Publications.id].value.toString(),
        title = this[Publications.title],
        slug = this[Publications.slug],
        authors = this[Publications.authors].toList(),
        year = this[Publications.year],
        venue = this[Publications.venue],
        doi = this[Publications.doi],
        arxivId = this[Publications.arxivId],
        pdfUrl = this[Publications.pdfUrl],
        abstract = this[Publications.abstract],
        tags = this[Publications.tags].toList(),
        published = this[Publications.published],
        createdAt = this[Publications.createdAt].toString(),
        updatedAt = this[Publications.updatedAt].toString()
    )
}
