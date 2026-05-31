# MarketLab Windows Setup
[CmdletBinding()]
param([switch]$SkipHooks)

$ErrorActionPreference = "Stop"

# Suppress the chpwd warning for users on PowerShell 5.1
$env:MISE_PWSH_CHPWD_WARNING = "0"

function Write-Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }

# --- 1. Root Directory Validation ---
if (-not (Test-Path "mise.toml")) { 
    throw "Execution failed: Please run this script from the root of the project." 
}

# --- 2. Package Manager Installation (Scoop & Mise) ---
if (-not (Get-Command "scoop" -ErrorAction SilentlyContinue)) {
    Write-Step "Installing Scoop"
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    
    # Security Mitigation: Replaced direct Invoke-Expression (IEX) web piping with local file execution.
    $scoopInstaller = "$env:TEMP\install-scoop.ps1"
    Invoke-RestMethod -Uri "https://get.scoop.sh" -OutFile $scoopInstaller
    & $scoopInstaller
    Remove-Item $scoopInstaller -Force
}

if (-not (Get-Command "mise" -ErrorAction SilentlyContinue)) {
    Write-Step "Installing mise via Scoop"
    scoop install mise
}

# --- 3. Shell Environment Configuration ---
Write-Step "Configuring mise in PowerShell profile..."
$profilePath = $PROFILE.CurrentUserAllHosts
$activationLine = '(& mise activate pwsh) | Out-String | Invoke-Expression'

if (!(Test-Path (Split-Path $profilePath))) { New-Item -Path (Split-Path $profilePath) -ItemType Directory -Force }
if (!(Test-Path $profilePath)) { New-Item -Path $profilePath -ItemType File -Force }

if (-not (Select-String -Path $profilePath -Pattern 'mise activate pwsh' -Quiet)) {
    Add-Content -Path $profilePath -Value $activationLine
}

# --- 4. Path Synchronization for Taskfile ---
# Create a local junction to ensure Taskfile resolves Linux-style paths ($HOME/.local/bin/mise) on Windows.
$localBin = "$HOME\.local\bin"
if (!(Test-Path $localBin)) { New-Item -Path $localBin -ItemType Directory -Force }

$misePath = (Get-Command mise).Source
if (!(Test-Path "$localBin\mise")) {
    New-Item -ItemType Junction -Path "$localBin\mise" -Target (Split-Path $misePath) | Out-Null
}

# --- 5. Toolchain Installation ---
Write-Step "Trusting configuration and installing toolchain"
mise trust
mise install

# --- 6. Task & Hook Execution ---
Write-Step "Executing environment setup"

# Inject the mise environment directly into the current PowerShell session.
# This prevents argument-parsing errors caused by native PowerShell failing to interpret '--' properly.
Invoke-Expression (& mise env pwsh | Out-String)

# Execute tasks natively now that the toolchain is in the session PATH
task setup

if (-not $SkipHooks) {
    Write-Step "Installing Git hooks"
    task hooks:install
}

Write-Host "`nSetup complete. Open a new terminal session and run: task dev" -ForegroundColor Green
