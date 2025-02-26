from pydantic import BaseSettings, Field
from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    app_name: str = "Geaux Academy API"
    app_version: str = "1.0.0"
    mongodb_uri: str = Field(..., env="MONGODB_URI")
    mongodb_name: str = Field("geaux_academy", env="MONGODB_NAME")
    cors_origins: List[str] = ["http://localhost:3000", "https://geauxacademy.com"]
    firebase_project_id: str = Field(..., env="FIREBASE_PROJECT_ID")
    firebase_web_api_key: str = Field(..., env="FIREBASE_WEB_API_KEY")
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()