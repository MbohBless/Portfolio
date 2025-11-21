package com.portfolio.repositories

import com.portfolio.models.SearchResult
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.statements.api.ExposedBlob
import java.sql.ResultSet

class SearchRepository {
    fun search(query: String, maxResults: Int = 20): List<SearchResult> = transaction {
        val sql = """
            SELECT * FROM search_all(?, ?)
        """.trimIndent()

        val results = mutableListOf<SearchResult>()

        exec(sql, listOf(query, maxResults)) { resultSet ->
            while (resultSet.next()) {
                results.add(
                    SearchResult(
                        id = resultSet.getString("id"),
                        title = resultSet.getString("title"),
                        excerpt = resultSet.getString("excerpt") ?: "",
                        type = resultSet.getString("type"),
                        slug = resultSet.getString("slug"),
                        rank = resultSet.getFloat("rank")
                    )
                )
            }
        }

        results
    }
}
