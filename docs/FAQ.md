# FAQ

## General

### What is an Agent Skill?

A directory containing `SKILL.md` plus optional supporting files. The frontmatter carries a name and a description; the body carries instructions. Agents load the description at startup and read the body when the task matches.

`working-notes` is a skill with eight templates. It writes project files; it does not run a service.

### Is this a framework or a library?

Neither. There is no runtime, no dependency and no API. The only executable code is the installer.

### Does it require a specific model?

No. The method is model-agnostic. It assumes a capable agent with file read/write and command execution. Claude, GPT, Gemini, DeepSeek, Qwen, Kimi and local models can all follow it; smaller models benefit more from the explicit briefs and narrower scope.

### Does it send any data anywhere?

No. The installer copies local files. The skill reads and writes files in your repository. No telemetry, no network calls, no accounts.

### What license?

MIT. See [LICENSE](../LICENSE).

## Installation

### Which harnesses are supported?

Claude Code, OpenAI Codex, Cursor, GitHub Copilot, Gemini CLI, OpenCode, Google Antigravity (IDE, app and CLI), Cline, Qwen Code, Kilo Code, Windsurf / Devin Desktop, DeepSeek Harness and Command Code have documented paths in the installer. Anything else that reads `SKILL.md` works with `--dir`. See [the harness matrix](HARNESSES.md).

### Do I install it per project or once per machine?

Both are supported. `--scope user` (default) installs once for every project. `--scope project` puts `working-notes` in the repository so a team shares it and reviews it like code.

### Will it overwrite my existing setup?

No. The installer refuses to replace a directory it did not create unless you pass `--force`. `init` never overwrites project files; it appends a dated block with only the missing sections and tells you what it left alone.

### Does it modify CLAUDE.md or AGENTS.md?

It appends one block between `<!-- working-notes:begin -->` and `<!-- working-notes:end -->`. Re-running `init` replaces only that block. Existing content stays.

### Does it work in CI or in a non-interactive shell?

Yes. Pass agents and scope explicitly and add `--quiet`. The installer never prompts.

## Usage

### What do I do after installing?

Open a repository session and run:

```text
/working-notes init
```

Or ask: "set up working notes for this repo". The skill asks five numbered questions with recommendations. Answer `all rec`, or answer individually.

### How long does initialization take?

One session. The agent reads the repo, asks the five questions, writes the files and reports. The answers are the slow part.

### Can I use it in the middle of a project?

Yes, that is a core use case. `init` seeds the release history from existing tags and the domain facts from existing docs, marks what it seeded, and leaves the finished queue empty. Nothing is claimed as verified that you did not verify.

### Do I have to use all five subcommands?

No. `init` is the only required step. `handoff`, `queue`, `brief` and `lesson` are shortcuts for work the manual already requires; the rules bind whether or not you invoke them.

### Does it work with subagents?

The method assumes them. One implementer at a time, read-only investigators beside it, at most two agents by default. If your harness has no subagents, the orchestrator can do the work itself; the artifacts are unchanged.

### How do I update?

Re-run the installer for skill copies, and re-run `/working-notes init` to refresh the managed block. Project artifacts are not touched. `working-notes doctor` reports stale copies.

### How do I uninstall?

`npx -y agent-working-notes uninstall --agent all` removes managed skill copies. Project artifacts remain; delete them yourself if you want them gone. Remove the managed block by deleting the text between its markers.

## Method

### Why "discuss before building"?

Because the most expensive failure is building the wrong thing correctly. A five-question spec costs minutes; a wrong PR costs an afternoon and a release.

### Why only one implementer?

Version files, release processes and migration state collide. Two writers produce a merge that neither tested. Read-only work parallelizes safely; production changes ship sequentially.

### Why must the orchestrator verify?

An agent's "done" is a summary, not a proof. The system requires the merge SHA, tag, artefact digest, frozen diff, CI states and a real call to the live system to be checked by the person or agent relaying the result. The check is cheap compared with a broken release.

### Why write lessons while working?

A diary written at the end of an arc loses the middles. Writing at the moment of learning preserves the evidence: the error text, the number, the row.

### What counts as a lesson?

A wrong premise that cost time, an agent slip, a tooling trap, a false positive, a false negative, or a measurement that overturned an assumption. Not plans, wishes or general truths.

### Is the tone too strict?

It is strict by design. The rules exist because their absence caused real, repeated failures. Fork the text if your context needs less ceremony; keep the separation of CONFIRMED, UNVERIFIED and NOT DONE, and keep the decision record. Those two carry most of the value.

## Limitations

- **Compliance is not enforceable.** The skill puts the rules where the agent reads first, but a harness may ignore instructions. Verify the output.
- **Slots need filling.** The templates contain project slots: live system, secret files, frozen boundary, gate commands. `init` fills them from your answers. An unfilled slot is visible on purpose.
- **The method assumes file access.** A harness that cannot read repository files cannot use most of it.
- **No dashboard.** The queue is markdown on purpose. If you want a UI, build one on the same files.
- **English only.** The templates are English. The method translates; the wording does not.

## Contributing

Bug reports, harness paths and template improvements are welcome. See [CONTRIBUTING.md](../CONTRIBUTING.md). If a vendor changes a skills directory, open an issue with the documentation link and the version you tested.
