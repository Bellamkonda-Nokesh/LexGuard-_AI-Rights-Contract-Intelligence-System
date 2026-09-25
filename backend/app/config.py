"""Configuration settings for LexGuard backend service.
Loads from environment variables with sensible production and local fallbacks.
"""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
import os

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    APP_NAME: str = "LexGuard API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = Field(default="development", description="development, testing, or production")
    DEBUG: bool = False

    # Gemini API Configuration
    GEMINI_API_KEY: str = Field(default="", description="Google Gemini API key")
    GEMINI_FLASH_MODEL: str = Field(default="gemini-2.5-flash", description="Model for extraction and fast reasoning")
    GEMINI_PRO_MODEL: str = Field(default="gemini-2.5-pro", description="Model for deep risk scoring and aggregation")
    GEMINI_EMBEDDING_MODEL: str = Field(default="text-embedding-004", description="Embedding model for RAG")

    # Vector Database Configuration
    CHROMA_PERSIST_DIR: str = Field(
        default=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "chroma_db"),
        description="Local directory for Chroma vector store"
    )
    BENCHMARK_FILE_PATH: str = Field(
        default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "benchmark_clauses.json"),
        description="Path to default standard clause benchmark JSON"
    )

    # Google Cloud Firestore & Firebase Auth
    FIRESTORE_PROJECT_ID: str = Field(default="", description="GCP project ID for Firestore")
    FIRESTORE_DATABASE_ID: str = Field(default="(default)", description="Firestore database name")
    GOOGLE_APPLICATION_CREDENTIALS: str = Field(default="", description="Path to GCP service account key")
    FIREBASE_AUTH_DISABLED_FOR_DEV: bool = Field(
        default=True, 
        description="If True, allows anonymous / demo user sessions when no Firebase Auth token is provided"
    )

    # Upload and Security Constraints
    MAX_UPLOAD_SIZE_MB: int = Field(default=15, description="Maximum upload file size in Megabytes")
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".docx", ".png", ".jpg", ".jpeg"]
    RATE_LIMIT_PER_MINUTE: int = Field(default=60, description="Requests per minute rate limit")

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
