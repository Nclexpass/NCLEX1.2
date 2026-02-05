# make_catalog.ps1 — Genera library/catalog.json automáticamente (Windows PowerShell 5.1 compatible)
# Uso:
#   cd "A:\NCLEX SOFTWARE\NCLEX1.2"
#   powershell -ExecutionPolicy Bypass -File .\library\make_catalog.ps1
#
# Qué hace:
# - Busca PDFs/EPUBs en library/files
# - Busca carátulas en library/covers:
#     1) mismo nombre base del PDF
#     2) o nombre "normalizado" (solo a-z0-9 con _)
# - SIEMPRE escribe el catálogo como ARRAY [ ... ] (aunque solo haya 1 libro)

$ErrorActionPreference = "Stop"

$project = Split-Path -Parent $PSScriptRoot
$filesDir = Join-Path $project "library\files"
$coversDir = Join-Path $project "library\covers"
$outFile  = Join-Path $project "library\catalog.json"

if (!(Test-Path $filesDir)) { Write-Host "ERROR: No existe: $filesDir" -ForegroundColor Red; exit 1 }
if (!(Test-Path $coversDir)) { Write-Host "ERROR: No existe: $coversDir" -ForegroundColor Red; exit 1 }

$books = Get-ChildItem $filesDir -File | Where-Object { $_.Extension -match '\.pdf|\.epub' }

$items = @()

foreach ($b in $books) {
  $base = $b.BaseName
  $id = ($base.ToLower() -replace '[^a-z0-9]+','_').Trim('_')
  $type = $b.Extension.TrimStart('.').ToLower()
  $title = ($base -replace '_',' ')

  $cover = $null

  foreach ($ext in @('.jpg','.jpeg','.png','.webp')) {
    $candidate1 = Join-Path $coversDir ($base + $ext)
    if (Test-Path $candidate1) { $cover = Split-Path -Leaf $candidate1; break }

    $candidate2 = Join-Path $coversDir ($id + $ext)
    if (Test-Path $candidate2) { $cover = Split-Path -Leaf $candidate2; break }
  }

  # Fallback: si solo existe 1 imagen en covers, úsala
  if (-not $cover) {
    $imgs = Get-ChildItem $coversDir -File | Where-Object { $_.Extension -match '\.jpg|\.jpeg|\.png|\.webp' }
    if ($imgs.Count -eq 1) { $cover = $imgs[0].Name }
  }

  $coverUrl = ""
  if ($cover) { $coverUrl = ("library/covers/" + $cover) }

  $items += [ordered]@{
    id      = $id
    title   = [ordered]@{ es = $title; en = $title }
    author  = ""
    type    = $type
    fileUrl = ("library/files/" + $b.Name)
    coverUrl= $coverUrl
    tags    = @("NCLEX")
    addedAt = [int64]([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())
  }
}

# ✅ MUY IMPORTANTE: NO usar pipeline porque se "desenrolla" y deja de ser array.
$json = ConvertTo-Json -InputObject @($items) -Depth 10
$json | Out-File -Encoding utf8 $outFile

Write-Host "OK: Catalogo generado -> $outFile" -ForegroundColor Green
Write-Host ("OK: Libros encontrados -> " + $items.Count) -ForegroundColor Cyan
