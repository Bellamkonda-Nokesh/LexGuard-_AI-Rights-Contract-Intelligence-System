"""End-to-End Integration tests for the LexGuard LangGraph Multi-Agent Pipeline."""
import pytest
from app.agents.pipeline import run_pipeline
from app.models.schemas import DocumentRiskReport, SeverityLevel

@pytest.mark.asyncio
async def test_full_pipeline_employment_contract(sample_file_bytes):
    """Run complete 4-agent pipeline on sample employment contract."""
    report: DocumentRiskReport = await run_pipeline(
        file_bytes=sample_file_bytes,
        filename="Senior_Executive_Agreement.docx",
        user_id="integration_tester"
    )

    # 1. Validate complete report structure
    assert isinstance(report, DocumentRiskReport)
    assert report.filename == "Senior_Executive_Agreement.docx"
    assert report.overall_risk_score > 50.0
    assert report.overall_risk_level in [SeverityLevel.HIGH, SeverityLevel.CRITICAL]

    # 2. Validate clauses
    assert len(report.clauses) >= 2
    for c in report.clauses:
        assert c.plain_explanation
        assert c.risk_rationale
        assert c.risk_score >= 0.0

    # 3. Validate Explainable AI Agent Traces (All 4 agents must have executed)
    agent_names = [t.agent_name for t in report.agent_traces]
    assert "Ingestion Agent" in agent_names
    assert "Clause Extraction Agent" in agent_names
    assert "Risk Reasoning Agent" in agent_names
    assert "Aggregation Agent" in agent_names

    # 4. Validate mandatory legal disclaimer
    assert "not provide legally binding advice" in report.disclaimer.lower()
