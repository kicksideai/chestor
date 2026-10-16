<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { ancestorLabel, searchNodes } from './search'
import type { GraphNode, GraphTypeDef } from './types'

const props = defineProps<{
  nodes: GraphNode[]
  nodeById: Map<string, GraphNode>
  typeDefs: Map<string, GraphTypeDef>
}>()
const emit = defineEmits<{ (e: 'pick', id: string): void }>()

const input = ref<HTMLInputElement | null>(null)
const query = ref('')
const focused = ref(false)
const highlight = ref(0)

const hits = computed(() => searchNodes(props.nodes, query.value, props.typeDefs))
const open = computed(() => focused.value && query.value.trim().length > 0)

function dotColor(node: GraphNode): string {
  // Decorative domain fallback for the node category, not a state.
  return String(node.properties?.accent || props.typeDefs.get(node.type)?.color || 'var(--p-primary-color)')
}
function crumb(node: GraphNode): string {
  return ancestorLabel(props.nodeById, node.id)
}

function pick(id: string) {
  emit('pick', id)
  query.value = ''
  input.value?.blur()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') { e.preventDefault(); highlight.value = Math.min(highlight.value + 1, hits.value.length - 1) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); highlight.value = Math.max(highlight.value - 1, 0) }
  else if (e.key === 'Enter') { e.preventDefault(); const hit = hits.value[highlight.value]; if (hit) pick(hit.node.id) }
  else if (e.key === 'Escape') { e.stopPropagation(); query.value = ''; input.value?.blur() }
  else { highlight.value = 0 }
}

function focus(seed = '') {
  query.value = seed
  highlight.value = 0
  void nextTick(() => {
    input.value?.focus()
    input.value?.setSelectionRange(seed.length, seed.length)
  })
}

defineExpose({ focus })
</script>

<template>
  <div class="kg-search">
    <input
      ref="input"
      v-model="query"
      class="kg-search-input"
      type="text"
      placeholder="Find node…  /"
      spellcheck="false"
      @focus="focused = true"
      @blur="focused = false"
      @keydown="onKeydown"
    />
    <div v-if="open" class="kg-search-menu">
      <button
        v-for="(hit, i) in hits"
        :key="hit.node.id"
        class="kg-search-item"
        :class="{ active: i === highlight }"
        @mousedown.prevent="pick(hit.node.id)"
        @mousemove="highlight = i"
      >
        <span class="kg-tree-dot" :style="{ background: dotColor(hit.node) }"></span>
        <span class="kg-search-name">{{ hit.node.name }}</span>
        <span v-if="crumb(hit.node)" class="kg-search-crumb">{{ crumb(hit.node) }}</span>
      </button>
      <div v-if="!hits.length" class="kg-search-none">No matches</div>
    </div>
  </div>
</template>
