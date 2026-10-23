<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# chestor/autocode

Run coding agent CLIs in Docker with shared agent accounts, prepared images,
host workspaces, durable jobs, and streamed output. Includes a member page,
a System management tab, a driver account card, and a workflow task Block.

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
