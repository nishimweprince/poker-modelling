import psycopg2
import psycopg2.extras
import os
from typing import Optional
from contextlib import contextmanager

def get_db_connection():
    """Get database connection using environment variables."""
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=os.getenv("POSTGRES_PORT", "5432"),
        database=os.getenv("POSTGRES_DB", "poker_db"),
        user=os.getenv("POSTGRES_USER", "poker_user"),
        password=os.getenv("POSTGRES_PASSWORD", "poker_pass")
    )

@contextmanager
def get_db_cursor():
    """Context manager for database operations."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        yield cursor
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        raise e
    finally:
        if conn:
            cursor.close()
            conn.close()

def init_database():
    """Initialize database with required tables."""
    with get_db_cursor() as cursor:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS hands (
                id VARCHAR(36) PRIMARY KEY,
                players_data JSONB NOT NULL,
                actions_data JSONB NOT NULL,
                board_cards VARCHAR(20) DEFAULT '',
                pot_size INTEGER DEFAULT 0,
                current_round VARCHAR(20) DEFAULT 'preflop',
                is_completed BOOLEAN DEFAULT FALSE,
                winner_positions JSONB DEFAULT '[]',
                winnings JSONB DEFAULT '{}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_hands_created_at 
            ON hands(created_at DESC)
        """)
