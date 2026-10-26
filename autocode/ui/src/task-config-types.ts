// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { z } from 'zod'
export const taskConfigSchema = z.object({
  agent: z.string().optional(),
  account_id: z.string().optional(),
  image_id: z.string().optional(),
  workspace_id: z.string().optional(),
  prompt: z.string().optional(),
  include_input: z.boolean().optional(),
  unattended: z.boolean().optional(),
  options: z.record(z.unknown()).optional(),
  repo_url: z.string().optional(),
}).strict()
export type TaskConfig = z.infer<typeof taskConfigSchema>
