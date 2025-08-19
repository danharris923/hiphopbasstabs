"""
Application configuration settings.

Following patterns from use-cases/pydantic-ai/examples/main_agent_reference/settings.py
"""

import os
from typing import List
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings(BaseModel):
    """Application settings with environment variable support."""
    
    # Application info
    app_name: str = Field(default="Bass Tab Site API", description="Application name")
    app_version: str = Field(default="1.0.0", description="Application version")
    debug: bool = Field(default=False, description="Debug mode")
    
    # Server configuration
    host: str = Field(default="localhost", description="Server host")
    port: int = Field(default=8000, description="Server port")
    
    # CORS settings
    cors_origins: List[str] = Field(
        default_factory=lambda: ["http://localhost:3000"],
        description="Allowed CORS origins"
    )
    
    # API Keys (optional for this demo)
    youtube_api_key: str = Field(default="", description="YouTube Data API key")
    spotify_client_id: str = Field(default="", description="Spotify client ID")
    spotify_client_secret: str = Field(default="", description="Spotify client secret")
    whosampled_api_key: str = Field(default="", description="WhoSampled API key")
    
    # Database (for future Prisma integration)
    database_url: str = Field(
        default="postgresql://user:password@localhost:5432/bassplayers_db",
        description="Database connection URL"
    )
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"


def load_settings() -> Settings:
    """
    Load settings with proper error handling.
    
    Returns:
        Application settings instance
    """
    try:
        # Manually read environment variables
        cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:3030")
        cors_origins = [origin.strip() for origin in cors_origins_str.split(",")]
        
        return Settings(
            app_name=os.getenv("APP_NAME", "Bass Tab Site API"),
            app_version=os.getenv("APP_VERSION", "1.0.0"),
            debug=os.getenv("DEBUG", "false").lower() == "true",
            host=os.getenv("HOST", "localhost"),
            port=int(os.getenv("PORT", "8000")),
            cors_origins=cors_origins,
            youtube_api_key=os.getenv("YOUTUBE_API_KEY", ""),
            spotify_client_id=os.getenv("SPOTIFY_CLIENT_ID", ""),
            spotify_client_secret=os.getenv("SPOTIFY_CLIENT_SECRET", ""),
            whosampled_api_key=os.getenv("WHOSAMPLED_API_KEY", ""),
            database_url=os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/bassplayers_db")
        )
    except Exception as e:
        print(f"Failed to load settings: {e}")
        # Return settings with defaults for development
        return Settings()


# Global settings instance
settings = load_settings()