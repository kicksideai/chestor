import type { Entry } from './types'

export function rendererAttrs(entry: Entry, mode: 'preview' | 'full'): Record<string, string> {
  return {
    'entry-id': entry.id,
    route: entry.id,
    mode,
    'read-only': String(entry.access_level != null && (entry.access_level & 2) !== 2),
  }
}
