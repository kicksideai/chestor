<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { HandleDef } from './graph-sync'

// Reference chip for an endpoint outside the current view. It is a signpost,
// not a node: no panel, no editing, no layout of its own. Its single
// interaction — click to jump — is handled by the canvas, which recognizes
// data.portalTarget. Handles exist only so cross-boundary edges can anchor.
defineProps<{
  id: string
  data: {
    label: string
    color: string
    portalTarget: string
    contextLabel?: string
    handles: HandleDef[]
  }
}>()

const sideMap: Record<string, Position> = {
  top: Position.Top, bottom: Position.Bottom, left: Position.Left, right: Position.Right,
}
</script>

<template>
  <div
    class="g-portal-chip"
    :style="{ '--node-color': data.color }"
    :title="'Reference — lives ' + (data.contextLabel ? 'in ' + data.contextLabel : 'outside this view') + '. Click to open the real node.'"
  >
    <Handle
      v-for="h in data.handles"
      :key="h.id"
      :id="h.id"
      :type="h.type"
      :position="sideMap[h.side]"
      class="g-portal-port"
    />
    <span class="g-portal-glyph">⤢</span>
    <span class="g-portal-chip-body">
      <span class="g-portal-chip-name">{{ data.label }}</span>
      <span v-if="data.contextLabel" class="g-portal-chip-ctx">in {{ data.contextLabel }}</span>
    </span>
  </div>
</template>
