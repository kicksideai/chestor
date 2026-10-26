# Security boundary audit disposition

This report covers the Codex and Muse audits. The optional Agy audit is absent.
UI changes belong to the UI lane. Platform sources are unchanged.

## Verified fixes

| Finding | Cause | Disposition |
| --- | --- | --- |
| Codex S3; Muse S2 | The account response retains a sharing affordance after the account share UI is removed. | Fixed in `f1eb4a2`: remove account `shareable` from the server DTO. The requested removal supersedes the audit's proposal to add a share dialog. |
| Codex S37; Muse S52 | Resource responses expose WRITE but omit the independent DELETE permission. | Fixed server-side in `f1eb4a2`: accounts, images, and workspaces return `deletable` from DELETE. Client button gating belongs to the UI lane. |
| Muse S34, roots disclosure | The member workspace listing includes host roots without checking workspace management authority. | Fixed in `f1eb4a2`: only callers admitted to `workspaces_create.endpoint` receive roots. Canonical directory and symlink checks belong to `runner/workspaces.lua`. |
| Codex S5; Muse S1 | An unused HTTP preview duplicates the internal admission operation. | Fixed in `cbb86c4`: remove the function, endpoint, router target, and access grant. Internal admission remains available. |
| Codex S24 | Member namespace-wide runtime grants permit direct cleanup calls and opening cleanup contracts with forged context. | Fixed in the authorization commit: member calls name their exact handlers, cleanup bindings are not member-openable, and only the component delete entry receives the exact cleanup contract grant. Core/component performs its DELETE check before opening cleanup. |
| Codex S21, direct worker calls | Members can call secret-bearing prepare and credential write-back functions directly. | Fixed in the authorization commit: only trusted workers receive these function grants. The separate raw-context confidentiality defect remains unresolved below. |
| Muse S48 | Management policy assignment omits the member catalog, bundle access, and platform resources used by management handlers. | Fixed in the authorization commit: management includes the member capability and driver grants plus exact component/settings/lifecycle resources. A management-only identity loads its data and creates/deletes a workspace. |
| Muse S56 | One image-create permission is reported as authority over three independently grantable management areas. | Fixed server-side in the authorization commit: return `can_images`, `can_workspaces`, and `can_prune` from the endpoints each area requires; remove `manage`. Client tab gating belongs to the UI lane. |
| Codex S12, credential comments | Comments describe private context as unreadable or write-only although generic component reads expose it. | Fixed for the account/component declarations and account harness comments in `f1eb4a2`: describe omission from HTTP responses, without promising component-service confidentiality. Runner metrics and UI wording belong to their respective lanes. |

Callable namespace globs are removed from the member and worker runtime policies.
Workers use exact function/contract resources, and the database grant resolves
only the module's bound database. Existing dynamic actor, runtime-meta, and
Docker-command selectors remain: their resources are generated principal IDs,
component IDs, and rendered commands rather than a finite registry entry list.
The runtime-meta grant also checks the exact image implementation ID.

Direct member opens of the kind bindings are restricted with cleanup. Autocode
HTTP reads continue to work; deletion uses the component service. The cleanup
grant is attached through the namespace linker's supported cross-namespace
requirement target on `kickside.component.binding:delete_component_func`.

## Findings that are not independently real

| Finding | Verification |
| --- | --- |
| Muse S32 | Bare method names are the canonical `contract.call` resources: the runtime's contract module checks the method string, not a registry ID. The new wiring case resolves every granted component-service method to its installed function binding. Replacing these strings with entry IDs would revoke the actual calls. |
| Muse S33 | An arm without an actor/security override can deliberately inherit a member Flow's recovered identity, as the Inbox reference does. Nonmember identities have no Autocode capability. The missing callback-provenance boundary is real and is tracked as Codex S22 below. |
| Muse S40, write-only credential claim | The claim that private context makes a credential write-only is contradicted by core/component's ordinary context read path; this is the real Codex S21 defect below. |

## Verified platform blockers and other lanes

**Codex S20 (P0): unresolved; belongs to core/component.** Registration in
`core/component/src/binding/register_component_func.lua` accepts an authenticated
principal and dispatches CREATE_COMPONENT. `persist/placement_ops.lua` validates
placement and grants the creator full access. Its special create-capability
check applies only to framework maintenance actors, not ordinary principals.
`binding/update_component_func.lua` checks component WRITE for meta/context
commands; it has no kind-level management check. There is no provider create or
update policy, register capability hook, or `component.register` action to bind
to Autocode management. As requested, this item stops at that missing platform
mechanism. Member-created ready images and privileged settings remain possible;
admission cannot establish who authorized a settings version from mutable
component metadata. Workspace registration has the same missing kind gate.

**Codex S21: unresolved confidentiality boundary; belongs to core/component or
a platform credential store.** `core/component/src/context.lua` returns ordinary
context keys to READ holders. `redact_for_actor` protects only the hard-coded
framework keys `_portable_input`, `_execution_identity`, and `_rollback` from
non-ADMIN callers. Providers cannot declare an owner-only credential key or
redactor, and those framework-owned keys cannot be repurposed by registration or
ordinary context updates. ADMIN-only disclosure would also permit an ADMIN
grantee rather than only the owner. The platform connection creation path stores
its credential fields as ordinary private context too; it provides no reusable
owner-only component credential mechanism. Direct-worker grants and misleading
comments are corrected, but a grantee can still read raw account context through
the component service. No module-side read wrapper is presented as a fix.

**Codex S22: unresolved; belongs to Blocks/Dataflow's parked-arm dispatch.**
`userspace.dataflow.runner:orchestrator` calls an arm with the recovered Flow
actor and scope; `platform/blocks/src/await.lua` supplies native Flow/node/signal
values. The arm receives no protected caller capability or verified parked-node
receipt. Removing the member arm grant therefore also revokes legitimate owner
dispatch. An experiment with an entry-local arm grant prevents Dataflow from
reconstructing its execution frame; assigning a grant only to the framework root
does not make it available in the orchestrator's recovered owner frame. The
platform needs an exact, trusted parked-arm dispatch capability or provenance
verification, without elevating arbitrary public orchestrator calls. The member
arm grant remains explicit, and this security defect remains open.

Codex S35 (credential refresh validation), Codex S45 and the directory portion
of Muse S34/S50 (canonical workspace paths), and the remaining runner portions
of Codex S12 belong to the runner lane. UI portions of Codex S3/S12/S37 and Muse
S2/S52/S56 belong to the UI lane. Muse S36 concerns the shared Docker wrapper and
policy literal; the existing real worker success test exercises that policy.

## Regression evidence and gates

- Component response tests run red first: 41 pass, four fail (obsolete account
  sharing field and missing DELETE flags for all three kinds). After the fix,
  the same component suite passes, including READ+WRITE versus READ+DELETE.
- Management and grant tests run red before their fixes: missing area flags,
  management-only catalog denial, namespace call globs, and member worker grants.
- Forged cleanup context runs red with `{success=true}`; it then returns native
  PERMISSION_DENIED, while ordinary account/workspace HTTP deletion passes.
- Roots disclosure runs red with the configured root in a member response; it
  then omits roots for members and returns them to workspace managers.
- Final `make test`: **53/53 SQLite**, using a dedicated gateway port.
- Final `make test-pg`: **53/53 PostgreSQL**, using its own temporary database and
  gateway port; the Makefile drops the database after the run.
- `make lint` and `make lint WIPPY_LINT_ARGS=--strict-any`: **zero findings** each,
  173 Autocode entries checked. No UI files change, so UI build/typecheck gates
  do not apply.

The run fixture derives its container callback URL from the configured gateway
port, so concurrent lanes do not accidentally call another harness's mock.

## Files beyond the lane's owned source list

- `src/_index.yaml`: remove the preview router target and bind the exact worker
  database grant to the existing target_db requirement.
- `src/api/_index.yaml`: remove preview declarations and declare the security
  module used by workspace metadata filtering.
- `src/api/runs.lua`: remove the unused preview handler/export.
- `src/api/catalog.lua`: replace the management flag with per-area capabilities.
- `src/runner/_index.yaml`: attach the exact worker and published driver policies.
- `test/src/suites/runs_test.lua`: derive the mock callback URL from the harness
  gateway instead of a fixed port. Shared harness plumbing supports the matching
  access/component/wiring suites.

The original clone's Git metadata is read-only in the execution sandbox. Commits
are preserved on a temporary local `fix-A` branch and exported as a Git bundle;
the original branch metadata is unchanged. No commits are pushed.
