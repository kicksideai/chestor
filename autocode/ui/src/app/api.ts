// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api, on } from '@wippy-fe/proxy'

const BASE = '/api/v1/autocode'

// file: the login file's path under HOME; subscription: a person's own login
// rather than an API key.
export interface CredentialKind { id: string; label: string; hint: string; file?: string; subscription: boolean }
// endpoints: protocols of custom endpoints the agent's CLI can reach.
export interface AgentInfo { id: string; title: string; credentials: CredentialKind[]; endpoints: string[] }
export interface Endpoint { protocol: string; base_url: string; model?: string }
export interface DefaultImage { ref: string; label: string; home: string; dockerfile: string }
// manage: the caller administers images, workspaces and Docker maintenance.
export interface Catalog { agents: AgentInfo[]; default_image: DefaultImage; manage: boolean }

// An account takes balanced runs while enabled and outside its cooldown; the
// day counts cover its runs in the last 24 hours. mine: the caller owns it;
// usable: the caller's runs may use it, which a subscription login allows only
// its owner; shareable: the caller may grant it to others.
export interface Account {
  id: string
  agent: string
  label: string
  credential_kind: string
  subscription: boolean
  enabled: boolean
  endpoint?: Endpoint
  owner: string
  mine: boolean
  usable: boolean
  writable: boolean
  shareable: boolean
  last_used_at: string
  cooldown_until: string
  last_error: string
  runs_day: number
  failures_day: number
}
export type AccountState = 'ready' | 'cooling' | 'disabled'

export function accountState(a: Account, now = Date.now()): AccountState {
  if (!a.enabled) return 'disabled'
  if (a.cooldown_until && Date.parse(a.cooldown_until) > now) return 'cooling'
  return 'ready'
}

// shortTime renders an RFC 3339 instant in the viewer's locale; empty stays empty.
export function shortTime(value: string): string {
  if (!value) return ''
  const at = new Date(value)
  return Number.isNaN(at.getTime()) ? value : at.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
}

// The container run settings of an image, read and written by its managers.
export interface ImageRunSettings {
  memory: string
  cpus: string
  pids_limit: number
  gpus: string
  network: string
  extra_args: string[]
  allows: string[]
}
export interface ImageSettings extends ImageRunSettings { label: string; home: string }
export type ImageStatus = 'preparing' | 'ready' | 'failed'
export interface Image {
  id: string
  ref: string
  label: string
  home: string
  status: ImageStatus
  // Driver ids whose CLI the image contains.
  agents: string[]
  last_error: string
  owner: string
  writable: boolean
  shareable: boolean
}
// dockerfile and settings: present for callers who may change the image.
export interface ImageDetail { image: Image; build_log: string; dockerfile?: string; settings?: ImageRunSettings }

// A READ grant mounts the workspace read-only and WRITE read-write; host_path
// is present for callers who may share it.
export interface Workspace { id: string; name: string; writable: boolean; shareable: boolean; host_path?: string }

export interface DriverOption {
  name: string
  label: string
  description: string
  section: string
  group: string
  order: number
  type: string
  values?: unknown[]
  default?: unknown
  profiles?: string[]
}
// unattended: option values the driver sets when no person answers prompts.
export interface DriverInfo { id: string; title: string; capabilities: string[]; unattended: Record<string, unknown> | null; options: DriverOption[] }

export type RunStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled'
export interface Run {
  id: string
  agent: string
  account_id: string
  image_id: string
  workspace_id: string
  options: Record<string, unknown>
  unattended: boolean
  repo_url: string
  prompt: string
  status: RunStatus
  result: string
  error: string
  usage: Record<string, unknown>
  cancel_requested: boolean
  timeout_ms: number
  // workflow: the run belongs to a workflow task Block.
  workflow: boolean
  created_at: string
  started_at: string
  finished_at: string
}
export interface RunEvent { seq: number; kind: string; text: string; created_at: string }

async function call<T>(method: 'get' | 'post' | 'put' | 'delete', path: string, body?: unknown): Promise<T> {
  try {
    const response = method === 'get' || method === 'delete'
      ? await api[method](BASE + path)
      : await api[method](BASE + path, body)
    const data = response.data
    if (!data?.success) throw new Error(data?.error || 'Request failed.')
    return data as T
  } catch (e: unknown) {
    const message = (e as { response?: { data?: { error?: string } } })?.response?.data?.error
    throw new Error(message || (e instanceof Error ? e.message : 'Request failed.'))
  }
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

// The kickside-share config of a component: its grants over the generic
// component access endpoints.
export interface ShareConfig { resource_id: string; access_url: string; share_url: string; title: string }
export function shareConfig(id: string, title: string): ShareConfig {
  const resource = encodeURIComponent(id)
  return {
    resource_id: id,
    access_url: `/api/v1/component-access/grants/${resource}`,
    share_url: `/api/v1/component-access/share/${resource}`,
    title,
  }
}

// grantCount counts the principals a component is shared with besides its owner.
export async function grantCount(id: string): Promise<number> {
  const { data } = await api.get(shareConfig(id, '').access_url)
  if (!data?.success) throw new Error(data?.error || 'Could not load the grants.')
  return (data.access as { owner?: boolean }[]).filter((row) => !row.owner).length
}

// principalLabels resolves user ids to display names through the principal
// directory; an id the directory does not know keeps no label.
export async function principalLabels(ids: string[]): Promise<Record<string, string>> {
  if (!ids.length) return {}
  const { data } = await api.post('/api/v1/principals/resolve', { refs: ids.map((id) => ({ type: 'user', id })) })
  if (!data?.success) throw new Error(data?.error || 'Could not resolve the owners.')
  return Object.fromEntries((data.principals as { id: string; label: string }[]).map((p) => [p.id, p.label]))
}

// errorText renders a caught error, or the fallback when it carries no message.
export function errorText(e: unknown, fallback: string): string {
  return e instanceof Error && e.message ? e.message : fallback
}

export const autocode = {
  catalog: () => call<Catalog>('get', '/catalog'),
  accounts: () => call<{ accounts: Account[] }>('get', '/accounts').then((r) => r.accounts),
  createAccount: (body: { agent: string; credential_kind: string; label: string; secret: string; endpoint?: Endpoint }) =>
    call<{ id: string }>('post', '/accounts', body),
  updateAccount: (id: string, body: { label?: string; enabled?: boolean }) => call('put', `/accounts/${id}`, body),
  deleteAccount: (id: string) => call('delete', `/accounts/${id}`),
  images: () => call<{ images: Image[] }>('get', '/images').then((r) => r.images),
  image: (id: string) => call<ImageDetail>('get', `/images/${id}`),
  createImage: (body: ImageSettings & { ref: string; dockerfile: string }) => call<{ id: string }>('post', '/images', body),
  updateImage: (id: string, body: ImageSettings) => call('put', `/images/${id}`, body),
  deleteImage: (id: string, removeFromDocker: boolean) => call('delete', `/images/${id}${removeFromDocker ? '?remove=1' : ''}`),
  prepareImage: (id: string) => call('post', `/images/${id}/prepare`),
  prune: () => call<{ output: string }>('post', '/maintenance/prune').then((r) => r.output),
  workspaces: () => call<{ workspaces: Workspace[]; roots: string[] }>('get', '/workspaces'),
  createWorkspace: (body: { name: string; host_path: string }) => call<{ id: string }>('post', '/workspaces', body),
  deleteWorkspace: (id: string) => call('delete', `/workspaces/${id}`),
  drivers: () => call<{ drivers: DriverInfo[] }>('get', '/drivers').then((r) => r.drivers),
  runs: () => call<{ runs: Run[] }>('get', '/runs').then((r) => r.runs),
  run: (id: string, after: number) => call<{ run: Run; events: RunEvent[]; more: boolean }>('get', `/runs/${id}?after=${after}`),
  startRun: (body: { agent: string; account_id: string; image_id: string; workspace_id: string; repo_url: string; prompt: string; options: Record<string, unknown>; unattended: boolean }) =>
    call<{ id: string }>('post', '/runs', body),
  cancelRun: (id: string) => call('post', `/runs/${id}/cancel`),
}
