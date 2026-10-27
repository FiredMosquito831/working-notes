# Working Notes — the operating manual for <<PROJECT NAME>>

The orchestrator's manual: how the user works, what they verify and reject, repo and release mechanics, CI and code rules, product principles, domain facts, how agents are run, the machine, every release, every learning, and what is still open. **Current truth only.**

- **Where it lives:** `<<ABSOLUTE PATH>>` (outside any repo; no git history, single copy).
- **Before editing:** copy it to `WORKING-NOTES.bak-<yyyy-mm-dd-hhmm>.md` beside it. Never modify or delete a `.bak*`.
- **Format:** UTF-8, <<CRLF|LF>>. Append a line with a script that reads `newline=""`, asserts its anchor exactly once, and writes the same newline. Never `sed -i`/`awk` on it.
- **Who edits:** only the orchestrator. Agents never edit it — they report lessons in their final message and the orchestrator ports them.
- **No secrets** here, ever; machine paths as `~` / `%USERPROFILE%` where possible.
- **History and the dated diary** live in `WORKING-NOTES-ARCHIVE.md` (same folder): every superseded block, every dated diary line, long version-table cells — verbatim, with an index; cite old section numbers as `(§N)` and never renumber them, because specs cite them. The dated running log is `HANDOFF-<first date>.md`; the current entry point is the newest `HANDOFF-<date>.md`; the PR queue is `QUEUE.md`; specs and their USER DECISIONS blocks are in `specs/`.

## Map of this file

| Part | What lives here |
| --- | --- |
| I — How the user wants to work | ownership, discuss-first, delegation, how they verify, what they reject, communication, standing decisions |
| II — Repo mechanics | checkout + worktrees, versioning, the release process and its traps, PR/commit shape, the verify recipe, hard rules for every brief |
| III — CI, testing, code rules | the gate, flakes, test isolation, banned patterns, boundaries, contract tests, new-setting checklist |
| IV — Product principles | the rules every change is judged against |
| V — Domain facts and gotchas | what this system's parts actually do (filled over time) |
| VI — Subagent orchestration | the loop, briefs, resume, failure modes |
| VII — Environment | this machine, disks, tools |
| VIII — Release history | one row per version |
| IX — Learnings | one deduplicated list, grouped by theme, each with its origin |
| X — Still open | deferred work, queue pointers, the user's own to-dos |

**Fastest cold start:** the newest HANDOFF → PART I → II.5 → II.6 → IV → the last ten rows of PART VIII → X.

---

# PART I — HOW THE USER WANTS TO WORK

## I.1 Ownership and what "done" means
- Their repo, their merge: `<<REPO>>` (remote `<<REMOTE>>`); never push or PR to `<<UPSTREAM, if any>>`. A green, agreed PR is merged without asking; report the outcome, not a request for approval.
- **Merged is not shipped.** Shipped = committed + pushed + merged + released with the artefact present and its digest verified.
- Finish end to end. "Fixed" means the user can see it working: state the exit criterion in their terms up front, test to it, lead with the negative when it is negative.
- Good behaviour by default: never a "run this once" user step; the product does it.
- The live system is theirs: `<<LIVE SYSTEM, if any>>` — the orchestrator never stops, restarts or reconfigures it.

## I.2 Discuss before building
- Read-only investigation → a spec in `specs/` with NUMBERED plain-language questions, each with a recommendation → the user answers in one line → a binding `USER DECISIONS (<time>)` block appended to the spec → ONE implementer. Never dispatch before they agree.
- A small ask must not fan out; scope beyond the literal request is a question BEFORE dispatch.
- Safest, 100 % working, break nothing: change only what is broken, where it is broken; equality contracts prove behaviour-preserving work; what cannot meet the bar is left out and named.
- Investigations finish before fixes start on the same question.
- Questions the user can answer: plain language, only about things they can see or decide; never relay an agent's question unchecked.
- Queue discipline: finish the QUEUED PRs first in their order; new ideas wait; after the last queued PR, report and let the user choose.
- Granular PRs: one concern per PR and per release; scope additions go to the NEXT PR unless one line.
- External publication waits for an explicit go.

## I.3 Delegation, model choice, context
- Delegate the investigation AND the spec-writing; take conclusions only. Protect the orchestrator's context.
- Every agent = `<<MODEL>>`. At most <<N=2>> agents at once; one implementer at a time; read-only investigators may run beside it.
- One written spec per implementer: enumerated contract, every `file:line` grepped, tests named, docs, verification.
- Announce every dispatch in the same message. No extra process artefacts beyond the ones named above.
- No diagnostics of their machine unless asked. Agents keep `PROGRESS.md` + `HANDOFF.md` so a pause or kill costs nothing. No infinite or background polling anywhere.

## I.4 How they verify
- They test independently and come back with counter-evidence. Assume every claim will be checked on their machine.
- Their bug reports are precise and usually right: reproduce first, argue never.
- "Did you fix it" is often honestly "no, and here is what I actually verified".
- When they are frustrated: lead with evidence, not reassurance.

## I.5 What they reject
- Invented limits; claiming it works without running it; low-effort deliverables and filler docs; docs in the wrong place; a UI never driven in a browser; per-name fixes; speculative features; changes to retry/fallback/rotation/safety behaviour; a long page as a fix; being told to change their settings.

## I.6 Communication style
- Lead with the answer, then the evidence; show real command output rather than describing it.
- Say plainly when wrong, correct it, move on.
- Separate **CONFIRMED** (ran it; output shown), **UNVERIFIED** (read it), **NOT DONE** (skipped, and why).
- The machine is <<TIMEZONE>>; every DB timestamp is <<UTC|local>> — convert before saying "recent".

## I.7 The user's standing decisions (do not re-ask)
- <<add each standing decision with its date>>

---

# PART II — REPO MECHANICS

## II.1 Checkout, worktrees, branches
- Checkout: `<<CHECKOUT PATH>>`. One fresh worktree per unit of work from `<<REMOTE>>/<<DEFAULT BRANCH>>`: `git -C <checkout> fetch <<REMOTE>>` then `git -C <checkout> worktree add -b <branch> <<WORKTREE ROOT>>/<id> <<REMOTE>>/<<DEFAULT BRANCH>>`. Release builds in a clean detached worktree at the merge SHA; scratch data in `<<SCRATCH ROOT>>/<id>`; read-only investigators in `<<WORKTREE ROOT>>/inv-<topic>`.
- Never delete anything under `<<WORKTREE ROOT>>`/`<<SCRATCH ROOT>>` — list leftovers; the user deletes on request.
- Never `git stash`, `git checkout <file>`, `git reset` in a worktree. Inspect with `git diff`; compare against a base in a SECOND detached worktree.
- Branch names mirror the commit type (`fix/`, `feat/`, `docs/`, `perf/`, `chore/`, `test/`); squash-merge, delete the branch.
- Re-anchor before analysing: `git log --oneline -1 <<REMOTE>>/<<DEFAULT BRANCH>>` and `git log --oneline HEAD..<<REMOTE>>/<<DEFAULT BRANCH>> | wc -l`.
- Line endings: <<project rule>>.
- One implementer at a time (every PR bumps the version files, so two in flight always conflict).

## II.2 Versioning
- <<how the version is bumped; which files; PATCH/MINOR/MAJOR rule; what counts as production>>

## II.3 Release process
1. Bump in the same commit as the source change.
2. Commit (II.4) → push → open a DRAFT PR as soon as the code is frozen (CI runs during local proofs) → wait for EVERY check with ONE bounded loop reading each conclusion (never trust a `--watch` return) → merge only on green on the FINAL commit.
3. Squash-merge with `--delete-branch`.
4. Build the artefact from a CLEAN detached worktree at the merge SHA into a fresh output directory.
5. Create the release targeting the default branch; the tag must resolve to the merge SHA.
6. **Assert the artefact is on the latest release** and its digest equals the local one.
7. Report every release workflow's state (<<list them>>).
- Release notes are the only changelog: headline → what was wrong, with measured evidence → what to expect → action required, with the exact command → known and deliberate.
- Traps that bit: <<add as they bite>>.

## II.4 PR and commit shape
- Commit message: conventional prefix, then prose: what was broken → the mechanism (cause, not symptom) → what the fix does and any non-obvious choice → verification with real output → what was deliberately not done. Attribution line: `<<ATTRIBUTION>>`.
- PR body: the same structure with headings, real output in fenced blocks, a **Residual risks** section always ("none" if none).
- Never claim verification beyond what ran.

## II.5 The verify recipe (after every "shipped" report, before relaying)
```
<<instantiate templates/VERIFY-RECIPE.md here>>
```
Also: LOOK at at least one screenshot the agent names; scan images for key prefixes; read the agent's deviations, residual risks and not-done list; then append the dated "SHIPPED AND VERIFIED BY ME" line (archive diary) + a PART VIII row, update the queue, tell the user (what shipped, what you verified, deviations, not done) and announce the next dispatch.

## II.6 Hard rules for every implementer brief
1. **Where:** a worktree per II.1; never the primary checkout; never stash/checkout-a-file/reset; never delete scratch; list every dir left behind.
2. **Never touch the user's world:** `<<live system>>`, `<<real app configs>>`, `<<real home dirs>>`, `<<autostart/registry>>`, the user PATH; never run the real installer/uninstaller; scratch runs redirect `<<HOME-like variables>>` to `<<SCRATCH ROOT>>` and verify the child's environment before any start that could take over something real.
3. **Stopping processes:** only PIDs you started, by exact PID, children by parent id; never by image name or substring.
4. **Scratch services:** own ports from `<<PORT RANGE>>` (check `<<excluded-port command>>` and `netstat` first); seed the scratch config with the port BEFORE first start and pin it in every child; clients refuse the live address; fake credentials of the same prefix shape; a network guard that blocks non-loopback DNS (a dead proxy is not enough).
5. **Secrets:** never read `<<SECRET FILES>>`; never print process command lines; mask by value shape; screenshots of your own window only.
6. **Desktop/installer launches in a proof:** `<<project-specific isolation flags>>`; snapshot-and-diff `<<machine state list>>` before and after — "unchanged" without the diff is worthless.
7. **Test isolation:** run with a redirected home, a scratch port, takeover disabled; the live system's state counted before and after.
8. **Tooling:** `<<offline run command>>` only; never bare `<<interpreter>>`; never `-c` one-liners or heredocs into an interpreter; scripts as files via the Write tool, run by path; never `sed -i` on tracked files; `<<line-ending rules>>`.
9. **Frozen safety boundary** (the orchestrator diffs it after every ship; must be EMPTY unless the file is the PR's stated purpose): `<<FROZEN FILES>>`. Goldens that must pass unmodified: `<<GOLDENS>>`. `<<SECURITY CONTRACT TEST>>` must pass — never spell its forbidden keywords even in a comment.
10. **Versioning and gate:** II.2 and III.1.
11. **Every new setting:** the III.6 checklist.
12. **Ship:** II.3 in full, including the artefact assertion and workflow states.
13. **Live external calls** only with the user's consent and a stated budget, counted in calls the retry ladder may multiply; a rate-limit answer is inconclusive.
14. **Reporting:** the final message IS the deliverable ("partial is acceptable, silence is not"); keep `PROGRESS.md` + `HANDOFF.md` in the worktree from the first edit and commit WIP early; bounded loops only; do not edit WORKING-NOTES — report lessons; name every screenshot and LOOK at it; list every leftover dir.
15. **Extend, never narrow:** list every module the change touches (grepped, `file:line`) and read each before changing anything; when the change meets an existing mechanism, add to it and keep every existing output byte-identical (equality proof); if the scope seems to require removing or bypassing existing behaviour, STOP and report.

**Brief skeleton that works:** see `templates/BRIEF-IMPLEMENTER.template.md`.

---

# PART III — CI, TESTING, CODE RULES

## III.1 The gate
- `<<lint command>>`, `<<type-check command>>` (repo-wide, never file-scoped — file-scoped checkers lie at CI parity), `<<test command>>` (<<notes: ordering, workers>>). Local is not the gate; CI is.
- CI jobs: <<list>>. Baseline: <<N>> known local failures (named).
- Risk tiers (decide from the paths in the diff; when unsure, tier up): T0 docs/tests/CI only → lint if code changed; T1 UI only → lint, UI tests, a screenshot looked at; T2 source outside the frozen boundary → lint, targeted + contracts + goldens, behaviour on a scratch instance, mutation checks for new guards; T3 anything that rewrites stored user data → full-size copy, round trip, equality, kill test, old-version reads; T4 installers/updaters/frozen files/OS branches → the full local suite + install proofs.
- Proportionate testing: tests follow the SYSTEMS the diff changes; a one-line flip gets no new tests; new tests only for new or changed behaviour.
- Never two full gates at once on the machine.

## III.2 Known flakes
- <<name each, with its classification and hits>>

## III.3 Test isolation
- <<the suite's hermetic mechanism; what must never be session-wide; singletons that need an autouse reset; order dependence>>

## III.4 Code rules that fail CI
- <<banned patterns (suppression comments, future imports), language-version facts a tool may misreport, lint/type idioms>>

## III.5 Architecture and import boundaries
- <<layer rules and the contract test that pins them>>

## III.6 Every new setting / environment variable
- Constant default → settings field → dashboard/CLI surface with real help text → bounds → example config line → docs → the contracts that pin all of that green. Everything new is opt-in and byte-stable when unset.

## III.7 Contract tests you will meet
- <<list the equality/leak/identity/docs-drift contracts and what each pins>>

## III.8 Stored-data schema rules
- <<migration rules: additive columns only, versioned index names, NULL = not measured vs 0 = measured zero, backfills on the writer thread, test on a realistic copy>>

---

# PART IV — PRODUCT PRINCIPLES

1. **No invented limits.** Never a hard-coded ceiling, budget or "sensible default" for something the other side reports; derive from what it reports.
2. **Clamp to capability, never under-use it.** Requested ≤ max → send requested; > max → send the max (never refuse, never shrink further); unknown → fall back and say so.
3. **Scope boundaries are explicit** (what installs what; what the product does vs what the user does).
4. **Guardrails must not become outages.** Soft guardrails degrade rather than refuse; single points bypass health gates.
5. **Secrets never leave the machine in identifiable form.** Masked labels only; never in a DB, log line or response; bodies redacted at write time; transport security is never weakened (contract test).
6. **General over per-name; never a name branch.** Scope is declared data (profiles, tables, learned facts).
7. **Everything new is opt-in, and stable outputs must not change.** With no new preference set, outputs are byte-identical (equality contract required).
8. **Never alter retry, fallback, rotation or safety behaviour** except as a PR's stated, user-approved purpose, with outcomes proven byte-identical. Re-verify every carried-over proposal's premise in code first.
9. **No hand-entered facts where a source exists** (prices, limits, capabilities): reported → declared → derived → NULL "not known"; never a fabricated zero.
10. **No speculative features.** Build what was asked.
11. **Every setting is visible** where it belongs, with real help text, nothing hidden by default.
12. **The user's values stay the user's.** Fixes work with their settings; never change shipped defaults or their values to "fix" a bucket.
13. **Data is never lost by a feature.** Nothing migrates or compacts automatically beyond what the user decided; destructive routes need a confirm token.
14. **Good behaviour by default, one update path.**
15. **Documentation is a deliverable and belongs where the user is.**
16. **Unknown is not unsupported.** Distinguish them at every layer.
17. **Honest product wording.** "Installed and verified" enumerates what was checked; "restarted" means it answers; a success with no answer is labelled as such.
18. **Never reduce a wide, deep system to fit one scope.** A change that touches an exhaustive mechanism improves, expands and adds — a new rung, field, case — and never narrows, replaces or bypasses it; every brief names the affected modules; every PR proves the old outputs are produced identically.

---

# PART V — DOMAIN FACTS AND GOTCHAS
- <<filled over time, grouped by subsystem; each fact with its origin (version/PR/date)>>

---

# PART VI — SUBAGENT ORCHESTRATION

## VI.1 The loop that holds up
1. Re-anchor (default branch head, latest release, open PRs, worktrees, the live system's version, `ListAgents`).
2. Read-only investigator → a spec in `specs/` with numbered questions + a recommendation each (`templates/SPEC.template.md`).
3. The user answers; append the answers verbatim as a binding `USER DECISIONS (<time>)` block.
4. ONE implementer from the spec + the decisions + the II.6 hard rules, in a fresh worktree; it ships PR → CI → merge → artefact → release.
5. Verify every claim yourself (II.5), LOOK at the screenshots, relay: what shipped, what you verified, deviations, not done. Port the lessons here. Announce the next dispatch.

Investigators disagree; the implementer measures both sides. Scope additions can be folded into a RUNNING agent by message without loss; larger ones go to the next PR.

## VI.2 What goes wrong with agents, and the counter-measure
- Silence → the brief says the final message IS the deliverable.
- Kills (limits, crashes) → `PROGRESS.md` + `HANDOFF.md` from the first edit, WIP committed; resume the SAME agent by message with the on-disk state; across sessions, a fresh agent from the HANDOFF.
- Waiting forever / polling forever → bounded loops with timeouts only.
- Stray agents → `ListAgents` before every dispatch.
- Wrong claims → budget half to be wrong; check every `file:line`; "unchanged" claims about machine state need the before/after diff shown.
- Writing to the wrong notes file → briefs forbid editing the manual.
- Specs written from reading are wrong about third-party tools → install and read the real thing first.
- A cut-off launch brief → check `ListAgents`, re-send the full brief by message.

## VI.3 What a read-only investigator brief says
READ-ONLY: no git writes, no edits outside its scratchpad and the spec, never touch the live system (GET-only at most), never print secrets, open data copies read-only, a stated live-call budget (or none), where to write the spec, the numbered questions to answer, CONFIRMED vs UNVERIFIED separated, "a process scan is not proof a service is unused".

---

# PART VII — ENVIRONMENT
- <<machine, OS, shells, timezone; the live system and its address; config homes; installed clients; disks and directory conventions; ports in use; what must never be run>>

---

# PART VIII — RELEASE HISTORY

| Version | Date | PR | What |
| --- | --- | --- | --- |
| <<x.y.z>> | <<date>> | <<#n>> | <<headline; what was wrong; what shipped; proofs; deviations; residual; not done; user action; leftovers; lessons>> |

---

# PART IX — LEARNINGS (consolidated, deduplicated)

One bullet per lesson, with the evidence that makes it memorable and its origin. Rules that follow from these lessons live in PARTS I–VII; this is the "why".

## IX.1 Verification and evidence
- Re-anchor before analysing. The evidence ladder: real data through the whole path, read back from storage > the real artefact run unattended > a unit test on the changed function > reading the code.
- Verify at the layer the bug lives. A command that fails is not a command that found nothing. "No matches" needs a second command.
- Reproduce the symptom first; observability first, then debugging. The instinct to blame the newest release is usually wrong — get the daily series.
- A test that cannot fail is not a test; prove every guard against the broken case (revert and watch it fail).
- Grep every golden/baseline for the bytes a fix changes before planning it.

## IX.2 Agents and briefs
- <<project lessons>>

## IX.3 Shell and tooling traps on this machine
- <<project lessons>>

## IX.4 <<subsystem>>
- <<project lessons>>

---

# PART X — STILL OPEN
- Amendments that override older text above (dated).
- Priority now; queued (pointer to QUEUE.md); held; awaiting the user's decision; deferred until the user says go; dropped — do not rebuild; known unqueued findings (re-verify before citing); the user's own to-dos (remind, never nag).
