FROM gradle:8.5-jdk17 AS build

WORKDIR /app

# Copy gradle files first for dependency caching
COPY build.gradle.kts settings.gradle.kts gradle.properties ./
COPY gradle ./gradle

# Download dependencies
RUN gradle dependencies --no-daemon

# Copy source code
COPY src ./src
COPY resources ./resources

# Build fat JAR
RUN gradle buildFatJar --no-daemon

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy built JAR from build stage
COPY --from=build /app/build/libs/portfolio-backend.jar ./app.jar

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

ENTRYPOINT ["java", "-server", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
