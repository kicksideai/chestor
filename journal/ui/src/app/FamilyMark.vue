<script setup lang="ts">
import { computed } from 'vue'
import { familyMark, markIsHollow } from './force-layout'
import type { NodeFamily } from './types'

/**
 * The journal's semantic glyph is a data mark, not an application icon. One
 * renderer keeps its shape vocabulary identical in the outline, recall,
 * timeline, inspector, and graph legend while ordinary controls use Iconify.
 */
const props = withDefaults(defineProps<{
  family: NodeFamily
  radius?: number
  viewBox?: string
  hollow?: boolean
}>(), {
  radius: 7,
  viewBox: '-12 -12 24 24',
})

const path = computed(() => familyMark(props.family, props.radius))
const isHollow = computed(() => props.hollow ?? markIsHollow(props.family))
</script>

<template>
  <svg :viewBox="viewBox" aria-hidden="true">
    <path :d="path" :class="{ hollow: isHollow }" />
  </svg>
</template>
