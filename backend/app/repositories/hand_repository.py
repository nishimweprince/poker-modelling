import json
from typing import List, Optional
from app.repositories.base import BaseRepository
from app.models.game import Hand, Player, GameAction
from datetime import datetime

class HandRepository(BaseRepository):
    """Repository for hand data operations using raw SQL."""
    
    def save_hand(self, hand: Hand) -> bool:
        """Save a hand to the database using UPSERT."""
        query = """
            INSERT INTO hands (
                id, players_data, actions_data, board_cards, pot_size,
                current_round, is_completed, winner_positions, winnings, created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                players_data = EXCLUDED.players_data,
                actions_data = EXCLUDED.actions_data,
                board_cards = EXCLUDED.board_cards,
                pot_size = EXCLUDED.pot_size,
                current_round = EXCLUDED.current_round,
                is_completed = EXCLUDED.is_completed,
                winner_positions = EXCLUDED.winner_positions,
                winnings = EXCLUDED.winnings
        """
        
        players_data = [
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
        ]
        
        actions_data = [
            {
                "player_position": a.player_position,
                "action_type": a.action_type,
                "amount": a.amount,
                "round": a.round
            }
            for a in hand.actions
        ]
        
        params = (
            hand.id,
            json.dumps(players_data),
            json.dumps(actions_data),
            hand.board_cards,
            hand.pot_size,
            hand.current_round,
            hand.is_completed,
            json.dumps(hand.winner_positions),
            json.dumps(hand.winnings),
            hand.created_at
        )
        
        try:
            self.execute_insert(query, params)
            return True
        except Exception as e:
            print(f"Error saving hand: {e}")
            return False
    
    def get_hand_by_id(self, hand_id: str) -> Optional[Hand]:
        """Get a hand by its ID."""
        query = "SELECT * FROM hands WHERE id = %s"
        result = self.execute_single(query, (hand_id,))
        
        if not result:
            return None
        
        return self._row_to_hand(result)
    
    def get_all_hands(self, limit: int = 50) -> List[Hand]:
        """Get all hands ordered by creation date."""
        query = """
            SELECT * FROM hands 
            ORDER BY created_at DESC 
            LIMIT %s
        """
        results = self.execute_query(query, (limit,))
        
        return [self._row_to_hand(row) for row in results]
    
    def get_completed_hands(self, limit: int = 50) -> List[Hand]:
        """Get completed hands only."""
        query = """
            SELECT * FROM hands 
            WHERE is_completed = TRUE 
            ORDER BY created_at DESC 
            LIMIT %s
        """
        results = self.execute_query(query, (limit,))
        
        return [self._row_to_hand(row) for row in results]
    
    def _row_to_hand(self, row) -> Hand:
        """Convert database row to Hand object."""
        players_data = row['players_data']
        if isinstance(players_data, str):
            players_data = json.loads(players_data)
        
        players = [
            Player(
                position=p['position'],
                name=p['name'],
                stack=p['stack'],
                hole_cards=p['hole_cards'],
                is_dealer=p['is_dealer'],
                is_small_blind=p['is_small_blind'],
                is_big_blind=p['is_big_blind'],
                is_folded=p['is_folded'],
                current_bet=p['current_bet'],
                total_invested=p['total_invested']
            )
            for p in players_data
        ]
        
        actions_data = row['actions_data']
        if isinstance(actions_data, str):
            actions_data = json.loads(actions_data)
        
        actions = [
            GameAction(
                player_position=a['player_position'],
                action_type=a['action_type'],
                amount=a['amount'],
                round=a['round']
            )
            for a in actions_data
        ]
        
        winner_positions = row['winner_positions']
        if isinstance(winner_positions, str):
            winner_positions = json.loads(winner_positions)
        
        winnings = row['winnings']
        if isinstance(winnings, str):
            winnings = json.loads(winnings)
        
        return Hand(
            id=row['id'],
            players=players,
            actions=actions,
            board_cards=row['board_cards'],
            pot_size=row['pot_size'],
            current_round=row['current_round'],
            is_completed=row['is_completed'],
            winner_positions=winner_positions,
            winnings=winnings,
            created_at=row['created_at']
        )
