import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

# Import all models so they register on Base.metadata upon module load
import app.models  # noqa: F401

# Attempt PostgreSQL first, fall back to SQLite if PostgreSQL connection fails
engine = None
try:
    db_url = settings.sync_database_url
    if db_url and db_url.startswith("postgresql"):
        temp_engine = create_engine(
            db_url,
            pool_pre_ping=True
        )
        # Test connection
        with temp_engine.connect() as conn:
            logger.info("Successfully connected to PostgreSQL database.")
        engine = temp_engine
except Exception as e:
    logger.warning(f"Could not connect to PostgreSQL ({e}). Falling back to SQLite database at {settings.SQLITE_FALLBACK_URL}")

if engine is None:
    engine = create_engine(
        settings.SQLITE_FALLBACK_URL,
        connect_args={"check_same_thread": False}
    )
    logger.info(f"Using SQLite database engine: {settings.SQLITE_FALLBACK_URL}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """FastAPI dependency that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initializes all database tables."""
    import app.models  # noqa: F401 - ensures all models are imported & registered on Base.metadata
    Base.metadata.create_all(bind=engine)

