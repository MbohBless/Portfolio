# Portfolio Development Makefile

.PHONY: help setup start stop logs clean migrate frontend backend test

help: ## Show this help message
	@echo "Portfolio Development Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Initial setup (copy env files, install dependencies)
	@echo "Setting up environment files..."
	cp -n .env.example .env || true
	cp -n frontend/.env.local.example frontend/.env.local || true
	cp -n backend/.env.example backend/.env || true
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Setup complete! Edit .env files with your credentials."

start: ## Start all services (database, backend, frontend)
	@echo "Starting PostgreSQL..."
	docker-compose up -d postgres
	@echo "Waiting for database..."
	sleep 3
	@echo "Start backend with: cd backend && ./gradlew run"
	@echo "Start frontend with: cd frontend && npm run dev"

stop: ## Stop all services
	docker-compose down

logs: ## View service logs
	docker-compose logs -f

clean: ## Clean build artifacts
	rm -rf frontend/.next frontend/node_modules
	rm -rf backend/build backend/.gradle

migrate: ## Run database migrations
	@echo "Running migrations..."
	@for file in migrations/*.sql; do \
		echo "Running $$file..."; \
		psql -h localhost -U postgres -d portfolio -f "$$file"; \
	done

frontend: ## Start frontend development server
	cd frontend && npm run dev

backend: ## Start backend development server
	cd backend && ./gradlew run

test: ## Run all tests
	@echo "Running backend tests..."
	cd backend && ./gradlew test
	@echo "Running frontend tests..."
	cd frontend && npm run type-check && npm run lint

build: ## Build both frontend and backend
	@echo "Building backend..."
	cd backend && ./gradlew buildFatJar
	@echo "Building frontend..."
	cd frontend && npm run build

docker-backend: ## Build backend Docker image
	docker build -t portfolio-backend ./backend

docker-run: ## Run backend in Docker
	docker run -p 8080:8080 --env-file backend/.env portfolio-backend
