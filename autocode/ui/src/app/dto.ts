// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { z } from 'zod'

const strings = z.array(z.string())
const values = z.record(z.unknown())
export const credentialKind = z.object({ id: z.string(), label: z.string(), hint: z.string(), file: z.string().optional(), subscription: z.boolean(), format: z.enum(['json_object', 'single_line', 'text']).optional() })
export const agentInfo = z.object({ id: z.string(), title: z.string(), icon: z.string().optional(), credentials: z.array(credentialKind), endpoints: strings })
export const endpoint = z.object({ protocol: z.string(), base_url: z.string(), model: z.string().optional() })
export const imageRunSettings = z.object({ memory: z.string(), cpus: z.string(), pids_limit: z.number().int(), gpus: z.string(), network: z.string(), extra_args: strings, allows: strings })
export const defaultImage = z.object({ ref: z.string(), label: z.string(), home: z.string(), dockerfile: z.string(), settings: imageRunSettings.optional() })
export const accountLimits = z.object({ label_bytes: z.number().int().positive(), secret_bytes: z.number().int().positive(), endpoint_url_bytes: z.number().int().positive(), endpoint_model_bytes: z.number().int().positive() })
export type AccountLimits = z.infer<typeof accountLimits>
export const catalog = z.object({ agents: z.array(agentInfo), default_image: defaultImage, manage: z.boolean(), settings_path: z.string().optional(), account_limits: accountLimits.optional() })
export const account = z.object({
  id: z.string(), agent: z.string(), label: z.string(), credential_kind: z.string(), subscription: z.boolean(), enabled: z.boolean(),
  endpoint: endpoint.optional(), owner: z.string(), mine: z.boolean(), usable: z.boolean(), unavailable_reason: z.string().optional(),
  writable: z.boolean(), deletable: z.boolean(), last_used_at: z.string(), cooldown_until: z.string(), last_error: z.string(), runs_day: z.number().int(), failures_day: z.number().int(),
})
// Component metadata may contain an unrecognised image status.
export const image = z.object({ id: z.string(), ref: z.string(), label: z.string(), home: z.string(), status: z.string(), agents: strings, last_error: z.string(), owner: z.string(), writable: z.boolean(), deletable: z.boolean() })
export const imageDetail = z.object({ image, build_log: z.string(), dockerfile: z.string().optional(), settings: imageRunSettings.optional() })
export const workspace = z.object({ id: z.string(), name: z.string(), writable: z.boolean(), deletable: z.boolean(), host_path: z.string().optional() })
export const driverOption = z.object({ name: z.string(), label: z.string(), description: z.string(), section: z.string(), group: z.string(), order: z.number(), type: z.string(), values: z.array(z.unknown()).optional(), schema: values.optional(), default: z.unknown().optional(), profiles: strings.optional() })
export const driverInfo = z.object({ id: z.string(), title: z.string(), icon: z.string(), capabilities: strings, unattended: values.optional(), options: z.array(driverOption) })
export const usage = z.object({ input_tokens: z.number().optional(), output_tokens: z.number().optional(), cached_tokens: z.number().optional() })
export const runStatus = z.enum(['queued', 'running', 'succeeded', 'failed', 'cancelled'])
export const run = z.object({
  id: z.string(), agent: z.string(), account_id: z.string(), image_id: z.string(), workspace_id: z.string().optional(), options: values, unattended: z.boolean(), repo_url: z.string(), prompt: z.string(), status: runStatus, result: z.string(), error: z.string(), usage, cancel_requested: z.boolean(), timeout_ms: z.number(), workflow: z.boolean(), created_at: z.string(), started_at: z.string(), finished_at: z.string(),
})
export const runEvent = z.object({ seq: z.number().int(), kind: z.enum(['assistant', 'reasoning', 'tool', 'tool_result', 'tool_error', 'system', 'error', 'log']), text: z.string(), created_at: z.string() })

export type CredentialKind = z.infer<typeof credentialKind>
export type AgentInfo = z.infer<typeof agentInfo>
export type Endpoint = z.infer<typeof endpoint>
export type DefaultImage = z.infer<typeof defaultImage>
export type Catalog = z.infer<typeof catalog>
export type Account = z.infer<typeof account>
export type ImageRunSettings = z.infer<typeof imageRunSettings>
export type ImageSettings = ImageRunSettings & { label: string; home: string }
export type Image = z.infer<typeof image>
export type ImageDetail = z.infer<typeof imageDetail>
export type Workspace = z.infer<typeof workspace>
export type DriverOption = z.infer<typeof driverOption>
export type DriverInfo = z.infer<typeof driverInfo>
export type Usage = z.infer<typeof usage>
export type RunStatus = z.infer<typeof runStatus>
export type Run = z.infer<typeof run>
export type RunEvent = z.infer<typeof runEvent>
