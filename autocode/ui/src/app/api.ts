// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api, on } from '@wippy-fe/proxy'

const BASE = '/api/v1/autocode'

import { z } from 'zod'
import * as dto from './dto.ts'
import type { Account, Endpoint, ImageSettings } from './dto.ts'
export type * from './dto.ts'

export type AccountState = 'ready' | 'cooling' | 'disabled' | 'unavailable'
export function accountState(a: Account, now = Date.now()): AccountState {
  if (!a.enabled) return 'disabled'
  if (a.cooldown_until && Date.parse(a.cooldown_until) > now) return 'cooling'
  return a.usable ? 'ready' : 'unavailable'
}

export function shortTime(value: string): string {
  if (!value) return ''
  const at = new Date(value)
  return Number.isNaN(at.getTime()) ? value : at.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
}

const errorFields = z.object({ kind: z.string().optional(), code: z.string().optional(), retryable: z.boolean().optional(), details: z.record(z.unknown()).optional() })
const failure = errorFields.extend({ success: z.literal(false), error: z.union([z.string(), errorFields.extend({ message: z.string() })]) })
export class ApiError extends Error {
  readonly kind?: string
  readonly code?: string
  readonly retryable?: boolean
  readonly details?: Record<string, unknown>
  constructor(message: string, fields: z.infer<typeof errorFields>) {
    super(message)
    this.name = 'ApiError'
    this.kind = fields.kind
    this.details = fields.details
    this.code = fields.code ?? (typeof fields.details?.code === 'string' ? fields.details.code : undefined)
    this.retryable = fields.retryable
  }
}
function apiFailure(data: unknown): ApiError | undefined {
  const decoded = failure.safeParse(data)
  if (!decoded.success) return
  const f = decoded.data
  return typeof f.error === 'string' ? new ApiError(f.error, f) : new ApiError(f.error.message, { ...f, ...f.error })
}
const success = z.object({ success: z.literal(true) })
function decode<T>(data: unknown, schema: z.ZodType<T>): T {
  const error = apiFailure(data)
  if (error) throw error
  success.parse(data)
  const result = schema.safeParse(data)
  if (!result.success) throw new Error(`Invalid API response: ${result.error.issues.map(i => i.path.join('.') + ': ' + i.message).join('; ')}`)
  return result.data
}
async function request<T>(method: 'get' | 'post' | 'put' | 'delete', path: string, schema: z.ZodType<T>, body?: unknown): Promise<T> {
  try {
    const response = method === 'get' || method === 'delete' ? await api[method](path) : await api[method](path, body)
    const data: unknown = response.data
    return decode(data, schema)
  } catch (e: unknown) {
    const http = z.object({ response: z.object({ data: z.unknown() }) }).safeParse(e)
    if (http.success) throw apiFailure(http.data.response.data) ?? new Error('Invalid API error response.')
    throw e instanceof Error ? e : new Error('Request failed.')
  }
}
function call<T>(method: 'get' | 'post' | 'put' | 'delete', path: string, schema: z.ZodType<T>, body?: unknown) {
  return request(method, BASE + path, schema, body)
}

// Live update topics: the runner names what changed, the view refetches it.
// An account, image or workspace is a component; its public meta changes
// arrive on its component topic.
export const live = {
  runs: (handler: () => void) => on('chestor.autocode.runs', handler),
  run: (id: string, handler: () => void) => on(`chestor.autocode.run.${id}`, handler),
  component: (id: string, handler: () => void) => on(`component.${id}`, handler),
}

// serial runs task one pass at a time: a request while a pass runs queues one
// more pass, and every caller awaits the pass that covers its request.
export function serial(task: () => Promise<void>): () => Promise<void> {
  let current: Promise<void> | null = null
  let again = false
  const run = async () => {
    try {
      do { again = false; await task() } while (again)
    } finally {
      current = null
    }
  }
  return () => {
    if (current) { again = true; return current }
    current = run()
    return current
  }
}

// Resolve owner labels through the platform principal directory.
export async function principalLabels(ids: string[]): Promise<Record<string, string>> {
  if (!ids.length) return {}
  const data = await request('post', '/api/v1/principals/resolve', z.object({ principals: z.array(z.object({ id: z.string(), label: z.string() })) }), { refs: ids.map(id => ({ type: 'user', id })) })
  return Object.fromEntries(data.principals.map(p => [p.id, p.label]))
}

// errorText renders a caught error, or the fallback when it carries no message.
export function errorText(e: unknown, fallback: string): string {
  return e instanceof Error && e.message ? e.message : fallback
}

const idResponse = z.object({ id: z.string() })
const imageCreated = idResponse.extend({ build_error: errorFields.extend({ message: z.string() }).optional() })
export const autocode = {
  catalog: () => call('get', '/catalog', dto.catalog),
  accounts: () => call('get', '/accounts', z.object({ accounts: z.array(dto.account) })).then(r => r.accounts),
  createAccount: (body: { agent: string; credential_kind: string; label: string; secret: string; endpoint?: Endpoint }) => call('post', '/accounts', idResponse, body),
  updateAccount: (id: string, body: { label?: string; enabled?: boolean }) => call('put', `/accounts/${encodeURIComponent(id)}`, success, body),
  deleteAccount: (id: string) => call('delete', `/accounts/${encodeURIComponent(id)}`, success),
  images: () => call('get', '/images', z.object({ images: z.array(dto.image) })).then(r => r.images),
  image: (id: string) => call('get', `/images/${encodeURIComponent(id)}`, dto.imageDetail),
  createImage: (body: ImageSettings & { ref: string; dockerfile: string }) => call('post', '/images', imageCreated, body),
  updateImage: (id: string, body: ImageSettings) => call('put', `/images/${encodeURIComponent(id)}`, success, body),
  deleteImage: (id: string, removeFromDocker: boolean) => call('delete', `/images/${encodeURIComponent(id)}${removeFromDocker ? '?remove=1' : ''}`, success),
  prepareImage: (id: string) => call('post', `/images/${encodeURIComponent(id)}/prepare`, success),
  prune: () => call('post', '/maintenance/prune', z.object({ output: z.string() })).then(r => r.output),
  workspaces: () => call('get', '/workspaces', z.object({ workspaces: z.array(dto.workspace), roots: z.array(z.string()).optional() })),
  createWorkspace: (body: { name: string; host_path: string }) => call('post', '/workspaces', idResponse, body),
  deleteWorkspace: (id: string) => call('delete', `/workspaces/${encodeURIComponent(id)}`, success),
  drivers: () => call('get', '/drivers', z.object({ drivers: z.array(dto.driverInfo) })).then(r => r.drivers),
  runs: (cursor?: string) => call('get', `/runs${cursor ? '?cursor=' + encodeURIComponent(cursor) : ''}`, z.object({ runs: z.array(dto.runSummary), next_cursor: z.string().optional() })),
  run: (id: string, afterSeq: number) => call('get', `/runs/${encodeURIComponent(id)}?after_seq=${afterSeq}`, dto.runPage),
  startRun: (body: { agent: string; account_id: string; image_id: string; workspace_id: string; repo_url: string; prompt: string; options: Record<string, unknown>; unattended: boolean }) => call('post', '/runs', z.object({ run_id: z.string() }), body),
  cancelRun: (id: string) => call('post', `/runs/${encodeURIComponent(id)}/cancel`, success),
}
