# Contributing

Thanks for considering a contribution. This repository is deliberately small: one skill, eight templates, one installer.

## Repository layout

| Path | Purpose |
|---|---|
| `SKILL.md` | The canonical skill. This is the product. |
| `templates/` | Files `init` copies into a project. Slots use `<<...>>`. |
| `cli/working-notes.mjs` | Dependency-free installer: install, uninstall, list, doctor. |
| `install.sh`, `install.ps1` | Platform wrappers around the CLI. |
| `.claude-plugin/` | Claude Code plugin and marketplace manifests. |
| `docs/` | Install, method, harness matrix, FAQ. |
| `tests/` | `node --test` suite for the installer. |
| `scripts/validate.mjs` | Repo checks: manifests, docs coverage, secret scan. |

## Before you change something

- **Template slots stay explicit.** Use `<<SLOT NAME>>`. Do not replace a slot with a guessed default. `init` fills them from the user's answers.
- **The skill stays one file.** Supporting material goes in `templates/`. The body is loaded whole when the skill runs, so length has a cost.
- **Harness paths need a vendor link.** A new path in the CLI map is accepted with the documentation URL that names it and the version you tested. No guesses.
- **No new dependencies.** The installer must run with `node` alone.
- **No secrets, no personal paths.** The validator scans for token shapes.

## Development

Run the CLI from this repository as `node cli/working-notes.mjs ...`. Do not test `npx agent-working-notes` from the repository root: npm resolves the current package and will not fetch the published one. Run `npx` from a separate temporary project.

```bash
npm test
npm run validate
```

Both run on Linux and Windows in CI with Node 20, 22 and 24.

Claude Code users can also run:

```bash
claude plugin validate .
```

The command checks `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`, including the root `SKILL.md` discovery and the marketplace entry.

## Changing the installer

1. Add or change the harness entry in `HARNESSES` inside `cli/working-notes.mjs`.
2. Update `docs/INSTALL.md`, `docs/HARNESSES.md` and the README table for the same harness.
3. Add a test in `tests/installer.test.mjs` when behaviour changes.
4. Run both checks. `npm run validate` fails when a harness has no install documentation.

Installer invariants:

- Never write outside the resolved skills directory.
- Never delete a directory without `.working-notes.json` unless `--force`.
- Never prompt in a non-interactive shell.
- Report the plan before writing when `--dry-run` is set.
- Keep `--json` output stable: `{ version, results }` or `{ version, report }`.

## Changing the skill

The skill's content is opinionated. A good change:

- fixes an instruction that produced a wrong outcome in a real project,
- adds a rule with its evidence and origin,
- removes a line that duplicates another,
- sharpens a slot or a brief so an agent cannot misread it.

A change that adds ceremony without a failure behind it will probably be declined. The system is already strict.

If you change the frontmatter `description`, keep it specific about **when** to use the skill. That description is what every harness shows the model before loading the body.

## Commit messages

Short imperative subject, then a body that explains the failure the change prevents. Example:

```text
Fix Antigravity CLI skill path

The CLI reads ~/.gemini/antigravity-cli/skills, not the IDE path.
Tested with agy 1.0.12; vendor docs linked in HARNESSES.md.
```

## Pull requests

- One concern per PR.
- Include the commands you ran and their output for installer changes.
- Include the harness, version and documentation link for path changes.
- Do not reformat unrelated files.
- Do not bump the version; the maintainer does it at release.

## Releases

The maintainer releases from `main`. The version lives in `package.json`, `.claude-plugin/plugin.json` and the marketplace entry; all three must agree or validation fails. A push to `main` that changes the version publishes `agent-working-notes` to npm automatically through `.github/workflows/publish.yml`, provided npm credentials are configured. The full checklist is in [docs/PUBLISHING.md](docs/PUBLISHING.md).

## Reporting a harness change

Open an issue with:

- the harness name and version,
- the documentation URL that states the new directory,
- the path that worked on your machine,
- the output of `working-notes doctor`.

Vendor changes are tracked with the verification date in [docs/HARNESSES.md](docs/HARNESSES.md).
