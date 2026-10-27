# QUEUE.md — the PR queue (binding order since <<date>>)

**Rule:** this file is updated at every PR start and every PR end, in full detail. Statuses: **RUNNING** · **QUEUED** · **FINISHED** (plus SPEC FIRST / NEEDS GO / HELD as sub-notes). One production PR at a time; read-only investigators may run beside it, never more than <<N=2>> agents total. Every PR: draft at code freeze → CI green on the final commit → squash-merge → artefact → release → verified by the orchestrator (WORKING-NOTES II.5) → row flipped to FINISHED here.
Spec paths are under `<<specs dir>>`. "User decisions" names the binding block inside that spec (the user's answers, with time). When rows are merged (the user may group same-file, same-proof items into one PR), the merged row carries each absorbed item's original cells verbatim under its label and keeps the old item numbers in brackets so the specs still line up; frozen-file, data-rewriting, spec-first and feature items stay alone.

---

## RUNNING

**<<STATUS NOTE: dated; what is running (agent, worktree, version, tier, one-line scope); what the user owes; what is next; or PAUSED with the resume pointer>>**

_(no production PR running)_

---

## QUEUED (in order)

| # | Item | Version / note | Spec + user decisions | What it does and why |
|---|---|---|---|---|
| 1 | **<<NAME — one-line title>>** | number at dispatch (PATCH/MINOR), tier T<<n>> | `<<spec file>>` + USER DECISIONS <<time>> | <<what was wrong (evidence) → what changes → equality/proof bar → not in scope>> |

---

## FINISHED (this arc, newest first; each verified by the orchestrator per II.5)

| Version | PR | Item | Spec + user decisions | What shipped |
|---|---|---|---|---|
| <<x.y.z>> | <<#n (`sha`)>> | **<<NAME>>** (started, released, verified times) | <<spec + decisions>> | SHIPPED: <<the full proof record: change, proofs with real numbers, mutations, gate, CI, files, merge SHA = tag = main, artefact digest, workflows, deviations, residual, not done, agent slips, USER ACTION, leftovers, lessons>> |

**Investigations finished (no release):** <<spec name — one-line verdict, questions pending>>

---

## HELD — waits until the user says go
- <<item — why it is held; what its own go would need>>
