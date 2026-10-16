# Contributing to KickSide Chestor

Follow the [organization contribution guide](https://github.com/kicksideai/.github/blob/main/CONTRIBUTING.md),
[Code of Conduct](https://github.com/kicksideai/.github/blob/main/CODE_OF_CONDUCT.md), and
[CLA](https://github.com/kicksideai/.github/blob/main/CLA.md). Send the signed CLA privately to
[licensing@wippy.ai](mailto:licensing@wippy.ai) before merge.

## Development and testing

Install Wippy, Node.js 22, npm, Make, and Python 3. From the repository root:

```sh
make build
make lint
make test
```

For one module, use `make -C graph build`, `make -C graph lint`, and
`make -C graph test`. Lint resolves harness dependencies; the backend test
targets do not run UI tests. Build edited UI and commit regenerated tracked
bundles. For SQL or migration changes, also run the relevant harness with its
`postgres` profile, after configuring the `vars.pg_*` settings for a disposable
local database. For example, after setup:

```sh
cd graph/test
wippy test --profile postgres
```

See [CI](.github/workflows/ci.yml) for the supported CLI and
[Journal module](journal/README.md) for integration details.

## Pull requests

Create a focused branch and submit a GitHub pull request to this repository.
Use a commit subject such as
`docs: clarify setup` or `fix: handle an empty result`. Explain the behavior and
validation in the PR; include relevant commands and outcomes. Maintainers review
and merge GitHub pull requests after the required checks and CLA confirmation.
