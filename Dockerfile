# ==============================================================================
# LexGuard — Full-Stack Dockerfile for Render / Hugging Face Spaces
# Builds React frontend + serves via FastAPI on port 7860
# ==============================================================================

# ── Stage 1: Build React frontend ─────────────────────────────────────────────
FROM node:20-slim AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm ci --prefer-offline

COPY frontend/ ./
RUN npm run build

# ── Stage 2: Install Python dependencies into a virtualenv ────────────────────
FROM python:3.11-slim AS py-builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl \
    && rm -rf /var/lib/apt/lists/*

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Stage 3: Final runtime image ───────────────────────────────────────────────
FROM python:3.11-slim AS runner

WORKDIR /app

# Runtime system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy virtualenv from builder (accessible by any user)
COPY --from=py-builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV PORT=7860

# Copy backend source
COPY backend/app/ ./app/

# Copy built frontend into backend's static directory
COPY --from=frontend-builder /frontend/dist/ ./app/dist/

# Seed ChromaDB benchmark vectors at build time
RUN python -m app.data.seed_benchmarks

# Non-root user (uid=1000 required by HF Spaces; good practice for Render too)
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 7860

CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860} --workers 1
