// Pure builders for the {type, body} envelope the roadmap backend accepts at
// POST /workspace/roadmaps/{id}/apply. The client mints ids for every add: the
// command vocabulary is the event vocabulary and ids are caller-supplied.

import { EV, type DependencyKind, type Lens, type Settings } from './types'

export interface Command {
  type: string
  body: Record<string, unknown>
}

export function uid(): string {
  const c = (globalThis as { crypto?: Crypto }).crypto
  return c && typeof c.randomUUID === 'function' ? c.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// ── Layers ──
export function addLayer(opts: { id?: string; title: string; description?: string; color?: string; icon?: string; sortOrder?: number }): Command {
  const body: Record<string, unknown> = { id: opts.id || uid(), title: opts.title }
  if (opts.description) body.description = opts.description
  if (opts.color) body.color = opts.color
  if (opts.icon) body.icon = opts.icon
  if (opts.sortOrder !== undefined) body.sort_order = opts.sortOrder
  return { type: EV.LAYER_ADDED, body }
}

export function updateLayer(id: string, patch: Record<string, unknown>): Command {
  return { type: EV.LAYER_UPDATED, body: { id, ...patch } }
}

export function removeLayer(id: string): Command {
  return { type: EV.LAYER_REMOVED, body: { id } }
}

// ── Outcomes ──
export function addOutcome(opts: { id?: string; title: string; description?: string; sortOrder?: number }): Command {
  const body: Record<string, unknown> = { id: opts.id || uid(), title: opts.title }
  if (opts.description) body.description = opts.description
  if (opts.sortOrder !== undefined) body.sort_order = opts.sortOrder
  return { type: EV.OUTCOME_ADDED, body }
}

export function updateOutcome(id: string, patch: Record<string, unknown>): Command {
  return { type: EV.OUTCOME_UPDATED, body: { id, ...patch } }
}

export function removeOutcome(id: string): Command {
  return { type: EV.OUTCOME_REMOVED, body: { id } }
}

// ── Initiatives ──
export interface AddInitiative {
  id?: string
  title: string
  layerId: string
  description?: string
  outcomeId?: string
  status?: string
  confidence?: string
  size?: string
  startPeriod?: string
  span?: number
  progress?: number
  owner?: string
  tags?: string[]
  properties?: Record<string, unknown>
  sortOrder?: number
}

export function addInitiative(opts: AddInitiative): Command {
  const body: Record<string, unknown> = { id: opts.id || uid(), title: opts.title, layer_id: opts.layerId }
  if (opts.description) body.description = opts.description
  if (opts.outcomeId) body.outcome_id = opts.outcomeId
  if (opts.status) body.status = opts.status
  if (opts.confidence) body.confidence = opts.confidence
  if (opts.size) body.size = opts.size
  if (opts.startPeriod) body.start_period = opts.startPeriod
  if (opts.span !== undefined) body.span = opts.span
  if (opts.progress !== undefined) body.progress = opts.progress
  if (opts.owner) body.owner = opts.owner
  if (opts.tags) body.tags = opts.tags
  if (opts.properties) body.properties = opts.properties
  if (opts.sortOrder !== undefined) body.sort_order = opts.sortOrder
  return { type: EV.INITIATIVE_ADDED, body }
}

export function updateInitiative(id: string, patch: Record<string, unknown>): Command {
  return { type: EV.INITIATIVE_UPDATED, body: { id, ...patch } }
}

/** The drag/move event: one initiative moved, resized, or dropped into a lane. */
export function placeInitiative(id: string, place: { startPeriod?: string; span?: number; layerId?: string }): Command {
  const body: Record<string, unknown> = { id }
  if (place.startPeriod !== undefined) body.start_period = place.startPeriod
  if (place.span !== undefined) body.span = Math.max(1, Math.round(place.span))
  if (place.layerId !== undefined) body.layer_id = place.layerId
  return { type: EV.INITIATIVE_UPDATED, body }
}

export function removeInitiative(id: string): Command {
  return { type: EV.INITIATIVE_REMOVED, body: { id } }
}

// ── Dependencies ──
export function addDependency(opts: { id?: string; fromId: string; toId: string; kind?: DependencyKind; note?: string }): Command {
  const body: Record<string, unknown> = { id: opts.id || uid(), from_id: opts.fromId, to_id: opts.toId }
  if (opts.kind) body.kind = opts.kind
  if (opts.note) body.note = opts.note
  return { type: EV.DEPENDENCY_ADDED, body }
}

export function updateDependency(id: string, patch: Record<string, unknown>): Command {
  return { type: EV.DEPENDENCY_UPDATED, body: { id, ...patch } }
}

export function removeDependency(id: string): Command {
  return { type: EV.DEPENDENCY_REMOVED, body: { id } }
}

// ── Milestones ──
export function addMilestone(opts: { id?: string; title: string; period: string; description?: string; layerId?: string; initiativeIds?: string[] }): Command {
  const body: Record<string, unknown> = { id: opts.id || uid(), title: opts.title, period: opts.period }
  if (opts.description) body.description = opts.description
  if (opts.layerId) body.layer_id = opts.layerId
  if (opts.initiativeIds) body.initiative_ids = opts.initiativeIds
  return { type: EV.MILESTONE_ADDED, body }
}

export function updateMilestone(id: string, patch: Record<string, unknown>): Command {
  return { type: EV.MILESTONE_UPDATED, body: { id, ...patch } }
}

export function removeMilestone(id: string): Command {
  return { type: EV.MILESTONE_REMOVED, body: { id } }
}

// ── Roadmap ──
export function updateSettings(patch: Partial<Pick<Settings, 'period_kind' | 'origin' | 'columns' | 'default_lens'>>): Command {
  return { type: EV.SETTINGS_UPDATED, body: { settings: { ...patch } } }
}

export function setLensState(lens: Lens, state: Record<string, unknown>): Command {
  return { type: EV.LENS_STATE_SET, body: { lens, state } }
}
