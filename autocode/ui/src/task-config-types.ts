// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { z } from 'zod'
import { toolSurfaceSchema, endpoint } from './app/wire.ts'
export { toolSurfaceSchema } from './app/wire.ts'
export const taskConfigSchema = z.object({
  tools: toolSurfaceSchema.optional(),
  profile_id: z.string().optional(),
  account_pool: z.array(z.string()).optional(),
  endpoint: endpoint.optional(),
  agent: z.string().optional(),
  account_id: z.string().optional(),
  image_id: z.string().optional(),
  workspace_id: z.string().optional(),
  prompt: z.string().optional(),
  include_input: z.boolean().optional(),
  unattended: z.boolean().optional(),
  options: z.record(z.unknown()).optional(),
  run_timeout: z.string().max(64).optional(),
  repo_url: z.string().optional(),
  repo_ref: z.string().optional(),
}).strict()
export type TaskConfig = z.infer<typeof taskConfigSchema>
