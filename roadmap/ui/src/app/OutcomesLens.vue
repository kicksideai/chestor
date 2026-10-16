<script setup lang="ts">
// Outcome cards with weighted progress and the bets filed under them. A bet
// that serves no outcome gets its own card rather than disappearing.
import ConfidenceMeter from './ConfidenceMeter.vue'
import StatusGlyph from './StatusGlyph.vue'
import { percent, type OutcomeCard } from './outcomes'
import { periodLabel } from './periods'
import type { Trace } from './trace'
import type { Layer, PeriodKind } from './types'

const props = defineProps<{
  cards: OutcomeCard[]
  layers: Layer[]
  periodKind: PeriodKind
  selectedId: string | null
  trace: Trace
}>()

const emit = defineEmits<{
  (e: 'select', kind: 'initiative' | 'outcome', id: string): void
  (e: 'context', event: MouseEvent, kind: 'initiative' | 'outcome', id: string): void
}>()

function layerOf(layerId: string): Layer | undefined {
  return props.layers.find(l => l.id === layerId)
}

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
  <div class="rm-oc">
    <section v-for="card in cards" :key="card.outcome?.id || 'unfiled'" class="rm-obj">
      <header
        class="rm-obj-head"
        :class="{ 'is-clickable': !!card.outcome }"
        :role="card.outcome ? 'button' : undefined"
        :tabindex="card.outcome ? 0 : undefined"
        @click="card.outcome && emit('select', 'outcome', card.outcome.id)"
        @keydown.enter.prevent="card.outcome && emit('select', 'outcome', card.outcome.id)"
        @contextmenu.prevent="card.outcome && emit('context', $event, 'outcome', card.outcome.id)"
      >
        <h3>{{ card.outcome ? card.outcome.title : 'Unfiled bets' }}</h3>
        <p class="rm-obj-why">{{ card.outcome ? card.outcome.description : 'Work that serves no stated outcome.' }}</p>
      </header>

      <div class="rm-meter">
        <span class="rm-meter-track"><span class="rm-meter-fill" :style="{ width: `${percent(card.progress)}%` }"></span></span>
        <span class="rm-meter-value">{{ percent(card.progress) }}%</span>
      </div>

      <ul class="rm-bets">
        <li
          v-for="item in card.initiatives"
          :key="item.id"
          class="rm-bet"
          :class="traceClass(item.id)"
          :style="{ '--rm-layer': layerOf(item.layer_id)?.color || 'var(--rm-accent)' }"
          role="button"
          tabindex="0"
          @click="emit('select', 'initiative', item.id)"
          @keydown.enter.prevent="emit('select', 'initiative', item.id)"
          @contextmenu.prevent="emit('context', $event, 'initiative', item.id)"
        >
          <StatusGlyph :status="item.status" :color="layerOf(item.layer_id)?.color" />
          <span class="rm-bet-line">
            <i class="rm-dot" :style="{ '--rm-dot-color': layerOf(item.layer_id)?.color || 'var(--rm-accent)' }"></i>
            <span class="rm-bet-title">{{ item.title }}</span>
            <ConfidenceMeter :confidence="item.confidence" />
          </span>
          <span class="rm-bet-period">{{ item.start_period ? periodLabel(item.start_period, periodKind) : '—' }}</span>
        </li>
        <li v-if="!card.initiatives.length" class="rm-bet rm-bet--empty">No bets filed here yet.</li>
      </ul>
    </section>
  </div>
</template>
