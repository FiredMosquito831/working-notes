# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [1.2.2] - 2026-10-28

### Fixed

- Ship one binary, `working-notes`. The package name (`agent-working-notes`) and the binary name differ by design; one binary keeps the install surface unambiguous across `npx`, global installs and pinned versions.
- Post-publish verification now retries for up to three minutes. npm accepts a publish before the registry document lists the new version, which made the 1.2.1 workflow fail after a successful publish.

## [1.2.1] - 2026-10-28

### Fixed

- Automatic publishing with npm **trusted publishing** no longer requires a repository variable. The workflow already requests `id-token: write`; with no `NPM_TOKEN` secret it relies on the GitHub OIDC token, which is what npm's trusted publisher expects.
- Publishing documentation now states that trusted publishing needs only the npm-side configuration, and that a missing token is reported by npm instead of being skipped silently.

## [1.2.0] - 2026-10-28

### Added

- npm package **`agent-working-notes`**, with `agent-working-notes` and `working-notes` binaries.
- `npx -y agent-working-notes install` and global install (`npm install -g agent-working-notes`) as first-class install routes. The GitHub route remains as the always-current fallback.
- `.github/workflows/publish.yml`: publishes on a published GitHub release, on a version bump pushed to `main`, and on manual dispatch. Verifies tag against `package.json`, skips versions already on npm, attaches provenance, and supports npm trusted publishing or an `NPM_TOKEN` secret.
- `prepublishOnly` gate: tests and repository validation run before any manual publish.
- Publishing documentation for trusted publishing, token setup, the release flow and verification.

### Changed

- Package renamed from `working-notes-skill` to `agent-working-notes`.
- Validation now enforces that the npm, Claude plugin and marketplace versions agree, and that the publish workflow stays wired to npm.

## [1.1.0] - 2026-10-28

### Added

- Documented support for six more harnesses: Cursor, GitHub Copilot, Gemini CLI, Cline, Qwen Code, and Windsurf / Devin Desktop. Fourteen harnesses in total.
- Copy-paste install commands per harness in the README and `docs/INSTALL.md`, with exact user and project paths, invocation, and harness-specific notes.
- A contents list, a comparison table, and per-harness badges in the README.
- Harness compatibility aliases (`.agents/skills`, `.claude/skills`, `.codex/skills`) documented per harness.

### Changed

- Auto-detection now uses harness-specific markers instead of shared directories, so a shared `.agents` directory no longer counts as three installed harnesses.
- The harness matrix, FAQ, publishing metadata and repository topics reflect all fourteen harnesses.

## [1.0.0] - 2026-10-27

### Added

- `SKILL.md`, a portable Agent Skill that initializes a project's orchestration setup: `WORKING-NOTES.md`, `WORKING-NOTES-ARCHIVE.md`, `QUEUE.md`, dated handoffs and `specs/`.
- Managed `CLAUDE.md` / `AGENTS.md` block, delimited by markers and refreshed on re-run.
- Eight templates: the operating manual, queue, handoff, spec, implementer brief, investigator brief, verify recipe and the rules block.
- Subcommands: `init`, `handoff`, `queue`, `brief`, `lesson`.
- Dependency-free Node installer with `install`, `uninstall`, `list` and `doctor`.
- Documented installs for Claude Code, OpenAI Codex, OpenCode, Google Antigravity (IDE, app and CLI), DeepSeek Harness, Kilo Code and Command Code.
- Project and user scope, shared-directory deduplication, custom `--dir`, `--dry-run`, `--json`, `--force`.
- Claude Code plugin and marketplace manifests.
- `install.sh` and `install.ps1` wrappers plus `npx github:` one-liner.
- Installer test suite, repository validator and cross-platform CI.
- Documentation: install, method, harness matrix, FAQ, contributing.

[1.2.2]: https://www.npmjs.com/package/agent-working-notes/v/1.2.2
[1.2.1]: https://www.npmjs.com/package/agent-working-notes/v/1.2.1
[1.2.0]: https://www.npmjs.com/package/agent-working-notes/v/1.2.0
[1.1.0]: https://github.com/FiredMosquito831/working-notes/commit/1d0fd87
[1.0.0]: https://github.com/FiredMosquito831/working-notes/commit/88a8a4d
