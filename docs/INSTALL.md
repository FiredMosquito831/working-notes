# Install

`working-notes` is one skill folder (`SKILL.md` plus `templates/`) copied into a directory your agent already reads. The installer is a dependency-free Node script; it writes files locally and contacts nothing.

## Requirements

- **Node.js 18 or newer** (for the installer and the `npx` route)
- **git** (for `npx github:` and manual clones)
- Any supported harness, or any harness that reads the open Agent Skills format

Check what you have:

```bash
node --version
git --version
```

## One command

```bash
npx -y github:FiredMosquito831/working-notes install
```

With no options, the installer:

1. Detects every supported harness on the machine (binary on `PATH` or config directory present).
2. Resolves each harness to its documented skills directory.
3. Copies `SKILL.md`, `templates/` and `LICENSE` into `<skills dir>/working-notes/`.
4. Writes `.working-notes.json` (version and source) so updates and removal are safe.
5. Prints each destination.

If no harness is detected, it stops and asks you to name one. It never guesses a directory into existence outside the documented locations.

### Platform wrappers

**macOS, Linux, WSL, Git Bash**

```bash
curl -fsSL https://raw.githubusercontent.com/FiredMosquito831/working-notes/main/install.sh | sh
```

**Windows PowerShell 5.1 or 7**

```powershell
irm https://raw.githubusercontent.com/FiredMosquito831/working-notes/main/install.ps1 | iex
```

Both wrappers forward arguments:

```bash
curl -fsSL https://raw.githubusercontent.com/FiredMosquito831/working-notes/main/install.sh | sh -s -- --agent claude-code
```

## Choose your harness

Replace `...` with `npx -y github:FiredMosquito831/working-notes`.

### Claude Code

```bash
... install --agent claude-code
```

| Scope | Destination | How it appears |
|---|---|---|
| User (default) | `~/.claude/skills/working-notes/` | `/working-notes` in every project |
| Project | `<repo>/.claude/skills/working-notes/` | `/working-notes` in that repo, committable |

Plugin route:

```text
/plugin marketplace add FiredMosquito831/working-notes
/plugin install working-notes@firedmosquito
```

### OpenAI Codex

```bash
... install --agent codex
```

| Scope | Destination |
|---|---|
| User | `~/.agents/skills/working-notes/` |
| Project | `<repo>/.agents/skills/working-notes/` |

Codex scans `.agents/skills` from the current directory up to the repository root. Invoke with `/skills`, or type `$` and mention the skill. Codex also reads the managed block that `init` writes into `AGENTS.md`.

### OpenCode

```bash
... install --agent opencode
```

| Scope | Destination |
|---|---|
| User | `~/.agents/skills/working-notes/` |
| Project | `<repo>/.agents/skills/working-notes/` |

OpenCode loads skills through its native `skill` tool. It also reads `~/.claude/skills` and `~/.config/opencode/skills`; this installer uses the shared `.agents` path so Codex, OpenCode and DeepSeek Harness can share one copy.

### Google Antigravity

```bash
... install --agent antigravity          # IDE and app
... install --agent antigravity-cli      # agy
```

| Target | User destination | Project destination |
|---|---|---|
| IDE and app | `~/.gemini/config/skills/working-notes/` | `<repo>/.agents/skills/working-notes/` |
| CLI (`agy`) | `~/.gemini/antigravity-cli/skills/working-notes/` | `<repo>/.agents/skills/working-notes/` |

Skills appear as slash commands (`/working-notes`) and through automatic discovery. The managed block in `AGENTS.md` also becomes a workspace rule.

### DeepSeek Harness (`dsh`)

```bash
... install --agent deepseek
```

| Scope | Destination |
|---|---|
| User | `~/.agents/skills/working-notes/` |
| Project | `<repo>/.agents/skills/working-notes/` |

`dsh` discovers directory bundles (`<name>/SKILL.md`) in its skills roots. It also reads `AGENTS.md` and `CLAUDE.md`, so the installed rules block applies even when the skill is not invoked.

### Kilo Code

```bash
... install --agent kilo
```

| Scope | Destination |
|---|---|
| User | `~/.kilo/skills/working-notes/` |
| Project | `<repo>/.kilo/skills/working-notes/` |

### Command Code

```bash
... install --agent commandcode --scope project
```

Command Code documents project-level skills only: `<repo>/.commandcode/skills/working-notes/`. A user-scope install of Command Code is skipped with a note. Use `--dir` if your build documents a different path.

### Any other harness

```bash
... install --dir ~/.my-agent/skills
```

The skill is self-contained. Point `--dir` at whatever directory your harness scans for `SKILL.md` folders. You can repeat `--dir` or pass a comma-separated list.

## Project vs user scope

| Scope | Where | Use when |
|---|---|---|
| `user` (default) | Home directory | You want the skill in every project |
| `project` | The current repository (`--cwd` to change) | The skill should ship with the repo and be reviewed like code |

Project-scope copies can be committed. That is useful for teams that want the same rules everywhere; it also means the skill updates when the repository does.

## Options

| Option | Meaning |
|---|---|
| `-a, --agent <list>` | `auto` (default), `all`, or a comma list: `claude-code, codex, opencode, antigravity, antigravity-cli, deepseek, kilo, commandcode` |
| `-s, --scope <scope>` | `user` (default) or `project` |
| `-d, --dir <path>` | Explicit directory, repeatable. Bypasses the harness map |
| `--cwd <path>` | Project root for project scope |
| `-f, --force` | Replace a directory this tool did not install |
| `--dry-run` | Print the plan and write nothing |
| `--json` | Machine-readable output |
| `-q, --quiet` | Errors only |

## Verify the install

```bash
npx -y github:FiredMosquito831/working-notes list
npx -y github:FiredMosquito831/working-notes doctor
```

`list` shows every supported harness, its resolved paths, and whether it was detected. `doctor` checks each installed copy against the CLI version.

Then start a session in a repository and run:

```text
/working-notes init
```

If the slash command is not suggested, ask the agent to read `SKILL.md` from the path `list` printed. Every harness supports that fallback.

## Update

```bash
npx -y github:FiredMosquito831/working-notes install --agent all
```

The installer refreshes copies it owns, keeps your project artifacts untouched, and reports `up-to-date` when nothing changed. Plugin users:

```text
/plugin update working-notes
```

## Uninstall

```bash
npx -y github:FiredMosquito831/working-notes uninstall --agent all
```

This removes only directories carrying `.working-notes.json` (the installer's manifest). A directory without it is refused unless you pass `--force`.

Project artifacts (`WORKING-NOTES.md`, `QUEUE.md`, `HANDOFF-*.md`, `specs/`, and the managed block in `CLAUDE.md` / `AGENTS.md`) are yours. The installer never deletes them. Remove the block by deleting the text between `<!-- working-notes:begin -->` and `<!-- working-notes:end -->`.

## Manual install

```bash
git clone --depth 1 https://github.com/FiredMosquito831/working-notes.git /tmp/working-notes
mkdir -p ~/.claude/skills
cp -r /tmp/working-notes ~/.claude/skills/working-notes
```

The clone includes documentation, tests and the installer, which the skill does not need. A lean copy contains only `SKILL.md`, `templates/` and `LICENSE`.

## Troubleshooting

**"No known harness detected"**  
Name the harness explicitly (`--agent claude-code`) or pass `--dir`.

**The slash command does not appear**  
Restart the session. Most harnesses index skills at startup. If it still does not appear, confirm that `SKILL.md` sits directly inside `<skills dir>/working-notes/` and that the frontmatter `name` is `working-notes`.

**A directory was refused**  
The destination exists but was not installed by this tool. Inspect it, move it aside, or pass `--force`.

**`npx` cannot fetch the repository**  
Check git and network access, or clone manually and run `node cli/working-notes.mjs install`.

**Windows paths**  
The CLI uses Node's path handling. Use `--dir "C:\path\to\skills"` or a forward-slash path; both work. When running the PowerShell wrapper from a clone, use `.\install.ps1`.

**CI or a non-interactive shell**  
Pass `--agent ... --scope ... --quiet`. The installer never prompts.
