// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
// The contract of the chestor-autocode-driver-account element.
import { z } from 'zod'
import { accountLimits, agentInfo, endpoint } from './app/dto.ts'

// driver: the agent and the credentials it reads; busy and error reflect the
// host's save; the host bumps saved after it stores an account.
export const driverAccountConfig = z.object({
  driver: agentInfo,
  busy: z.boolean().optional(), error: z.string().optional(), saved: z.number().optional(), limits: accountLimits.optional(),
  account: z.object({ id: z.string(), label: z.string(), credential_kind: z.string(), endpoint: endpoint.optional() }).optional(),
})
export type DriverAccountConfig = z.infer<typeof driverAccountConfig>
export type DriverAccountSubmit = z.infer<typeof accountSubmission>
export interface DriverAccountEvents { submit: DriverAccountSubmit }

export const accountSubmission = z.object({ agent: z.string(), credential_kind: z.string(), label: z.string(), secret: z.string(), endpoint: endpoint.optional() })
