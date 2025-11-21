# Portfolio Development Makefile

.PHONY: help setup start stop logs clean migrate dev test build

help: ## Show this help message
	@echo "Portfolio Development Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Initial setup (copy env files, install dependencies)
	@echo "Setting up environment files..."
	cp -n frontend/.env.local.example frontend/.env.local || true
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Setup complete! Edit frontend/.env.local with your credentials."

start: ## Start PostgreSQL database
	@echo "Starting PostgreSQL..."
	docker-compose up -d postgres
	@echo "Waiting for database..."
	sleep 3
	@echo "Database ready at localhost:5432"
	@echo ""
	@echo "Next steps:"
	@echo "  1. cd frontend"
	@echo "  2. npm run db:push     (create tables)"
	@echo "  3. npm run dev         (start dev server)"

stop: ## Stop all services
	docker-compose down

logs: ## View database logs
	docker-compose logs -f postgres

clean: ## Clean build artifacts
	rm -rf frontend/.next frontend/node_modules
	rm -rf frontend/.prisma

db-init: ## Initialize database with Prisma
	@echo "Pushing Prisma schema to database..."
	cd frontend && npm run db:push
	@echo "Database initialized!"

db-studio: ## Open Prisma Studio (database GUI)
	cd frontend && npm run db:studio

db-migrate: ## Create a new Prisma migration
	cd frontend && npm run db:migrate

dev: ## Start frontend development server
	cd frontend && npm run dev

test: ## Run all tests and checks
	@echo "Running type checks..."
	cd frontend && npm run type-check
	@echo "Running linter..."
	cd frontend && npm run lint
	@echo "All checks passed!"

build: ## Build frontend for production
	@echo "Building frontend..."
	cd frontend && npm run build

install: ## Install all dependencies
	cd frontend && npm install
