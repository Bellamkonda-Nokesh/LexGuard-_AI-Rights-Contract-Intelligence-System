# ==============================================================================
# LexGuard Backend Dockerfile for Google Cloud Run
# Optimized multi-stage build running Python 3.11 on Debian Slim
# ==============================================================================

FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Final runtime image
FROM python:3.11-slim AS runner

WORKDIR /app

# Install runtime dependencies for PDF & image handling
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed wheels from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Copy application source code and benchmarks
COPY app/ ./app/

# Seed benchmark vector store during container image build
RUN python -m app.data.seed_benchmarks

# Non-root user for Cloud Run security compliance
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8080

# Cloud Run injects $PORT environment variable (default 8080)
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080} --workers 2
