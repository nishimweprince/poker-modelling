from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.services.game_service import GameService
from app.models.game import Hand
from app.database.connection import init_database

router = APIRouter()

class CreateHandRequest(BaseModel):
    player_stacks: List[int]

class AddActionRequest(BaseModel):
    hand_id: str
    player_position: int
    action_type: str
    amount: Optional[int] = 0

class DealCardsRequest(BaseModel):
    hand_id: str
    cards_by_position: Dict[str, str]

class DealBoardRequest(BaseModel):
    hand_id: str
    board_cards: str


def get_game_service():
    """Dependency to get game service instance."""
    return GameService()

@router.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    try:
        init_database()
    except Exception as e:
        print(f"Database initialization error: {e}")

@router.post("/hands")
async def create_hand(
    request: CreateHandRequest,
    game_service: GameService = Depends(get_game_service)
):
    """Create a new poker hand."""
    try:
        hand = game_service.create_new_hand(request.player_stacks)
        
        if not game_service.save_hand(hand):
            raise HTTPException(status_code=500, detail="Failed to save hand")
        
        return _hand_to_response(hand)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/hands/action")
async def add_action(
    request: AddActionRequest,
    game_service: GameService = Depends(get_game_service)
):
    """Add an action to a hand."""
    try:
        hand = game_service.get_hand_by_id(request.hand_id)
        if not hand:
            raise HTTPException(status_code=404, detail="Hand not found")
        
        updated_hand = game_service.add_action(
            hand, 
            request.player_position, 
            request.action_type, 
            request.amount
        )
        
        if not game_service.save_hand(updated_hand):
            raise HTTPException(status_code=500, detail="Failed to save hand")
        
        return _hand_to_response(updated_hand)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/hands/deal-cards")
async def deal_hole_cards(
    request: DealCardsRequest,
    game_service: GameService = Depends(get_game_service)
):
    """Deal hole cards to players."""
    try:
        hand = game_service.get_hand_by_id(request.hand_id)
        if not hand:
            raise HTTPException(status_code=404, detail="Hand not found")
        
        cards_by_position_int = {int(k): v for k, v in request.cards_by_position.items()}
        
        updated_hand = game_service.deal_hole_cards(hand, cards_by_position_int)
        
        if not game_service.save_hand(updated_hand):
            raise HTTPException(status_code=500, detail="Failed to save hand")
        
        return _hand_to_response(updated_hand)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/hands/deal-board")
async def deal_board_cards(
    request: DealBoardRequest,
    game_service: GameService = Depends(get_game_service)
):
    """Deal board cards (flop, turn, river)."""
    try:
        hand = game_service.get_hand_by_id(request.hand_id)
        if not hand:
            raise HTTPException(status_code=404, detail="Hand not found")
        
        updated_hand = game_service.deal_board_cards(hand, request.board_cards)
        
        if not game_service.save_hand(updated_hand):
            raise HTTPException(status_code=500, detail="Failed to save hand")
        
        return _hand_to_response(updated_hand)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/hands/{hand_id}")
async def get_hand(
    hand_id: str,
    game_service: GameService = Depends(get_game_service)
):
    """Get a specific hand by ID."""
    try:
        hand = game_service.get_hand_by_id(hand_id)
        if not hand:
            raise HTTPException(status_code=404, detail="Hand not found")
        
        return _hand_to_response(hand)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/hands")
async def get_hand_history(
    limit: int = 50,
    game_service: GameService = Depends(get_game_service)
):
    """Get hand history for display (all hands, with status)."""
    try:
        hands = game_service.get_hand_history(limit)
        formatted_hands = []
        for hand in hands:
            formatted = game_service.format_hand_for_display(hand)
            formatted_hands.append(formatted)
        return formatted_hands
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

def _hand_to_response(hand: Hand) -> Dict:
    """Convert Hand model to JSON-serializable dictionary format."""
    return {
        "id": hand.id,
        "players": [
            {
                "position": p.position,
                "name": p.name,
                "stack": p.stack,
                "hole_cards": p.hole_cards,
                "is_dealer": p.is_dealer,
                "is_small_blind": p.is_small_blind,
                "is_big_blind": p.is_big_blind,
                "is_folded": p.is_folded,
                "current_bet": p.current_bet,
                "total_invested": p.total_invested
            }
            for p in hand.players
        ],
        "actions": [
            {
                "player_position": a.player_position,
                "action_type": a.action_type,
                "amount": a.amount,
                "round": a.round
            }
            for a in hand.actions
        ],
        "board_cards": hand.board_cards,
        "pot_size": hand.pot_size,
        "current_round": hand.current_round,
        "is_completed": hand.is_completed,
        "winner_positions": hand.winner_positions,
        "winnings": hand.winnings
    }
