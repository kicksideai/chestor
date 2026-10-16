// A small roadmap the lens tests share so each one states only what it is
// about. No production module imports this file.

import { emptyState, type Dependency, type Initiative, type Layer, type Milestone, type Outcome, type RoadmapState } from './types'

export function layer(id: string, title: string, sortOrder: number, color = '#64748b'): Layer {
  return { id, title, description: '', color, icon: '', sort_order: sortOrder }
}

export function outcome(id: string, title: string, sortOrder: number): Outcome {
  return { id, title, description: '', sort_order: sortOrder }
}

export function initiative(id: string, patch: Partial<Initiative> = {}): Initiative {
  return {
    id,
    title: id,
    description: '',
    layer_id: 'platform',
    outcome_id: '',
    status: 'planned',
    confidence: 'med',
    size: 'M',
    start_period: '2026-Q3',
    span: 1,
    progress: 0,
    owner: '',
    tags: [],
    properties: {},
    sort_order: 0,
    ...patch,
  }
}

export function dependency(id: string, from: string, to: string, kind: Dependency['kind'] = 'requires'): Dependency {
  return { id, from_id: from, to_id: to, kind, note: '' }
}

export function milestone(id: string, title: string, period: string, patch: Partial<Milestone> = {}): Milestone {
  return { id, title, description: '', period, layer_id: '', initiative_ids: [], ...patch }
}

export function roadmap(patch: Partial<RoadmapState> = {}): RoadmapState {
  const base = emptyState()
  return {
    ...base,
    entry_id: 'roadmap-1',
    thread_id: 'thread-1',
    settings: { period_kind: 'quarter', origin: '2026-Q3', columns: 5, default_lens: 'timeline', lens_state: {} },
    current_period: '2026-Q3',
    current_position: 0.5,
    layers: [layer('platform', 'Platform', 0), layer('kickside', 'KickSide', 1, '#16a34a'), layer('cloud', 'Cloud', 2, '#2563eb')],
    ...patch,
  }
}
