"""Agent 3: Risk Reasoning Agent.
Performs in-depth step-by-step legal risk reasoning for each clause.
Queries Chroma vector store for standard fair benchmarks, identifies hidden liabilities,
detects one-sided obligations and ambiguous language, and assigns severity scores (Low/Med/High/Critical)
with plain-language translations and actionable redline negotiation recommendations.
"""
import time
import logging
from typing import Dict, Any, List

from app.config import settings
from app.services.gemini_client import gemini_service
from app.services.vector_store import vector_store
from app.models.schemas import (
    AgentTrace, 
    ClauseAnalysis, 
    SeverityLevel, 
    ClauseCategory, 
    BenchmarkClause
)

logger = logging.getLogger("lexguard.agent.risk_reasoning")

REASONING_PROMPT = """You are a senior rights advocate and contract intelligence reasoning specialist at LexGuard.
Analyze the following clause thoroughly and evaluate its legal risk and fairness.

Clause Title: {title}
Category: {category}
Clause Text:
\"\"\"{original_text}\"\"\"

Benchmark Comparison Standard (Fair / Balanced industry standard):
Title: {bench_title}
Standard Text: \"\"\"{bench_text}\"\"\"
Benchmark Safeguards: {bench_safeguards}

Perform step-by-step risk reasoning from the perspective of the affected signer / adhering party:
1. Identify any hidden liabilities, indemnities, or uncapped risks.
2. Detect one-sided obligations (e.g. non-competes, auto-renewals, unilateral rights, arbitration).
3. Check for ambiguous, contradictory, or subjective language.
4. Compare against the provided standard benchmark.
5. Determine severity level: Low, Medium, High, or Critical.
6. Provide a risk score (0 to 100).
7. Explain in plain, friendly, non-legal terminology what this means in practice ("What this means for you").
8. Provide a pragmatic negotiation recommendation with redline wording to suggest.

Return ONLY a valid JSON object matching this structure:
{{
  "severity": "High",
  "risk_score": 82.5,
  "plain_explanation": "Simple, direct explanation without legal jargon...",
  "risk_rationale": "Detailed explanation of why this clause is dangerous or one-sided...",
  "hidden_liabilities": ["Liability 1", "Liability 2"],
  "ambiguities_or_contradictions": ["Ambiguity 1"],
  "negotiation_recommendation": "Suggested redline or counter-language..."
}}
"""

async def run_risk_reasoning_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    """Risk Reasoning Agent node in LangGraph pipeline."""
    start_time = time.time()
    extracted_clauses = state.get("extracted_clauses", [])
    logger.info("Risk Reasoning Agent analyzing %d extracted clauses...", len(extracted_clauses))

    analyzed_clauses: List[ClauseAnalysis] = []
    total_hidden_liabilities = 0
    total_ambiguities = 0

    for idx, clause_dict in enumerate(extracted_clauses):
        c_text = clause_dict.get("original_text", "")
        c_cat = clause_dict.get("category", "other")
        c_title = clause_dict.get("title", f"Clause {idx + 1}")
        c_id = clause_dict.get("clause_id", f"c-{idx + 1}")
        page_num = clause_dict.get("page_number", 1)

        # 1. Retrieve benchmark from Vector Store via semantic search
        benchmark: BenchmarkClause = vector_store.find_similar_benchmark(
            clause_text=c_text,
            category=c_cat
        )

        bench_title = benchmark.title if benchmark else "Standard Balanced Clause"
        bench_text = benchmark.standard_clause_text if benchmark else "Terms should be mutual and reasonable."
        bench_safeguards = ", ".join(benchmark.key_safeguards) if benchmark else "Mutual limits, reasonable notice"

        # 2. Run Risk Reasoning via Gemini
        prompt = REASONING_PROMPT.format(
            title=c_title,
            category=c_cat,
            original_text=c_text,
            bench_title=bench_title,
            bench_text=bench_text,
            bench_safeguards=bench_safeguards
        )

        res = await gemini_service.generate_json(
            model=settings.GEMINI_FLASH_MODEL,
            prompt=prompt
        )

        # 3. Parse severity and score
        sev_str = str(res.get("severity", "Medium")).capitalize()
        severity = SeverityLevel.MEDIUM
        for s in SeverityLevel:
            if s.value.lower() == sev_str.lower():
                severity = s
                break

        risk_score = float(res.get("risk_score", 50.0))
        risk_score = max(0.0, min(100.0, risk_score))

        hidden = res.get("hidden_liabilities", [])
        ambiguities = res.get("ambiguities_or_contradictions", [])
        total_hidden_liabilities += len(hidden)
        total_ambiguities += len(ambiguities)

        analysis = ClauseAnalysis(
            clause_id=c_id,
            category=ClauseCategory(c_cat) if c_cat in [e.value for e in ClauseCategory] else ClauseCategory.OTHER,
            title=c_title,
            original_text=c_text,
            page_number=page_num,
            severity=severity,
            risk_score=round(risk_score, 1),
            plain_explanation=res.get("plain_explanation", "Clause sets binding conditions."),
            risk_rationale=res.get("risk_rationale", "Evaluated against contract safeguards."),
            hidden_liabilities=hidden,
            ambiguities_or_contradictions=ambiguities,
            benchmark_comparison=benchmark,
            negotiation_recommendation=res.get("negotiation_recommendation", "Propose mutual liability caps."),
            confidence_score=0.92
        )
        analyzed_clauses.append(analysis)

    # Sort clauses by severity descending (Critical -> High -> Medium -> Low)
    severity_order = {SeverityLevel.CRITICAL: 0, SeverityLevel.HIGH: 1, SeverityLevel.MEDIUM: 2, SeverityLevel.LOW: 3}
    analyzed_clauses.sort(key=lambda x: (severity_order.get(x.severity, 4), -x.risk_score))

    duration = round((time.time() - start_time) * 1000, 2)
    severity_counts = {
        "Critical": sum(1 for c in analyzed_clauses if c.severity == SeverityLevel.CRITICAL),
        "High": sum(1 for c in analyzed_clauses if c.severity == SeverityLevel.HIGH),
        "Medium": sum(1 for c in analyzed_clauses if c.severity == SeverityLevel.MEDIUM),
        "Low": sum(1 for c in analyzed_clauses if c.severity == SeverityLevel.LOW),
    }

    trace = AgentTrace(
        agent_name="Risk Reasoning Agent",
        step="Multi-Clause RAG & Legal Implication Reasoning",
        duration_ms=duration,
        status="success",
        reasoning_summary=(
            f"Analyzed {len(analyzed_clauses)} clauses against Chroma benchmark library. "
            f"Flagged {severity_counts['Critical']} Critical, {severity_counts['High']} High risks. "
            f"Detected {total_hidden_liabilities} hidden liabilities and {total_ambiguities} ambiguities."
        ),
        output_summary=f"Evaluated {len(analyzed_clauses)} clauses with benchmark comparisons",
        details={
            "severity_counts": severity_counts,
            "hidden_liabilities_detected": total_hidden_liabilities,
            "ambiguities_detected": total_ambiguities
        }
    )

    traces = list(state.get("agent_traces", []))
    traces.append(trace)

    return {
        **state,
        "analyzed_clauses": analyzed_clauses,
        "agent_traces": traces
    }
