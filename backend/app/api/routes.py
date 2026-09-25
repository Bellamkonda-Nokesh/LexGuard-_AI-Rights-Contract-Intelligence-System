"""API routes for LexGuard contract analysis, reports, history, and benchmarks."""
import os
import logging
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException, Request, Depends
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.config import settings
from app.models.schemas import (
    DocumentUploadResponse, 
    DocumentRiskReport, 
    DocumentHistoryItem, 
    HealthResponse,
    BenchmarkClause
)
from app.services.document_parser import document_parser
from app.services.sanitizer import sanitizer
from app.services.firestore_service import firestore_service
from app.services.vector_store import vector_store
from app.services.gemini_client import gemini_service
from app.agents.pipeline import run_pipeline

logger = logging.getLogger("lexguard.api")
limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api", tags=["Contract Intelligence"])

def extract_user_id(authorization: Optional[str] = Header(None)) -> str:
    """Extracts user ID from Firebase Bearer token or returns anonymous session."""
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ")[1].strip()
        # If Firebase Admin / auth verification is enabled, verify token
        try:
            # Simple decode for sub or uid token
            # In production, firebase_admin.auth.verify_id_token(token)
            return token[:32]
        except Exception:
            pass
    return "demo_user"

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """System health check and service dependency status."""
    return HealthResponse(
        status="ok",
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        gemini_configured=gemini_service.is_configured,
        firestore_configured=firestore_service.is_connected,
        vector_store_count=vector_store.get_count()
    )

@router.post("/analyze", response_model=DocumentRiskReport)
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def analyze_document(
    request: Request,
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None),
    authorization: Optional[str] = Header(None)
):
    """Real-time upload and analysis of contracts (PDF, DOCX, or scanned images).
    Executes the 4-agent LangGraph pipeline synchronously for real-time frontend session.
    """
    effective_user_id = user_id or extract_user_id(authorization)
    filename = sanitizer.sanitize_filename(file.filename or "uploaded_contract.pdf")

    # Read uploaded bytes
    try:
        content_bytes = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read uploaded file: {str(e)}")

    # Validate file type and size
    is_valid, err_msg = document_parser.validate_file(
        filename=filename,
        file_size=len(content_bytes),
        max_size_mb=settings.MAX_UPLOAD_SIZE_MB
    )
    if not is_valid:
        raise HTTPException(status_code=400, detail=err_msg)

    logger.info("Received valid upload '%s' (%d bytes) for user '%s'", filename, len(content_bytes), effective_user_id)

    # Execute LangGraph multi-agent pipeline
    try:
        report = await run_pipeline(
            file_bytes=content_bytes,
            filename=filename,
            user_id=effective_user_id
        )
        return report
    except Exception as e:
        logger.error("Error executing analysis pipeline: %s", str(e), exc_info=True)
        raise HTTPException(status_code=500, detail=f"Contract analysis failed: {str(e)}")

@router.get("/documents/{document_id}", response_model=DocumentRiskReport)
async def get_document(
    document_id: str,
    user_id: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    """Retrieve an existing risk intelligence report from Firestore."""
    effective_user_id = user_id or extract_user_id(authorization)
    report_dict = await firestore_service.get_document_report(
        user_id=effective_user_id,
        document_id=document_id
    )
    if not report_dict:
        raise HTTPException(status_code=404, detail="Document report not found")
    return DocumentRiskReport(**report_dict)

@router.get("/history", response_model=List[DocumentHistoryItem])
async def get_document_history(
    user_id: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    """List previous analyzed contracts and risk scores for the user."""
    effective_user_id = user_id or extract_user_id(authorization)
    items = await firestore_service.list_user_documents(user_id=effective_user_id)
    return [DocumentHistoryItem(**item) for item in items]

@router.get("/benchmarks", response_model=List[BenchmarkClause])
async def get_benchmarks(category: Optional[str] = None):
    """Retrieve the standard fair clause benchmark library."""
    if not vector_store._fallback_records:
        vector_store.seed_from_file()

    clauses = []
    for r in vector_store._fallback_records:
        d = r["data"]
        if not category or d.get("category", "").lower() == category.lower():
            clauses.append(BenchmarkClause(
                id=d.get("id", ""),
                category=d.get("category", ""),
                clause_type=d.get("clause_type", ""),
                title=d.get("title", ""),
                standard_clause_text=d.get("standard_clause_text", ""),
                fairness_rationale=d.get("fairness_rationale", ""),
                key_safeguards=d.get("key_safeguards", []),
                typical_red_flags=d.get("typical_red_flags", [])
            ))
    return clauses
