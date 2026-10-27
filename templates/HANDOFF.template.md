# HANDOFF — <<yyyy-mm-dd hh:mm local (UTC±n)>>. <<PAUSED by the user | context near its limit>>. Resume from here.

Supersedes `<<previous HANDOFF>>` as the entry point. The dated running log is `<<HANDOFF-<first date>.md>>` (append there). Standing rules: `WORKING-NOTES.md` (PART I, II.3, II.5, II.6, IV, X, the dated lesson lines at the end). The queue is `QUEUE.md` (RUNNING/PAUSED note → QUEUED → FINISHED → HELD, binding order).

## 0. Read this order before doing anything
1. This file.
2. `QUEUE.md` in full.
3. `WORKING-NOTES.md`: PART I, II.3, II.5, II.6, IV, X, and the dated lesson lines at the end.
4. The last <<N>> lines of the dated log.
5. Then verify the live state (section 5) and tell the user where things stand in five lines or fewer. Do NOT dispatch until the user says go.

## 1. State at the handoff (CONFIRMED by the orchestrator unless marked)
- Default branch head `<<sha>>`; latest release `<<tag>>` (artefact digest `<<sha256>>`; workflow states). Nothing running / <<what is running and where its HANDOFF is>>.
- The user's live system: <<version; health; what the verify recipe showed>>.
- Open PRs: <<list, whose, what the user decided>>.
- Releases shipped this arc (newest first), each verified: <<version — item (#PR)>>.
- Investigations done this arc (specs with their USER DECISIONS blocks): <<list>>.
- Disk / worktrees left in place: <<list; anything sensitive to keep>>.

## 2. Remaining queue, in order (every item DECIDED unless marked; one production PR at a time)
1. **<<ITEM>>** (<<tier; spec; decisions>>): <<one-line scope; the proof bar>>.
- Beside any of them (read-only): <<investigators approved>>.
- Test-only work beside a production PR: <<W-tests list>>.
- HELD (own explicit go each): <<list>>.

Version numbers at dispatch. Every agent <<MODEL>>; announce every dispatch; max <<N>> agents.

## 3. Things the user still owes (remind, never nag)
- <<decision / action / consent items>>

## 4. Lessons from this arc already ported to WORKING-NOTES — read them
<<one paragraph of the headline lessons; the recurrent agent slips to keep in every brief>>

## 5. What to do first in the new session
1. Read section 0's files.
2. Verify:
   ```sh
   <<the project's verify commands: default-branch sha; latest release; workflow states; open PRs; live-system call that does real work>>
   ```
3. If something is off, say so first and give the recovery command; touch nothing live.
4. Report in five lines; wait for the user's go; then the queue in section 2's order.

## 6. Environment facts (as of <<date>>)
- <<machine, timezone, disks, checkout, worktree count, live system facts, port ranges, data files and how to open them read-only>>

<<ATTRIBUTION>>
