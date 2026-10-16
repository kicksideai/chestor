<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kicksideai/docs/main/getting-started/assets/brand/kickside-logo-dark.png">
  <img src="https://raw.githubusercontent.com/kicksideai/docs/main/getting-started/assets/brand/kickside-logo-light.png" alt="KickSide" width="320">
</picture>

# Chestor

Five workspace modules for KickSide. Each module owns its data, contracts, web component, and Lua unit tests.

| Directory | Package | Behavior |
| --- | --- | --- |
| [workspace](workspace) | `chestor/workspace` | Organizes typed entries in a shared workspace tree. |
| [graph](graph) | `chestor/graph` | Edits nested semantic graphs with nodes, edges, materials, and layouts. |
| [journal](journal) | `chestor/journal` | Presents agent work, events, decisions, findings, and recall. |
| [roadmap](roadmap) | `chestor/roadmap` | Plans initiatives, outcomes, milestones, and dependencies. |
| [db-schema](db-schema) | `chestor/db-schema` | Models tables, columns, relations, and indexes as a diagram. |

Install `chestor/workspace` and the entry kinds you need through **System → Modules**. The [Chestor guide](https://github.com/kicksideai/docs/blob/main/using/chestor.md) explains entry creation and access.

![Chestor Graph shows a fictional application architecture](https://raw.githubusercontent.com/kicksideai/docs/main/using/assets/chestor/graph.png)

License: [KickSide Community License 1.0](LICENSE.md) · [Third-party notices](THIRD_PARTY_NOTICES.md).

[Documentation](https://github.com/kicksideai/docs) · [KickSide](https://kickside.ai)
