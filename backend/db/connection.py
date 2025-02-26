from motor.motor_asyncio import AsyncIOMotorClient
from ..config.settings import get_settings

settings = get_settings()

class MongoDB:
    client: AsyncIOMotorClient = None
    
    @classmethod
    async def connect_to_database(cls, app=None):
        """Create database connection."""
        cls.client = AsyncIOMotorClient(settings.mongodb_uri)
        if app:
            app.state.mongodb_client = cls.client
            app.state.mongodb = cls.client[settings.mongodb_name]
        
    @classmethod
    async def close_database_connection(cls, app=None):
        """Close database connection."""
        if cls.client:
            cls.client.close()
            if app:
                app.state.mongodb_client = None
                app.state.mongodb = None

def get_database():
    """Return database instance."""
    return MongoDB.client[get_settings().mongodb_name]