# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

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

[1.0.0]: https://github.com/FiredMosquito831/working-notes/releases/tag/v1.0.0
