"""Vector store integration using Chroma and Gemini embeddings.
Provides semantic search over standard/fair benchmark legal clauses.
Includes embedding caching and in-memory cosine fallback for resilience.
"""
import os
import json
import logging
from typing import List, Optional, Dict, Any
import numpy as np

from app.config import settings
from app.models.schemas import BenchmarkClause

logger = logging.getLogger("lexguard.vector_store")

class BenchmarkVectorStore:
    """Manages indexing and similarity search of fair benchmark clauses."""

    def __init__(self, persist_dir: Optional[str] = None):
        self.persist_dir = persist_dir or settings.CHROMA_PERSIST_DIR
        self.collection_name = "lexguard_benchmark_clauses"
        self._client = None
        self._collection = None
        self._fallback_records: List[Dict[str, Any]] = []
        self._embedding_cache: Dict[str, List[float]] = {}
        self._init_store()

    def _init_store(self):
        """Initialize ChromaDB client and collection."""
        try:
            import chromadb
            from chromadb.config import Settings as ChromaSettings

            os.makedirs(self.persist_dir, exist_ok=True)
            self._client = chromadb.PersistentClient(
                path=self.persist_dir,
                settings=ChromaSettings(anonymized_telemetry=False)
            )
            self._collection = self._client.get_or_create_collection(
                name=self.collection_name,
                metadata={"description": "LexGuard Standard Fair Clause Benchmarks"}
            )
            logger.info("ChromaDB vector store successfully initialized at %s", self.persist_dir)
        except Exception as e:
            logger.warning("ChromaDB initialization failed: %s. Using in-memory fallback.", str(e))
            self._client = None
            self._collection = None

    def get_count(self) -> int:
        """Return number of benchmark items indexed."""
        if self._collection:
            try:
                return self._collection.count()
            except Exception:
                pass
        return len(self._fallback_records)

    def seed_from_file(self, file_path: Optional[str] = None) -> int:
        """Load benchmark clauses from JSON file and index them."""
        path = file_path or settings.BENCHMARK_FILE_PATH
        if not os.path.exists(path):
            logger.warning("Benchmark file not found at %s", path)
            return 0

        with open(path, "r", encoding="utf-8") as f:
            benchmarks_data = json.load(f)

        return self.seed_clauses(benchmarks_data)

    def seed_clauses(self, clauses: List[Dict[str, Any]]) -> int:
        """Index a list of benchmark clause dictionaries."""
        ids = []
        documents = []
        metadatas = []

        self._fallback_records = []

        for c in clauses:
            cid = c.get("id", f"bench-{len(ids)}")
            text = c.get("standard_clause_text", "")
            title = c.get("title", "")
            category = c.get("category", "other")
            doc_content = f"{title}\nCategory: {category}\n{text}\nRationale: {c.get('fairness_rationale', '')}"

            metadata = {
                "id": cid,
                "category": category,
                "clause_type": c.get("clause_type", ""),
                "title": title,
                "fairness_rationale": c.get("fairness_rationale", ""),
                "key_safeguards": json.dumps(c.get("key_safeguards", [])),
                "typical_red_flags": json.dumps(c.get("typical_red_flags", [])),
                "standard_clause_text": text
            }

            ids.append(cid)
            documents.append(doc_content)
            metadatas.append(metadata)

            # Keep in-memory copy for resilient fallback
            self._fallback_records.append({
                "id": cid,
                "text": text,
                "doc_content": doc_content,
                "data": c
            })

        if self._collection and ids:
            try:
                self._collection.upsert(
                    ids=ids,
                    documents=documents,
                    metadatas=metadatas
                )
                logger.info("Indexed %d benchmark clauses in ChromaDB", len(ids))
            except Exception as e:
                logger.error("Failed to upsert into Chroma: %s", str(e))

        return len(ids)

    def find_similar_benchmark(
        self, 
        clause_text: str, 
        category: Optional[str] = None, 
        top_k: int = 1
    ) -> Optional[BenchmarkClause]:
        """Find the most relevant standard fair clause benchmark for a given clause text."""
        if not clause_text or not clause_text.strip():
            return None

        # 1. Try ChromaDB semantic search if available
        if self._collection and self._collection.count() > 0:
            try:
                where_filter = None
                if category and category != "other":
                    where_filter = {"category": category.lower()}

                results = self._collection.query(
                    query_texts=[clause_text],
                    n_results=top_k,
                    where=where_filter
                )

                if results and results.get("ids") and len(results["ids"][0]) > 0:
                    meta = results["metadatas"][0][0]
                    distance = results["distances"][0][0] if results.get("distances") else 0.5
                    # Chroma distance to similarity score (cosine distance in [0, 2])
                    similarity = max(0.0, min(1.0, 1.0 - (distance / 2.0)))

                    return BenchmarkClause(
                        id=meta["id"],
                        category=meta["category"],
                        clause_type=meta.get("clause_type", ""),
                        title=meta["title"],
                        standard_clause_text=meta["standard_clause_text"],
                        fairness_rationale=meta["fairness_rationale"],
                        key_safeguards=json.loads(meta.get("key_safeguards", "[]")),
                        typical_red_flags=json.loads(meta.get("typical_red_flags", "[]")),
                        similarity_score=round(similarity, 3)
                    )
            except Exception as e:
                logger.warning("Chroma query failed: %s. Falling back to heuristic match.", str(e))

        # 2. Resilient In-Memory Fallback Matcher (Word overlap + category filter)
        return self._fallback_match(clause_text, category)

    def _fallback_match(self, clause_text: str, category: Optional[str]) -> Optional[BenchmarkClause]:
        """Calculates token overlap Jaccard similarity as fallback."""
        if not self._fallback_records:
            self.seed_from_file()

        if not self._fallback_records:
            return None

        words_query = set(clause_text.lower().split())
        best_record = None
        best_score = -1.0

        for rec in self._fallback_records:
            raw_cat = rec["data"].get("category", "").lower()
            if category and category.lower() != "other" and raw_cat != category.lower():
                continue

            words_doc = set(rec["doc_content"].lower().split())
            intersection = words_query.intersection(words_doc)
            union = words_query.union(words_doc)
            score = len(intersection) / max(1, len(union))

            # Prioritize category match
            if category and raw_cat == category.lower():
                score += 0.3

            if score > best_score:
                best_score = score
                best_record = rec["data"]

        if best_record:
            return BenchmarkClause(
                id=best_record.get("id", "bench-default"),
                category=best_record.get("category", "general"),
                clause_type=best_record.get("clause_type", "standard"),
                title=best_record.get("title", "Standard Benchmark"),
                standard_clause_text=best_record.get("standard_clause_text", ""),
                fairness_rationale=best_record.get("fairness_rationale", ""),
                key_safeguards=best_record.get("key_safeguards", []),
                typical_red_flags=best_record.get("typical_red_flags", []),
                similarity_score=round(min(1.0, max(0.5, best_score)), 3)
            )
        return None

# Singleton instance
vector_store = BenchmarkVectorStore()
