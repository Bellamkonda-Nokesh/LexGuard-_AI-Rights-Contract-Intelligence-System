"""Agent 1: Ingestion Agent.
Responsible for extracting raw text, structure, page divisions, and file metadata
from uploaded legal/quasi-legal documents (PDF, DOCX, or scanned images).
"""
import time
import logging
from typing import Dict, Any

from app.services.document_parser import document_parser
from app.services.sanitizer import sanitizer
from app.services.gemini_client import gemini_service
from app.models.schemas import AgentTrace

logger = logging.getLogger("lexguard.agent.ingestion")

async def run_ingestion_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    """Ingestion Agent node in LangGraph pipeline."""
    start_time = time.time()
    filename = state.get("filename", "unknown_document.pdf")
    file_bytes = state.get("file_bytes", b"")

    logger.info("Ingestion Agent started for %s (%d bytes)", filename, len(file_bytes))

    try:
        # 1. Parse document structure
        parsed = await document_parser.extract_content(
            file_bytes=file_bytes,
            filename=filename,
            gemini_service=gemini_service
        )

        raw_text = parsed.get("raw_text", "")

        # 2. Sanitize extracted text
        clean_text = sanitizer.sanitize_text(raw_text)

        duration = round((time.time() - start_time) * 1000, 2)
        trace = AgentTrace(
            agent_name="Ingestion Agent",
            step="Document Extraction & Normalization",
            duration_ms=duration,
            status="success",
            reasoning_summary=(
                f"Successfully parsed {parsed.get('file_type')} via {parsed.get('extraction_method')}. "
                f"Extracted {len(clean_text)} characters across {parsed.get('page_count')} page(s). "
                f"Scanned fallback flag: {parsed.get('is_scanned')}."
            ),
            output_summary=f"Extracted clean text ({len(clean_text)} chars)",
            details={
                "page_count": parsed.get("page_count"),
                "is_scanned": parsed.get("is_scanned"),
                "method": parsed.get("extraction_method"),
                "char_count": len(clean_text)
            }
        )

        traces = list(state.get("agent_traces", []))
        traces.append(trace)

        return {
            **state,
            "raw_text": clean_text,
            "pages": parsed.get("pages", [clean_text]),
            "page_count": parsed.get("page_count", 1),
            "file_type": parsed.get("file_type", "UNKNOWN"),
            "is_scanned": parsed.get("is_scanned", False),
            "extraction_method": parsed.get("extraction_method", "direct"),
            "agent_traces": traces
        }

    except Exception as e:
        logger.error("Ingestion Agent encountered error: %s", str(e), exc_info=True)
        duration = round((time.time() - start_time) * 1000, 2)
        error_trace = AgentTrace(
            agent_name="Ingestion Agent",
            step="Document Extraction & Normalization",
            duration_ms=duration,
            status="error",
            reasoning_summary=f"Ingestion failed: {str(e)}",
            output_summary="Failed to parse document"
        )
        traces = list(state.get("agent_traces", []))
        traces.append(error_trace)
        return {
            **state,
            "error": f"Ingestion error: {str(e)}",
            "agent_traces": traces
        }
