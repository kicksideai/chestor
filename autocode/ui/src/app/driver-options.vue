<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, watch, useId } from 'vue'
import Ajv, { type ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'
import { batchOptions } from './defaults.ts'
import type { DriverOption } from './api.ts'

const props = defineProps<{ options: DriverOption[]; modelValue: Record<string, unknown>; locked?: Record<string, unknown> }>()
const emit = defineEmits<{ 'update:modelValue': [value: Record<string, unknown>]; invalid: [count: number] }>()
const filter = ref('')
const drafts = ref<Record<string, string>>({})
const invalid = ref<Record<string, string>>({})
const prefix = useId()
const ajv = new Ajv({ strict: false, allErrors: true })
addFormats(ajv)
const validators = computed(() => new Map<string, ValidateFunction<unknown> | string | undefined>(props.options.map(option => {
  try { return [option.name, option.schema ? ajv.compile(option.schema) : undefined] as const }
  catch { return [option.name, 'Invalid option schema'] as const }
})))

const visible = computed(() => {
  const term = filter.value.trim().toLowerCase()
  return batchOptions(props.options).filter(o => !term || [o.name, o.label, o.description, o.section, o.group].join(' ').toLowerCase().includes(term))
    .sort((a, b) => a.section.localeCompare(b.section) || a.group.localeCompare(b.group) || a.order - b.order || a.name.localeCompare(b.name))
})
const setCount = computed(() => Object.keys(props.modelValue).length)

// Snapshots distinguish authoritative changes from edits to another option.
watch(() => Object.fromEntries(props.options.map(o => [o.name, JSON.stringify([props.modelValue[o.name], props.locked?.[o.name], o])])), (next, previous) => {
  for (const name of Object.keys(drafts.value)) {
    if (next[name] !== previous?.[name] || (props.locked && name in props.locked) || !(name in next)) {
      delete drafts.value[name]
      delete invalid.value[name]
    }
  }
  emit('invalid', Object.keys(invalid.value).length)
}, { immediate: true })

function set(name: string, value: unknown) {
  const next = { ...props.modelValue }
  if (value === undefined) delete next[name]
  else next[name] = value
  emit('update:modelValue', next)
}
function text(option: DriverOption): string {
  if (option.name in drafts.value) return drafts.value[option.name]
  const value = props.modelValue[option.name]
  if (value === undefined) return ''
  if (option.type === 'json') return JSON.stringify(value)
  if (option.type === 'ids' && Array.isArray(value) && value.every((v: unknown) => typeof v === 'string')) return value.join(', ')
  return String(value)
}
function markInvalid(name: string, message?: string) {
  if (message) invalid.value[name] = message
  else delete invalid.value[name]
  emit('invalid', Object.keys(invalid.value).length)
}
function accept(option: DriverOption, value: unknown) {
  const validate = validators.value.get(option.name)
  if (value !== undefined && validate) {
    if (typeof validate === 'string') { markInvalid(option.name, validate); return }
    if (!validate(value)) { markInvalid(option.name, ajv.errorsText(validate.errors)); return }
  }
  markInvalid(option.name)
  set(option.name, value)
}
function commit(option: DriverOption, raw: string) {
  drafts.value[option.name] = raw
  const trimmed = raw.trim()
  if (!trimmed) { accept(option, undefined); return }
  if (option.type === 'json') {
    let value: unknown
    try { value = JSON.parse(trimmed) }
    catch { markInvalid(option.name, 'Not valid JSON'); return }
    accept(option, value)
  } else if (option.type === 'ids') accept(option, trimmed.split(',').map(s => s.trim()).filter(Boolean))
  else if ([option.type, option.schema?.type].some(type => type === 'number' || type === 'integer')) {
    const value = Number(trimmed)
    if (!Number.isFinite(value)) { markInvalid(option.name, 'Not a finite number'); return }
    if ((option.type === 'integer' || option.schema?.type === 'integer') && !Number.isInteger(value)) { markInvalid(option.name, 'Not an integer'); return }
    accept(option, value)
  } else accept(option, trimmed)
}
function choose(option: DriverOption, event: Event) {
  if (!(event.target instanceof HTMLSelectElement)) return
  const raw = event.target.value
  if (!raw) { accept(option, undefined); return }
  accept(option, option.type === 'boolean' ? raw === 'true' : (option.values ?? []).find(v => String(v) === raw) ?? raw)
}
function input(option: DriverOption, event: Event) {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) commit(option, event.target.value)
}
function selected(option: DriverOption): string {
  const value = props.modelValue[option.name]
  return value === undefined ? '' : String(value)
}
function fallback(option: DriverOption): string {
  return option.default === undefined || option.default === null ? 'CLI default' : `default: ${JSON.stringify(option.default)}`
}
</script>

<template>
  <details class="ac-options">
    <summary class="kx-focus-outline">Driver options<span v-if="setCount" class="ac-muted"> · {{ setCount }} set</span></summary>
    <input v-model="filter" class="ac-mono ac-options-filter kx-focus-halo" placeholder="Filter options" aria-label="Filter driver options" />
    <div v-for="(o, index) in visible" :key="o.name" class="ac-option">
      <div v-if="index === 0 || o.section !== visible[index - 1].section || o.group !== visible[index - 1].group" class="ac-muted">{{ [o.section, o.group].filter(Boolean).join(' · ') }}</div>
      <div class="ac-option-head">
        <span class="ac-mono">{{ o.name }}</span>
        <small class="ac-muted">{{ o.label }}<template v-if="o.description && o.description !== o.label"> — {{ o.description }}</template></small>
      </div>
      <small v-if="locked && o.name in locked" class="ac-muted ac-mono">{{ JSON.stringify(locked[o.name]) }} · set by unattended mode</small>
      <select v-else-if="o.type === 'boolean' || o.type === 'enum'" class="kx-focus-halo" :aria-label="o.label || o.name" :aria-invalid="!!invalid[o.name]" :aria-describedby="invalid[o.name] ? `${prefix}-${o.name}-error` : undefined" :value="selected(o)" @change="choose(o, $event)">
        <option value="">{{ fallback(o) }}</option>
        <template v-if="o.type === 'boolean'"><option value="true">on</option><option value="false">off</option></template>
        <template v-else><option v-for="v in o.values ?? []" :key="String(v)" :value="String(v)">{{ v }}</option></template>
      </select>
      <textarea v-else-if="o.type === 'json'" rows="2" class="ac-mono kx-focus-halo" :aria-label="o.label || o.name" :aria-invalid="!!invalid[o.name]" :aria-describedby="invalid[o.name] ? `${prefix}-${o.name}-error` : undefined" :value="text(o)" :placeholder="`JSON · ${fallback(o)}`" @input="input(o, $event)" />
      <input v-else class="ac-mono kx-focus-halo" :aria-label="o.label || o.name" :aria-invalid="!!invalid[o.name]" :aria-describedby="invalid[o.name] ? `${prefix}-${o.name}-error` : undefined" :value="text(o)" :placeholder="o.type === 'ids' ? 'comma separated' : fallback(o)" @input="input(o, $event)" />
      <small v-if="invalid[o.name]" :id="`${prefix}-${o.name}-error`" class="kx-err" role="alert">{{ invalid[o.name] }}</small>
    </div>
    <p v-if="!visible.length" class="ac-muted">No matching options.</p>
  </details>
</template>
