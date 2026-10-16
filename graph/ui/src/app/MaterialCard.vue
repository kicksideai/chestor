<script setup lang="ts">
import { computed } from 'vue'
import MaterialSourceEditor from './MaterialSourceEditor.vue'
import type { GraphMaterial, GraphTypeDef } from './types'

const props = defineProps<{
  material: GraphMaterial
  materialTypes: GraphTypeDef[]
  expanded: boolean
}>()
const emit = defineEmits<{
  (e: 'toggle'): void
  (e: 'update', patch: Record<string, unknown>): void
  (e: 'remove'): void
}>()

const def = computed(() => props.materialTypes.find(d => d.id === props.material.kind))
const kindTitle = computed(() => String(def.value?.title || props.material.kind))

const fields = computed<Array<{ key: string; type?: string; label?: string; options?: string[] }>>(() => {
  const f = def.value?.fields as unknown
  if (Array.isArray(f)) return f as Array<{ key: string; type?: string; label?: string }>
  if (f && typeof f === 'object') return Object.entries(f as Record<string, Record<string, unknown>>).map(([key, v]) => ({ key, ...(v || {}) }))
  return []
})

// One-line summary for the collapsed row: title, else a hint from the source.
const collapsedText = computed(() => {
  if (props.material.title) return props.material.title
  const src = props.material.source
  if (src?.type === 'component') return 'component reference'
  if (src?.type === 'url' && src.url) { try { return new URL(String(src.url)).host } catch { return String(src.url) } }
  if (src?.type === 'upload') return 'upload'
  const text = String(src?.text || props.material.summary || '')
  return text ? text.slice(0, 60) : 'empty'
})

function setField(key: string, value: string) {
  emit('update', { meta: { ...(props.material.meta || {}), [key]: value } })
}
</script>

<template>
  <div class="kg-material" :class="{ 'kg-material--open': expanded }">
    <div class="kg-material-head" role="button" tabindex="0" @click="emit('toggle')" @keydown.enter="emit('toggle')" @keydown.space.prevent="emit('toggle')">
      <span class="kg-mat-kind">{{ kindTitle }}</span>
      <span class="kg-mat-title">{{ collapsedText }}</span>
      <span class="kg-mat-chevron" :class="{ open: expanded }">›</span>
      <button class="kg-mini kg-danger" :aria-label="`Remove ${kindTitle} material`" @click.stop="emit('remove')">×</button>
    </div>

    <template v-if="expanded">
      <input class="kg-input kg-small" :value="material.title || ''" placeholder="title" @change="emit('update', { title: ($event.target as HTMLInputElement).value })" />
      <textarea class="kg-textarea kg-small" rows="2" :value="material.summary || ''" placeholder="summary" @change="emit('update', { summary: ($event.target as HTMLTextAreaElement).value })"></textarea>

      <template v-for="f in fields" :key="f.key">
        <textarea v-if="f.type === 'textarea' || f.key === 'body'" class="kg-textarea kg-small" rows="2"
          :value="String(material.meta?.[f.key] ?? '')" :placeholder="f.label || f.key"
          @change="setField(f.key, ($event.target as HTMLTextAreaElement).value)"></textarea>
        <select v-else-if="f.type === 'select'" class="kg-input kg-small" :value="String(material.meta?.[f.key] ?? '')"
          @change="setField(f.key, ($event.target as HTMLSelectElement).value)">
          <option value="">{{ f.label || f.key }}</option>
          <option v-for="o in f.options || []" :key="o" :value="o">{{ o }}</option>
        </select>
        <input v-else class="kg-input kg-small" :type="f.type === 'number' ? 'number' : 'text'"
          :value="String(material.meta?.[f.key] ?? '')" :placeholder="f.label || f.key"
          @change="setField(f.key, ($event.target as HTMLInputElement).value)" />
      </template>

      <MaterialSourceEditor :material="material" @update="(patch) => emit('update', patch)" />
    </template>
  </div>
</template>
