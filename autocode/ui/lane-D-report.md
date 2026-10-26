# Lane D verification report

The UI fixes and rebuilt `static/` output are in the working tree. No new commit exists: the workspace mounts `.git` read-only, and `git add` fails while creating `.git/index.lock`. No push or host restart occurs.

Only `ui/`, `static/`, and the explicitly requested regression harness `test/ui/quality.test.ts` change. No server source changes occur. There is no `findings-agy.md` in the supplied audit directory.

## Server integration requirements

These are explicit dependencies, not client-side substitutes for server behavior:

1. **Lane A — DELETE access:** account, image and workspace list/detail DTOs must return `deletable: boolean`, independently of `writable`. The decoders require this field and the delete buttons use only it. The client no longer reads `shareable`; the removed Share UI and grant-count requests have no remaining consumers.
2. **Catalog/image API owner — image defaults:** add `default_image.settings: {memory: string, cpus: string, pids_limit: number, gpus: string, network: string, extra_args: string[], allows: string[]}` to `GET /catalog`, using the same values as image admission. The client accepts its omission from the existing catalog, but image creation displays an explicit unavailable-defaults error until the server supplies it. Editing an image uses that image's returned settings. No client resource defaults or capability-derived default allowlist remain.
3. **Catalog/credential API owner — validation metadata:** add `catalog.account_limits: {label_bytes: number, secret_bytes: number, endpoint_url_bytes: number, endpoint_model_bytes: number}` and `agents[].credentials[].format: 'json_object' | 'single_line' | 'text'`, derived from the authoritative credential kinds and limits. The UI validates these when provided, rejects malformed endpoint URLs independently, and keeps server errors authoritative. The old duplicate file-size constant is removed. Server fixes for malformed endpoints, misleading validation errors and empty-array credentials remain in `src/api/accounts.lua` and `src/runner/credentials.lua`.
4. **Catalog owner — presentation/navigation:** project `agents[].icon` from driver metadata and provide `settings_path` from the mounted settings-tab registration. Both fields are optional because the current Lua catalog omits them. Missing icons use a generic terminal icon; no driver-id inventory remains. The Manage images link appears only when a path is supplied; no host route is invented.
5. **Account/API and runner owners — eligibility and health:** compute `usable` using admission's enabled/driver/credential/endpoint rules and return optional `unavailable_reason`. Publish health changes on the scoped run/component topics. The UI retains removed-driver accounts, displays state independently of personal ownership, watches run/component changes, and advances expiry through a shared clock. Credential replacement needs a documented WRITE-authorized server operation before a reauthorization UI can preserve account IDs.
6. **Security/catalog owners — management-only users and capabilities:** fix the management-only user's access to the admin bundle/catalog, and return `can_images`, `can_workspaces`, and `can_prune` from the independently granted endpoints. The current `manage` boolean cannot support truthful per-area gating; the admin tab's per-area gating remains out of scope pending those server fields.
7. **Block/API owners — shared validation and schema:** align registry/config metadata with the UI's typed config schema and supply the shared task service's required-field, timeout, input/output and admission contracts. The editor marks missing prompt/image fields and keeps invalid option drafts local. The host currently receives only valid configuration snapshots; invalid drafts and further pending edits are explicitly labelled as unapplied, and correction publishes one complete snapshot. The host's Save action cannot be disabled through the existing `config-changed` interface.
8. **Run-list API owner — pagination:** a cursor and RunSummary response contract are still needed. The UI now states that search filters the loaded tasks.
9. **Runner/maintenance owners — runtime policy:** the image form names the runtime prerequisites the runner uses. Persistent/read-only clone behavior, prerequisite probes, cleanup retention and actual Docker cleanup filtering remain server responsibilities. Cleanup prose and confirmation now disclose the Docker host-wide image/cache scope and do not repeat a retention default.

## Findings and causes

“Fixed” below means fixed in the working tree; commit creation is blocked by the read-only Git metadata. UI/server findings list the remaining owner explicitly.

| Audit finding | Verification and cause | Result |
| --- | --- | --- |
| Codex S3 | The audit assumes the account Share UI is wanted; the lane instruction explicitly removes client `shareable` use and the owner removes Share UI. | Superseded; remaining Share UI, DTO fields, helper and component are removed. |
| Codex S4; Muse S3 | Presentation reads counters that the producer never stores. | Fixed: typed input/output/cached tokens, timestamp-derived duration. |
| Codex S5 | Preview has no UI caller, but removal belongs to API/router/security owners. | Out of scope: `src/api/runs.lua`, endpoint and grant declarations. |
| Codex S6 | An unused option prop and an event with no emitter remain connected. | Fixed UI: remove `exclude`, unused close event/listener; redundant runner return belongs to lane B. |
| Codex S7; Muse S6 | A selector names an event kind no producer emits. | Fixed: remove the result-event selector and retain result-output styles. |
| Codex S12 (UI) | Subscription prose claims a sharing restriction the current implementation does not establish. | Fixed UI wording; confidentiality/access enforcement belongs to lane A. |
| Codex S13 | Build configuration always substitutes production, including the watch build. | Fixed: Vite mode drives the substitution; `dev` explicitly selects development. |
| Muse S7 | Committed JavaScript references source maps excluded from the artifact. | Fixed: disable source maps and rebuild all static output. |
| Codex S17; Muse S20 | Client DTOs require omitted Lua fields and leave event/usage data opaque. | Fixed: optional workspace/unattended fields, typed usage/events, string-valued image metadata status. Both app and build configs were already strict; missing strict mode was not real. |
| Codex S18; Muse S21 | Generic response and error casts assert values without checking them. | Fixed: decode success/error envelopes, endpoint DTOs, principals, component config and account submission events; preserve kind/code/retryable/details. |
| Codex S19 | Entry points double-cast schemas instead of checking the SDK's actual type. | Fixed UI: `satisfies WippyPropsSchema`, shared typed nested config schemas and runtime validation; registry metadata belongs to `src/_index.yaml`. |
| Codex S33; Muse S43 | Grouping iterates only active catalog drivers, losing existing orphaned accounts. | Fixed UI: unavailable-driver groups retain actions; state and personal tags are independent. Muse S43(c), claiming an owned subscription hides its cooling tag, is not real: ownership already makes `usable` true and the original state tag renders. Expiry reactivity is fixed under S36. Server eligibility/replacement dependencies are listed above. |
| Codex S36 (UI) | Cooldown rendering has no reactive time dependency and accounts watch too few updates. | Fixed UI: shared clock plus run/component subscriptions; scoped health publication belongs to lane B. |
| Codex S37; Muse S52 | Delete controls conflate independent WRITE and DELETE grants. | Fixed UI: decode and use `deletable`; lane A supplies it. |
| Codex S38; Muse S29 | Independent queues and detail writes race over the same lists; late log reads restore closed dialogs. | Fixed: one list queue per view, detail changes join it, log reads check dialog generation/identity/lifetime; per-image grant-count fan-out is removed. |
| Codex S39 | Empty arrays stand in for loading state and refresh success leaves old errors. | Fixed: explicit initial loading, successful completion clears errors, failed initial loads do not show empty states, retry actions are present. |
| Codex S40 | Invalid JSON deletes the saved option and drafts outlive authoritative values. | Fixed: preserve valid values, reconcile authoritative/lock changes, validate schemas, publish only valid workflow snapshots and label pending drafts. |
| Codex S41 (UI) | UI and server defaults/validation are not one shared contract. | Existing driver-derived unattended default is retained; server adapter/schema alignment remains out of scope. |
| Codex S43 (client) | The client replaces structured server errors with an untyped message. | Fixed client metadata preservation; HTTP mapping/envelope production belongs to API owners. |
| Codex S46 (UI) | Image help omits prerequisites that execution unconditionally uses. | Fixed help; probes belong to lane B. |
| Codex S49 (UI); Muse S39 (runner portion) | Clone policy and kill grace live in execution, not the UI. | Out of scope: lane B's container/workspace implementation. |
| Codex S50 | Credential-kind changes and asynchronous file reads share mutable state without invalidation. | Fixed: reset secrets/endpoints, fence reads against kind/reset/edit/save/unmount, catch read errors, clear successful errors, freeze fields and picker during save. |
| Codex S51 (UI); Muse S41 | The form lacks authoritative format/limit metadata and endpoint validation. | Fixed UI metadata decoding/format/byte-limit/URL checks; server metadata and server validation fixes remain out of scope. |
| Codex S52 | There is no credential/endpoint replacement operation for the UI to invoke. | Out of scope: account API must define an identity-preserving WRITE operation. |
| Codex S53 (UI) | Search wording does not distinguish the loaded subset from all retained tasks. | Fixed wording; stable cursor and RunSummary API remain out of scope. |
| Codex S54 | A trailing-24-hour counter is called today and failed/cancelled stored results are hidden. | Fixed: last 24 hours, Tasks count, visible partial results with status. |
| Codex S55; Muse S9 | Editor controls ignore schema/profile/group/order metadata and have no accessible names. | Fixed: batch profiles, section/group/order sorting, JSON Schema validation, accessible control labels and associated errors. |
| Codex S57 (UI); Muse S38 | Image defaults are independently repeated in the client. | Fixed UI: use catalog/default or returned image settings; server payload dependency is listed above. |
| Codex S58 (UI); Muse S14 | Icons duplicate an incomplete driver-id inventory. | Fixed UI: catalog metadata; catalog projection and installer/activation inventories remain server-owned. |
| Codex S60 (UI); Muse S39 (UI) | Navigation assumes a host route and cleanup prose duplicates policy literals while obscuring scope. | Fixed UI: optional catalog settings path, disclosed cleanup scope, no repeated age; server metadata/policy remains out of scope. |
| Muse S48 | Management-only users lack server grants/data needed to load the admin tab. | Out of scope: security/catalog owners; UI already displays catalog errors and Retry. |
| Muse S54 | Filtered-empty guidance and error classes differ between views. | Fixed: guidance for images/workspaces, ui-kit error class everywhere, duplicate local error CSS removed. |
| Muse S56 | A single server management boolean cannot express independently grantable areas. | Out of scope pending per-area catalog capabilities; see requirement 6. |
| Muse S57 (UI) | Required Block prompt/image fields have no inline indication. | Fixed required-field indicators; timeout, input/usage schemas and port routing belong to Block/API owners. |

## Regression and gate evidence

The UI suite lives in `test/ui/quality.test.ts` and runs with `npm --prefix ui test` from the module directory. It mounts the actual Vue components with mocked host/network boundaries; tests are not skipped or relaxed. Strict typechecking includes the harness and Vite/Vitest configurations.

- Original-source baseline: **26 failed, 1 passed** across 27 tests, including the original unhandled credential file-read rejection.
- Additional prop-boundary tests fail against the unvalidated props before their fix.
- A correction-path regression fails with two workflow configuration emissions before the emission-order fix.
- A missing-image-settings regression fails before removing the substitution of catalog defaults for incomplete edit responses.
- A batch-defaults regression fails before applying the shared batch-profile predicate to default seeding as well as displayed controls.
- A loaded-task refresh regression fails before adding Retry alongside the retained list.
- Final UI suite: **32/32 pass**.
- `make lint`: **0 findings**, 174 entries checked.
- `make lint WIPPY_LINT_ARGS=--strict-any`: **0 findings**, 174 entries checked.
- `make test`: **42/42 pass**, SQLite.
- `make test-pg`: **42/42 pass**, PostgreSQL; the Makefile creates and drops its dedicated database.
- `make typecheck`: **pass**, application, tests and build/test configurations.
- `make build`: **pass**, rebuilt static files and module lint.
- Vite development/production configuration checks pass; every static relative import resolves and no JavaScript references an excluded source map.
- No Hub download failure or retry is needed.

Commit creation remains blocked by filesystem permissions on `.git`, not by a test or build failure.
