# chestor/roadmap

Initiative planning with outcomes, dependencies, milestones, and periods.

This module installs independently into a [KickSide](https://kickside.ai) host.

## Quick start

In **System → Modules**, select the package from the Wippy Hub and review its
requirements. For CLI dependency setup, run from the host application directory:

```sh
wippy add chestor/roadmap
wippy install
```

Apply host bindings and migrations through the application install plan.
Install with `chestor/workspace`. Initiative events feed the projection that renders planning layers, milestones, and dependencies.

## Requirements

Wippy 0.3.x; repository validation uses 0.3.47a. Use current Hub dependencies
for the contracts declared by the module.
The standalone harness uses SQLite and declares a PostgreSQL test profile.
Frontend development also uses Node.js 22, npm, and Make.

## Development

From this module directory:

```sh
make lockrefresh
make lint
make test
(cd test && wippy test --profile postgres --set vars.pg_database=kickside_readme_test)
```

Create a dedicated PostgreSQL database before the profile run and drop it
afterward. Set the `pg_host`, `pg_port`, `pg_username`, and `pg_password`
variables in the harness configuration for your test server.
Edit frontend source under `ui/` and run `make build` from this directory;
commit regenerated tracked assets with the source.

## Use

Create a Roadmap entry in Workspace to plan initiatives, outcomes, dependencies, milestones, and periods. The event stream owns changes and projections build the read view. Query or apply changes through the declared tools under Component access and explicit tool policies.

### Agent tools

Tool names link to their input/output schemas. Capabilities and the caller’s
resource access determine which tools are available.

| Tool | Selection and paging inputs |
| --- | --- |
| [`GetRoadmap`](src/traits/_index.yaml) | See the operation schema |
| [`QueryRoadmap`](src/traits/_index.yaml) | `limit`, `cursor` |
| [`ApplyRoadmap`](src/traits/_index.yaml) | See the operation schema |

### Host requirements

Bind these exact requirement IDs through the module’s dependency declaration
or Hub plan. Existing explicit bindings take precedence over defaults.

| Requirement | Declared default |
| --- | --- |
| [`chestor.roadmap:target_db`](src/_index.yaml) | Host supplies the value |
| [`chestor.roadmap:api_router`](src/_index.yaml) | Host supplies the value |
| [`chestor.roadmap:ui_server`](src/_index.yaml) | Host supplies the value |
| [`chestor.roadmap.security:user_security_scope`](src/security/_index.yaml) | `kickside.security.groups:members` |

## Links

- [KickSide](https://kickside.ai)
- [Module authoring](https://kicksideai.github.io/docs/building-modules/)
- [Wippy documentation](https://wippy.ai)
- [Wippy Hub](https://hub.wippy.ai/chestor/roadmap)

## License

[KickSide Community License 1.0](LICENSE). Vendored dependencies retain their own licenses.
