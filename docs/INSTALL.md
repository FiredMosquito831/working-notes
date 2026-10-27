# Install

`working-notes` is one skill folder (`SKILL.md` plus `templates/`) copied into a directory your agent already reads. The installer is a dependency-free Node script; it writes files locally and contacts nothing.

## Requirements

- **Node.js 18 or newer** for the installer and the `npx` route
- **git** for `npx github:` and manual clones
- One supported harness, or any harness that reads the open Agent Skills format

```bash
node --version
git --version
```

## One command

```bash
npx -y agent-working-notes install
```

With no options, the installer:

1. Detects every supported harness on the machine (binary on `PATH` or config directory present).
2. Resolves each harness to its documented skills directory.
3. Copies `SKILL.md`, `templates/` and `LICENSE` into `<skills dir>/working-notes/`.
4. Writes `.working-notes.json` with the version and source, so updates and removal are safe.
5. Prints every destination.

If no harness is detected it stops and asks you to name one. It never invents a directory outside the documented locations.

The npm package is published from the tagged GitHub release. Without npm, the same command runs straight from `main`:

```bash
npx -y github:FiredMosquito831/working-notes install
```

To keep a binary on `PATH` instead of downloading through `npx` each time:

```bash
npm install -g agent-working-notes
agent-working-notes install
```

`working-notes` is an alias for the same binary.

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

Every command is complete. Add `--scope project` to write into the current repository instead of your home directory.

| Harness | Install command |
|---|---|
| Claude Code | `npx -y agent-working-notes install --agent claude-code` |
| OpenAI Codex | `npx -y agent-working-notes install --agent codex` |
| Cursor | `npx -y agent-working-notes install --agent cursor` |
| GitHub Copilot | `npx -y agent-working-notes install --agent copilot` |
| Gemini CLI | `npx -y agent-working-notes install --agent gemini` |
| OpenCode | `npx -y agent-working-notes install --agent opencode` |
| Google Antigravity | `npx -y agent-working-notes install --agent antigravity` |
| Antigravity CLI (`agy`) | `npx -y agent-working-notes install --agent antigravity-cli` |
| Cline | `npx -y agent-working-notes install --agent cline` |
| Qwen Code | `npx -y agent-working-notes install --agent qwen` |
| Kilo Code | `npx -y agent-working-notes install --agent kilo` |
| Windsurf / Devin Desktop | `npx -y agent-working-notes install --agent windsurf` |
| DeepSeek Harness (`dsh`) | `npx -y agent-working-notes install --agent deepseek` |
| Command Code | `npx -y agent-working-notes install --agent commandcode --scope project` |

## Claude Code

```bash
npx -y agent-working-notes install --agent claude-code
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

The plugin is namespaced as `/working-notes:working-notes`; the bare `/working-notes` also invokes it. Update with `/plugin update working-notes`.

## OpenAI Codex

```bash
npx -y agent-working-notes install --agent codex
```

| Scope | Destination |
|---|---|
| User | `~/.agents/skills/working-notes/` |
| Project | `<repo>/.agents/skills/working-notes/` |

Codex scans `.agents/skills` from the current directory up to the repository root. Invoke with `/skills`, or type `$` and mention the skill. Codex also reads the managed block that `init` writes into `AGENTS.md`.

## Cursor

```bash
npx -y agent-working-notes install --agent cursor
```

| Scope | Destination |
|---|---|
| User | `~/.cursor/skills/working-notes/` |
| Project | `<repo>/.cursor/skills/working-notes/` |

Cursor also reads `~/.agents/skills/`, `.agents/skills/`, and the Claude/Codex compatibility paths (`.claude/skills/`, `.codex/skills/`). The skill name must match its folder, which it does. Restart Cursor or open a new agent session, then invoke automatically or type `/` in chat.

## GitHub Copilot

```bash
npx -y agent-working-notes install --agent copilot
```

| Scope | Destination |
|---|---|
| User | `~/.copilot/skills/working-notes/` |
| Project | `<repo>/.github/skills/working-notes/` |

Copilot also reads `~/.claude/skills/`, `~/.agents/skills/`, `.claude/skills/` and `.agents/skills/`. Invoke from the `/` menu in chat, or open the skill list with `/skills`. The CLI and app use the same personal and project locations; editor-only settings do not carry over.

## Gemini CLI

```bash
npx -y agent-working-notes install --agent gemini
```

| Scope | Destination |
|---|---|
| User | `~/.gemini/skills/working-notes/` |
| Project | `<repo>/.gemini/skills/working-notes/` |

The `~/.agents/skills/` and `.agents/skills/` aliases also work and outrank the `.gemini` path at the same tier. Invocation is automatic through `activate_skill`; Gemini shows a consent prompt the first time, then loads the skill into the session.

## OpenCode

```bash
npx -y agent-working-notes install --agent opencode
```

| Scope | Destination |
|---|---|
| User | `~/.agents/skills/working-notes/` |
| Project | `<repo>/.agents/skills/working-notes/` |

OpenCode also reads `~/.config/opencode/skills/`, `~/.claude/skills/`, `.opencode/skills/` and `.claude/skills/`. It loads the skill through its native `skill` tool. This installer uses the shared `.agents` path so Codex, OpenCode and DeepSeek Harness can share one copy.

## DeepSeek Harness (`dsh`)

```bash
npx -y agent-working-notes install --agent deepseek
```

| Scope | Destination |
|---|---|
| User | `~/.agents/skills/working-notes/` |
| Project | `<repo>/.agents/skills/working-notes/` |

`dsh` also discovers `~/.dsh/skills/` and `.dsh/skills/`, and reads `AGENTS.md` and `CLAUDE.md`. The skill appears in its skills catalog; the rules block applies even when the skill is not invoked.

## Qwen Code

```bash
npx -y agent-working-notes install --agent qwen
```

| Scope | Destination |
|---|---|
| User | `~/.qwen/skills/working-notes/` |
| Project | `<repo>/.qwen/skills/working-notes/` |

Qwen Code also reads `~/.agents/skills/` and `.agents/skills/`; a skill in `.qwen` wins when both exist. Skills load automatically when the task matches the description.

## Command Code

```bash
npx -y agent-working-notes install --agent commandcode --scope project
```

| Scope | Destination |
|---|---|
| Project (only) | `<repo>/.commandcode/skills/working-notes/` |

Command Code documents project-level skills only. A user-scope install is skipped with a note; `--agent all --scope user` skips it too. Skills are detected and activated automatically.

## Google Antigravity

```bash
npx -y agent-working-notes install --agent antigravity
npx -y agent-working-notes install --agent antigravity-cli
```

| Target | User destination | Project destination |
|---|---|---|
| IDE and app | `~/.gemini/config/skills/working-notes/` | `<repo>/.agents/skills/working-notes/` |
| CLI (`agy`) | `~/.gemini/antigravity-cli/skills/working-notes/` | `<repo>/.agents/skills/working-notes/` |

The IDE also reads `~/.gemini/antigravity/skills/` (legacy) and `.agent/skills/` (legacy). Skills appear as `/working-notes` and through automatic discovery. The managed block in `AGENTS.md` also becomes a workspace rule.

## Cline

```bash
npx -y agent-working-notes install --agent cline
```

| Scope | Destination |
|---|---|
| User | `~/.cline/skills/working-notes/` |
| Project | `<repo>/.cline/skills/working-notes/` |

Cline also reads `.clinerules/skills/` and `.claude/skills/`. The skill name must match its folder. Restart the extension or start a new task, then use the `/` menu or let Cline match the description.

## Kilo Code

```bash
npx -y agent-working-notes install --agent kilo
```

| Scope | Destination |
|---|---|
| User | `~/.kilo/skills/working-notes/` |
| Project | `<repo>/.kilo/skills/working-notes/` |

Run `/reload` in a session to pick up a new skill without restarting. Invoke as `/working-notes`.

## Windsurf / Devin Desktop

```bash
npx -y agent-working-notes install --agent windsurf
```

| Scope | Destination |
|---|---|
| User | `~/.codeium/windsurf/skills/working-notes/` |
| Project | `<repo>/.windsurf/skills/working-notes/` |

The current Devin Desktop documentation uses `.devin/skills/` and `~/.config/devin/skills/`; the legacy `.windsurf` paths are still read. If your build uses only the new layout:

```bash
npx -y agent-working-notes install --agent windsurf --dir ~/.config/devin/skills
npx -y agent-working-notes install --agent windsurf --dir .devin/skills --scope project
```

Skills load automatically in Cascade.

## Any other harness

```bash
npx -y agent-working-notes install --dir ~/.my-agent/skills
```

The skill is self-contained. Point `--dir` at whatever directory your harness scans for `SKILL.md` folders. Repeat `--dir` or pass a comma-separated list.

## Project vs user scope

| Scope | Where | Use when |
|---|---|---|
| `user` (default) | Home directory | You want the skill in every project |
| `project` | The current repository (`--cwd` to change) | The skill should ship with the repo and be reviewed like code |

Project copies can be committed. That is useful for teams that want the same rules everywhere; it also means the skill updates when the repository does.

## Options

| Option | Meaning |
|---|---|
| `-a, --agent <list>` | `auto` (default), `all`, or a comma list: `claude-code`, `codex`, `cursor`, `copilot`, `gemini`, `opencode`, `antigravity`, `antigravity-cli`, `cline`, `qwen`, `kilo`, `windsurf`, `deepseek`, `commandcode` |
| `-s, --scope <scope>` | `user` (default) or `project` |
| `-d, --dir <path>` | Explicit directory, repeatable. Bypasses the harness map |
| `--cwd <path>` | Project root for project scope |
| `-f, --force` | Replace a directory this tool did not install |
| `--dry-run` | Print the plan and write nothing |
| `--json` | Machine-readable output |
| `-q, --quiet` | Errors only |

## Verify the install

```bash
npx -y agent-working-notes list
npx -y agent-working-notes doctor
```

`list` shows every supported harness, its resolved paths, and whether it was detected. `doctor` checks each installed copy against the CLI version.

Then start a session in a repository and run:

```text
/working-notes init
```

If the slash command is not offered, ask the agent to read `SKILL.md` from the path `list` printed. Every harness supports that fallback.

## Update

```bash
npx -y agent-working-notes install --agent all
```

The installer refreshes copies it owns, keeps project artifacts untouched, and reports `up-to-date` when nothing changed. Plugin users run `/plugin update working-notes`.

## Uninstall

```bash
npx -y agent-working-notes uninstall --agent all
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
Restart the session or reload the harness. Most index skills at startup; Kilo Code has `/reload`. Confirm that `SKILL.md` sits directly inside `<skills dir>/working-notes/`, that the frontmatter `name` is `working-notes`, and that it matches the folder. Cursor, Cline and VS Code enforce the name-to-folder match.

**The skill is listed but never used**  
Tighten the request to the skill's purpose, or invoke it explicitly (`/working-notes`, `/skills`, `$mention`). Automatic activation depends on the description matching the task.

**A directory was refused**  
The destination exists but was not installed by this tool. Inspect it, move it aside, or pass `--force`.

**Command Code is skipped at user scope**  
Command Code documents project-level skills only. Install with `--scope project`.

**`npx` cannot fetch the repository**  
Check git and network access, or clone manually and run `node cli/working-notes.mjs install`.

**Windows paths**  
The CLI uses Node's path handling. Use `--dir "C:\path\to\skills"` or a forward-slash path; both work. From a clone, run `.\install.ps1`.

**CI or a non-interactive shell**  
Pass `--agent ... --scope ... --quiet`. The installer never prompts.
