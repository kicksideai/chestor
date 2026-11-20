<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from 'primevue/button'
import { loadByTagName } from '@wippy-fe/proxy'
import { errorText } from './presentation.ts'

const props = defineProps<{ tag: string; providerId: string }>()
const emit = defineEmits<{ changed: [] }>()
const container = ref<HTMLElement | null>(null)
const attempt = ref(0)
const loading = ref(false)
const error = ref('')

watch([container, attempt], async ([mount], _, onCleanup) => {
  if (!mount) return
  let active = true
  const changed = (event: Event) => {
    if (event instanceof CustomEvent && event.detail?.success === false) {
      error.value = event.detail.error || 'Could not complete account setup.'
      return
    }
    error.value = ''
    emit('changed')
  }
  onCleanup(() => {
    active = false
    mount.replaceChildren()
  })
  loading.value = true
  error.value = ''
  try {
    await loadByTagName(props.tag, { timeoutMs: 8000 })
    if (!active) return
    const element = document.createElement(props.tag)
    element.setAttribute('provider-id', props.providerId)
    element.addEventListener('connection-saved', changed)
    element.addEventListener('oauth-result', changed)
    mount.replaceChildren(element)
  } catch (cause) {
    if (active) error.value = errorText(cause, 'Could not load the provider’s account editor.')
  } finally {
    if (active) loading.value = false
  }
})
</script>

<template>
  <p v-if="loading" class="kx-loading" role="status">Loading account editor…</p>
  <div v-if="error" class="kx-err" role="alert">{{ error }} <Button label="Retry" severity="secondary" text size="small" @click="attempt++" /></div>
  <div ref="container" />
</template>
