import { MarkerType } from '@vue-flow/core'
import type { Edge as FlowEdge, Node as FlowNode } from '@vue-flow/core'
import dagre from '@dagrejs/dagre'
import type { FlatGraph, GraphEdge, GraphMaterial, GraphNode, GraphState, GraphTypeDef, LayoutPosition } from './types'

const DEFAULT_NODE_COLOR = 'var(--p-primary-color)'
const DEFAULT_EDGE_COLOR = 'var(--p-text-muted-color)'
const DEFAULT_NODE_W = 210
const DEFAULT_NODE_H = 104

const CHILD_PAD = 30
const CHILD_PAD_TOP = 42
const CHILD_GAP_X = 20
const CHILD_GAP_Y = 20
const CHILD_ROW_H = 108

export interface HandleDef { id: string; type: 'source' | 'target'; side: 'top' | 'bottom' | 'left' | 'right' }

export const DEFAULT_HANDLES: HandleDef[] = [
  { id: 'top', type: 'target', side: 'top' },
  { id: 'bottom', type: 'source', side: 'bottom' },
  { id: 'left', type: 'target', side: 'left' },
  { id: 'right', type: 'source', side: 'right' },
]

export const ROUTE_CYCLE = ['default', 'smoothstep', 'step', 'straight'] as const

// Namespace for view-only portal stubs. A canvas id under this prefix never
// corresponds to a persisted node and must never reach a graph command.
export const PORTAL_PREFIX = 'portal:'
export function isPortalStub(id: string): boolean {
  return id.startsWith(PORTAL_PREFIX)
}

export function flattenGraph(nodes: GraphNode[]): FlatGraph {
  const flat: GraphNode[] = []
  const nodeById = new Map<string, GraphNode>()
  const childrenByParent = new Map<string, GraphNode[]>()

  function walk(list: GraphNode[], parentId = '') {
    for (const node of list || []) {
      const normalized: GraphNode = { ...node, parent_id: node.parent_id || parentId || undefined }
      flat.push(normalized)
      nodeById.set(normalized.id, normalized)
      const key = normalized.parent_id || ''
      if (!childrenByParent.has(key)) childrenByParent.set(key, [])
      childrenByParent.get(key)!.push(normalized)
      if (node.children?.length) walk(node.children, node.id)
    }
  }

  walk(nodes || [])
  return { nodes: flat, nodeById, childrenByParent }
}

export function typeMap(defs: GraphTypeDef[]): Map<string, GraphTypeDef> {
  return new Map((defs || []).map(def => [def.id, def]))
}

export function colorFor(defs: Map<string, GraphTypeDef>, type: string, fallback = DEFAULT_NODE_COLOR): string {
  const def = defs.get(type)
  return String(def?.color || def?.stroke || fallback)
}

export function titleFor(defs: Map<string, GraphTypeDef>, type: string): string {
  return String(defs.get(type)?.title || type || 'Node')
}

export function nodeColor(node: GraphNode, nodeTypes: Map<string, GraphTypeDef>): string {
  return String(node.properties?.accent || node.properties?.color || colorFor(nodeTypes, node.type))
}

// Tint the node body / border off its accent so palettes read as a family.
export function accentToBg(accent: string): string {
  return `color-mix(in srgb, ${accent} 8%, var(--kg-panel))`
}
export function accentToBorder(accent: string): string {
  return `color-mix(in srgb, ${accent} 38%, var(--kg-line))`
}

// Handles persist in node.properties.handles as a JSON string (the panel's
// port editor writes JSON.stringify), so the reader accepts both the parsed
// array and the serialized form. Removing the string branch orphans every
// stored port layout.
export function parseHandles(raw: unknown): HandleDef[] {
  if (Array.isArray(raw)) return raw as HandleDef[]
  if (typeof raw === 'string' && raw) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed as HandleDef[]
    } catch (cause) { throw new Error('Node ports are unavailable.', { cause }) }
  }
  return DEFAULT_HANDLES
}

function materialDisplay(mat: GraphMaterial, materialTypes: Map<string, GraphTypeDef>): string {
  const def = materialTypes.get(mat.kind)
  return String(def?.display || 'panel')
}

export interface NodeBadge { kind: string; text: string; color: string }

export function nodeBadges(materials: GraphMaterial[], materialTypes: Map<string, GraphTypeDef>): NodeBadge[] {
  const out: NodeBadge[] = []
  for (const m of materials || []) {
    const display = materialDisplay(m, materialTypes)
    if (display !== 'badge' && display !== 'both') continue
    const def = materialTypes.get(m.kind)
    out.push({ kind: m.kind, text: m.title || def?.title || m.kind, color: String(def?.color || 'var(--p-text-muted-color)') })
  }
  return out
}

// Materials whose content only shows in the side panel — surfaced as a
// paperclip count on the node so hidden body content is not silently lost.
export function panelMaterialCount(materials: GraphMaterial[], materialTypes: Map<string, GraphTypeDef>): number {
  let n = 0
  for (const m of materials || []) {
    const display = materialDisplay(m, materialTypes)
    if (display === 'panel' || display === 'both') n += 1
  }
  return n
}

function positionFor(state: GraphState, node: GraphNode, index: number): LayoutPosition {
  const saved = state.layout?.positions?.[node.id] || node.layout
  if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') return saved
  return { x: 40 + (index % 4) * 280, y: 40 + Math.floor(index / 4) * 180 }
}

function nodeWidth(node: GraphNode): number {
  return Number(node.properties?.width || node.layout?.width || DEFAULT_NODE_W)
}

function flowNodeData(node: GraphNode, children: GraphNode[], nodeTypes: Map<string, GraphTypeDef>, materialTypes: Map<string, GraphTypeDef>) {
  const accent = nodeColor(node, nodeTypes)
  const materials = node.materials || []
  return {
    label: node.name,
    description: node.description || '',
    nodeType: node.type,
    typeLabel: titleFor(nodeTypes, node.type),
    color: accent,
    bg: accentToBg(accent),
    border: accentToBorder(accent),
    tags: node.tags || [],
    status: node.status || '',
    hasChildren: children.length > 0,
    childCount: children.length,
    materialCount: panelMaterialCount(materials, materialTypes),
    badges: nodeBadges(materials, materialTypes),
    width: nodeWidth(node),
    radius: Number(node.properties?.radius ?? 6),
    borderStyle: String(node.properties?.style || 'solid'),
    animation: String(node.properties?.animation || ''),
    handles: parseHandles(node.properties?.handles),
  }
}

export function buildBoundary(state: GraphState, node: GraphNode, children: GraphNode[], pos: LayoutPosition, nodeTypes: Map<string, GraphTypeDef>, materialTypes: Map<string, GraphTypeDef>): FlowNode[] {
  const saved = state.layout?.positions || {}
  const accent = nodeColor(node, nodeTypes)
  const cols = Math.max(1, Math.min(children.length, 3))
  const childPos: LayoutPosition[] = []
  let autoIdx = 0
  for (const c of children) {
    if (saved[c.id]) childPos.push(saved[c.id])
    else {
      const col = autoIdx % cols
      const row = Math.floor(autoIdx / cols)
      childPos.push({ x: CHILD_PAD + col * (DEFAULT_NODE_W + CHILD_GAP_X), y: CHILD_PAD_TOP + row * (CHILD_ROW_H + CHILD_GAP_Y) })
      autoIdx++
    }
  }
  let maxR = 0
  let maxB = 0
  children.forEach((c, i) => {
    maxR = Math.max(maxR, childPos[i].x + nodeWidth(c))
    maxB = Math.max(maxB, childPos[i].y + CHILD_ROW_H)
  })
  const bw = Math.max(300, maxR + CHILD_PAD)
  const bh = Math.max(200, maxB + CHILD_PAD)

  const out: FlowNode[] = [{
    id: node.id,
    type: 'boundary',
    position: { x: pos.x, y: pos.y },
    data: { label: node.name, color: accent, width: bw, height: bh },
    style: { width: `${bw}px`, height: `${bh}px` },
  }]
  children.forEach((c, i) => {
    out.push({
      id: c.id,
      type: 'graphNode',
      parentNode: node.id,
      extent: 'parent',
      expandParent: true,
      position: { x: childPos[i].x, y: childPos[i].y },
      data: flowNodeData(c, [], nodeTypes, materialTypes),
    })
  })
  return out
}

export function buildFlowEdge(edge: GraphEdge, edgeTypes: Map<string, GraphTypeDef>): FlowEdge {
  const def = edgeTypes.get(edge.type)
  const props = edge.properties || {}
  const color = String(props.stroke || def?.stroke || def?.color || DEFAULT_EDGE_COLOR)
  // Edge type defs use snake_case stroke_width (backend schema); properties may
  // carry either form (panel writes strokeWidth, agents write stroke_width).
  const width = Number(props.strokeWidth || props.stroke_width || def?.stroke_width || def?.strokeWidth || 1.6)
  const routing = String(props.routing || def?.render?.routing || 'default')
  const animated = props.animated === true || props.animated === 'true' || def?.animated === true
  const dash = String(props.dash || def?.dash || def?.dash_array || '')
  const direction = String(props.direction || def?.direction || 'directed')
  const bidirectional = props.bidirectional === true || direction === 'bidirectional'
  const built: FlowEdge = {
    id: edge.id,
    source: edge.source_id,
    target: edge.target_id,
    type: routing,
    label: edge.label || '',
    animated,
    style: { stroke: color, strokeWidth: width, strokeDasharray: dash },
    labelStyle: { fill: 'var(--kg-muted)', fontSize: '10px' },
    labelBgStyle: { fill: 'var(--kg-bg)', fillOpacity: 0.9 },
    markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 12 },
  }
  if (bidirectional) built.markerStart = { type: MarkerType.ArrowClosed, color, width: 16, height: 12 }
  if (props.sourceHandle) built.sourceHandle = String(props.sourceHandle)
  if (props.targetHandle) built.targetHandle = String(props.targetHandle)
  return built
}

export function buildFlowData(state: GraphState, expanded: Set<string>, viewRoot?: string) {
  const flat = flattenGraph(state.nodes || [])
  const nodeTypes = typeMap(state.schema?.node_types || [])
  const edgeTypes = typeMap(state.schema?.edge_types || [])
  const materialTypes = typeMap(state.schema?.material_types || [])
  const flowNodes: FlowNode[] = []
  const flowEdges: FlowEdge[] = []
  const roots = flat.childrenByParent.get(viewRoot || '') || []

  roots.forEach((node, index) => {
    const children = flat.childrenByParent.get(node.id) || []
    const pos = positionFor(state, node, index)
    if (children.length && expanded.has(node.id)) {
      flowNodes.push(...buildBoundary(state, node, children, pos, nodeTypes, materialTypes))
    } else {
      flowNodes.push({ id: node.id, type: 'graphNode', position: { x: pos.x, y: pos.y }, data: flowNodeData(node, children, nodeTypes, materialTypes) })
    }
  })

  const visible = new Set(flowNodes.map(n => n.id))

  // Lift an endpoint to the nearest currently-rendered ancestor so relations
  // survive collapse: an edge into a collapsed group's descendant rolls up to
  // the group node ("auto edge"), while an expanded group keeps child-level
  // edges. Mirrors autoLayout's liftToTop, but against the actually-visible
  // node set rather than only the top level, so edges show on every layer.
  function liftToVisible(id: string): string | undefined {
    let cursor: string | undefined = id
    while (cursor) {
      if (visible.has(cursor)) return cursor
      cursor = flat.nodeById.get(cursor)?.parent_id
    }
    return undefined
  }
  function nodeName(id: string): string { return flat.nodeById.get(id)?.name || id }
  function topAncestorName(id: string): string {
    let cursor: string | undefined = id
    let node = flat.nodeById.get(id)
    while (cursor) {
      const parent: string | undefined = flat.nodeById.get(cursor)?.parent_id
      if (!parent) break
      cursor = parent
      node = flat.nodeById.get(cursor)
    }
    return node?.name || ''
  }

  // Portal stubs stand in for an endpoint that lives outside the current view
  // (a drilled-in level): the child's outward relation stays visible and can be
  // jumped through instead of silently vanishing when only one end is on canvas.
  // A stub is a signpost, not a node — it renders as a reference chip, its only
  // interaction is jump-to-target, and it never enters drag, selection, or any
  // graph command.
  const portals = new Map<string, FlowNode>()
  function ensurePortal(externalId: string): string {
    const pid = `${PORTAL_PREFIX}${externalId}`
    if (!portals.has(pid)) {
      const ext = flat.nodeById.get(externalId)
      const seed = ext || ({ id: externalId, type: '', name: externalId } as GraphNode)
      portals.set(pid, {
        id: pid,
        type: 'portalNode',
        position: { x: 0, y: 0 },
        draggable: false,
        selectable: false,
        connectable: false,
        data: {
          label: seed.name,
          color: nodeColor(seed, nodeTypes),
          portal: true,
          portalTarget: externalId,
          contextLabel: topAncestorName(externalId),
          handles: DEFAULT_HANDLES,
        },
      })
    }
    return pid
  }

  interface AggGroup {
    s: string
    t: string
    sample: GraphEdge
    portal: boolean
    members: Array<{ id: string; type: string; label: string; source: string; target: string; sourceId: string; targetId: string }>
  }
  const aggGroups = new Map<string, AggGroup>()

  for (const edge of state.edges || []) {
    let s = liftToVisible(edge.source_id)
    let t = liftToVisible(edge.target_id)
    let portal = false
    // Exactly one endpoint outside the current view -> route it to a portal so
    // the outward relation is still drawn. Both outside -> unrelated, dropped.
    if (s && !t) { t = ensurePortal(edge.target_id); portal = true }
    else if (!s && t) { s = ensurePortal(edge.source_id); portal = true }
    // Drop dangling endpoints and relations internal to a single collapsed
    // group (both endpoints roll up to the same node -> a self-loop).
    if (!s || !t || s === t) continue
    const direct = !portal && s === edge.source_id && t === edge.target_id
    if (direct) { flowEdges.push(buildFlowEdge(edge, edgeTypes)); continue }
    // Roll parallel relations of the same type between the same visible
    // endpoints into one virtual edge, keeping the underlying relations as
    // provenance so the summary can explain what it stands for.
    const key = `${edge.type}|${s}|${t}`
    let group = aggGroups.get(key)
    if (!group) { group = { s, t, sample: edge, portal, members: [] }; aggGroups.set(key, group) }
    group.members.push({ id: edge.id, type: edge.type, label: edge.label || '', source: nodeName(edge.source_id), target: nodeName(edge.target_id), sourceId: edge.source_id, targetId: edge.target_id })
  }

  for (const group of aggGroups.values()) {
    // Drop the leaf-specific handles so vue-flow re-anchors the rolled-up edge.
    const agg: GraphEdge = {
      ...group.sample,
      id: `agg:${group.sample.type}:${group.s}:${group.t}`,
      source_id: group.s,
      target_id: group.t,
      properties: { ...(group.sample.properties || {}), sourceHandle: undefined, targetHandle: undefined },
    }
    const built = buildFlowEdge(agg, edgeTypes)
    built.data = { ...(built.data || {}), aggregated: true, portal: group.portal, count: group.members.length, members: group.members }
    if (group.members.length > 1) built.label = group.sample.label ? `${group.sample.label} ×${group.members.length}` : `×${group.members.length}`
    flowEdges.push(built)
  }

  // Park portal stubs in a column beside the laid-out nodes so an external
  // endpoint reads as off-canvas rather than tangled into the view.
  if (portals.size) {
    let maxX = 0
    let minY = Number.POSITIVE_INFINITY
    for (const n of flowNodes) {
      maxX = Math.max(maxX, n.position.x + Number((n.data as { width?: number })?.width || DEFAULT_NODE_W))
      minY = Math.min(minY, n.position.y)
    }
    if (!Number.isFinite(minY)) minY = 40
    const CHIP_ROW_H = 52
    let i = 0
    for (const p of portals.values()) {
      p.position = { x: maxX + 120, y: minY + i * CHIP_ROW_H }
      i += 1
      flowNodes.push(p)
    }
  }

  return { flowNodes, flowEdges, flat }
}

// Dagre-driven auto layout for the currently visible level. Edges are lifted
// to their visible top-level ancestor so cross-boundary relations still rank.
export function autoLayout(state: GraphState, direction: 'TB' | 'LR', viewRoot?: string): Record<string, LayoutPosition> {
  const flat = flattenGraph(state.nodes || [])
  const roots = flat.childrenByParent.get(viewRoot || '') || []
  if (!roots.length) return {}
  const topIds = new Set(roots.map(n => n.id))

  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: direction, nodesep: 46, ranksep: 70, marginx: 30, marginy: 30 })
  g.setDefaultEdgeLabel(() => ({}))

  for (const node of roots) {
    const children = flat.childrenByParent.get(node.id) || []
    let w = nodeWidth(node)
    let h = DEFAULT_NODE_H
    if (children.length) {
      const cols = Math.max(1, Math.min(children.length, 3))
      const rows = Math.ceil(children.length / 3)
      const maxCW = Math.max(...children.map(c => nodeWidth(c)))
      w = Math.max(300, cols * (maxCW + CHILD_GAP_X) - CHILD_GAP_X + CHILD_PAD * 2)
      h = rows * CHILD_ROW_H + (rows - 1) * CHILD_GAP_Y + CHILD_PAD_TOP + CHILD_PAD
    }
    g.setNode(node.id, { width: w, height: h })
  }

  function liftToTop(id: string): string | undefined {
    let cursor: string | undefined = id
    while (cursor) {
      if (topIds.has(cursor)) return cursor
      cursor = flat.nodeById.get(cursor)?.parent_id
    }
    return undefined
  }

  const seen = new Set<string>()
  for (const edge of state.edges || []) {
    const s = liftToTop(edge.source_id)
    const t = liftToTop(edge.target_id)
    if (!s || !t || s === t) continue
    const key = `${s}->${t}`
    if (seen.has(key)) continue
    seen.add(key)
    g.setEdge(s, t)
  }

  dagre.layout(g)

  const positions: Record<string, LayoutPosition> = {}
  for (const node of roots) {
    const n = g.node(node.id)
    if (!n) continue
    positions[node.id] = { x: Math.round(n.x - n.width / 2), y: Math.round(n.y - n.height / 2) }
  }
  return positions
}

export function materialsForTarget(state: GraphState, targetType: 'graph' | 'node' | 'edge', targetId?: string): GraphMaterial[] {
  return (state.materials || []).filter(m => m.target_type === targetType && (targetType === 'graph' || m.target_id === targetId))
}
