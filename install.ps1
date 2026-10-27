# working-notes installer (Windows PowerShell 5.1+ / PowerShell 7+)
#
# Local clone:   .\install.ps1 [options]
# One-liner:     irm https://raw.githubusercontent.com/FiredMosquito831/working-notes/main/install.ps1 | iex
#
# All options are passed to the Node installer; run with --help to see them.

$ErrorActionPreference = 'Stop'

$root = $null
if ($PSScriptRoot) { $root = $PSScriptRoot }
elseif ($MyInvocation.MyCommand.Path) { $root = Split-Path -Parent $MyInvocation.MyCommand.Path }

if ($root -and (Test-Path (Join-Path $root 'cli/working-notes.mjs'))) {
    & node (Join-Path $root 'cli/working-notes.mjs') @args
}
else {
    $repo = if ($env:WORKING_NOTES_REPO) { $env:WORKING_NOTES_REPO } else { 'FiredMosquito831/working-notes' }
    & npx -y "github:$repo" @args
}

exit $LASTEXITCODE
