"""Unit tests for Agent 1: Ingestion Agent."""
import pytest
from app.agents.ingestion_agent import run_ingestion_agent

@pytest.mark.asyncio
async def test_ingestion_agent_valid_text(sample_file_bytes):
    """Test ingestion with valid contract content."""
    initial_state = {
        "filename": "sample_contract.docx",
        "file_bytes": sample_file_bytes,
        "agent_traces": []
    }

    result = await run_ingestion_agent(initial_state)

    assert "raw_text" in result
    assert len(result["raw_text"]) > 100
    assert result["file_type"] == "DOCX"
    assert len(result["agent_traces"]) == 1
    assert result["agent_traces"][0].agent_name == "Ingestion Agent"
    assert result["agent_traces"][0].status == "success"

@pytest.mark.asyncio
async def test_ingestion_agent_sanitization():
    """Test that ingestion agent strips HTML and dangerous script tags."""
    dangerous_content = (
        "<html><body><script>alert('xss')</script>"
        "<h1>Employment Contract</h1>"
        "<p>Employee will not compete for 12 months.</p></body></html>"
    ).encode("utf-8")

    initial_state = {
        "filename": "contract.docx",
        "file_bytes": dangerous_content,
        "agent_traces": []
    }

    result = await run_ingestion_agent(initial_state)
    assert "<script>" not in result["raw_text"]
    assert "alert" in result["raw_text"] or "Employment Contract" in result["raw_text"]
