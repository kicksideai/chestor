# chestor/graph

Nested semantic graphs with typed nodes, edges, materials, and layouts.

This module installs independently into a [KickSide](https://kickside.ai) host.

## Quick start

In **System → Modules**, select the package from the Wippy Hub and review its
requirements. For CLI dependency setup, run from the host application directory:

```sh
wippy add chestor/graph
wippy install
```

Apply host bindings and migrations through the application install plan.
Install with `chestor/workspace`. Graph components append events to their threads; projections materialize nodes, edges, and layout state.

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

Create a Graph entry in Workspace and edit its nested nodes, edges, materials, and layout. Writes append declared graph events and projections materialize the read view. Share through the component hierarchy; agent tool access is a separate selectable policy.

### Agent tools

Tool names link to their input/output schemas. Capabilities and the caller’s
resource access determine which tools are available.

| Tool | Selection and paging inputs |
| --- | --- |
| [`GetGraph`](src/traits/_index.yaml) | See the operation schema |
| [`ApplyGraph`](src/traits/_index.yaml) | See the operation schema |

### Host requirements

Bind these exact requirement IDs through the module’s dependency declaration
or Hub plan. Existing explicit bindings take precedence over defaults.

| Requirement | Declared default |
| --- | --- |
| [`chestor.graph:target_db`](src/_index.yaml) | Host supplies the value |
| [`chestor.graph:api_router`](src/_index.yaml) | Host supplies the value |
| [`chestor.graph:ui_server`](src/_index.yaml) | Host supplies the value |
| [`chestor.graph.security:user_security_scope`](src/security/_index.yaml) | `kickside.security.groups:members` |

## Links

- [KickSide](https://kickside.ai)
- [Module authoring](https://github.com/kicksideai/docs/blob/main/building-modules/index.md)
- [Wippy documentation](https://wippy.ai)
- [Wippy Hub](https://hub.wippy.ai/chestor/graph)

## License

[KickSide Community License 1.0](LICENSE). Vendored dependencies retain their own licenses.
