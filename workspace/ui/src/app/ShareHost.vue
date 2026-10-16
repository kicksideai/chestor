<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { loadByTagName } from '@wippy-fe/proxy'
import { Button, Notice } from './shared'

// Hosts the self-contained kickside-share popup. The share element renders its own
// backdrop + panel and drives dismissal via a `close` event, so it is mounted bare
// (no extra modal chrome — wrapping it caused a double popup) and its close/changed
// events are surfaced to the workspace. config is the JSON string the element reads.
const props = defineProps<{ config: string }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'changed', detail: unknown): void }>()

const host = ref<HTMLElement | null>(null)
let el: HTMLElement | null = null
const failed = ref(false)
function onClose() { emit('close') }
function onChanged(ev: Event) { emit('changed', (ev as CustomEvent).detail) }

async function mountShare() {
  failed.value = false
  if (!host.value) return
  try {
    await loadByTagName('kickside-share', { timeoutMs: 8000 })
    if (!customElements.get('kickside-share')) throw new Error('Sharing is unavailable.')
    el = document.createElement('kickside-share')
    if (props.config) el.setAttribute('config', props.config)
    el.addEventListener('close', onClose)
    el.addEventListener('changed', onChanged as EventListener)
    host.value.appendChild(el)
  } catch {
    failed.value = true
  }
}
onMounted(mountShare)
watch(() => props.config, (c) => { if (el && c) el.setAttribute('config', c) })
onBeforeUnmount(() => {
  if (el) {
    el.removeEventListener('close', onClose)
    el.removeEventListener('changed', onChanged as EventListener)
    el.remove()
    el = null
  }
})
</script>

<template>
  <div ref="host" class="ws-share-host"></div>
  <div v-if="failed" class="ws-modal" @keydown.esc.stop="onClose" @click.self="onClose">
    <section class="ws-dialog" role="dialog" aria-modal="true" aria-label="Sharing">
      <Notice tone="error" @dismiss="onClose">Sharing is unavailable.</Notice>
      <div class="ws-dialog-foot">
        <Button aria-label="Retry sharing" @click="mountShare">Retry</Button>
        <Button variant="ghost" @click="onClose">Close</Button>
      </div>
    </section>
  </div>
</template>
