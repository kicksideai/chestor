<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

defineProps<{
  data: { label: string; color: string; width: number; height: number }
  selected?: boolean
}>()
</script>

<template>
  <div class="g-boundary" :class="{ 'g-boundary--selected': selected }" :style="{ '--node-color': data.color }">
    <Handle id="top" type="target" :position="Position.Top" class="g-port" />
    <Handle id="left" type="target" :position="Position.Left" class="g-port" />
    <Handle id="bottom" type="source" :position="Position.Bottom" class="g-port" />
    <Handle id="right" type="source" :position="Position.Right" class="g-port" />
    <div class="g-boundary-title">{{ data.label }}</div>
  </div>
</template>
