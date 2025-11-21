# Portfolio Backend

Kotlin + Ktor REST API for portfolio content management.

## Structure

```
backend/
├── src/main/kotlin/com/portfolio/
│   ├── Application.kt          # Main application entry
│   ├── config/
│   │   ├── Database.kt         # Database connection setup
│   │   └── Security.kt         # JWT authentication
│   ├── models/
│   │   ├── Models.kt           # DTOs and request/response types
│   │   └── Tables.kt           # Exposed ORM table definitions
│   ├── repositories/           # Database access layer
│   │   ├── ProjectRepository.kt
│   │   ├── PublicationRepository.kt
│   │   ├── BlogPostRepository.kt
│   │   └── SearchRepository.kt
│   └── routes/                 # HTTP route handlers
│       ├── AuthRoutes.kt
│       ├── ProjectRoutes.kt
│       ├── PublicationRoutes.kt
│       ├── BlogPostRoutes.kt
│       ├── UploadRoutes.kt
│       └── SearchRoutes.kt
├── resources/
│   └── application.conf        # Configuration file
├── build.gradle.kts            # Gradle build configuration
└── Dockerfile                  # Docker image definition
```

## Running

```bash
# Development
./gradlew run

# Production
./gradlew buildFatJar
java -jar build/libs/portfolio-backend.jar
```

## Configuration

Edit `resources/application.conf` or set environment variables:

- `DATABASE_URL`: PostgreSQL JDBC connection string
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase anon key
- `SUPABASE_JWT_SECRET`: JWT signing secret
- `PORT`: Server port (default 8080)

## API Documentation

See parent [ARCHITECTURE.md](../ARCHITECTURE.md) for complete API contracts.
