"""
Configuration settings for the NoteGuard API
"""

from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "NoteGuard API"
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:5173",
        "*",  # Allow all origins for development
    ]
    
    # Database Configuration
    DATABASE_URL: str = "sqlite+aiosqlite:///./noteguard.db"
    DB_ECHO: bool = True  # Enable for debugging
    DB_POOL_SIZE: int = 10
    
    # Text Analysis Configuration
    MAX_TEXT_LENGTH: int = 50000  # 50KB
    MIN_TEXT_LENGTH: int = 10
    
    # Authentication Configuration
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Email Configuration
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = "your-email@gmail.com"
    SMTP_PASSWORD: str = "your-app-password"
    FROM_EMAIL: str = "noreply@noteguard.com"
    APP_URL: str = "http://localhost:5173"
    
    # User Limits
    FREE_ANALYSIS_LIMIT: int = 10
    PREMIUM_ANALYSIS_LIMIT: int = 1000
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings() 