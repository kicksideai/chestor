// The strata lens: layers stacked as what the product stands on. `sort_order`
// runs bottom→top (the platform is 0), so the render order is its reverse and
// the foundation ends up drawn at the bottom of the frame.

import { buildConnectors, type Connector } from './connectors'
import { periodIndex } from './periods'
import type { Dependency, Initiative, Layer, Rect, RoadmapState } from './types'

export interface Band {
  layer: Layer
  initiatives: Initiative[]
}

export interface StrataOptions {
  includeDropped?: boolean
  /** Order a band by how much each bet blocks rather than by its date. */
  rank?: Map<string, number>
}

/** Bands in render order — top of the frame first, foundation last. */
export function strataBands(state: RoadmapState, options: StrataOptions = {}): Band[] {
  const kind = state.settings.period_kind
  const layers = [...state.layers].sort((a, b) => b.sort_order - a.sort_order || b.title.localeCompare(a.title))
  const rank = options.rank
  return layers.map(layer => {
    const initiatives = state.initiatives
      .filter(i => i.layer_id === layer.id && (options.includeDropped || i.status !== 'dropped'))
      .sort((a, b) => {
        if (rank) {
          const diff = (rank.get(b.id) ?? 0) - (rank.get(a.id) ?? 0)
          if (diff) return diff
        }
        const ai = periodIndex(a.start_period, kind)
        const bi = periodIndex(b.start_period, kind)
        if (ai !== bi) return (ai ?? Number.MAX_SAFE_INTEGER) - (bi ?? Number.MAX_SAFE_INTEGER)
        return a.sort_order - b.sort_order || a.title.localeCompare(b.title)
      })
    return { layer, initiatives }
  })
}

/** Every hard edge, faint behind the pills; `informs` is drawn softer still. */
export function strataEdges(dependencies: Dependency[], options: { includeInforms?: boolean } = {}): Dependency[] {
  return (dependencies || []).filter(dep => dep.kind === 'requires' || (options.includeInforms && dep.kind === 'informs'))
}

/** Arrows for every drawn edge; the chain of the selection is drawn hot. */
export function strataConnectors(edges: Dependency[], rects: Map<string, Rect>, chain?: Set<string>): Connector[] {
  return buildConnectors(edges, rects, { orientation: 'vertical', chain })
}
