"""Shared pytest fixtures and sample contract data for LexGuard tests."""
import os
import sys
import pytest
from typing import Dict, Any

# Ensure backend root is in sys.path
TEST_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(TEST_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

@pytest.fixture
def sample_employment_contract_text() -> str:
    return (
        "CONFIDENTIAL EMPLOYMENT AND NON-DISCLOSURE AGREEMENT\n\n"
        "Section 1. Non-Competition and Post-Employment Restrictions.\n"
        "Employee covenants and agrees that during the term of employment and for a period of two (2) years "
        "following the termination of employment for any reason, Employee shall not directly or indirectly engage in, "
        "render services to, or invest in any competing business entity anywhere in the world.\n\n"
        "Section 2. Intellectual Property and Work Product Assignment.\n"
        "Employee hereby irrevocably assigns to Company all right, title, and interest in and to all inventions, "
        "ideas, and moral rights created at any time during employment, whether on company time or personal time.\n\n"
        "Section 3. Governing Law and Mandatory Arbitration.\n"
        "All disputes arising hereunder shall be submitted to confidential, binding arbitration in Wilmington, Delaware. "
        "Employee explicitly waives all rights to trial by jury and class action participation."
    )

@pytest.fixture
def sample_saas_contract_text() -> str:
    return (
        "MASTER SERVICES AGREEMENT AND SUBSCRIPTION TERMS\n\n"
        "Clause 1: Automatic Renewal.\n"
        "This subscription shall automatically renew for successive twelve (12) month terms unless Customer "
        "delivers notice of non-renewal via certified physical mail exactly ninety (90) days prior to renewal.\n\n"
        "Clause 2: Unilateral Indemnification & Limitation of Liability.\n"
        "Customer agrees to indemnify and hold harmless Provider from any and all damages. In no event shall "
        "Provider's total cumulative liability exceed $50.00 under any circumstances.\n\n"
        "Clause 3: Customer Telemetry and Monetization.\n"
        "Provider retains the irrevocable right to collect, monetize, and distribute user behavioral telemetry "
        "to third-party commercial affiliates for targeted advertising."
    )

@pytest.fixture
def sample_file_bytes(sample_employment_contract_text) -> bytes:
    return sample_employment_contract_text.encode("utf-8")
