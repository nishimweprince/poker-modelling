from abc import ABC, abstractmethod
from app.database.connection import get_db_cursor

class BaseRepository(ABC):
    """Base repository class with common database operations."""
    
    def __init__(self):
        pass
    
    def execute_query(self, query: str, params: tuple = None):
        """Execute a query and return results."""
        with get_db_cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchall()
    
    def execute_single(self, query: str, params: tuple = None):
        """Execute a query and return single result."""
        with get_db_cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchone()
    
    def execute_insert(self, query: str, params: tuple = None):
        """Execute an insert query."""
        with get_db_cursor() as cursor:
            cursor.execute(query, params)
            return cursor.rowcount
