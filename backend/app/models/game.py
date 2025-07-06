from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime
import uuid

@dataclass
class Player:
    position: int
    name: str
    stack: int
    hole_cards: Optional[str] = None
    is_dealer: bool = False
    is_small_blind: bool = False
    is_big_blind: bool = False
    is_folded: bool = False
    current_bet: int = 0
    total_invested: int = 0

@dataclass
class GameAction:
    player_position: int
    action_type: str  # fold, check, call, bet, raise, allin
    amount: int = 0
    round: str = "preflop"  # preflop, flop, turn, river

@dataclass
class Hand:
    id: str
    players: List[Player]
    actions: List[GameAction]
    board_cards: str = ""
    pot_size: int = 0
    current_round: str = "preflop"
    is_completed: bool = False
    winner_positions: List[int] = None
    winnings: dict = None  # position -> amount won/lost
    created_at: Optional[datetime] = None
    
    def __post_init__(self):
        if self.id is None:
            self.id = str(uuid.uuid4())
        if self.winner_positions is None:
            self.winner_positions = []
        if self.winnings is None:
            self.winnings = {}
        if self.created_at is None:
            self.created_at = datetime.utcnow()
