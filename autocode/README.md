<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# chestor/autocode

Run coding agent CLIs in Docker with shared agent accounts, prepared images,
host workspaces, durable jobs, and streamed output. Includes a member page,
a System management tab, a driver account card, and a workflow task Block.

Sharing an API-key account shares its key with the grantees, and subscription logins run only for their owner.

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
and start tasks. Subscription logins are for personal use only and run only
for their owner. Use official API keys or your own endpoints for production
or multiple users.

## Requirements

Wippy 0.3.x; validated with 0.3.51a. The host needs Docker and its CLI on the
executor PATH. Frontend development uses Node.js 22, npm, and Make.

| Requirement | Host binding |
| --- | --- |
| `chestor.autocode:target_db` | SQL database shared with `kickside/jobs`, so rows and jobs commit together. |
| `chestor.autocode:api_router` | Authenticated HTTP router. |
| `chestor.autocode:ui_server` | HTTP server for the built UI. |
| `chestor.autocode:settings_path` | Actual mounted settings-tab URL; empty hides the link. |
| `chestor.autocode:docker_executor` | Host-owned exec resource; defaults to the module native executor. |
| `chestor.autocode:docker_context` | Docker CLI context; empty uses the executor default. |
| `chestor.autocode:docker_path` | Docker executor search path; defaults to standard system binary directories. |
| `chestor.autocode:workspace_roots` | Comma-separated absolute directories allowed for workspace mounts; empty admits none. |
| `chestor.autocode.security:user_security_scope` | Defaults to `kickside.security.groups:members`. |
| `chestor.autocode.security:module_management` | Assign the management capability to the groups that manage images, workspaces, and Docker maintenance. |

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
recipe uses `/opt/agent` inside the container. Run timeout, account cooldown,
and settled-run retention are editable settings in `chestor.autocode`.

## Development

From this module directory:

```sh
make lockrefresh
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
No copy of the UI kit is vendored. Publishing is handled by Release Please.

## Links

- [KickSide](https://kickside.ai)
- [Module authoring](https://github.com/kicksideai/docs/blob/main/building-modules/index.md)
- [Wippy documentation](https://wippy.ai)

## License

[KickSide Community License 1.0](LICENSE). Dependencies retain their own licenses.

## Internal service

Open `chestor.autocode:tasks` with its default binding. Methods return
`(Result?, error?)` under the caller's execution frame: `list_agents`,
`list_accounts`, `list_images`, `list_workspaces`, `submit_task`, `get_run`,
`list_runs`, and `cancel_run`. Each method publishes JSON input/output schemas.
Task methods accept no caller, owner, credentials, Docker arguments or callback.
Account writes use the separate `chestor.autocode:accounts` contract:
`add_account`, `update_account`, and `remove_account`. Update preserves the
account ID, requires WRITE, and atomically replaces public endpoint metadata
and the credential with the component revision. An empty endpoint `base_url`
clears the custom endpoint. Reads never return the credential.

Submission is asynchronous. Supply an `idempotency_key` to replay a submission
under the same caller; changing its canonical request returns CONFLICT. The
Block forwards the framework's durable key and keeps its callback outside the
task DTO. Runs and event pages belong only to the submitting caller. Run lists
return summaries and a stable `created_at`/`id` cursor; events return `next_seq`
and `more`. Native errors carry `kind`, `retryable`, and `details.code`; HTTP
adds its success envelope and maps those errors to statuses.

The default image recipe is a curated preset with its supported CLIs named in
its label. It does not promise to install every activated driver. Driver-owned
binding metadata supplies icons when available; a missing icon uses a generic
terminal. Catalog resource defaults come from the same decoder as image writes.

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

Component kind-level CREATE/UPDATE authorization, owner-only credential
context, and trusted parked-arm dispatch remain platform requirements. Module
HTTP permissions do not close those platform gaps. The task service keeps callback handling in `service/tasks.lua`, account
credentials in `components/resources.lua` and `runner/owner.lua`, and all kind
writes through the component service so each platform correction has one seam.
