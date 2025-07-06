
CREATE TABLE IF NOT EXISTS hands (
    id VARCHAR(36) PRIMARY KEY,
    players_data JSONB NOT NULL,
    actions_data JSONB NOT NULL DEFAULT '[]',
    board_cards VARCHAR(20) DEFAULT '',
    pot_size INTEGER NOT NULL DEFAULT 0,
    current_round VARCHAR(20) NOT NULL DEFAULT 'preflop',
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    winner_positions JSONB DEFAULT '[]',
    winnings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hands_created_at ON hands(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hands_completed ON hands(is_completed);
CREATE INDEX IF NOT EXISTS idx_hands_id ON hands(id);

INSERT INTO hands (
    id, 
    players_data, 
    actions_data, 
    board_cards, 
    pot_size, 
    current_round, 
    is_completed, 
    winner_positions, 
    winnings
) VALUES (
    'sample-hand-uuid-123',
    '[
        {"position": 0, "name": "Player 1", "stack": 960, "hole_cards": "AhKs", "is_dealer": true, "is_small_blind": false, "is_big_blind": false, "is_folded": false, "current_bet": 0, "total_invested": 40},
        {"position": 1, "name": "Player 2", "stack": 980, "hole_cards": "QdJc", "is_dealer": false, "is_small_blind": true, "is_big_blind": false, "is_folded": false, "current_bet": 0, "total_invested": 20},
        {"position": 2, "name": "Player 3", "stack": 960, "hole_cards": "9h8s", "is_dealer": false, "is_small_blind": false, "is_big_blind": true, "is_folded": false, "current_bet": 0, "total_invested": 40},
        {"position": 3, "name": "Player 4", "stack": 1000, "hole_cards": "7c6d", "is_dealer": false, "is_small_blind": false, "is_big_blind": false, "is_folded": true, "current_bet": 0, "total_invested": 0},
        {"position": 4, "name": "Player 5", "stack": 1000, "hole_cards": "5h4s", "is_dealer": false, "is_small_blind": false, "is_big_blind": false, "is_folded": true, "current_bet": 0, "total_invested": 0},
        {"position": 5, "name": "Player 6", "stack": 1000, "hole_cards": "3c2d", "is_dealer": false, "is_small_blind": false, "is_big_blind": false, "is_folded": true, "current_bet": 0, "total_invested": 0}
    ]',
    '[
        {"player_position": 3, "action_type": "fold", "amount": 0, "round": "preflop"},
        {"player_position": 4, "action_type": "fold", "amount": 0, "round": "preflop"},
        {"player_position": 5, "action_type": "fold", "amount": 0, "round": "preflop"},
        {"player_position": 0, "action_type": "call", "amount": 40, "round": "preflop"},
        {"player_position": 1, "action_type": "call", "amount": 20, "round": "preflop"},
        {"player_position": 2, "action_type": "check", "amount": 0, "round": "preflop"}
    ]',
    'AhKsQdJc9h',
    100,
    'river',
    true,
    '[0]',
    '{"0": 60, "1": -20, "2": -40, "3": 0, "4": 0, "5": 0}'
) ON CONFLICT (id) DO NOTHING;
