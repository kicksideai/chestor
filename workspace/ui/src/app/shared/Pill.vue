<script setup lang="ts">
// Vendored from the canonical models shared shell (platform/models/ui/src/app/shared/Pill.vue). Keep in sync; shell consolidation tracked separately.
import { Icon } from '@iconify/vue'

// Compact status / tag chip. tone drives the color; an optional dot or icon
// leads the label.
withDefaults(defineProps<{
  tone?: 'muted' | 'ok' | 'bad' | 'warn' | 'info' | 'accent'
  dot?: boolean
  icon?: string
}>(), { tone: 'muted' })
</script>

<template>
  <span class="km-pill" :class="`t-${tone}`">
    <span v-if="dot" class="km-pill-dot" aria-hidden="true" />
    <Icon v-else-if="icon" :icon="icon" aria-hidden="true" />
    <slot />
  </span>
</template>
