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

Wippy 0.3.x; validated with 0.3.51a. The host needs Docker and an `exec.native`
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
Image deletion drains the build and deletes the component before optional Docker
reference removal. If Docker removal fails, the response reports `docker_error`
and the component stays deleted.

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
`infrastructure/container.lua:CLONE_DEPTH` constant, currently 50. Ref selection requires a repository
URL, and neither repository field applies to an existing mounted checkout.

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
It exposes seven tools through `chestor.autocode:tasks`:

- **`SubmitCodingTask`**: Registry entry: `chestor.autocode.traits:submit_coding_task`; Contract method: `submit_task`
- **`ReadCodingRun`**: Registry entry: `chestor.autocode.traits:read_coding_run`; Contract method: `get_run`
- **`ListCodingAgents`**: Registry entry: `chestor.autocode.traits:list_coding_agents`; Contract method: `list_agents`
- **`ListCodingAccounts`**: Registry entry: `chestor.autocode.traits:list_coding_accounts`; Contract method: `list_accounts`
- **`ListCodingImages`**: Registry entry: `chestor.autocode.traits:list_coding_images`; Contract method: `list_images`
- **`ListCodingWorkspaces`**: Registry entry: `chestor.autocode.traits:list_coding_workspaces`; Contract method: `list_workspaces`
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
mock Anthropic endpoint.

## Docker host configuration

Docker runs on the executor bound to `docker_executor`, using the host-selected
`docker_context`. Its environment and selected Docker
context determine the daemon; workspace paths name directories on that daemon's
host, which may differ from the API host. Image `extra_args` controls host
aliases, for example `["--add-host", "host.docker.internal:host-gateway"]` on a
compatible local Docker daemon. The runner adds no host alias implicitly.

Workspace-root admission currently checks path syntax and lexical containment.
It does not establish that a directory exists or prevent symlink escape on the
daemon host. The host filesystem authority must supply canonical directory
verification at registration and launch before this is a security boundary.

## Pending platform boundaries

Component kind-level CREATE/UPDATE authorization and trusted parked-arm
dispatch remain platform requirements. Module
HTTP permissions do not close those platform gaps. The task service keeps callback handling in `service/tasks.lua`, account
credentials in `components/resources.lua` and `service/owner.lua`, and all kind
writes through the component service so each platform correction has one seam.
