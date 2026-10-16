import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force'
import type { GraphEdge, GraphNode, NodeBox, NodeFamily, PositionedNode } from './types'

/**
 * Families drive shape, colour and edge weight together, so a reader learns the
 * vocabulary once and reads any graph in the journal with it.
 */
export type { NodeFamily }

const FAMILY_KINDS: Record<string, NodeFamily> = {
  project: 'anchor', charter: 'anchor', program: 'anchor', workstream: 'anchor',
  work_unit: 'anchor', work: 'anchor', task: 'anchor', run: 'anchor', milestone: 'anchor',
  history: 'anchor', era: 'anchor', stage: 'anchor', ontology: 'anchor', subject: 'anchor',
  goal: 'anchor', epic: 'anchor', phase: 'anchor',

  invariant: 'rule', constraint: 'rule', rule: 'rule', rule_set: 'rule', design_rule: 'rule',
  definition: 'rule', requirement: 'rule', governance: 'rule', design: 'rule',
  specification: 'rule', policy: 'rule', claim: 'rule', schema: 'rule',

  decision: 'decision', approach: 'decision', candidate: 'decision', alternative: 'decision',
  choice: 'decision', selection: 'decision', tradeoff: 'decision',

  evidence: 'evidence', proof: 'evidence', experiment: 'evidence', experiment_set: 'evidence',
  observation: 'evidence', audit: 'evidence', artifact: 'evidence', reference: 'evidence',
  paper: 'evidence', verification: 'evidence', acceptance: 'evidence', reflection: 'evidence',
  integration_receipt: 'evidence', measurement: 'evidence', benchmark: 'evidence',

  risk: 'risk', failure: 'risk', contradiction: 'risk', reopening: 'risk', legacy: 'risk',
  rejected_approach: 'risk', false_green: 'risk', blocker: 'risk', threat: 'risk',
  conflict: 'risk', regression: 'risk', incident: 'risk',

  question: 'open', research_question: 'open', proof_obligation: 'open', obligation: 'open',
  gate: 'open', hypothesis: 'open', unknown: 'open', assumption: 'open',

  agent: 'agent', cursor: 'agent', operator: 'agent',
}

export function nodeFamily(kind?: string): NodeFamily {
  return FAMILY_KINDS[String(kind || '').toLowerCase()] || 'note'
}

/**
 * Every colour resolves through the host's PrimeVue token contract, so both
 * themes and any re-branded base tone stay correct without a local palette.
 */
export const FAMILY_COLORS: Record<NodeFamily, string> = {
  anchor: 'var(--jr-accent)',
  rule: 'var(--jr-rule)',
  decision: 'var(--jr-decision)',
  evidence: 'var(--jr-evidence)',
  risk: 'var(--jr-danger)',
  open: 'var(--jr-warn)',
  agent: 'var(--jr-accent-strong)',
  note: 'var(--jr-muted)',
}

export const FAMILY_LABELS: Record<NodeFamily, string> = {
  anchor: 'Structure',
  rule: 'Rules',
  decision: 'Decisions',
  evidence: 'Evidence',
  risk: 'Risk',
  open: 'Open',
  agent: 'Agents',
  note: 'Notes',
}

export const FAMILY_ORDER: NodeFamily[] = ['anchor', 'rule', 'decision', 'evidence', 'open', 'risk', 'note']

export function familyColor(family: NodeFamily): string { return FAMILY_COLORS[family] }
export function kindColor(kind?: string): string { return FAMILY_COLORS[nodeFamily(kind)] }

/** Silhouettes repeat the family so the graph stays readable without colour. */
export function familyMark(family: NodeFamily, radius: number): string {
  const r = radius
  switch (family) {
    case 'anchor': {
      const s = r * .92
      const c = s * .34
      return `M ${-s + c} ${-s} H ${s - c} Q ${s} ${-s} ${s} ${-s + c} V ${s - c} Q ${s} ${s} ${s - c} ${s}`
        + ` H ${-s + c} Q ${-s} ${s} ${-s} ${s - c} V ${-s + c} Q ${-s} ${-s} ${-s + c} ${-s} Z`
    }
    case 'rule': {
      const points: string[] = []
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2
        points.push(`${(Math.cos(angle) * r).toFixed(2)} ${(Math.sin(angle) * r).toFixed(2)}`)
      }
      return `M ${points.join(' L ')} Z`
    }
    case 'decision': {
      const d = r * 1.16
      return `M 0 ${-d} L ${d} 0 L 0 ${d} L ${-d} 0 Z`
    }
    case 'risk': {
      const h = r * 1.2
      const w = r * 1.28
      const c = r * .28
      return `M 0 ${-h} L ${w} ${h * .78} Q ${w} ${h * .78 + c} ${w - c} ${h * .78 + c}`
        + ` H ${-w + c} Q ${-w} ${h * .78 + c} ${-w} ${h * .78} Z`
    }
    default:
      return `M ${-r} 0 A ${r} ${r} 0 1 0 ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0 Z`
  }
}

/** Open questions are drawn hollow; settled families are drawn solid. */
export function markIsHollow(family: NodeFamily): boolean { return family === 'open' }

export type EdgeFamily = 'structure' | 'support' | 'conflict' | 'succession' | 'presence'

const EDGE_KINDS: Record<string, EdgeFamily> = {
  contains: 'structure', owns: 'structure', precedes: 'structure', next: 'structure',
  defines: 'structure', delegates: 'structure', projects_from: 'structure', binds: 'structure',
  used_by: 'structure', part_of: 'structure', includes: 'structure',

  supports: 'support', verifies: 'support', evaluates: 'support', requires_proof: 'support',
  candidate_for: 'support', learned_from: 'support', governed_by: 'support', governs: 'support',
  motivates: 'support', informs: 'support', cites: 'support', relates: 'support',
  duplicates: 'support',

  contradicts: 'conflict', conflicts: 'conflict', refutes: 'conflict', rejects: 'conflict',
  blocks: 'conflict', threatens: 'conflict', deletes: 'conflict', invalidates: 'conflict',

  superseded_by: 'succession', supersedes: 'succession', selects: 'succession',
  requires_integration: 'succession', replaced_by: 'succession', causes: 'succession',

  positioned_at: 'presence', focused_on: 'presence', assigned_to: 'presence',
}

export function edgeFamily(kind?: string): EdgeFamily {
  return EDGE_KINDS[String(kind || '').toLowerCase()] || 'support'
}

/** Presence relations describe where an agent stands, not what the graph knows. */
export function isPresenceEdge(edge: GraphEdge): boolean { return edgeFamily(edge.kind) === 'presence' }

/**
 * A suggested relation was proposed, not stated. It is drawn at the bottom of
 * the visual hierarchy so it can never be mistaken for something the records
 * assert.
 */
export function isSuggestedEdge(edge: GraphEdge): boolean {
  const attrs = (edge.metadata || {}) as { origin?: unknown }
  return String(attrs.origin || '') === 'derived-llm'
}

function hash(value: string): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

function random(seed: number): () => number {
  let state = seed || 1
  return () => {
    state = Math.imul(1664525, state) + 1013904223 >>> 0
    return state / 0x100000000
  }
}

const NARROW = new Set([...`iljtIfr.,;:'"!|()[]{} `])
const WIDE = new Set([...'MWmw@%&'])

/** Deterministic advance estimate for the label face at 9px. */
export function textWidth(value: string, size = 9): number {
  let width = 0
  for (const character of value) width += NARROW.has(character) ? 2.5 : WIDE.has(character) ? 7.6 : 4.95
  return (width * size) / 9
}

/** Labels wrap on word boundaries into at most `maxLines` measured lines. */
export function labelLines(label: string, maxWidth = 128, maxLines = 2): string[] {
  const words = String(label || '').trim().split(/\s+/).filter(Boolean)
  if (!words.length) return ['untitled']
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (current && textWidth(candidate) > maxWidth && lines.length < maxLines - 1) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  lines.push(current)
  const last = lines.length - 1
  if (textWidth(lines[last]) > maxWidth) {
    let trimmed = lines[last]
    while (trimmed.length > 1 && textWidth(`${trimmed}…`) > maxWidth) trimmed = trimmed.slice(0, -1)
    lines[last] = `${trimmed.trimEnd()}…`
  }
  return lines
}

/** Marks grow with connectivity so hubs read as hubs before a label is parsed. */
export function markRadius(degree: number, family: NodeFamily): number {
  const base = 6.6 + Math.sqrt(Math.max(0, degree)) * 3.1
  const scale = family === 'anchor' ? 1.12 : family === 'note' ? .86 : 1
  return Math.min(17.5, base) * scale
}

export const LABEL_LINE_HEIGHT = 10.4

/**
 * The bounds a node occupies: the mark plus the label block hanging under it.
 * Collision, viewport clamping and the specs all read geometry from here so the
 * rendered composite and the solved layout can never disagree.
 */
export function nodeBox(node: GraphNode, degree: number, emphasised = false): NodeBox {
  const family = nodeFamily(node.kind)
  const radius = markRadius(degree, family)
  const lines = labelLines(node.label, emphasised ? 132 : 112, emphasised ? 2 : 1)
  const labelWidth = Math.max(...lines.map(line => textWidth(line)))
  return {
    radius,
    lines,
    halfWidth: Math.max(radius + 3, labelWidth / 2 + 4),
    top: radius + 3,
    bottom: radius + 6 + lines.length * LABEL_LINE_HEIGHT,
  }
}

/** Vertical clearance two composites need, given which one sits lower. */
function verticalGap(above: NodeBox, below: NodeBox): number { return above.bottom + below.top }
function collideRadius(box: NodeBox): number { return Math.max(box.halfWidth, (box.top + box.bottom) / 2) }

interface ForceNode extends SimulationNodeDatum {
  id: string
  record: GraphNode
  box: NodeBox
}

interface ForceLink extends SimulationLinkDatum<ForceNode> {
  source: string | ForceNode
  target: string | ForceNode
}

export type PositionCache = ReadonlyMap<string, { px: number; py: number }>
/** Coordinates a reader has taken hold of; treated exactly like a stored position. */
export type PositionOverrides = ReadonlyMap<string, { px: number; py: number }>

export interface LayoutOptions {
  /**
   * Ignore persisted x/y for this solve. A reader asking for a re-layout wants
   * the whole graph re-arranged, stored coordinates included; the store itself
   * is never written from here, so the persisted arrangement is one solve away.
   */
  unpin?: boolean
}

/**
 * Above this share of newcomers a solve is a growth, not a refresh. A refresh
 * keeps every located record fixed so the reader's map survives it; a growth —
 * a whole-graph load, a first big projection — has to let the seated records
 * move, because seating hundreds of arrivals around a frozen core piles them
 * into the world's edges instead of giving the graph its new shape.
 */
export const GROWTH_SHARE = 0.25

/**
 * Above this count the canvas draws marks and a bounded set of names rather
 * than every label, so reserving a rectangle for every label would resolve
 * collisions between blocks that are never both on screen. The rectangular
 * pass is quadratic in the node count, so it is a reading-scale tool and stops
 * where reading scale stops. Marks stay separated by the collision force at
 * every size.
 */
export const LABEL_RESOLVE_MAX = 420

function extremes(values: PositionedNode[], of: (node: PositionedNode) => [number, number]): [number, number] {
  let minimum = Infinity
  let maximum = -Infinity
  for (const node of values) {
    const [low, high] = of(node)
    if (low < minimum) minimum = low
    if (high > maximum) maximum = high
  }
  return [minimum, maximum]
}

export function degreeMap(edges: GraphEdge[]): Map<string, number> {
  const values = new Map<string, number>()
  for (const edge of edges) {
    if (isPresenceEdge(edge)) continue
    values.set(edge.from, (values.get(edge.from) || 0) + 1)
    values.set(edge.to, (values.get(edge.to) || 0) + 1)
  }
  return values
}

function explicitPosition(node: GraphNode): [number, number] | undefined {
  const rawX = node.x ?? node.metadata?.x
  const rawY = node.y ?? node.metadata?.y
  if (rawX === undefined || rawX === null || rawX === '' || rawY === undefined || rawY === null || rawY === '') return undefined
  const x = Number(rawX)
  const y = Number(rawY)
  return Number.isFinite(x) && Number.isFinite(y) ? [x, y] : undefined
}

function start(node: GraphNode, index: number, width: number, height: number, previous?: PositionCache, ignoreExplicit?: boolean): [number, number] {
  const explicit = ignoreExplicit ? undefined : explicitPosition(node)
  if (explicit) return explicit
  const prior = previous?.get(node.id)
  if (prior) return [prior.px, prior.py]
  const seed = hash(`${node.kind}:${node.id}`)
  const angle = ((seed % 360) / 180) * Math.PI
  // The seed ring is an ellipse inscribed in the world, so entering records
  // take the world's shape from the first tick and none of them starts clamped
  // against an edge on a wide or short pane.
  const reach = .25 + ((seed >>> 9) % 48) / 80
  const wobble = ((index % 7) - 3) * 5
  return [
    width / 2 + Math.cos(angle) * (width / 2) * reach + wobble,
    height / 2 + Math.sin(angle) * (height / 2) * reach - wobble,
  ]
}

/**
 * Bounded deterministic D3 force projection. Persisted x/y attributes win, then
 * a reader's own drag, then the previous frame's position, so a projection
 * refresh preserves spatial memory. New nodes enter from a stable id-derived
 * location.
 */
export function forceLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  width = 920,
  height = 620,
  emphasis: ReadonlySet<string> = new Set(),
  previous?: PositionCache,
  overrides?: PositionOverrides,
  options?: LayoutOptions,
): PositionedNode[] {
  // Every record handed to the layout is laid out. Deciding what a reader can
  // hold at once belongs to the caller and to the drawing scale, never to a
  // silent slice inside the solver.
  const visible = nodes
  const unpin = Boolean(options?.unpin)
  const degrees = degreeMap(edges)
  const boxes = new Map(visible.map(record => [record.id, nodeBox(record, degrees.get(record.id) || 0, emphasis.has(record.id))]))
  let rememberedCount = 0
  if (previous?.size) for (const record of visible) { if (previous.has(record.id)) rememberedCount++ }
  // A growth re-seats: remembered coordinates still start every located record
  // where the reader knows it, but nothing is fixed, so the graph takes the
  // shape its new size asks for instead of walling arrivals against the edges.
  const growth = rememberedCount > 0 && (visible.length - rememberedCount) / visible.length > GROWTH_SHARE
  const forceNodes: ForceNode[] = visible.map((record, index) => {
    const box = boxes.get(record.id)!
    const held = overrides?.get(record.id)
    const explicit = unpin ? undefined : explicitPosition(record)
    // An unpinned solve also refuses stored coordinates as seeds: a re-layout
    // that merely unfixed them would relax back into the same arrangement.
    const [rawX, rawY] = held ? [held.px, held.py] : start(record, index, width, height, previous, unpin)
    const x = Math.max(box.halfWidth, Math.min(width - box.halfWidth, rawX))
    const y = Math.max(box.top, Math.min(height - box.bottom, rawY))
    // A same-size refresh keeps spatial memory: a record the reader has already
    // located stays put while the solve seats whatever entered the window. The
    // collision pass can still move it to make room, so an arrival is never
    // trapped. The graph lens invalidates this cache when its viewport changes,
    // so stale coordinates never become pins after a resize.
    const remembered = !growth && previous?.has(record.id)
    return { id: record.id, record, box, x, y, vx: 0, vy: 0,
      // `pinned` protects semantic content from automatic replacement. Only an
      // explicit layout.position-set or a reader's drag owns a screen coordinate.
      fx: explicit || held || remembered ? x : null, fy: explicit || held || remembered ? y : null }
  })
  const ids = new Set(forceNodes.map(node => node.id))
  const recordById = new Map(visible.map(node => [node.id, node]))
  const branchKey = (record: GraphNode): string => {
    let current = record
    const seen = new Set([current.id])
    while (current.parent_id && recordById.has(current.parent_id) && !seen.has(current.parent_id)) {
      const parent = recordById.get(current.parent_id)!
      if (!parent.parent_id || !recordById.has(parent.parent_id)) return current.id
      seen.add(parent.id)
      current = parent
    }
    return current.id
  }
  const links: ForceLink[] = edges
    .filter(edge => !isPresenceEdge(edge) && ids.has(edge.from) && ids.has(edge.to))
    .map(edge => ({ source: edge.from, target: edge.to }))
  const stableSeed = hash([...ids].sort().join('|') + links.length)
  // Branch centres are spread evenly around a ring rather than placed by a hash
  // of the branch id. A hash lets two branches land on the same bearing, and
  // two territories on one bearing interleave into a shape that reads as noise.
  const branchCenters = new Map<string, [number, number]>()
  const branchKeys = [...new Set(visible.map(record => branchKey(record)))].sort()
  branchKeys.forEach((key, index) => {
    const angle = (index / branchKeys.length) * Math.PI * 2 + (stableSeed % 360) / 180 * Math.PI
    branchCenters.set(key, [
      width / 2 + Math.cos(angle) * width * .3,
      height / 2 + Math.sin(angle) * height * .28,
    ])
  })
  const cluster = (record: GraphNode, axis: 'x' | 'y') => {
    const center = branchCenters.get(branchKey(record))
    if (!center) return axis === 'x' ? width / 2 : height / 2
    return axis === 'x' ? center[0] : center[1]
  }
  const cached = !growth && rememberedCount > 0
  // Above reading scale the canvas draws marks, not label blocks, so the
  // collision footprint is the mark. Reserving every label's rectangle at that
  // size demands more area than the world holds and squeezes the surplus into
  // walls along the clamp edges.
  const compact = visible.length > LABEL_RESOLVE_MAX
  const footprint = (box: NodeBox): number => compact ? box.radius + 6 : collideRadius(box) * .92
  const simulation = forceSimulation(forceNodes)
    .randomSource(random(stableSeed))
    .alpha(cached ? .45 : 1)
    .alphaDecay(.035)
    .velocityDecay(.42)
    .force('link', forceLink<ForceNode, ForceLink>(links).id(node => node.id).distance(72).strength(.24))
    .force('charge', forceManyBody().strength(-108).distanceMin(16).distanceMax(300))
    .force('collision', forceCollide<ForceNode>().radius(node => footprint(node.box)).strength(1).iterations(3))
    // A branch only reads as a territory when its members actually gather, so
    // sibling attraction has to outweigh the global centring pull rather than
    // merely nudge against it.
    .force('x', forceX<ForceNode>(node => node.record.parent_id ? cluster(node.record, 'x') : width / 2)
      .strength(node => node.record.parent_id ? .34 : .2))
    .force('y', forceY<ForceNode>(node => node.record.parent_id ? cluster(node.record, 'y') : height / 2)
      .strength(node => node.record.parent_id ? .34 : .2))
    .force('center', forceCenter(width / 2, height / 2).strength(.04))
    .stop()

  // A solve is O(n log n) per tick, so a large graph earns fewer ticks; the
  // topology it produces is the same shape, settled a little less far.
  const scale = forceNodes.length > 2000 ? .35 : forceNodes.length > 600 ? .6 : 1
  const ticks = Math.max(40, Math.round((cached ? 90 : 260) * scale))
  for (let index = 0; index < ticks; index++) simulation.tick()
  simulation.stop()

  const out: PositionedNode[] = forceNodes.map(node => ({
    ...node.record,
    px: Math.max(node.box.halfWidth, Math.min(width - node.box.halfWidth, Number(node.x) || width / 2)),
    py: Math.max(node.box.top, Math.min(height - node.box.bottom, Number(node.y) || height / 2)),
    vx: Number(node.vx) || 0,
    vy: Number(node.vy) || 0,
    family: nodeFamily(node.record.kind),
    color: kindColor(node.record.kind),
    degree: degrees.get(node.id) || 0,
    box: node.box,
    held: Boolean(overrides?.get(node.id)),
  }))
  const boxOf = (node: PositionedNode) => node.box

  // Force simulations naturally converge toward their center. On a large
  // workspace that can leave a readable graph stranded in a small island, so an
  // automatic layout is fitted outward across the available canvas. This runs
  // before collision resolution: fitting clamps records against the canvas edge
  // and would otherwise re-introduce the overlaps the resolver just removed.
  // The pass only expands distances; persisted positions are never rewritten or
  // treated as suggestions, and a held record keeps the coordinate it was given.
  // Fitting runs on first placement and on growth solves — both arrange the
  // graph anew. A same-size refresh keeps its remembered layout: re-fitting it
  // would fight the collision pass and drift the graph a little further on
  // every projection refresh.
  if (out.length > 1 && !cached && (unpin || !out.some(node => explicitPosition(node))) && !overrides?.size) {
    const fitAxis = (axis: 'x' | 'y') => {
      const size = axis === 'x' ? width : height
      const lead = (node: PositionedNode) => axis === 'x' ? boxOf(node).halfWidth : boxOf(node).top
      const trail = (node: PositionedNode) => axis === 'x' ? boxOf(node).halfWidth : boxOf(node).bottom
      const coordinate = (node: PositionedNode) => axis === 'x' ? node.px : node.py
      const [minimum, maximum] = extremes(out, node => [coordinate(node) - lead(node), coordinate(node) + trail(node)])
      const span = Math.max(1, maximum - minimum)
      const scale = Math.min(4, Math.max(1, size * .88 / span))
      if (scale <= 1.025) return
      const center = (minimum + maximum) / 2
      for (const node of out) {
        const value = size / 2 + (coordinate(node) - center) * scale
        if (axis === 'x') node.px = Math.max(lead(node), Math.min(size - trail(node), value))
        else node.py = Math.max(lead(node), Math.min(size - trail(node), value))
      }
    }
    fitAxis('x')
    fitAxis('y')
  }

  // D3 owns the topology. This deterministic final pass only resolves the
  // rectangular label bounds that forceCollide necessarily approximates with
  // circles. It never assigns semantic screen slots or changes graph order.
  // The pass budget is bounded by window size so a drag stays interactive on a
  // window at the node ceiling.
  const passes = out.length > LABEL_RESOLVE_MAX ? 0 : out.length > 70 ? 64 : 220
  const shiftAxis = (item: PositionedNode, axis: 'x' | 'y', delta: number): number => {
    const box = boxOf(item)
    const before = axis === 'x' ? item.px : item.py
    const minimum = axis === 'x' ? box.halfWidth : box.top
    const maximum = axis === 'x' ? width - box.halfWidth : height - box.bottom
    const next = Math.max(minimum, Math.min(Math.max(minimum, maximum), before + delta))
    if (axis === 'x') item.px = next
    else item.py = next
    return next - before
  }
  for (let pass = 0; pass < passes; pass++) {
    let moved = false
    for (let i = 0; i < out.length; i++) {
      const a = out[i]
      const boxA = boxOf(a)
      for (let j = i + 1; j < out.length; j++) {
        const b = out[j]
        const boxB = boxOf(b)
        const dx = b.px - a.px
        const dy = b.py - a.py
        const spanX = boxA.halfWidth + boxB.halfWidth
        const spanY = dy >= 0 ? verticalGap(boxA, boxB) : verticalGap(boxB, boxA)
        const overlapX = spanX + 4 - Math.abs(dx)
        const overlapY = spanY + 3 - Math.abs(dy)
        if (overlapX <= 0 || overlapY <= 0) continue
        moved = true
        const preferred: 'x' | 'y' = overlapX / spanX < overlapY / spanY ? 'x' : 'y'
        // A record clamped against the canvas edge cannot take its half of the
        // separation, so its share is handed to the partner. Splitting blindly
        // leaves a permanent residual overlap at the boundary.
        const movePair = (axis: 'x' | 'y') => {
          const delta = axis === 'x' ? dx : dy
          const direction = delta === 0
            ? (hash(axis === 'x' ? `${a.id}:${b.id}` : `${b.id}:${a.id}`) % 2 ? 1 : -1)
            : Math.sign(delta)
          const need = (axis === 'x' ? overlapX : overlapY) + .3
          let gained = 0
          if (!a.held) gained -= shiftAxis(a, axis, -direction * (need / 2)) * direction
          if (!b.held) gained += shiftAxis(b, axis, direction * Math.max(0, need - gained)) * direction
          if (!a.held && gained + .01 < need) gained -= shiftAxis(a, axis, -direction * (need - gained)) * direction
          return gained > .01
        }
        if (!movePair(preferred)) movePair(preferred === 'x' ? 'y' : 'x')
      }
    }
    if (!moved) break
  }
  return out
}

export interface BranchRegion {
  id: string
  label: string
  family: NodeFamily
  path: string
  size: number
  labelX: number
  labelY: number
}

/** What a territory reads from a placed record: where it is and whose branch it is. */
export interface RegionMember {
  id: string
  parent_id?: string
  label: string
  family: NodeFamily
  px: number
  py: number
  box: { radius: number }
}

function convexHull(points: Array<[number, number]>): Array<[number, number]> {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const build = (input: Array<[number, number]>) => {
    const stack: Array<[number, number]> = []
    for (const point of input) {
      while (stack.length >= 2 && cross(stack[stack.length - 2], stack[stack.length - 1], point) <= 0) stack.pop()
      stack.push(point)
    }
    stack.pop()
    return stack
  }
  if (sorted.length < 3) return sorted
  return [...build(sorted), ...build([...sorted].reverse())]
}

function smoothClosed(points: Array<[number, number]>): string {
  if (points.length < 3) return ''
  const segments: string[] = [`M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`]
  const count = points.length
  for (let index = 0; index < count; index++) {
    const p0 = points[(index - 1 + count) % count]
    const p1 = points[index]
    const p2 = points[(index + 1) % count]
    const p3 = points[(index + 2) % count]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    segments.push(`C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`)
  }
  return `${segments.join(' ')} Z`
}

function polygonArea(points: Array<[number, number]>): number {
  let total = 0
  for (let index = 0; index < points.length; index++) {
    const [x1, y1] = points[index]
    const [x2, y2] = points[(index + 1) % points.length]
    total += x1 * y2 - x2 * y1
  }
  return Math.abs(total) / 2
}

/**
 * Branch territories. Regions are drawn one level below the window root: a
 * window almost always hangs off a single root, so a region per root would wrap
 * the whole canvas and say nothing. One region per top branch is what turns a
 * dense projection from a hairball into a place a reader can navigate.
 */
export function branchRegions(placed: RegionMember[], width = 0, height = 0, pad = 30): BranchRegion[] {
  const byId = new Map(placed.map(node => [node.id, node]))
  const branchOf = (node: RegionMember): RegionMember | null => {
    const chain: RegionMember[] = [node]
    const seen = new Set([node.id])
    let current: RegionMember = node
    while (current.parent_id && byId.has(current.parent_id) && !seen.has(current.parent_id)) {
      seen.add(current.parent_id)
      current = byId.get(current.parent_id)!
      chain.push(current)
    }
    return chain.length >= 2 ? chain[chain.length - 2] : null
  }
  const groups = new Map<string, RegionMember[]>()
  for (const node of placed) {
    const branch = branchOf(node)
    if (!branch) continue
    const bucket = groups.get(branch.id) || []
    bucket.push(node)
    groups.set(branch.id, bucket)
  }
  const canvas = width * height
  const regions: BranchRegion[] = []
  for (const [id, members] of groups) {
    if (members.length < 3) continue
    const root = byId.get(id)
    // Sampling a ring around each member rather than its four corners keeps the
    // hull from turning into a spiky quadrilateral on a sparse branch.
    const points: Array<[number, number]> = []
    for (const node of members) {
      const r = node.box.radius + 5
      for (let step = 0; step < 8; step++) {
        const angle = (step / 8) * Math.PI * 2
        points.push([node.px + Math.cos(angle) * r, node.py + Math.sin(angle) * r * 1.25])
      }
    }
    const hull = convexHull(points)
    if (hull.length < 3) continue
    const centroidX = hull.reduce((sum, point) => sum + point[0], 0) / hull.length
    const centroidY = hull.reduce((sum, point) => sum + point[1], 0) / hull.length
    const expanded = hull.map(([x, y]) => {
      const dx = x - centroidX
      const dy = y - centroidY
      const magnitude = Math.max(1, Math.hypot(dx, dy))
      return [x + (dx / magnitude) * pad, y + (dy / magnitude) * pad] as [number, number]
    })
    // A territory that swallows the canvas conveys nothing a reader can use.
    if (canvas && polygonArea(expanded) > canvas * .42) continue
    const path = smoothClosed(expanded)
    if (!path) continue
    const top = Math.min(...expanded.map(point => point[1]))
    regions.push({
      id,
      label: root?.label || id,
      family: root ? root.family : 'note',
      path,
      size: members.length,
      labelX: centroidX,
      labelY: top + 15,
    })
  }
  return regions.sort((a, b) => b.size - a.size || a.id.localeCompare(b.id))
}
