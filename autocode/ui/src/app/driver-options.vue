<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DriverOption } from './api.ts'

// locked: options another setting fixes (unattended mode); shown, not editable.
const props = defineProps<{ options: DriverOption[]; modelValue: Record<string, unknown>; exclude?: string[]; locked?: Record<string, unknown> }>()
// invalid: the number of options whose visible input is not a valid value.
const emit = defineEmits<{ 'update:modelValue': [value: Record<string, unknown>]; invalid: [count: number] }>()

const filter = ref('')
const drafts = ref<Record<string, string>>({})
const invalid = ref<Record<string, string>>({})

const visible = computed(() => {
  const term = filter.value.trim().toLowerCase()
  return props.options.filter((o) => !(props.exclude ?? []).includes(o.name)
    && (!term || o.name.includes(term) || o.label.toLowerCase().includes(term) || o.description.toLowerCase().includes(term)))
})
const setCount = computed(() => Object.keys(props.modelValue).length)

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
  if (option.type === 'ids') return (value as string[]).join(', ')
  return String(value)
}

function markInvalid(name: string, message: string | undefined) {
  if (message) invalid.value[name] = message
  else delete invalid.value[name]
  emit('invalid', Object.keys(invalid.value).length)
}

function commit(option: DriverOption, raw: string) {
  drafts.value[option.name] = raw
  markInvalid(option.name, undefined)
  const trimmed = raw.trim()
  if (trimmed === '') { set(option.name, undefined); return }
  if (option.type === 'json') {
    try {
      set(option.name, JSON.parse(trimmed))
    } catch {
      set(option.name, undefined)
      markInvalid(option.name, 'Not valid JSON')
    }
    return
  }
  if (option.type === 'ids') { set(option.name, trimmed.split(',').map((s) => s.trim()).filter(Boolean)); return }
  set(option.name, trimmed)
}

function choose(option: DriverOption, raw: string) {
  if (raw === '') { set(option.name, undefined); return }
  if (option.type === 'boolean') { set(option.name, raw === 'true'); return }
  const match = (option.values ?? []).find((v) => String(v) === raw)
  set(option.name, match ?? raw)
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
    <input v-model="filter" class="ac-mono ac-options-filter kx-focus-halo" placeholder="Filter options" />
    <div v-for="o in visible" :key="o.name" class="ac-option">
      <div class="ac-option-head">
        <span class="ac-mono">{{ o.name }}</span>
        <small class="ac-muted">{{ o.label }}<template v-if="o.description && o.description !== o.label"> — {{ o.description }}</template></small>
      </div>
      <small v-if="locked && o.name in locked" class="ac-muted ac-mono">{{ JSON.stringify(locked[o.name]) }} · set by unattended mode</small>
      <select v-else-if="o.type === 'boolean'" class="kx-focus-halo" :value="selected(o)" @change="choose(o, ($event.target as HTMLSelectElement).value)">
        <option value="">{{ fallback(o) }}</option>
        <option value="true">on</option>
        <option value="false">off</option>
      </select>
      <select v-else-if="o.type === 'enum'" class="kx-focus-halo" :value="selected(o)" @change="choose(o, ($event.target as HTMLSelectElement).value)">
        <option value="">{{ fallback(o) }}</option>
        <option v-for="v in o.values ?? []" :key="String(v)" :value="String(v)">{{ v }}</option>
      </select>
      <textarea v-else-if="o.type === 'json'" rows="2" class="ac-mono kx-focus-halo" :value="text(o)" :placeholder="`JSON · ${fallback(o)}`"
        @change="commit(o, ($event.target as HTMLTextAreaElement).value)" />
      <input v-else class="ac-mono kx-focus-halo" :value="text(o)" :placeholder="o.type === 'ids' ? 'comma separated' : fallback(o)"
        @change="commit(o, ($event.target as HTMLInputElement).value)" />
      <small v-if="invalid[o.name]" class="ac-error">{{ invalid[o.name] }}</small>
    </div>
    <p v-if="!visible.length" class="ac-muted">No matching options.</p>
  </details>
</template>
