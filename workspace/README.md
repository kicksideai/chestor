# chestor/workspace

Typed workspace tree with component lifecycle, access inheritance, and a shell.

This module installs independently into a [KickSide](https://kickside.ai) host.

## Quick start

In **System → Modules**, select the package from the Wippy Hub and review its
requirements. For CLI dependency setup, run from the host application directory:

```sh
wippy add chestor/workspace
wippy install
```

Apply host bindings and migrations through the application install plan.
Install the workspace and at least one component kind. Entry declarations supply renderers and lifecycle behavior; access follows the component hierarchy.

## Requirements

Wippy 0.3.x; repository validation uses 0.3.47a. Use current Hub dependencies
for the contracts declared by the module.
The standalone harness tests SQLite and declares a PostgreSQL profile.
Frontend development also uses Node.js 22, npm, and Make.

## Development

From this module directory:

```sh
make lockrefresh
make lint
make test
(cd test && wippy test --profile postgres --set vars.pg_database=workspace_test)
```

Create a dedicated PostgreSQL database for the profile run and drop it after
verification. Set the harness connection variables for your test server.

Edit frontend source under `ui/` and run `make build` from this directory;
commit regenerated tracked assets with the source.

## Use

Open **Workspace**, create a folder or an entry of an installed kind, and open its declared view. Entries organize components and file pointers. Deleting a file entry removes its pointer; deleting a folder removes descendant workspace entries. Pinned, provisioned, and system entries reject deletion.

### Agent tools

Tool names link to their input/output schemas. Capabilities and the caller’s
resource access determine which tools are available.

| Tool | Selection and paging inputs |
| --- | --- |
| [`CreateWorkspaceEntry`](src/traits/_index.yaml) | See the operation schema |
| [`ListWorkspaceEntries`](src/traits/_index.yaml) | `limit`, `cursor` |
| [`GetWorkspaceEntry`](src/traits/_index.yaml) | See the operation schema |
| [`ListWorkspaceEntryTypes`](src/traits/_index.yaml) | `limit`, `cursor` |
| [`UpdateWorkspaceEntry`](src/traits/_index.yaml) | See the operation schema |
| [`DeleteWorkspaceEntry`](src/traits/_index.yaml) | See the operation schema |

### Host requirements

Bind these exact requirement IDs through the module’s dependency declaration
or Hub plan. Existing explicit bindings take precedence over defaults.

| Requirement | Declared default |
| --- | --- |
| [`chestor.workspace:api_router`](src/_index.yaml) | Host supplies the value |
| [`chestor.workspace:ui_server`](src/_index.yaml) | Host supplies the value |
| [`chestor.workspace.security:user_security_scope`](src/security/_index.yaml) | `kickside.security.groups:members` |

## Links

- [KickSide](https://kickside.ai)
- [Module authoring](https://github.com/kicksideai/docs/blob/main/building-modules/index.md)
- [Wippy documentation](https://wippy.ai)
- [Wippy Hub](https://hub.wippy.ai/chestor/workspace)

## License

[KickSide Community License 1.0](LICENSE). Vendored dependencies retain their own licenses.
