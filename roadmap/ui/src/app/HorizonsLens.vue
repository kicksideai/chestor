<script setup lang="ts">
// Now / Next / Later, grouped by layer inside each column. Horizon is derived
// from the schedule, so a card dragged between columns does not move: it opens
// the schedule editor with the period that would put it there.
import ConfidenceMeter from './ConfidenceMeter.vue'
import StatusGlyph from './StatusGlyph.vue'
import { periodLabel } from './periods'
import type { HorizonColumn } from './horizons'
import type { Trace } from './trace'
import type { Horizon, Initiative, Layer, PeriodKind } from './types'

const props = defineProps<{
  columns: HorizonColumn[]
  periodKind: PeriodKind
  selectedId: string | null
  trace: Trace
  editable: boolean
}>()

const emit = defineEmits<{
  (e: 'select', kind: 'initiative', id: string): void
  (e: 'schedule', id: string, horizon: Horizon): void
  (e: 'context', event: MouseEvent, kind: 'initiative', id: string): void
}>()

function traceClass(id: string) {
  if (!props.trace.selected) return {}
  return {
    'is-sel': id === props.trace.selected,
    'is-need': props.trace.needs.has(id),
    'is-unlock': props.trace.unlocks.has(id),
    'is-dim': !props.trace.chain.has(id),
  }
}

function onDragStart(event: DragEvent, initiative: Initiative) {
  if (!props.editable) return
  event.dataTransfer?.setData('text/plain', initiative.id)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function onDrop(event: DragEvent, horizon: Horizon) {
  if (!props.editable) return
  const id = event.dataTransfer?.getData('text/plain') || ''
  if (id) emit('schedule', id, horizon)
}

function cardStyle(layer: Layer) {
  return { '--rm-layer': layer.color || 'var(--rm-accent)' }
}
</script>

<template>
  <div class="rm-hz">
    <section
      v-for="column in columns"
      :key="column.horizon"
      class="rm-hz-col"
      :class="{ 'is-droppable': editable }"
      @dragover.prevent
      @drop.prevent="onDrop($event, column.horizon)"
    >
      <header class="rm-hz-head">
        <b>{{ column.title }}</b>
        <span>{{ column.hint }}</span>
        <em>{{ column.count }}</em>
      </header>

      <template v-for="group in column.groups" :key="group.layer.id">
        <div class="rm-hz-group">{{ group.layer.title }}</div>
        <article
          v-for="item in group.initiatives"
          :key="item.id"
          class="rm-card"
          :class="[traceClass(item.id), { 'rm-card--low': item.confidence === 'low' }]"
          :style="cardStyle(group.layer)"
          role="button"
          tabindex="0"
          :draggable="editable"
          @dragstart="onDragStart($event, item)"
          @click="emit('select', 'initiative', item.id)"
          @keydown.enter.prevent="emit('select', 'initiative', item.id)"
          @keydown.space.prevent="emit('select', 'initiative', item.id)"
          @contextmenu.prevent="emit('context', $event, 'initiative', item.id)"
        >
          <div class="rm-card-title">
            <StatusGlyph :status="item.status" :color="group.layer.color" />
            <span>{{ item.title }}</span>
          </div>
          <div class="rm-card-meta">
            <span class="rm-lchip"><i class="rm-dot" :style="{ '--rm-dot-color': group.layer.color || 'var(--rm-accent)' }"></i>{{ group.layer.title }}</span>
            <span class="rm-size">{{ item.size }}</span>
            <ConfidenceMeter :confidence="item.confidence" />
            <span v-if="item.start_period" class="rm-card-period">{{ periodLabel(item.start_period, periodKind) }}</span>
          </div>
        </article>
      </template>

      <p v-if="!column.groups.length" class="rm-hz-empty">Nothing here.</p>
    </section>
  </div>
</template>
