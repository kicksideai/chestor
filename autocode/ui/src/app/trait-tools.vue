<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { loadByTagName } from '@wippy-fe/proxy'
import { z } from 'zod'
import { autocode, ApiError, type ProfileInput } from './api.ts'
import { errorText } from './presentation.ts'

const props = defineProps<{ modelValue?: ProfileInput['tools']; agent: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: NonNullable<ProfileInput['tools']>]; invalid: [value: boolean] }>()
const traits = ref<Awaited<ReturnType<typeof autocode.traits>>>([])
const ready = ref(false)
const loadError = ref('')
const previewError = ref('')
const count = ref<number>()
const limit = ref<number>()
const checking = ref(false)
let active = true
let sequence = 0
onBeforeUnmount(() => { active = false; sequence++ })
const selected = computed(() => props.modelValue?.traits ?? [])
const unavailable = computed(() => selected.value.filter(id => !traits.value.some(t => t.id === id)))
const context = computed(() => props.modelValue?.context ?? {})
const pickerValue = computed(() => JSON.stringify({ traits: selected.value, trait_contexts: Object.fromEntries(selected.value.map(id => {
  const schema = traits.value.find(t => t.id === id)?.context_schema
  return [id, Object.fromEntries(Object.keys(schema?.properties ?? {}).filter(key => key in context.value).map(key => [key, context.value[key]]))]
})) }))
// Traits without a custom configuration panel use the platform schema form.
// The batch gateway has one shared context, so each field is edited once.
const schema = computed(() => {
  const properties: Record<string, Record<string, unknown>> = {}
  const required = new Set<string>()
  for (const trait of traits.value.filter(t => selected.value.includes(t.id) && !t.web_component)) {
    for (const [key, field] of Object.entries(trait.context_schema?.properties ?? {})) {
      properties[key] = { ...field, ...(!field.picker && (key === 'board_id' || key === 'catalog_id') ? { picker: 'wc-component-picker', class: key === 'board_id' ? 'work.board' : 'pim.catalog' } : {}) }
    }
    for (const key of trait.context_schema?.required ?? []) required.add(key)
  }
  return { type: 'object', properties, required: [...required] }
})
const selection = z.object({ traits: z.array(z.string()), trait_contexts: z.record(z.record(z.unknown())) })
function change(event: Event) {
  if (event.target !== event.currentTarget) return
  const value = selection.safeParse((event as CustomEvent).detail)
  if (!value.success) return
  const next = value.data
  const accepted = new Set(next.traits.flatMap(id => Object.keys(traits.value.find(t => t.id === id)?.context_schema?.properties ?? {})))
  const merged = Object.fromEntries(Object.entries(context.value).filter(([key]) => accepted.has(key)))
  // Apply edits relative to the prior per-trait values. Shared fields have the
  // same value in every panel, matching tools.context's batch contract.
  const previous = JSON.parse(pickerValue.value) as z.infer<typeof selection>
  for (const id of next.traits) {
    for (const [key, value] of Object.entries(next.trait_contexts[id] ?? {})) {
      if (accepted.has(key) && JSON.stringify(value) !== JSON.stringify(previous.trait_contexts[id]?.[key])) merged[key] = value
    }
    for (const key of Object.keys(previous.trait_contexts[id] ?? {})) {
      if (!(key in (next.trait_contexts[id] ?? {}))) delete merged[key]
    }
  }
  emit('update:modelValue', { traits: next.traits, context: merged })
}
function removeUnavailable(id: string) {
  const kept = selected.value.filter(value => value !== id)
  const accepted = new Set(kept.flatMap(id => Object.keys(traits.value.find(t => t.id === id)?.context_schema?.properties ?? {})))
  emit('update:modelValue', { traits: kept, context: Object.fromEntries(Object.entries(context.value).filter(([key]) => accepted.has(key))) })
}
function configure(event: Event) {
  if (event.target !== event.currentTarget) return
  const result = z.record(z.unknown()).safeParse((event as CustomEvent).detail)
  if (!result.success) return
  const next = { ...context.value }
  for (const key of Object.keys(schema.value.properties)) delete next[key]
  Object.assign(next, result.data)
  emit('update:modelValue', { traits: [...selected.value], context: next })
}
async function load() {
  ready.value = false; loadError.value = ''
  try {
    const [catalog] = await Promise.all([autocode.traits(), ...['wc-agent-trait-picker', 'wc-schema-form'].map(tag => customElements.get(tag) ? Promise.resolve() : loadByTagName(tag, { timeoutMs: 8000 }))])
    if (!active) return
    traits.value = catalog; ready.value = true
  } catch (e) { if (active) loadError.value = errorText(e, 'Could not load agent traits.') }
}
onMounted(load)
watch(() => [props.agent, props.modelValue] as const, async () => {
  const current = ++sequence
  previewError.value = ''; count.value = undefined; limit.value = undefined
  if (props.modelValue === undefined) { checking.value = false; return }
  checking.value = true
  try {
    const result = await autocode.toolSurface(props.agent, props.modelValue)
    if (!active || current !== sequence) return
    count.value = result.count; limit.value = result.limit
  } catch (e) {
    if (!active || current !== sequence) return
    previewError.value = e instanceof ApiError ? `${e.code ?? e.kind}: ${e.message}` : errorText(e, 'Could not resolve trait tools.')
    if (e instanceof ApiError && e.code === 'autocode.tool_limit_exceeded') {
      count.value = typeof e.details?.count === 'number' ? e.details.count : undefined
      limit.value = typeof e.details?.limit === 'number' ? e.details.limit : undefined
    }
  } finally { if (active && current === sequence) checking.value = false }
}, { deep: true, immediate: true, flush: 'sync' })
watch([checking, previewError, loadError, ready], () => emit('invalid', checking.value || !!previewError.value || (!!props.modelValue && (!ready.value || !!loadError.value))), { immediate: true, flush: 'sync' })
</script>
<template>
  <div class="ac-trait-tools" aria-label="Agent traits">
    <p class="ac-muted">Agent tools come from selected traits. Context applies to every selected trait that declares the field.</p>
    <p v-if="loadError" class="kx-err" role="alert">{{ loadError }} <button type="button" class="ac-btn kx-focus-halo" @click="load">Retry traits</button></p>
    <template v-if="ready">
      <wc-agent-trait-picker :value="pickerValue" :keep-menu-open-on-add="true" @change="change" />
      <p v-for="id in unavailable" :key="id" class="ac-muted">Unavailable trait: {{ id }}
        <button type="button" class="ac-link kx-focus-outline" :aria-label="`Remove unavailable trait ${id}`" @click="removeUnavailable(id)">Remove</button>
      </p>
      <template v-if="Object.keys(schema.properties).length">
        <p class="ac-muted">Trait context</p>
        <wc-schema-form :schema="JSON.stringify(schema)" :config="JSON.stringify(context)" @config-changed="configure" />
      </template>
    </template>
    <p v-else-if="!loadError" class="ac-muted" role="status">Loading agent traits…</p>
    <p v-if="count !== undefined" class="ac-muted" role="status">{{ count }} / {{ limit }} tools</p>
    <p v-else class="ac-muted" role="status">{{ checking ? 'Resolving trait tools…' : 'No trait tools selected.' }}</p>
    <p v-if="previewError" class="kx-err" role="alert">{{ previewError }}</p>
  </div>
</template>
