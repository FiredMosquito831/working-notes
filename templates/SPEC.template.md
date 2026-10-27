# INVESTIGATION — <<TOPIC>> (<<date>>, read-only, <<model>>)

Written by a read-only investigator. No commits, no edits outside its scratch and this file, no live calls beyond the stated budget (<<budget or 0>>), no secrets printed. CONFIRMED = ran it, output shown; UNVERIFIED = read in code or docs; NOT DONE = skipped, and why.

## 0. Answer in five lines
<<the cause / the verdict / the recommendation / what is unverified / what the user must decide>>

## 1. The problem as reported (verbatim) and the reproduction
<<the user's words; the exact failing request/row/log line; how it was reproduced on a scratch copy; the measured scale (counts by day, by surface, by version)>>

## 2. Measured findings (each CONFIRMED or UNVERIFIED)
<<numbered findings with the command or query behind each; structure only, never content>>

## 3. Every module the change would touch (`file:line` at `<<sha>>`, each read)
| File:line | What it does today | Frozen? | Change |
|---|---|---|---|

## 4. Options, with evidence and the bytes each one changes
| Option | What changes | What stays byte-identical | Risk | Verdict |
|---|---|---|---|---|

## 5. Recommendation (precise)
<<the exact change, the equality proof, the mutation checks, the PR split with versions and tiers>>

## 6. Risks
| # | Risk | Mitigation |
|---|---|---|

## 7. QUESTIONS for the user (one line each; a recommendation follows each; "all rec" answers them)
1. **<<question in plain language about something the user can see or decide>>** — Rec: <<yes/no + why>>.

## 8. CONFIRMED / UNVERIFIED / NOT DONE
- CONFIRMED: <<list>>
- UNVERIFIED: <<list>>
- NOT DONE: <<list, with why>>

## 9. Left on disk (nothing deleted; no process left running)
<<worktree, scratch, scripts; ports verified empty>>

<<ATTRIBUTION>>

## USER DECISIONS (<<yyyy-mm-dd hh:mm>>, binding)
<<the user's answer verbatim, then each question's resolved decision; added by the orchestrator, never by an agent>>

<<ATTRIBUTION>>
