"""Unit tests for Agent 2: Clause Extraction Agent."""
import pytest
from app.agents.clause_extraction_agent import run_clause_extraction_agent

@pytest.mark.asyncio
async def test_clause_extraction_agent(sample_employment_contract_text):
    """Test clause segmentation and category taxonomy classification."""
    state = {
        "raw_text": sample_employment_contract_text,
        "agent_traces": []
    }

    result = await run_clause_extraction_agent(state)

    clauses = result.get("extracted_clauses", [])
    assert len(clauses) >= 2
    for c in clauses:
        assert "clause_id" in c
        assert "category" in c
        assert "original_text" in c
        assert len(c["original_text"]) > 10

    # Ensure trace was logged
    assert len(result["agent_traces"]) == 1
    assert result["agent_traces"][0].agent_name == "Clause Extraction Agent"
    assert result["agent_traces"][0].status == "success"

@pytest.mark.asyncio
async def test_clause_extraction_empty_text():
    """Test handling of empty text input."""
    state = {
        "raw_text": "",
        "agent_traces": []
    }

    result = await run_clause_extraction_agent(state)
    assert len(result.get("extracted_clauses", [])) == 0
