<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { graphPresenceLine } from './agents'
import type { JournalGraph } from './types'

/**
 * The graphs this journal keeps, nested the way they were derived. Each row
 * says how much it holds and who has been in it lately, so a reader picks a
 * place to work from evidence rather than from a name.
 */
const props = defineProps<{ graphs: JournalGraph[]; graphId: string; now: number }>()
const emit = defineEmits<{ graph: [id: string] }>()

function graphIcon(kind: string): string {
  if (kind === 'current-work' || kind === 'work') return 'tabler:route'
  if (kind === 'history') return 'tabler:history'
  if (kind === 'governance') return 'tabler:gavel'
  if (kind === 'experiments') return 'tabler:flask-2'
  if (kind === 'research' || kind === 'alternatives') return 'tabler:microscope'
  if (kind === 'audit') return 'tabler:list-check'
  if (kind === 'specification') return 'tabler:file-description'
  if (kind === 'curated') return 'tabler:bookmark'
  return 'tabler:topology-star-3'
}

const graphRows = computed(() => {
  const byParent = new Map<string, JournalGraph[]>()
  const ids = new Set(props.graphs.map(graph => graph.id))
  for (const graph of props.graphs) {
    const parent = graph.parent_graph_id && ids.has(graph.parent_graph_id) ? graph.parent_graph_id : ''
    const bucket = byParent.get(parent) || []
    bucket.push(graph)
    byParent.set(parent, bucket)
  }
  const rows: Array<{ graph: JournalGraph; depth: number }> = []
  const visited = new Set<string>()
  const visit = (parent: string, depth: number) => {
    for (const graph of byParent.get(parent) || []) {
      if (visited.has(graph.id)) continue
      visited.add(graph.id)
      rows.push({ graph, depth })
      visit(graph.id, depth + 1)
    }
  }
  visit('', 0)
  for (const graph of props.graphs) if (!visited.has(graph.id)) rows.push({ graph, depth: 0 })
  return rows
})

function presence(graph: JournalGraph): string {
  return graphPresenceLine(graph.agent_count || 0, graph.last_agent_activity_at || 0, props.now)
}
</script>

<template>
  <section class="jr-catalog" aria-label="Journal graphs">
    <h3 class="jr-section-label"><span>Graphs</span><em class="jr-numeric">{{ graphs.length }}</em></h3>
    <div class="jr-catalog-grid">
      <button
        v-for="row in graphRows" :key="row.graph.id"
        :class="['jr-catalog-row', { active: row.graph.id === graphId, nested: row.depth > 0 }]"
        :style="{ paddingInlineStart: `${9 + Math.min(row.depth, 5) * 11}px` }"
        @click="emit('graph', row.graph.id)"
      >
        <span class="jr-catalog-icon"><Icon :icon="graphIcon(row.graph.kind)" aria-hidden="true" /></span>
        <span class="jr-catalog-copy">
          <b>{{ row.graph.title }}</b>
          <small v-if="presence(row.graph)" class="jr-catalog-presence">{{ presence(row.graph) }}</small>
          <small v-else :title="row.graph.description">{{ row.graph.description || row.graph.kind }}</small>
        </span>
        <span
          class="jr-catalog-count jr-numeric"
          :title="`${row.graph.node_count} records · ${row.graph.edge_count} relations · revision ${row.graph.revision}`"
        >{{ row.graph.node_count.toLocaleString() }}</span>
      </button>
    </div>
    <p v-if="!graphs.length" class="jr-empty-small">No graphs have been configured on this journal yet.</p>
  </section>
</template>
