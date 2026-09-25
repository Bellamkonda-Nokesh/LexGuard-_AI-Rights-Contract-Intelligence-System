"""Firestore service for storing user sessions, uploaded document metadata, 
generated risk reports, and explainability reasoning traces.
Includes automatic fallback to local persistent store when GCP credentials are not active.
"""
import os
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

from app.config import settings

logger = logging.getLogger("lexguard.firestore")

class FirestoreService:
    """Manages persistence for LexGuard contracts, reports, and agent traces."""

    def __init__(self):
        self._db = None
        self._local_storage_dir = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
            "data", 
            "local_firestore"
        )
        self._init_firestore()

    def _init_firestore(self):
        """Attempt initialization of Google Cloud Firestore client."""
        project_id = settings.FIRESTORE_PROJECT_ID or os.getenv("GOOGLE_CLOUD_PROJECT") or os.getenv("GCP_PROJECT")
        creds_path = settings.GOOGLE_APPLICATION_CREDENTIALS or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

        try:
            from google.cloud import firestore
            if creds_path and os.path.exists(creds_path):
                self._db = firestore.Client.from_service_account_json(creds_path, database=settings.FIRESTORE_DATABASE_ID)
                logger.info("Connected to Google Cloud Firestore with service account credentials.")
            elif project_id:
                self._db = firestore.Client(project=project_id, database=settings.FIRESTORE_DATABASE_ID)
                logger.info("Connected to Google Cloud Firestore project: %s", project_id)
            else:
                logger.info("No Firestore project ID/credentials provided. Using local persistence.")
                self._db = None
        except Exception as e:
            logger.warning("Could not initialize Google Cloud Firestore (%s). Using local persistence fallback.", str(e))
            self._db = None

        os.makedirs(self._local_storage_dir, exist_ok=True)

    @property
    def is_connected(self) -> bool:
        return self._db is not None

    async def save_document_report(self, user_id: str, document_id: str, report_data: Dict[str, Any]) -> bool:
        """Save complete document risk report and metadata."""
        clean_user_id = user_id or "anonymous"

        if self._db:
            try:
                doc_ref = self._db.collection("users").document(clean_user_id).collection("documents").document(document_id)
                doc_ref.set(report_data)
                logger.info("Saved report %s to Firestore for user %s", document_id, clean_user_id)
                return True
            except Exception as e:
                logger.error("Firestore save error: %s. Falling back to local storage.", str(e))

        # Local storage fallback
        user_dir = os.path.join(self._local_storage_dir, clean_user_id)
        os.makedirs(user_dir, exist_ok=True)
        file_path = os.path.join(user_dir, f"{document_id}.json")
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(report_data, f, indent=2, default=str)
            logger.info("Saved report %s to local storage: %s", document_id, file_path)
            return True
        except Exception as e:
            logger.error("Local storage save error: %s", str(e))
            return False

    async def get_document_report(self, user_id: str, document_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a specific document report."""
        clean_user_id = user_id or "anonymous"

        if self._db:
            try:
                doc_ref = self._db.collection("users").document(clean_user_id).collection("documents").document(document_id)
                snapshot = doc_ref.get()
                if snapshot.exists:
                    return snapshot.to_dict()
            except Exception as e:
                logger.error("Firestore get error: %s", str(e))

        # Local fallback
        file_path = os.path.join(self._local_storage_dir, clean_user_id, f"{document_id}.json")
        if os.path.exists(file_path):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.error("Error reading local report file: %s", str(e))

        return None

    async def list_user_documents(self, user_id: str) -> List[Dict[str, Any]]:
        """List past analyzed documents for a given user."""
        clean_user_id = user_id or "anonymous"
        items = []

        if self._db:
            try:
                docs = self._db.collection("users").document(clean_user_id).collection("documents").order_by(
                    "uploaded_at", direction="DESCENDING"
                ).limit(50).stream()

                for d in docs:
                    data = d.to_dict()
                    items.append({
                        "document_id": data.get("document_id", d.id),
                        "filename": data.get("filename", "Unknown Document"),
                        "uploaded_at": data.get("uploaded_at", datetime.utcnow().isoformat()),
                        "overall_risk_score": data.get("overall_risk_score", 0.0),
                        "overall_risk_level": data.get("overall_risk_level", "Low"),
                        "flagged_clauses_count": data.get("flagged_clauses_count", 0),
                        "total_clauses": data.get("total_clauses_extracted", 0),
                        "summary_headline": data.get("summary_headline", "")
                    })
                return items
            except Exception as e:
                logger.warning("Firestore list error: %s. Using local fallback.", str(e))

        # Local fallback
        user_dir = os.path.join(self._local_storage_dir, clean_user_id)
        if os.path.exists(user_dir):
            for fname in os.listdir(user_dir):
                if fname.endswith(".json"):
                    try:
                        with open(os.path.join(user_dir, fname), "r", encoding="utf-8") as f:
                            data = json.load(f)
                            items.append({
                                "document_id": data.get("document_id", fname.replace(".json", "")),
                                "filename": data.get("filename", "Unknown Document"),
                                "uploaded_at": data.get("uploaded_at", datetime.now(timezone.utc).isoformat()),
                                "overall_risk_score": data.get("overall_risk_score", 0.0),
                                "overall_risk_level": data.get("overall_risk_level", "Low"),
                                "flagged_clauses_count": data.get("flagged_clauses_count", 0),
                                "total_clauses": data.get("total_clauses_extracted", 0),
                                "summary_headline": data.get("summary_headline", "")
                            })
                    except Exception:
                        pass

        # Sort descending by uploaded_at
        items.sort(key=lambda x: x.get("uploaded_at", ""), reverse=True)
        return items

    async def log_agent_trace(self, user_id: str, document_id: str, trace_data: Dict[str, Any]) -> bool:
        """Log individual agent reasoning step for explainable AI traceability."""
        clean_user_id = user_id or "anonymous"
        if self._db:
            try:
                trace_ref = self._db.collection("users").document(clean_user_id).collection("documents").document(document_id).collection("traces")
                trace_ref.add(trace_data)
                return True
            except Exception as e:
                logger.debug("Firestore trace log error: %s", str(e))
        return True

firestore_service = FirestoreService()
