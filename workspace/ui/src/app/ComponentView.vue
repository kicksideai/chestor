<script setup lang="ts">
import { computed } from 'vue'
import type { Entry } from '../types'

// Generic, kind-agnostic component view. The fallback the workspace renders for any
// entry whose kind declares no `renderer`. It reads ONLY the universal entry shape
// (id, type, status, access, dates, meta) the component service already returns --
// no module imports, no impl_id switches -- so it stays workspace-level and coupled
// to nothing but the component contract. Kinds with a real page opt out by declaring
// meta.renderer; this is the safety net so no component is ever blank.
const props = defineProps<{ entry: Entry; mode?: 'preview' | 'full' }>()

// Meta keys already surfaced in the header/overview, so the metadata list omits them.
const SHOWN = new Set(['title', 'name', 'icon', 'type', 'status', 'color', 'renderer'])

function toDate(v: unknown): Date | null {
  if (v == null || v === '') return null
  if (typeof v === 'number') return new Date(v < 2e10 ? v * 1000 : v)
  const d = new Date(String(v))
  return isNaN(d.getTime()) ? null : d
}
function fmt(v: unknown): string {
  const d = toDate(v)
  return d ? d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
}


const typeLabel = computed(() => ((props.entry.type || 'item').split('.').pop() || 'item').replace(/[_-]/g, ' ').toUpperCase())
const created = computed(() => fmt(props.entry.created_at))
const updated = computed(() => fmt(props.entry.updated_at))

const accessLabel = computed(() => {
  const a = props.entry.access_level
  if (a == null) return 'Full (owner)'
  const bits: string[] = []
  if (a & 1) bits.push('Read')
  if (a & 2) bits.push('Write')
  if (a & 4) bits.push('Delete')
  if (a & 8) bits.push('Admin')
  return bits.length ? bits.join(' · ') : 'None'
})

const metaRows = computed(() => {
  const m = props.entry.meta || {}
  const rows: { k: string; v: string }[] = []
  for (const [k, v] of Object.entries(m)) {
    if (SHOWN.has(k)) continue
    if (v == null || typeof v === 'object') continue
    const s = String(v)
    if (s !== '') rows.push({ k: k.replace(/[_-]/g, ' '), v: s })
  }
  return rows
})
</script>

<template>
  <div class="ws-cv" :class="`ws-cv--${mode || 'preview'}`">
    <div class="ws-cv-section">
      <div class="ws-cv-row"><span class="ws-cv-k">Type</span><span class="ws-cv-v">{{ typeLabel }}</span></div>
      <div class="ws-cv-row"><span class="ws-cv-k">Status</span><span class="ws-cv-v">{{ entry.status || 'active' }}</span></div>
      <div class="ws-cv-row"><span class="ws-cv-k">Access</span><span class="ws-cv-v">{{ accessLabel }}</span></div>
    </div>

    <div v-if="created || updated" class="ws-cv-section">
      <div v-if="created" class="ws-cv-row"><span class="ws-cv-k">Created</span><span class="ws-cv-v">{{ created }}</span></div>
      <div v-if="updated" class="ws-cv-row"><span class="ws-cv-k">Updated</span><span class="ws-cv-v">{{ updated }}</span></div>
    </div>

    <div v-if="metaRows.length" class="ws-cv-section">
      <div class="ws-cv-sec-title">Metadata</div>
      <div v-for="r in metaRows" :key="r.k" class="ws-cv-row">
        <span class="ws-cv-k">{{ r.k }}</span><span class="ws-cv-v">{{ r.v }}</span>
      </div>
    </div>
  </div>
</template>
