import {
  LABEL_LINE_HEIGHT, branchRegions, edgeFamily, familyMark, isSuggestedEdge, markIsHollow, nodeFamily,
} from './force-layout'
import type { BranchRegion, EdgeFamily, NodeFamily } from './force-layout'
import { GEOMETRY_STRIDE } from './layout-protocol'
import type { Placement } from './layout-engine'
import { boundsOf, edgeDetail, intersectsBox, labelBudget, visibleWorld } from './view'
import type { Bounds, Detail, Transform, Viewport } from './view'
import { isFolded, isSettled } from './tree'
import { relativeAge } from './assembly'
import type { GraphEdge, GraphNode } from './types'

/**
 * Drawing the graph.
 *
 * The scene is built once per solved layout — flat arrays, one pass — and every
 * frame walks it, keeps what the pane can see, and inks it at the detail the
 * current scale can resolve. No frame decides what a reader may know: the whole
 * loaded graph is in the scene at every tier, and the coarse tiers replace
 * records with the territory that holds them and say how many that is.
 */

export interface Palette {
  bg: string
  fg: string
  muted: string
  faint: string
  border: string
  accent: string
  panel: string
  family: Record<NodeFamily, string>
  edge: Record<EdgeFamily, string>
}

export interface SceneNode {
  id: string
  x: number
  y: number
  radius: number
  halfWidth: number
  top: number
  bottom: number
  degree: number
  family: NodeFamily
  lines: string[]
  hollow: boolean
  folded: boolean
  settled: boolean
  /** Landmark weight: hubs, roots and pinned records keep their names longest. */
  rank: number
  /** How many work spans have touched this record, and when one last did. */
  sessions: number
  lastWorkedAt: number
}

/** What the span store says about one record: sessions on it, and the last one. */
export interface RecordActivity { sessions: number; lastActivityAt: number }

/** Above this age a record stops carrying heat; it is history, not current work. */
export const HEAT_WINDOW_S = 86400

export interface SceneEdge {
  from: number
  to: number
  family: EdgeFamily
  suggested: boolean
  label: string
}

export interface HitGrid {
  cell: number
  minX: number
  minY: number
  columns: number
  rows: number
  buckets: Map<number, number[]>
}

/**
 * A relation whose other end is outside this canvas. Descending into a branch
 * cuts relations that leave it, and a cut relation that is simply not drawn is
 * a relation the reader is not told about — so it is drawn as a port on the
 * record it leaves, named by where it goes, and it jumps there when pressed.
 */
export interface ScenePort {
  at: number
  targetId: string
  targetLabel: string
  kind: string
  outbound: boolean
  /** A stable bearing from the record, so repeated ports fan rather than stack. */
  angle: number
}

export interface Scene {
  nodes: SceneNode[]
  edges: SceneEdge[]
  ports: ScenePort[]
  regions: BranchRegion[]
  index: Map<string, number>
  bounds: Bounds | null
  grid: HitGrid
}

export const PORT_REACH = 34
export const PORT_RADIUS = 5

export interface PresencePin {
  id: string
  nodeId: string
  initials: string
  label: string
  stale: boolean
}

export interface DrawState {
  detail: Detail
  /** Reading clock, so recency heat cools without a projection signal. */
  now: number
  selectedId: string
  hoveredId: string
  mutedFamily: NodeFamily | ''
  touched: ReadonlySet<string>
  showRegions: boolean
  pins: PresencePin[]
}

export interface DrawStats {
  nodes: number
  edges: number
  labels: number
  territories: number
  /** Territories the frame did not have room to name; stated, never dropped silently. */
  territoriesHeld: number
}

/**
 * A wash per branch reads as a place; a wash per branch on a graph with five
 * hundred branches reads as one flat colour. The frame draws the largest
 * territories and the canvas says how many it is holding back.
 */
export const TERRITORY_BUDGET = 12
const TERRITORY_LABEL_GAP = 54

const HIT_CELL = 96

function gridKey(grid: HitGrid, column: number, row: number): number { return row * grid.columns + column }

function buildGrid(nodes: SceneNode[], bounds: Bounds | null): HitGrid {
  const grid: HitGrid = {
    cell: HIT_CELL,
    minX: bounds?.minX ?? 0,
    minY: bounds?.minY ?? 0,
    columns: Math.max(1, Math.ceil(((bounds?.maxX ?? 0) - (bounds?.minX ?? 0)) / HIT_CELL) + 1),
    rows: Math.max(1, Math.ceil(((bounds?.maxY ?? 0) - (bounds?.minY ?? 0)) / HIT_CELL) + 1),
    buckets: new Map(),
  }
  for (let at = 0; at < nodes.length; at++) {
    const node = nodes[at]
    const column = Math.max(0, Math.min(grid.columns - 1, Math.floor((node.x - grid.minX) / grid.cell)))
    const row = Math.max(0, Math.min(grid.rows - 1, Math.floor((node.y - grid.minY) / grid.cell)))
    const key = gridKey(grid, column, row)
    const bucket = grid.buckets.get(key)
    if (bucket) bucket.push(at)
    else grid.buckets.set(key, [at])
  }
  return grid
}

/**
 * Turns one solved layout plus the projected records into the flat model every
 * frame walks. Records the layout did not place — a relation endpoint outside
 * the loaded set — are left out of the drawn topology rather than drawn at the
 * origin.
 */
export function buildScene(
  placement: Placement,
  nodes: GraphNode[],
  edges: GraphEdge[],
  labels: ReadonlyMap<string, string> = new Map(),
  activity: ReadonlyMap<string, RecordActivity> = new Map(),
): Scene {
  const byId = new Map(nodes.map(node => [node.id, node]))
  const scene: SceneNode[] = new Array(placement.ids.length)
  for (let at = 0; at < placement.ids.length; at++) {
    const id = placement.ids[at]
    const record = byId.get(id)
    const geometry = at * GEOMETRY_STRIDE
    const family = nodeFamily(record?.kind)
    const degree = placement.geometry[geometry + 4]
    scene[at] = {
      id,
      x: placement.positions[at * 2],
      y: placement.positions[at * 2 + 1],
      radius: placement.geometry[geometry],
      halfWidth: placement.geometry[geometry + 1],
      top: placement.geometry[geometry + 2],
      bottom: placement.geometry[geometry + 3],
      degree,
      family,
      lines: placement.labels[at] || [],
      hollow: markIsHollow(family),
      folded: record ? isFolded(record) : false,
      settled: record ? isSettled(record) : false,
      rank: degree + (record?.parent_id ? 0 : 3) + (record?.pinned ? 4 : 0),
      sessions: activity.get(id)?.sessions || 0,
      lastWorkedAt: activity.get(id)?.lastActivityAt || 0,
    }
  }
  const index = placement.index
  const drawn: SceneEdge[] = []
  const ports: ScenePort[] = []
  const fanned = new Map<number, number>()
  for (const edge of edges) {
    const from = index.get(edge.from)
    const to = index.get(edge.to)
    if (from !== undefined && to !== undefined) {
      if (from === to) continue
      drawn.push({
        from,
        to,
        family: edgeFamily(edge.kind),
        suggested: isSuggestedEdge(edge),
        label: edge.label || edge.kind.replace(/_/g, ' '),
      })
      continue
    }
    const at = from ?? to
    if (at === undefined) continue
    const targetId = from === undefined ? edge.from : edge.to
    const spoke = fanned.get(at) || 0
    fanned.set(at, spoke + 1)
    ports.push({
      at,
      targetId,
      targetLabel: labels.get(targetId) || byId.get(targetId)?.label || targetId,
      kind: edge.kind.replace(/_/g, ' '),
      outbound: to === undefined,
      angle: -Math.PI / 2 + spoke * (Math.PI / 5) * (spoke % 2 ? 1 : -1),
    })
  }
  const bounds = boundsOf(scene.map(node => ({
    x: node.x,
    y: node.y + (node.bottom - node.top) / 2,
    halfWidth: node.halfWidth,
    halfHeight: (node.top + node.bottom) / 2,
  })))
  const regions = branchRegions(
    scene.map(node => ({
      id: node.id,
      parent_id: byId.get(node.id)?.parent_id,
      label: byId.get(node.id)?.label || node.id,
      family: node.family,
      px: node.x,
      py: node.y,
      box: { radius: node.radius },
    })),
    placement.width,
    placement.height,
  )
  return { nodes: scene, edges: drawn, ports, regions, index, bounds, grid: buildGrid(scene, bounds) }
}

/** The record under a world point, nearest first, or an empty string. */
export function hitTest(scene: Scene, worldX: number, worldY: number, slack = 6): string {
  const grid = scene.grid
  const column = Math.floor((worldX - grid.minX) / grid.cell)
  const row = Math.floor((worldY - grid.minY) / grid.cell)
  let best = ''
  let bestDistance = Infinity
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const c = column + dx
      const r = row + dy
      if (c < 0 || r < 0 || c >= grid.columns || r >= grid.rows) continue
      for (const at of grid.buckets.get(gridKey(grid, c, r)) || []) {
        const node = scene.nodes[at]
        const distance = Math.hypot(node.x - worldX, node.y - worldY)
        if (distance <= node.radius + slack && distance < bestDistance) {
          bestDistance = distance
          best = node.id
        }
      }
    }
  }
  return best
}

/** Where a port sits in world space, given the record it leaves. */
export function portPoint(scene: Scene, port: ScenePort): { x: number; y: number } {
  const node = scene.nodes[port.at]
  const reach = node.radius + PORT_REACH
  return { x: node.x + Math.cos(port.angle) * reach, y: node.y + Math.sin(port.angle) * reach }
}

/** The port under a world point, when the reader is pressing one. */
export function hitPort(scene: Scene, worldX: number, worldY: number, slack = 5): ScenePort | null {
  for (const port of scene.ports) {
    const point = portPoint(scene, port)
    if (Math.hypot(point.x - worldX, point.y - worldY) <= PORT_RADIUS + slack) return port
  }
  return null
}

/**
 * Indices of the records the pane can currently see. The cull walks the whole
 * scene on every frame, so it reads the composite's extent as numbers off the
 * scene node it already holds and allocates nothing per record.
 */
export function visibleNodes(scene: Scene, transform: Transform, viewport: Viewport): number[] {
  const world = visibleWorld(transform, viewport)
  const out: number[] = []
  for (let at = 0; at < scene.nodes.length; at++) {
    const node = scene.nodes[at]
    if (intersectsBox(
      world,
      node.x,
      node.y + (node.bottom - node.top) / 2,
      node.halfWidth,
      (node.top + node.bottom) / 2,
    )) out.push(at)
  }
  return out
}

const MARK_CACHE = new Map<NodeFamily, Path2D>()

function unitMark(family: NodeFamily): Path2D {
  let path = MARK_CACHE.get(family)
  if (!path) {
    path = new Path2D(familyMark(family, 1))
    MARK_CACHE.set(family, path)
  }
  return path
}

type Rgba = [number, number, number, number]

const PARSED = new Map<string, Rgba>()

/**
 * Palette values arrive already resolved by the host's token contract, as the
 * `rgb()` or `rgba()` form `getComputedStyle` always returns. Mixing is done in
 * numbers here rather than handed back to the canvas as a `color-mix()` string,
 * so a frame never re-parses CSS per mark.
 */
function parse(color: string): Rgba {
  const cached = PARSED.get(color)
  if (cached) return cached
  const numbers = color.match(/-?\d*\.?\d+/g)
  const value: Rgba = numbers && numbers.length >= 3
    ? [Number(numbers[0]), Number(numbers[1]), Number(numbers[2]), numbers.length > 3 ? Number(numbers[3]) : 1]
    : [128, 128, 128, 1]
  PARSED.set(color, value)
  return value
}

const MIXED = new Map<string, string>()

/**
 * Mixes are cached because a frame asks for the same ones thousands of times,
 * and the cache is bounded because some of them are asked for at a continuously
 * moving strength: recency heat cools with the reading clock, so an unquantized
 * ratio mints a new colour on every repaint and the table grows without end.
 *
 * Sixteen steps is finer than the eye reads a wash, and it closes the key space:
 * a palette holds a fixed set of colours, so the table can only hold colours
 * against colours against steps. The ceiling stands well above that and exists
 * for the one case that widens it — a theme change, which retires every colour
 * the table holds, so dropping the table whole is the correct eviction.
 */
export const MIX_STEPS = 16
const MIX_LIMIT = 4096

/** `ratio` of `color` over `other`; `other` may be the literal word transparent. */
function mix(color: string, other: string, ratio: number): string {
  const step = Math.max(0, Math.min(MIX_STEPS, Math.round(ratio * MIX_STEPS)))
  const key = `${color}|${other}|${step}`
  const cached = MIXED.get(key)
  if (cached) return cached
  const strength = step / MIX_STEPS
  const [r, g, b, a] = parse(color)
  let value: string
  if (other === 'transparent') {
    value = `rgba(${r}, ${g}, ${b}, ${(a * strength).toFixed(3)})`
  } else {
    const [r2, g2, b2, a2] = parse(other)
    const blend = (one: number, two: number) => Math.round(one * strength + two * (1 - strength))
    value = `rgba(${blend(r, r2)}, ${blend(g, g2)}, ${blend(b, b2)}, ${(a * strength + a2 * (1 - strength)).toFixed(3)})`
  }
  if (MIXED.size >= MIX_LIMIT) MIXED.clear()
  MIXED.set(key, value)
  return value
}

/** What the mix table currently holds; the canvas states its own bounds. */
export function mixCacheSize(): number { return MIXED.size }

/** The names a frame can carry, chosen by landmark weight rather than by order. */
function labelled(scene: Scene, visible: number[], state: DrawState, zoom: number): Set<number> {
  const budget = labelBudget(zoom, visible.length)
  const chosen = new Set<number>()
  if (!budget) return chosen
  if (budget >= visible.length) {
    for (const at of visible) chosen.add(at)
    return chosen
  }
  const ranked = [...visible].sort((a, b) => scene.nodes[b].rank - scene.nodes[a].rank
    || scene.nodes[a].id.localeCompare(scene.nodes[b].id))
  for (let at = 0; at < budget; at++) chosen.add(ranked[at])
  for (const node of [state.selectedId, state.hoveredId]) {
    const index = node ? scene.index.get(node) : undefined
    if (index !== undefined) chosen.add(index)
  }
  return chosen
}

/**
 * Inks one frame. The context is expected to be sized in device pixels with the
 * device ratio already applied, so every measurement here is in CSS pixels.
 */
export function drawScene(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  transform: Transform,
  viewport: Viewport,
  palette: Palette,
  state: DrawState,
): DrawStats {
  const { zoom } = transform
  const screenX = (x: number) => x * zoom + transform.x
  const screenY = (y: number) => y * zoom + transform.y
  const visible = visibleNodes(scene, transform, viewport)
  const stats: DrawStats = { nodes: visible.length, edges: 0, labels: 0, territories: 0, territoriesHeld: 0 }
  const ornament = edgeDetail(state.detail)

  ctx.clearRect(0, 0, viewport.width, viewport.height)

  if (state.showRegions && scene.regions.length) {
    const drawnRegions = scene.regions.slice(0, TERRITORY_BUDGET)
    stats.territoriesHeld = scene.regions.length - drawnRegions.length
    const placed: Array<[number, number]> = []
    ctx.save()
    ctx.translate(transform.x, transform.y)
    ctx.scale(zoom, zoom)
    for (const region of drawnRegions) {
      ctx.fillStyle = mix(palette.family[region.family], 'transparent', 0.055)
      ctx.fill(new Path2D(region.path))
      stats.territories++
    }
    ctx.restore()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    for (const region of drawnRegions) {
      const labelX = screenX(region.labelX)
      const labelY = screenY(region.labelY)
      // The canvas head owns the top-left corner; a name under it reads as noise.
      if (labelX < -160 || labelX > viewport.width + 160 || labelY < 58 || labelY > viewport.height + 40) continue
      // Two names on top of each other say less than one name, so a name that
      // cannot stand clear of its neighbours yields to the larger territory.
      if (placed.some(([x, y]) => Math.abs(x - labelX) < TERRITORY_LABEL_GAP * 3 && Math.abs(y - labelY) < TERRITORY_LABEL_GAP)) continue
      placed.push([labelX, labelY])
      ctx.fillStyle = mix(palette.family[region.family], palette.bg, 0.66)
      ctx.font = `800 ${state.detail === 'envelope' ? 12 : 9.5}px Inter, ui-sans-serif, system-ui, sans-serif`
      ctx.fillText(region.label.toUpperCase(), labelX, labelY)
      ctx.fillStyle = palette.muted
      ctx.font = '600 10px Inter, ui-sans-serif, system-ui, sans-serif'
      ctx.fillText(`${region.size.toLocaleString()} records`, labelX, labelY + 14)
    }
  }

  // Envelopes stand in for the marks inside them, so a reader zoomed all the
  // way out sees where the mass is and how much of it there is, never a blank.
  // At envelope scale a record is a grain: too small to name, still drawn, so
  // the territories read as the mass of records they actually hold.
  if (state.detail === 'envelope') {
    const grain = Math.max(1.4, Math.min(3, zoom * 8))
    const byFamily = new Map<NodeFamily, number[]>()
    for (const at of visible) {
      const bucket = byFamily.get(scene.nodes[at].family)
      if (bucket) bucket.push(at)
      else byFamily.set(scene.nodes[at].family, [at])
    }
    for (const [family, members] of byFamily) {
      ctx.beginPath()
      for (const at of members) {
        const node = scene.nodes[at]
        ctx.moveTo(screenX(node.x) + grain, screenY(node.y))
        ctx.arc(screenX(node.x), screenY(node.y), grain, 0, Math.PI * 2)
      }
      ctx.fillStyle = mix(palette.family[family], 'transparent', 0.62)
      ctx.fill()
    }
    return stats
  }

  const families: EdgeFamily[] = ['structure', 'support', 'succession', 'conflict']
  const anchorId = state.hoveredId || state.selectedId
  const anchor = anchorId ? scene.index.get(anchorId) : undefined
  for (const family of families) {
    ctx.beginPath()
    let drew = 0
    for (const edge of scene.edges) {
      if (edge.family !== family || edge.suggested) continue
      const from = scene.nodes[edge.from]
      const to = scene.nodes[edge.to]
      const x1 = screenX(from.x)
      const y1 = screenY(from.y)
      const x2 = screenX(to.x)
      const y2 = screenY(to.y)
      if (Math.max(x1, x2) < 0 || Math.min(x1, x2) > viewport.width) continue
      if (Math.max(y1, y2) < 0 || Math.min(y1, y2) > viewport.height) continue
      ctx.moveTo(x1, y1)
      if (ornament.curves) {
        const midX = (x1 + x2) / 2 - (y2 - y1) * 0.09
        const midY = (y1 + y2) / 2 + (x2 - x1) * 0.09
        ctx.quadraticCurveTo(midX, midY, x2, y2)
      } else {
        ctx.lineTo(x2, y2)
      }
      drew++
    }
    if (!drew) continue
    stats.edges += drew
    ctx.strokeStyle = palette.edge[family]
    ctx.lineWidth = family === 'conflict' ? 1.4 : family === 'structure' ? 0.9 : 1.2
    ctx.globalAlpha = anchor === undefined ? 1 : 0.24
    ctx.setLineDash(family === 'conflict' ? [5, 4] : family === 'succession' ? [9, 4] : [])
    ctx.stroke()
    ctx.setLineDash([])
    ctx.globalAlpha = 1
  }

  // A suggested relation was proposed, never stated, so it is drawn last and
  // faintest and can never be mistaken for something a record asserts.
  ctx.beginPath()
  let suggested = 0
  for (const edge of scene.edges) {
    if (!edge.suggested) continue
    const from = scene.nodes[edge.from]
    const to = scene.nodes[edge.to]
    ctx.moveTo(screenX(from.x), screenY(from.y))
    ctx.lineTo(screenX(to.x), screenY(to.y))
    suggested++
  }
  if (suggested) {
    stats.edges += suggested
    ctx.strokeStyle = mix(palette.accent, 'transparent', 0.34)
    ctx.lineWidth = 0.9
    ctx.setLineDash([2, 4])
    ctx.stroke()
    ctx.setLineDash([])
  }

  // The relations at the record under the pointer are drawn again, at full
  // weight, so reading one record never means losing the rest of the graph.
  if (anchor !== undefined) {
    ctx.beginPath()
    for (const edge of scene.edges) {
      if (edge.from !== anchor && edge.to !== anchor) continue
      const from = scene.nodes[edge.from]
      const to = scene.nodes[edge.to]
      ctx.moveTo(screenX(from.x), screenY(from.y))
      ctx.lineTo(screenX(to.x), screenY(to.y))
    }
    ctx.strokeStyle = palette.fg
    ctx.globalAlpha = 0.55
    ctx.lineWidth = 1.8
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  if (state.detail === 'dot') {
    const byFamily = new Map<NodeFamily, number[]>()
    for (const at of visible) {
      const bucket = byFamily.get(scene.nodes[at].family)
      if (bucket) bucket.push(at)
      else byFamily.set(scene.nodes[at].family, [at])
    }
    for (const [family, members] of byFamily) {
      ctx.beginPath()
      for (const at of members) {
        const node = scene.nodes[at]
        const radius = Math.max(1.4, node.radius * zoom * 0.62)
        ctx.moveTo(screenX(node.x) + radius, screenY(node.y))
        ctx.arc(screenX(node.x), screenY(node.y), radius, 0, Math.PI * 2)
      }
      ctx.fillStyle = palette.family[family]
      ctx.globalAlpha = state.mutedFamily && state.mutedFamily !== family ? 0.16 : 0.9
      ctx.fill()
      ctx.globalAlpha = 1
    }
  } else {
    for (const at of visible) {
      const node = scene.nodes[at]
      const dimmed = state.mutedFamily ? state.mutedFamily !== node.family : false
      const colour = palette.family[node.family]
      const radius = Math.max(2, node.radius * zoom)
      ctx.save()
      ctx.globalAlpha = dimmed ? 0.18 : 1
      ctx.translate(screenX(node.x), screenY(node.y))
      ctx.scale(radius, radius)
      const path = unitMark(node.family)
      if (node.hollow) {
        ctx.fillStyle = mix(colour, palette.bg, 0.16)
        ctx.fill(path)
        ctx.strokeStyle = colour
        ctx.lineWidth = 2.6 / radius
        ctx.stroke(path)
      } else {
        ctx.fillStyle = node.settled ? mix(colour, palette.bg, 0.46) : colour
        ctx.fill(path)
        if (node.folded) {
          ctx.strokeStyle = colour
          ctx.lineWidth = 1.6 / radius
          ctx.setLineDash([3 / radius, 2.4 / radius])
          ctx.stroke(path)
          ctx.setLineDash([])
        }
      }
      ctx.restore()
      // Work leaves heat: a record a span touched recently carries a ring that
      // fades as the work ages out of the day.
      if (node.lastWorkedAt && state.now - node.lastWorkedAt < HEAT_WINDOW_S) {
        const warmth = 1 - (state.now - node.lastWorkedAt) / HEAT_WINDOW_S
        ctx.beginPath()
        ctx.arc(screenX(node.x), screenY(node.y), radius + 5, 0, Math.PI * 2)
        ctx.strokeStyle = mix(palette.accent, 'transparent', 0.18 + warmth * 0.62)
        ctx.lineWidth = 1 + warmth * 2.2
        ctx.stroke()
      }
      if (state.touched.has(node.id)) {
        ctx.beginPath()
        ctx.arc(screenX(node.x), screenY(node.y), radius + 8, 0, Math.PI * 2)
        ctx.strokeStyle = mix(palette.accent, 'transparent', 0.4)
        ctx.lineWidth = 1.2
        ctx.stroke()
      }
      if (node.id === state.selectedId || node.id === state.hoveredId) {
        ctx.beginPath()
        ctx.arc(screenX(node.x), screenY(node.y), radius + 11, 0, Math.PI * 2)
        ctx.strokeStyle = colour
        ctx.lineWidth = 1.6
        ctx.setLineDash(node.id === state.selectedId ? [2.5, 3.5] : [])
        ctx.stroke()
        ctx.setLineDash([])
      }
    }
  }

  const names = labelled(scene, visible, state, zoom)
  if (names.size) {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = palette.fg
    for (const at of names) {
      const node = scene.nodes[at]
      if (state.mutedFamily && state.mutedFamily !== node.family) continue
      const emphasised = node.id === state.selectedId || node.id === state.hoveredId
      ctx.font = `${emphasised ? 720 : 560} 9px Inter, ui-sans-serif, system-ui, sans-serif`
      const baseline = screenY(node.y) + node.radius * zoom + 11.5
      for (let line = 0; line < node.lines.length; line++) {
        ctx.fillText(node.lines[line], screenX(node.x), baseline + line * LABEL_LINE_HEIGHT)
        stats.labels++
      }
    }
  }

  // A record worked in sessions says so, next to its name.
  if (state.detail === 'full') {
    ctx.textAlign = 'center'
    ctx.fillStyle = palette.muted
    ctx.font = '650 8px Inter, ui-sans-serif, system-ui, sans-serif'
    for (const at of names) {
      const node = scene.nodes[at]
      if (!node.sessions) continue
      const age = relativeAge(node.lastWorkedAt, state.now)
      const baseline = screenY(node.y) + node.radius * zoom + 11.5 + node.lines.length * LABEL_LINE_HEIGHT
      ctx.fillText(`${node.sessions} session${node.sessions === 1 ? '' : 's'}${age ? ` · ${age}` : ''}`, screenX(node.x), baseline)
    }
  }

  if (ornament.labels && anchor !== undefined) {
    ctx.textAlign = 'center'
    ctx.fillStyle = palette.muted
    ctx.font = '600 8.5px Inter, ui-sans-serif, system-ui, sans-serif'
    let named = 0
    const seen = new Set<string>()
    for (const edge of scene.edges) {
      if (named >= 5 || edge.suggested || edge.family === 'structure') continue
      if (edge.from !== anchor && edge.to !== anchor) continue
      if (seen.has(edge.label)) continue
      seen.add(edge.label)
      named++
      const from = scene.nodes[edge.from]
      const to = scene.nodes[edge.to]
      ctx.fillText(edge.label, (screenX(from.x) + screenX(to.x)) / 2, (screenY(from.y) + screenY(to.y)) / 2 - 4)
    }
  }

  // Ports name what this canvas cuts off. They are drawn above the topology so
  // a reader can always see where the branch connects out of.
  if (state.detail !== 'dot' && scene.ports.length) {
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    for (const port of scene.ports) {
      const node = scene.nodes[port.at]
      const point = portPoint(scene, port)
      const x = screenX(point.x)
      const y = screenY(point.y)
      if (x < -180 || x > viewport.width + 180 || y < -40 || y > viewport.height + 40) continue
      ctx.beginPath()
      ctx.moveTo(screenX(node.x), screenY(node.y))
      ctx.lineTo(x, y)
      ctx.strokeStyle = mix(palette.muted, 'transparent', 0.4)
      ctx.lineWidth = 1
      ctx.setLineDash([2, 3])
      ctx.stroke()
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.arc(x, y, PORT_RADIUS, 0, Math.PI * 2)
      ctx.fillStyle = palette.bg
      ctx.fill()
      ctx.strokeStyle = palette.muted
      ctx.lineWidth = 1.4
      ctx.stroke()
      if (state.detail !== 'full') continue
      ctx.fillStyle = palette.muted
      ctx.font = '600 8.5px Inter, ui-sans-serif, system-ui, sans-serif'
      const name = port.targetLabel.length > 26 ? `${port.targetLabel.slice(0, 25)}…` : port.targetLabel
      ctx.fillText(`${port.outbound ? '→' : '←'} ${name}`, x + PORT_RADIUS + 4, y)
    }
    ctx.textBaseline = 'alphabetic'
  }

  for (const pin of state.pins) {
    const at = scene.index.get(pin.nodeId)
    if (at === undefined) continue
    const node = scene.nodes[at]
    const x = screenX(node.x) + node.radius * zoom + 12
    const y = screenY(node.y) - 26
    if (x < -120 || x > viewport.width + 120 || y < -40 || y > viewport.height + 40) continue
    ctx.globalAlpha = pin.stale ? 0.38 : 1
    ctx.beginPath()
    ctx.moveTo(screenX(node.x), screenY(node.y))
    ctx.lineTo(x, y + 9)
    ctx.strokeStyle = palette.accent
    ctx.lineWidth = 1
    ctx.setLineDash([2, 2.5])
    ctx.stroke()
    ctx.setLineDash([])
    const width = 26 + pin.label.length * 4.6
    ctx.beginPath()
    ctx.roundRect(x, y - 9, width, 18, 9)
    ctx.fillStyle = mix(palette.accent, palette.bg, 0.14)
    ctx.fill()
    ctx.strokeStyle = mix(palette.accent, 'transparent', 0.4)
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x + 9, y, 6.4, 0, Math.PI * 2)
    ctx.fillStyle = palette.accent
    ctx.fill()
    ctx.textAlign = 'center'
    ctx.fillStyle = palette.bg
    ctx.font = '850 6.6px Inter, ui-sans-serif, system-ui, sans-serif'
    ctx.fillText(pin.initials, x + 9, y + 2.3)
    ctx.textAlign = 'left'
    ctx.fillStyle = palette.accent
    ctx.font = '700 8.2px Inter, ui-sans-serif, system-ui, sans-serif'
    ctx.fillText(pin.label, x + 19, y + 2.6)
    ctx.globalAlpha = 1
  }

  return stats
}
