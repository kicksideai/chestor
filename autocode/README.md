<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# chestor/autocode

Run coding agent CLIs in Docker with shared agent accounts, prepared images,
host workspaces, durable jobs, and streamed output. Includes a member page,
a System management tab, a driver account card, a workflow task Block, and
agent traits for discovery, asynchronous tasks, and resource administration.
See [Agent traits](docs/reference.md#agent-traits) for tools and permissions.

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
and start tasks. Claude Code uses a subscription login through its CLI login file
or an OAuth token. Use a driver that offers API keys or custom endpoints for
production or multiple users. Account grants allow grantees to run with the stored
credential, including subscription logins.

## Requirements

Wippy v0.3.59a or newer; validation uses v0.3.60a. The host needs Docker and an `exec.native`
entry with Docker on the executor's own PATH, a POSIX shell, coreutils, awk and Linux `/proc`. Frontend development uses Node.js 22, npm, and Make.

- **`chestor.autocode:target_db`**: SQL database shared with `kickside/jobs`, so rows and jobs commit together.
- **`chestor.autocode:api_router`**: Authenticated HTTP router.
- **`chestor.autocode:ui_server`**: HTTP server for the built UI.
- **`chestor.autocode:settings_path`**: Actual mounted settings-tab URL; empty hides the link.
- **`chestor.autocode:limits_path`**: Actual mounted Autocode section of shared Settings for run limits and retention; empty hides the link from management. Bind both paths in the host so Tasks, Profiles and Accounts link to Images/Workspaces/Docker, which links to limits and retention. For a shell mounting management at `/system/autocode` and shared Settings at `/system/settings`, use those respective URLs. A host that supports selecting a Settings section by URL may bind that section URL instead.
- **`chestor.autocode:docker_executor`**: Host `exec.native` entry that runs the Docker CLI.
- **`chestor.autocode:docker_context`**: Optional Docker CLI context override; empty preserves the executor’s environment and selected context, authentication and plugins.
- **`chestor.autocode:gateway_endpoint`**: Host and port reachable from run containers for the bearer-authenticated run gateway.
- **`chestor.autocode:workspace_roots`**: Comma-separated absolute directories allowed for workspace mounts; empty admits none.
- **`chestor.autocode.security:user_security_scope`**: Defaults to `kickside.security.groups:members`.

Assign the `chestor.autocode.security:module_management` policy to image/workspace managers, and the separate `chestor.autocode.security:tool_access` policy to agent-tool users. These are capabilities, not host requirement bindings.

The optional per-run gateway uses the host-installed `kickside/agents` tools contract; ordinary runs add no Agents, Connection, Uploads or Relay bindings.

The module depends on `bee/drivers` 0.1.26 or newer, `kickside/component`, `kickside/contract`,
`kickside/jobs`, `kickside/execution`, `kickside/settings`, `kickside/blocks`,
and `wippy/migration`. Bind `bee.drivers:activation` to
`chestor.autocode.drivers:activation`. Bind `bee.drivers:host_environment` and
`bee.drivers:entered_values` to host-owned environment storages, and bind
`bee.drivers:access_scope` to the intended member scope. The package declares
no storage file paths. The normalized tool catalog is supplied by `kickside/agents`; bind its transitive HTTP, storage and relay requirements through the host install plan, as shown in the standalone harness. Account credentials are delivered per run;
the host process environment is excluded. The test harness owns separate
storages for these bindings.

## Deployment

The host Docker client's configuration, socket, CLI plugins and credential helpers
are administrator-owned. Keep them, their resolved targets and executable search
paths outside every workspace root and every directory a container mounts.
Members can write their workspaces; placing Docker client configuration or code
there would let a member steer or execute the host client. Administrators maintain
this boundary; Autocode leaves Docker's client configuration resolution to Docker.

The gateway uses plain HTTP on the configured container network. Its transport
protection relies on every Autocode container dropping `NET_RAW`, refusing all
added capabilities, and using per-run bearer tokens. Recipe capability drops are
preserved. The Docker host, daemon and network infrastructure remain trusted.

Container resource guarantees and warning handling are specified in the
[settings limits and Docker warnings contract](docs/docker-options.md#settings-limits-and-docker-warnings).

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

## Use and reference

- [Contracts, host configuration and behavioural SPEC](docs/reference.md)
- [Workspace admission and provenance](docs/reference.md#spec-workspace-approval)
- [Native dialog design choice](docs/reference.md#frontend-dialog-deviation)

## Links

- [Wippy Hub](https://hub.wippy.ai/chestor/autocode)
- [KickSide](https://kickside.ai)
- [Module authoring](https://github.com/kicksideai/docs/blob/main/building-modules/index.md)
- [Wippy documentation](https://wippy.ai)

Administrators can bound unfinished work per owner and globally, expire queued work,
and configure result, event text, build log and clone depth limits through the existing
Autocode Settings page. Defaults preserve the released output and checkout limits;
see [admission and limit settings](docs/reference.md#spec-pending-admission-and-queue-expiry).


## License

[KickSide Community License 1.0](LICENSE). Dependencies retain their own licenses.


## Credential storage and execution

Account credentials are write-only on HTTP, account contracts and agent tools.
Reads return presence only; account updates replace or clear the credential
through Component's existing context write contract. The account binding declares
its credential path as a string secret. Only the account preparation execution
holds the exact owning-kind secret capability and the Component runtime-read
permission. Preparation returns the merged internal context revision so refreshed
credentials retain their existing compare-and-set behavior.

Release Component's encrypted-secret capability before this account declaration
and runtime read. Its normal update migration converts existing account rows in
bounded transactions without changing context revisions, timestamps or identity.
No manual migration step is required. Non-secret account metadata and sharing
behavior retain their existing contracts.

Run credentials reach the owning CLI after its container starts, over execution
stdin. Docker create arguments, container configuration, labels and image layers
carry no account or gateway credential. Login files and driver-declared credential
files use tmpfs; refreshed login bytes are read from that mount before the existing
container cleanup removes it. CLI output and durable run records retain their
credential redaction. An interrupted run does not rely on credential files
surviving the container.
