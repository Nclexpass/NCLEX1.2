# make_catalog.ps1 — Genera library/catalog.json (Windows PowerShell 5.1)
# MODO: GitHub Releases para PDFs (para aguantar alto trafico)
#
# Requisitos:
# - Sube los PDFs como "Release assets" en GitHub:
#     Repo: Nclexpass/NCLEX1.2
#     Tag/Release: books
# - Los nombres de los archivos en el Release deben ser EXACTAMENTE iguales a los de library/files
#
# Qué hace:
# - Lee PDFs/EPUBs en library/files (solo para saber nombres y títulos)
# - coverUrl queda local: library/covers/...
# - fileUrl apunta a GitHub Releases: https://github.com/Nclexpass/NCLEX1.2/releases/download/books/<archivo>
# - SIEMPRE escribe un ARRAY [ ... ]

$ErrorActionPreference = "Stop"

$project = Split-Path -Parent $PSScriptRoot
$filesDir = Join-Path $project "library\files"
$coversDir = Join-Path $project "library\covers"
$outFile  = Join-Path $project "library\catalog.json"

# ✅ Cambia esto solo si tu repo/tag cambian
$RELEASE_BASE = "https://github.com/Nclexpass/NCLEX1.2/releases/download/books/"

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

  $coverUrl = ""
  if ($cover) { $coverUrl = ("library/covers/" + $cover) }

  # ✅ URL de GitHub Release asset (escapa espacios y caracteres raros)
  $escapedName = [System.Uri]::EscapeDataString($b.Name)
  $fileUrl = $RELEASE_BASE + $escapedName

  $items += [ordered]@{
    id      = $id
    title   = [ordered]@{ es = $title; en = $title }
    author  = ""
    type    = $type
    fileUrl = $fileUrl
    coverUrl= $coverUrl
    tags    = @("NCLEX")
    addedAt = [int64]([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())
    source  = "github_release"
  }
}

$json = ConvertTo-Json -InputObject @($items) -Depth 10
$json | Out-File -Encoding utf8 $outFile

Write-Host "OK: Catalogo generado -> $outFile" -ForegroundColor Green
Write-Host ("OK: Libros encontrados -> " + $items.Count) -ForegroundColor Cyan
Write-Host ("OK: PDFs apuntan a GitHub Releases -> " + $RELEASE_BASE) -ForegroundColor Cyan
