/**
 * Where the reader is standing.
 *
 * A journal is read by descending: the journal holds graphs, a graph holds
 * branches, a branch holds records. The stack of those steps is the focus, the
 * lens is how the current focus is drawn, and the two together are one
 * addressable place — so a lens change keeps the place, a descent grows it, and
 * the whole thing survives a reload or a paste into someone else's window.
 */

export type Lens = 'now' | 'outline' | 'graph' | 'lanes' | 'recall' | 'changes'

export const LENSES: Lens[] = ['now', 'outline', 'graph', 'lanes', 'recall', 'changes']

/** The letter each lens answers to, in the keyboard grammar. */
export const LENS_KEYS: Record<string, Lens> = {
  n: 'now', o: 'outline', g: 'graph', t: 'lanes', r: 'recall', c: 'changes',
}

export type FocusKind = 'journal' | 'graph' | 'branch' | 'node'

export interface Focus {
  kind: FocusKind
  /** Empty for the journal itself; a graph id, or a record id inside one. */
  id: string
  label: string
  /** The graph a branch or record belongs to. */
  graphId?: string
}

export const JOURNAL_FOCUS: Focus = { kind: 'journal', id: '', label: 'Journal' }

/** What a lens remembers about how the reader had this focus arranged. */
export interface ViewportMemory {
  zoom?: number
  x?: number
  y?: number
  scrollTop?: number
  selectedId?: string
}

export interface Place {
  focus: Focus[]
  lens: Lens
}

function sameFocus(a: Focus[], b: Focus[]): boolean {
  return a.length === b.length && a.every((item, at) => item.kind === b[at].kind && item.id === b[at].id)
}

export function samePlace(a: Place, b: Place): boolean {
  return a.lens === b.lens && sameFocus(a.focus, b.focus)
}

/** The address of a focus, independent of the lens reading it. */
export function focusKey(focus: Focus[]): string {
  return focus.map(item => `${item.kind}:${item.id}`).join('/')
}

function encodePart(value: string): string { return encodeURIComponent(value) }

/**
 * The route: lens first, then the descent. Labels are left out — they belong to
 * the data and are read back from it, so a route stays valid after a rename.
 */
export function encodeRoute(place: Place): string {
  const path = place.focus
    .filter(item => item.kind !== 'journal')
    .map(item => `${item.kind}:${encodePart(item.id)}`)
    .join('/')
  return path ? `${place.lens}/${path}` : place.lens
}

const KINDS = new Set<FocusKind>(['journal', 'graph', 'branch', 'node'])

export function decodeRoute(route: string): Place {
  const parts = String(route || '').split('/').filter(Boolean)
  const lens = LENSES.includes(parts[0] as Lens) ? parts[0] as Lens : 'now'
  const focus: Focus[] = [JOURNAL_FOCUS]
  let graphId = ''
  for (const part of parts.slice(1)) {
    const at = part.indexOf(':')
    if (at < 0) continue
    const kind = part.slice(0, at) as FocusKind
    const id = decodeURIComponent(part.slice(at + 1))
    if (!KINDS.has(kind) || kind === 'journal' || !id) continue
    if (kind === 'graph') graphId = id
    focus.push({ kind, id, label: id, graphId: kind === 'graph' ? id : graphId })
  }
  return { focus, lens }
}

/** The graph the current focus lives in, when the reader is inside one. */
export function graphOf(place: Place): string {
  for (let at = place.focus.length - 1; at >= 0; at--) {
    const item = place.focus[at]
    if (item.kind === 'graph') return item.id
    if (item.graphId) return item.graphId
  }
  return ''
}

/** The record the current focus stands on, when it stands on one. */
export function recordOf(place: Place): string {
  const last = place.focus[place.focus.length - 1]
  return last && (last.kind === 'branch' || last.kind === 'node') ? last.id : ''
}

const HISTORY_LIMIT = 120

/**
 * How many arrangements are kept. A reader descends through a journal of any
 * size, and every step they take in every lens would otherwise be remembered
 * forever. The bound is comfortably wider than the history a reader can walk
 * back through, so what is dropped is a place they can no longer return to by
 * moving.
 */
const VIEWPORT_MEMORY_LIMIT = 240

/**
 * Browser-style movement over places. Every step a reader takes is recorded, so
 * back returns them to where they were rather than one level up the tree, and
 * forward returns them to where they had gone.
 */
export class NavigationStore {
  private history: Place[]
  private at = 0
  private memory = new Map<string, ViewportMemory>()

  constructor(initial: Place = { focus: [JOURNAL_FOCUS], lens: 'now' }) {
    this.history = [initial]
  }

  get place(): Place { return this.history[this.at] }
  get focus(): Focus[] { return this.place.focus }
  get lens(): Lens { return this.place.lens }
  get current(): Focus { return this.place.focus[this.place.focus.length - 1] }
  get depth(): number { return this.place.focus.length }
  get canBack(): boolean { return this.at > 0 }
  get canForward(): boolean { return this.at < this.history.length - 1 }

  private commit(place: Place) {
    if (samePlace(place, this.place)) return
    this.history = [...this.history.slice(0, this.at + 1), place]
    if (this.history.length > HISTORY_LIMIT) this.history = this.history.slice(this.history.length - HISTORY_LIMIT)
    this.at = this.history.length - 1
  }

  /** One step down: into a graph, a branch or a record. */
  descend(focus: Focus) {
    const existing = this.place.focus.findIndex(item => item.kind === focus.kind && item.id === focus.id)
    if (existing >= 0) { this.toIndex(existing); return }
    this.commit({ lens: this.place.lens, focus: [...this.place.focus, focus] })
  }

  /** One step out. The journal itself is the floor. */
  ascend(): boolean {
    if (this.place.focus.length <= 1) return false
    this.commit({ lens: this.place.lens, focus: this.place.focus.slice(0, -1) })
    return true
  }

  /** Straight to one step of the breadcrumb. */
  toIndex(index: number) {
    const bounded = Math.max(0, Math.min(index, this.place.focus.length - 1))
    this.commit({ lens: this.place.lens, focus: this.place.focus.slice(0, bounded + 1) })
  }

  /** A lens projects the focus, so switching one keeps the reader in place. */
  setLens(lens: Lens) {
    this.commit({ lens, focus: this.place.focus })
  }

  /** Replaces the whole place, as a restored route or a shared link does. */
  go(place: Place) { this.commit(place) }

  /** Relabels the crumbs once the data that names them has loaded. */
  relabel(labels: ReadonlyMap<string, string>) {
    this.history = this.history.map(place => ({
      lens: place.lens,
      focus: place.focus.map(item => {
        const label = labels.get(`${item.kind}:${item.id}`)
        return label && label !== item.label ? { ...item, label } : item
      }),
    }))
  }

  back(): boolean {
    if (!this.canBack) return false
    this.at--
    return true
  }

  forward(): boolean {
    if (!this.canForward) return false
    this.at++
    return true
  }

  /** Every lens keeps its own arrangement of each focus. */
  rememberViewport(value: ViewportMemory) {
    const key = `${this.lens}@${focusKey(this.focus)}`
    const held = this.memory.get(key)
    // Re-inserting moves the entry to the end, so the bound below always drops
    // the place the reader touched longest ago.
    this.memory.delete(key)
    this.memory.set(key, { ...held, ...value })
    while (this.memory.size > VIEWPORT_MEMORY_LIMIT) {
      const oldest = this.memory.keys().next()
      if (oldest.done) break
      this.memory.delete(oldest.value)
    }
  }

  viewport(): ViewportMemory | undefined {
    return this.memory.get(`${this.lens}@${focusKey(this.focus)}`)
  }

  route(): string { return encodeRoute(this.place) }
}
