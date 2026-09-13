$ErrorActionPreference = 'Stop'
$taskRoot = $PSScriptRoot
$taskNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
if (-not (Test-Path -LiteralPath $taskNode)) { $taskNode = (Get-Command node.exe).Source }
if (-not (Test-Path -LiteralPath (Join-Path $taskRoot '.env'))) { throw 'Configuration privée .env absente.' }
if (-not (Test-Path -LiteralPath (Join-Path $taskRoot 'apps\web\.next\BUILD_ID'))) { throw 'Compiler la plateforme avant de démarrer.' }
$taskLogs = Join-Path $taskRoot '.private\logs'
New-Item -ItemType Directory -Path $taskLogs -Force | Out-Null
function Test-TaskPort([int]$port) {
 $client = [System.Net.Sockets.TcpClient]::new()
 try { $client.Connect('127.0.0.1', $port); return $true } catch { return $false } finally { $client.Dispose() }
}
$taskServices = @(
 @{Name='api';Port=4300;Cwd=$taskRoot;Args=@('--env-file=.env','apps/api/dist/main.js')},
 @{Name='lab';Port=3301;Cwd=$taskRoot;Args=@('--env-file=.env','scripts/lab-server.mjs')},
 @{Name='web';Port=3300;Cwd=(Join-Path $taskRoot 'apps\web');Args=@('--env-file=../../.env','node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3300')}
)
foreach ($svc in $taskServices) {
 if (Test-TaskPort $svc.Port) { Write-Output ($svc.Name + ' : port déjà utilisé ; aucun processus remplacé.'); continue }
 Start-Process -FilePath $taskNode -ArgumentList $svc.Args -WorkingDirectory $svc.Cwd -WindowStyle Hidden -RedirectStandardOutput (Join-Path $taskLogs ($svc.Name+'.log')) -RedirectStandardError (Join-Path $taskLogs ($svc.Name+'.error.log')) | Out-Null
}
Write-Output 'Plateforme : http://127.0.0.1:3300/apprentissage'
Write-Output 'PostgreSQL local doit déjà être démarré sur le port 55432.'
