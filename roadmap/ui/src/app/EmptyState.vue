<script setup lang="ts">
// A roadmap with no layers has no lanes to draw into. The starter set is
// offered, never applied on its own: what a roadmap contains is always
// something someone asked for.
import { Icon } from '@iconify/vue'

defineProps<{ editable: boolean; starter: string[] }>()

const emit = defineEmits<{
  (e: 'add-layer'): void
  (e: 'add-starter'): void
}>()
</script>

<template>
  <div class="rm-empty">
    <Icon class="rm-empty-icon" icon="tabler:layout-rows" aria-hidden="true" />
    <h2>No layers yet</h2>
    <p>
      A roadmap is drawn in layers — the lanes of the timeline, the strata of the build order.
      Add the first one, or start from a set you can rename.
    </p>
    <div v-if="editable" class="rm-empty-actions">
      <button class="rm-btn rm-btn--primary" @click="emit('add-layer')">
        <Icon icon="tabler:plus" aria-hidden="true" />Add a layer
      </button>
      <button class="rm-btn" @click="emit('add-starter')">
        <Icon icon="tabler:stack-2" aria-hidden="true" />Add {{ starter.length }} starter layers
      </button>
    </div>
    <p v-if="editable" class="rm-empty-starter">{{ starter.join(' · ') }}</p>
    <p v-else class="rm-empty-starter">Open this roadmap in full mode to add one.</p>
  </div>
</template>
