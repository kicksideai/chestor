// Inverse-command undo for the event-sourced schema. The thread stays
// append-only: undo never rewrites history, it applies the inverse command as a
// new event. Inverses are computed against the read-model snapshot taken just
// before the original command applied, so a removed table restores with its
// columns, relations, and position.
export interface Cmd {
  type: string
  body: Record<string, unknown>
}

export interface ColumnSnap {
  id: string
  table_id: string
  name: string
  col_type?: string
  primary_key?: boolean
  nullable?: boolean
  unique_col?: boolean
}

export interface TableSnap {
  id: string
  name: string
  description?: string
  columns: ColumnSnap[]
  layout?: { x: number; y: number }
}

export interface RelationSnap {
  id: string
  from_table_id: string
  to_table_id: string
  from_column_id?: string
  to_column_id?: string
  relation_type: string
  name?: string
}

export interface StateSnap {
  tables: TableSnap[]
  relations: RelationSnap[]
}

export const EV = {
  TABLE_ADDED: 'chestor.db_schema.events:table.added',
  TABLE_UPDATED: 'chestor.db_schema.events:table.updated',
  TABLE_REMOVED: 'chestor.db_schema.events:table.removed',
  COLUMN_ADDED: 'chestor.db_schema.events:column.added',
  COLUMN_UPDATED: 'chestor.db_schema.events:column.updated',
  COLUMN_REMOVED: 'chestor.db_schema.events:column.removed',
  RELATION_ADDED: 'chestor.db_schema.events:relation.added',
  RELATION_UPDATED: 'chestor.db_schema.events:relation.updated',
  RELATION_REMOVED: 'chestor.db_schema.events:relation.removed',
  LAYOUT_POSITION_SET: 'chestor.db_schema.events:layout.position-set',
}

function findTable(s: StateSnap, id: unknown): TableSnap | undefined {
  return s.tables.find(t => t.id === id)
}
function findColumn(s: StateSnap, id: unknown): ColumnSnap | undefined {
  for (const t of s.tables) {
    const c = (t.columns || []).find(c => c.id === id)
    if (c) return c
  }
  return undefined
}

function restoreColumnCmd(c: ColumnSnap): Cmd {
  return { type: EV.COLUMN_ADDED, body: { id: c.id, table_id: c.table_id, name: c.name, col_type: c.col_type, primary_key: c.primary_key, nullable: c.nullable, unique_col: c.unique_col } }
}
function restoreRelationCmd(r: RelationSnap): Cmd {
  return { type: EV.RELATION_ADDED, body: { id: r.id, from_table_id: r.from_table_id, to_table_id: r.to_table_id, from_column_id: r.from_column_id, to_column_id: r.to_column_id, relation_type: r.relation_type, name: r.name } }
}

// The inverse of one command against the pre-apply state. Unknown command types
// return null — the caller then skips history for that batch rather than
// recording a lie.
export function inverseOf(cmd: Cmd, before: StateSnap): Cmd[] | null {
  const b = cmd.body
  switch (cmd.type) {
    case EV.TABLE_ADDED:
      return [{ type: EV.TABLE_REMOVED, body: { id: b.id } }]
    case EV.TABLE_REMOVED: {
      const t = findTable(before, b.id)
      if (!t) return []
      const out: Cmd[] = [{ type: EV.TABLE_ADDED, body: { id: t.id, name: t.name, description: t.description } }]
      if (t.layout && typeof t.layout.x === 'number') out.push({ type: EV.LAYOUT_POSITION_SET, body: { table_id: t.id, x: t.layout.x, y: t.layout.y } })
      for (const c of t.columns || []) out.push(restoreColumnCmd(c))
      for (const r of before.relations) {
        if (r.from_table_id === t.id || r.to_table_id === t.id) out.push(restoreRelationCmd(r))
      }
      return out
    }
    case EV.TABLE_UPDATED: {
      const t = findTable(before, b.id)
      if (!t) return []
      const body: Record<string, unknown> = { id: t.id }
      if ('name' in b) body.name = t.name
      if ('description' in b) body.description = t.description ?? ''
      return [{ type: EV.TABLE_UPDATED, body }]
    }
    case EV.COLUMN_ADDED:
      return [{ type: EV.COLUMN_REMOVED, body: { id: b.id } }]
    case EV.COLUMN_REMOVED: {
      const c = findColumn(before, b.id)
      return c ? [restoreColumnCmd(c)] : []
    }
    case EV.COLUMN_UPDATED: {
      const c = findColumn(before, b.id)
      if (!c) return []
      const body: Record<string, unknown> = { id: c.id }
      for (const key of ['name', 'col_type', 'primary_key', 'nullable', 'unique_col'] as const) {
        if (key in b) body[key] = c[key]
      }
      return [{ type: EV.COLUMN_UPDATED, body }]
    }
    case EV.RELATION_ADDED:
      return [{ type: EV.RELATION_REMOVED, body: { id: b.id } }]
    case EV.RELATION_REMOVED: {
      const r = before.relations.find(r => r.id === b.id)
      return r ? [restoreRelationCmd(r)] : []
    }
    case EV.RELATION_UPDATED: {
      const r = before.relations.find(r => r.id === b.id)
      if (!r) return []
      const body: Record<string, unknown> = { id: r.id }
      if ('relation_type' in b) body.relation_type = r.relation_type
      if ('name' in b) body.name = r.name ?? ''
      return [{ type: EV.RELATION_UPDATED, body }]
    }
    case EV.LAYOUT_POSITION_SET: {
      const t = findTable(before, b.table_id)
      if (!t?.layout || typeof t.layout.x !== 'number') return []
      return [{ type: EV.LAYOUT_POSITION_SET, body: { table_id: t.id, x: t.layout.x, y: t.layout.y } }]
    }
    default:
      return null
  }
}

// The inverse of a batch: each command inverted against the same pre-apply
// snapshot, applied in reverse order. Null if any command is uninvertible.
export function inverseBatch(cmds: Cmd[], before: StateSnap): Cmd[] | null {
  const out: Cmd[] = []
  for (const cmd of [...cmds].reverse()) {
    const inv = inverseOf(cmd, before)
    if (inv === null) return null
    out.push(...inv)
  }
  return out
}
