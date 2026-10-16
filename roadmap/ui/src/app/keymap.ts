// Pure keyboard mapping, dependency-free so it can be unit-tested and reused
// by the root component's @keydown handler.

import { LENSES, type Lens } from './types'

export type RoadmapAction = 'undo' | 'redo' | 'delete' | 'escape' | null

export interface KeyLike {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  // Present when the event originates from a form field; editing keys are ignored there.
  target?: { tagName?: string } | EventTarget | null
}

const EDITABLE = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

export function isEditingTarget(target: KeyLike['target']): boolean {
  const tag = (target as { tagName?: string } | null)?.tagName
  return typeof tag === 'string' && EDITABLE.has(tag.toUpperCase())
}

export function resolveAction(e: KeyLike): RoadmapAction {
  if (isEditingTarget(e.target)) return null
  const mod = Boolean(e.ctrlKey || e.metaKey)
  if (mod && (e.key === 'z' || e.key === 'Z')) return e.shiftKey ? 'redo' : 'undo'
  if (mod && (e.key === 'y' || e.key === 'Y')) return 'redo'
  if (e.key === 'Delete' || e.key === 'Backspace') return 'delete'
  if (e.key === 'Escape') return 'escape'
  return null
}

/** Bare digits switch the lens; the four lenses are one model seen four ways. */
export function resolveLens(e: KeyLike): Lens | null {
  if (isEditingTarget(e.target)) return null
  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return null
  const digit = Number(e.key)
  if (!Number.isInteger(digit) || digit < 1 || digit > LENSES.length) return null
  return LENSES[digit - 1]
}
