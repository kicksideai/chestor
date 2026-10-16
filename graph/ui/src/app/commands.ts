// Pure builders for the {type, body} command envelope the graph backend
// accepts at POST /workspace/graphs/{id}/apply. Client mints ids for adds
// (backend requires an id on every node/edge/material/type add).

import { EV, type GraphEdge } from './types'

export interface Command {
  type: string
  body: Record<string, unknown>
}

export function uid(): string {
  const c = (globalThis as { crypto?: Crypto }).crypto
  return c && typeof c.randomUUID === 'function' ? c.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function addNode(opts: { id?: string; type: string; name: string; parentId?: string; properties?: Record<string, unknown>; tags?: string[] }): Command {
  const body: Record<string, unknown> = { id: opts.id || uid(), type: opts.type, name: opts.name }
  if (opts.parentId) body.parent_id = opts.parentId
  if (opts.properties) body.properties = opts.properties
  if (opts.tags) body.tags = opts.tags
  return { type: EV.NODE_ADDED, body }
}

export function updateNode(id: string, patch: Record<string, unknown>): Command {
  return { type: EV.NODE_UPDATED, body: { id, ...patch } }
}

export function reparentNode(id: string, parentId: string | null): Command {
  return { type: EV.NODE_UPDATED, body: { id, parent_id: parentId || '' } }
}

export function removeNode(id: string): Command {
  return { type: EV.NODE_REMOVED, body: { id } }
}

export function addEdge(opts: { id?: string; type: string; sourceId: string; targetId: string; label?: string; properties?: Record<string, unknown> }): Command {
  const body: Record<string, unknown> = { id: opts.id || uid(), type: opts.type, source_id: opts.sourceId, target_id: opts.targetId }
  if (opts.label) body.label = opts.label
  if (opts.properties) body.properties = opts.properties
  return { type: EV.EDGE_ADDED, body }
}

export function updateEdge(id: string, patch: Record<string, unknown>): Command {
  return { type: EV.EDGE_UPDATED, body: { id, ...patch } }
}

export function reverseEdge(edge: Pick<GraphEdge, 'id' | 'source_id' | 'target_id' | 'properties'>): Command {
  const properties = { ...(edge.properties || {}) }
  const sourceHandle = properties.sourceHandle
  const targetHandle = properties.targetHandle
  if (targetHandle !== undefined) properties.sourceHandle = targetHandle
  else delete properties.sourceHandle
  if (sourceHandle !== undefined) properties.targetHandle = sourceHandle
  else delete properties.targetHandle
  return updateEdge(edge.id, { source_id: edge.target_id, target_id: edge.source_id, properties })
}

export function removeEdge(id: string): Command {
  return { type: EV.EDGE_REMOVED, body: { id } }
}

export function setPosition(nodeId: string, x: number, y: number, width?: number, height?: number): Command {
  const body: Record<string, unknown> = { node_id: nodeId, x: Math.round(x), y: Math.round(y) }
  if (Number.isFinite(width) && width) body.width = Math.round(width as number)
  if (Number.isFinite(height) && height) body.height = Math.round(height as number)
  return { type: EV.LAYOUT_POSITION_SET, body }
}

export function clearPosition(nodeId: string): Command {
  return { type: EV.LAYOUT_POSITION_CLEARED, body: { node_id: nodeId } }
}

export function setViewport(x: number, y: number, zoom: number, rootId?: string): Command {
  return { type: EV.LAYOUT_VIEWPORT_SET, body: { x, y, zoom, root_id: rootId } }
}

export function attachMaterial(opts: { id?: string; targetType: 'graph' | 'node' | 'edge'; targetId?: string; kind: string; title?: string; source?: Record<string, unknown>; meta?: Record<string, unknown> }): Command {
  return {
    type: EV.MATERIAL_ATTACHED,
    body: {
      id: opts.id || uid(),
      target_type: opts.targetType,
      target_id: opts.targetId,
      kind: opts.kind,
      title: opts.title ?? 'Material',
      source: opts.source || { type: 'inline' },
      meta: opts.meta || {},
    },
  }
}

export function updateMaterial(id: string, patch: Record<string, unknown>): Command {
  return { type: EV.MATERIAL_UPDATED, body: { id, ...patch } }
}

export function detachMaterial(id: string): Command {
  return { type: EV.MATERIAL_DETACHED, body: { id } }
}

type TypeKind = 'node' | 'edge' | 'material'

const REGISTER: Record<TypeKind, string> = {
  node: EV.NODE_TYPE_REGISTERED,
  edge: EV.EDGE_TYPE_REGISTERED,
  material: EV.MATERIAL_TYPE_REGISTERED,
}
const UPDATE: Record<TypeKind, string> = {
  node: EV.NODE_TYPE_UPDATED,
  edge: EV.EDGE_TYPE_UPDATED,
  material: EV.MATERIAL_TYPE_UPDATED,
}
const REMOVE: Record<TypeKind, string> = {
  node: EV.NODE_TYPE_REMOVED,
  edge: EV.EDGE_TYPE_REMOVED,
  material: EV.MATERIAL_TYPE_REMOVED,
}

export function registerType(kind: TypeKind, def: Record<string, unknown>): Command {
  return { type: REGISTER[kind], body: def }
}

export function updateType(kind: TypeKind, id: string, patch: Record<string, unknown>): Command {
  return { type: UPDATE[kind], body: { id, ...patch } }
}

export function removeType(kind: TypeKind, id: string): Command {
  return { type: REMOVE[kind], body: { id } }
}
