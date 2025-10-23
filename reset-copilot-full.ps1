Write-Host "=== Réinitialisation complète de Copilot / VSCode / Cursor ==="
Start-Sleep -Seconds 1

# 1. Fermeture des processus
Write-Host "Fermeture de VSCode et Cursor..."
Get-Process -Name "Code","Cursor" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# 2. Suppression des caches principaux
$paths = @(
  "$env:APPDATA\Code",
  "$env:APPDATA\Cursor",
  "$env:APPDATA\Code - Insiders",
  "$env:APPDATA\Cursor\User\globalStorage\github.copilot*",
  "$env:APPDATA\Code\User\globalStorage\github.copilot*"
)

foreach ($path in $paths) {
  if (Test-Path $path) {
    Write-Host "Suppression : $path"
    Remove-Item -Recurse -Force $path
  }
}

# 3. Suppression des configurations GitHub Copilot
$copilotConfig = "$env:APPDATA\Code\CachedConfigurations"
if (Test-Path $copilotConfig) {
  Write-Host "Suppression du cache de configuration Copilot..."
  Remove-Item -Recurse -Force $copilotConfig
}

# 4. Nettoyage Credential Manager
Write-Host "Nettoyage des identifiants GitHub Copilot (Windows Credential Manager)..."
cmdkey /list | Select-String "github" | ForEach-Object {
  $target = ($_ -split ":")[1].Trim()
  Write-Host "Suppression : $target"
  cmdkey /delete:$target | Out-Null
}

# 5. Nettoyage des tokens Git locaux
Write-Host "Suppression des tokens GitHub locaux..."
git config --global --unset credential.helper 2>$null
git config --global --unset github.token 2>$null

# 6. Vidage du cache temporaire
$tempFolders = @("$env:TEMP\VSCode", "$env:TEMP\Cursor")
foreach ($t in $tempFolders) {
  if (Test-Path $t) {
    Write-Host "Suppression du dossier temporaire : $t"
    Remove-Item -Recurse -Force $t
  }
}

# 7. Réinitialisation du fichier de stockage
$licensePath = "$env:APPDATA\Code\User\globalStorage\storage.json"
if (Test-Path $licensePath) {
  Write-Host "Réinitialisation de $licensePath..."
  Set-Content -Path $licensePath -Value "{}"
}

# 8. Résumé
Write-Host ""
Write-Host "=== Réinitialisation terminée avec succès ==="
Write-Host "1. Ouvre VSCode ou Cursor."
Write-Host "2. Connecte-toi avec ton nouveau compte GitHub."
Write-Host "3. Copilot sera reconfiguré comme si c'était la première fois."
Write-Host ""
Write-Host "Pour réinstaller Cursor manuellement, exécute :"
Write-Host "  winget install ""Cursor"" --source winget"
Write-Host ""
Write-Host "Tu peux maintenant redémarrer ton PC pour finaliser le nettoyage."
