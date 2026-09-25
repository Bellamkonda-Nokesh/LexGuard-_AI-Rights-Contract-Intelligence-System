"""Agent 4: Aggregation Agent.
Rolls per-clause scores into an overall document risk score, utilizes Gemini 2.5 Pro
for executive risk synthesis and headline generation, packages the full intelligence report,
and logs explainability traces to Firestore.
"""
import time
import logging
from typing import Dict, Any, List
from datetime import datetime, timezone

from app.config import settings
from app.services.gemini_client import gemini_service
from app.services.firestore_service import firestore_service
from app.models.schemas import (
    AgentTrace, 
    DocumentRiskReport, 
    SeverityLevel, 
    ClauseAnalysis
)

logger = logging.getLogger("lexguard.agent.aggregation")

AGGREGATION_PROMPT = """You are a chief risk intelligence officer and senior counsel at LexGuard.
Synthesize the analyzed contractual clauses into an executive risk report.

Document Name: {filename}
Total Clauses Analyzed: {total_clauses}
Severity Breakdown: {severity_breakdown}
Critical/High Clauses Summary:
{clauses_summary}

Tasks:
1. Provide a concise, high-impact headline summarizing the document's legal stance.
2. Provide a detailed executive summary (2-3 paragraphs) explaining:
   - The primary hazards or one-sided obligations found in this document.
   - What the signer is giving up or risking.
   - Strategic next steps and priority clauses to negotiate.
3. Compute an overall risk assessment score (0-100) where 0 is completely standard/safe and 100 is catastrophic risk.

Return ONLY a valid JSON object matching:
{{
  "overall_risk_score": 74.0,
  "overall_risk_level": "High",
  "summary_headline": "One-Sided Contract with Severe Post-Employment and Liability Burdens",
  "executive_summary": "Paragraph 1...\\n\\nParagraph 2..."
}}
"""

async def run_aggregation_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    """Aggregation Agent node in LangGraph pipeline."""
    start_time = time.time()
    filename = state.get("filename", "contract.pdf")
    document_id = state.get("document_id", f"doc-{int(time.time())}")
    user_id = state.get("user_id", "anonymous")
    file_type = state.get("file_type", "PDF")
    pipeline_start = state.get("start_time", start_time)

    analyzed_clauses: List[ClauseAnalysis] = state.get("analyzed_clauses", [])

    logger.info("Aggregation Agent rolling up report for %s (%d clauses)...", filename, len(analyzed_clauses))

    # Calculate breakdowns
    sev_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
    cat_counts: Dict[str, int] = {}
    sum_score = 0.0

    for c in analyzed_clauses:
        sev_counts[c.severity.value] = sev_counts.get(c.severity.value, 0) + 1
        cat_counts[c.category.value] = cat_counts.get(c.category.value, 0) + 1
        sum_score += c.risk_score

    # Weighted calculation
    if analyzed_clauses:
        # Heavily weight critical and high clauses
        weighted_score = (
            (sev_counts["Critical"] * 95.0) +
            (sev_counts["High"] * 80.0) +
            (sev_counts["Medium"] * 50.0) +
            (sev_counts["Low"] * 20.0)
        ) / max(1, len(analyzed_clauses))
        # Blend simple average and weighted score
        avg_score = sum_score / len(analyzed_clauses)
        final_score = round(min(100.0, max(0.0, (weighted_score * 0.7) + (avg_score * 0.3))), 1)
    else:
        final_score = 0.0

    # Determine severity label
    if final_score >= 80.0 or sev_counts["Critical"] > 0:
        overall_level = SeverityLevel.CRITICAL if sev_counts["Critical"] >= 2 or final_score >= 85.0 else SeverityLevel.HIGH
    elif final_score >= 60.0 or sev_counts["High"] > 0:
        overall_level = SeverityLevel.HIGH
    elif final_score >= 35.0:
        overall_level = SeverityLevel.MEDIUM
    else:
        overall_level = SeverityLevel.LOW

    # Prepare summary text of high/critical clauses for Gemini 2.5 Pro synthesis
    flagged_summaries = []
    for c in analyzed_clauses:
        if c.severity in [SeverityLevel.CRITICAL, SeverityLevel.HIGH, SeverityLevel.MEDIUM]:
            flagged_summaries.append(f"[{c.severity.value}] {c.title}: {c.plain_explanation}")

    clauses_summary_str = "\n".join(flagged_summaries[:8]) or "No high-risk clauses identified."

    prompt = AGGREGATION_PROMPT.format(
        filename=filename,
        total_clauses=len(analyzed_clauses),
        severity_breakdown=sev_counts,
        clauses_summary=clauses_summary_str
    )

    # Use Gemini 2.5 Pro for deep executive reasoning
    synth_res = await gemini_service.generate_json(
        model=settings.GEMINI_PRO_MODEL,
        prompt=prompt
    )

    headline = synth_res.get(
        "summary_headline", 
        f"Contract Risk Analysis: {overall_level.value} Risk Rating ({final_score}/100)"
    )
    exec_summary = synth_res.get(
        "executive_summary",
        f"LexGuard analyzed {len(analyzed_clauses)} contractual clauses. "
        f"The document received an overall risk rating of {overall_level.value} ({final_score}/100) with "
        f"{sev_counts['Critical']} Critical and {sev_counts['High']} High severity issues identified."
    )

    duration = round((time.time() - start_time) * 1000, 2)
    total_pipeline_sec = round(time.time() - pipeline_start, 2)

    traces = list(state.get("agent_traces", []))
    trace = AgentTrace(
        agent_name="Aggregation Agent",
        step="Multi-Agent Rollup & Executive Synthesis",
        duration_ms=duration,
        status="success",
        reasoning_summary=(
            f"Generated executive risk report. Weighted risk score: {final_score}/100 ({overall_level.value}). "
            f"Synthesized {len(analyzed_clauses)} clauses into strategic recommendations using Gemini 2.5 Pro."
        ),
        output_summary=f"Report ready: {overall_level.value} risk ({final_score}/100)",
        details={
            "score": final_score,
            "level": overall_level.value,
            "headline": headline,
            "total_time_seconds": total_pipeline_sec
        }
    )
    traces.append(trace)

    flagged_count = sev_counts["Critical"] + sev_counts["High"] + sev_counts["Medium"]

    # Construct final DocumentRiskReport
    report = DocumentRiskReport(
        document_id=document_id,
        filename=filename,
        file_type=file_type,
        uploaded_at=datetime.now(timezone.utc).isoformat(),
        overall_risk_score=final_score,
        overall_risk_level=overall_level,
        summary_headline=headline,
        executive_summary=exec_summary,
        total_clauses_extracted=len(analyzed_clauses),
        flagged_clauses_count=flagged_count,
        severity_breakdown=sev_counts,
        category_breakdown=cat_counts,
        clauses=analyzed_clauses,
        agent_traces=traces,
        processing_time_seconds=total_pipeline_sec
    )

    # Persist report and traces to Firestore / local session store
    await firestore_service.save_document_report(
        user_id=user_id,
        document_id=document_id,
        report_data=report.model_dump()
    )

    # Log traces individually to Firestore for explainability panel
    for t in traces:
        await firestore_service.log_agent_trace(
            user_id=user_id,
            document_id=document_id,
            trace_data=t.model_dump()
        )

    return {
        **state,
        "overall_risk_score": final_score,
        "overall_risk_level": overall_level.value,
        "summary_headline": headline,
        "executive_summary": exec_summary,
        "final_report": report,
        "agent_traces": traces
    }
