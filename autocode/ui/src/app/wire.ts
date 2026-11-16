// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { z } from 'zod'

const id = z.string().max(64)
const values = z.record(z.unknown())
export const endpoint = z.object({ protocol: z.string().max(64).describe('Endpoint protocol supported by the selected ListCodingAgents entry.'), base_url: z.string().max(512).describe('Custom endpoint base URL. An empty value clears an account or task override.'), model: z.string().max(200).optional().describe('Driver-native model identifier for this custom endpoint.') }).strict().describe('Optional custom endpoint supported by the selected agent; task values override profile/account defaults.')
export const accountEndpoint = endpoint.partial({ protocol: true })
export const toolSurfaceSchema = z.object({
  traits: z.array(z.string().min(1).max(200)).max(32).optional().describe('Public agent trait IDs to resolve under the caller; at most 32. A task list replaces the profile trait list.'),
  context: values.optional().describe('Context keys are projected to each selected trait schema, then merged with its defaults and validated. Task keys override profile keys; undeclared keys are rejected.'),
}).strict().describe('Optional per-run tool gateway declaration using traits only. Task traits replace profile traits; context keys merge with task values taking precedence.')
export const credentialKind = z.object({ id: z.string(), label: z.string(), hint: z.string(), file: z.string().optional(), subscription: z.boolean(), format: z.enum(['json_object', 'single_line', 'text']) }).strict()
const modelUsage = z.object({ input_tokens: z.number().nonnegative().optional(), output_tokens: z.number().nonnegative().optional(),
  cached_tokens: z.number().nonnegative().optional(), cache_write_tokens: z.number().nonnegative().optional(),
  reasoning_tokens: z.number().nonnegative().optional(), cost_usd: z.number().nonnegative().optional(), cost_decimal: z.string().optional(), currency: z.string().optional() }).strict()
export const usage = modelUsage.extend({ models: z.record(modelUsage).optional() })
export const profileInput = z.object({
  title: z.string().min(1).max(200).describe('Display title for this reusable coding configuration.'), agent: id.min(1).describe('Activated agent ID from ListCodingAgents; use that tool to discover credential kinds, capabilities, endpoints and supported driver options.'), image_id: id.min(1).describe('Prepared image ID from ListCodingImages, compatible with the selected agent. ReadCodingImage exposes build status and the latest log.'), account_id: id.optional().describe('Account ID from ListCodingAccounts. Omit to balance across eligible accounts; an explicit account remains pinned. Empty clears a profile account selection.'),
  account_pool: z.array(id.min(1)).max(200).optional().describe('Eligible account IDs from ListCodingAccounts for balancing. A task pool overrides the profile pool and clears its pinned account unless account_id is also supplied.'), endpoint: endpoint.optional(),
  tools: toolSurfaceSchema.optional(), workspace_id: id.optional().describe('Workspace ID from ListCodingWorkspaces. Omit for an ephemeral scratch directory; an empty value overrides a profile workspace with scratch. Registered workspaces mount according to caller grants.'),
  repo_url: z.string().max(2000).optional().describe('Optional repository URL to clone into scratch. Omit for a plain scratch directory. A registered workspace uses its existing checkout. Do not embed credentials, query strings or URL fragments.'), repo_ref: z.string().max(200).optional().describe('Optional branch or tag for a scratch clone; omitted or empty uses the remote default. Registered workspaces keep their current ref and refuse this field.'), run_timeout: z.string().max(64).optional().describe('Default run duration such as 30m or 2h, from 1m through 168h (7 days). A task timeout overrides it.'),
  unattended: z.boolean().optional().describe('Apply the driver unattended preset when true. Explicit driver options override the preset; omission uses the profile or driver default.'), options: values.optional().describe('Driver-specific option values from ListCodingAgents. Task keys override matching profile keys and unattended presets; omitted keys inherit defaults.'),
}).strict()
export const profilePatch = profileInput.partial().extend({ id: id.min(1).describe('Profile ID from ListCodingProfiles; update requires WRITE access.') })
export const profile = profileInput.extend({ id: z.string(), options: values, owner_user_id: z.string(), owner: z.string(), writable: z.boolean(), deletable: z.boolean() })

export const profileSummary = profile.pick({ id: true, title: true, agent: true, owner_user_id: true, owner: true, writable: true, deletable: true })
export const profileListing = z.union([profile, profileSummary])
export const nativeError = z.object({ kind: z.string(), message: z.string(), retryable: z.boolean().optional(), details: values.optional() }).strict()
