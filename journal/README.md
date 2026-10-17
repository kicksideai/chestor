# chestor/journal

Durable agent memory with cursors, bounded episodes, work hierarchy, and recall.

This module installs independently into a [KickSide](https://kickside.ai) host.

## Quick start

In **System → Modules**, select the package from the Wippy Hub and review its
requirements. For CLI dependency setup, run from the host application directory:

```sh
wippy add chestor/journal
wippy install
```

Apply host bindings and migrations through the application install plan.
Install with `chestor/workspace` and the declared knowledge capabilities. Agent-owned cursors and episodes record durable memory.

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

Use Journal as durable agent memory with agent cursors, evidence, episodes, and work hierarchy. `JournalContext` resumes working position; the read/query tools retrieve bounded evidence, and fact/graph tools append changes. Enable optional tool policies explicitly. Embedding and semantic recall need the declared model configuration.

### Agent tools

Tool names link to their input/output schemas. Capabilities and the caller’s
resource access determine which tools are available.

| Tool | Selection and paging inputs |
| --- | --- |
| [`JournalContext`](src/traits/_index.yaml) | See the operation schema |
| [`JournalQuery`](src/traits/_index.yaml) | `fields`, `limit`, `offset` |
| [`JournalFact`](src/traits/_index.yaml) | See the operation schema |
| [`JournalGraph`](src/traits/_index.yaml) | See the operation schema |
| [`ActOnJournal`](src/traits/_index.yaml) | See the operation schema |
| [`ReadJournal`](src/traits/_index.yaml) | `fields`, `offset`, `cursor`, `limit` |

### Host requirements

Bind these exact requirement IDs through the module’s dependency declaration
or Hub plan. Existing explicit bindings take precedence over defaults.

| Requirement | Declared default |
| --- | --- |
| [`chestor.journal:target_db`](src/_index.yaml) | Host supplies the value |
| [`chestor.journal:api_router`](src/_index.yaml) | Host supplies the value |
| [`chestor.journal:ui_server`](src/_index.yaml) | Host supplies the value |
| [`chestor.journal.security:user_security_scope`](src/security/_index.yaml) | `kickside.security.groups:members` |

## Links

- [KickSide](https://kickside.ai)
- [Module authoring](https://github.com/kicksideai/docs/blob/main/building-modules/index.md)
- [Wippy documentation](https://wippy.ai)
- [Wippy Hub](https://hub.wippy.ai/chestor/journal)

## License

[KickSide Community License 1.0](LICENSE). Vendored dependencies retain their own licenses.
