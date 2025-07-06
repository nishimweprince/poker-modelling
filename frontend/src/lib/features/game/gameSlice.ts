import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface Player {
  position: number
  name: string
  stack: number
  hole_cards?: string
  is_dealer: boolean
  is_small_blind: boolean
  is_big_blind: boolean
  is_folded: boolean
  current_bet: number
  total_invested: number
}

export interface GameAction {
  player_position: number
  action_type: string
  amount: number
  round: string
}

export interface Hand {
  id: string
  players: Player[]
  actions: GameAction[]
  board_cards: string
  pot_size: number
  current_round: string
  is_completed: boolean
  winner_positions: number[]
  winnings: Record<number, number>
}

export interface HandHistoryItem {
  id: string
  line1: string
  line2: string
  line3: string
  line4: string
  line5: string
  created_at: string
  status: string
}

interface GameState {
  currentHand: Hand | null
  handHistory: HandHistoryItem[]
  isLoading: boolean
  error: string | null
  gamePhase: 'setup' | 'playing' | 'completed'
}

const initialState: GameState = {
  currentHand: null,
  handHistory: [],
  isLoading: false,
  error: null,
  gamePhase: 'setup'
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const createNewHand = createAsyncThunk(
  'game/createNewHand',
  async (playerStacks: number[]) => {
    const response = await fetch(`${API_BASE_URL}/hands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ player_stacks: playerStacks }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create hand')
    }
    
    return response.json()
  }
)

export const addAction = createAsyncThunk(
  'game/addAction',
  async ({ handId, playerPosition, actionType, amount }: {
    handId: string
    playerPosition: number
    actionType: string
    amount?: number
  }) => {
    const response = await fetch(`${API_BASE_URL}/hands/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hand_id: handId,
        player_position: playerPosition,
        action_type: actionType,
        amount: amount || 0,
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to add action')
    }
    
    return response.json()
  }
)

export const dealHoleCards = createAsyncThunk(
  'game/dealHoleCards',
  async ({ handId, cardsByPosition }: {
    handId: string
    cardsByPosition: Record<number, string>
  }) => {
    const response = await fetch(`${API_BASE_URL}/hands/deal-cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hand_id: handId,
        cards_by_position: cardsByPosition,
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to deal hole cards')
    }
    
    return response.json()
  }
)

export const dealBoardCards = createAsyncThunk(
  'game/dealBoardCards',
  async ({ handId, boardCards }: {
    handId: string
    boardCards: string
  }) => {
    const response = await fetch(`${API_BASE_URL}/hands/deal-board`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hand_id: handId,
        board_cards: boardCards,
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to deal board cards')
    }
    
    return response.json()
  }
)

export const fetchHandHistory = createAsyncThunk(
  'game/fetchHandHistory',
  async (limit: number = 50) => {
    const response = await fetch(`${API_BASE_URL}/hands?limit=${limit}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch hand history')
    }
    
    return response.json()
  }
)

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    resetGame: (state) => {
      state.currentHand = null
      state.gamePhase = 'setup'
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
    setGamePhase: (state, action: PayloadAction<'setup' | 'playing' | 'completed'>) => {
      state.gamePhase = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewHand.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createNewHand.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentHand = action.payload
        state.gamePhase = 'playing'
      })
      .addCase(createNewHand.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to create hand'
      })
      
      .addCase(addAction.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addAction.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentHand = action.payload
        if (action.payload.is_completed) {
          state.gamePhase = 'completed'
        }
      })
      .addCase(addAction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to add action'
      })
      
      .addCase(dealHoleCards.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(dealHoleCards.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentHand = action.payload
      })
      .addCase(dealHoleCards.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to deal hole cards'
      })
      
      .addCase(dealBoardCards.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(dealBoardCards.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentHand = action.payload
      })
      .addCase(dealBoardCards.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to deal board cards'
      })
      
      .addCase(fetchHandHistory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchHandHistory.fulfilled, (state, action) => {
        state.isLoading = false
        state.handHistory = action.payload
      })
      .addCase(fetchHandHistory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch hand history'
      })
  },
})

export const { resetGame, clearError, setGamePhase } = gameSlice.actions
export default gameSlice.reducer
