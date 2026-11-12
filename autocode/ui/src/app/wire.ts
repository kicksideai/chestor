// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { z } from 'zod'

const id = z.string().max(64)
const values = z.record(z.unknown())
export const endpoint = z.object({ protocol: z.string().max(64), base_url: z.string().max(512), model: z.string().max(200).optional() }).strict()
export const accountEndpoint = endpoint.partial({ protocol: true })
export const toolSurfaceSchema = z.object({
  traits: z.array(z.string().min(1).max(200)).max(32).optional(),
  tools: z.array(z.string().min(1).max(200)).max(128).optional(),
  context: values.optional(),
}).strict()
export const credentialKind = z.object({ id: z.string(), label: z.string(), hint: z.string(), file: z.string().optional(), subscription: z.boolean(), format: z.enum(['json_object', 'single_line', 'text']) }).strict()
const modelUsage = z.object({ input_tokens: z.number().nonnegative().optional(), output_tokens: z.number().nonnegative().optional(),
  cached_tokens: z.number().nonnegative().optional(), cache_write_tokens: z.number().nonnegative().optional(),
  reasoning_tokens: z.number().nonnegative().optional(), cost_usd: z.number().nonnegative().optional(), cost_decimal: z.string().optional(), currency: z.string().optional() }).strict()
export const usage = modelUsage.extend({ models: z.record(modelUsage).optional() })
export const profileInput = z.object({
  title: z.string().min(1).max(200), agent: id.min(1), image_id: id.min(1), account_id: id.optional(),
  account_pool: z.array(id.min(1)).max(200).optional(), endpoint: endpoint.optional(),
  tools: toolSurfaceSchema.optional(), isolation: z.enum(['shared', 'worktree']).optional(), workspace_id: id.optional(),
  repo_url: z.string().max(2000).optional(), repo_ref: z.string().max(200).optional(), run_timeout: z.string().max(64).optional(),
  unattended: z.boolean().optional(), options: values.optional(),
}).strict()
export const profilePatch = profileInput.partial().extend({ id: id.min(1) })
export const profile = profileInput.extend({ id: z.string(), options: values, owner: z.string(), writable: z.boolean(), deletable: z.boolean() })
