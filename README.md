<div align="center">

<img src="assets/banner.svg" alt="working-notes: a portable Agent Skill for Claude Code, Codex, OpenCode, Antigravity, Command Code and DeepSeek Harness" width="100%">

<h1>working-notes</h1>

<p><strong>The operating manual your AI coding agent was missing.</strong></p>

<p>A portable <strong>Agent Skill</strong> (<code>SKILL.md</code>) that turns any repository into an orchestrated project:<br>
investigate before building, write a spec, record the decision, run <em>one</em> implementer,<br>
verify every claim yourself, and keep a queue, handoff and lesson log that survive the session.</p>

<p>
<a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="MIT license"></a>
<img src="https://img.shields.io/badge/format-SKILL.md-8b5cf6?style=flat-square" alt="Agent Skills SKILL.md format">
<img src="https://img.shields.io/badge/works%20with-Claude%20Code%20%7C%20Codex%20%7C%20OpenCode%20%7C%20Antigravity%20%7C%20Command%20Code%20%7C%20DeepSeek%20Harness-0ea5e9?style=flat-square" alt="Works with Claude Code, Codex, OpenCode, Antigravity, Command Code and DeepSeek Harness">
<img src="https://img.shields.io/badge/node-%E2%89%A518-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node 18 or newer">
</p>

<p>
<a href="#quick-start">Quick start</a> ·
<a href="#install">Install</a> ·
<a href="#what-it-creates">What it creates</a> ·
<a href="#the-rules">The rules</a> ·
<a href="#how-it-works">How it works</a> ·
<a href="#faq">FAQ</a>
</p>

</div>

---

## Why your agent needs this

Every AI coding session starts brilliant and ends forgetful. Not because the model is weak, but because nothing in the repo holds the work together:

- **The context dies with the chat.** The next session re-derives the plan, re-asks the same questions, and re-makes the same mistakes.
- **"Done" means "the agent said so".** Nobody checked the merge, the tag, the artefact, the diff, or the live system.
- **Parallel agents collide.** Two implementers, one version file, one broken release. Investigations and builds blur into one unbounded prompt.
- **Decisions evaporate.** A choice made on Tuesday is silently reversed on Friday because the reason was never written down.

`working-notes` installs the missing layer: a **repo-local operating manual, a binding PR queue, dated handoffs, and a verification contract**. The agent reads it at the start of every session. You stop repeating yourself, and the agent stops inventing.

> One command installs the skill. One command initializes the project. Every session after that runs from the files in the repo.

---

## How it works

<p align="center">
<img src="assets/loop.svg" alt="The working-notes loop: discuss, investigate, spec, decide, one implementer, verify, then record the queue, handoff and lessons" width="100%">
</p>

The loop is deliberately boring:

1. **Discuss before building.** Anything beyond a literal small ask starts with a read-only investigation, not an edit.
2. **Write the spec.** Numbered findings, options, and plain-language questions, each with a recommendation.
3. **Record the decision.** Your one-line answers become a binding `USER DECISIONS` block in the spec.
4. **Dispatch one implementer.** It gets a brief, a worktree, a version, a proof bar and an explicit not-in-scope list.
5. **Verify it yourself.** Merge SHA, tag, artefact digest, frozen-file diff, CI states, screenshots, a live call that does real work.
6. **Write it down.** Queue row flipped, release-history row added, lesson recorded, handoff refreshed.

Read the full method in [How it works](docs/HOW-IT-WORKS.md).

---

## Quick start

Requires **Node.js 18+** and **git**. The installer copies `SKILL.md` and its templates into the directories your harness already reads. Nothing is sent anywhere.

```bash
npx -y github:FiredMosquito831/working-notes install
```

The installer detects the harnesses on your machine and prints exactly where the skill landed. To choose explicitly:

```bash
npx -y github:FiredMosquito831/working-notes install --agent claude-code,codex
```

Then open your project and start a session:

```text
/working-notes init
```

Or just ask: **"set up working notes for this repo"**.

### Platform one-liners

**macOS / Linux / WSL / Git Bash**

```bash
curl -fsSL https://raw.githubusercontent.com/FiredMosquito831/working-notes/main/install.sh | sh
```

**Windows PowerShell**

```powershell
irm https://raw.githubusercontent.com/FiredMosquito831/working-notes/main/install.ps1 | iex
```

Both wrappers forward every option to the same installer.

### Claude Code plugin

Claude Code users can install it as a plugin instead:

```text
/plugin marketplace add FiredMosquito831/working-notes
/plugin install working-notes@firedmosquito
```

Or from a shell:

```bash
claude plugin marketplace add FiredMosquito831/working-notes
claude plugin install working-notes@firedmosquito
```

The plugin loads the repository skill as `/working-notes` (also namespaced as `/working-notes:working-notes`). The plugin route updates with `/plugin update working-notes`.

---

## Install

Every harness below reads the open [Agent Skills](https://github.com/anthropics/skills) layout: a directory containing `SKILL.md` plus optional supporting files. `working-notes` also writes the managed block into `CLAUDE.md` and `AGENTS.md`, so harnesses that only read instruction files still get the rules.

| Harness | Install | User scope (Windows / macOS / Linux) | Project scope | Invoke |
|---|---|---|---|---|
| **Claude Code** | `... --agent claude-code` | `~/.claude/skills/working-notes/` | `.claude/skills/working-notes/` | `/working-notes` |
| **OpenAI Codex** | `... --agent codex` | `~/.agents/skills/working-notes/` | `.agents/skills/working-notes/` | `/skills`, or `$` mention |
| **OpenCode** | `... --agent opencode` | `~/.agents/skills/working-notes/` | `.agents/skills/working-notes/` | `skill` tool |
| **Google Antigravity** | `... --agent antigravity` | `~/.gemini/config/skills/working-notes/` | `.agents/skills/working-notes/` | `/working-notes` |
| **Antigravity CLI (`agy`)** | `... --agent antigravity-cli` | `~/.gemini/antigravity-cli/skills/working-notes/` | `.agents/skills/working-notes/` | `/working-notes` |
| **DeepSeek Harness (`dsh`)** | `... --agent deepseek` | `~/.agents/skills/working-notes/` | `.agents/skills/working-notes/` | skills catalog |
| **Kilo Code** | `... --agent kilo` | `~/.kilo/skills/working-notes/` | `.kilo/skills/working-notes/` | `/working-notes` |
| **Command Code** | `... --agent commandcode` | project scope only | `.commandcode/skills/working-notes/` | automatic |
| **Anything else** | `... --dir <skills dir>` | any path | any path | depends on the host |

```bash
# every harness detected on this machine
npx -y github:FiredMosquito831/working-notes install

# every supported harness, user scope
npx -y github:FiredMosquito831/working-notes install --agent all

# a project-local copy, shared by Codex, OpenCode, Antigravity and dsh
npx -y github:FiredMosquito831/working-notes install --agent all --scope project

# anywhere else that reads SKILL.md
npx -y github:FiredMosquito831/working-notes install --dir ~/.my-agent/skills
```

Harnesses that share a directory (`~/.agents/skills`, `.agents/skills`) are written once, not once per harness. Run `working-notes list` to see the resolved paths, and `working-notes doctor` to check an installed copy against the CLI version.

### Manual install

```bash
git clone --depth 1 https://github.com/FiredMosquito831/working-notes.git /tmp/working-notes
cp -r /tmp/working-notes ~/.claude/skills/working-notes
```

Use the folder your harness documents instead of `~/.claude/skills`. The skill needs `SKILL.md` and `templates/`; everything else in the repository is documentation, tests and the installer.

Full paths, verification steps, updates and uninstall: **[docs/INSTALL.md](docs/INSTALL.md)**.

---

## What it creates

`/working-notes init` is idempotent and safe mid-project. It creates only what is missing and never overwrites your files.

```text
your-repo/
├── CLAUDE.md                  # managed "How we work" block, delimited by markers
├── AGENTS.md                  # kept byte-identical when the repo already has one
├── WORKING-NOTES.md           # the operating manual: rules, repo facts, releases, lessons
├── WORKING-NOTES-ARCHIVE.md   # dated diary, superseded blocks, long tables
├── QUEUE.md                   # the binding PR queue
├── HANDOFF-2026-10-27.md      # resume point, newest file is the entry point
└── specs/                     # investigations and binding USER DECISIONS blocks
```

If you keep notes outside the repository, the skill writes them beside it instead and leaves the repo clean. If they live inside, `init` offers to add `.orchestration/` to `.gitignore`.

### What lives where

| File | Purpose | Updated when |
|---|---|---|
| `WORKING-NOTES.md` | Current truth: how you work, repo mechanics, the gate, product principles, domain facts, environment, release history, lessons | Every PR boundary and every lesson |
| `QUEUE.md` | RUNNING / QUEUED / FINISHED / HELD, in binding order, with proofs | Every PR start and end |
| `HANDOFF-<date>.md` | Read order, exact state, what you owe, what to do first, verify commands | Every pause or compaction |
| `specs/` | Investigation, options, risks, numbered questions, decisions | Before any build |
| `CLAUDE.md` / `AGENTS.md` | The entry points and the ten rules that are never relaxed | Once, then refreshed by `init` |

### Subcommands

| Command | What it does |
|---|---|
| `/working-notes init` | Initialize, or refresh what is missing. Safe to re-run. |
| `/working-notes handoff` | Write a dated resume point and the paragraph to paste next session. |
| `/working-notes queue` | Print running, queued, held, finished, and every question you owe. |
| `/working-notes brief <item>` | Produce an implementer or investigator brief with the project's hard rules. |
| `/working-notes lesson "<text>"` | Append a dated lesson with its origin. |

The rules bind whether or not you type the command. The skill is a one-time initializer, not a runtime dependency.

---

## The rules

Ten rules, copied into every project, tuned by five first-use questions:

| # | Rule | What it prevents |
|---|---|---|
| 1 | **Discuss before building** | Dispatch before agreement; half-baked work |
| 2 | **Safest, 100% working, break nothing** | Drive-by rewrites and "while I was there" regressions |
| 3 | **Extend, never narrow** | Quiet removal of behaviour to fit a new case |
| 4 | **One production PR at a time** | Version collisions and parallel-agent chaos |
| 5 | **Verify every "shipped" yourself** | Trusting a summary instead of the artefact |
| 6 | **Separate CONFIRMED / UNVERIFIED / NOT DONE** | Confident claims with no evidence |
| 7 | **Track at every PR boundary** | A queue that drifts from reality |
| 8 | **Never touch the user's world** | Scratch runs that hit the live service or real config |
| 9 | **Write the lesson when you learn it** | Repeating the same mistake next arc |
| 10 | **The final message is the deliverable** | Agents that go silent mid-task |

The full text, including delegation, verification, CI and safety rules, is in [`SKILL.md`](SKILL.md).

---

## Who it is for

- **Solo builders** running Claude Code, Codex, OpenCode, Antigravity or DeepSeek Harness on a real repo, who are tired of re-explaining the project every morning.
- **Teams** that want agent work to leave the same trail as human work: a spec, a decision, a queue, a proof.
- **Long arcs** that outlive one context window: multi-PR features, migrations, release trains.
- **Anyone** who has watched an agent say "done" without running anything.

It is opinionated on purpose. It assumes you want fewer, safer, better-proven changes, and that you would rather answer five numbered questions once than re-litigate them every session.

---

## FAQ

<details>
<summary><strong>Is this only for Claude Code?</strong></summary>

No. The skill uses the open Agent Skills format (`SKILL.md`), which Claude Code, OpenAI Codex, OpenCode, Google Antigravity, DeepSeek Harness, Kilo Code and others read. The installer also writes the managed rules block into `CLAUDE.md` and `AGENTS.md`, so instruction-file-only harnesses still get the rules.

</details>

<details>
<summary><strong>Will it overwrite my CLAUDE.md or AGENTS.md?</strong></summary>

No. It appends one block delimited by `<!-- working-notes:begin -->` and `<!-- working-notes:end -->`. Re-running `init` replaces only that block. If `AGENTS.md` exists, both files are kept identical.

</details>

<details>
<summary><strong>Does it create process overhead?</strong></summary>

Five named files and a spec folder. No extra trackers, no dashboards, no required CLI at runtime. The skill is an initializer: once the files exist, the repo runs itself.

</details>

<details>
<summary><strong>Can I use it in the middle of a project?</strong></summary>

Yes. `init` derives the repo facts first (remote, default branch, version file, test commands, release workflow, attribution), asks only what it cannot derive, and fills the manual from existing tags and docs. Nothing is overwritten.

</details>

<details>
<summary><strong>What is "one implementer"?</strong></summary>

Read-only investigations may run in parallel beside one writer. Production changes ship one PR at a time because version files and release processes collide. The rule is about concurrency safety, not agent quality.

</details>

<details>
<summary><strong>Does it work on Windows?</strong></summary>

Yes. The CLI is dependency-free Node, the PowerShell wrapper handles Windows paths, and the skill's tooling rules cover CRLF, PowerShell and MSYS traps.

</details>

<details>
<summary><strong>How do I update it?</strong></summary>

Run the installer again, or `npx -y github:FiredMosquito831/working-notes install --agent all`. `working-notes doctor` reports stale copies. Plugin users run `/plugin update working-notes`.

</details>

<details>
<summary><strong>How do I remove it?</strong></summary>

`npx -y github:FiredMosquito831/working-notes uninstall --agent all` removes copies this tool installed. Project artifacts (`WORKING-NOTES.md`, `QUEUE.md`, `CLAUDE.md` block) are yours and are never deleted automatically.

</details>

---

## Documentation

| Document | What it covers |
|---|---|
| [Install](docs/INSTALL.md) | Every harness, exact paths, verification, updates, uninstall, troubleshooting |
| [How it works](docs/HOW-IT-WORKS.md) | The loop, the artifacts, the delegation protocol, the verification contract |
| [Harness matrix](docs/HARNESSES.md) | What each harness supports and where the skill lands |
| [FAQ](docs/FAQ.md) | Longer answers, limitations, and when not to use it |
| [Publishing](docs/PUBLISHING.md) | Repository metadata, release checklist, npm and plugin routes |
| [Contributing](CONTRIBUTING.md) | Repo layout, tests, validation, release process |

---

## Repository layout

```text
working-notes/
├── SKILL.md                 # the skill (canonical text)
├── templates/               # WORKING-NOTES, QUEUE, HANDOFF, SPEC, briefs, verify recipe
├── cli/working-notes.mjs    # dependency-free installer
├── install.sh / install.ps1 # platform wrappers
├── .claude-plugin/          # Claude Code plugin and marketplace manifests
├── docs/                    # install, method, harness matrix, FAQ
├── assets/                  # banner and loop diagram
└── tests/                   # installer test suite (node --test)
```

<details>
<summary>Development checks</summary>

```bash
npm test          # installer tests
npm run validate  # manifests, skill frontmatter, docs coverage, secret scan
claude plugin validate .   # Claude Code plugin and marketplace validation
```

</details>

---

<div align="center">

**If this saves you one re-explained project, star the repo. It helps other agent runners find it.**

<sub>Topics: agent skills · Claude Code skill · Codex skill · OpenCode skill · Antigravity workflows · Command Code skills · DeepSeek Harness skills · spec-driven development · multi-agent orchestration · context engineering · AI coding agents · SKILL.md · AGENTS.md · CLAUDE.md · PR queue · handoff notes</sub>

</div>
