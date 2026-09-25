"""LangGraph Multi-Agent Orchestration Pipeline for LexGuard.
Coordinates:
  Node 1: Ingestion Agent (Document parsing & OCR fallback)
  Node 2: Clause Extraction Agent (Segmentation & category classification)
  Node 3: Risk Reasoning Agent (Implication reasoning, vector store RAG benchmark check, severity scoring)
  Node 4: Aggregation Agent (Weighted rollup, executive synthesis, Firestore persistence)
"""
import time
import uuid
import logging
from typing import TypedDict, List, Dict, Any, Optional

from langgraph.graph import StateGraph, START, END

from app.models.schemas import (
    ClauseAnalysis, 
    DocumentRiskReport, 
    AgentTrace
)
from app.agents.ingestion_agent import run_ingestion_agent
from app.agents.clause_extraction_agent import run_clause_extraction_agent
from app.agents.risk_reasoning_agent import run_risk_reasoning_agent
from app.agents.aggregation_agent import run_aggregation_agent

logger = logging.getLogger("lexguard.pipeline")

class LexGuardState(TypedDict, total=False):
    """Complete execution state for the LangGraph multi-agent pipeline."""
    document_id: str
    filename: str
    file_bytes: bytes
    user_id: str
    start_time: float
    # Ingestion outputs
    raw_text: str
    pages: List[str]
    page_count: int
    file_type: str
    is_scanned: bool
    extraction_method: str
    # Clause extraction outputs
    extracted_clauses: List[Dict[str, Any]]
    # Risk reasoning outputs
    analyzed_clauses: List[ClauseAnalysis]
    # Aggregation outputs
    overall_risk_score: float
    overall_risk_level: str
    summary_headline: str
    executive_summary: str
    final_report: Optional[DocumentRiskReport]
    # Traceability & Explainable AI
    agent_traces: List[AgentTrace]
    error: Optional[str]

def should_continue_after_ingestion(state: LexGuardState) -> str:
    """Check if ingestion produced sufficient text to continue."""
    if state.get("error") or not state.get("raw_text"):
        logger.warning("Pipeline halting early: no text extracted or error in ingestion.")
        return "aggregation"
    return "clause_extraction"

def should_continue_after_extraction(state: LexGuardState) -> str:
    """Check if clauses were extracted."""
    if not state.get("extracted_clauses"):
        logger.warning("No clauses identified. Moving directly to aggregation.")
        return "aggregation"
    return "risk_reasoning"

def build_lexguard_graph():
    """Builds and compiles the LangGraph StateGraph pipeline."""
    workflow = StateGraph(LexGuardState)

    # Register agent nodes
    workflow.add_node("ingestion", run_ingestion_agent)
    workflow.add_node("clause_extraction", run_clause_extraction_agent)
    workflow.add_node("risk_reasoning", run_risk_reasoning_agent)
    workflow.add_node("aggregation", run_aggregation_agent)

    # Define edges & routing
    workflow.add_edge(START, "ingestion")
    workflow.add_conditional_edges(
        "ingestion",
        should_continue_after_ingestion,
        {
            "clause_extraction": "clause_extraction",
            "aggregation": "aggregation"
        }
    )
    workflow.add_conditional_edges(
        "clause_extraction",
        should_continue_after_extraction,
        {
            "risk_reasoning": "risk_reasoning",
            "aggregation": "aggregation"
        }
    )
    workflow.add_edge("risk_reasoning", "aggregation")
    workflow.add_edge("aggregation", END)

    return workflow.compile()

# Precompiled singleton pipeline
lexguard_pipeline = build_lexguard_graph()

async def run_pipeline(
    file_bytes: bytes, 
    filename: str, 
    user_id: str = "anonymous", 
    document_id: Optional[str] = None
) -> DocumentRiskReport:
    """Convenience async wrapper to execute the full LangGraph pipeline."""
    doc_id = document_id or f"doc-{uuid.uuid4().hex[:12]}"
    initial_state: LexGuardState = {
        "document_id": doc_id,
        "filename": filename,
        "file_bytes": file_bytes,
        "user_id": user_id,
        "start_time": time.time(),
        "agent_traces": [],
        "extracted_clauses": [],
        "analyzed_clauses": []
    }

    logger.info("Executing LangGraph pipeline for document %s (ID: %s)", filename, doc_id)
    final_state = await lexguard_pipeline.ainvoke(initial_state)

    report = final_state.get("final_report")
    if not report:
        raise RuntimeError(f"Pipeline finished without producing a report: {final_state.get('error', 'Unknown error')}")

    return report
