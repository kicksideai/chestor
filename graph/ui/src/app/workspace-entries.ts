export interface WorkspaceEntry {
  id: string
  type?: string
  name?: string
  container?: boolean
  children_count?: number
}

const BASE = '/api/v1/workspace/entries'

export function listEntriesUrl(parentId: string | null): string {
  return parentId ? `${BASE}?parent_id=${encodeURIComponent(parentId)}` : BASE
}

export function entryUrl(id: string): string {
  return `${BASE}/${encodeURIComponent(id)}`
}

export function entryLabel(entry: WorkspaceEntry | null | undefined, fallback = ''): string {
  if (!entry) return fallback
  return entry.name || entry.id || fallback
}

export function canDrillInto(entry: WorkspaceEntry): boolean {
  return entry.container === true || Number(entry.children_count || 0) > 0
}
