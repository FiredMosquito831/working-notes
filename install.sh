#!/usr/bin/env sh
# working-notes installer (macOS, Linux, WSL, Git Bash)
#
# Local clone:   ./install.sh [options]
# One-liner:     curl -fsSL https://raw.githubusercontent.com/FiredMosquito831/working-notes/main/install.sh | sh
#
# All options are passed to the Node installer; run with --help to see them.

set -eu

here=$(CDPATH= cd -- "$(dirname -- "$0")" 2>/dev/null && pwd || true)

if [ -n "${here:-}" ] && [ -f "$here/cli/working-notes.mjs" ]; then
  exec node "$here/cli/working-notes.mjs" "$@"
fi

REPO="${WORKING_NOTES_REPO:-FiredMosquito831/working-notes}"
exec npx -y "github:${REPO}" "$@"
