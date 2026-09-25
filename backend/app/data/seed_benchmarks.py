"""Seed script to index standard/fair benchmark clauses into the Chroma vector store.
Can be executed standalone or automatically upon application startup.
"""
import os
import sys
import json
import logging

# Ensure backend root is on sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.dirname(CURRENT_DIR)
BACKEND_DIR = os.path.dirname(APP_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.services.vector_store import vector_store
from app.config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("lexguard.seed")

def seed_benchmark_clauses(json_path: str = None) -> int:
    """Reads benchmark JSON and inserts entries into ChromaDB vector collection."""
    path = json_path or settings.BENCHMARK_FILE_PATH
    logger.info("Starting benchmark seeding from %s ...", path)

    if not os.path.exists(path):
        logger.error("Benchmark file not found at %s", path)
        return 0

    with open(path, "r", encoding="utf-8") as f:
        clauses = json.load(f)

    logger.info("Loaded %d benchmark clauses from JSON.", len(clauses))
    count = vector_store.seed_clauses(clauses)
    logger.info("Successfully seeded %d clauses into Chroma vector store at '%s'", count, settings.CHROMA_PERSIST_DIR)
    return count

if __name__ == "__main__":
    count = seed_benchmark_clauses()
    print(f"Seeding completed. Total indexed clauses: {count}")
