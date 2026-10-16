import { ref } from 'vue'
import { api } from '@wippy-fe/proxy'
import type { Entry, EntryType } from '../types'

// Host API bridge for the workspace surface. The tree + access live server-side
// on the component system; this only ferries entry CRUD over the admin API. The
// host API is the synchronous proxy export; each operation remains asynchronous.

const BASE = '/api/v1/workspace/entries'

function messageOf(e: unknown, fallback: string): string {
  const data = (e as any)?.response?.data ?? (e as any)?.data
  if (typeof data?.error === 'string' && data.error) return data.error
  return e instanceof Error ? e.message : fallback
}

export function useWorkspaceApi() {
  const types = ref<EntryType[]>([])
  const error = ref('')

  async function loadTypes(): Promise<void> {
    try {
      const { data } = await api.get(`${BASE}/types`)
      if (data.success) types.value = data.types ?? []
    } catch (e) { error.value = messageOf(e, 'failed to load types') }
  }

  async function list(parentId: string | null): Promise<Entry[]> {
    const url = parentId ? `${BASE}?parent_id=${encodeURIComponent(parentId)}` : BASE
    try {
      const { data } = await api.get(url)
      if (!data.success) throw new Error(data.error || 'Could not load this folder.')
      return (data.entries ?? []) as Entry[]
    } catch (err) {
      throw new Error(messageOf(err, 'Could not load this folder.'))
    }
  }

  async function get(id: string): Promise<Entry | null> {
    const { data } = await api.get(`${BASE}/${id}`)
    return data.success ? (data.entry as Entry) : null
  }

  async function breadcrumbs(id: string): Promise<{ id: string; name: string; type: string }[]> {
    const { data } = await api.get(`${BASE}/${id}/breadcrumbs`)
    return data.success ? (data.breadcrumbs ?? []) : []
  }

  async function create(input: Partial<Entry> & { type: string; name: string; parent_id?: string | null }): Promise<Entry> {
    const { data } = await api.post(BASE, input)
    if (!data.success) throw new Error(data.error || 'failed to create')
    return data.entry as Entry
  }

  // Upload a blob through the shared uploads pipeline, tagged with the destination
  // folder. The pipeline's universal stage registers the `file` component under that
  // parent on completion -- the workspace stores no bytes and creates no entry here,
  // so the same path works from any upload trigger. Creation is async; the caller
  // re-lists to pick it up. Returns the upload id.
  async function uploadFile(file: File, parentId: string | null): Promise<string> {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('metadata', JSON.stringify({ target_parent_id: parentId ?? '', filename: file.name }))
    const { data } = await api.post('/api/v1/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    const uploadId = data.uuid || data.upload_id || data.id || data.upload?.id
    if (!uploadId) throw new Error(data.error || 'upload failed')
    return String(uploadId)
  }

  // Patch mutable display fields (name/icon/color/status). Used by Properties.
  async function update(id: string, fields: Record<string, unknown>): Promise<Entry> {
    const { data } = await api.put(`${BASE}/${id}`, fields)
    if (!data.success) throw new Error(data.error || 'failed to update')
    return data.entry as Entry
  }

  // Export an entry (and its subtree) as a portable .kxb bundle, via the shared
  // transfer module — entries are components, so this is the same path as any
  // other component export. Returns a blob the caller downloads.
  async function exportEntry(id: string): Promise<Blob> {
    const { data } = await api.post('/api/v1/transfer/export',
      { component_ids: [id] }, { responseType: 'blob' })
    return data as unknown as Blob
  }

  async function move(id: string, parentId: string | null): Promise<void> {
    // Root is the empty string on the wire: JSON null decodes server-side to
    // "argument absent" and the move silently no-ops.
    const { data } = await api.post(`${BASE}/${id}/move`, { parent_id: parentId ?? '' })
    if (!data.success) throw new Error(data.error || 'failed to move')
  }

  // A large entry is released at once while its bounded cleanup continues durably;
  // inProgress reports that accepted continuation.
  async function remove(id: string): Promise<{ inProgress: boolean }> {
    const { data } = await api.delete(`${BASE}/${id}`)
    if (!data.success) throw new Error(data.error || 'failed to delete')
    return { inProgress: data.in_progress === true }
  }

  async function countDescendants(id: string): Promise<number> {
    const children = await list(id)
    let total = children.length
    for (const child of children) {
      if (child.type === 'folder' || child.container) total += await countDescendants(child.id)
    }
    return total
  }

  return { types, error, loadTypes, list, get, breadcrumbs, create, uploadFile, update, move, remove, countDescendants, exportEntry }
}
