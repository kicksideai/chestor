import type { MenuItem } from './ContextMenu.vue'

// The blank-canvas context menu. Creation is always offered: declared node
// types each get their own entry, and a graph without declared types gets the
// generic Add node — regardless of whether navigation entries (Go up inside a
// drilled node) are also present.
export interface PaneMenuDeps {
  viewRoot: string | null | undefined
  nodeTypes: Array<{ id: string; title?: string }>
  navigateUp: () => void
  addNode: (type?: string) => void
}

export function paneMenuItems(deps: PaneMenuDeps): MenuItem[] {
  const items: MenuItem[] = []
  if (deps.viewRoot) items.push({ label: '← Go up', action: deps.navigateUp })
  if (deps.nodeTypes.length) {
    for (const d of deps.nodeTypes) items.push({ label: `Add ${d.title || d.id}`, action: () => deps.addNode(d.id) })
  } else {
    items.push({ label: 'Add node', action: () => deps.addNode() })
  }
  return items
}

// The wire-drop picker: a connection drag released on empty canvas offers the
// same creation entries, but each choice creates the node at the drop point
// already wired to the drag source — add, place, and connect in one gesture.
export interface ConnectMenuDeps {
  nodeTypes: Array<{ id: string; title?: string }>
  addConnected: (type?: string) => void
}

export function connectMenuItems(deps: ConnectMenuDeps): MenuItem[] {
  const items: MenuItem[] = []
  if (deps.nodeTypes.length) {
    for (const d of deps.nodeTypes) items.push({ label: `Add ${d.title || d.id}`, action: () => deps.addConnected(d.id) })
  } else {
    items.push({ label: 'Add node', action: () => deps.addConnected() })
  }
  return items
}
