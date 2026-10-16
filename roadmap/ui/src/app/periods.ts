// Period keys are canonical sortable strings — `YYYY-Qn` and `YYYY-MM`.
// Parsing, formatting and indexing them is the whole of the client's period
// arithmetic: `current_period` is computed by the server from UTC now, so the
// UI never touches a calendar.

import type { PeriodKind } from './types'

const QUARTER = /^(\d{4})-Q([1-4])$/
const MONTH = /^(\d{4})-(0[1-9]|1[0-2])$/

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Units in one year, per kind. */
export function unitsPerYear(kind: PeriodKind): number {
  return kind === 'month' ? 12 : 4
}

export interface PeriodParts {
  year: number
  /** 1-based quarter (1..4) or month (1..12). */
  unit: number
}

export function parsePeriod(key: string, kind: PeriodKind): PeriodParts | null {
  const match = (kind === 'month' ? MONTH : QUARTER).exec(String(key || ''))
  if (!match) return null
  return { year: Number(match[1]), unit: Number(match[2]) }
}

export function isPeriod(key: string, kind: PeriodKind): boolean {
  return parsePeriod(key, kind) !== null
}

/** Absolute ordinal so two keys of one kind can be compared and subtracted. */
export function periodIndex(key: string, kind: PeriodKind): number | null {
  const parts = parsePeriod(key, kind)
  if (!parts) return null
  return parts.year * unitsPerYear(kind) + (parts.unit - 1)
}

export function formatPeriod(index: number, kind: PeriodKind): string {
  const per = unitsPerYear(kind)
  const year = Math.floor(index / per)
  const unit = index - year * per + 1
  return kind === 'month' ? `${year}-${String(unit).padStart(2, '0')}` : `${year}-Q${unit}`
}

export function shiftPeriod(key: string, delta: number, kind: PeriodKind): string | null {
  const index = periodIndex(key, kind)
  if (index === null) return null
  return formatPeriod(index + delta, kind)
}

export function comparePeriods(a: string, b: string, kind: PeriodKind): number {
  const ai = periodIndex(a, kind)
  const bi = periodIndex(b, kind)
  if (ai === null || bi === null) return 0
  return ai - bi
}

/** The visible window: `columns` consecutive keys starting at `origin`. */
export function periodRange(origin: string, columns: number, kind: PeriodKind): string[] {
  const start = periodIndex(origin, kind)
  const count = Math.max(1, Math.floor(columns) || 0)
  if (start === null) return []
  const keys: string[] = []
  for (let i = 0; i < count; i++) keys.push(formatPeriod(start + i, kind))
  return keys
}

/** Display form: `Q3 ’26` / `Sep ’26`. The apostrophe is typographic on purpose. */
export function periodLabel(key: string, kind: PeriodKind): string {
  const parts = parsePeriod(key, kind)
  if (!parts) return key || '—'
  const year = `’${String(parts.year % 100).padStart(2, '0')}`
  return kind === 'month' ? `${MONTH_NAMES[parts.unit - 1]} ${year}` : `Q${parts.unit} ${year}`
}

/** Long display form for headings and the inspector: `2026-Q3` reads as `Q3 2026`. */
export function periodLongLabel(key: string, kind: PeriodKind): string {
  const parts = parsePeriod(key, kind)
  if (!parts) return key || '—'
  return kind === 'month' ? `${MONTH_NAMES[parts.unit - 1]} ${parts.year}` : `Q${parts.unit} ${parts.year}`
}

/** Options for a period picker: a window around the roadmap origin. */
export function periodChoices(origin: string, columns: number, kind: PeriodKind, pad = 4): string[] {
  const start = periodIndex(origin, kind)
  if (start === null) return []
  const count = Math.max(1, Math.floor(columns) || 0)
  const keys: string[] = []
  for (let i = -pad; i < count + pad; i++) keys.push(formatPeriod(start + i, kind))
  return keys
}
