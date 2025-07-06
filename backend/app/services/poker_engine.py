from typing import List, Dict, Tuple
from pokerkit import Automation, NoLimitTexasHoldem
from app.models.game import Hand, Player, GameAction

class PokerEngine:
    """Poker engine using pokerkit for hand evaluation and game logic."""
    
    def __init__(self):
        pass
    
    def evaluate_hand(self, hand: Hand) -> Dict[int, int]:
        """
        Evaluate a completed hand and return winnings for each player.
        Returns dict mapping player position to amount won/lost.
        """
        if not hand.is_completed:
            raise ValueError("Hand must be completed to evaluate")
        
        starting_stacks = []
        player_positions = []
        
        for player in sorted(hand.players, key=lambda p: p.position):
            starting_stacks.append(player.stack + player.total_invested)
            player_positions.append(player.position)
        
        state = NoLimitTexasHoldem.create_state(
            automations=(
                Automation.ANTE_POSTING,
                Automation.BET_COLLECTION,
                Automation.BLIND_OR_STRADDLE_POSTING,
                Automation.HOLE_CARDS_SHOWING_OR_MUCKING,
                Automation.HAND_KILLING,
                Automation.CHIPS_PUSHING,
                Automation.CHIPS_PULLING,
            ),
            uniform_antes=False,
            antes=0,
            blinds_or_straddles=(20, 40),  # SB=20, BB=40
            min_bet=40,
            starting_stacks=tuple(starting_stacks),
            number_of_players=len(hand.players)
        )
        
        for player in sorted(hand.players, key=lambda p: p.position):
            if player.hole_cards and not player.is_folded:
                state.deal_hole(player.hole_cards)
            else:
                state.deal_hole('????')  # Unknown/folded cards
        
        current_round = "preflop"
        for action in hand.actions:
            if action.round != current_round:
                if action.round == "flop" and len(hand.board_cards) >= 6:
                    state.burn_card()
                    state.deal_board(hand.board_cards[:6])  # First 3 cards
                elif action.round == "turn" and len(hand.board_cards) >= 8:
                    state.burn_card()
                    state.deal_board(hand.board_cards[6:8])  # 4th card
                elif action.round == "river" and len(hand.board_cards) >= 10:
                    state.burn_card()
                    state.deal_board(hand.board_cards[8:10])  # 5th card
                current_round = action.round
            
            try:
                if action.action_type == "fold":
                    state.fold()
                elif action.action_type == "check":
                    state.check_or_call()
                elif action.action_type == "call":
                    state.check_or_call()
                elif action.action_type == "bet":
                    state.complete_bet_or_raise_to(action.amount)
                elif action.action_type == "raise":
                    state.complete_bet_or_raise_to(action.amount)
                elif action.action_type == "allin":
                    player = next(p for p in hand.players if p.position == action.player_position)
                    state.complete_bet_or_raise_to(player.stack + player.total_invested)
            except Exception as e:
                print(f"Error executing action {action}: {e}")
                continue
        
        final_stacks = state.stacks
        winnings = {}
        
        for i, player in enumerate(sorted(hand.players, key=lambda p: p.position)):
            original_stack = player.stack + player.total_invested
            final_stack = final_stacks[i] if i < len(final_stacks) else 0
            winnings[player.position] = final_stack - original_stack
        
        return winnings
    
    def validate_action(self, hand: Hand, player_position: int, action_type: str, amount: int = 0) -> bool:
        """
        Validate if an action is legal in the current game state.
        """
        player = next((p for p in hand.players if p.position == player_position), None)
        if not player or player.is_folded:
            return False
        
        if action_type == "fold":
            return True
        elif action_type == "check":
            return player.current_bet == max(p.current_bet for p in hand.players if not p.is_folded)
        elif action_type == "call":
            max_bet = max(p.current_bet for p in hand.players if not p.is_folded)
            return player.current_bet < max_bet
        elif action_type == "bet":
            return amount >= 40 and max(p.current_bet for p in hand.players if not p.is_folded) == 0
        elif action_type == "raise":
            max_bet = max(p.current_bet for p in hand.players if not p.is_folded)
            return amount > max_bet and amount >= max_bet + 40
        elif action_type == "allin":
            return player.stack > 0
        
        return False
    
    def get_valid_actions(self, hand: Hand, player_position: int) -> List[str]:
        """Get list of valid actions for a player in current state."""
        valid_actions = []
        
        if self.validate_action(hand, player_position, "fold"):
            valid_actions.append("fold")
        if self.validate_action(hand, player_position, "check"):
            valid_actions.append("check")
        if self.validate_action(hand, player_position, "call"):
            valid_actions.append("call")
        if self.validate_action(hand, player_position, "bet", 40):
            valid_actions.append("bet")
        if self.validate_action(hand, player_position, "raise", 80):
            valid_actions.append("raise")
        if self.validate_action(hand, player_position, "allin"):
            valid_actions.append("allin")
        
        return valid_actions
