#Requires -Version 5.1
<#
.SYNOPSIS
  Genera el ZIP de la evidencia GA8-220501096-AA1-EV01 para Carlos Pico.

.DESCRIPTION
  Empaqueta el contenido versionado del repo (respeta .gitignore via
  git archive HEAD) y anade a cada ZIP:
    - REPO.txt          URL del repositorio remoto
    - JUSTIFICACION.md  texto explicativo en el formato SENA

  El informe tecnico (PDF/DOCX) se adjunta manualmente por el aprendiz
  fuera de este script.

  El ZIP se genera en %USERPROFILE%\Documents\SENA_GA8_Entregas
  con la carpeta interna nombrada CARLOSPICO_GA8_AA1_EV01.

.NOTES
  Ejecutar desde PowerShell (desde la raiz del repo):
    powershell -ExecutionPolicy Bypass -File sena\build-zip-ga8-aa1-ev01.ps1
#>

param(
    [string]$DocumentsDir = [Environment]::GetFolderPath('MyDocuments'),
    [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
    [string]$RepoUrl = 'https://github.com/Axio-Ukano/minus-garden/tree/sena/evidencias'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$DestDir = Join-Path $DocumentsDir 'SENA_GA8_Entregas'
New-Item -ItemType Directory -Force -Path $DestDir | Out-Null

$JustifSrc = Join-Path $RepoRoot 'sena\justificaciones\GA8_AA1_EV01.md'

if (-not (Test-Path $JustifSrc)) { throw "No se encontro $JustifSrc" }

Write-Host "Repo root      : $RepoRoot"
Write-Host "Destino ZIPs   : $DestDir"
Write-Host ""

# ---------------------------------------------------------------------------
# Definir la evidencia GA8
# ---------------------------------------------------------------------------
$evidences = @(
    [pscustomobject]@{
        Name       = 'CARLOSPICO_GA8_AA1_EV01'
        JustifPath = $JustifSrc
    }
)

# ---------------------------------------------------------------------------
# Helper: anadir un archivo al ZIP bajo el prefijo de la evidencia
# ---------------------------------------------------------------------------
function Add-EntryToZip {
    param(
        [System.IO.Compression.ZipArchive]$Zip,
        [string]$EntryName,
        [string]$Content
    )
    $existing = $Zip.GetEntry($EntryName)
    if ($existing) { $existing.Delete() }

    $entry = $Zip.CreateEntry($EntryName, [System.IO.Compression.CompressionLevel]::Optimal)
    $stream = $entry.Open()
    try {
        $writer = New-Object System.IO.StreamWriter($stream, [System.Text.UTF8Encoding]::new($false))
        $writer.Write($Content)
        $writer.Flush()
        $writer.Dispose()
    }
    finally {
        $stream.Dispose()
    }
}

# ---------------------------------------------------------------------------
# Empaquetar
# ---------------------------------------------------------------------------
Write-Host "Empaquetando $($evidences.Count) ZIP(s)..."

Push-Location $RepoRoot
try {
    foreach ($ev in $evidences) {
        Write-Host "  -> $($ev.Name)"

        $zipPath = Join-Path $DestDir ($ev.Name + '.zip')
        if (Test-Path $zipPath) { Remove-Item -Force $zipPath }

        # 1. git archive del HEAD con prefijo = nombre de la evidencia
        & git archive --format=zip --prefix="$($ev.Name)/" --output=$zipPath HEAD
        if ($LASTEXITCODE -ne 0) { throw "git archive fallo para $($ev.Name)" }

        # 2. Inyectar archivos auxiliares
        $zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Update)
        try {
            Add-EntryToZip -Zip $zip `
                           -EntryName "$($ev.Name)/REPO.txt" `
                           -Content $RepoUrl

            $justifContent = Get-Content -Raw -Encoding UTF8 $ev.JustifPath
            Add-EntryToZip -Zip $zip `
                           -EntryName "$($ev.Name)/JUSTIFICACION.md" `
                           -Content $justifContent
        }
        finally {
            $zip.Dispose()
        }
    }
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "Listo. ZIP generado en: $DestDir"
Write-Host ""
Get-ChildItem $DestDir -Filter 'CARLOSPICO_GA8_*.zip' |
    Sort-Object Name |
    Select-Object Name, @{Name='Size (KB)'; Expression={[math]::Round($_.Length / 1KB, 1)}} |
    Format-Table -AutoSize
