<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { edgeFamily, kindColor, nodeFamily } from './force-layout'
import FamilyMark from './FamilyMark.vue'
import type { GraphNode, NodeFamily, TimelineItem } from './types'

const props = defineProps<{ items: TimelineItem[]; nodes?: GraphNode[] }>()
const emit = defineEmits<{ select: [id: string] }>()

const labels = computed(() => new Map((props.nodes || []).map(node => [node.id, node.label])))
function name(id?: string): string { return (id && labels.value.get(id)) || 'Record outside this view' }
function attribute(item: TimelineItem, key: string): string {
  const value = (item.attrs as Record<string, unknown> | undefined)?.[key]
  return typeof value === 'string' ? value : ''
}
/**
 * A timeline entry names the operation in `kind`; the record's own kind lives in
 * the attributes the operation carried, and a relation's kind lives inside the
 * operation it applied.
 */
function relationKind(item: TimelineItem): string {
  const operation = (item.attrs as Record<string, unknown> | undefined)?.operation
  const value = operation && typeof operation === 'object' ? (operation as Record<string, unknown>).kind : undefined
  return typeof value === 'string' ? value : 'related'
}

interface Entry {
  item: TimelineItem
  minute: string
  repeated: boolean
  isEdge: boolean
  title: string
  kind: string
  status: string
  verb: string
  family: NodeFamily | 'relation'
  colour: string
}

function entryOf(item: TimelineItem, previous?: Entry): Entry {
  const stamp = item.updated_at ? new Date(item.updated_at * 1000) : null
  const minute = stamp ? stamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
  const isEdge = item.entity_type === 'edge'
  const verb = /\.add$/.test(item.kind) ? 'added' : /\.remove|\.delete/.test(item.kind) ? 'removed' : 'updated'
  if (isEdge) {
    const kind = relationKind(item)
    const family = edgeFamily(kind)
    return {
      item, minute, repeated: previous?.minute === minute, isEdge,
      title: `${name(item.from_node_id)} → ${name(item.to_node_id)}`,
      kind: kind.replace(/_/g, ' '),
      status: '',
      verb,
      family: 'relation',
      colour: family === 'conflict' ? 'var(--jr-danger)'
        : family === 'support' ? 'var(--jr-success)'
          : family === 'succession' ? 'var(--jr-decision)' : 'var(--jr-muted)',
    }
  }
  const kind = attribute(item, 'kind') || 'record'
  return {
    item, minute, repeated: previous?.minute === minute, isEdge,
    title: item.label || attribute(item, 'label') || 'Journal entry',
    kind: kind.replace(/_/g, ' '),
    status: attribute(item, 'status'),
    verb,
    family: nodeFamily(kind),
    colour: kindColor(kind),
  }
}

const groups = computed(() => {
  const out = new Map<string, Entry[]>()
  for (const item of props.items) {
    const day = item.updated_at
      ? new Date(item.updated_at * 1000).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
      : 'Undated'
    const entries = out.get(day) || []
    entries.push(entryOf(item, entries[entries.length - 1]))
    out.set(day, entries)
  }
  return [...out.entries()].map(([day, entries]) => ({
    day,
    entries,
    records: entries.filter(entry => !entry.isEdge).length,
    relations: entries.filter(entry => entry.isEdge).length,
  }))
})

</script>

<template>
  <section class="jr-timeline-lens">
    <div class="jr-lens-meta">
      <span class="jr-lens-title">Changes</span>
      <span class="jr-lens-facts"><b class="jr-numeric">{{ items.length }}</b> revisions <i aria-hidden="true"></i> newest first</span>
    </div>
    <div v-if="!items.length" class="jr-empty-state">
      <Icon icon="tabler:timeline-event" aria-hidden="true" />
      <h3>No revisions in range</h3>
      <p>Nothing has been written to this graph inside the bounded query window.</p>
    </div>
    <ol v-else class="jr-timeline">
      <li v-for="group in groups" :key="group.day" class="jr-time-group">
        <h3 class="jr-time-day">
          <span>{{ group.day }}</span>
          <em class="jr-numeric">{{ group.records }} records · {{ group.relations }} relations</em>
        </h3>
        <ol class="jr-time-list">
          <li v-for="entry in group.entries" :key="`${entry.item.entity_type}:${entry.item.id}`">
            <button
              class="jr-time-row" :class="{ 'is-edge': entry.isEdge }"
              :disabled="entry.isEdge"
              @click="!entry.isEdge && emit('select', entry.item.id)"
            >
              <time class="jr-numeric" :class="{ repeat: entry.repeated }">{{ entry.minute }}</time>
              <span class="jr-time-rail" aria-hidden="true">
                <FamilyMark
                  :family="entry.family === 'relation' ? 'note' : entry.family"
                  :radius="entry.isEdge ? 4.4 : 6.4"
                  :hollow="entry.isEdge ? false : undefined"
                  view-box="-10 -10 20 20"
                  :style="{ color: entry.colour }"
                />
              </span>
              <span class="jr-time-copy">
                <b>{{ entry.title }}</b>
                <small class="jr-time-kind">{{ entry.kind }}</small>
                <small v-if="entry.status" :class="['jr-state-chip', `state-${entry.status.toLowerCase()}`]">{{ entry.status }}</small>
              </span>
              <span class="jr-time-rev jr-numeric">{{ entry.verb }} · rev {{ entry.item.revision }}</span>
            </button>
          </li>
        </ol>
      </li>
    </ol>
  </section>
</template>
