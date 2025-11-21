package com.portfolio.config

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.server.application.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.DatabaseConfig
import javax.sql.DataSource

object DatabaseFactory {
    private var dataSource: DataSource? = null

    fun init(config: ApplicationConfig) {
        val dbUrl = config.property("database.url").getString()
        val driver = config.property("database.driver").getString()
        val maxPoolSize = config.propertyOrNull("database.maxPoolSize")?.getString()?.toInt() ?: 10

        dataSource = createHikariDataSource(dbUrl, driver, maxPoolSize)
        Database.connect(
            datasource = dataSource!!,
            databaseConfig = DatabaseConfig {
                useNestedTransactions = true
            }
        )
    }

    private fun createHikariDataSource(url: String, driver: String, maxPoolSize: Int): HikariDataSource {
        val hikariConfig = HikariConfig().apply {
            jdbcUrl = url
            driverClassName = driver
            maximumPoolSize = maxPoolSize
            isAutoCommit = false
            transactionIsolation = "TRANSACTION_READ_COMMITTED"
            validate()
        }
        return HikariDataSource(hikariConfig)
    }

    fun close() {
        (dataSource as? HikariDataSource)?.close()
    }
}

fun Application.configureDatabase() {
    DatabaseFactory.init(environment.config)

    environment.monitor.subscribe(ApplicationStopped) {
        DatabaseFactory.close()
    }
}
