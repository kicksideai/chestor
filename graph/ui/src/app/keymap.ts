// Pure keyboard mapping. Kept dependency-free so it can be unit-tested and
// reused by the component's @keydown handler.

export type GraphAction = 'undo' | 'redo' | 'delete' | 'escape' | 'duplicate' | 'fit' | 'zoom-selection' | 'copy' | 'paste' | null

export interface KeyLike {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  // Present when the event originates from a form field; editing keys are ignored there.
  target?: { tagName?: string } | EventTarget | null
}

const EDITABLE = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

export function isEditingTarget(target: KeyLike['target']): boolean {
  const tag = (target as { tagName?: string } | null)?.tagName
  return typeof tag === 'string' && EDITABLE.has(tag.toUpperCase())
}

export function resolveAction(e: KeyLike): GraphAction {
  if (isEditingTarget(e.target)) return null
  const mod = Boolean(e.ctrlKey || e.metaKey)
  if (mod && (e.key === 'z' || e.key === 'Z')) return e.shiftKey ? 'redo' : 'undo'
  if (mod && (e.key === 'y' || e.key === 'Y')) return 'redo'
  if (mod && (e.key === 'd' || e.key === 'D')) return 'duplicate'
  if (mod && (e.key === 'c' || e.key === 'C')) return 'copy'
  if (mod && (e.key === 'v' || e.key === 'V')) return 'paste'
  // The canvas-tool convention pair: Shift+1 fits the graph, Shift+2 the selection.
  if (e.shiftKey && !mod && e.key === '!') return 'fit'
  if (e.shiftKey && !mod && e.key === '@') return 'zoom-selection'
  if (e.shiftKey && !mod && e.key === '1') return 'fit'
  if (e.shiftKey && !mod && e.key === '2') return 'zoom-selection'
  if (e.key === 'Delete' || e.key === 'Backspace') return 'delete'
  if (e.key === 'Escape') return 'escape'
  return null
}

// What bare typing on the canvas means: with a node selected it renames the
// node in place; otherwise it drops into quick-find. Slash always finds.
export type TypeIntent = 'search' | 'rename' | null

export function resolveTypeIntent(e: KeyLike & { altKey?: boolean }, hasSelection: boolean): TypeIntent {
  if (isEditingTarget(e.target)) return null
  if (e.ctrlKey || e.metaKey || e.altKey) return null
  if (e.key === '/') return 'search'
  if (e.key.length === 1 && e.key !== ' ') return hasSelection ? 'rename' : 'search'
  if ((e.key === 'Enter' || e.key === 'F2') && hasSelection) return 'rename'
  return null
}
