"""Agent 2: Clause Extraction Agent.
Segments contract text into discrete, coherent contractual clauses and
classifies each clause into legal domains (employment, vendor, subscription, rental,
insurance, ToS, privacy policy, or other).
"""
import time
import logging
from typing import Dict, Any, List

from app.config import settings
from app.services.gemini_client import gemini_service
from app.models.schemas import AgentTrace, ClauseCategory

logger = logging.getLogger("lexguard.agent.clause_extraction")

EXTRACTION_PROMPT = """You are a senior contract analysis specialist in the LexGuard Intelligence System.
Analyze the following legal document text and extract all discrete, operative clauses.
For each clause, assign the most accurate category from:
- employment
- vendor
- subscription
- rental
- insurance
- tos
- privacy_policy
- other

Return a valid JSON object matching this schema:
{{
  "clauses": [
    {{
      "clause_id": "c-01",
      "category": "employment",
      "title": "Short descriptive title (e.g. Non-Competition Restriction)",
      "original_text": "Exact verbatim text of the clause as found in the document.",
      "page_number": 1
    }}
  ]
}}

Ensure you capture restrictive covenants (non-competes, non-solicits), liability disclaimers,
indemnification, dispute resolution / arbitration, termination terms, auto-renewals, IP ownership,
and data rights. Do not omit potentially one-sided or burdensome clauses.

Document Text:
---
{document_text}
---
"""

async def run_clause_extraction_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    """Clause Extraction Agent node in LangGraph pipeline."""
    start_time = time.time()
    raw_text = state.get("raw_text", "")

    logger.info("Clause Extraction Agent started. Input length: %d chars", len(raw_text))

    if not raw_text.strip():
        return {
            **state,
            "extracted_clauses": [],
            "error": "Cannot extract clauses from empty text."
        }

    try:
        # Prompt Gemini 2.5 Flash for fast clause extraction
        prompt = EXTRACTION_PROMPT.format(document_text=raw_text[:20000])
        extracted_data = await gemini_service.generate_json(
            model=settings.GEMINI_FLASH_MODEL,
            prompt=prompt
        )

        clauses = extracted_data.get("clauses", [])

        # Validate categories against ClauseCategory enum
        valid_clauses = []
        category_counts: Dict[str, int] = {}

        for idx, c in enumerate(clauses):
            cat_raw = str(c.get("category", "other")).lower().strip()
            cat = "other"
            for member in ClauseCategory:
                if member.value == cat_raw:
                    cat = member.value
                    break

            cid = c.get("clause_id") or f"clause-{idx + 1}"
            clause_obj = {
                "clause_id": cid,
                "category": cat,
                "title": c.get("title") or f"Clause {idx + 1}",
                "original_text": c.get("original_text", "").strip(),
                "page_number": c.get("page_number", 1)
            }
            if clause_obj["original_text"]:
                valid_clauses.append(clause_obj)
                category_counts[cat] = category_counts.get(cat, 0) + 1

        duration = round((time.time() - start_time) * 1000, 2)
        trace = AgentTrace(
            agent_name="Clause Extraction Agent",
            step="Segmentation & Taxonomy Tagging",
            duration_ms=duration,
            status="success",
            reasoning_summary=(
                f"Identified and segmented {len(valid_clauses)} distinct clauses across {len(category_counts)} categories. "
                f"Distribution: {dict(category_counts)}."
            ),
            output_summary=f"Extracted {len(valid_clauses)} categorized clauses",
            details={"clause_count": len(valid_clauses), "categories": category_counts}
        )

        traces = list(state.get("agent_traces", []))
        traces.append(trace)

        return {
            **state,
            "extracted_clauses": valid_clauses,
            "agent_traces": traces
        }

    except Exception as e:
        logger.error("Clause Extraction Agent error: %s", str(e), exc_info=True)
        duration = round((time.time() - start_time) * 1000, 2)
        error_trace = AgentTrace(
            agent_name="Clause Extraction Agent",
            step="Segmentation & Taxonomy Tagging",
            duration_ms=duration,
            status="error",
            reasoning_summary=f"Clause extraction failed: {str(e)}"
        )
        traces = list(state.get("agent_traces", []))
        traces.append(error_trace)
        return {
            **state,
            "extracted_clauses": [],
            "error": f"Extraction error: {str(e)}",
            "agent_traces": traces
        }
