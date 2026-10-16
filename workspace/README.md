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

## Key concepts

See [src/](src/) for registry declarations and implementation.

## Requirements

Wippy 0.3.x; repository validation uses 0.3.47a. Use current Hub dependencies
for the contracts declared by the module.
Host persistence uses SQLite or PostgreSQL. This module has no standalone SQL dialect matrix.
Frontend development also uses Node.js 22, npm, and Make.

## Development

From this module directory:

```sh
cd test
wippy install
cd ..
make lint
make test
```

Edit frontend source under `ui/` and run `make build` from this directory;
commit regenerated tracked assets with the source.

## Links

- [KickSide](https://kickside.ai)
- [Module authoring](https://kicksideai.github.io/docs/building-modules/)
- [Wippy documentation](https://wippy.ai)
- [Wippy Hub](https://hub.wippy.ai/chestor/workspace)

## License

[KickSide Community License 1.0](LICENSE). Vendored dependencies retain their own licenses.
