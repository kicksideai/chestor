<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { kindColor, nodeFamily } from './force-layout'
import FamilyMark from './FamilyMark.vue'
import type { GraphNode } from './types'

defineProps<{ results: GraphNode[]; query: string; mode: string; loading?: boolean }>()
const emit = defineEmits<{ select: [id: string] }>()
function score(node: GraphNode): number | null { return typeof node.distance === 'number' ? Math.max(0, Math.min(1, 1 - node.distance)) : null }
function date(value: number) { return value ? new Date(value * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '' }
</script>

<template>
  <section class="jr-search-lens">
    <div v-if="query" class="jr-lens-meta">
      <span class="jr-lens-title">Recall</span>
      <span class="jr-lens-facts"><b class="jr-numeric">{{ results.length }}</b> matches <i aria-hidden="true"></i> {{ mode }} <i aria-hidden="true"></i> bounded to this graph</span>
    </div>
    <div v-if="loading" class="jr-loading-lines" aria-label="Searching"><i v-for="n in 5" :key="n"></i></div>
    <div v-else-if="!query" class="jr-empty-state">
      <Icon icon="tabler:search" aria-hidden="true" />
      <h3>Recall context, not just words</h3>
      <p>Match exact text or semantic meaning inside this graph. Every result keeps its address and revision, so you can cite what you find.</p>
    </div>
    <div v-else-if="!results.length" class="jr-empty-state">
      <Icon icon="tabler:file-search" aria-hidden="true" />
      <h3>Nothing matched</h3>
      <p>Try a broader phrase, or open the navigator and search a different graph.</p>
    </div>
    <ol v-else class="jr-result-list">
      <li v-for="(node, index) in results" :key="node.id">
        <button :class="['jr-result', `family-${nodeFamily(node.kind)}`]" :style="{ '--node-color': kindColor(node.kind) }" @click="emit('select', node.id)">
          <span class="jr-result-rank jr-numeric">{{ index + 1 }}</span>
          <FamilyMark class="jr-kind-mark" :family="nodeFamily(node.kind)" :radius="8" />
          <span class="jr-result-copy">
            <span class="jr-eyebrow">{{ node.kind.replace(/_/g, ' ') }}</span>
            <b>{{ node.label }}</b>
            <span>{{ node.summary || 'No summary recorded.' }}</span>
            <small class="jr-numeric">{{ date(node.updated_at) }}</small>
          </span>
          <span class="jr-score">
            <b class="jr-numeric">{{ score(node) !== null ? score(node)?.toFixed(2) : 'exact' }}</b>
            <i><span :style="{ width: `${(score(node) ?? 1) * 100}%` }"></span></i>
            <small>{{ score(node) !== null ? 'semantic' : 'text + attrs' }}</small>
          </span>
        </button>
      </li>
    </ol>
  </section>
</template>
