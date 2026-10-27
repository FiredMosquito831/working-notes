# Harness matrix

`working-notes` uses the open Agent Skills layout: a folder containing `SKILL.md` and supporting files. Any harness that reads that layout can run it. The installer also knows the documented directories for the harnesses below.

Verified against vendor documentation in **October 2026**. Harnesses change their paths; if yours differs, use `--dir` and open an issue.

| Harness | Format read | User skills directory | Project skills directory | Invocation | Official docs |
|---|---|---|---|---|---|
| **Claude Code** | Agent Skills | `~/.claude/skills/` | `.claude/skills/` | `/working-notes`; plugin as `/working-notes:working-notes` | [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills) |
| **OpenAI Codex** | Agent Skills | `~/.agents/skills/` | `.agents/skills/` (scanned upward to the repo root) | `/skills`, or `$` mention | [learn.chatgpt.com/docs/build-skills](https://learn.chatgpt.com/docs/build-skills) |
| **OpenCode** | Agent Skills | `~/.agents/skills/`, `~/.claude/skills/`, `~/.config/opencode/skills/` | `.agents/skills/`, `.claude/skills/`, `.opencode/skills/` | native `skill` tool | [opencode.ai/docs/skills](https://opencode.ai/docs/skills/) |
| **Google Antigravity (IDE/app)** | Agent Skills | `~/.gemini/config/skills/` | `.agents/skills/` (legacy `.agent/skills/`) | `/working-notes` or automatic | [antigravity.google/docs/skills](https://antigravity.google/docs/skills) |
| **Antigravity CLI (`agy`)** | Agent Skills | `~/.gemini/antigravity-cli/skills/` | `.agents/skills/` | `/working-notes` | [antigravity.google/docs/skills](https://antigravity.google/docs/skills) |
| **DeepSeek Harness (`dsh`)** | Agent Skills | `~/.agents/skills/`, `~/.dsh/skills/` | `.agents/skills/`, `.dsh/skills/` | skills catalog | [github.com/deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) |
| **Kilo Code** | Agent Skills | `~/.kilo/skills/` | `.kilo/skills/` | `/working-notes` | [kilo.ai/docs/customize/skills](https://kilo.ai/docs/customize/skills) |
| **Command Code** | Agent Skills | project only | `.commandcode/skills/` | automatic | [github.com/CommandCodeAI/agent-skills](https://github.com/CommandCodeAI/agent-skills) |

## Instruction-file support

The skill's `init` also writes a managed block into `CLAUDE.md`. When `AGENTS.md` exists, both files are kept identical.

| File | Read by |
|---|---|
| `CLAUDE.md` | Claude Code, DeepSeek Harness, several others |
| `AGENTS.md` | Codex, OpenCode, Antigravity, DeepSeek Harness, Kilo, Copilot, many others |
| `.agents/rules/` | Antigravity workspace rules |
| `.agents/workflows/` | Antigravity slash workflows |

So even a harness that does not index the skill still receives the ten rules and the file entry points. The skill adds discoverability and the subcommands; the rules block is the floor.

## Shared directories

Codex, OpenCode, Antigravity (project scope) and DeepSeek Harness all scan `.agents/skills`. The installer deduplicates by destination, so:

```bash
working-notes install --agent all --scope project
```

writes one copy to `.agents/skills/working-notes/`, not four. The JSON output lists every harness that the copy serves.

## Support levels

| Level | Meaning |
|---|---|
| **Documented by the vendor** | The path in the table comes from the harness's own docs |
| **Shared standard** | The harness reads the Agent Skills layout at a documented path |
| **Custom** | `--dir <path>`; the skill works if the harness reads `SKILL.md` folders |

Everything in the table is in the first two categories. Nothing is guessed.

## Adding a harness

1. Find the vendor's documented Agent Skills directory (user and project).
2. Add an entry to `HARNESSES` in [`cli/working-notes.mjs`](../cli/working-notes.mjs).
3. Add a row to this file, `docs/INSTALL.md` and the README table.
4. Add a test in `tests/installer.test.mjs` if the path has unusual behaviour.
5. Run `npm test` and `npm run validate`.

The validator fails when a harness in the CLI map has no install documentation, so the three stay in sync.
