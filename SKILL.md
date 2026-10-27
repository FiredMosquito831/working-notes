---
name: working-notes
description: Initialize or maintain a project's orchestration setup, at the start or in the middle of a project — creates WORKING-NOTES.md (the operating manual), QUEUE.md (the PR queue), HANDOFF-<date>.md (resume points) and specs/ from templates, and adds a managed "How we work" block to the repo's CLAUDE.md (and AGENTS.md) — carrying the universal rules of how we work (discuss first, investigate → spec → decisions → one implementer, verify everything yourself, equality proofs, tracking at every PR boundary, lesson porting). Use when the user says /working-notes, "initialize the project rules", "set up working notes", "bootstrap the orchestration files", "add our rules to CLAUDE.md", "create the queue", "write a handoff", "port this lesson", or asks "how do we work". Portable Agent Skill: the same SKILL.md runs in Claude Code, Codex, OpenCode, Antigravity, Command Code, DeepSeek Harness and any harness that reads Agent Skills.
---

# working-notes

**One-time initializer per project.** This skill installs the **operating manual** of a project run by an orchestrator (you) that delegates investigations and builds to subagents, keeps a binding PR queue, verifies every claim itself, and records every decision and lesson. Once `init` has run, the project runs itself from the artifacts: the managed block in `CLAUDE.md` tells every future session what to read and which rules bind, WORKING-NOTES holds the full method and the project's facts, QUEUE.md holds the work, the handoff files hold the resume points — no further use of this skill is needed. The subcommands other than `init` are optional shortcuts for maintenance tasks the manual already requires (they exist so the user can trigger them in one word; the rules apply whether or not the skill is called). Re-running `init` on an initialized project is safe: it only fills what is missing and refreshes the managed CLAUDE.md block. The rules below are universal; everything project-specific lives in named slots that the templates mark `<<...>>`.

## Subcommands (pick from the arguments; default = `init`)

| Argument | What you do |
|---|---|
| `init` (default) | The initializer, usable at the start OR in the middle of a project: create the artifacts from the templates where missing, and add the managed block to the repo's `CLAUDE.md` (and `AGENTS.md` if it exists — keep both identical). Never overwrite an existing file; merge instead. Fill the project slots by asking the "First-use questions" — one message, numbered, each with a recommendation — but derive first what the repo already tells you. Procedure below. |
| `handoff` | Write `HANDOFF-<yyyy-mm-dd>.md` from the current state (section layout in `templates/HANDOFF.template.md`), update the queue's RUNNING/PAUSED note, and tell the user the one-paragraph resume message to paste. |
| `lesson "<text>"` | Append a dated lesson line to WORKING-NOTES PART IX (CRLF-safe), citing its origin (version, PR, date). |
| `queue` | Print the queue (running, queued in order, held, finished this arc) and every open question the user owes. |
| `brief <item>` | Produce an implementer or investigator brief for a queue item from `templates/BRIEF-IMPLEMENTER.template.md` / `templates/BRIEF-INVESTIGATOR.template.md`, with the project's hard rules pasted in. |

Templates live beside this file in `templates/` (resolve the path from this skill's own directory). Read the template you need before writing; copy its structure, fill every `<<slot>>`, delete nothing.

## `init` procedure (idempotent; safe mid-project)

1. **Locate.** The repo root (`git rev-parse --show-toplevel`; if not a repo, the working directory). The notes directory is `<<NOTES DIR>>`: default = the repo root's parent if the user keeps notes outside the repo (ask), else `./.orchestration/` inside the repo (then add it to `.gitignore` unless the user wants it committed). Detect existing `WORKING-NOTES.md`, `QUEUE.md`, `HANDOFF-*.md`, `specs/`, `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`, CI workflow files, lint/test config, a frozen-files list, an existing changelog.
2. **Derive before asking.** From the repo: remote names and default branch (`git remote -v`, `git symbolic-ref refs/remotes/origin/HEAD`), version file(s) and bump mechanism (package manifests, tags), the test/lint commands (CI workflows, `Makefile`, `package.json` scripts, `pyproject`), release artefacts (release workflows), the attribution convention (recent commit trailers). Present what you derived as the defaults in the questions.
3. **Ask the five first-use questions** in one message (below). "All rec" and "you decide" are accepted; "you decide" = the conservative default, said aloud.
4. **Create, never overwrite:** `WORKING-NOTES.md` (from the template, slots filled, PART VIII/IX empty but present, PART X with "Priority now = <<the user's current goal>>"), `WORKING-NOTES-ARCHIVE.md` (an index header only), `QUEUE.md` (header rules filled; RUNNING = "nothing running"; QUEUED = whatever the user names now, each as SPEC FIRST unless already decided), `HANDOFF-<today>.md` (the dated running log, first line = "initialised by /working-notes"), `specs/` (empty, with a one-line README pointing at `templates/SPEC.template.md`'s structure). If a file exists, append a dated "working-notes init" block with only the missing sections and tell the user what you did not touch.
5. **CLAUDE.md:** insert `templates/CLAUDE-MD-BLOCK.template.md` with its slots filled, delimited by the `<!-- working-notes:begin -->` / `<!-- working-notes:end -->` markers. If the markers exist, replace only what is between them (so re-running updates the block). If `AGENTS.md` exists, keep it byte-identical to `CLAUDE.md` after the edit (some repos pin that with a test). Never remove the user's existing CLAUDE.md content; place the block at the end.
6. **Memory pointer:** if the session has a persistent memory directory, write (or update) a `project` memory named `<project>-orchestration-state` that points at the notes dir and the newest handoff, and add its index line.
7. **Report:** list every file created or changed (path, what), the slots still marked `<<…>>` (none should remain; if any, say why), and the one-paragraph "how to resume" message the user can paste next session.

Mid-project rule: when the repo already has history, PART VIII is seeded from the existing tags/changelog (one row per release, headline only, marked "seeded from <source>"), PART V from the repo's own docs (facts only, each with its source file), and QUEUE FINISHED stays empty (nothing is claimed as verified that the orchestrator did not verify).

## The rules (universal, binding once installed)

### 1. How the user wants to work
- **Discuss before building.** Anything beyond a literal small ask: read-only investigation → a spec in `specs/` with NUMBERED, plain-language questions, each with a recommendation → the user answers in one line ("all rec", "1 yes / 2 whatever is most correct") → append a binding `USER DECISIONS (<time>)` block to the spec → ONE implementer. Never dispatch before the user agrees.
- **Safest, 100 % working, break nothing.** Change only what is broken, where it is broken. Behaviour-preserving work is proven by equality contracts (byte-identical outputs where nothing should change). What cannot meet the bar is left out and named.
- **Extend, never narrow.** A change that meets an existing mechanism (a ladder, a registry, a conversion, a state machine) adds to it in its own order and keeps every existing output identical; investigate the full list of affected modules first; if the scope seems to require removing or bypassing behaviour, stop and report.
- **Granular PRs.** One concern per PR and release; scope additions go to the next PR unless one line; the user may approve grouping by risk class.
- **"Fixed" means the user can see it working.** State the exit criterion in their terms; test to it; lead with the negative when it is negative.
- **Their bug reports are precise and usually right: reproduce first, argue never.** Date error rows before diagnosing them; convert timezones before saying "recent".
- **Rejected by default:** invented limits and "sensible defaults" for capacities; claiming it works without running it; per-name branches ("it should work for all X, smartly"); speculative features and convenience tooling nobody asked for; changes to the user's own settings; long pages as a fix; telling the user to change their values.
- **Separate CONFIRMED (you ran it, output shown) from UNVERIFIED (read in code/docs) from NOT DONE (skipped, and why).** "I did not verify that" is valued.
- **"See what needs fixing and just do it"** for small follow-ups an implementer or the orchestrator finds (a CI hang, a gap left by the previous PR) — but anything touching retry/fallback/safety behaviour, the user's own settings, or a visible behaviour gets a question first.
- **No extra process artefacts** beyond the named files (manual, queue, log, handoff, specs); no diagnostics of the user's machine unless asked.
- **Pauses cost nothing.** The user watches usage limits and pauses; every agent keeps a resume file; runs left unattended never block on a permission prompt.
- **When the user is frustrated: evidence first** (attempt tables, rows, hashes), not reassurance.

### 2. Delegation protocol
- **Delegate investigations and builds; take conclusions.** Protect the orchestrator's context: a self-run investigation beyond a re-anchor is a process error.
- **Every agent inherits the current session's model by default** (do not specify a model tier in briefs; the user says if they want a different one). Read-only investigators may run beside ONE implementer; at most TWO agents at once (the user may lower it). One production PR at a time (version bumps collide) — build in parallel only when the user explicitly allows it, and then ship sequentially.
- **A cut-off launch brief** (the harness can truncate it): check `ListAgents`, then re-send the complete brief to the agent by message.
- **Investigators disagree; the implementer measures both sides.** Budget one tester per arc that runs the REAL clients against the REAL system: it finds what unit tests cannot.
- **Specs written from reading are wrong about third-party tools.** Install the tool into a scratch location and read its real binary/bundle/schema before trusting a spec about it.
- **Never tell an agent a target is "source of truth, do not edit" when it may be broken** — say "if the target looks wrong, say so".
- **After a crash, resume children before the parent;** fan-out children write intermediate findings to the scratchpad as they go.
- **Announce every dispatch** in the same message; `ListAgents` before every dispatch (stray agents happen).
- **Briefs are specs:** role line ("SOLE implementer of X") → spec path + "the USER DECISIONS block is BINDING" with times → prior work not to regress (versions + `file:line`) → numbered scope with an explicit NOT-in-scope list → version + bump rule → verification bar ("success = X observed") + equality proof + mutation checks → the hard rules → ship sequence → progress/HANDOFF paths → "the final message IS the deliverable; partial is acceptable, silence is not".
- **Agents keep `PROGRESS.md` + `HANDOFF.md` in their worktree from the FIRST edit** and commit WIP early; a crashed session resumes them by message ("RESUME from HANDOFF.md; git status/diff only, never checkout/stash/reset").
- **Budget half of an agent's findings to be wrong or overstated**; check every `file:line`; "could not verify" is not "does not exist"; a brief never tells an agent to delete something on another agent's "could not find".
- **Bounded waits only.** No infinite polling, no foreground sleep over 10 minutes; a bounded loop with a timeout, or a background task that notifies.
- **Agents never edit the operating manual**; they report lessons in their final message and the orchestrator ports them.

### 3. Verification you do yourself (after every "shipped" report, before relaying)
The recipe is `templates/VERIFY-RECIPE.md`, instantiated for the project in WORKING-NOTES II.5. At minimum: the merge SHA = the tag = the default branch; the release artefact present with its digest equal to the local build; the frozen-boundary diff empty unless the file is the PR's stated purpose; the security grep (project slot) at 0; open PRs as expected; release/CI workflows' states read one by one (never trust a `--watch` return; a cancelled CI job with no FAILED lines is the runner hang — rerun); LOOK at at least one screenshot the agent names; the live system (if any) still serving — a health endpoint is not proof, call something that does real work. Then record: a dated "SHIPPED AND VERIFIED BY ME" line, a release-history row, the queue row flipped, the lessons ported, and tell the user: what shipped, what you verified, deviations, not done, the next dispatch.

Verification habits that are universal:
- **Re-anchor before analysing** (fetch; count commits behind; stale = wrong audit).
- **Measure before designing.** Perf specs name the wrong cause more often than not; a timing without the payload is not a measurement.
- **Date error rows before diagnosing them; convert timezones before saying "recent".**
- **Do not blame the newest release by instinct:** get the daily series from the log; `git diff --name-only vX vY` rules a release out in one command.
- **A test that cannot fail is not a test:** prove every guard by removing it and watching the test fail (mutation checks in every brief).
- **Grep every golden and baseline for the bytes a fix changes BEFORE planning it.**
- **"Unchanged" claims about machine state are worthless without the before/after diff shown;** take the snapshots yourself.
- **One live request beats thousands of logged ones** for "is it enforced NOW"; a rate-limit answer in a live proof is inconclusive — say so.
- **Verify WHICH binary/version the user actually runs** before diagnosing anything about it.
- **Check the history of a rule a fix removes** before the user decides; it may exist for a vendor bug.

### 4. Tracking at every PR boundary
- `QUEUE.md` is updated at every PR start and end, in full detail: RUNNING / QUEUED (binding order) / FINISHED (with the proofs) / HELD (needs its own explicit go) and the user's open questions.
- `WORKING-NOTES.md` gets a release-history row per version and a dated lesson line per learning; a `.bak-<stamp>` copy before every edit; line endings preserved (scripted edits read with `newline=""`, assert the anchor count, write the same newline).
- The dated running log (`HANDOFF-<first date>.md`) gets one line per dispatch, ship, decision, incident and pause.
- A handoff file is written whenever the user pauses or the context is near its limit; the user compacts only after it exists.
- A dated "SHIPPED AND VERIFIED BY ME" line per release goes to `WORKING-NOTES-ARCHIVE.md` (the diary), so the manual itself stays current-truth-only.
- The verify recipe and the record/tail scripts are reusable per release (change the tag); keep them in the session scratchpad and name them in the handoff so the next session reuses them.

### 5. Safety rules every brief carries (project slots fill the paths)
- Never touch the user's world: the live service, real app configs, the real home, registry/autostart entries, the user PATH, installed tools; never run the real installer/uninstaller; never restart the user's service. Proofs run on scratch copies with redirected homes, their own ports, fake credentials of the same prefix shape, and a network guard (a dead proxy is not enough — block DNS too).
- Secrets: never read the secret files (project slot); never print process command lines; mask everything in outputs; screenshots scanned for key prefixes and LOOKED at.
- Processes: stop only PIDs you started, by exact PID, children by parent id; never by image name or substring.
- Tooling: never bare interpreters that cannot import the project; never `-c` one-liners or heredocs into an interpreter (they hang or mangle); scripts as files, run by path; never `sed -i` on tracked files; never delete anything on the user's data drive — list leftovers in the report.
- Frozen boundary (project slot): the files that implement retry/fallback/rotation/safety/installers change only as a PR's stated, user-approved purpose, with route outcomes proven byte-identical.
- Live external calls only with the user's consent and a stated budget, counted in calls the retry ladder may multiply; a rate-limit answer is inconclusive.
- Scratch instances: seed the scratch config with the scratch port BEFORE the first start and pin it in every child process; scratch clients refuse the live address (a scratch instance that lost its environment once talked to the live one).
- Check the OS's reserved/excluded port ranges before naming scratch ports (they move between boots); `netstat` the port too.
- Live data files are opened read-only with the engine's read-only mode; copies with its immutable mode; never copy the live log.
- Redirection is never total: some tools resolve real paths through the OS (per-user installers, apps with their own credential stores); snapshot-and-diff the machine state is the proof; never run such apps inside a proof.
- A health endpoint green is not proof the service can serve — call something that does real work before claiming "answering".
- A rollback or updater never moves or removes an environment a process is running out of; it stops the process it started by exact PID first, gates on liveness and progress rather than a fixed budget, and on any half-failure leaves the live environment alone and reports.

Tooling traps to state in every project (the project adds its own):
- Shell heredocs eat backslashes and die on apostrophes; `| tail` swallows exit codes; a wrapper's exit 0 is not the tool's — read the tool's own summary line.
- Line endings: scripted edits detect the file's newline and write the same; `sed -i`/`awk` strip CR; make LF worktrees with a per-command config flag, never by editing the shared repo config.
- Repo-wide type/lint checks only (file-scoped checkers lie at CI parity); a lint autofix is not a safe unattended edit.
- Never two full test gates at once on one machine; check the process table first.
- Killing by image name or substring kills the wrong thing; exact PID only.

### 6. Product principles that are universal
No invented limits; clamp to capability, never under-use it; unknown ≠ unsupported (NULL vs 0, "not measured" vs "not supported"); everything new is opt-in and byte-stable when unset; honest wording ("installed and verified" enumerates what was checked); data is never lost by a feature; documentation is a deliverable and belongs where the user is; general over per-name; good behaviour by default (never a "run this once" step for the user); "readers, not sources" (vendor presets prefill documented values for the user to confirm, never a shipped vendor catalogue); every new setting follows one checklist (default → field → surface with real help text → bounds → example config → docs → the contracts that pin all of it) and is hot unless it physically needs a restart.

### 7. CI and testing rules that are universal
- Risk tiers decided from the paths in the diff (T0 docs/tests only … T4 installers/updaters/frozen files/OS branches); when unsure, tier up. Proportionate testing: tests follow the SYSTEMS the diff changes; no new tests for a one-line flip.
- Local is not the gate; CI is. Keep a known-flakes list with hits per release suite; classify every new failure BEFORE the next dispatch: product defect → report only; test defect → test-only PR; timing under load → hermetic fix.
- Hermetic suite: a per-test redirected home; never a session-wide config dir; every new process-wide singleton gets an autouse reset; every new network-reaching module gets an autouse isolation fixture in the same commit; unique test basenames.
- Contract tests to keep from day one: equality/identity baselines (regenerated on the BASE tree and committed — a baseline that lands after an investigation can pin the bug it found), leak contracts (no secret in any response, log or row), the docs-drift guard, import boundaries, "shipped defaults agree", the security-never-weakened test. A test that asserts the buggy behaviour is itself a finding.

### 8. The learning protocol (how PART IX of the manual grows)
- **What qualifies as a lesson:** a wrong premise that cost time; an agent slip that a rule now forbids; a trap of the machine/tooling/vendor that bit once; a false positive (something that looked broken and was not) or a false negative (green that hid a defect); a measurement that overturned an assumption. Not: a plan, a wish, a general truth without evidence.
- **How it is written:** one bullet, the lesson first, then the evidence that makes it memorable (the number, the row, the error text), then its origin (version, PR, date). Deduplicate: if the lesson exists, add the new origin to it instead of a second bullet.
- **Where it goes:** the bullet goes to PART IX under its theme (verification, agents, tooling, the subsystem). The RULE that follows from it goes to the normative part (I–VII) in the same edit, with the citation; PART IX keeps the "why", the normative part keeps the "what". A lesson that changes a brief rule is pasted into the brief templates the same day.
- **When:** at the moment it is learned (the agent's final message, the orchestrator's verification, the user's correction), never from memory at the end of an arc — a diary written late loses the middles.
- **The evidence ladder** every lesson is measured against: real data through the whole path, read back from storage > the real artefact run unattended > a unit test on the changed function > reading the code. Observability first (store the wire body and the per-attempt facts), then debugging; a correct algorithm starved of data looks broken; a number that appears in no setting is a division; the last error in a ladder is not the reason.
- **Review:** on every handoff, the lessons of the arc are summarised in one paragraph with the recurrent agent slips to keep in every brief; the memory pointer names the file.

## First-use questions (ask once, numbered, with a recommendation each; "all rec" accepted)

1. Repo + remote names, default branch, and whether any upstream must never receive pushes/PRs.
2. Release mechanics: how a version is bumped, what a release artefact is, where it is published, how the installer/updater reads it (or "no releases").
3. The frozen boundary: the files that must not change except as a PR's stated purpose (retry/fallback/rotation/safety/installer/CI), and the goldens that must pass unmodified.
4. The gate: the exact lint/type/test commands, known flakes, and the worktree/scratch layout (where worktrees go, scratch homes, port ranges, what is the user's live system).
5. Secret files and read-only data (never read), the live service address (never touched), and the machine facts (OS, timezone, disks).

Write the answers into the `<<slots>>` of WORKING-NOTES PART II/III/VII, the CLAUDE.md block and the brief templates. If the user says "you decide", choose the conservative default and say so. A sixth, optional question when the repo has no release process: whether "shipped" means merged to the default branch (then the verify recipe drops the artefact lines and keeps merge = default branch + CI green + the live check).

## Output discipline
Lead with the answer; state facts, not reasoning; tables for parallel items; no em-dashes; one idea per sentence; keep numbers out of prose unless they change what the reader does; report CONFIRMED / UNVERIFIED / NOT DONE every time.
