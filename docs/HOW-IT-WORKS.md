# How it works

`working-notes` is not a prompt pack. It installs a small set of files that make an agent's work reviewable, resumable and repeatable, then binds the agent to them through `CLAUDE.md` and `AGENTS.md`.

The skill itself is used once per project, and occasionally for handoffs, queue reads and lesson writes. After `init`, the repository is the source of truth.

## The premise

An agent is only as reliable as the artifacts around it. Given a blank context, it will:

- invent a plan instead of reading the code,
- edit before reproducing the bug,
- report "done" without running the gate,
- forget the decision it made an hour ago,
- and start from scratch tomorrow.

The fix is not a longer prompt. It is a small, durable record with **entry points, binding decisions and proof obligations** that both you and the agent read before acting.

## The loop

<p align="center">
<img src="../assets/loop.svg" alt="Discuss, investigate, spec, decide, build with one implementer, verify, then record queue handoff and lessons" width="100%">
</p>

### 1. Discuss before building

Anything beyond a literal small ask starts with a conversation, not a dispatch. The agent reads the repo and returns questions about what only you can decide: scope, risk, which option, what "fixed" looks like.

No spec, no build. This one rule removes most wasted work.

### 2. Investigate read-only

An investigator gets a brief, a scratch worktree and an explicit read-only boundary. It measures instead of guessing: the code path with `file:line`, the real rows, the third party's documented behaviour, the options with the bytes each one changes.

The deliverable is a markdown spec in `specs/`, with CONFIRMED and UNVERIFIED findings separated.

### 3. Spec with numbered questions

The spec ends with plain-language questions, each with a recommendation:

```text
7. QUESTIONS for the user
1. Should the retry ladder keep the old timeout for the first attempt? Rec: yes,
   because existing installs depend on it and the change is not needed for the fix.
2. Is the nightly job allowed to run while we migrate? Rec: no, run it after.
```

You answer in one line: `all rec`, or `1 yes, 2 no`.

### 4. Record the decision

Your answers become a `USER DECISIONS (<time>)` block appended to the spec. From that moment it is binding. The implementer reads it; later sessions read it; nobody re-asks.

This is the single most valuable artifact in the system. A decision without a date and a reason is a rumour.

### 5. One implementer

One production PR at a time. Read-only investigations may run beside it. The implementer receives a brief containing:

- the role: **sole implementer** of one item
- the spec path and its binding decision block
- prior work it must not regress (`file:line`, versions)
- numbered scope, and an explicit **not in scope** list
- the version, the verification bar and the equality proof
- the hard safety rules for your machine and your data
- the ship sequence, progress files and a final-message contract

Agents keep `PROGRESS.md` and `HANDOFF.md` in their worktree from the first edit, so a crash costs minutes, not the arc.

### 6. Verify everything yourself

The orchestrator (you, or the agent acting as orchestrator) does not relay "shipped". It checks:

- merge SHA equals the tag equals the default branch head
- the release artefact exists and its digest matches the local build
- the frozen-file diff is empty unless that file was the PR's stated purpose
- the security grep returns zero
- every CI and release workflow state is read by name
- at least one screenshot is actually looked at
- the live system answers a call that does real work, not just a health endpoint

Then it reports in three buckets: **CONFIRMED**, **UNVERIFIED**, **NOT DONE**.

### 7. Record the boundary

Every PR start and end updates `QUEUE.md` in full: RUNNING, QUEUED in binding order, FINISHED with proofs, HELD with its own go. Every release adds a history row and, when something was learned, a dated lesson line.

A handoff is written before any pause or compaction:

```text
HANDOFF-2026-10-27.md
0. Read this order
1. State at the handoff
2. Remaining queue, in order
3. What the user still owes
4. Lessons ported this arc
5. Verify commands
6. Environment
```

The next session reads the newest handoff first, verifies the live state, and reports where things stand before dispatching anything.

## The artifacts

| File | Owned by | Holds | Never holds |
|---|---|---|---|
| `WORKING-NOTES.md` | Orchestrator | Current truth: rules, repo mechanics, gate, principles, domain facts, environment, release history, lessons | Superseded text, long tables |
| `WORKING-NOTES-ARCHIVE.md` | Orchestrator | Dated diary, superseded blocks, long version cells | Current instructions |
| `QUEUE.md` | Orchestrator | Binding order and proof record | Wishes |
| `HANDOFF-<date>.md` | Orchestrator | Resume point | The whole history |
| `specs/*.md` | Investigator | Findings, options, questions, decisions | Implementation |
| `CLAUDE.md` / `AGENTS.md` | Init, refreshed by you | Entry points and the ten never-relaxed rules | The full manual |

The manual stays current-truth-only. History moves to the archive with dated entries. Specs cite section numbers, so sections are never renumbered.

## First-use questions

`init` derives what the repo already knows, then asks only what it cannot:

1. Repo, remote, default branch, and any upstream that must never receive pushes.
2. Release mechanics: version bump, artefact, publication, how the installer reads it.
3. The frozen boundary: files that change only as a PR's stated purpose, plus goldens.
4. The gate: exact lint, type and test commands, known flakes, worktree and scratch layout.
5. Secret files, read-only data, the live system, and machine facts.

Every question comes with a recommendation. `all rec` accepts the set.

## What "verified" means

The system treats these as different claims:

| Claim | Meaning | How it is reported |
|---|---|---|
| **CONFIRMED** | You ran it and the output is shown | With the command and result |
| **UNVERIFIED** | Read in code or docs, not executed | Named as unverified |
| **NOT DONE** | Skipped deliberately | With the reason |

An agent that says "I did not verify that" is more useful than one that says "should work".

## The lesson protocol

A lesson qualifies when it has evidence: a wrong premise that cost time, an agent slip, a tooling trap, a false positive, a measurement that overturned an assumption.

Each lesson is one bullet: the lesson first, the evidence that makes it memorable, the origin (version, PR, date). It goes into `WORKING-NOTES` PART IX under its theme. The rule that follows from it goes into the normative part in the same edit, with a citation. Duplicates gain the new origin instead of a second bullet.

Lessons are written when learned, not reconstructed at the end of an arc.

## When not to use it

- A one-file script with no release process. The ceremony outweighs the work.
- A repository you do not own and cannot modify.
- A team that does not want numbered decisions or a binding queue. The skill will feel like bureaucracy and be ignored.

Everything else, especially long arcs and multi-PR features, benefits from the trail.

## Limits

- The skill cannot enforce a harness's behaviour. It makes the rules explicit and puts them where the agent reads first; compliance still depends on the harness following its instructions.
- Verification steps that name a live service, secret files or an installer are slots. Fill them for your project or the recipe is generic.
- The templates are opinionated. Fork the text, keep the structure.

Read the canonical text in [`SKILL.md`](../SKILL.md).
