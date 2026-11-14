<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Autocode reference

[Module README](../README.md)

## Images and execution settings

Image home, resource limits, network, GPU access, extra Docker arguments, and
driver capabilities are administrator-configurable per image. The default
recipe uses `/opt/agent` inside the container. HOME paths normalize before validation;
`/`, `/workspace`, and its descendants are rejected to keep credentials off workspace mounts.
Run timeout, image build timeout, account cooldown, and settled-run retention are
editable settings in `chestor.autocode`. Run
timeouts, including task overrides, range from one minute to 7 days (`168h`,
604800000 milliseconds).

Saving build-relevant image settings requests preparation under the saving
manager's identity. PUT `/autocode/images/{id}` also accepts `ref` (up to 300 bytes)
and `dockerfile` (up to 65,536 bytes). A changed Dockerfile rebuilds; a changed
reference without a Dockerfile requests a refresh. The last approved recipe and
immutable image ID remain available to new and queued runs while a replacement
builds, and after a failed replacement. An image without an approved generation
shows preparing until its first success. Builds tag only their generation until
runtime and agent probes pass, then publish the user reference. A label-only save
keeps readiness. `image_build_timeout` defaults to `30m`, accepts `1m` through
`168h`, and bounds the build and probes. Initial preparation
uses an existing local image without pulling. Prepare rebuilds a stored
Dockerfile, pulls a reference with registry provenance (`RepoDigests`) or a
missing local image, and re-probes a local-only image without pulling. The build
log records this local refresh. A registry pull failure fails preparation.
Image deletion accepts Component's native pending or completed result. Optional
Docker reference removal runs during teardown, after the build drains and before
deletion completes. A Docker removal failure remains a native lifecycle failure; the build row retains the approved target until all Docker cleanup succeeds, and retry treats an absent image as removed.

## Task and account contracts

Open `chestor.autocode:tasks` with its default binding. Methods return
`(Result?, error?)` under the caller's execution frame: `list_agents`,
`list_accounts`, `list_images`, `list_workspaces`, `submit_task`, `get_run`,
`list_runs`, and `cancel_run`. Each method publishes JSON input/output schemas.
Task methods accept no caller, owner, credentials, Docker arguments or callback.
Account writes use the separate `chestor.autocode:accounts` contract:
`add_account`, `update_account`, and `remove_account`. Update preserves the
account ID, requires WRITE, and atomically replaces public endpoint metadata
and the credential with the component revision. An empty endpoint `base_url`
clears the custom endpoint. Replacing a secret, explicitly enabling an account,
or changing its endpoint clears both cooldown and last error and publishes live
account state. Reads return no credential or account share capability.
`credential_kind` accepts at most 200 bytes in both schema and service.

`submit_task.prompt` remains bounded to 16,384 UTF-8 bytes. Optional `input`
accepts JSON with a separate bound of 65,536 UTF-8 bytes after serialization.
The Block passes node input through this field when `include_input` is enabled;
the runner composes the prompt followed by `\n\nInput:\n` and the serialized input
at launch.
Input and prompt are stored separately and both participate in replay.
Optional `repo_ref` in task submission and Block config selects a branch or tag
for `repo_url` (up to 200 bytes);
omitted or empty uses the remote default branch. The clone uses the named
`infrastructure/container.lua:CLONE_DEPTH` constant, currently 50. A scratch clone requires a repository URL. A registered checkout uses its existing repository;
registered checkouts keep their current ref and refuse `repo_ref`. URL forms refuse queries and fragments; SCP-style repository paths such as `git@git.example:team/release#1.git` preserve literal `#` and `?` characters.

Omitting `account_id` balances across usable accounts and persists that the
selection is unpinned. If the reserved account becomes disabled or cools down
before worker start, the worker reserves another eligible account. A caller-pinned
account keeps its identity and refuses execution while unavailable.

Submission is asynchronous. Supply an `idempotency_key` to replay a submission
under the same caller; changing its canonical request returns CONFLICT. The
Block forwards the framework's durable key and keeps its callback outside the
task DTO. Runs and event pages belong only to the submitting caller. Run lists
return summaries and a stable `created_at`/`id` cursor; events return `next_seq`
and `more`. Native errors carry `kind`, `retryable`, and `details.code`; HTTP
adds its success envelope and maps invalid, missing, conflicting, refused,
unavailable, timed-out and rate-limited requests to 400, 404, 409, 403, 503,
504 and 429 respectively. Numeric contract fields require numbers. HTTP
query parameters decode numbers at the transport boundary; event paging uses
`after_seq`, `limit`, `next_seq` and `more` throughout.

The default image recipe is a curated preset with its supported CLIs named in
its label. It does not promise to install every activated driver. Driver-owned
binding metadata supplies icons when available; a missing icon uses a generic
terminal. Driver icon metadata belongs in `bee/drivers`; Autocode keeps no
driver-to-icon map. Catalog resource defaults come from the same decoder as image writes.

## Agent capability

`chestor.autocode.traits:coding_tasks` is the public **Coding tasks** capability.
It exposes nine tools. `ListCodingProfiles` and `ReadCodingProfile` use `chestor.autocode:profiles`;
the other seven use `chestor.autocode:tasks`:

- **`SubmitCodingTask`**: Registry entry: `chestor.autocode.traits:submit_coding_task`; Contract method: `submit_task`
- **`ReadCodingRun`**: Registry entry: `chestor.autocode.traits:read_coding_run`; Contract method: `get_run`
- **`ListCodingAgents`**: Registry entry: `chestor.autocode.traits:list_coding_agents`; Contract method: `list_agents`
- **`ListCodingAccounts`**: Registry entry: `chestor.autocode.traits:list_coding_accounts`; Contract method: `list_accounts`
- **`ListCodingImages`**: Registry entry: `chestor.autocode.traits:list_coding_images`; Contract method: `list_images`
- **`ListCodingWorkspaces`**: Registry entry: `chestor.autocode.traits:list_coding_workspaces`; Contract method: `list_workspaces`
- **`ReadCodingProfile`**: Registry entry: `chestor.autocode.traits:read_coding_profile`; Contract method: `get_profile`
- **`ListCodingProfiles`**: Registry entry: `chestor.autocode.traits:list_coding_profiles`; Contract method: `list_profiles`
- **`CancelCodingRun`**: Registry entry: `chestor.autocode.traits:cancel_coding_run`; Contract method: `cancel_run`

All tools embed the contract's input and output DTO schemas directly. They
return the contract result or its typed error, without an extra envelope.
They take identity from the agent's execution frame and accept no owner or
credential fields. Submission returns `{run_id}`; reading returns
`{run, events, more, next_seq}`. Reuse an idempotency key for submission retries,
and use `next_seq` as `after_seq` to continue event pages. Read again when an
unfinished task's result is needed; the tools add no wait loop or scheduler.

Assign `chestor.autocode.security:tool_access` (`intent: tool_access`) alongside
module access to the intended groups, then select the capability on the agent.
Ordinary module membership alone does not enable the tools. Resource grants
and run ownership still apply. The harness covers refused callers, exact schema
reuse and a tool submission completed by the real Docker runner against its
mock model endpoint.

## Docker host configuration

Docker runs on the executor bound to `docker_executor`, using the host-selected
`docker_context` (empty preserves the executor's own environment and current context). The host CLI inherits the executor's PATH, HOME, DOCKER_HOST, DOCKER_CONTEXT, DOCKER_CONFIG, authentication, plugins and other client settings. Docker resolves its own configuration, endpoints, contexts, CLI plugins and credential helpers. Administrators own these paths, the Docker socket and executable search paths, including resolved targets, and must keep them outside every workspace root and every container-mounted directory because members can write their workspaces. Autocode does not validate or re-derive Docker client configuration. Fixed directory probes use the system utility search path. A nonempty context binding is an explicit `--context` override. Container and image variables never enter that environment. They travel through an inherited pipe descriptor (`--env-file /dev/fd/3`), with no file on disk and no container values in the Docker client environment. The launcher preserves the original stdin independently. Shared/scratch runs, image operations and maintenance need no private state or writable HOME. Reserved AUTOCODE_PAYLOAD_* and AUTOCODE_TRANSFER_* variables carry octal-escaped chunks below Docker's env-file line bound, and the container restores original names, multiline values, trailing newlines and the 64-KiB credential capacity before its script. Variable names must be shell identifiers. The executor uses its existing POSIX shell, coreutils, awk and Linux `/proc`; no Python interpreter is required; container restoration uses the existing POSIX shell builtins and adds no image utility requirement. The selected Docker context determines the daemon; workspace paths name directories on that daemon's
host, which may differ from the API host. Image `extra_args` controls host
aliases, for example `["--add-host", "host.docker.internal:host-gateway"]` on a
compatible local Docker daemon. The runner adds no host alias implicitly.

The executor bound to `docker_executor` must expose the Docker daemon's filesystem;
for a remote daemon, bind the executor on that daemon's host. Registration and
launch verify that the workspace is an existing directory within a configured root.
Directory probes verify each path component without traversing symlinks and reject mount aliases. The approved directory is mounted at `/workspace`, with recursive bind mounts disabled. Ordinary volume mountpoints are valid. Docker parses image `extra_args`; Autocode verifies resulting isolation under the [settings limits and Docker warnings contract](docker-options.md#settings-limits-and-docker-warnings). Every main and image-probe container is created, inspected by returned ID and checked against the [effective isolation properties](docker-options.md) before it starts. Mismatched containers are removed and the error names the property. Effective namespace, privilege, mount, runtime and host-device authority must match module-selected settings, including every pinned Docker default protected path. Every create explicitly requests private cgroup namespaces. Network references resolve to their ID/name identity for both inspected representations. The container name and image must also preserve module ownership. File-backed Docker client options are administrator responsibility: their executor-readable inputs must remain outside all workspaces and container mounts, including aliases. Docker consumes these files before creation and does not expose their source paths in inspect output. Relative paths retain executor-working-directory semantics. Harmless flag-looking values reach Docker unchanged; historical safe recipes require no conversion or rebuilding.

## Pending platform boundaries

The arm delegates current Flow and pending-signal authorization to the public `kickside.blocks:authorize_arm` API. Autocode result delivery passes the constant `arm_id = "chestor.autocode.blocks:arm_task"` to Blocks resume and holds invocation authority only for that arm. Correct parked-arm provenance depends on the in-progress platform Blocks enforcement of `arm_id` against the committed parked declaration; the current platform ignores it. Component kind-level CREATE/UPDATE authorization remains desirable upstream, but forged workspace components no longer grant host access: Autocode requires its own admission row.

## SPEC: profiles, option precedence, usage and limits

`chestor.autocode:profiles` exposes `list_profiles`, `add_profile`,
`get_profile`, `update_profile`, and `remove_profile`. Profiles are standalone owned components:
READ permits listing and selection, WRITE permits editing, and DELETE permits
removal. HTTP uses GET/POST `/autocode/profiles` and PUT/DELETE
`/autocode/profiles/{id}`. Discovery uses bounded `ListCodingProfiles` summary pages and `ReadCodingProfile` reads one complete profile. Legacy unpaged service callers retain full profile lists.
The member page supports creating, editing and duplicating profiles. Loading
finishes before an empty state appears; save failures appear inside the active
profile dialog. Task and profile option fields display the same catalog, unattended
and inherited defaults that execution uses, without submitting them as overrides.

A profile contains `title`, `agent`, `image_id`, optional `account_id` or
`account_pool`, optional `endpoint {protocol, base_url, model}`, `workspace_id`,
`repo_url`, `repo_ref`, `run_timeout`, `unattended`, and catalog-validated
`options`. An empty account selection balances across the harness's usable
accounts. Credentials remain on accounts. Endpoint protocols come from the
harness catalog; endpoint URLs cannot contain credentials, query or fragment.
Profiles grant no access to their referenced accounts, images or workspaces.

Task submission and Block config accept `profile_id`. Profile fields supply
missing task fields; explicit node fields win, including empty selections.
A node's `run_timeout` maps to submission `timeout`. Options resolve in this
order: catalog defaults, unattended preset when enabled, explicit profile
options, explicit node options. Unknown names and invalid values retain the
driver's existing invalid-option errors. Autocode sends the resolved options
with driver preset expansion disabled; the stored `unattended` field records
the requested mode. The run page shows the effective options.

Admission freezes the effective fields, account pool and options in the run.
Transactional reservation freezes the reserved account’s own endpoint separately
from explicit task/profile endpoint overrides; rebalancing replaces an account
endpoint snapshot while preserving explicit overrides. Workers resolve queued
runs whose admission snapshot has not been frozen.
Workers recheck the current grants on referenced resources without reading the
profile again. Editing or deleting a profile cannot rewrite submitted runs.
Caller-key replay returns the original run before reading current profiles or
catalog defaults. Repository refs obey the same validation after profile
inheritance as direct tasks. Repository URLs contain no credentials, query or
fragment.

Run usage preserves reported `input_tokens`, `output_tokens`, `cached_tokens`
(cache reads), `cache_write_tokens`, `reasoning_tokens`, `cost_usd`,
`cost_decimal`, `currency`, and `models` keyed by model name. Model usage has
the same scalar fields. Missing fields stay absent and reported zeros remain
present. Costs are reported amounts; Autocode does not estimate or sum model
costs. `get_run`, `list_runs`, the task Block output and the run page retain
these fields. Usage with no reports remains a JSON object.

Account state retains the latest normalized `rate_limit` observation or terminal
`rate_limits` snapshot: windows contain `window`, optional `utilization` (0–1),
`status`, optional epoch-second `resets_at`, and optional overage fields remain
on the snapshot. The terminal snapshot takes precedence over observations.
Account cards show utilization, reset time and overage status. A retryable
rate-limit refusal cools the account until the last rejected window's reported
reset; without a reported reset, `account_cooldown` remains the fallback.
Admission, queued rebalancing, transactional reservation and UI readiness skip
rejected windows until reset, independently of a manually cleared cooldown.

Known: concurrent runs may finish with provider snapshots in a different order
than the provider produced them; the last folded snapshot wins. Grants changing
after preparation do not revoke a container already running.

The test harness uses module-local traits, tools and a foreign component fixture;
it requires only the Chestor tree and its published dependencies. Fixtures remove
the Docker tags and directories they create. The harness requires a runtime supporting live credential policy selections
(tested with Wippy v0.3.60a). Usage and limit fixtures follow the documented
bee/drivers normalized shapes; no local driver replacement is installed.


## SPEC: workspace approval

Workspaces mount the approved host directory at `/workspace`, read-write only with WRITE access. Runs without a workspace use a scratch directory in the image. The host performs no Git operation on a workspace. Repository cloning and optional branch selection execute in the run container.

The module-owned `chestor_autocode_workspaces` row binds each component ID to its immutable approved host path. The runner reads this row rather than writable Component metadata. Approval, run insertion, preparation approval reads and teardown share the same serialized workspace-table fence. Registration serializes approval-set reads and insertion in one database transaction and refuses equal, ancestor or descendant overlap with another approved workspace. Admission rechecks that set. This excludes container-writable parents of other approved paths. Teardown checks active runs and removes approval in one transaction; run insertion rechecks approval under that fence, so a run cannot be inserted after approval removal. A workspace with Component `deleting_at` set refuses submission and preparation. Teardown retains the approval while any run is queued or running; settle those runs before deletion. A deletion marker set after a request has read the component is a known operator race; the recorded active run still prevents approval release. Paths use clean absolute spelling, no symlink traversal and no ancestor bind aliases. Ordinary volume mountpoints remain valid and nested mounts are excluded from container binds.

Migration 06 approves legacy workspaces automatically when every principal holding WRITE or ADMIN has live workspace-management authority, regardless of context revision. Component supplies the grants; the directory supplies current user memberships and paged expansion of group grants; the live security scope supplies management authority. Stored owner or role metadata is not authority. Workspace placement is fixed at root, so its grants are direct. Read-only grantees do not prevent approval. A non-manager writer, an unresolved principal, malformed or disallowed path, or overlapping path leaves the workspace unapproved with its refusal reason in the existing Component render metadata. Malformed legacy values do not abort migration; native dependency failures remain visible. Lists expose refusal reasons and path conflicts. Registration records actor, timestamp and observed revision in the immutable admission row.

Workspace and image kinds declare `meta.mutation: closed`. On Component 0.3.17 and newer, direct contract creation and public context, metadata or placement writes require exact-kind `component.kind.create`/`component.kind.update` authority. Autocode attaches those grants only to its workspace registration, image creation/update/preparation and revision-checked image-ready function entries; no member or management group receives them. Object access and module management admission still apply. Older Component versions ignore the field; direct mutation protection requires the newer platform.

Admission reports `autocode.workspace_approval_required` for readable unapproved workspaces and asks an administrator to re-register through the normal workspace path. There is no in-place approval action or endpoint. Refused queued runs park without creating a container and remain cancellable; settle them before deleting the old workspace, register its valid path normally, update saved task/profile/Block references and resubmit work. Automatically admitted queued runs execute under their existing IDs with no action. Interrupted running jobs settle through recovery without relaunching; terminal runs remain terminal. Historical runs, accounts, images and results remain readable.

Docker resolves the administrator-owned host client configuration and endpoints, including `DOCKER_HOST=unix://`, named contexts and explicit endpoints. Its configuration, socket, CLI plugins, credential helpers and executable search paths, including resolved targets, must remain outside every workspace root and every container-mounted directory because members can write their workspaces. Container values, including `DOCKER_*`, HOME and PATH, reach only the inherited env-file descriptor and never become Docker client environment variables.

Every run Docker call carries the job's absolute deadline; maintenance originates one five-minute deadline. Rejected-container removal has an independent 30-second deadline. Main run and both image-probe containers use the [settings limits and Docker warnings contract](docker-options.md#settings-limits-and-docker-warnings). Both probes use create/inspect/start and carry the image operation deadline. Image builds retain their existing controls. Directory probes have a 30-second deadline and two-second kill grace. Only the wrapper's private deadline marker classifies a host timeout; literal exits 124/137 remain command failures. Member validators hold only fixed directory-probe authority; observation hooks cannot reconstruct owners or dispatch tools.

Known: concurrent host-operator replacement of workspace or Docker client paths, concurrent changes to grants, management authority or paths during upgrade and operator changes to retention timestamps require operator coordination.

## SPEC: run driver gateway

Profiles and tasks accept `tools: { traits: [agent.trait IDs], tools: [tool IDs],
context: { ... } }`. Task fields override the corresponding profile surface
fields; context keys merge with task values taking precedence. The workflow
can supply board or ticket context through this task field independently of
the reusable profile. Submission freezes the declaration; preparation resolves
trait tool IDs, explicit tools, their schemas and static trait prompts under
the owner. Prompts become driver instructions. MCP names use the framework's snake-case normalization with non-letter characters replaced by underscores,
so every driver receives plain lowercase identifiers. Alias collisions are refused.
A batch profile without a declared MCP client transport refuses a surface.
An empty resolved tool list launches without a gateway.

Autocode owns `/autocode-gateway/mcp/{action_id}` and
`/autocode-gateway/hook/{action_id}` on its dedicated router, attached to the
host's `ui_server` alongside the host's root router. This is a separate
bearer-authenticated router. Plain-HTTP gateway transport relies on every Autocode main/probe container dropping `NET_RAW`, refusal of all added capabilities, and per-run tokens; Docker host/network infrastructure remains trusted. Additional recipe drops are preserved, and inspection requires `NET_RAW` or `ALL` in `CapDrop`. Hosts must route these paths to Autocode without
user-token middleware.
Set the `gateway_endpoint` requirement to `host:port` reachable from containers. This host binding is the sole authority for the MCP credential destination; resource metadata, workspace context and tool context cannot override it. Image and workspace inputs have no endpoint field. The gateway validates the bound authority before issuing a token. Preparation appends
the module-owned router prefix to the bound authority for the driver endpoint;
operators never include the prefix in configuration. The image's network settings
and host aliases must allow that address. The routes implement stateless MCP streamable
HTTP JSON replies for initialize, tools/list and tools/call, plus ping and
initialized/cancelled notifications. The request bound is 512 KiB. Batch hooks
are recorded observations and subscribe to no permission hooks.

Preparation issues one 32-byte random token, stores only its SHA-256 hash and
resolved binding on the run, and gives the driver a gateway descriptor using
`AUTOCODE_GATEWAY_TOKEN`. Raw tokens travel to the container only in that named
environment variable. Driver files with JSON secret fields are injected inside
the container; these images require Node.js. The container configuration script
and driver launch contain no token bytes. Tokens expire no later than the run
timeout after preparation, and a durable pending outcome or terminal status
immediately revokes access, even while container cleanup retries. Retention
removes the binding with its run. Tokens do not enter public run DTOs, options,
events or results. Known-token and structured credential redaction also apply
to gateway calls and replies.

Gateway workers may read policy groups and policies and construct the owner scope
returned by live identity resolution. A live identity permission denial, including
loss of the recorded authorizer's root ADMIN, refuses dispatch as an MCP tool
result with `isError` and is recorded in the run log. Only credential failures
answer HTTP 401 with `autocode.gateway_credential_invalid`; infrastructure and
malformed stored-identity failures answer 500
with `autocode.gateway_unavailable`. Each 500 logs the native error kind, code
and message once, with the run id and selected tool id when available; bearer
and structured credential redaction apply to these diagnostics too. Tool
authorization denials remain native
MCP tool results with `isError`.

The gateway lists exactly its frozen tools and evaluates the owner's `funcs.call`
grant before dispatch. Calls re-resolve the stored owner's
execution identity, pass the binding's context through normal function tool
execution, and retain the owner's current scope. Selecting a trait or tool
grants no authority. The host composes each selected tool family's exact tool-access
policy into the owner's scope. The gateway validates arguments against the frozen
input schema before dispatch or logging a call; malformed arguments answer JSON-RPC
`-32602`. Tools continue to check resource access. Calls and results enter the same ordered run log as runner output;
sequence allocation locks the existing run row and stores no extra position.
All event writers redact and clip the persisted copy to the same byte bound and
notify the run topic. MCP replies retain the complete redacted tool reply.
Malformed JSON-RPC requests and parameter objects return protocol errors.
Tool context cannot supply reserved callback, trace, identity or component keys.
A role change during an already dispatched call is a known runtime race.
Manual preparation concurrent with the queued run’s Jobs worker is a known
operator race; internal preparation is exercised under its single job lease.
Component v0.3.16 validates captured-root ADMIN independently of a worker's
implementation-discovery grants. The harness pins that dependency and requires
successful direct/group ADMIN dispatch while retaining live revocation refusal.

## SPEC: settlement, listings and wire schemas

The pending run outcome includes a durable, redacted account-health intent.
Health-write failures remain native job failures; an existing job attempt replays
that intent before cleanup and settlement without rerunning the CLI. Cooldown
calculation uses the recorded observation time. Concurrent run settlements can
replace an account’s last-error snapshot; this is a known cross-run race. The additive health column keeps
queued and running records valid during upgrades.

Account cards render counts and health exclusively from Component public metadata. The existing account-activity projection computes rolling 24-hour counts from run rows and publishes `runs_day` and `failures_day` with the health snapshot. Counts describe the last projection and age on the next account activity; reads never query private runs or write a snapshot. Balancing still uses live private state. Credential-kind
changes require a new account; editing accepts only the existing kind.

Task and workflow forms derive profile defaults from the selected profile and
explicit overrides. Missing inherited targets remain visible as unavailable.
An empty timeout or repository ref is an explicit override; an omitted field
inherits its profile value. Profile refreshes serialize and discard late results
after unmount. Live listings publish their subscribed snapshot, perform one
catch-up read, and queue further discoveries through the existing refresh queue.

Shared Zod fragments in `ui/src/app/wire.ts` materialize the published JSON
schemas and Block declaration through `scripts/materialize-contracts.mjs`.
Credential format and agent icon are required catalog metadata. Stored JSON
structures are decoded explicitly; malformed execution or cleanup fields
produce native storage errors instead of becoming absent values.

Image deletion carries optional Docker-reference removal in Component's durable
delete options. Teardown drains the build, releases generation tags and removes
the selected reference before completing deletion. A cleanup error remains a
native lifecycle failure. Committed run settlement and workflow delivery do not
notify retention. The retention worker owns job orchestration;
its store bounds SQL pages and seeks the next unexpired row for its deadline.

Images are registered `unprepared`. The image lifecycle publishes preparing
state; a refused enqueue leaves the registered image unprepared and returns its
identity with the build error, without a compensating component write.

Image component teardown ignores `options.remove_ref`. With `options.remove=true`, it drains the component's build and removes only the reference in its own approved recipe; a component without an approved build removes no caller-selected reference. Generation-tag retirement remains scoped to the component ID. Teardown drains the worker, retires tags and removes the approved image before deleting its build row, retaining recovery information across either cleanup or final database failure.

### SPEC: MCP error semantics

MCP tools return both native and domain failures as tool errors. Native errors retain kind, message, retryability and details in `structuredContent.error`; domain failures retain their complete structured result. Both text and structured forms redact credentials.

### SPEC: Automatic workspace provenance upgrade

Upgrade uses current Component WRITE/ADMIN grants and directory memberships, never owner metadata or context revision as writer evidence. Every current writer must have workspace-management authority. A member who changed a workspace and later lost WRITE is not detected. Refused workspaces require normal re-registration with updated saved references; automatically admitted queued runs continue with no action. Concurrent operator changes during upgrade are a known administrative race.

### SPEC: Gateway discovery

Explicit gateway tools and wildcard expansion use the actor-visible normalized `kickside.agents:tools` public catalog. Exact tools supplied by a trait remain capability members; live dispatch still checks `funcs.call`.

### SPEC: Supported batch traits

The batch gateway supports static trait prompts and member tools with static per-tool context. It visibly refuses hook functions, runtime behaviours, bindings/wrappers, agent/options overrides, root trait context, configured traits and per-tool alias/description overrides.

### SPEC: Native error boundaries

Native preparation/stream failures retain kind, retryability and details through durable pending outcomes, task reads, job output and Flow resumes. The private error TEXT stores a tagged `autocode.error/v1` envelope for native failures; old plain messages remain readable and public `error` remains a string. Image projection/job failures wrap their native cause. Gateway HTTP keeps its existing message/code and adds redacted native fields.

### SPEC: Cancellation signals

Cancellation commits its durable run flag and demand for the existing Jobs slot in one transaction, then nudges the pool and sends a platform event to the attached runner. An unattached or approval-parked job wakes and settles as cancelled, enqueues its Flow resume, and releases the active-run workspace deletion fence. A failed pool nudge is logged after commit and leaves durable demand for reconciliation. Cancellation is checked before preparation and recovery as well as before parking. A concurrent operator cancellation/parking transition is a known race handled by Jobs slot demand; no polling process is added. The runner subscribes before one catch-up read, blocks on signals, and closes the subscription when streaming ends; idle runs issue no periodic cancellation reads. Pre-create, pre-start and final reads retain cancellation fencing. Docker stop and cleanup remain deadline-bounded.

### SPEC: Block authorization

The Block arm calls `kickside.blocks:authorize_arm` for the caller and pending parked signal before submission. Blocks/Dataflow owns Flow identity and park-state reads; Autocode imports no foreign persistence for admission.

### SPEC: Image render state

Image lifecycle writes one complete public render snapshot: status, approved-generation usability, agents, last error and native error data. Requests publish preparation, workers publish terminal state, and migration 07 fills snapshots for existing installs. Image lists consume only component metadata; private build rows serve execution and build-log detail. Only revision-checked ready publication admits a candidate generation; upgrade snapshots expose an already approved generation.

### SPEC: Profiles reconciliation

Profiles tracks profile and account/image/workspace component topics, subscribes before its catch-up snapshot, refetches on changes and host reveal, and releases subscriptions on unmount. Loading, failed reads with Retry, empty lists and unmatched searches have visible states.

### SPEC: Bounded discovery

Discovery list tools return at most 100 rows (25 by default), with `next_offset` for continuation. Component discovery reads one bounded candidate page, so filtered pages can be empty and still have a continuation. Profile discovery returns public summaries; `ReadCodingProfile`/`get_profile` reads selected full configuration. Older service calls omitting limit retain their complete DTO/list shape.

### SPEC: Committed delivery failures

Committed submissions keep their run ID and expose native realtime failures as `notification_error`. MCP tool results keep action acceptance and report delivery failures in `_meta.notification_error`; hooks return `notification_error`. Post-tool activity-write failures use `_meta.activity_error`. These fields describe delivery, not a reason to repeat an executed action. Worker nudges retain the platform-owned durable reconciliation path.

### SPEC: User ownership vocabulary

Module-owned user ownership is named `owner_user_id` in DTOs, readers, helpers and UI code. Published `owner`/`owner_id` fields remain compatibility aliases. The existing private SQL `owner_id` columns are decoded at that boundary, preserving released data without a schema rename. Platform `meta.owner`, ownership locators and execution identity fields retain their platform contracts.

### SPEC: Host deadlines and optional tool provider

Host command timeout classification requires a fresh private marker emitted only when the host wrapper's own deadline fires. Host command and container exit statuses 124 and 137 alone remain ordinary command failures; only host deadline evidence produces a timeout classification. The optional gateway uses the host-installed Agents tools contract; its transitive host bindings are not unconditional Autocode installation requirements.

## Frontend dialog deviation

`AppDialog` deliberately uses native `<dialog>.showModal()` inside the web component shadow root. The browser top layer supplies modality and focus containment while styles and dialog content remain in the component root; this avoids a PrimeVue overlay teleported outside the themed shadow tree. Escape/backdrop/close actions respect busy state, the dialog has an accessible name, and unmount closes it. This is the documented native-dialog deviation from the handbook/FE preference for a shadow-contained PrimeVue Dialog.

### SPEC: Bounded run history and delivery

`run_event_count` (default **4096**, range 4–100000) and `run_event_bytes` (default **8388608 / 8 MiB**, range 1024–1073741824) bound each run's stored events. Bytes count UTF-8 text plus event kinds; fixed row/index overhead is bounded by the count. These defaults retain a useful sample of an hour of streaming output. Every event writer uses the same serialized persistence boundary. Each incoming persisted event occupies at most a quarter of the byte budget (and at most 8192 text/kind bytes); UTF-8 characters are never split by this clipping. On overflow the log retains its first event, one permanent system truncation notice, and a rolling tail, releasing roughly an eighth of the budget per rollover. The notice gets a fresh sequence before the triggering event so current pollers see it. Surviving sequences remain stable and increase; gaps represent discarded history. Forward and backward paging continue by sequence. Reducing settings applies on the next append, including clipping the retained head to fit. Stored result, error, usage, settlement and workflow payloads are independent of event trimming and retain their existing limits.

`workflow_delivery_timeout` (default **24h**, positive duration) bounds retries from `finished_at`. A worker at or beyond that deadline records expiry and completes without another Flow resume call. The existing `workflow_delivered` integer records **0 pending, 1 delivered, 2 expired**. Delivered or expired work is idempotent; a later acknowledgement cannot change expiry into delivery. Failed attempts within the window retain their native errors and retry through the existing Jobs slot. Both delivered and expired runs age from their original settlement time under `run_retention`; expiry preserves the complete run result and usage. No write-path retention notification is added. Known: a resume call already in flight when the window closes may complete under its existing Jobs execution deadline.

Retention visits at most 500 candidates per callback, ordered by `(finished_at, id)`. A durable keyset on the existing admission singleton advances past active run or resume jobs, so a full blocked page cannot hide later eligible runs. Full pages continue even when nothing is deleted; reaching the end resets the cursor and parks, preventing an endless blocked-page continuation. Partial child/history cleanup retains the position before that candidate until its bounded pages drain. A run skipped while active, or inserted before the current cursor, is reconsidered on the next scan. The next age deadline still comes from one indexed seek among unexpired eligible rows. Migration 09 initializes event accounting from populated logs without discarding released history, adds the singleton cursor, and replaces the partial retention index to include expired delivery. Existing over-budget logs are bounded on their next append or age out through normal retention.
