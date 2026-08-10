from typing import List, Union
import json
from urllib.parse import quote_plus
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Career DNA API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "career_dna_super_secret_jwt_key_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = ""
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "career_dna"

    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/career_dna"
    SQLITE_FALLBACK_URL: str = "sqlite:///./career_dna.db"

    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def sync_database_url(self) -> str:
        if self.POSTGRES_PASSWORD:
            user = quote_plus(self.POSTGRES_USER)
            password = quote_plus(self.POSTGRES_PASSWORD)
            return f"postgresql://{user}:{password}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        return self.DATABASE_URL

    def get_cors_origins(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, str):
            try:
                parsed = json.loads(self.CORS_ORIGINS)
                if isinstance(parsed, list):
                    return parsed
            except Exception:
                pass
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
        return self.CORS_ORIGINS


settings = Settings()

