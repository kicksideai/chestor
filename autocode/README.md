<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# chestor/autocode

Run coding agent CLIs in Docker with shared agent accounts, prepared images,
host workspaces, durable jobs, and streamed output. Includes a member page,
a System management tab, a driver account card, a workflow task Block, and
an agent capability with discovery, asynchronous submission, reading, and cancellation tools.

Sharing an account shares its credential with grantees, including subscription logins.

This module installs independently into a [KickSide](https://kickside.ai) host.

## Quick start

In **System → Modules**, select the package from the Wippy Hub and review its
requirements. For CLI dependency setup, run from the host application directory:

```sh
wippy add chestor/autocode
wippy install
```

Apply host bindings and migrations through the application install plan.
Administrators prepare images and register workspaces; members add accounts
and start tasks. Account grants allow grantees to run with the stored credential,
including subscription logins. Use official API keys or your own endpoints for
production or multiple users.

## Requirements

Wippy v0.3.59a or newer; validation uses v0.3.60a. The host needs Docker and an `exec.native`
entry whose `default_env.PATH` contains the Docker CLI. Frontend development uses Node.js 22, npm, and Make.

- **`chestor.autocode:target_db`**: SQL database shared with `kickside/jobs`, so rows and jobs commit together.
- **`chestor.autocode:api_router`**: Authenticated HTTP router.
- **`chestor.autocode:ui_server`**: HTTP server for the built UI.
- **`chestor.autocode:settings_path`**: Actual mounted settings-tab URL; empty hides the link.
- **`chestor.autocode:docker_executor`**: Host `exec.native` entry that runs the Docker CLI.
- **`chestor.autocode:docker_context`**: Docker CLI context; empty uses the executor default.
- **`chestor.autocode:workspace_roots`**: Comma-separated absolute directories allowed for workspace mounts; empty admits none.
- **`chestor.autocode.security:user_security_scope`**: Defaults to `kickside.security.groups:members`.
- **`chestor.autocode.security:module_management`**: Assign the management capability to the groups that manage images, workspaces, and Docker maintenance.

The module depends on `bee/drivers`, `kickside/component`, `kickside/contract`,
`kickside/jobs`, `kickside/execution`, `kickside/settings`, `kickside/blocks`,
and `wippy/migration`. Bind `bee.drivers:activation` to
`chestor.autocode.drivers:activation`. Bind `bee.drivers:host_environment` and
`bee.drivers:entered_values` to host-owned environment storages, and bind
`bee.drivers:access_scope` to the intended member scope. The package declares
no storage file paths. Account credentials are delivered per run;
the host process environment is excluded. The test harness owns separate
storages for these bindings.

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
deletion completes. A Docker removal failure remains a native lifecycle failure.

## Development

From this module directory:

```sh
make lockrefresh
make ui-kit
make build
make typecheck
make lint
make lint WIPPY_LINT_ARGS=--strict-any
make test
make test-pg
```

`test-pg` creates and drops a dedicated PostgreSQL database. Set `PG_URL` for
the maintenance connection and `RUNTIME_ARGS` for harness profile variables
when using a different server. The default test server is local PostgreSQL
on port 5433. Both engines run the same suites.

Edit frontend source under `ui/` and commit regenerated `static/` assets.
`build-inputs/` resolves the published `kickside/ui-kit` package; `make ui-kit`
materializes its npm artifact into the UI's ignored workspace directory.
No copy of the UI kit is vendored. Release Please creates version tags and GitHub
releases through `.github/workflows/release.yml`. CI checks the Hub package with
`wippy publish --dry-run`; it does not publish to the Hub. Like the sibling
journal, workspace and graph modules, Autocode has no automated Hub publication.
After `make release-check`, an authenticated maintainer publishes manually from
`autocode/` using the released version:

```sh
wippy publish --version "<released-version>" --create --module-visibility public --module-type plugin --embed chestor.autocode:ui_fs
```

`make publish` builds the bundle and points to this manual step.

## Links

- [KickSide](https://kickside.ai)
- [Module authoring](https://github.com/kicksideai/docs/blob/main/building-modules/index.md)
- [Wippy documentation](https://wippy.ai)

## License

[KickSide Community License 1.0](LICENSE). Dependencies retain their own licenses.

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
`repo_ref` is available there with worktree isolation. Shared checkouts keep their current ref.

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
It exposes eight tools. `ListCodingProfiles` uses `chestor.autocode:profiles`;
the other seven use `chestor.autocode:tasks`:

- **`SubmitCodingTask`**: Registry entry: `chestor.autocode.traits:submit_coding_task`; Contract method: `submit_task`
- **`ReadCodingRun`**: Registry entry: `chestor.autocode.traits:read_coding_run`; Contract method: `get_run`
- **`ListCodingAgents`**: Registry entry: `chestor.autocode.traits:list_coding_agents`; Contract method: `list_agents`
- **`ListCodingAccounts`**: Registry entry: `chestor.autocode.traits:list_coding_accounts`; Contract method: `list_accounts`
- **`ListCodingImages`**: Registry entry: `chestor.autocode.traits:list_coding_images`; Contract method: `list_images`
- **`ListCodingWorkspaces`**: Registry entry: `chestor.autocode.traits:list_coding_workspaces`; Contract method: `list_workspaces`
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
`docker_context`. Its environment and selected Docker
context determine the daemon; workspace paths name directories on that daemon's
host, which may differ from the API host. Image `extra_args` controls host
aliases, for example `["--add-host", "host.docker.internal:host-gateway"]` on a
compatible local Docker daemon. The runner adds no host alias implicitly.

The executor bound to `docker_executor` must expose the Docker daemon's filesystem;
for a remote daemon, bind the executor on that daemon's host. Registration and
launch verify that the workspace is an existing directory within a configured root.
Every path component is checked without following symbolic links, including
the worktree destination at planning, creation and cleanup. Lexical siblings
and all symbolic-link components are refused. Replacing a directory after verification
and before Docker mounts it is a known operator race.

## Pending platform boundaries

Component kind-level CREATE/UPDATE authorization and trusted parked-arm
dispatch remain platform requirements. Module
HTTP permissions do not close those platform gaps. The task service keeps callback handling in `service/tasks.lua`, account
credentials in `components/resources.lua` and `service/owner.lua`, and all kind
writes through the component service so each platform correction has one seam.

## SPEC: profiles, option precedence, usage and limits

`chestor.autocode:profiles` exposes `list_profiles`, `add_profile`,
`update_profile`, and `remove_profile`. Profiles are standalone owned components:
READ permits listing and selection, WRITE permits editing, and DELETE permits
removal. HTTP uses GET/POST `/autocode/profiles` and PUT/DELETE
`/autocode/profiles/{id}`. The read tool is `ListCodingProfiles`.
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


## SPEC: workspace isolation

Workspace registration, profiles and tasks accept `isolation: shared | worktree`.
An explicit task value overrides its profile; an absent profile value inherits
its workspace. The default is `shared`, which mounts the original checkout. Submission freezes the effective mode and the run page displays it. Idempotent
request identity includes both isolation and the declared tool surface/context.
`worktree` requires WRITE on a registered repository root with a committed HEAD;
non-git directories, unborn repositories, and subdirectories of a repository
are refused at registration or submission with a message identifying the required
repository root or committed HEAD, including when no enclosing repository exists.
`repo_ref` selects the starting
branch or tag for an isolated checkout; absence selects HEAD at execution.
Shared registered checkouts cannot select `repo_ref`. Missing or inaccessible
workspace directories answer `autocode.invalid_workspace`; unresolved refs answer
`autocode.invalid_repo_ref`. Host command deadlines retain the TIMEOUT kind.

Each isolated run starts detached in `<repository>/.autocode-runs/<run-id>`.
Only this tree is mounted writable at `/workspace`. Git's common metadata and
the worktree `.git` pointer are mounted read-only; container writes cannot alter
host hooks, configuration, indexes or refs. Other run trees lie outside the mount.
The host captures changed source files through its own index and explicit trusted
Git directory, with hooks, fsmonitor and clean/process filters disabled. It preserves that snapshot on
`autocode/<run-id>`; container Git staging, commits and branch writes are refused. Paths contain only public run IDs.
The host executor and Docker daemon must see the same filesystem, and images
must have Git. The repository and common metadata must lie inside admitted
workspace roots. Runs carry a durable cleanup intent before creating the tree.
Success, failure, cancellation and timeout remove it after container removal,
then settle. Existing job retries recover interrupted execution and repeat
bounded cleanup; existing maintenance also retries up to 100 settled cleanup
intents per call, including runs without containers. History retention keeps
rows with outstanding cleanup. Each Git command has a 30-second bound plus a
2-second kill grace. Before removal, cleanup retains the final source snapshot on `autocode/<run-id>` only
when no other local or remote branch contains that commit, including a commit
made while detached. Completed cleanup keeps the repository path in the existing
worktree intent; run retention deletes the preservation ref before its run row
in the same bounded candidate page. Failed ref deletion keeps the row for retry.
Existing branches are never deleted. Concurrent operator changes to
repository metadata, refs or a settled run's retention timestamp are known races
and may require operator cleanup. Preservation refs without a retained
repository path require operator cleanup.

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
bearer-authenticated router; hosts must route these paths to Autocode without
user-token middleware.
Set the `gateway_endpoint` requirement to `host:port` reachable from containers;
image management input or workspace registration can override it with the same
field, without a scheme or path. Workspace takes precedence. Preparation appends
the module-owned router prefix to the selected authority for the driver endpoint;
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
immediately revokes access, even while filesystem cleanup retries. Retention
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

Account listings calculate rolling 24-hour counts from current run rows in bounded
batches; component metadata holds no rolling-count snapshot. Credential-kind
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
notify retention. The retention worker owns job and filesystem orchestration;
its store bounds SQL pages and seeks the next unexpired row for its deadline.

Images are registered `unprepared`. Their build record is the source of preparing
state; a refused enqueue leaves the registered image unprepared and returns its
identity with the build error, without a compensating component write.
