"""Main FastAPI application for LexGuard — AI Rights & Contract Intelligence System.
Initializes middleware, CORS, rate limiting, and seeds the vector store on startup.
"""
import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.api.routes import router, limiter
from app.data.seed_benchmarks import seed_benchmark_clauses

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("lexguard.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle events."""
    logger.info("Initializing LexGuard service...")
    # Seed benchmark dataset into ChromaDB
    try:
        count = seed_benchmark_clauses()
        logger.info("ChromaDB initialized with %d standard clause benchmarks.", count)
    except Exception as e:
        logger.warning("Auto-seed error on startup: %s", str(e))
    yield
    logger.info("Shutting down LexGuard service.")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Autonomous AI Rights & Contract Intelligence System. "
        "Deconstructs complex contracts, detects one-sided liabilities, and benchmarks clauses."
    ),
    lifespan=lifespan
)

# Attach rate limiter
app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please wait before submitting another contract."}
    )

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API endpoints
app.include_router(router)

@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs_url": "/docs",
        "health_url": "/api/health",
        "disclaimer": "Informational only. Does not provide legally binding legal advice."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
