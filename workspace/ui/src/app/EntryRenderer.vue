<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { loadByTagName } from '@wippy-fe/proxy'
import { Button, Notice } from './shared'

// Mounts an entry type's declared renderer web component by tag. The host loads
// the tag's bundle via loadByTagName (kickside's in-process equivalent of an
// iframe artifact host); the element receives the entry id as `entry-id`. The
// shell owns the chrome -- this only hosts the type's own content surface.
// attrs are the type-specific element attributes (e.g. source-url/content-type
// for wc-resource-view, entry-id for a typed renderer). The shell derives them
// from the entry, so EntryRenderer stays renderer-agnostic.
// fill (default true): absolute-inset the renderer to a definite pixel height (full-page
// manage views). fill=false lets it flow to its own content height (a create popup that
// grows to fit its form; the host scrolls on overflow).
// fill defaults to true (full-page manage/preview want a definite pixel height). A
// bare `fill?: boolean` would cast an absent prop to false (Vue boolean-prop rule),
// silently flowing manage views and collapsing a renderer with no intrinsic height
// (e.g. the schema canvas). withDefaults makes the documented default real.
const props = withDefaults(defineProps<{ tag: string; attrs: Record<string, string>; fill?: boolean }>(), { fill: true })

const host = ref<HTMLElement | null>(null)
const failed = ref(false)
let el: HTMLElement | null = null

async function ensureRegistered(tag: string) {
  if (customElements.get(tag)) return
  await loadByTagName(tag, { timeoutMs: 8000 })
  if (!customElements.get(tag)) throw new Error('Content is unavailable.')
}

async function mount() {
  failed.value = false
  if (!host.value) return
  host.value.innerHTML = ''
  el = null
  try {
    await ensureRegistered(props.tag)
    el = document.createElement(props.tag)
    for (const [k, v] of Object.entries(props.attrs || {})) {
      if (v != null && v !== '') el.setAttribute(k, String(v))
    }
    if (props.fill === false) {
      // Flow: the renderer sizes to its own content; the host scrolls on overflow.
      el.style.display = 'block'
      el.style.width = '100%'
    } else {
      // Fill: absolute insets give the renderer a definite pixel height; height:100%
      // would collapse a renderer whose own :host/.de chain is percentage-based.
      el.style.position = 'absolute'
      el.style.inset = '0'
    }
    host.value.appendChild(el)
    failed.value = !customElements.get(props.tag)
  } catch {
    failed.value = true
  }
}

onMounted(mount)
watch(() => [props.tag, JSON.stringify(props.attrs)], mount)
onBeforeUnmount(() => { el = null })
</script>

<template>
  <div class="ws-renderer-host" :class="{ 'ws-renderer-flow': fill === false }">
    <div v-if="failed" class="ws-renderer-fail"><Notice tone="error">Content is unavailable. <Button @click="mount">Retry</Button></Notice></div>
    <div v-show="!failed" ref="host" class="ws-renderer-mount"></div>
  </div>
</template>
