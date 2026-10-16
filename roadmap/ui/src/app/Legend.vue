<script setup lang="ts">
// The reading key for every lens: which lane a colour belongs to, and what a
// glyph says about a bet. Layer colours are decorative labels for a domain
// vocabulary, never a severity.
import StatusGlyph from './StatusGlyph.vue'
import { STATUSES, type Layer } from './types'

defineProps<{ layers: Layer[] }>()

const STATUS_COPY: Record<string, string> = {
  idea: 'Idea — not a promise',
  planned: 'Planned',
  active: 'In progress',
  done: 'Shipped',
  dropped: 'Dropped',
}
</script>

<template>
  <div class="rm-legend">
    <section v-if="layers.length">
      <h4>Layers</h4>
      <div v-for="layer in layers" :key="layer.id" class="rm-legend-row">
        <i class="rm-dot" :style="{ '--rm-dot-color': layer.color || 'var(--rm-accent)' }"></i>
        <span>{{ layer.title }}</span>
      </div>
    </section>

    <section>
      <h4>Status</h4>
      <div v-for="status in STATUSES" :key="status" class="rm-legend-row">
        <StatusGlyph :status="status" />
        <span>{{ STATUS_COPY[status] }}</span>
      </div>
      <div class="rm-legend-row">
        <i class="rm-swatch rm-swatch--low"></i>
        <span>Low confidence</span>
      </div>
    </section>

    <p class="rm-legend-hint">Select an initiative to trace what it needs and what it unlocks across every lens.</p>
  </div>
</template>
