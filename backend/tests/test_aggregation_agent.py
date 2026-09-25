"""Unit tests for Agent 4: Aggregation Agent."""
import pytest
from app.agents.aggregation_agent import run_aggregation_agent
from app.models.schemas import ClauseAnalysis, SeverityLevel, ClauseCategory

@pytest.mark.asyncio
async def test_aggregation_agent_rollup():
    """Test score aggregation, headline generation, and report synthesis."""
    analyzed_clauses = [
        ClauseAnalysis(
            clause_id="c-01",
            category=ClauseCategory.EMPLOYMENT,
            title="Non-Compete",
            original_text="Employee will not compete worldwide for 2 years.",
            severity=SeverityLevel.CRITICAL,
            risk_score=92.0,
            plain_explanation="Cannot work in your field.",
            risk_rationale="Overly restrictive worldwide scope."
        ),
        ClauseAnalysis(
            clause_id="c-02",
            category=ClauseCategory.TOS,
            title="Dispute Resolution",
            original_text="Arbitration in Delaware.",
            severity=SeverityLevel.MEDIUM,
            risk_score=55.0,
            plain_explanation="Arbitration in distant state.",
            risk_rationale="Venue inconvenient."
        )
    ]

    state = {
        "document_id": "test-doc-001",
        "filename": "test_contract.pdf",
        "file_type": "PDF",
        "user_id": "test_user",
        "start_time": 0.0,
        "analyzed_clauses": analyzed_clauses,
        "agent_traces": []
    }

    result = await run_aggregation_agent(state)

    report = result.get("final_report")
    assert report is not None
    assert report.document_id == "test-doc-001"
    assert report.overall_risk_score > 60.0
    assert report.overall_risk_level in [SeverityLevel.HIGH, SeverityLevel.CRITICAL]
    assert report.total_clauses_extracted == 2
    assert report.flagged_clauses_count == 2
    assert "LexGuard" in report.disclaimer
    assert len(report.agent_traces) == 1
    assert report.agent_traces[0].agent_name == "Aggregation Agent"
