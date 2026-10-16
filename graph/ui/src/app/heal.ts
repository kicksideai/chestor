// Delete-heals-wires: removing nodes bridges the connections that flowed
// through them, so a chain survives losing its middle. Pure planning — the
// caller turns bridges into addEdge commands ahead of the removals.
export interface HealEdge {
  id: string
  type: string
  source_id: string
  target_id: string
}

export interface Bridge {
  source_id: string
  target_id: string
  // The bridge continues the outgoing side's semantics: what the removed node
  // fed downstream is what its upstream now feeds.
  type: string
}

// healPlan computes the bridges for removing `removedIds` at once. Connections
// entering the removal set are walked through it (a removed chain heals across
// its whole length) to every reachable exit. Self-loops, duplicates, and
// already-existing edges never bridge.
export function healPlan(removedIds: string[], edges: HealEdge[]): Bridge[] {
  const removed = new Set(removedIds)
  if (!removed.size) return []

  const outByNode = new Map<string, HealEdge[]>()
  for (const e of edges) {
    if (removed.has(e.source_id)) {
      const list = outByNode.get(e.source_id) || []
      list.push(e)
      outByNode.set(e.source_id, list)
    }
  }

  const existing = new Set(edges.map(e => `${e.source_id}→${e.target_id}`))
  const bridges: Bridge[] = []
  const planned = new Set<string>()

  for (const entering of edges) {
    if (removed.has(entering.source_id) || !removed.has(entering.target_id)) continue
    // Walk from the entered removed node to every exit outside the set.
    const seen = new Set<string>([entering.target_id])
    const queue = [entering.target_id]
    while (queue.length) {
      const at = queue.shift() as string
      for (const out of outByNode.get(at) || []) {
        if (removed.has(out.target_id)) {
          if (!seen.has(out.target_id)) { seen.add(out.target_id); queue.push(out.target_id) }
          continue
        }
        const key = `${entering.source_id}→${out.target_id}`
        if (entering.source_id === out.target_id) continue
        if (existing.has(key) || planned.has(key)) continue
        planned.add(key)
        bridges.push({ source_id: entering.source_id, target_id: out.target_id, type: out.type })
      }
    }
  }
  return bridges
}
