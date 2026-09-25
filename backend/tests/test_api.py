"""API integration tests for LexGuard endpoints."""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_endpoint():
    """Verify health endpoint responds with system diagnostics."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "version" in data
        assert "vector_store_count" in data

@pytest.mark.asyncio
async def test_benchmarks_endpoint():
    """Verify benchmarks endpoint returns standard fair clauses."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/benchmarks")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert "standard_clause_text" in data[0]

@pytest.mark.asyncio
async def test_analyze_file_endpoint(sample_file_bytes):
    """Verify file upload and real-time analysis endpoint."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        files = {
            "file": ("nda_contract.docx", sample_file_bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        }
        response = await ac.post("/api/analyze", files=files)
        assert response.status_code == 200
        data = response.json()
        assert "overall_risk_score" in data
        assert "overall_risk_level" in data
        assert "clauses" in data
        assert "agent_traces" in data
        assert len(data["agent_traces"]) == 4

@pytest.mark.asyncio
async def test_history_endpoint():
    """Verify document history endpoint returns list."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/history")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
