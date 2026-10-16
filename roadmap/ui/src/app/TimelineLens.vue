<script setup lang="ts">
// Layers as lanes, periods as columns. A bar carries status, size and
// confidence; the rail above carries milestones; the selection draws its own
// dependency arrows over the grid.
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import StatusGlyph from './StatusGlyph.vue'
import { formatPeriod, periodIndex } from './periods'
import { laneAt, resolveDrag, timelineConnectors, type LaneBand, type TimelineBar, type TimelineModel } from './timeline'
import type { Trace } from './trace'
import type { Rect, RoadmapState } from './types'

const props = defineProps<{
  state: RoadmapState
  model: TimelineModel
  selectedId: string | null
  trace: Trace
  editable: boolean
  compact?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', kind: 'initiative' | 'milestone', id: string): void
  (e: 'place', id: string, place: { startPeriod?: string; span?: number; layerId?: string }): void
  (e: 'context', event: MouseEvent, kind: 'initiative' | 'milestone', id: string): void
}>()

const gridEl = ref<HTMLElement | null>(null)
const laneEls = new Map<string, HTMLElement>()
const rects = ref<Map<string, Rect>>(new Map())

const kind = computed(() => props.state.settings.period_kind)
const originIndex = computed(() => periodIndex(props.state.settings.origin, kind.value) ?? 0)
const columnCount = computed(() => Math.max(1, props.model.columns.length))
const gridStyle = computed(() => ({ '--rm-cols': String(columnCount.value) }))

interface Drag {
  id: string
  mode: 'move' | 'resize'
  pointerId: number
  originX: number
  originY: number
  dx: number
  dy: number
  startIndex: number
  span: number
  layerId: string
  targetLayerId: string
  columnWidth: number
  bands: LaneBand[]
  moved: boolean
}

const drag = ref<Drag | null>(null)
// A drag ends on the same element a click would; the pointer must not both
// move a bar and toggle its selection.
let clickGuardUntil = 0

function selectBar(id: string) {
  if (Date.now() < clickGuardUntil) return
  emit('select', 'initiative', id)
}

// ── Measurement ──
function setLaneEl(layerId: string, el: Element | null) {
  if (el instanceof HTMLElement) laneEls.set(layerId, el)
  else laneEls.delete(layerId)
}

function measureRects() {
  const container = gridEl.value
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

const connectors = computed(() => timelineConnectors(props.state.dependencies, rects.value, props.selectedId, props.trace.chain))

let observer: ResizeObserver | null = null
watch(gridEl, el => {
  observer?.disconnect()
  observer = null
  if (!el || typeof ResizeObserver === 'undefined') return
  observer = new ResizeObserver(() => measureRects())
  observer.observe(el)
}, { immediate: true })

watch([() => props.model, () => props.selectedId], () => { void nextTick(measureRects) }, { immediate: true, deep: false })

onBeforeUnmount(() => { observer?.disconnect(); observer = null; stopDrag(false) })

// ── Bar geometry ──
function barStyle(bar: TimelineBar) {
  const active = drag.value
  const layer = props.state.layers.find(l => l.id === bar.initiative.layer_id)
  const style: Record<string, string> = {
    '--rm-layer': layer?.color || 'var(--rm-accent)',
    '--rm-progress': `${Math.round((bar.initiative.progress || 0) * 100)}%`,
    gridColumn: `${bar.colStart} / span ${bar.span}`,
  }
  if (!active || active.id !== bar.initiative.id) return style
  if (active.mode === 'resize') {
    const resolved = resolveDrag(dragInput(active))
    style.gridColumn = `${bar.colStart} / span ${Math.max(1, Math.min(columnCount.value - bar.colStart + 1, resolved.span))}`
    return style
  }
  const resolved = resolveDrag(dragInput(active))
  const snapped = (resolved.startIndex - active.startIndex) * active.columnWidth
  style.transform = `translate(${snapped}px, ${active.dy}px)`
  return style
}

function dragInput(active: Drag) {
  return {
    mode: active.mode,
    startIndex: active.startIndex,
    span: active.span,
    dx: active.dx,
    columnWidth: active.columnWidth,
    windowStart: originIndex.value,
    windowEnd: originIndex.value + columnCount.value - 1,
  }
}

// ── Dragging ──
function laneBands(): LaneBand[] {
  const container = gridEl.value
  if (!container) return []
  const base = container.getBoundingClientRect()
  const bands: LaneBand[] = []
  for (const layer of props.state.layers) {
    const el = laneEls.get(layer.id)
    if (!el) continue
    const box = el.getBoundingClientRect()
    bands.push({ layerId: layer.id, top: box.top - base.top, bottom: box.bottom - base.top })
  }
  return bands
}

function columnWidth(): number {
  const lane = props.state.layers.map(l => laneEls.get(l.id)).find(Boolean)
  const track = lane?.querySelector<HTMLElement>('.rm-tl-rows')
  if (!track) return 0
  return track.clientWidth / columnCount.value
}

function startDrag(event: PointerEvent, bar: TimelineBar, mode: 'move' | 'resize') {
  if (!props.editable || event.button !== 0) return
  const start = periodIndex(bar.initiative.start_period, kind.value)
  if (start === null) return
  event.preventDefault()
  event.stopPropagation()
  drag.value = {
    id: bar.initiative.id,
    mode,
    pointerId: event.pointerId,
    originX: event.clientX,
    originY: event.clientY,
    dx: 0,
    dy: 0,
    startIndex: start,
    span: Math.max(1, Math.round(bar.initiative.span) || 1),
    layerId: bar.initiative.layer_id,
    targetLayerId: bar.initiative.layer_id,
    columnWidth: columnWidth(),
    bands: laneBands(),
    moved: false,
  }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('keydown', onDragKey, true)
}

function onPointerMove(event: PointerEvent) {
  const active = drag.value
  if (!active || event.pointerId !== active.pointerId) return
  active.dx = event.clientX - active.originX
  active.dy = active.mode === 'move' ? event.clientY - active.originY : 0
  if (Math.abs(active.dx) > 3 || Math.abs(active.dy) > 3) active.moved = true
  if (active.mode === 'move') {
    const container = gridEl.value
    const y = container ? event.clientY - container.getBoundingClientRect().top : 0
    active.targetLayerId = laneAt(active.bands, y) || active.layerId
  }
  drag.value = { ...active }
}

function onPointerUp(event: PointerEvent) {
  const active = drag.value
  if (!active || event.pointerId !== active.pointerId) return
  stopDrag(active.moved)
}

function onDragKey(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !drag.value) return
  event.preventDefault()
  event.stopPropagation()
  stopDrag(false)
}

function stopDrag(commit: boolean) {
  const active = drag.value
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('keydown', onDragKey, true)
  drag.value = null
  if (!active || !commit) return
  clickGuardUntil = Date.now() + 300

  const resolved = resolveDrag(dragInput(active))
  const place: { startPeriod?: string; span?: number; layerId?: string } = {}
  if (active.mode === 'resize') {
    if (resolved.span !== active.span) place.span = resolved.span
  } else {
    if (resolved.startIndex !== active.startIndex) place.startPeriod = formatPeriod(resolved.startIndex, kind.value)
    if (active.targetLayerId !== active.layerId) place.layerId = active.targetLayerId
  }
  if (Object.keys(place).length) emit('place', active.id, place)
}

// ── Presentation ──
function traceClass(id: string) {
  if (!props.trace.selected) return {}
  return {
    'is-sel': id === props.trace.selected,
    'is-need': props.trace.needs.has(id),
    'is-unlock': props.trace.unlocks.has(id),
    'is-dim': !props.trace.chain.has(id),
  }
}

function layerColor(layerId: string): string {
  return props.state.layers.find(l => l.id === layerId)?.color || 'var(--rm-accent)'
}
</script>

<template>
  <div class="rm-tl" :class="{ 'rm-tl--compact': compact, 'rm-tl--dragging': !!drag }" :style="gridStyle" ref="gridEl">
    <div class="rm-tl-head">
      <div class="rm-tl-head-lab">Layer</div>
      <div v-for="column in model.columns" :key="column.key" :class="{ 'is-current': column.current }">{{ column.label }}</div>
    </div>

    <div class="rm-tl-ms" :style="{ '--rm-ms-rows': String(model.milestoneRows) }">
      <div class="rm-tl-head-lab">Milestones</div>
      <button
        v-for="mark in model.milestones"
        :key="mark.milestone.id"
        class="rm-ms"
        :style="{ left: `calc(var(--rm-label) + (100% - var(--rm-label)) * ${mark.left})`, '--rm-ms-row': String(mark.row) }"
        :title="mark.milestone.title"
        :aria-label="`Milestone ${mark.milestone.title}`"
        @click="emit('select', 'milestone', mark.milestone.id)"
        @contextmenu.prevent="emit('context', $event, 'milestone', mark.milestone.id)"
      ><i></i>{{ mark.milestone.title }}</button>
    </div>

    <div
      v-for="lane in model.lanes"
      :key="lane.layer.id"
      class="rm-tl-lane"
      :class="{ 'is-drop': drag?.mode === 'move' && drag?.targetLayerId === lane.layer.id }"
      :ref="el => setLaneEl(lane.layer.id, el as Element | null)"
    >
      <div class="rm-tl-lab">
        <i class="rm-dot" :style="{ '--rm-dot-color': lane.layer.color || 'var(--rm-accent)' }"></i>
        <div>
          {{ lane.layer.title }}
          <small v-if="lane.layer.description">{{ lane.layer.description }}</small>
        </div>
      </div>
      <div class="rm-tl-rows">
        <div v-for="(row, index) in lane.rows" :key="index" class="rm-tl-row">
          <div
            v-for="bar in row"
            :key="bar.initiative.id"
            class="rm-bar"
            :class="[
              `rm-bar--${bar.initiative.status}`,
              traceClass(bar.initiative.id),
              {
                'rm-bar--low': bar.initiative.confidence === 'low',
                'rm-bar--clip-start': bar.clippedStart,
                'rm-bar--clip-end': bar.clippedEnd,
                'is-dragging': drag?.id === bar.initiative.id,
              },
            ]"
            :style="barStyle(bar)"
            :data-initiative-id="bar.initiative.id"
            role="button"
            tabindex="0"
            :title="bar.initiative.title"
            @pointerdown="startDrag($event, bar, 'move')"
            @click="selectBar(bar.initiative.id)"
            @keydown.enter.prevent="selectBar(bar.initiative.id)"
            @keydown.space.prevent="selectBar(bar.initiative.id)"
            @contextmenu.prevent="emit('context', $event, 'initiative', bar.initiative.id)"
          >
            <StatusGlyph :status="bar.initiative.status" :title="bar.initiative.status" />
            <span class="rm-bar-title">{{ bar.initiative.title }}</span>
            <span class="rm-bar-size">{{ bar.initiative.size }}</span>
            <span
              v-if="editable"
              class="rm-bar-grip"
              role="separator"
              :aria-label="`Resize ${bar.initiative.title}`"
              @pointerdown.stop="startDrag($event, bar, 'resize')"
            ></span>
          </div>
        </div>
        <div v-if="!lane.rows.length" class="rm-tl-row rm-tl-row--empty"></div>
      </div>
      <div v-if="lane.unscheduled.length || lane.offscreen.length" class="rm-tl-aside">
        <button
          v-for="item in lane.unscheduled"
          :key="item.id"
          class="rm-chip rm-chip--idea"
          :class="traceClass(item.id)"
          :style="{ '--rm-layer': layerColor(item.layer_id) }"
          :title="`${item.title} — no start period`"
          @click="emit('select', 'initiative', item.id)"
          @contextmenu.prevent="emit('context', $event, 'initiative', item.id)"
        ><StatusGlyph :status="item.status" />{{ item.title }}</button>
        <button
          v-for="item in lane.offscreen"
          :key="item.id"
          class="rm-chip rm-chip--offscreen"
          :class="traceClass(item.id)"
          :style="{ '--rm-layer': layerColor(item.layer_id) }"
          :title="`${item.title} — ${item.start_period}, outside the visible window`"
          @click="emit('select', 'initiative', item.id)"
        >{{ item.title }}</button>
      </div>
    </div>

    <div v-if="model.todayPosition !== null" class="rm-today" :style="{ '--rm-today-pos': String(model.todayPosition) }"></div>

    <svg class="rm-overlay" aria-hidden="true">
      <path v-for="connector in connectors" :key="connector.id" :d="connector.d" :class="[`rm-edge--${connector.kind}`, { 'is-hot': connector.hot }]" />
    </svg>
  </div>
</template>
