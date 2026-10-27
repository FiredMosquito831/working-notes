# Publishing and repository metadata

This file holds the exact metadata for the GitHub repository, the release checklist, and the optional npm and plugin routes. It is written so the repo can be published without re-deriving the copy.

## Repository metadata

**Name**

```text
working-notes
```

**Description** (232 characters)

```text
An Agent Skill that gives AI coding agents an operating memory: specs, binding decisions, a PR queue, handoffs and self-verification. Works with Claude Code, Codex, OpenCode, Antigravity, Command Code and DeepSeek Harness.
```

**Topics** (20, GitHub's limit)

```text
agent-skills
claude-code
claude-code-skill
codex
opencode
antigravity
command-code
deepseek-harness
ai-agents
ai-coding-agent
multi-agent
orchestration
spec-driven-development
context-engineering
developer-tools
workflow-automation
prompt-engineering
llm
programming
productivity
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
  --description "An Agent Skill that gives AI coding agents an operating memory: specs, binding decisions, a PR queue, handoffs and self-verification. Works with Claude Code, Codex, OpenCode, Antigravity, Command Code and DeepSeek Harness."

gh repo edit --add-topic agent-skills,claude-code,claude-code-skill,codex,opencode,antigravity,command-code,deepseek-harness,ai-agents,ai-coding-agent,multi-agent,orchestration,spec-driven-development,context-engineering,developer-tools,workflow-automation,prompt-engineering,llm,programming,productivity
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

The installer runs from GitHub without npm:

```bash
npx -y github:FiredMosquito831/working-notes install
```

Publishing to npm is optional and only needed for a shorter command. Check the name first:

```bash
npm view working-notes-skill version
npm publish
```

After publishing, `npx working-notes-skill install` becomes available. Update the README in the same release; keep the GitHub route documented, because it always serves the current `main`.

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
