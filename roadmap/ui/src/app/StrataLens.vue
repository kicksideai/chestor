<script setup lang="ts">
// Layers stacked as what the product stands on: the foundation at the bottom,
// what it pays for at the top. Every hard edge is drawn behind the pills;
// selecting one lights its whole chain, up and down.
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import StatusGlyph from './StatusGlyph.vue'
import { strataConnectors, type Band } from './strata'
import type { Trace } from './trace'
import type { Dependency, Rect } from './types'

const props = defineProps<{
  bands: Band[]
  edges: Dependency[]
  selectedId: string | null
  trace: Trace
  ranks?: Map<string, number>
}>()

const emit = defineEmits<{
  (e: 'select', kind: 'initiative', id: string): void
  (e: 'context', event: MouseEvent, kind: 'initiative', id: string): void
}>()

const rootEl = ref<HTMLElement | null>(null)
const rects = ref<Map<string, Rect>>(new Map())

function measureRects() {
  const container = rootEl.value
  if (!container) { rects.value = new Map(); return }
  const base = container.getBoundingClientRect()
  const next = new Map<string, Rect>()
  for (const el of Array.from(container.querySelectorAll<HTMLElement>('[data-initiative-id]'))) {
    const id = el.dataset.initiativeId || ''
    if (!id) continue
    const box = el.getBoundingClientRect()
    next.set(id, { id, x: box.left - base.left, y: box.top - base.top, width: box.width, height: box.height })
  }
  rects.value = next
}

const connectors = computed(() => strataConnectors(props.edges, rects.value, props.trace.chain))

let observer: ResizeObserver | null = null
watch(rootEl, el => {
  observer?.disconnect()
  observer = null
  if (!el || typeof ResizeObserver === 'undefined') return
  observer = new ResizeObserver(() => measureRects())
  observer.observe(el)
}, { immediate: true })

watch(() => props.bands, () => { void nextTick(measureRects) }, { immediate: true })

onBeforeUnmount(() => { observer?.disconnect(); observer = null })

function traceClass(id: string) {
  if (!props.trace.selected) return {}
  return {
    'is-sel': id === props.trace.selected,
    'is-need': props.trace.needs.has(id),
    'is-unlock': props.trace.unlocks.has(id),
    'is-dim': !props.trace.chain.has(id),
  }
}
</script>

<template>
  <div class="rm-strata" ref="rootEl">
    <svg class="rm-overlay" aria-hidden="true">
      <path v-for="connector in connectors" :key="connector.id" :d="connector.d" :class="[`rm-edge--${connector.kind}`, { 'is-hot': connector.hot }]" />
    </svg>

    <div v-for="band in bands" :key="band.layer.id" class="rm-stratum">
      <div class="rm-stratum-lab">
        <i class="rm-dot" :style="{ '--rm-dot-color': band.layer.color || 'var(--rm-accent)' }"></i>
        <div>
          {{ band.layer.title }}
          <small v-if="band.layer.description">{{ band.layer.description }}</small>
        </div>
      </div>
      <div class="rm-stratum-pills">
        <button
          v-for="item in band.initiatives"
          :key="item.id"
          class="rm-pill"
          :class="[`rm-pill--${item.status}`, traceClass(item.id), { 'rm-pill--low': item.confidence === 'low' }]"
          :style="{ '--rm-layer': band.layer.color || 'var(--rm-accent)' }"
          :data-initiative-id="item.id"
          :title="ranks && ranks.get(item.id) ? `${item.title} — blocks ${ranks.get(item.id)}` : item.title"
          @click="emit('select', 'initiative', item.id)"
          @contextmenu.prevent="emit('context', $event, 'initiative', item.id)"
        >
          <StatusGlyph :status="item.status" />
          <span>{{ item.title }}</span>
          <em v-if="ranks && ranks.get(item.id)" class="rm-pill-rank">{{ ranks.get(item.id) }}</em>
        </button>
        <span v-if="!band.initiatives.length" class="rm-stratum-empty">No work in this layer.</span>
      </div>
    </div>
  </div>
</template>
