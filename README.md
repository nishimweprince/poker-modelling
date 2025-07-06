# Texas Hold'em Poker Website

A full-stack simplified Texas Hold'em poker game built with Next.js, FastAPI, and PostgreSQL. Play poker hands with up to 6 players, manage game state with Redux, and view hand history.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Installation & Startup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nishimweprince/poker-modelling.git
   cd poker-modelling
   ```

2. **Start the application:**
   ```bash
   docker compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

The application will automatically:
- Set up PostgreSQL database with required tables
- Start the FastAPI backend server
- Build and serve the Next.js frontend
- Install all dependencies in containers

## 🎮 How to Play Poker

### Game Setup
1. Navigate to the **Game** tab
2. Configure player stacks (default: $1000 each for 6 players)
3. Click **"Start New Hand"** to create a poker hand

### Playing a Hand

#### 1. Deal Hole Cards
- Use the "Deal Hole Cards" section
- Enter cards for each player (format: `AhKs` for Ace of Hearts, King of Spades)
- Click **"Deal Hole Cards"**

#### 2. Player Actions
- Select a player by clicking their seat
- Choose actions:
  - **Fold**: Exit the hand (loses current bet)
  - **Check**: Pass action (only if no bet to call)
  - **Call**: Match the current bet
  - **Raise**: Increase the bet (enter amount)
  - **All-In**: Bet entire stack

#### 3. Deal Community Cards
- **Flop**: Enter 3 cards (e.g., `AhKsQd`)
- **Turn**: Enter 4th card (e.g., `AhKsQdJc`)
- **River**: Enter 5th card (e.g., `AhKsQdJc2s`)
- Click **"Deal Board"** after entering cards

#### 4. Hand Completion
- Hand automatically completes when:
  - All players fold except one
  - All betting rounds complete
  - Players go all-in
- Winners and payouts are calculated using `pokerkit` library
- View results in the completed hand display

### Hand History
- Switch to **"Hand History"** tab
- View all completed hands with:
  - Hand details and actions
  - Final results and payouts
  - Timestamps and status
- Click **"Refresh"** to update the list

## 🏗️ Architecture

### Frontend ([Frontend README](./frontend/README.md))
- **Framework**: Next.js 15 with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: Redux Toolkit
- **Key Features**: Real-time game interface, hand history, responsive design

### Backend ([Backend README](./backend/README.md))
- **Framework**: FastAPI with Python
- **Database**: PostgreSQL with raw SQL queries
- **Architecture**: Repository pattern with domain-driven design
- **Key Features**: RESTful API, hand evaluation, game state management

### Database
- **PostgreSQL**: Stores hands, players, actions, and game state
- **Tables**: `hands`, `players`, `game_actions`
- **Features**: UUID primary keys, JSON data storage, automatic timestamps

## 🛠️ Development

### Local Development
```bash
# Frontend only (requires backend running)
cd frontend
npm install
npm run dev

# Backend only (requires PostgreSQL)
cd backend
poetry install
poetry run uvicorn app.main:app --reload

# Full stack with Docker
docker compose up -d
```

### Key Technologies
- **Frontend**: Next.js, React, TypeScript, Redux Toolkit, shadcn/ui, Tailwind CSS
- **Backend**: FastAPI, Python, asyncpg, pokerkit
- **Database**: PostgreSQL
- **Deployment**: Docker, Docker Compose

## 📝 API Documentation

Visit http://localhost:8000/docs for interactive API documentation with:
- Hand creation and management
- Player actions and game state
- Card dealing endpoints
- Hand history retrieval

## 🎯 Game Rules

This implements simplified Texas Hold'em:
- **Players**: Up to 6 players per hand
- **Betting Rounds**: Pre-flop, flop, turn, river
- **Actions**: Fold, check, call, raise, all-in
- **Hand Evaluation**: Standard poker hand rankings
- **Winning**: Best 5-card hand from 7 available cards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `docker compose up -d`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Developed by**: [Nishimwe Prince](https://www.linkedin.com/in/nishimweprince/) for AAI Labs

**Repository**: [nishimweprince/poker-modelling](https://github.com/nishimweprince/poker-modelling)
