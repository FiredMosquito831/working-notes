# Publishing and repository metadata

This file holds the exact metadata for the GitHub repository, the release checklist, and the optional npm and plugin routes. It is written so the repo can be published without re-deriving the copy.

## Repository metadata

**Name**

```text
working-notes
```

**Description** (232 characters)

```text
An Agent Skill that gives AI coding agents an operating memory: specs, binding decisions, a PR queue, handoffs and self-verification. Works with Claude Code, Codex, Cursor, Copilot, Gemini CLI, OpenCode, Antigravity and more.
```

**Topics** (20, GitHub's limit)

```text
agent-skills
claude-code
claude-code-skill
codex
cursor
github-copilot
gemini-cli
opencode
antigravity
cline
qwen-code
deepseek-harness
command-code
windsurf
ai-agents
multi-agent
orchestration
spec-driven-development
context-engineering
developer-tools
```

**Social preview**

Upload `assets/social-preview.png` (1280 × 640) under **Settings → General → Social preview**. GitHub does not accept SVG.

**Website**

Leave empty, or point at the README anchor for install:

```text
https://github.com/FiredMosquito831/working-notes#quick-start
```

## Create the repository

From the repository root:

```bash
git remote add origin https://github.com/FiredMosquito831/working-notes.git
git push -u origin main
```

Or with the GitHub CLI, which can create it, set the description, topics and push in one flow:

```bash
gh repo create working-notes --public --source=. --remote=origin --push \
  --description "An Agent Skill that gives AI coding agents an operating memory: specs, binding decisions, a PR queue, handoffs and self-verification. Works with Claude Code, Codex, Cursor, Copilot, Gemini CLI, OpenCode, Antigravity and more."

gh repo edit --add-topic agent-skills,claude-code,claude-code-skill,codex,cursor,github-copilot,gemini-cli,opencode,antigravity,cline,qwen-code,deepseek-harness,command-code,windsurf,ai-agents,multi-agent,orchestration,spec-driven-development,context-engineering,developer-tools
```

Then upload the social preview in the web UI.

## Release checklist

1. Update `CHANGELOG.md` (new section, date, links).
2. Bump `version` in `package.json`, `.claude-plugin/plugin.json` and the marketplace entry.
3. Run the gate:

   ```bash
   npm test
   npm run validate
   claude plugin validate .
   ```

4. Commit, tag, push:

   ```bash
   git add -A
   git commit -m "Release v1.0.0"
   git tag v1.0.0
   git push origin main --tags
   ```

5. Create the release:

   ```bash
   gh release create v1.0.0 --title "v1.0.0" --generate-notes
   ```

6. Verify the tag equals the default-branch head:

   ```bash
   git rev-parse v1.0.0
   git rev-parse origin/main
   ```

## npm

| | |
|---|---|
| Package | `agent-working-notes` |
| Binary | `working-notes` |
| Registry page | https://www.npmjs.com/package/agent-working-notes |
| Publish workflow | `.github/workflows/publish.yml` |

The npm tarball contains the skill, templates, installer, plugin manifests, README and licence. It does not contain the tests, docs or assets.

### First publish (manual, once)

```bash
npm login
npm publish --access public
```

`prepublishOnly` runs `npm test` and `npm run validate` before anything leaves the machine. Verify:

```bash
npm view agent-working-notes version
npx -y agent-working-notes --version
```

### Automatic publishing after the first publish

`.github/workflows/publish.yml` runs on three events:

1. **A GitHub release is published.** The workflow checks that the tag (`vX.Y.Z`) equals `package.json`, runs the tests and validation, and publishes if that version is not already on npm.
2. **A push to `main` changes `package.json`.** This is the version-bump path: if the new version is not on npm, it publishes. If it is, it reports and stops.
3. **Manual dispatch.** Same checks, useful after fixing a failed run.

A concurrency group prevents two publishes racing. Provenance is attached to every publish, so the npm page links the package to the exact GitHub commit and workflow run.

### Configure npm credentials (choose one)

**Trusted publishing (recommended, no long-lived secret)**

1. Open the package on npmjs.com → **Settings** → **Trusted Publishing**.
2. Add a GitHub Actions publisher:
   - Organization or user: `FiredMosquito831`
   - Repository: `working-notes`
   - Workflow filename: `publish.yml`
3. Nothing else. The workflow already requests `id-token: write`, and npm uses the OIDC token when no `NPM_TOKEN` is present. No repository variable and no secret are required.

**Token**

```bash
gh secret set NPM_TOKEN
```

Use a granular access token with publish rights for this package. When the secret exists, the workflow passes it to npm and skips OIDC.

Trusted publishing only works for a package that already exists, so the first publish must be manual. If neither method is configured, a new version fails at the publish step with npm's authentication error; nothing is published silently.

### Release flow

1. Bump `version` in `package.json`, `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`.
2. Add the `CHANGELOG.md` entry.
3. Commit and push to `main`. The workflow publishes the new version.
4. Optionally tag and create a GitHub release:

   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   gh release create v1.2.0 --title "v1.2.0" --generate-notes
   ```

   The release run sees the version already on npm and stops. This is expected.

5. Verify:

   ```bash
   npm view agent-working-notes@1.2.0 version
   npm view agent-working-notes@1.2.0 dist.integrity
   ```

If the version in the three manifests disagree, validation fails and nothing publishes. That is deliberate: the npm package and the Claude plugin must carry the same version.

### What the npm README shows

npm renders `README.md` on the package page. Relative links to `docs/` point at the GitHub repository in context, but npm cannot serve those files; the GitHub README remains the canonical documentation. Keep the install commands and the GitHub repository link at the top.

## Claude Code plugin directory

The plugin and marketplace manifests are already valid:

```bash
claude plugin validate .
```

Users can install from the repository directly:

```text
/plugin marketplace add FiredMosquito831/working-notes
/plugin install working-notes@firedmosquito
```

Submitting to Anthropic's plugin directory is optional. The manifest carries the fields the directory reads (`icon`, `documentationUrl`, `supportUrl`, `privacyPolicyUrl`, `termsOfServiceUrl` are supported but not set). Add them only if you submit.

## README search targets

The README is written around the phrases people actually search for when they hit the problem:

| Search intent | Where it appears |
|---|---|
| "Claude Code skill", "agent skill", "SKILL.md" | Title, hero paragraph, install table |
| "AGENTS.md rules", "CLAUDE.md rules" | Why, what it creates, FAQ |
| "spec-driven development", "spec before code" | How it works, loop |
| "multi-agent orchestration", "subagents" | Rules, delegation section |
| "Codex skills", "OpenCode skills", "Antigravity skills", "DeepSeek Harness skills" | Install matrix and FAQ |
| "context engineering", "session handoff" | Why, What it creates |
| "AI coding agent workflow", "PR queue" | Rules, artifacts |

Alt text on both diagrams names the harnesses and the method. GitHub indexes image alt text in repository search.

Do not stuff keywords into the README body. The repository description, the 20 topics and the headings carry the search terms; the body stays readable.
