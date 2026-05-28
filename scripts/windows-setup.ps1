# MarketLab Windows setup
# Installs mise via scoop, activates it, and runs project setup tasks.
# Run from project root:
#   powershell -ExecutionPolicy Bypass -File .\scripts\windows-setup.ps1

[CmdletBinding()]
param(
    [switch]$SkipHooks
)

$ErrorActionPreference = "Stop"

function Write-Step($msg) {
    Write-Host "==> $msg" -ForegroundColor Cyan
}

function Test-Command($name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

# --- 1. Verify project root ----------------------------------------------------
if (-not (Test-Path "mise.toml")) {
    throw "mise.toml not found. Run this script from the project root."
}

# --- 2. Install scoop ----------------------------------------------------------
if (-not (Test-Command "scoop")) {
    Write-Step "Installing scoop"
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
    Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
} else {
    Write-Step "scoop already installed"
}

# --- 3. Install mise -----------------------------------------------------------
if (-not (Test-Command "mise")) {
    Write-Step "Installing mise via scoop"
    scoop install mise
} else {
    Write-Step "mise already installed"
}

# --- 4. Activate mise in current session + persist in PowerShell profile ------
Write-Step "Activating mise in current session"
(& mise activate pwsh) | Out-String | Invoke-Expression

$profilePath = $PROFILE.CurrentUserAllHosts
$activationLine = '(& mise activate pwsh) | Out-String | Invoke-Expression'
$profileParent = Split-Path -Parent $profilePath

if (-not (Test-Path $profileParent)) {
    New-Item -Path $profileParent -ItemType Directory -Force | Out-Null
}

if (-not (Test-Path $profilePath)) {
    New-Item -Path $profilePath -ItemType File -Force | Out-Null
}

if (-not (Select-String -Path $profilePath -Pattern 'mise activate pwsh' -Quiet)) {
    Write-Step "Adding mise activation to PowerShell profile: $profilePath"
    Add-Content -Path $profilePath -Value $activationLine
} else {
    Write-Step "PowerShell profile already activates mise"
}

# --- 5. Trust and install project tools ---------------------------------------
Write-Step "mise trust"
mise trust

Write-Step "mise install (node, bun, gh, prek, task)"
mise install

# --- 6. Project setup ----------------------------------------------------------
Write-Step "Running task setup"
mise exec -- task setup

# --- 7. prek hooks -------------------------------------------------------------
if (-not $SkipHooks) {
    Write-Step "Running task hooks:install"
    mise exec -- task hooks:install
}

Write-Host ""
Write-Host "Setup complete." -ForegroundColor Green
Write-Host "Open a new PowerShell window (so mise activation loads) and run:" -ForegroundColor Yellow
Write-Host "  task dev" -ForegroundColor Yellow
