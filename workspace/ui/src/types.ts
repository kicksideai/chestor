// Host-provided props for the workspace element. route is the shell's deep-link
// sub-path under /workspace (fed by the surface host); its first segment is the
// entry id whose full manage view is open ("" = the tree).
export interface ComponentProps {
  route?: string
}

// The entry shape the API returns. An entry is a component: id is the component
// id, the tree is parent_id + sort_order (lexorank), access_level is the actor's
// mask on it. type/name/icon/status come from component meta.
export interface Entry {
  id: string
  parent_id?: string | null
  type: string
  name: string
  icon?: string
  status: string
  sort_order?: string
  tags?: string[]
  content?: Record<string, unknown>
  meta?: Record<string, unknown>
  access_level?: number
  children_count?: number
  // A container kind (folder, or a kind with meta.container) is navigated into to
  // show its children, rather than opening a manage view.
  container?: boolean
  created_at?: number | string
  updated_at?: number | string
  // The web-component tag the shell mounts to view this entry, resolved from the
  // kind binding's meta.renderer. Per-entry so any kind can reuse its module page.
  renderer?: string
}

// A declared entry type (from /workspace/entries/types). renderer is the web
// component tag the shell mounts for this type; absent for leaf types (folder).
export interface EntryType {
  value: string
  label: string
  icon: string
  color: string
  description?: string
  creatable: boolean
  picker_excluded?: boolean
  renderer?: string
  // The create surface the shell mounts in a popup for this kind: view is a
  // web-component tag (a custom one, or the generic wc-entry-create).
  create?: { view: string; surface?: string }
  // The full manage surface (deep-linkable inner page) for this kind.
  manage?: { view: string; surface?: string; deep_link?: boolean }
}
