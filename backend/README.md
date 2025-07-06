# Backend - Texas Hold'em Poker API

FastAPI backend for the Texas Hold'em poker game using raw SQL with PostgreSQL and repository pattern architecture.

## 🚀 Quick Start

### With Docker (Recommended)
```bash
# From project root
docker compose up -d
# API available at http://localhost:8000
# Documentation at http://localhost:8000/docs
```

### Local Development
```bash
cd backend
poetry install
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# Requires PostgreSQL running on localhost:5433
```

## 🏗️ Architecture

### Tech Stack
- **Framework**: FastAPI with Python 3.12
- **Database**: PostgreSQL with raw SQL queries
- **ORM**: None (raw SQL with asyncpg)
- **Game Engine**: pokerkit library for hand evaluation
- **Architecture**: Repository pattern with domain-driven design
- **Validation**: Pydantic models

### Project Structure
```
app/
├── main.py                 # FastAPI application entry point
├── models/
│   └── game.py            # Domain models (Hand, Player, GameAction)
├── repositories/
│   ├── base.py            # Base repository with database connection
│   └── hand_repository.py # Hand data access layer
├── routes/
│   └── hands.py           # API endpoints for hands
├── services/
│   ├── game_service.py    # Business logic and game rules
│   └── poker_engine.py    # pokerkit integration
└── database/
    └── connection.py      # Database connection management
```

## 🎮 API Endpoints

### Hand Management

#### `POST /api/hands`
Create a new poker hand
```json
{
  "player_stacks": [1000, 1000, 1000, 1000, 1000, 1000]
}
```

#### `GET /api/hands`
Get hand history (latest 50 hands)
```json
[
  {
    "id": "uuid",
    "line1": "Hand #1 - 6 players",
    "line2": "Blinds: $10/$20",
    "line3": "Board: AhKsQdJc2s",
    "line4": "Winner: Player 1 ($150)",
    "line5": "Hand: Royal Flush",
    "status": "Completed",
    "created_at": "2025-01-01T12:00:00Z"
  }
]
```

#### `POST /api/hands/action`
Add player action to hand
```json
{
  "hand_id": "uuid",
  "player_position": 0,
  "action_type": "raise",
  "amount": 100
}
```

#### `POST /api/hands/{hand_id}/deal-hole-cards`
Deal private cards to players
```json
{
  "cards_by_position": {
    "0": "AhKs",
    "1": "QdJc",
    "2": "9h8s"
  }
}
```

#### `POST /api/hands/{hand_id}/deal-board-cards`
Deal community cards
```json
{
  "board_cards": "AhKsQdJc2s"
}
```

## 🗄️ Database Schema

### Tables

#### `hands`
```sql
CREATE TABLE hands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    players JSONB NOT NULL,
    actions JSONB DEFAULT '[]',
    board_cards TEXT DEFAULT '',
    pot_size INTEGER DEFAULT 0,
    current_round TEXT DEFAULT 'preflop',
    is_completed BOOLEAN DEFAULT FALSE,
    winner_positions INTEGER[] DEFAULT '{}',
    winnings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Data Models

#### Hand Model
```python
@dataclass
class Hand:
    id: str
    players: List[Player]
    actions: List[GameAction]
    board_cards: str
    pot_size: int
    current_round: str
    is_completed: bool
    winner_positions: List[int]
    winnings: Dict[int, int]
    created_at: datetime
    updated_at: datetime
```

#### Player Model
```python
@dataclass
class Player:
    position: int
    name: str
    stack: int
    current_bet: int
    total_invested: int
    hole_cards: str
    is_folded: bool
    is_dealer: bool
    is_small_blind: bool
    is_big_blind: bool
```

## 🎯 Business Logic

### Game Service (`game_service.py`)

#### Hand Creation
- Validates player stacks
- Sets up blinds (positions 1 and 2)
- Assigns dealer button (position 0)
- Initializes game state

#### Action Processing
- Validates action legality
- Updates player stacks and bets
- Manages pot size
- Checks for hand completion

#### Hand Evaluation
- Uses pokerkit library for accurate poker hand ranking
- Calculates side pots for all-in scenarios
- Determines winners and payouts
- Formats results for display

### Poker Engine (`poker_engine.py`)
- Integration with pokerkit library
- Hand strength evaluation
- Winner determination
- Payout calculation

## 🔄 Repository Pattern

### Base Repository (`base.py`)
```python
class BaseRepository:
    def __init__(self, db_pool):
        self.db_pool = db_pool
    
    async def execute_query(self, query: str, *args):
        # Raw SQL execution with connection pooling
```

### Hand Repository (`hand_repository.py`)
- `create_hand()`: Insert new hand with players
- `get_hand_by_id()`: Retrieve hand with all data
- `update_hand()`: Save hand state changes
- `get_hand_history()`: Fetch completed hands
- `save_hand()`: Upsert hand data

### Raw SQL Benefits
- **Performance**: Direct SQL queries without ORM overhead
- **Control**: Full control over query optimization
- **Transparency**: Clear understanding of database operations
- **Flexibility**: Complex queries without ORM limitations

## 🔧 Configuration

### Environment Variables
```bash
# .env
DATABASE_URL=postgresql://poker_user:poker_pass@localhost:5433/poker_db
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_NAME=poker_db
DATABASE_USER=poker_user
DATABASE_PASSWORD=poker_pass
```

### Database Connection
- Connection pooling with asyncpg
- Automatic reconnection handling
- Query timeout management
- Transaction support

## 🧪 Development

### Dependencies (pyproject.toml)
```toml
[tool.poetry.dependencies]
python = "^3.12"
fastapi = "^0.104.1"
uvicorn = "^0.24.0"
asyncpg = "^0.29.0"
pydantic = "^2.5.0"
pokerkit = "^0.5.0"
python-multipart = "^0.0.6"
```

### Development Commands
```bash
poetry install                    # Install dependencies
poetry run uvicorn app.main:app --reload  # Development server
poetry run python -m pytest      # Run tests
poetry run black .               # Code formatting
poetry run flake8 .              # Linting
```

### Database Setup
```sql
-- Create database and user
CREATE DATABASE poker_db;
CREATE USER poker_user WITH PASSWORD 'poker_pass';
GRANT ALL PRIVILEGES ON DATABASE poker_db TO poker_user;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

## 🔍 API Documentation

### Interactive Docs
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### Response Models
All endpoints return structured JSON with:
- Consistent error handling
- Proper HTTP status codes
- Detailed error messages
- Type-safe response models

## 🚀 Deployment

### Docker Configuration
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN pip install poetry && poetry install --no-dev
COPY . .
EXPOSE 8000
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0"]
```

### Production Considerations
- Database connection pooling
- Environment-based configuration
- Logging and monitoring
- Error tracking
- Performance optimization

## 🔒 Security

### Input Validation
- Pydantic models for request validation
- SQL injection prevention (parameterized queries)
- Type checking and data sanitization

### Error Handling
- Graceful error responses
- No sensitive data in error messages
- Proper HTTP status codes
- Logging for debugging

## 📊 Performance

### Database Optimization
- Indexed UUID primary keys
- JSONB for flexible data storage
- Connection pooling
- Query optimization

### API Performance
- Async/await for non-blocking operations
- Efficient JSON serialization
- Minimal data transfer
- Caching strategies

---

**Back to**: [Main README](../README.md) | **Related**: [Frontend README](../frontend/README.md)   