# MarketLab Windows setup
[CmdletBinding()]
param([switch]$SkipHooks)

$ErrorActionPreference = "Stop"

function Write-Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }

# --- 1. Verificar raíz ---
if (-not (Test-Path "mise.toml")) { throw "Ejecuta desde la raíz del proyecto." }

# --- 2. Instalar scoop y mise ---
if (-not (Get-Command "scoop" -ErrorAction SilentlyContinue)) {
    Write-Step "Instalando scoop"
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
}

if (-not (Test-Command "mise")) {
    Write-Step "Instalando mise via scoop"
    scoop install mise
}

# --- 3. Activar mise ---
Write-Step "Configurando mise..."
$profilePath = $PROFILE.CurrentUserAllHosts
$activationLine = '(& mise activate pwsh) | Out-String | Invoke-Expression'

if (!(Test-Path (Split-Path $profilePath))) { New-Item -Path (Split-Path $profilePath) -ItemType Directory -Force }
if (!(Test-Path $profilePath)) { New-Item -Path $profilePath -ItemType File -Force }

if (-not (Select-String -Path $profilePath -Pattern 'mise activate pwsh' -Quiet)) {
    Add-Content -Path $profilePath -Value $activationLine
}

# --- 4. TRUCO PARA EL TASKFILE (Sincronización de rutas) ---
# El Taskfile busca en $HOME/.local/bin/mise. 
# Creamos un enlace simbólico para que el Taskfile encuentre 'mise' como si fuera Linux.
$localBin = "$HOME\.local\bin"
if (!(Test-Path $localBin)) { New-Item -Path $localBin -ItemType Directory -Force }
$misePath = (Get-Command mise).Source
if (!(Test-Path "$localBin\mise")) {
    New-Item -ItemType Junction -Path "$localBin\mise" -Target (Split-Path $misePath) | Out-Null
}

# --- 5. Instalación de herramientas ---
Write-Step "Instalando dependencias (mise install)"
mise trust
mise install

# --- 6. setup y hooks ---
Write-Step "Ejecutando setup"
mise exec -- task setup

if (-not $SkipHooks) {
    Write-Step "Instalando hooks"
    mise exec -- task hooks:install
}

Write-Host "`nSetup completo. Reinicia la terminal y ejecuta: task dev" -ForegroundColor Green
