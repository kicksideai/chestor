// Pure node search + ancestry helpers for the toolbar quick-find.
// Kept dependency-free so ranking is unit-testable.

import type { GraphNode, GraphTypeDef } from './types'

export interface SearchHit {
  node: GraphNode
  score: number
}

const MAX_RESULTS = 12

function normalize(s: string): string {
  return s.trim().toLowerCase()
}

// Lower score ranks first: name prefix, name word prefix, name substring,
// then tag / type matches.
function scoreNode(node: GraphNode, q: string, typeTitle: string): number | null {
  const name = normalize(node.name || '')
  if (name.startsWith(q)) return 0
  if (name.split(/\s+/).some(w => w.startsWith(q))) return 1
  if (name.includes(q)) return 2
  if ((node.tags || []).some(t => normalize(t).includes(q))) return 3
  if (normalize(typeTitle).includes(q) || normalize(node.type || '').includes(q)) return 4
  return null
}

export function searchNodes(nodes: GraphNode[], query: string, typeDefs: Map<string, GraphTypeDef>): SearchHit[] {
  const q = normalize(query)
  if (!q) return []
  const hits: SearchHit[] = []
  for (const node of nodes) {
    const typeTitle = String(typeDefs.get(node.type)?.title || node.type || '')
    const score = scoreNode(node, q, typeTitle)
    if (score !== null) hits.push({ node, score })
  }
  hits.sort((a, b) => a.score - b.score || (a.node.name || '').localeCompare(b.node.name || ''))
  return hits.slice(0, MAX_RESULTS)
}

// Ancestor ids from root to the node's direct parent (empty for root nodes).
export function ancestorPath(nodeById: Map<string, GraphNode>, id: string): string[] {
  const path: string[] = []
  let cursor = nodeById.get(id)?.parent_id
  const guard = new Set<string>()
  while (cursor && !guard.has(cursor)) {
    guard.add(cursor)
    path.unshift(cursor)
    cursor = nodeById.get(cursor)?.parent_id
  }
  return path
}

// Human breadcrumb for a search result row.
export function ancestorLabel(nodeById: Map<string, GraphNode>, id: string): string {
  return ancestorPath(nodeById, id)
    .map(x => nodeById.get(x)?.name || x)
    .join(' / ')
}
