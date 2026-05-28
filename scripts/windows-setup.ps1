# MarketLab Windows setup
# Installs mise via Scoop when available, activates it, and runs project setup tasks.
# Run from project root:
#   pwsh -ExecutionPolicy Bypass -File .\scripts\windows-setup.ps1
# or:
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

# --- 2. Install mise -----------------------------------------------------------
if (-not (Test-Command "mise")) {
    if (Test-Command "scoop") {
        Write-Step "Installing mise via Scoop"
        scoop install mise
    } else {
        throw @"
mise was not found, and Scoop is not installed.

Install mise first, then rerun this script:
  https://mise.jdx.dev/installing-mise.html

If you use Scoop, install it from https://scoop.sh/ and run:
  scoop install mise
"@
    }
} else {
    Write-Step "mise already installed"
}

# --- 3. Activate mise in current session + persist in PowerShell profile ------
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
    $profileContent = Get-Content -Path $profilePath -Raw
    if ($profileContent -and -not $profileContent.EndsWith("`n")) {
        Add-Content -Path $profilePath -Value ""
    }
    Add-Content -Path $profilePath -Value $activationLine
} else {
    Write-Step "PowerShell profile already activates mise"
}

# --- 4. Trust and install project tools ---------------------------------------
Write-Step "mise trust"
mise trust

Write-Step "mise install (node, bun, gh, prek, task)"
mise install

# --- 5. Project setup ----------------------------------------------------------
Write-Step "Running task setup"
mise exec -- task setup

# --- 6. prek hooks -------------------------------------------------------------
if (-not $SkipHooks) {
    Write-Step "Running task hooks:install"
    mise exec -- task hooks:install
}

Write-Host ""
Write-Host "Setup complete." -ForegroundColor Green
Write-Host "Open a new window for this same PowerShell shell (so mise activation loads) and run:" -ForegroundColor Yellow
Write-Host "  task dev" -ForegroundColor Yellow
