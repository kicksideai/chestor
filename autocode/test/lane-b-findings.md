# Lane B verification and integration

The Codex and Muse audits are present. There is no agy audit in the supplied findings directory.

## Adapter changes required in other lanes

Lane A must pass the framework arm input's durable `idempotency_key` unchanged as the third argument to `runs.submit(request, flow, args.idempotency_key)` (or as `request.idempotency_key`). The key is scoped to the authenticated caller. The canonical request includes the callback; a different request under the same key returns CONFLICT. A replay returns the original run before fresh admission, and the run, callback, key, reservation and job share one transaction. The arm remains responsible for validating callback provenance.

The image request adapter must allocate one `build_id` and use it in both the durable request and the job payload:

```lua
local build_id = uuid.v7()
local err = repo.request_image_build(image_id, row, mode,
    deferred.enqueue({scope = image_id, key = "build:" .. build_id,
        owner_id = owner_id, job_type = BUILD_JOB, max_attempts = 3,
        payload = {image_id = image_id, build_id = build_id}}), build_id)
```

Remove the pre-transaction `resources.set_meta(...preparing...)` write from `api/images.lua`. The worker projects preparing from the committed build row, and admission also consults that row. Return the committed identity when a subsequent nudge fails, recording the wake error for operations. The adapter must expose an already-created image if initial build admission fails, rather than reporting that nothing was created. `request_image_build` deliberately rejects a missing generation: the old API adapter needs this update before integration. The optional Lua parameter preserves source compatibility for lint while the runtime enforces the generation requirement.

An image build slot stays claimed until its terminal component projection succeeds. A retry projects the stored terminal status, agents and error without rebuilding. New generations cannot replace an unfinished projection. An identical generation request is a replay; a stale worker cannot finish or project a newer generation.

The host alias is configured through the existing administrator-owned image `extra_args`, for example `{"--add-host", "host.docker.internal:host-gateway"}`. The runner adds no alias implicitly. Executor/context requirements and daemon-host filesystem documentation belong to the host configuration/API lane.

## Findings

“Fixed” below refers to the implementation in this lane; explicit integration dependencies remain listed separately.

| Audit | ID | Cause verified against code | Disposition |
| --- | --- | --- | --- |
| Codex | S11 | Execution and storage combine unrelated lifecycle phases. | Fixed: typed prepare/stream/credential/settlement helpers and account/build/run/event stores behind one database transaction helper. |
| Codex | S15 | Transport results and errors receive unchecked shape assertions. | Fixed for runner boundaries: shared checked DTOs and native error decoding; component envelope decoding remains lane A's scope. |
| Codex | S23 | A function worker returns a process-job failure envelope. | Fixed: native `(nil, error)` failures and delivery acknowledgement only after successful resume. |
| Codex | S25 | Cancellation checks precede Docker attachment and do not monitor the stream. | Fixed: start transition refuses a cancelled run, checked reads before creation/start, an attachment watcher, and checks during line delivery. |
| Codex | S26 | Finished build rows discard the desired public status and retries skip projection. | Fixed: persist status/agents/error and replay projection until acknowledged. |
| Codex | S27 | Every submission allocates a new run without a caller key. | Fixed in runs/store; arm integration is out of scope for this lane and requires the exact pass-through above. |
| Codex | S28 | Build requests overwrite an unversioned row and public status precedes durable admission. | Fixed in store/worker with generations and an atomic slot; the API adapter update above is out of scope. |
| Codex | S29 | Flush order chooses the result and each block replaces its predecessor. | Fixed: completed message ownership, grouping blocks from the same reader message, cross-step completion pieces, authoritative terminal answers, and complete-stream retention for bounded terminal prefixes. |
| Codex | S30 | Raw text is discarded before the filter can recognize a boundary-spanning credential. | Fixed: retain the admitted credential overlap, filter before display/result clipping, and enforce the same 65536-byte refresh bound. |
| Codex | S31 | A wake error replaces the result of a successful commit. | Fixed in run submission and workflow settlement: return the committed identity and log recoverable wake errors; image API integration remains out of scope. |
| Codex | S32 | Eligibility and ordering precede reservation, and success can clear another run's refusal. | Fixed: serialize selection/reservation with job commit, use monotonic reservation order, stamp last use at start, enforce named-account cooldown, and preserve newer/active refusal windows. |
| Codex | S35 | Refresh bypasses the credential codec and generic context updates require WRITE. | Fixed validation, run/driver/kind ownership checks and persistent refresh health; a narrowly authorized maintenance CAS for a READ grantee remains out of scope in component/security APIs. |
| Codex | S36 | Account views watch component topics while health lives in separate rows. | Out of scope: account UI subscriptions/expiry and grantee notification authorization belong to UI/security lanes. Run owner notifications already follow committed settlement. |
| Codex | S44 | Cancellation reads, pre-start cleanup, configuration reads and migration rollback errors are ignored. | Fixed for owned code: checked cancellation/config reads, one cleanup helper with visible errors, and checked rollback statements; component status handling remains lane A's scope. |
| Codex | S45 | Prefix checks cannot establish the daemon host's canonical directory or prevent symlink escape. | Root normalization/configuration errors fixed; canonical directory verification at registration and launch remains out of scope pending a host filesystem executor and its security grant. Lexical admission is not claimed as canonical verification. |
| Codex | S46 | Readiness probes only agent CLI presence. | Fixed: probe dirname/mkdir/git/timeout -k and writable configured HOME/work before ready; UI/README wording belongs to other lanes. |
| Codex | S48 | Retention ignores pending workflow delivery. | Fixed: retain undelivered workflow runs and acknowledge only successful idempotent resume. |
| Codex | S49 | Every selected workspace clones into the same fixed directory, including read-only mounts. | Fixed at admission: repo_url requires scratch; selected workspaces use their existing checkout. |
| Codex | S56 | Completed lines bypass the bound and tar overhead consumes the file allowance. | Fixed: check every delivered line, bound archive overhead separately, and validate declared file bytes before extraction. |
| Codex | S59 | Every container receives one fixed host alias. | Alias fixed through existing image configuration; host executor/context requirements and daemon-path documentation remain out of scope. |
| Muse | S13 | Process-job failure conversion is duplicated across workers. | Fixed: shared job outcome conversion; resume uses the native function-worker protocol. |
| Muse | S19 | Boundary values become trusted DTOs/errors without checks. | Fixed for owned runner code as Codex S15; arm/component codecs remain lane A's scope. |
| Muse | S22 | Completion continuation is inferred only inside one reader step. | Fixed: segment state survives consecutive completion pieces in later feed calls. |
| Muse | S23 | Flush promotes unfinished segments over completed output. | Fixed: completed messages take precedence over partial/stale held segments. |
| Muse | S24 | Clipping, empty completion, channel reuse and text-based superseding share incorrect segment state. | Fixed: one truncation marker, no empty text events, channel-aware state, and identity-based tracking. |
| Muse | S25 | Image projection precedes commit and wake errors erase committed submission success. | Run side fixed; image adapter changes above remain out of scope. |
| Muse | S28 | Balancing reads stale state and named accounts bypass cooldown. | Fixed as Codex S32, including separate reservation order and actual-start timestamp. |
| Muse | S30 | Cancellation reads and cleanup/stop errors are discarded. | Fixed as Codex S44. |
| Muse | S35 | The host alias is an unchangeable Docker argument. | Fixed: existing image extra_args controls the mapping. |
| Muse | S36 | The executable wrapper and its policy pattern can diverge. | Fixed: harness compares the actual generated command with the registered policy prefix. |
| Muse | S53 | Refusal vocabulary and error mapping differ across API surfaces. | Out of scope: requires coordinated API/admission-suite changes owned by lane A/API lane. |

Additional cross-references:

| Audit | ID | Cause and disposition |
| --- | --- | --- |
| Codex | S9 | Duplicate metadata decoding and DTO declarations: owned text decoding now uses resources.text and worker DTOs are shared; shared endpoint decoding remains in the component/API lane. |
| Codex | S42 | Retention prefixes an already-signed duration: fixed by subtracting parsed nanoseconds; on-write duration validators belong to module settings configuration outside this lane. |
| Codex | S53 | Pagination and summary contracts are absent from the API/UI: out of scope in those lanes; the existing repository method preserves its current interface. |
| Muse | S12 | Same duplicate codecs as Codex S9: owned text helper fixed; component/API consolidation remains out of scope. |
| Muse | S15 | Same oversized execution/store functions as Codex S11: fixed with phase helpers and aggregate stores. |
| Muse | S17 | Not a source defect: locked dependencies install successfully here and dependency-complete lint passes. |
| Muse | S18 | Owned SQL, redactor, stream and realtime any annotations are fixed; component and older shared harness typing belongs to their owning lanes. |
| Muse | S31 | The cached-dead-session claim is not real: the runtime contract instance stores binding/context and dispatches a fresh function task on each call, with no notification session or failed-state field. Reopening cannot repair a notify failure. Settings opens and event notification coalescing are performance suggestions without a reproduced correctness defect. |
| Muse | S34 | Same daemon canonical-path boundary as Codex S45: out of scope for host filesystem authority and workspace API changes. |
| Muse | S39 | The owned timeout kill grace now has a named constant; navigation and prune configuration belong to UI/API lanes. |
| Muse | S42 | The list's frozen subscription metadata disagrees with live admission: API list computation is out of scope; admission already uses the live driver credential kind. |
| Muse | S46 | Refresh copy failures are error events without account health: fixed with system events, an extracted-file limit and persistent account last_error. |
| Muse | S50 | Root '/' disappears during normalization: fixed and covered by root parsing tests; route-side pre-normalization remains lane A's scope. |

Related owned portions of Codex S6 (redundant Script.script), S12 (state/record comments), S14 (known SQL/redactor/stream/realtime types), and S16 (migration database annotations) are also fixed.

## Validation

The harness fault subjects are symlinks to production sources, with separately registered test dependencies; there is no copied runner implementation. Tests use an isolated HTTP port so parallel lanes do not sign in against one another's database.

Observed red runs:

- Records: seven regressions fail before the record changes; stale completion, terminal precedence, split completion, empty completion, channel reuse, credential boundaries and duplicate truncation are covered.
- Persistence: five original store regressions fail for key replay, atomic balancing, refusal fencing, undelivered retention and generation admission.
- Worker faults: native resume failure, finished projection repair, stale generation, start cancellation, stream cancellation and post-commit wake fail before their fixes.
- Docker: the completed-line boundary and file-vs-archive allowance fail before their fixes; truncated archive rejection is also covered.
- Multi-block stream without a terminal copy: expected first and second blocks, received only second before message grouping. The same failure is reproduced when the first block continues across reader steps before the next block.
- Base runtime: the missing-tools case lacks the runtime-prerequisite diagnosis before probing is added.
- Workspace roots: '/', registry failure and relative-root cases fail before normalization/error handling changes.
- Reservation ordering: equal timestamps select the same account again before monotonic reservation ordering.
- Retention with +1h throws invalid duration -+1h before parsed-duration subtraction.
- Replaying the same build generation fails before generation replay is recognized.
- Credential refresh: the original producer accepts malformed JSON, an oversized credential and an account whose driver changes; all three cases fail their regression assertions before the validation and ownership checks.

Final commands use independent harness ports:

- `make lint`
- `make lint WIPPY_LINT_ARGS=--strict-any`
- `make test RUNTIME_ARGS='--set vars.http_port=19357'`
- `make test-pg RUNTIME_ARGS='--set vars.http_port=19358'`

Final results: 80 tests pass on SQLite and 80 on PostgreSQL; default and strict-any lint report no issues across 182 entries. PostgreSQL runs use dedicated databases and the Makefile drops them afterward. The completion message records commit IDs. Dependencies install without download failures. UI files are untouched.

Commits are stored on fix-B in separate writable Git metadata because the supplied clone's .git is mounted read-only. The original worktree retains all edits. A Git bundle carries the local commits for integration; nothing is pushed.

## Scope exception

`src/_index.yaml` gains the new migration's `target_db` binding (two lines). The shared harness `test/src/_index.yaml` registers the matching suites and their dependencies. No security, component, API or UI files are edited.
