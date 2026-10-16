import type { GraphNode } from './types'

export interface TreeRow { node: GraphNode; depth: number; expanded: boolean; hasChildren: boolean }

function order(node: GraphNode): number {
  const value = node.metadata?.order ?? node.attrs?.order
  const number = Number(value)
  return Number.isFinite(number) ? number : Number.MAX_SAFE_INTEGER
}

export function treeRows(nodes: GraphNode[], expanded: Set<string>): TreeRow[] {
  const byParent = new Map<string, GraphNode[]>()
  const ids = new Set(nodes.map(node => node.id))
  for (const node of nodes) {
    const parent = node.parent_id && ids.has(node.parent_id) ? node.parent_id : ''
    const children = byParent.get(parent) || []
    children.push(node)
    byParent.set(parent, children)
  }
  for (const rows of byParent.values()) rows.sort((a, b) => order(a) - order(b) || a.label.localeCompare(b.label))
  const output: TreeRow[] = []
  const seen = new Set<string>()
  function walk(parent: string, depth: number) {
    for (const node of byParent.get(parent) || []) {
      if (seen.has(node.id)) continue
      seen.add(node.id)
      const hasChildren = (byParent.get(node.id)?.length || node.child_count || 0) > 0
      output.push({ node, depth, expanded: expanded.has(node.id), hasChildren })
      if (expanded.has(node.id)) walk(node.id, depth + 1)
    }
  }
  walk('', 0)
  return output
}

export function defaultExpanded(nodes: GraphNode[]): Set<string> {
  const roots = nodes.filter(node => !node.parent_id)
  const next = new Set(roots.map(node => node.id))
  for (const node of nodes) if (node.parent_id && next.has(node.parent_id) && node.child_count > 0) next.add(node.id)
  return next
}

/**
 * The open and closed branches a refreshed projection inherits.
 *
 * A projection refresh replaces the record array every few seconds. What the
 * reader opened and closed is their reading of the tree, not a property of the
 * data, so a record they have already met keeps the state they left it in and
 * only a record that has just entered the window takes the default. The result
 * holds ids from the current window alone, so it cannot outgrow what is on
 * screen.
 */
export function carryExpanded(
  nodes: GraphNode[], expanded: ReadonlySet<string>, known: ReadonlySet<string>,
): Set<string> {
  const defaults = defaultExpanded(nodes)
  const next = new Set<string>()
  for (const node of nodes) {
    if (known.has(node.id) ? expanded.has(node.id) : defaults.has(node.id)) next.add(node.id)
  }
  return next
}

export function isFolded(node: GraphNode): boolean {
  const state = String(node.status || node.metadata?.outcome || '').toLowerCase()
  return ['folded', 'failed', 'abandoned', 'inconclusive', 'rejected', 'superseded'].includes(state)
}

export function isSettled(node: GraphNode): boolean {
  const state = String(node.status || node.metadata?.outcome || '').toLowerCase()
  return ['done', 'closed', 'completed', 'resolved', 'retired', 'failed', 'abandoned', 'inconclusive', 'rejected', 'superseded'].includes(state)
}

export function isAgentNode(node: GraphNode): boolean { return /^(cursor|agent|operator)$/i.test(node.kind) }
