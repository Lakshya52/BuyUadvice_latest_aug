$source = "C:\Users\ACEONE\Desktop\Buyuadvice 25-08-2026"
$deploy = "C:\Users\ACEONE\Desktop\Buyuadvice 25-08-2026\deployment"

Write-Host "=== BuyUadvice Deploy Script ===" -ForegroundColor Cyan

# 1. Build frontend
Write-Host "`n[1/5] Building frontend..." -ForegroundColor Yellow
Set-Location "$source\frontend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Frontend built successfully." -ForegroundColor Green

# 2. Create clean deployment folder
Write-Host "`n[2/5] Preparing deployment folder..." -ForegroundColor Yellow
if (Test-Path $deploy) {
    Remove-Item $deploy -Recurse -Force
}
New-Item -ItemType Directory -Path $deploy -Force | Out-Null
New-Item -ItemType Directory -Path "$deploy\backend" -Force | Out-Null

# 3. Copy frontend build to deployment root
Write-Host "`n[3/5] Copying frontend build to deployment root..." -ForegroundColor Yellow
robocopy "$source\frontend\dist" "$deploy" /E /NJH /NJS /NP /NDL
robocopy "$source\frontend\public" "$deploy" /E /NJH /NJS /NP /NDL /XD heroimages servicesimages node_modules

# 4. Copy backend PHP files to deployment/backend (excluding vendor)
Write-Host "`n[4/5] Copying backend PHP files..." -ForegroundColor Yellow
robocopy "$source\backend" "$deploy\backend" /E /NJH /NJS /NP /NDL /XD vendor node_modules

# 5. Copy vendor folder
Write-Host "`n[5/5] Copying vendor folder..." -ForegroundColor Yellow
robocopy "$source\backend\vendor" "$deploy\backend\vendor" /E /NJH /NJS /NP /NDL

# 6. Create .htaccess files for Hostinger
Write-Host "`nCreating .htaccess files..." -ForegroundColor Yellow

# Root .htaccess
$rootHtaccess = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Route /backend/* non-file requests to backend/index.php (API router)
  RewriteCond %{REQUEST_URI} ^/backend/
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule ^backend/(.*)$ backend/index.php [QSA,L]

  # Pass existing /backend/ files through (images, CSS, JS etc)
  RewriteCond %{REQUEST_URI} ^/backend/ [NC]
  RewriteRule ^ - [L]

  # SPA fallback - serve React app for all other routes
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

<IfModule mod_headers.c>
    Header set Access-Control-Allow-Credentials "true"
</IfModule>
"@
Set-Content -Path "$deploy\.htaccess" -Value $rootHtaccess -Encoding UTF8

# Backend .htaccess (empty - routing handled by root .htaccess)
Set-Content -Path "$deploy\backend\.htaccess" -Value "" -Encoding UTF8

# 7. Verify
Write-Host "`n=== Deployment Ready ===" -ForegroundColor Green
Write-Host "Location: $deploy" -ForegroundColor Cyan
Write-Host ""
Write-Host "Root:" -ForegroundColor Yellow
Get-ChildItem $deploy | Format-Table Name, Mode -AutoSize
Write-Host "Backend:" -ForegroundColor Yellow
Get-ChildItem "$deploy\backend" | Format-Table Name, Mode -AutoSize
Write-Host ""
Write-Host "Upload the entire 'deployment' folder contents to Hostinger public_html/" -ForegroundColor Cyan
