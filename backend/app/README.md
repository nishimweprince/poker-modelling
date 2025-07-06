# Backend App Module

This directory contains the core FastAPI application code for the Texas Hold'em poker backend.

## Structure

- `main.py` - FastAPI application entry point with CORS and route registration
- `models/` - Domain models (Hand, Player, GameAction) using dataclasses
- `repositories/` - Data access layer with raw SQL queries and repository pattern
- `routes/` - API endpoint definitions and request/response handling
- `services/` - Business logic, game rules, and pokerkit integration
- `database/` - Database connection management and pooling

## Key Features

- **Raw SQL**: Direct PostgreSQL queries without ORM for performance
- **Repository Pattern**: Clean separation of data access and business logic
- **Domain Models**: Type-safe dataclasses for game entities
- **Async Operations**: Non-blocking database and API operations
- **pokerkit Integration**: Accurate poker hand evaluation and winner determination

For detailed documentation, see the [Backend README](../README.md).   