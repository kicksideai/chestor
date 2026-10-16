// Schema serializers: SQL DDL and DBML (the dbdiagram.io DSL, the de-facto
// schema interchange format). Pure functions over the read model.
export interface ColumnOut {
  id: string
  table_id: string
  name: string
  col_type?: string
  primary_key?: boolean
  nullable?: boolean
  unique_col?: boolean
}

export interface TableOut {
  id: string
  name: string
  description?: string
  columns: ColumnOut[]
}

export interface RelationOut {
  id: string
  from_table_id: string
  to_table_id: string
  from_column_id?: string
  to_column_id?: string
  relation_type: string
  name?: string
}

const REL_LABEL: Record<string, string> = { one_to_many: '1:N', many_to_one: 'N:1', one_to_one: '1:1', many_to_many: 'N:N' }
// DBML ref operator between from.col and to.col.
const DBML_REL: Record<string, string> = { one_to_many: '<', many_to_one: '>', one_to_one: '-', many_to_many: '<>' }

function indexColumns(tables: TableOut[]): Map<string, ColumnOut> {
  const byId = new Map<string, ColumnOut>()
  for (const t of tables) for (const c of t.columns || []) byId.set(c.id, c)
  return byId
}

// SQL DDL. Relations with both column ends resolved emit real ALTER TABLE
// constraints after every CREATE (ordering-safe); table-level relations stay
// documented comments.
export function buildSql(tables: TableOut[], relations: RelationOut[]): string {
  const byId = new Map(tables.map(t => [t.id, t]))
  const colById = indexColumns(tables)
  const out: string[] = ['-- Schema export', '']
  for (const t of tables) {
    const cols = (t.columns || []).map(c => {
      const parts = [`  ${c.name} ${c.col_type || 'TEXT'}`]
      if (c.primary_key) parts.push('PRIMARY KEY')
      else if (c.nullable === false) parts.push('NOT NULL')
      if (c.unique_col && !c.primary_key) parts.push('UNIQUE')
      return parts.join(' ')
    })
    if (!cols.length) { out.push(`-- ${t.name}: no columns yet`, ''); continue }
    out.push(`CREATE TABLE ${t.name} (`, cols.join(',\n'), ');', '')
  }
  for (const r of relations) {
    const f = byId.get(r.from_table_id), tt = byId.get(r.to_table_id)
    if (!f || !tt) continue
    const fc = r.from_column_id ? colById.get(r.from_column_id) : undefined
    const tc = r.to_column_id ? colById.get(r.to_column_id) : undefined
    if (fc && tc) {
      const cname = r.name || `fk_${f.name}_${fc.name}`
      out.push(`ALTER TABLE ${f.name} ADD CONSTRAINT ${cname} FOREIGN KEY (${fc.name}) REFERENCES ${tt.name} (${tc.name});`)
    } else {
      out.push(`-- FK ${f.name} -> ${tt.name} (${REL_LABEL[r.relation_type] || r.relation_type})`)
    }
  }
  return out.join('\n')
}

// DBML column names with characters outside the bare-identifier set need quoting.
function dbmlIdent(name: string): string {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) ? name : `"${name.replace(/"/g, '')}"`
}

export function buildDbml(tables: TableOut[], relations: RelationOut[]): string {
  const byId = new Map(tables.map(t => [t.id, t]))
  const colById = indexColumns(tables)
  const out: string[] = []
  for (const t of tables) {
    out.push(`Table ${dbmlIdent(t.name)} {`)
    for (const c of t.columns || []) {
      const settings: string[] = []
      if (c.primary_key) settings.push('pk')
      if (c.unique_col && !c.primary_key) settings.push('unique')
      if (c.nullable === false && !c.primary_key) settings.push('not null')
      const suffix = settings.length ? ` [${settings.join(', ')}]` : ''
      out.push(`  ${dbmlIdent(c.name)} ${(c.col_type || 'TEXT').toLowerCase()}${suffix}`)
    }
    if (t.description) out.push(`  Note: '${t.description.replace(/'/g, "\\'")}'`)
    out.push('}', '')
  }
  for (const r of relations) {
    const f = byId.get(r.from_table_id), tt = byId.get(r.to_table_id)
    if (!f || !tt) continue
    const fc = r.from_column_id ? colById.get(r.from_column_id) : undefined
    const tc = r.to_column_id ? colById.get(r.to_column_id) : undefined
    const op = DBML_REL[r.relation_type] || '>'
    if (fc && tc) {
      const label = r.name ? `${dbmlIdent(r.name)}: ` : ''
      out.push(`Ref ${label}${dbmlIdent(f.name)}.${dbmlIdent(fc.name)} ${op} ${dbmlIdent(tt.name)}.${dbmlIdent(tc.name)}`)
    } else {
      out.push(`// Ref ${f.name} ${op} ${tt.name} (column ends not set)`)
    }
  }
  return out.join('\n')
}
