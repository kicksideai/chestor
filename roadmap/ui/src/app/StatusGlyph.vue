<script setup lang="ts">
// Status reads as a shape first: an open ring is planned, a dashed ring an
// idea, a half-filled ring work in flight, a solid ring shipped. Colour only
// repeats what the silhouette already says.
import type { Status } from './types'

defineProps<{ status: Status; color?: string; title?: string }>()
</script>

<template>
  <svg
    class="rm-st"
    :class="`rm-st--${status}`"
    viewBox="0 0 10 10"
    :style="{ '--rm-glyph': color || 'currentColor' }"
    role="img"
    :aria-label="title || status"
  >
    <title>{{ title || status }}</title>
    <circle cx="5" cy="5" r="4" />
    <path v-if="status === 'active'" d="M5 1a4 4 0 0 1 0 8z" />
    <path v-if="status === 'dropped'" d="M2.5 2.5 7.5 7.5" />
  </svg>
</template>
