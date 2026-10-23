// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
// The contract of the chestor-autocode-driver-account element.
import type { AgentInfo, Endpoint } from './app/api.ts'

// driver: the agent and the credentials it reads; busy and error reflect the
// host's save; the host bumps saved after it stores an account.
export interface DriverAccountConfig { driver: AgentInfo; busy?: boolean; error?: string; saved?: number }
export interface DriverAccountSubmit { agent: string; credential_kind: string; label: string; secret: string; endpoint?: Endpoint }
export interface DriverAccountEvents { submit: DriverAccountSubmit }
