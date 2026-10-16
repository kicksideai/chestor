// Copy/paste for graph selections. Copy captures nodes plus the edges whose
// both endpoints are inside the selection; paste re-mints every id (rewiring
// the internal edges), offsets the block, and reports the fresh ids so the
// caller can select them.
export interface ClipNode {
  id: string
  type: string
  name: string
  properties?: Record<string, unknown>
  tags?: string[]
  x: number
  y: number
}

export interface ClipEdge {
  type: string
  source_id: string
  target_id: string
  label?: string
  properties?: Record<string, unknown>
}

export interface Clip {
  nodes: ClipNode[]
  edges: ClipEdge[]
}

export function pastePlan(
  clip: Clip,
  mintId: () => string,
  offset = { x: 32, y: 32 },
): { nodes: Array<ClipNode & { id: string }>; edges: Array<ClipEdge & { source_id: string; target_id: string }> } {
  const idMap = new Map<string, string>()
  const nodes = clip.nodes.map(n => {
    const id = mintId()
    idMap.set(n.id, id)
    return { ...n, id, x: n.x + offset.x, y: n.y + offset.y }
  })
  const edges = clip.edges
    .filter(e => idMap.has(e.source_id) && idMap.has(e.target_id))
    .map(e => ({ ...e, source_id: idMap.get(e.source_id)!, target_id: idMap.get(e.target_id)! }))
  return { nodes, edges }
}
