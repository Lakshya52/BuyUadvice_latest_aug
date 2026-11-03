# BuyUadvice deploy — backend/ IS the Hostinger public_html upload.
# Run from repo root:  .\deploy.ps1
# 1. builds frontend (auto-syncs dist -> backend/)
# 2. verifies backend/ is a complete upload (SPA + API + .htaccess)
# 3. you upload backend/* (not the folder itself) to public_html/ + import sql once.

$root = $PSScriptRoot
$backend = Join-Path $root 'backend'

Write-Host '=== BuyUadvice Deploy (backend/ = public_html) ===' -ForegroundColor Cyan

# 1. Build frontend (package.json build step auto-copies dist -> backend/)
Write-Host "`n[1/2] Building frontend..." -ForegroundColor Yellow
Set-Location (Join-Path $root 'frontend')
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host 'Build failed!' -ForegroundColor Red
    exit 1
}
Write-Host 'Frontend built + synced to backend/.' -ForegroundColor Green

# 2. Verify upload folder
Write-Host "`n[2/2] Verifying backend/ upload..." -ForegroundColor Yellow
Set-Location $root
$required = @('index.html', 'index.php', '.htaccess', 'auth', 'config', 'vendor')
$missing = @()
foreach ($item in $required) {
    if (-not (Test-Path (Join-Path $backend $item))) { $missing += $item }
}
if ($missing.Count -gt 0) {
    Write-Host ("Missing in backend/: " + ($missing -join ', ')) -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Ready to upload ===" -ForegroundColor Green
Write-Host "Source : $backend" -ForegroundColor Cyan
Write-Host 'Target : Hostinger public_html/ (upload CONTENTS of backend/, not the folder)'
Write-Host ''
Write-Host 'Backend (upload all):' -ForegroundColor Yellow
Get-ChildItem $backend | Format-Table Name, Mode -AutoSize
Write-Host ''
Write-Host 'DB: create MySQL DB in hPanel, import backend/sql/schema.sql via phpMyAdmin (once),' -ForegroundColor Cyan
Write-Host 'then set production DB_* in backend/.env before uploading.' -ForegroundColor Cyan
Write-Host 'NOTE: deployment/ folder is deprecated and no longer used.' -ForegroundColor DarkYellow
