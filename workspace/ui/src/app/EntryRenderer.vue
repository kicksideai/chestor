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
// fill (default true): the normal-flow renderer fills the bounded manage or preview
// host. fill=false lets the host grow with the renderer's own content height.
// fill defaults to true (full-page manage/preview want a definite pixel height). A
// bare `fill?: boolean` would cast an absent prop to false (Vue boolean-prop rule),
// silently flowing manage views and collapsing a renderer with no intrinsic height
// (e.g. the schema canvas). withDefaults makes the documented default real.
const props = withDefaults(defineProps<{ tag: string; attrs: Record<string, string>; fill?: boolean }>(), { fill: true })

const host = ref<HTMLElement | null>(null)
const failed = ref(false)
let el: HTMLElement | null = null
let mountGeneration = 0

async function ensureRegistered(tag: string) {
  if (customElements.get(tag)) return
  await loadByTagName(tag, { timeoutMs: 8000 })
  if (!customElements.get(tag)) throw new Error('Content is unavailable.')
}

async function mount() {
  const generation = ++mountGeneration
  const mountHost = host.value
  const tag = props.tag
  const attrs = { ...props.attrs }
  const fill = props.fill
  failed.value = false
  el?.remove()
  el = null
  if (!mountHost) return
  mountHost.replaceChildren()
  try {
    await ensureRegistered(tag)
    if (generation !== mountGeneration || host.value !== mountHost) return
    const ctor = customElements.get(tag) as CustomElementConstructor & { preloadImplementation?: () => Promise<void> }
    void Promise.resolve().then(() => ctor.preloadImplementation?.()).catch(() => {
      // The attached element owns its loading feedback and public error event.
    })
    const next = mountHost.ownerDocument.createElement(tag)
    for (const [k, v] of Object.entries(attrs)) {
      if (v != null && v !== '') next.setAttribute(k, String(v))
    }
    next.style.display = 'block'
    next.style.width = '100%'
    if (fill === false) {
      // Flow: the renderer sizes to its own content; the host scrolls on overflow.
      next.style.minHeight = '0'
    } else {
      // The bounded preview host supplies the height. Its page stays in normal flow.
      next.style.height = '100%'
      next.style.minHeight = '0'
    }
    el = next
    mountHost.replaceChildren(next)
  } catch {
    if (generation === mountGeneration && host.value === mountHost) failed.value = true
  }
}

onMounted(mount)
watch(() => [props.tag, JSON.stringify(props.attrs), props.fill], mount)
onBeforeUnmount(() => { mountGeneration++; el?.remove(); el = null })
</script>

<template>
  <div class="ws-renderer-host" :class="{ 'ws-renderer-flow': fill === false }">
    <div v-if="failed" class="ws-renderer-fail"><Notice tone="error">Content is unavailable. <Button @click="mount">Retry</Button></Notice></div>
    <div v-show="!failed" ref="host" class="ws-renderer-mount"></div>
  </div>
</template>
