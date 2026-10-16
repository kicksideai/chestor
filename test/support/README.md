# Chestor test support

This repository library owns the scope resolver fixture for Graph, DB Schema,
Roadmap and Workspace. Its source root is `test/support/`; each independent
harness loads it through `workspace.replacements` and an unpinned
`ns.dependency` on `chestor/test-support`. The harness checkout includes its own
module and this directory. `make lint` and `make test` verify local source
completeness before dependency resolution.

The required `group` parameter targets `chestor.test_support:config.meta.group`.
Each harness supplies its own group: `graph_test`, `db_schema_test`,
`roadmap_test` or `workspace_test`. Missing, empty or malformed configuration
returns a typed INVALID error. The fixture resolves an explicit principal or the
ambient actor key through Execution identity, returns active metadata and the
process scope, and includes `user_id` only for USER principals.

The package owns one default `kickside.contract:scope_resolver` binding and
shared contract tests. It has no publish target and stays outside
`.github/modules.json`. Production packages have no dependency on this fixture;
production admission uses Users' resolver binding.
