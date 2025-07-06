from typing import List, Dict, Optional
from app.models.game import Hand, Player, GameAction
from app.repositories.hand_repository import HandRepository
from app.services.poker_engine import PokerEngine
import uuid

class GameService:
    """Service for managing poker game logic and hand operations."""
    
    def __init__(self):
        self.hand_repository = HandRepository()
        self.poker_engine = PokerEngine()
    
    def create_new_hand(self, player_stacks: List[int]) -> Hand:
        """Create a new hand with 6 players and initial setup."""
        if len(player_stacks) != 6:
            raise ValueError("Must have exactly 6 players")
        
        players = []
        for i, stack in enumerate(player_stacks):
            player = Player(
                position=i,
                name=f"Player {i + 1}",
                stack=stack,
                is_dealer=(i == 0),  # Position 0 is dealer
                is_small_blind=(i == 1),  # Position 1 is small blind
                is_big_blind=(i == 2)  # Position 2 is big blind
            )
            players.append(player)
        
        players[1].current_bet = 20  # Small blind
        players[1].total_invested = 20
        players[1].stack -= 20
        
        players[2].current_bet = 40  # Big blind
        players[2].total_invested = 40
        players[2].stack -= 40
        
        hand = Hand(
            id=str(uuid.uuid4()),
            players=players,
            actions=[],
            pot_size=60,  # SB + BB
            current_round="preflop"
        )
        
        return hand
    
    def add_action(self, hand: Hand, player_position: int, action_type: str, amount: int = 0) -> Hand:
        """Add an action to the hand and update game state."""
        if not self.poker_engine.validate_action(hand, player_position, action_type, amount):
            raise ValueError(f"Invalid action: {action_type} for player {player_position}")
        
        player = next(p for p in hand.players if p.position == player_position)
        
        action = GameAction(
            player_position=player_position,
            action_type=action_type,
            amount=amount,
            round=hand.current_round
        )
        
        if action_type == "fold":
            player.is_folded = True
        elif action_type == "call":
            max_bet = max(p.current_bet for p in hand.players if not p.is_folded)
            call_amount = max_bet - player.current_bet
            player.current_bet = max_bet
            player.total_invested += call_amount
            player.stack -= call_amount
            hand.pot_size += call_amount
        elif action_type == "bet":
            player.current_bet = amount
            player.total_invested += amount
            player.stack -= amount
            hand.pot_size += amount
        elif action_type == "raise":
            raise_amount = amount - player.current_bet
            player.current_bet = amount
            player.total_invested += raise_amount
            player.stack -= raise_amount
            hand.pot_size += raise_amount
        elif action_type == "allin":
            all_in_amount = player.stack
            player.current_bet += all_in_amount
            player.total_invested += all_in_amount
            player.stack = 0
            hand.pot_size += all_in_amount
        
        hand.actions.append(action)
        
        if self._is_betting_round_complete(hand):
            hand = self._advance_to_next_round(hand)
        
        return hand
    
    def deal_hole_cards(self, hand: Hand, cards_by_position: Dict[int, str]) -> Hand:
        """Deal hole cards to players."""
        for position, cards in cards_by_position.items():
            player = next(p for p in hand.players if p.position == position)
            player.hole_cards = cards
        return hand
    
    def deal_board_cards(self, hand: Hand, board_cards: str) -> Hand:
        """Deal board cards (flop, turn, river)."""
        hand.board_cards = board_cards
        return hand
    
    def complete_hand(self, hand: Hand) -> Hand:
        """Complete the hand and calculate winnings."""
        hand.is_completed = True
        
        try:
            winnings = self.poker_engine.evaluate_hand(hand)
            hand.winnings = winnings
            
            hand.winner_positions = [pos for pos, amount in winnings.items() if amount > 0]
        except Exception as e:
            print(f"Error evaluating hand: {e}")
            active_players = [p for p in hand.players if not p.is_folded]
            if active_players:
                split_amount = hand.pot_size // len(active_players)
                hand.winnings = {}
                for player in hand.players:
                    if not player.is_folded:
                        hand.winnings[player.position] = split_amount - player.total_invested
                        hand.winner_positions.append(player.position)
                    else:
                        hand.winnings[player.position] = -player.total_invested
        
        return hand
    
    def save_hand(self, hand: Hand) -> bool:
        """Save hand to database."""
        return self.hand_repository.save_hand(hand)
    
    def get_hand_history(self, limit: int = 50) -> List[Hand]:
        """Get all hands for history display (completed and in-progress)."""
        return self.hand_repository.get_all_hands(limit)
    
    def get_hand_by_id(self, hand_id: str) -> Optional[Hand]:
        """Get specific hand by ID."""
        return self.hand_repository.get_hand_by_id(hand_id)
    
    def _is_betting_round_complete(self, hand: Hand) -> bool:
        """Check if current betting round is complete."""
        active_players = [p for p in hand.players if not p.is_folded]
        
        if len(active_players) <= 1:
            return True
        
        max_bet = max(p.current_bet for p in active_players)
        for player in active_players:
            if player.current_bet < max_bet and player.stack > 0:
                return False
        
        return True
    
    def _advance_to_next_round(self, hand: Hand) -> Hand:
        """Advance to next betting round."""
        for player in hand.players:
            player.current_bet = 0
        
        if hand.current_round == "preflop":
            hand.current_round = "flop"
        elif hand.current_round == "flop":
            hand.current_round = "turn"
        elif hand.current_round == "turn":
            hand.current_round = "river"
        elif hand.current_round == "river":
            hand = self.complete_hand(hand)
        
        return hand
    
    def format_hand_for_display(self, hand: Hand) -> Dict:
        """Format hand for frontend display according to specification, including status."""
        # Status: 'Completed' or 'In Progress'
        status = 'Completed' if hand.is_completed else 'In Progress'

        line1 = hand.id
        dealer_pos = next((p.position for p in hand.players if p.is_dealer), None)
        sb_pos = next((p.position for p in hand.players if p.is_small_blind), None)
        bb_pos = next((p.position for p in hand.players if p.is_big_blind), None)
        stacks = [p.stack + p.total_invested for p in sorted(hand.players, key=lambda x: x.position)]
        line2 = f"Stacks: {stacks} | Dealer: {dealer_pos} | SB: {sb_pos} | BB: {bb_pos}"

        cards = []
        for player in sorted(hand.players, key=lambda x: x.position):
            cards.append(player.hole_cards or "??")
        line3 = f"Cards: {' | '.join(cards)}"

        action_sequence = []
        for action in hand.actions:
            if action.action_type == "fold":
                action_sequence.append("f")
            elif action.action_type == "check":
                action_sequence.append("x")
            elif action.action_type == "call":
                action_sequence.append("c")
            elif action.action_type == "bet":
                action_sequence.append(f"b{action.amount}")
            elif action.action_type == "raise":
                action_sequence.append(f"r{action.amount}")
            elif action.action_type == "allin":
                action_sequence.append("allin")
        if hand.board_cards:
            action_sequence.append(hand.board_cards)
        line4 = f"Actions: {' '.join(action_sequence)}"

        winnings_display = []
        for player in sorted(hand.players, key=lambda x: x.position):
            amount = hand.winnings.get(player.position, 0) if hand.winnings else 0
            sign = "+" if amount > 0 else ""
            winnings_display.append(f"{sign}{amount}")
        line5 = f"Winnings: {' | '.join(winnings_display)}"

        return {
            "id": hand.id,
            "line1": line1,
            "line2": line2,
            "line3": line3,
            "line4": line4,
            "line5": line5,
            "created_at": hand.created_at.isoformat() if hand.created_at else None,
            "status": status
        }
