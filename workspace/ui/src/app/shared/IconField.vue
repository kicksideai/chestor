<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { loadByTagName } from '@wippy-fe/proxy'

// Workspace-owned adapter for the public wc-icon-picker boundary. The picker itself
// remains owned and loaded by kickside/widgets; Chestor never imports that module's
// private Vue source or relies on a sibling repository checkout.
const props = defineProps<{ modelValue: string; fallback?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const host = ref<HTMLElement | null>(null)
const loading = ref(false)
const error = ref('')
let picker: HTMLElement | null = null
let mountGeneration = 0

function onSelect(event: Event) {
  emit('update:modelValue', String((event as CustomEvent).detail || ''))
}

async function mountPicker() {
  const generation = ++mountGeneration
  const mountPoint = host.value
  if (!mountPoint) return
  loading.value = true
  error.value = ''
  if (!customElements.get('wc-icon-picker')) {
    try {
      await loadByTagName('wc-icon-picker', { timeoutMs: 8000 })
    } catch {
      if (generation === mountGeneration) error.value = 'Icon picker is unavailable.'
      if (generation === mountGeneration) loading.value = false
      return
    }
  }
  if (generation !== mountGeneration || host.value !== mountPoint) return

  picker = document.createElement('wc-icon-picker')
  picker.setAttribute('value', props.modelValue || '')
  if (props.fallback) picker.setAttribute('fallback', props.fallback)
  picker.addEventListener('select', onSelect)
  mountPoint.replaceChildren(picker)
  loading.value = false
}

onMounted(() => { void mountPicker() })
watch(() => props.modelValue, value => {
  if (picker && picker.getAttribute('value') !== value) picker.setAttribute('value', value || '')
})
watch(() => props.fallback, value => {
  if (!picker) return
  if (value) picker.setAttribute('fallback', value)
  else picker.removeAttribute('fallback')
})
onBeforeUnmount(() => {
  mountGeneration += 1
  if (picker) picker.removeEventListener('select', onSelect)
  picker = null
})
</script>

<template>
  <div class="wc-iconfield">
    <div ref="host" />
    <span v-if="loading" role="status">Loading icon picker…</span>
    <span v-else-if="error" role="alert">
      {{ error }}
      <button type="button" @click="mountPicker">Retry</button>
    </span>
  </div>
</template>
