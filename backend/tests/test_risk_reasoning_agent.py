"""Unit tests for Agent 3: Risk Reasoning Agent."""
import pytest
from app.agents.risk_reasoning_agent import run_risk_reasoning_agent
from app.models.schemas import SeverityLevel

@pytest.mark.asyncio
async def test_risk_reasoning_agent_critical_clause():
    """Test step-by-step reasoning on high-risk non-compete clause."""
    state = {
        "extracted_clauses": [
            {
                "clause_id": "c-01",
                "category": "employment",
                "title": "Worldwide Non-Compete",
                "original_text": "Employee shall not engage in competing business worldwide for two years post-employment.",
                "page_number": 1
            }
        ],
        "agent_traces": []
    }

    result = await run_risk_reasoning_agent(state)
    analyzed = result.get("analyzed_clauses", [])

    assert len(analyzed) == 1
    clause = analyzed[0]

    # Verify severity and scoring
    assert clause.severity in [SeverityLevel.HIGH, SeverityLevel.CRITICAL]
    assert clause.risk_score >= 70.0
    assert len(clause.plain_explanation) > 20
    assert len(clause.risk_rationale) > 20
    assert clause.benchmark_comparison is not None
    assert clause.negotiation_recommendation is not None

    # Check trace
    assert len(result["agent_traces"]) == 1
    assert result["agent_traces"][0].agent_name == "Risk Reasoning Agent"
