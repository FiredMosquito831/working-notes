You are the SOLE implementer of <<ITEM>> for <<PROJECT>>, repo <<REPO>> (remote `<<REMOTE>>`; never push or PR to <<UPSTREAM>>; every `gh` call carries `--repo <<REPO>>`). ONE PR, version **<<x.y.z>>** (<<PATCH|MINOR: why>>), tier **T<<n>>** (<<why; which frozen file, if any, is this PR's stated purpose>>). <<Nothing else is being built: the default branch stays at <<sha>> until you merge. | Parallel-build note, if the user allowed it.>>

Spec (READ ALL FIRST): `<<spec path>>` — sections <<list>>, and the BINDING block "USER DECISIONS (<<time>>)" (<<summarise each decision in one clause>>). Prior work not to regress: <<versions + `file:line` of the mechanisms this touches; the HANDOFF files of earlier agents on this area>>. Standing rules: WORKING-NOTES <<II.1–II.6, III.1, III.3–III.8, IV (…), the subsystem sections, X>>.

## The defect / the feature (CONFIRMED by the spec)
<<two to five sentences: what is wrong, where, with the measured evidence>>

## Scope (numbered; the spec's option <<X>>)
1. <<change, with `file:line`, and what stays byte-identical>>
2. …
NOT in scope: <<list>>.

## Verification bar (binding)
- **Equality/identity:** <<which corpora/goldens/baselines must stay unmodified and green; the new contract that pins "same object/bytes when nothing applies">>.
- **Premise + fix on a scratch instance** (hard rules 2–5 below): <<base vs branch, the exact cases, what each must show; captures/hashes>>.
- **Mutations:** <<remove each guard → which test fails>>.
- **Tests:** proportionate (the SYSTEMS the diff changes): <<files>>, the contracts, the goldens; <<lint>> + <<type-check>> repo-wide; the test shell per hard rule 7.
- **Screenshot** (if any UI): <<what it must show>>; LOOK at it; no secrets.

## Ship
<<the project's II.3 sequence verbatim: bump files; commit per II.4 ending with the attribution; push; DRAFT PR at freeze (body per II.4 with "Residual risks"); ONE bounded CI loop (≤ 40 min; never a foreground sleep over 10 min); merge on green on the FINAL commit; artefact from a clean detached worktree at the merge SHA; release; assert the artefact digest on the latest release and tag = merge SHA; report "release created + digest verified + tag = merge SHA"; the orchestrator watches the release workflows. Release notes: headline → what was wrong (evidence) → what ships → what to expect → action required → known and deliberate.>>

## Hard rules (binding; WORKING-NOTES II.6 in full)
1. Worktree `<<exact git worktree add command>>` (absolute paths); base `<<base worktree>>` detached at the default branch; never the primary checkout; never stash/checkout-a-file/reset; never delete scratch; list every dir left behind. `<<offline sync>>` (if it fails, ONE online sync into `<<cache dir>>`).
2. Never touch the user's world: `<<live system>>` (<<GET health at most>>), `<<real configs>>`, `<<real homes>>`, `<<autostart/registry>>`, `<<installed tools>>`, the user PATH. Never run the real installer/uninstaller; never run any vendor CLI with the real home. Live external call budget: <<0 | N with the user's consent>>.
3. Stop only PIDs you started, by exact PID, children by parent id (<<launcher-with-child note>>); never by image name or substring.
4. Secrets: never read `<<secret files>>`; never print a process command-line listing; fake credentials of the right prefix shape; screenshots of your own page; scan images for `<<key prefixes>>`.
5. Tooling: `<<offline run>>` only; NEVER bare `<<interpreter>>`, NEVER `-c` one-liners, NEVER `-` or heredocs into an interpreter, never `cat <<EOF` to write files, never `sed -i` on tracked files; scripts/prose via the Write tool, run by path; `<<line-ending rules>>`; `<<language-version facts>>`; `<<banned comments>>`; `<<import boundaries>>`.
6. Frozen boundary diff must be EMPTY (<<list>>) except `<<this PR's stated purpose file, if any>>`; every golden unmodified; `<<security contract test>>` green.
7. Extend, never narrow: if the change seems to require altering `<<the mechanisms named>>`, STOP and report.
8. Reporting: `<<worktree>>/PROGRESS.md` + `HANDOFF.md` from the FIRST edit, kept current; WIP commits early; the final message IS the deliverable (what shipped, merge SHA, digest, every proof with real output incl. the identity diff, deviations, residual risks, not done, slips, dirs left, lessons); bounded loops only; do NOT edit WORKING-NOTES / QUEUE / HANDOFF files.
