// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { z } from 'zod'

export const deviceResult = z.union([
  z.object({
    state: z.literal('waiting'), ticket: z.string(), user_code: z.string(),
    verification_url: z.literal('https://auth.openai.com/codex/device'),
    expires_at: z.number().int(), retry_after: z.number().int().positive(),
  }),
  z.object({ state: z.enum(['waiting', 'rate_limited', 'busy']), retry_after: z.number().int().positive() }),
  z.object({ state: z.literal('ready'), account_id: z.string() }),
  z.object({ state: z.enum(['expired', 'denied', 'cancelled', 'unavailable', 'save_failed']) }),
])
export type DeviceRequest = { action: 'start'; label: string; account_id?: string }
  | { action: 'poll' | 'cancel'; ticket: string }
