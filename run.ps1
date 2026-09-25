<#
.SYNOPSIS
    LexGuard Development & Automation Script for Windows PowerShell.

.DESCRIPTION
    Automates setup, dependency installation, vector store seeding, test execution,
    and launching both backend (FastAPI) and frontend (Vite) development servers.

.PARAMETER Action
    The action to execute:
      - 'start'    : Launch both backend and frontend servers
      - 'test'     : Run backend pytest suite and frontend vitest tests
      - 'build'    : Compile frontend production bundle and verify backend
      - 'install'  : Install all Python and Node.js dependencies
      - 'seed'     : Index standard fair clauses into Chroma vector store
      - 'docker'   : Build and run containers via docker-compose
      - 'clean'    : Clean temporary caches, virtual environments, and dist folders

.EXAMPLE
    .\run.ps1 -Action start
    .\run.ps1 -Action test
    .\run.ps1 -Action install
#>

[CmdletBinding()]
param (
    [Parameter(Position = 0)]
    [ValidateSet("start", "test", "build", "install", "seed", "docker", "clean", "help")]
    [string]$Action = "start"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

function Write-Step {
    param([string]$Message)
    Write-Host "`n[LexGuard] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-Err {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# 1. Check Prerequisites
function Test-Prerequisites {
    Write-Step "Checking system prerequisites..."
    try {
        $pyVersion = python --version 2>&1
        Write-Host "  Python: $pyVersion" -ForegroundColor Gray
    } catch {
        Write-Err "Python is not installed or not in PATH."
        exit 1
    }

    try {
        $nodeVersion = node --version 2>&1
        Write-Host "  Node.js: $nodeVersion" -ForegroundColor Gray
    } catch {
        Write-Err "Node.js is not installed or not in PATH."
        exit 1
    }

    try {
        $npmVersion = npm --version 2>&1
        Write-Host "  npm: $npmVersion" -ForegroundColor Gray
    } catch {
        Write-Err "npm is not installed or not in PATH."
        exit 1
    }
}

# 2. Install Dependencies
function Install-Dependencies {
    Test-Prerequisites
    Write-Step "Installing backend dependencies..."
    Push-Location "$ScriptDir\backend"
    try {
        if (-not (Test-Path ".env")) {
            if (Test-Path ".env.example") {
                Copy-Item ".env.example" ".env"
                Write-Host "  Created backend/.env from .env.example" -ForegroundColor Gray
            }
        }
        python -m pip install --upgrade pip
        python -m pip install -r requirements.txt
        Write-Success "Backend dependencies installed."
    } finally {
        Pop-Location
    }

    Write-Step "Installing frontend dependencies..."
    Push-Location "$ScriptDir\frontend"
    try {
        if (-not (Test-Path ".env")) {
            if (Test-Path ".env.example") {
                Copy-Item ".env.example" ".env"
                Write-Host "  Created frontend/.env from .env.example" -ForegroundColor Gray
            }
        }
        npm install
        Write-Success "Frontend dependencies installed."
    } finally {
        Pop-Location
    }

    Seed-Benchmarks
}

# 3. Seed Chroma Vector Store
function Seed-Benchmarks {
    Write-Step "Seeding standard benchmark clauses into Chroma vector store..."
    Push-Location "$ScriptDir\backend"
    try {
        python -m app.data.seed_benchmarks
        Write-Success "Chroma vector store seeded."
    } finally {
        Pop-Location
    }
}

# 4. Run Test Suite
function Run-Tests {
    Test-Prerequisites
    Write-Step "Executing backend Pytest test suite (LangGraph Agents)..."
    Push-Location "$ScriptDir"
    try {
        python -m pytest backend/tests -v
        Write-Success "All backend tests passed."
    } finally {
        Pop-Location
    }

    Write-Step "Executing frontend Vitest suite & Axe-Core Accessibility Audit..."
    Push-Location "$ScriptDir\frontend"
    try {
        npm test
        Write-Success "All frontend tests & accessibility audits passed."
    } finally {
        Pop-Location
    }
}

# 5. Build Project
function Build-Project {
    Test-Prerequisites
    Write-Step "Compiling frontend production bundle..."
    Push-Location "$ScriptDir\frontend"
    try {
        npm run build
        Write-Success "Frontend build complete in frontend/dist."
    } finally {
        Pop-Location
    }
}

# 6. Run Docker Compose
function Run-Docker {
    Write-Step "Starting LexGuard multi-container stack via Docker Compose..."
    Push-Location "$ScriptDir"
    try {
        docker-compose up --build
    } finally {
        Pop-Location
    }
}

# 7. Clean Caches
function Clean-Caches {
    Write-Step "Cleaning temporary files and build artifacts..."
    $targets = @(
        "$ScriptDir\frontend\dist",
        "$ScriptDir\frontend\node_modules\.tmp",
        "$ScriptDir\backend\.pytest_cache",
        "$ScriptDir\backend\app\data\local_firestore"
    )
    foreach ($t in $targets) {
        if (Test-Path $t) {
            Remove-Item -Recurse -Force $t
            Write-Host "  Removed: $t" -ForegroundColor Gray
        }
    }
    Get-ChildItem -Path "$ScriptDir\backend" -Filter "__pycache__" -Recurse -Directory | Remove-Item -Recurse -Force
    Write-Success "Clean complete."
}

# 8. Start Local Dev Servers
function Start-Servers {
    Test-Prerequisites

    # Ensure benchmarks are seeded
    Push-Location "$ScriptDir\backend"
    try {
        python -m app.data.seed_benchmarks
    } finally {
        Pop-Location
    }

    Write-Step "Launching LexGuard development servers..."
    Write-Host "  - Backend API:  http://localhost:8000 (Swagger: http://localhost:8000/docs)" -ForegroundColor Green
    Write-Host "  - Frontend UI:  http://localhost:5173" -ForegroundColor Green
    Write-Host "  Press Ctrl+C to stop servers.`n" -ForegroundColor Yellow

    # Launch Backend in background process or separate window
    $backendCmd = "cd '$ScriptDir\backend'; uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
    $backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd -PassThru

    # Launch Frontend in current window or separate window
    Push-Location "$ScriptDir\frontend"
    try {
        npm run dev
    } finally {
        Pop-Location
        if ($backendProcess -and -not $backendProcess.HasExited) {
            Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
        }
    }
}

# Dispatch Action
switch ($Action.ToLower()) {
    "start"   { Start-Servers }
    "test"    { Run-Tests }
    "build"   { Build-Project }
    "install" { Install-Dependencies }
    "seed"    { Seed-Benchmarks }
    "docker"  { Run-Docker }
    "clean"   { Clean-Caches }
    "help"    { Get-Help $MyInvocation.MyCommand.Path -Detailed }
    default   { Start-Servers }
}
