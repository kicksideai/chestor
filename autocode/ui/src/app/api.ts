// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'

const BASE = '/api/v1/autocode'

import { z } from 'zod'
import * as dto from './dto.ts'
import type { ImageSettings } from './dto.ts'
export type * from './dto.ts'
import type { DriverAccountSubmit } from '../driver-account-types.ts'

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

// Resolve owner labels through the platform principal directory.
export async function principalLabels(ids: string[]): Promise<Record<string, string>> {
  if (!ids.length) return {}
  const data = await request('post', '/api/v1/principals/resolve', z.object({ principals: z.array(z.object({ id: z.string(), label: z.string() })) }), { refs: ids.map(id => ({ type: 'user', id })) })
  return Object.fromEntries(data.principals.map(p => [p.id, p.label]))
}

const idResponse = z.object({ id: z.string() })
const cleanupResult = success.extend({ docker_error: errorFields.extend({ message: z.string() }).optional() })
const imageCreated = idResponse.extend({ build_error: errorFields.extend({ message: z.string() }).optional() })
export const autocode = {
  catalog: () => call('get', '/catalog', dto.catalog),
  accounts: () => call('get', '/accounts', z.object({ accounts: z.array(dto.account) })).then(r => r.accounts),
  createAccount: (body: DriverAccountSubmit) => call('post', '/accounts', idResponse, body),
  updateAccount: (id: string, body: { label?: string; enabled?: boolean; secret?: string; endpoint?: { base_url: string; protocol?: string; model?: string } }) => call('put', `/accounts/${encodeURIComponent(id)}`, idResponse.extend({ health_error: errorFields.extend({ message: z.string() }).optional() }), body),
  deleteAccount: (id: string) => call('delete', `/accounts/${encodeURIComponent(id)}`, success),
  images: () => call('get', '/images', z.object({ images: z.array(dto.image) })).then(r => r.images),
  image: (id: string) => call('get', `/images/${encodeURIComponent(id)}`, dto.imageDetail),
  createImage: (body: ImageSettings & { ref: string; dockerfile: string }) => call('post', '/images', imageCreated, body),
  updateImage: (id: string, body: ImageSettings & { ref: string; dockerfile: string }) => call('put', `/images/${encodeURIComponent(id)}`, imageCreated, body),
  deleteImage: (id: string, removeFromDocker: boolean) => call('delete', `/images/${encodeURIComponent(id)}${removeFromDocker ? '?remove=1' : ''}`, cleanupResult),
  prepareImage: (id: string) => call('post', `/images/${encodeURIComponent(id)}/prepare`, success),
  prune: () => call('post', '/maintenance/prune', z.object({ output: z.string() })).then(r => r.output),
  workspaces: () => call('get', '/workspaces', z.object({ workspaces: z.array(dto.workspace), roots: z.array(z.string()).optional() })),
  createWorkspace: (body: { name: string; host_path: string }) => call('post', '/workspaces', idResponse, body),
  deleteWorkspace: (id: string) => call('delete', `/workspaces/${encodeURIComponent(id)}`, success),
  runs: (cursor?: string) => call('get', `/runs${cursor ? '?cursor=' + encodeURIComponent(cursor) : ''}`, z.object({ runs: z.array(dto.runSummary), next_cursor: z.string().optional() })),
  run: (id: string, afterSeq?: number, beforeSeq?: number) => call('get', `/runs/${encodeURIComponent(id)}?${beforeSeq === undefined ? `after_seq=${afterSeq ?? 0}` : `before_seq=${beforeSeq}`}`, dto.runPage),
  startRun: (body: { idempotency_key?: string; agent: string; account_id: string; image_id: string; workspace_id: string; repo_url: string; repo_ref?: string; timeout?: string; prompt: string; options: Record<string, unknown>; unattended: boolean }) => call('post', '/runs', z.object({ run_id: z.string() }), body),
  cancelRun: (id: string) => call('post', `/runs/${encodeURIComponent(id)}/cancel`, success),
}
