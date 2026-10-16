<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { api, loadByTagName } from '@wippy-fe/proxy'
import { canDrillInto, entryUrl, listEntriesUrl, type WorkspaceEntry } from './workspace-entries'

const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
const host = ref<HTMLElement | null>(null)
const path = ref<WorkspaceEntry[]>([])
const selected = ref<WorkspaceEntry | null>(null)
const loading = ref(false)
const error = ref('')
const source = computed(() => listEntriesUrl(path.value.at(-1)?.id || null))
let picker: HTMLElement | null = null
let generation = 0
let selectionGeneration = 0

async function loadSelected(id: string) {
  const revision = ++selectionGeneration
  selected.value = null
  if (!id) return
  try {
    const { data } = await api.get(entryUrl(id))
    if (!data.success || !data.entry) throw new Error(data.error || 'Could not load the selected component.')
    if (revision === selectionGeneration) selected.value = data.entry
  } catch (err) {
    if (revision === selectionGeneration) error.value = err instanceof Error ? err.message : 'Could not load the selected component.'
  }
}
function onChange(event: Event) {
  const detail = (event as CustomEvent<{ thread_id?: string }>).detail
  if (typeof detail?.thread_id !== 'string') { error.value = 'Component picker returns an invalid selection.'; return }
  emit('update:modelValue', detail.thread_id)
  void loadSelected(detail.thread_id)
}
function onError(event: Event) {
  error.value = (event as CustomEvent<{ message?: string }>).detail?.message || 'Component picker is unavailable.'
}
async function mountPicker() {
  const revision = ++generation
  loading.value = true
  error.value = ''
  try {
    await loadByTagName('wc-component-picker', { timeoutMs: 8000 })
    if (revision !== generation || !host.value) return
    picker?.removeEventListener('change', onChange)
    picker?.removeEventListener('error', onError)
    picker = document.createElement('wc-component-picker')
    picker.setAttribute('source', source.value)
    picker.setAttribute('placeholder', 'Select a component…')
    picker.setAttribute('value', JSON.stringify({ thread_id: props.modelValue || '' }))
    picker.addEventListener('change', onChange)
    picker.addEventListener('error', onError)
    host.value.replaceChildren(picker)
  } catch (err) {
    if (revision === generation) error.value = err instanceof Error ? err.message : 'Component picker is unavailable.'
  } finally {
    if (revision === generation) loading.value = false
  }
}
function browse() {
  if (selected.value && canDrillInto(selected.value)) path.value = [...path.value, selected.value]
}
watch(source, value => picker?.setAttribute('source', value))
watch(() => props.modelValue || '', value => {
  picker?.setAttribute('value', JSON.stringify({ thread_id: value }))
  void loadSelected(value)
})
onMounted(() => { void mountPicker(); void loadSelected(props.modelValue || '') })
onBeforeUnmount(() => {
  generation += 1
  selectionGeneration += 1
  picker?.removeEventListener('change', onChange)
  picker?.removeEventListener('error', onError)
  picker = null
})
</script>
<template>
  <div class="kg-component-picker">
    <div class="kg-component-path">
      <button class="kg-mini kg-mini--wide" :class="{ active: !path.length }" @click="path = []">Root</button>
      <button v-for="(crumb, i) in path" :key="crumb.id" class="kg-mini kg-mini--wide" @click="path = path.slice(0, i + 1)">{{ crumb.name || 'Untitled folder' }}</button>
    </div>
    <div ref="host" />
    <span v-if="loading" role="status">Loading component picker…</span>
    <div v-if="error" role="alert">{{ error }} <button class="kg-mini kg-mini--wide" @click="mountPicker">Retry</button></div>
    <button v-if="selected && canDrillInto(selected)" class="kg-mini kg-mini--wide" :aria-label="`Browse ${selected.name || 'folder'}`" @click="browse">Browse {{ selected.name || 'folder' }}</button>
  </div>
</template>
