# Harness matrix

`working-notes` uses the open Agent Skills layout: a folder containing `SKILL.md` and supporting files. Any harness that reads that layout can run it. The installer knows the documented directories for the harnesses below.

Verified against vendor documentation in **October 2026**. Harnesses change paths; if yours differs, use `--dir` and open an issue.

## Agent Skills locations

| Harness | User directory | Project directory | Invocation | Official docs |
|---|---|---|---|---|
| **Claude Code** | `~/.claude/skills/` | `.claude/skills/` | `/working-notes`; plugin as `/working-notes:working-notes` | [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills) |
| **OpenAI Codex** | `~/.agents/skills/` | `.agents/skills/`, scanned upward to the repo root | `/skills`, or `$` mention | [learn.chatgpt.com/docs/build-skills](https://learn.chatgpt.com/docs/build-skills) |
| **Cursor** | `~/.cursor/skills/` (also `~/.agents/skills/`) | `.cursor/skills/` (also `.agents/skills/`) | automatic, or `/` in chat | [cursor.com/docs/skills](https://cursor.com/docs/skills) |
| **GitHub Copilot** | `~/.copilot/skills/` (also `~/.agents/skills/`, `~/.claude/skills/`) | `.github/skills/` (also `.agents/skills/`, `.claude/skills/`) | `/` menu, `/skills` | [VS Code agent skills](https://code.visualstudio.com/docs/agent-customization/agent-skills) |
| **Gemini CLI** | `~/.gemini/skills/` (`~/.agents/skills/` alias) | `.gemini/skills/` (`.agents/skills/` alias) | automatic `activate_skill` with consent | [geminicli.com/docs/cli/skills](https://geminicli.com/docs/cli/skills) |
| **OpenCode** | `~/.agents/skills/` (also `~/.config/opencode/skills/`, `~/.claude/skills/`) | `.agents/skills/` (also `.opencode/skills/`, `.claude/skills/`) | native `skill` tool | [opencode.ai/docs/skills](https://opencode.ai/docs/skills/) |
| **Google Antigravity (IDE/app)** | `~/.gemini/config/skills/` | `.agents/skills/` (legacy `.agent/skills/`) | `/working-notes` or automatic | [antigravity.google/docs/skills](https://antigravity.google/docs/skills) |
| **Antigravity CLI (`agy`)** | `~/.gemini/antigravity-cli/skills/` | `.agents/skills/` | `/working-notes` | [antigravity.google/docs/skills](https://antigravity.google/docs/skills) |
| **Cline** | `~/.cline/skills/` | `.cline/skills/` (also `.clinerules/skills/`, `.claude/skills/`) | `/` menu | [docs.cline.bot/customization/skills](https://docs.cline.bot/customization/skills) |
| **Qwen Code** | `~/.qwen/skills/` (also `~/.agents/skills/`) | `.qwen/skills/` (also `.agents/skills/`) | automatic | [Qwen Code skills](https://github.com/QwenLM/qwen-code/blob/main/docs/users/features/skills.md) |
| **Kilo Code** | `~/.kilo/skills/` | `.kilo/skills/` | `/working-notes`, `/reload` after install | [kilo.ai/docs/customize/skills](https://kilo.ai/docs/customize/skills) |
| **Windsurf / Devin Desktop** | `~/.codeium/windsurf/skills/` | `.windsurf/skills/` (legacy) or `.devin/skills/` (current) | automatic in Cascade | [docs.devin.ai/desktop/cascade/skills](https://docs.devin.ai/desktop/cascade/skills) |
| **DeepSeek Harness (`dsh`)** | `~/.agents/skills/` (also `~/.dsh/skills/`) | `.agents/skills/` (also `.dsh/skills/`) | skills catalog | [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) |
| **Command Code** | project only | `.commandcode/skills/` | automatic | [Command Code skills](https://github.com/CommandCodeAI/agent-skills) |

## Instruction-file support

The skill's `init` writes a managed block into `CLAUDE.md`. When `AGENTS.md` exists, both files are kept identical.

| File | Read by |
|---|---|
| `CLAUDE.md` | Claude Code, Cursor, Copilot, DeepSeek Harness, several others |
| `AGENTS.md` | Codex, Cursor, Copilot, Gemini CLI, OpenCode, Antigravity, DeepSeek Harness, Kilo, Cline, Qwen, Windsurf, many others |
| `.agents/rules/` | Antigravity workspace rules |
| `.agents/workflows/` | Antigravity slash workflows |

Even a harness that does not index the skill receives the ten rules and the file entry points. The skill adds discoverability and the subcommands; the rules block is the floor.

## Shared directories

Several harnesses read `.agents/skills`:

- Codex (user and project)
- OpenCode (user and project, as one of its paths)
- DeepSeek Harness (user and project)
- Gemini CLI (alias, outranking `.gemini` at the same tier)
- Cursor (alias, alongside `.cursor`)
- Copilot (one of its paths)
- Antigravity and Antigravity CLI (project scope)

The installer maps Codex, OpenCode and DeepSeek Harness to the shared path and writes **one copy**, not three. Gemini CLI, Cursor and Copilot use their product-named directory by default, because that is what their users expect; their shared aliases are documented above for teams that prefer a single copy.

```bash
# one copy in .agents/skills, serving three harnesses
npx -y github:FiredMosquito831/working-notes install --agent codex,opencode,deepseek --scope project
```

## Support levels

| Level | Meaning |
|---|---|
| **Vendor-documented** | The path comes from the harness's own documentation |
| **Vendor-documented alias** | The harness documents this path as an accepted alternative |
| **Custom** | `--dir <path>`; the skill works if the harness reads `SKILL.md` folders |

Everything in the table is vendor-documented. Nothing is guessed.

## Harnesses without Agent Skills

Some agents have no `SKILL.md` mechanism. They still benefit from the managed `CLAUDE.md` / `AGENTS.md` block that `init` writes, but the slash command will not exist:

- **Zed** and **Continue** use rules files rather than skills.
- **Aider** reads its own conventions and has no skills directory.
- **Kiro** uses steering files.

For those, run `init` once with any harness, keep the resulting `AGENTS.md`, and commit it.

## Adding a harness

1. Find the vendor's documented Agent Skills directory (user and project).
2. Add an entry to `HARNESSES` in [`cli/working-notes.mjs`](../cli/working-notes.mjs).
3. Add a row to this file, `docs/INSTALL.md` and the README table.
4. Add a test in `tests/installer.test.mjs` when the path has unusual behaviour.
5. Run `npm test` and `npm run validate`.

The validator fails when a harness in the CLI map has no install documentation, so the three stay in sync.
