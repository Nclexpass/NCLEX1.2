# make_catalog.ps1 — Genera library/catalog.json (Windows PowerShell 5.1)
# CORREGIDO: Genera rutas absolutas (con / inicial) para que las imágenes carguen siempre.

$ErrorActionPreference = "Stop"

$project = Split-Path -Parent $PSScriptRoot

$filesDir      = Join-Path $project "library\files"
$coversDirNew  = Join-Path $project "library\files\covers"
$coversDirOld  = Join-Path $project "library\covers"          # legacy
$outFile       = Join-Path $project "library\catalog.json"

# ✅ Cambia esto solo si tu repo/tag cambian
$RELEASE_BASE = "https://github.com/Nclexpass/NCLEX1.2/releases/download/BOOKS/"

if (!(Test-Path $filesDir)) { Write-Host "ERROR: No existe: $filesDir" -ForegroundColor Red; exit 1 }

# Asegurar carpeta new covers
if (!(Test-Path $coversDirNew)) { New-Item -ItemType Directory -Path $coversDirNew | Out-Null }

$books = Get-ChildItem $filesDir -File | Where-Object { $_.Extension -match '\.pdf|\.epub' }

$items = @()

foreach ($b in $books) {
  $base = $b.BaseName
  $id = ($base.ToLower() -replace '[^a-z0-9]+','_').Trim('_')
  $type = $b.Extension.TrimStart('.').ToLower()
  $title = ($base -replace '_',' ')

  $cover = $null

  foreach ($ext in @('.jpg','.jpeg','.png','.webp')) {
    # 1) Buscar por baseName en carpeta nueva
    $candidateNew1 = Join-Path $coversDirNew ($base + $ext)
    if (Test-Path $candidateNew1) { $cover = Split-Path -Leaf $candidateNew1; break }

    # 2) Buscar por id en carpeta nueva
    $candidateNew2 = Join-Path $coversDirNew ($id + $ext)
    if (Test-Path $candidateNew2) { $cover = Split-Path -Leaf $candidateNew2; break }

    # 3) Legacy: carpeta vieja
    $candidateOld1 = Join-Path $coversDirOld ($base + $ext)
    if (Test-Path $candidateOld1) {
      $cover = Split-Path -Leaf $candidateOld1
      # moverla a la nueva para mantener todo ordenado
      try { Move-Item -Force $candidateOld1 (Join-Path $coversDirNew $cover) } catch {}
      break
    }

    $candidateOld2 = Join-Path $coversDirOld ($id + $ext)
    if (Test-Path $candidateOld2) {
      $cover = Split-Path -Leaf $candidateOld2
      # moverla a la nueva para mantener todo ordenado
      try { Move-Item -Force $candidateOld2 (Join-Path $coversDirNew $cover) } catch {}
      break
    }
  }

  $coverUrl = ""
  # CORRECCIÓN: Agregamos "/" al inicio para ruta absoluta
  if ($cover) { $coverUrl = ("/library/files/covers/" + $cover) }

  # URL de GitHub Release asset (escapa espacios)
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
Write-Host ("OK: Covers en -> library/files/covers") -ForegroundColor Cyan
Write-Host ("OK: PDFs apuntan a GitHub Releases -> " + $RELEASE_BASE) -ForegroundColor Cyan
