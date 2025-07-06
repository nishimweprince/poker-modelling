# Frontend - Texas Hold'em Poker

Next.js frontend for the Texas Hold'em poker game with shadcn/ui components and Redux state management.

## 🚀 Quick Start

### With Docker (Recommended)
```bash
# From project root
docker compose up -d
# Frontend available at http://localhost:3000
```

### Local Development
```bash
cd frontend
npm install
npm run dev
# Requires backend running on http://localhost:8000
```

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **HTTP Client**: Fetch API

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main game page with tabs
│   └── globals.css        # Global styles and shadcn/ui
├── components/
│   ├── ui/                # shadcn/ui components
│   │   ├── button.tsx     # Button variants
│   │   ├── card.tsx       # Card layouts
│   │   ├── input.tsx      # Form inputs
│   │   ├── badge.tsx      # Status badges
│   │   └── tabs.tsx       # Navigation tabs
│   └── game/              # Poker game components
│       ├── GameSetup.tsx  # Hand creation form
│       ├── GameTable.tsx  # Main poker table
│       ├── PlayerSeat.tsx # Individual player display
│       ├── ActionPanel.tsx# Player action buttons
│       ├── BoardCards.tsx # Community cards
│       └── HandHistory.tsx# Completed hands list
└── lib/
    ├── features/game/     # Redux slice
    │   └── gameSlice.ts   # Game state management
    ├── hooks.ts           # Redux typed hooks
    ├── store.ts           # Redux store config
    └── utils.ts           # shadcn/ui utilities
```

## 🎮 Components Overview

### Game Components

#### `GameSetup.tsx`
- Hand creation form with player stack configuration
- Uses shadcn/ui Card, Input, and Button components
- Dispatches `createNewHand` Redux action

#### `GameTable.tsx`
- Main poker table interface
- Displays current hand state, players, and controls
- Integrates PlayerSeat, ActionPanel, and BoardCards
- Handles card dealing and game progression

#### `PlayerSeat.tsx`
- Individual player display with cards and stack info
- Shows dealer/blind badges using shadcn/ui Badge
- Conditional styling for folded/selected states
- Displays winnings for completed hands

#### `ActionPanel.tsx`
- Player action buttons (fold, check, call, raise, all-in)
- Input fields for bet/raise amounts
- Uses different Button variants for action types
- Disabled states during loading

#### `BoardCards.tsx`
- Community cards display (flop, turn, river)
- Card formatting and visual representation
- Round indicators based on card count

#### `HandHistory.tsx`
- List of completed hands with details
- Refresh functionality and loading states
- Status badges for hand completion
- Formatted hand summaries

### UI Components (shadcn/ui)

#### Button Variants
- `default`: Primary actions (call, bet, raise)
- `destructive`: Negative actions (fold)
- `secondary`: Neutral actions (check)
- `outline`: Special actions (all-in)

#### Card Components
- `Card`: Container with consistent styling
- `CardHeader`: Title and action areas
- `CardContent`: Main content area
- `CardTitle`: Styled headings

## 🔄 State Management

### Redux Store Structure
```typescript
interface GameState {
  currentHand: Hand | null
  handHistory: HandHistoryItem[]
  gamePhase: 'setup' | 'playing' | 'completed'
  isLoading: boolean
  error: string | null
}
```

### Key Actions
- `createNewHand`: Start new poker hand
- `addAction`: Player actions (fold, call, raise)
- `dealHoleCards`: Deal private cards to players
- `dealBoardCards`: Deal community cards
- `fetchHandHistory`: Load completed hands
- `resetGame`: Return to setup phase

### Async Thunks
All API calls use Redux Toolkit's `createAsyncThunk`:
- Automatic loading states
- Error handling
- Type-safe payloads
- Optimistic updates

## 🎨 Styling & Design

### shadcn/ui Integration
- Consistent design tokens and spacing
- Dark mode support with CSS variables
- Accessible components with proper ARIA labels
- Customizable through CSS variables

### Poker Theme
- Green color scheme for poker table feel
- Card-like layouts using shadcn/ui Card components
- Responsive design for different screen sizes
- Visual feedback for game states

### Tailwind Configuration
- Custom green color palette
- shadcn/ui design tokens
- Responsive breakpoints
- Component-specific utilities

## 🔌 API Integration

### Backend Communication
```typescript
// Example API call in Redux slice
const response = await fetch(`${API_BASE}/api/hands`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
```

### Error Handling
- Network error catching
- User-friendly error messages
- Retry mechanisms for failed requests
- Loading states during API calls

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint checking
npm run type-check   # TypeScript checking
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Code Quality
- TypeScript strict mode
- ESLint with Next.js rules
- Prettier code formatting
- Component prop validation

## 🔧 Configuration Files

### `components.json`
shadcn/ui configuration:
- Base color: Neutral
- CSS variables for theming
- Component aliases and paths

### `tailwind.config.js`
- shadcn/ui plugin integration
- Custom color palette
- Animation configurations
- Responsive breakpoints

### `next.config.ts`
- TypeScript configuration
- Build optimizations
- Environment variable handling

## 📱 Features

### Game Interface
- Real-time game state updates
- Interactive player selection
- Visual card representations
- Action button states
- Error handling and feedback

### Navigation
- Tab-based interface (Game/Hand History)
- Conditional rendering based on game phase
- Smooth transitions between states

### Responsive Design
- Mobile-friendly layouts
- Flexible grid systems
- Touch-friendly interactions
- Optimized for different screen sizes

## 🚀 Deployment

### Docker Production
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Build Optimization
- Static generation where possible
- Image optimization
- Bundle splitting
- Tree shaking for smaller builds

---

**Back to**: [Main README](../README.md) | **Related**: [Backend README](../backend/README.md)
