# publish.ps1
# NCLEX Library: genera catalogo + commit + push (deploy automatico via GitHub Actions)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Ir a la carpeta donde está este script
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host "== NCLEX Publish ==" -ForegroundColor Cyan
Write-Host "Carpeta: $root"

# 1) Generar catálogo
Write-Host "`n[1/4] Generando catalogo..." -ForegroundColor Yellow
powershell -ExecutionPolicy Bypass -File ".\library\make_catalog.ps1"

# 2) Ver cambios
Write-Host "`n[2/4] Revisando cambios (git status)..." -ForegroundColor Yellow
git status --porcelain | Out-String | ForEach-Object { $_.TrimEnd() } | Write-Host

$changes = (git status --porcelain)
if (-not $changes) {
  Write-Host "`nNo hay cambios para publicar. (Nada nuevo en files/covers/catalog.json)" -ForegroundColor Green
  exit 0
}

# 3) Add + commit
Write-Host "`n[3/4] Haciendo commit..." -ForegroundColor Yellow
git add .

# Mensaje automático con fecha/hora
$stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
git commit -m "Library update ($stamp)" | Out-Host

# 4) Push
Write-Host "`n[4/4] Subiendo a GitHub (git push)..." -ForegroundColor Yellow
git push | Out-Host

Write-Host "`nOK ✅ Publicado. Revisa: https://passnclexnow.web.app" -ForegroundColor Green
