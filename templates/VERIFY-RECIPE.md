# The verify recipe — run by the orchestrator after every "shipped" report, before relaying

```
git -C <checkout> fetch <<REMOTE>> --tags ; git -C <checkout> log -1 --format='%h %s' <<REMOTE>>/<<DEFAULT BRANCH>>
<<latest-release command>>                        # tag, asset count, the artefact's digest (select the asset by NAME, never by index)
<<tag-to-sha command>> vX.Y.Z                      # == the merge SHA == the default branch head
gh pr list --repo <<REPO>> --state open            # as expected (name the ones the user parked)
git -C <checkout> diff vPrev vX.Y.Z --stat -- <<FROZEN FILES AND GOLDENS>>   # empty unless the file is the PR's stated purpose
git -C <checkout> grep -nE '<<SECURITY KEYWORDS>>' vX.Y.Z -- <<source dir>>  # 0 lines
<<release/CI workflow states, each read by name and conclusion; never trust a --watch return>>
<<package registry version, if published>>
<<the live system still listening / its PID unchanged by you>>
<<a call to the live system that does REAL work — a health endpoint is not proof it can serve>>
<<autostart/registry entry still present; user PATH free of scratch entries>>
<<refresh the user's update feed, if there is one>>
```

Then: LOOK at at least one screenshot the agent names (Read tool) and scan images for key prefixes; read the agent's deviations, residual risks and not-done list; append the dated "SHIPPED AND VERIFIED BY ME" line to the archive diary; add the release-history row; flip the queue row to FINISHED with the proofs; port the lessons; tell the user what shipped, what you verified, deviations, not done; announce the next dispatch. Start a bounded background wait for the release workflows and record their tail line when it completes.
