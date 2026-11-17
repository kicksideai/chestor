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

## Agent traits

`chestor.autocode.traits:coding_tasks` provides resource discovery, owned-run
listing, asynchronous submission, owned-run reads/cancellation and image detail
with the latest build log. `ListCodingRuns` pages newest-first with `next_cursor`;
`ReadCodingRun` pages events with `next_seq`/`more`. Image recipes are visible only
to callers with WRITE access.

`chestor.autocode.traits:coding_admin` provides the same resource discovery plus
account add/update/remove, profile add/update/remove (duplicate by reading then
adding), image create/update/prepare/delete, workspace create/delete, and Docker
image/cache prune. These are typed adapters over the same contracts and services
used by HTTP. Pair with `coding_tasks` when task execution is also needed.

Both traits require the exact `chestor.autocode.security:tool_access` grants and
module access. Account/profile mutations retain their existing resource checks.
Image/workspace mutations and prune additionally require the corresponding
existing management endpoint permission; selecting the trait grants no management
authority. Image preparation remains asynchronous and may return `build_error`
after saving the image. Deletion returns the existing pending/completed result.
Workspace deletion removes registration only. Prune uses configured cache retention
and affects shared Docker layers/cache; its tool description states that scope.
Sharing/ACL changes and Settings remain platform capabilities.

Tool inputs describe discovery IDs, scratch versus registered workspaces, profile
overrides, timeout durations, driver option discovery, trait context and paging.
Generated profile/endpoint/tool-surface descriptions come from the shared wire
schemas. An unknown agent error names the selection and points to `ListCodingAgents`.

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
omitted or empty uses the remote default branch. The global `clone_depth` setting defaults to 50; zero requests full history. A scratch clone requires a repository URL. A registered checkout uses its existing repository;
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
It exposes eleven tools. `ListCodingProfiles` and `ReadCodingProfile` use `chestor.autocode:profiles`;
eight tools use `chestor.autocode:tasks`, and `ReadCodingImage` uses the existing
image read service:

- **`SubmitCodingTask`**: Registry entry: `chestor.autocode.traits:submit_coding_task`; Contract method: `submit_task`
- **`ReadCodingRun`**: Registry entry: `chestor.autocode.traits:read_coding_run`; Contract method: `get_run`
- **`ListCodingAgents`**: Registry entry: `chestor.autocode.traits:list_coding_agents`; Contract method: `list_agents`
- **`ListCodingAccounts`**: Registry entry: `chestor.autocode.traits:list_coding_accounts`; Contract method: `list_accounts`
- **`ListCodingImages`**: Registry entry: `chestor.autocode.traits:list_coding_images`; Contract method: `list_images`
- **`ListCodingWorkspaces`**: Registry entry: `chestor.autocode.traits:list_coding_workspaces`; Contract method: `list_workspaces`
- **`ReadCodingProfile`**: Registry entry: `chestor.autocode.traits:read_coding_profile`; Contract method: `get_profile`
- **`ListCodingProfiles`**: Registry entry: `chestor.autocode.traits:list_coding_profiles`; Contract method: `list_profiles`
- **`ListCodingRuns`**: Registry entry: `chestor.autocode.traits:list_coding_runs`; Contract method: `list_runs`
- **`ReadCodingImage`**: Registry entry: `chestor.autocode.traits:read_coding_image`; Image service: `images.get`
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
Directory probes verify each path component without traversing symlinks and reject mount aliases. The approved directory is mounted at `/workspace`, with recursive bind mounts disabled. Ordinary volume mountpoints are valid. Docker parses image `extra_args`; Autocode verifies resulting isolation under the [settings limits and Docker warnings contract](docker-options.md#settings-limits-and-docker-warnings). Every main and image-probe container is created, inspected by returned ID and checked against the [effective isolation properties](docker-options.md) before it starts. Mismatched containers are removed and the error names the property. Effective namespace, privilege, mount, runtime and host-device authority must match module-selected settings, including every pinned Docker default protected path. Every create explicitly requests private cgroup namespaces. Network references resolve to their ID/name identity for both inspected representations. The container name and image must also preserve module ownership. File-backed Docker client options are administrator responsibility: their executor-readable inputs must remain outside all workspaces and container mounts, including aliases. Docker consumes these files before creation and does not expose their source paths in inspect output. Relative paths retain executor-working-directory semantics. Harmless flag-looking values reach Docker unchanged.

## Pending platform boundaries

The arm delegates current Flow and pending-signal authorization to the public `kickside.blocks:authorize_arm` API. Autocode result delivery passes the constant `arm_id = "chestor.autocode.blocks:arm_task"` to Blocks resume and holds invocation authority only for that arm. Correct parked-arm provenance depends on the in-progress platform Blocks enforcement of `arm_id` against the committed parked declaration; the current platform ignores it. Component kind-level CREATE/UPDATE authorization remains desirable upstream, but forged workspace components no longer grant host access: Autocode requires its own admission row.

## SPEC: profiles, option precedence, usage and limits

`chestor.autocode:profiles` exposes `list_profiles`, `add_profile`,
`get_profile`, `update_profile`, and `remove_profile`. Profiles are standalone owned components:
READ permits listing and selection, WRITE permits editing, and DELETE permits
removal. HTTP uses GET/POST `/autocode/profiles` and PUT/DELETE
`/autocode/profiles/{id}`. Discovery uses bounded `ListCodingProfiles` summary pages and `ReadCodingProfile` reads one complete profile. Unpaged service callers receive full profile lists.
The member page supports creating, editing and duplicating profiles. Loading
finishes before an empty state appears; save failures appear inside the active
profile dialog. Task and profile option fields display the same catalog, unattended
and inherited defaults that execution uses, without submitting them as overrides.

Profiles, new tasks and the task Block share a trait editor. The platform
`wc-agent-trait-picker` lists actor-visible traits with titles and descriptions;
its per-trait configuration is adapted to the batch `tools.traits` and flat
`tools.context` shape. Traits without a custom panel use `wc-schema-form` for
all declared context fields, preserving declared pickers and using the component
picker for `board_id` and `catalog_id`. Shared context fields have one value.
Editing or duplicating preserves the surface; removing a trait removes context
fields no remaining selected trait declares. Clearing all traits explicitly
overrides a profile's surface with an empty surface. No individual tool selector
is provided.

POST `/autocode/tool-surface` takes `{agent, tools}` and resolves the surface
under the authenticated caller using the submission field schemas and the same
gateway resolver as admission. It returns `{count, limit}` with the complete
deduplicated count and Bee's bound, without storing or accepting a run. Native
refusals retain their kind, code, retryability and details, including count/limit
for `autocode.tool_limit_exceeded`. Forms display these refusals and do not
submit unresolved or refused surfaces; Block drafts remain local until valid.
Admission still resolves and authorizes the surface again on submission.

A profile contains `title`, `agent`, `image_id`, optional `account_id` or
`account_pool`, optional `endpoint {protocol, base_url, model}`, `workspace_id`,
`repo_url`, `repo_ref`, `run_timeout`, `unattended`, and catalog-validated
`options`, plus optional `tools {traits, context}`. An empty account selection balances across the harness's usable
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

The shared task/profile/Block option editor shows basic controls before technical
options and keeps every declared batch option available through its filter.
Clearing a string or ID-list field is an explicit empty override, validated by
the driver's schema; for Pi, `options.tools: ""` disables all built-in tools.
Use **Use default** to remove an override and inherit the profile or driver
default. JSON fields accept explicit empty collections (`[]` or `{}`) when their
schema permits them. Clearing a numeric or JSON draft removes that override.
Task cancellation requires host confirmation identifying the task; stopping
execution keeps its history. Queued tasks say **Waiting to start…**, and running
tasks say **Working…**. Aggregate and model usage display the reported decimal
amount and currency when both are present, otherwise the reported USD amount;
the UI does not convert, estimate or sum costs.

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

Driver text observations are folded per segment: `append` adds a delta;
`replace` and `complete` replace the retained text with their full snapshot.
A completion supersedes its streamed deltas in the result and in held log text,
including reasoning text. A non-text observation flushes the text held so far.
Each segment/channel tracks its logged byte count: later appended text emits a
new row containing only the unlogged suffix. Equal or shorter prefix snapshots
add no row; an extending snapshot logs only its extension. A snapshot diverging
from the retained logged prefix updates the result while leaving the log unchanged.
Snapshots split into `replace` plus `append` pieces obey the same rule. Logged
byte counts survive text-buffer eviction without retaining per-run text copies;
segment buffers retain their existing count and byte bounds. Distinct segments
with identical text remain separate events. The locked `bee/drivers` 0.1.25 codec emits a small
completion as `complete`, and a chunked completion as `replace` followed by
`append` pieces on the same segment, with or without preceding deltas.
A distinct snapshot of that segment supersedes the previous snapshot; replacing
an already selected answer updates that answer through every continuation piece.
Redaction and byte limits apply to the resulting segment text.
Observation event keys are opaque identities, not snapshot-boundary markers.
Codecs emitting consecutive `complete` pieces for a single snapshot must fix
their chunk operations upstream; Autocode cannot infer their boundaries from
the text data contract.
Known: the locked codec's chunked completions omit a completion marker. A large
answer on a new segment can therefore leave an older completed answer selected
when the terminal carries no answer. The codec must preserve the initial
`complete` and emit its continuation pieces as `append`.

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

Registration records actor, timestamp and observed revision in the immutable admission row.

Workspace and image kinds declare `meta.mutation: closed`. On Component 0.3.17 and newer, direct contract creation and public context, metadata or placement writes require exact-kind `component.kind.create`/`component.kind.update` authority. Autocode attaches those grants only to its workspace registration, image creation/update/preparation and revision-checked image-ready function entries; no member or management group receives them. Object access and module management admission still apply. Older Component versions ignore the field; direct mutation protection requires the newer platform.

Admission reports `autocode.workspace_approval_required` for readable workspaces without an admission row. Workspaces must be registered through Autocode; there is no in-place approval action or endpoint. Interrupted running jobs settle through recovery without relaunching; terminal runs remain terminal.

Docker resolves the administrator-owned host client configuration and endpoints, including `DOCKER_HOST=unix://`, named contexts and explicit endpoints. Its configuration, socket, CLI plugins, credential helpers and executable search paths, including resolved targets, must remain outside every workspace root and every container-mounted directory because members can write their workspaces. Container values, including `DOCKER_*`, HOME and PATH, reach only the inherited env-file descriptor and never become Docker client environment variables.

Every run Docker call carries the job's absolute deadline; maintenance originates one five-minute deadline. Rejected-container removal has an independent 30-second deadline. Main run and both image-probe containers use the [settings limits and Docker warnings contract](docker-options.md#settings-limits-and-docker-warnings). Both probes use create/inspect/start and carry the image operation deadline. Image builds retain their existing controls. Directory probes have a 30-second deadline and two-second kill grace. Only the wrapper's private deadline marker classifies a host timeout; literal exits 124/137 remain command failures. Member validators hold only fixed directory-probe authority; observation hooks cannot reconstruct owners or dispatch tools.

Known: concurrent host-operator replacement of workspace or Docker client paths and operator changes to retention timestamps require operator coordination.

## SPEC: run driver gateway

Profiles and tasks accept `tools: { traits: [agent.trait IDs],
context: { ... } }`. Task fields override the corresponding profile surface
fields; context keys merge with task values taking precedence. The workflow
can supply board or ticket context through this task field independently of
the reusable profile. Submission freezes the declaration; preparation resolves
trait tools, build contributions and their schemas under the
owner. Static and contributed prompts become driver instructions. MCP names use the framework's snake-case normalization with non-letter characters replaced by underscores,
so every driver receives plain lowercase identifiers. Alias collisions are refused.
A batch profile without a declared MCP client transport refuses a surface.
An empty resolved tool list launches without a gateway. Independent tool selection
is refused; there is no compatibility path for saved declarations. Admission refuses
a deduplicated surface above the installed Bee driver configuration's
`MAX_GATEWAY_TOOLS` bound with a non-retryable
`INVALID` error, code `autocode.tool_limit_exceeded`, and `count`/`limit` details.
Static tools and build contributions count together; no members are truncated.
The administration and task traits share discovery tools: their deduplicated union
is 24 tools, subject to the same driver bound when combined with other traits.

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
replace an account’s last-error snapshot; this is a known cross-run race.

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

### SPEC: Gateway discovery

Trait wildcard expansion uses the actor-visible normalized `kickside.agents:tools` public catalog. Exact tools supplied by a trait remain capability members; live dispatch still checks `funcs.call`.

### SPEC: Supported batch traits

The batch gateway loads normalized Wippy traits and validates the declaration's
flat `tools.context` with the platform capability context validator against each
trait's `meta.context_schema`. Each trait receives only keys named in its schema's
`properties`, even when the schema allows additional properties. A key declared by
several selected traits reaches each of them and must satisfy each schema. A key
accepted by no selected trait is refused, including when no traits are selected.
Traits without a context schema receive no declaration keys. Configuration UI
metadata does not affect batch execution.
A trait's `build_func_id` runs with the caller's actor and scope using Wippy's
`(trait_prompt, context)` contract and the same attached function context. Trait
defaults merge with that trait's selected declaration context for the build;
`agent_id` identifies the selected harness. Static and contributed tools pass through the same actor-visible
catalog checks: wildcard expansion uses public discovery, while exact capability
members may include actor-visible non-public tools. Build errors remain visible.

Builds may contribute prompt text, tools and context. Tool context merges in Wippy
order: trait defaults/build contribution, selected declaration keys, then per-tool
context. Tools retain their explicit call arguments alongside context defaults. Tool
aliases and descriptions, and build-contributed input schemas, may override catalog
presentation; the registered tool must still be visible. Transport identity fields remain reserved.

Per-turn prompt/step hooks require the internal agent's messages and session state.
Behaviours, bindings and wrappers require its execution/checkpoint pipeline.
Delegates require its router, and internal model/session options cannot configure
an external driver. These features are refused with an explanation of the missing
execution behavior, including delegates/options returned by builds.

### SPEC: Native error boundaries

Native preparation/stream failures retain kind, retryability and details through durable pending outcomes, task reads, job output and Flow resumes. The private error TEXT stores a tagged `autocode.error/v1` envelope for native failures; old plain messages remain readable and public `error` remains a string. Image projection/job failures wrap their native cause. Gateway HTTP keeps its existing message/code and adds redacted native fields.

### SPEC: Cancellation signals

Cancellation commits its durable run flag and demand for the existing Jobs slot in one transaction, then nudges the pool and sends a platform event to the attached runner. An unattached job wakes and settles as cancelled, enqueues its Flow resume, and releases the active-run workspace deletion fence. A failed pool nudge is logged after commit and leaves durable demand for reconciliation. Cancellation is checked before preparation and recovery as well as before parking. A concurrent operator cancellation/parking transition is a known race handled by Jobs slot demand; no polling process is added. The runner subscribes before one catch-up read, blocks on signals, and closes the subscription when streaming ends; idle runs issue no periodic cancellation reads. Pre-create, pre-start and final reads retain cancellation fencing. Docker stop and cleanup remain deadline-bounded.

### SPEC: Block authorization

The Block arm calls `kickside.blocks:authorize_arm` for the caller and pending parked signal before submission. Blocks/Dataflow owns Flow identity and park-state reads; Autocode imports no foreign persistence for admission.

### SPEC: Image render state

Image lifecycle writes one complete public render snapshot: status, approved-generation usability, agents, last error and native error data. Requests publish preparation and workers publish terminal state. Image lists consume only component metadata; private build rows serve execution and build-log detail. Only revision-checked ready publication admits a candidate generation.

### SPEC: Profiles reconciliation

Profiles tracks profile and account/image/workspace component topics, subscribes before its catch-up snapshot, refetches on changes and host reveal, and releases subscriptions on unmount. Loading, failed reads with Retry, empty lists and unmatched searches have visible states.

### SPEC: Bounded discovery

Discovery list tools return at most 100 rows (25 by default), with `next_offset` for continuation. Component discovery reads one bounded candidate page, so filtered pages can be empty and still have a continuation. Profile discovery returns public summaries; `ReadCodingProfile`/`get_profile` reads selected full configuration. Older service calls omitting limit retain their complete DTO/list shape.

### SPEC: Committed delivery failures

Committed submissions keep their run ID and expose native realtime failures as `notification_error`. MCP tool results keep action acceptance and report delivery failures in `_meta.notification_error`; hooks return `notification_error`. Post-tool activity-write failures use `_meta.activity_error`. These fields describe delivery, not a reason to repeat an executed action. Worker nudges retain the platform-owned durable reconciliation path.

### SPEC: User ownership vocabulary

Module-owned user ownership is named `owner_user_id` in DTOs, readers, helpers and UI code. Published `owner`/`owner_id` fields are aliases. Private SQL `owner_id` columns are decoded at that boundary. Platform `meta.owner`, ownership locators and execution identity fields retain their platform contracts.

### SPEC: Host deadlines and optional tool provider

Host command timeout classification requires a fresh private marker emitted only when the host wrapper's own deadline fires. Host command and container exit statuses 124 and 137 alone remain ordinary command failures; only host deadline evidence produces a timeout classification. The optional gateway uses the host-installed Agents tools contract; its transitive host bindings are not unconditional Autocode installation requirements.

## Frontend dialog deviation

`AppDialog` deliberately uses native `<dialog>.showModal()` inside the web component shadow root. The browser top layer supplies modality and focus containment while styles and dialog content remain in the component root; this avoids a PrimeVue overlay teleported outside the themed shadow tree. Escape/backdrop/close actions respect busy state, the dialog has an accessible name, and unmount closes it. This is the documented native-dialog deviation from the handbook/FE preference for a shadow-contained PrimeVue Dialog.

### SPEC: Bounded run history and delivery

`run_event_count` (default **4096**, range 4–100000) and `run_event_bytes` (default **8388608 / 8 MiB**, range 1024–1073741824) bound each run's stored events. Bytes count UTF-8 text plus event kinds; fixed row/index overhead is bounded by the count. These defaults retain a useful sample of an hour of streaming output. Every event writer uses the same serialized persistence boundary. Each incoming persisted event occupies at most a quarter of the byte budget (and at most `event_text_bytes + 192` text/kind bytes, leaving room for the truncation notice); UTF-8 characters are never split by this clipping. On overflow the log retains its first event, one permanent system truncation notice, and a rolling tail, releasing roughly an eighth of the budget per rollover. The notice gets a fresh sequence before the triggering event so current pollers see it. Surviving sequences remain stable and increase; gaps represent discarded history. Forward and backward paging continue by sequence. Reducing settings applies on the next append, including clipping the retained head to fit. Stored result, error, usage, settlement and workflow payloads are independent of event trimming and retain their existing limits.

`workflow_delivery_timeout` (default **24h**, positive duration) bounds retries from `finished_at`. A worker at or beyond that deadline records expiry and completes without another Flow resume call. The existing `workflow_delivered` integer records **0 pending, 1 delivered, 2 expired**. Delivered or expired work is idempotent; a later acknowledgement cannot change expiry into delivery. Failed attempts within the window retain their native errors and retry through the existing Jobs slot. Both delivered and expired runs age from their original settlement time under `run_retention`; expiry preserves the complete run result and usage. No write-path retention notification is added. Known: a resume call already in flight when the window closes may complete under its existing Jobs execution deadline.

Retention visits at most 500 candidates per callback, ordered by `(finished_at, id)`. A durable keyset on the existing admission singleton advances past active run or resume jobs, so a full blocked page cannot hide later eligible runs. Full pages continue even when nothing is deleted; reaching the end resets the cursor and parks, preventing an endless blocked-page continuation. Partial child/history cleanup retains the position before that candidate until its bounded pages drain. A run skipped while active, or inserted before the current cursor, is reconsidered on the next scan. The next age deadline still comes from one indexed seek among unexpired eligible rows.


### SPEC: Pending admission and queue expiry

Admission counts **queued and running** runs under the existing admission transaction lock before reserving an account, writing a submission or creating a Jobs slot. `pending_runs_per_owner` defaults to **128** (range 1–100000); `pending_runs_global` defaults to **4096** (range 1–1000000). Exceeding either budget returns Conflict with `autocode.pending_budget_exceeded`, the budget name and its limit. A matching keyed replay reuses the accepted run even at capacity. Settlement releases capacity. Lowering a limit refuses further submissions until usage falls below it; existing runs remain admitted. Partial active-run indexes support both counts and workspace deletion's locked check.

`queue_timeout` defaults to **24h** and must be a positive duration. It ages from `created_at`, independently of execution timeout. Before preparation, a worker refuses an overdue queued run with the recorded nonretryable `autocode.queue_expired` outcome. Admission wakes Core through its supported retention notifier after commit, so Core reads the next queue deadline and arms its timer even when Jobs is unavailable. Notification failure is logged and does not fail committed admission; Core's boot recovery reads durable queues when its service restarts.

The existing retention callback examines up to 500 overdue queued runs with no cleanup obligation. A durable `dispatch_state` starts as `waiting`. The runner atomically claims `creating` before Docker creation; expiry atomically claims `expiring` before purging the inactive Jobs slot through Jobs' lease fence. Only one claim can win, including when an expiry selection is stale. `started_at` is not evidence that no container exists. Runs marked `creating`, including crashes before recording an outcome and cancelled creates whose removal failed, remain with runner recovery. Recovery removes the deterministic container name before applying the saved outcome, or records interruption if no outcome exists, without relaunching execution. Pending outcomes are excluded from expiry.

Workflow runs retain their ordinary resume/delivery path. An interrupted expiry remains eligible in state `expiring`; bounded Jobs history cleanup requests continuation until the slot drains. A running Jobs lease defers expiry to worker settlement or lease release. A page held entirely by leases parks until activity wakes retention. After purge, expiry preserves an outcome recorded by a worker that observed its claim before releasing the lease. Concurrent operator cancellation at expiry remains a known race.

Recovery checks the deterministic container name through the existing Docker inspection path. A present container is removed before applying a saved outcome or recording interruption, without relaunching execution. A queued run with no recorded start or outcome returns to `waiting` only after Docker confirms absence, then parks without preparation or launch. Core's existing retention notifier recomputes its queue deadline; cancellation and expiry apply normally. A failed inspection retains recovery ownership and remains a job failure. Recorded starts, running rows and saved outcomes retain cleanup/settlement recovery even if the container is absent.

Expiry creates no table or worker. The admission notification and the next indexed unexpired queue deadline drive Core's existing callback. Settled runs then age from `finished_at` under `run_retention`, including submissions, events and Jobs history.

### SPEC: Configurable text and checkout limits

All settings below are global, editable on the existing Autocode Settings page and validated on writes and reads. No consumer UI form is added.

- `result_bytes`: default **1048576**, inclusive range **1024–67108864**. UTF-8 bytes in the retained result head.
- `event_text_bytes`: default **8000**, inclusive range **256–1048576**. UTF-8 bytes in each emitted event text head.
- `build_log_bytes`: default **65536**, inclusive range **1024–16777216**. UTF-8 bytes in the rolling image build log.
- `clone_depth`: default **50**, inclusive range **0–1000000**. Git clone depth; zero omits `--depth` for full history.

Result and event heads append a byte-count truncation notice when needed; stored events also obey `run_event_bytes`. Raising an individual event limit may require raising that total budget. Reader folders snapshot result and event limits when streaming starts; builds snapshot their log limit before execution, and clone depth is read while preparing the container script. Credential redaction still precedes clipping. The shared UTF-8 clipping helper preserves character boundaries in reader buffers, results, events, image logs and persisted event copies, counting all discarded bytes. Build logs retain a rolling tail of lines and clip an oversized line's head. These controls do not enlarge driver-owned frame limits.
