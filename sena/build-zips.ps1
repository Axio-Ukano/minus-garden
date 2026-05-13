#Requires -Version 5.1
<#
.SYNOPSIS
  Genera los 9 ZIPs de evidencias SENA GA7 para Carlos Pico.

.DESCRIPTION
  Empaqueta el contenido versionado del repo (respeta .gitignore via git
  archive HEAD) y añade a cada ZIP:
    - REPO.txt con la URL del repositorio remoto
    - JUSTIFICACION.md con el texto explicativo de la evidencia
    - ENDPOINTS.json (sólo para AA5-EV02 y AA5-EV04)

  Los ZIPs se generan en %USERPROFILE%\Documents\SENA_GA7_Entregas
  con la carpeta interna nombrada CARLOSPICO_AA#_EV## (así, al extraer,
  queda esa carpeta y no se mezcla con archivos del directorio actual).

.NOTES
  Ejecutar desde PowerShell:
    powershell -ExecutionPolicy Bypass -File sena\build-zips.ps1
#>

param(
    [string]$DocumentsDir = [Environment]::GetFolderPath('MyDocuments'),
    [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
    [string]$RepoUrl = 'https://github.com/Axio-Ukano/minus-garden/tree/sena/ga7-evidencias'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

$DestDir = Join-Path $DocumentsDir 'SENA_GA7_Entregas'
New-Item -ItemType Directory -Force -Path $DestDir | Out-Null

$JustifSrcDir = Join-Path $RepoRoot 'sena\justificaciones'
$EndpointsSource = Join-Path $RepoRoot 'sena-backend\tests\endpoints-collection.json'

if (-not (Test-Path $JustifSrcDir)) { throw "No se encontro $JustifSrcDir" }
if (-not (Test-Path $EndpointsSource)) { throw "No se encontro $EndpointsSource" }

Write-Host "Repo root      : $RepoRoot"
Write-Host "Destino ZIPs   : $DestDir"
Write-Host ""

# ---------------------------------------------------------------------------
# Definir las 9 evidencias
# ---------------------------------------------------------------------------
$evidences = @(
    [pscustomobject]@{ Name = 'CARLOSPICO_AA2_EV01'; Justif = 'AA2_EV01.md'; IncludeEndpoints = $false },
    [pscustomobject]@{ Name = 'CARLOSPICO_AA2_EV02'; Justif = 'AA2_EV02.md'; IncludeEndpoints = $false },
    [pscustomobject]@{ Name = 'CARLOSPICO_AA3_EV01'; Justif = 'AA3_EV01.md'; IncludeEndpoints = $false },
    [pscustomobject]@{ Name = 'CARLOSPICO_AA3_EV02'; Justif = 'AA3_EV02.md'; IncludeEndpoints = $false },
    [pscustomobject]@{ Name = 'CARLOSPICO_AA4_EV03'; Justif = 'AA4_EV03.md'; IncludeEndpoints = $false },
    [pscustomobject]@{ Name = 'CARLOSPICO_AA5_EV01'; Justif = 'AA5_EV01.md'; IncludeEndpoints = $false },
    [pscustomobject]@{ Name = 'CARLOSPICO_AA5_EV02'; Justif = 'AA5_EV02.md'; IncludeEndpoints = $true },
    [pscustomobject]@{ Name = 'CARLOSPICO_AA5_EV03'; Justif = 'AA5_EV03.md'; IncludeEndpoints = $false },
    [pscustomobject]@{ Name = 'CARLOSPICO_AA5_EV04'; Justif = 'AA5_EV04.md'; IncludeEndpoints = $true }
)

# ---------------------------------------------------------------------------
# Helper: añadir un archivo al ZIP bajo el prefijo de la evidencia
# ---------------------------------------------------------------------------
function Add-EntryToZip {
    param(
        [System.IO.Compression.ZipArchive]$Zip,
        [string]$EntryName,
        [string]$Content
    )
    # Si ya existe la entrada, eliminarla primero (idempotente)
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
# Empaquetar cada evidencia
# ---------------------------------------------------------------------------
Write-Host "Empaquetando $($evidences.Count) ZIPs..."

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

            $justifContent = Get-Content -Raw -Encoding UTF8 (Join-Path $JustifSrcDir $ev.Justif)
            Add-EntryToZip -Zip $zip `
                           -EntryName "$($ev.Name)/JUSTIFICACION.md" `
                           -Content $justifContent

            if ($ev.IncludeEndpoints) {
                $epContent = Get-Content -Raw -Encoding UTF8 $EndpointsSource
                Add-EntryToZip -Zip $zip `
                               -EntryName "$($ev.Name)/ENDPOINTS.json" `
                               -Content $epContent
            }
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
Write-Host "Listo. ZIPs generados en: $DestDir"
Write-Host ""
Get-ChildItem $DestDir -Filter '*.zip' |
    Sort-Object Name |
    Select-Object Name, @{Name='Size (KB)'; Expression={[math]::Round($_.Length / 1KB, 1)}} |
    Format-Table -AutoSize
