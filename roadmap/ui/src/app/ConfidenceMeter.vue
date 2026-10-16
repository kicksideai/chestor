<script setup lang="ts">
// Three rising bars; how many are filled is the confidence. The meter is
// muted on purpose — confidence qualifies a bet, it does not rank it.
import type { Confidence } from './types'

defineProps<{ confidence: Confidence }>()
</script>

<template>
  <span class="rm-conf" :class="`rm-conf--${confidence}`" :title="`confidence: ${confidence}`" :aria-label="`confidence ${confidence}`">
    <i></i><i></i><i></i>
  </span>
</template>
