---
title: LexGuard AI Rights & Contract Intelligence System
emoji: ⚖️
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: true
license: mit
short_description: AI-powered contract analysis — detect risky clauses, benchmark fairness
---

# ⚖️ LexGuard — AI Rights & Contract Intelligence System

**Autonomous multi-agent AI system** that deconstructs complex legal contracts, detects one-sided liabilities, scores risk severity, and benchmarks clauses against industry-standard fair practices.

## Features

- 📄 **Multi-format upload**: PDF, DOCX, TXT, MD, RTF, PNG/JPG
- 🤖 **Gemini 2.5 Flash** powered clause extraction & risk reasoning
- 📊 **Risk scoring** with severity breakdown (Critical / High / Medium / Low)
- ⚖️ **Benchmark comparison** against 8 standard fair-clause templates
- 🔍 **Global search** across clauses and benchmarks
- 🔔 **Smart notifications** with contextual contract alerts

## Tech Stack

- **Backend**: FastAPI + LangGraph multi-agent pipeline + ChromaDB vector store
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **AI**: Google Gemini 2.5 Flash via google-genai SDK
- **Deployment**: Hugging Face Spaces (Docker)

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check + vector store count |
| `/api/analyze` | POST | Upload & analyze a contract |
| `/api/benchmarks` | GET | List benchmark clause library |
| `/docs` | GET | Interactive Swagger UI |
