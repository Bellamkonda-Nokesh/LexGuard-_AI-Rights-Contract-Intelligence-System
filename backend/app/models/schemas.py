"""Pydantic schemas and models for LexGuard API, agents, and data contracts."""
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, timezone

class SeverityLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class ClauseCategory(str, Enum):
    EMPLOYMENT = "employment"
    VENDOR = "vendor"
    SUBSCRIPTION = "subscription"
    RENTAL = "rental"
    INSURANCE = "insurance"
    TOS = "tos"
    PRIVACY_POLICY = "privacy_policy"
    OTHER = "other"

class BenchmarkClause(BaseModel):
    """Reference standard/fair clause representation."""
    id: str
    category: str
    clause_type: str
    title: str
    standard_clause_text: str
    fairness_rationale: str
    key_safeguards: List[str] = Field(default_factory=list)
    typical_red_flags: List[str] = Field(default_factory=list)
    similarity_score: Optional[float] = None

class ClauseAnalysis(BaseModel):
    """Detailed risk analysis of an individual clause extracted from a contract."""
    clause_id: str = Field(description="Unique identifier for the clause within document")
    category: ClauseCategory = Field(description="Contractual clause category")
    title: str = Field(description="Descriptive clause heading or identifier")
    original_text: str = Field(description="Exact verbatim text of the clause")
    page_number: Optional[int] = Field(default=1, description="Page number where clause was found")
    severity: SeverityLevel = Field(description="Calculated risk severity")
    risk_score: float = Field(ge=0.0, le=100.0, description="Risk score from 0 (harmless) to 100 (critical hazard)")
    plain_explanation: str = Field(description="Plain-language explanation from affected party's perspective")
    risk_rationale: str = Field(description="Detailed step-by-step risk reasoning")
    hidden_liabilities: List[str] = Field(default_factory=list, description="Hidden liabilities identified")
    ambiguities_or_contradictions: List[str] = Field(default_factory=list, description="Vague or contradictory terms")
    benchmark_comparison: Optional[BenchmarkClause] = Field(default=None, description="Matched standard fair clause benchmark")
    negotiation_recommendation: Optional[str] = Field(default=None, description="Suggested counter-clause or redline language")
    confidence_score: float = Field(default=0.95, ge=0.0, le=1.0)

class AgentTrace(BaseModel):
    """Execution and explainability trace log for a single agent."""
    agent_name: str
    step: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    duration_ms: float = 0.0
    status: str = "success"
    reasoning_summary: str
    output_summary: Optional[str] = None
    details: Dict[str, Any] = Field(default_factory=dict)

class DocumentRiskReport(BaseModel):
    """Complete aggregated intelligence report for an analyzed document."""
    document_id: str
    filename: str
    file_type: str
    uploaded_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    overall_risk_score: float = Field(ge=0.0, le=100.0)
    overall_risk_level: SeverityLevel
    summary_headline: str
    executive_summary: str
    total_clauses_extracted: int
    flagged_clauses_count: int
    severity_breakdown: Dict[str, int]
    category_breakdown: Dict[str, int]
    clauses: List[ClauseAnalysis]
    agent_traces: List[AgentTrace]
    disclaimer: str = (
        "LexGuard is an automated AI intelligence tool designed for informational and preliminary review purposes only. "
        "LexGuard does NOT provide legally binding advice, attorney representation, or formal legal opinions. "
        "Always consult a qualified, licensed attorney before signing or executing any legal agreement."
    )
    processing_time_seconds: float = 0.0

class DocumentUploadResponse(BaseModel):
    status: str = "success"
    document_id: str
    filename: str
    report: Optional[DocumentRiskReport] = None

class DocumentHistoryItem(BaseModel):
    document_id: str
    filename: str
    uploaded_at: str
    overall_risk_score: float
    overall_risk_level: SeverityLevel
    flagged_clauses_count: int
    total_clauses: int
    summary_headline: str

class HealthResponse(BaseModel):
    status: str = "ok"
    version: str
    environment: str
    gemini_configured: bool
    firestore_configured: bool
    vector_store_count: int
