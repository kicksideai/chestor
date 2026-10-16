import { api } from '@wippy-fe/proxy'
import type { Command } from './commands'
import type { RoadmapState } from './types'

/**
 * Human error surface. The server's own `error` string is already written for
 * a reader ("layer still referenced by 3 initiatives"), so it wins; transport
 * text like "Request failed with status code 400" never reaches the banner.
 */
export function humanError(err: unknown, fallback: string): string {
  const value = err as { response?: { data?: { error?: unknown } }; data?: { error?: unknown }; message?: unknown }
  const server = value?.response?.data?.error ?? value?.data?.error
  const raw = typeof server === 'string' && server
    ? server
    : (typeof value?.message === 'string' && value.message && !/status code|request failed/i.test(value.message) ? value.message : '')
  if (!raw) return fallback
  if (/nothing to undo/i.test(raw)) return 'Nothing to undo.'
  if (/nothing to redo/i.test(raw)) return 'Nothing to redo.'
  return raw
}

export class RoadmapApi {
  constructor(private readonly roadmapId: string) {}

  private base(): string { return `/api/v1/workspace/roadmaps/${this.roadmapId}` }

  /** The full snapshot: settings, every collection, current period, history position. */
  async state(): Promise<RoadmapState> {
    try {
      const { data } = await api.get(this.base())
      if (!data.success) throw new Error(data.error || 'failed to load the roadmap')
      return data.roadmap
    } catch (err) { throw new Error(humanError(err, 'Couldn’t load the roadmap.')) }
  }

  /** One validated batch; the whole batch fails or the whole batch lands. */
  async apply(commands: Command[]): Promise<RoadmapState> {
    try {
      const { data } = await api.post(`${this.base()}/apply`, { commands })
      if (!data.success) throw new Error(data.error || 'apply failed')
      return data.roadmap
    } catch (err) { throw new Error(humanError(err, 'Couldn’t save the change.')) }
  }

  async undo(): Promise<RoadmapState> {
    try {
      const { data } = await api.post(`${this.base()}/undo`, {})
      if (!data.success) throw new Error(data.error || 'undo failed')
      return data.roadmap
    } catch (err) { throw new Error(humanError(err, 'Nothing to undo.')) }
  }

  async redo(): Promise<RoadmapState> {
    try {
      const { data } = await api.post(`${this.base()}/redo`, {})
      if (!data.success) throw new Error(data.error || 'redo failed')
      return data.roadmap
    } catch (err) { throw new Error(humanError(err, 'Nothing to redo.')) }
  }
}
