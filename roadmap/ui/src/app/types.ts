// Client model for the roadmap snapshot. The server answers with every
// collection present and every scalar filled, so nothing here is optional
// beyond the fields the domain itself leaves open.

export type Status = 'idea' | 'planned' | 'active' | 'done' | 'dropped'
export type Confidence = 'low' | 'med' | 'high'
export type Size = 'S' | 'M' | 'L' | 'XL'
export type DependencyKind = 'requires' | 'informs'
export type PeriodKind = 'quarter' | 'month'
export type Lens = 'timeline' | 'horizons' | 'strata' | 'outcomes'
export type Horizon = 'past' | 'now' | 'next' | 'later'

export const STATUSES: readonly Status[] = ['idea', 'planned', 'active', 'done', 'dropped']
export const CONFIDENCES: readonly Confidence[] = ['low', 'med', 'high']
export const SIZES: readonly Size[] = ['S', 'M', 'L', 'XL']
export const DEPENDENCY_KINDS: readonly DependencyKind[] = ['requires', 'informs']
export const PERIOD_KINDS: readonly PeriodKind[] = ['quarter', 'month']
export const LENSES: readonly Lens[] = ['timeline', 'horizons', 'strata', 'outcomes']

export interface Layer {
  id: string
  title: string
  description: string
  color: string
  icon: string
  sort_order: number
}

export interface Outcome {
  id: string
  title: string
  description: string
  sort_order: number
}

export interface Initiative {
  id: string
  title: string
  description: string
  layer_id: string
  outcome_id: string
  status: Status
  confidence: Confidence
  size: Size
  start_period: string
  span: number
  progress: number
  owner: string
  tags: string[]
  properties: Record<string, unknown>
  sort_order: number
}

export interface Dependency {
  id: string
  from_id: string
  to_id: string
  kind: DependencyKind
  note: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  period: string
  layer_id: string
  initiative_ids: string[]
}

export interface Settings {
  period_kind: PeriodKind
  origin: string
  columns: number
  default_lens: Lens
  lens_state: Record<string, Record<string, unknown>>
}

export interface Counts {
  layers: number
  outcomes: number
  initiatives: number
  dependencies: number
  milestones: number
}

export interface RoadmapState {
  entry_id: string
  thread_id: string
  settings: Settings
  current_period: string
  /**
   * How far UTC now sits inside `current_period`, 0 at its start and 1 at its
   * end. A snapshot taken before the server computed it leaves the field out
   * and the today marker falls back to the centre of the period column.
   */
  current_position?: number
  layers: Layer[]
  outcomes: Outcome[]
  initiatives: Initiative[]
  dependencies: Dependency[]
  milestones: Milestone[]
  counts: Counts
  can_undo: boolean
  can_redo: boolean
}

// A measured box in the lens container's own coordinate space; the lenses
// hand these to the connector builders after layout so arrows follow the
// rendered geometry rather than a second guess at it.
export interface Rect {
  id: string
  x: number
  y: number
  width: number
  height: number
}

// The command vocabulary is the event vocabulary; these are the fully
// qualified types the apply endpoint validates against.
export const EV = {
  LAYER_ADDED: 'chestor.roadmap.events:layer.added',
  LAYER_UPDATED: 'chestor.roadmap.events:layer.updated',
  LAYER_REMOVED: 'chestor.roadmap.events:layer.removed',
  OUTCOME_ADDED: 'chestor.roadmap.events:outcome.added',
  OUTCOME_UPDATED: 'chestor.roadmap.events:outcome.updated',
  OUTCOME_REMOVED: 'chestor.roadmap.events:outcome.removed',
  INITIATIVE_ADDED: 'chestor.roadmap.events:initiative.added',
  INITIATIVE_UPDATED: 'chestor.roadmap.events:initiative.updated',
  INITIATIVE_REMOVED: 'chestor.roadmap.events:initiative.removed',
  DEPENDENCY_ADDED: 'chestor.roadmap.events:dependency.added',
  DEPENDENCY_UPDATED: 'chestor.roadmap.events:dependency.updated',
  DEPENDENCY_REMOVED: 'chestor.roadmap.events:dependency.removed',
  MILESTONE_ADDED: 'chestor.roadmap.events:milestone.added',
  MILESTONE_UPDATED: 'chestor.roadmap.events:milestone.updated',
  MILESTONE_REMOVED: 'chestor.roadmap.events:milestone.removed',
  SETTINGS_UPDATED: 'chestor.roadmap.events:roadmap.settings-updated',
  LENS_STATE_SET: 'chestor.roadmap.events:roadmap.lens-state-set',
} as const

export const PROJECTION_KIND = 'chestor.roadmap:state'

export const DEFAULT_SETTINGS: Settings = {
  period_kind: 'quarter',
  origin: '',
  columns: 5,
  default_lens: 'timeline',
  lens_state: {},
}

export function emptyState(): RoadmapState {
  return {
    entry_id: '',
    thread_id: '',
    settings: { ...DEFAULT_SETTINGS },
    current_period: '',
    layers: [],
    outcomes: [],
    initiatives: [],
    dependencies: [],
    milestones: [],
    counts: { layers: 0, outcomes: 0, initiatives: 0, dependencies: 0, milestones: 0 },
    can_undo: false,
    can_redo: false,
  }
}
