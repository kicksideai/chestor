<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { carryExpanded, isAgentNode, isFolded, isSettled, treeRows } from './tree'
import { degreeMap, kindColor, nodeFamily } from './force-layout'
import FamilyMark from './FamilyMark.vue'
import VirtualList from './VirtualList.vue'
import type { ViewportMemory } from './navigation'
import type { AgentPresence, GraphEdge, GraphNode } from './types'

/**
 * The pitch of one row, in pixels. Virtualization places rows by arithmetic
 * rather than by measuring them, so the CSS in styles.outline.css takes its
 * height from these two numbers and the two can never drift apart.
 */
const ROW_HEIGHT = 44
const ROW_HEIGHT_COMPACT = 34

const props = defineProps<{
  nodes: GraphNode[]
  edges?: GraphEdge[]
  presence?: AgentPresence[]
  touchedIds?: Set<string>
  selectedId?: string
  compact?: boolean
  /** How this lens last had this focus arranged, when the reader has been here before. */
  viewport?: ViewportMemory | null
}>()
const emit = defineEmits<{
  select: [id: string]
  focus: [id: string]
  menu: [id: string, event: MouseEvent]
  viewport: [value: ViewportMemory]
}>()

const expanded = ref<Set<string>>(new Set())
// The records this outline has already shown the reader. A refresh is only a
// refresh for these; anything else is arriving for the first time.
let known = new Set<string>()
watch(() => props.nodes, nodes => {
  expanded.value = carryExpanded(nodes, expanded.value, known)
  known = new Set(nodes.map(node => node.id))
}, { immediate: true })

// Agent records describe presence, not structure. They are shown on the record
// they stand on instead of taking a row of their own.
const structural = computed(() => props.nodes.filter(node => !isAgentNode(node)))
const rows = computed(() => treeRows(structural.value, expanded.value))
const rowHeight = computed(() => (props.compact ? ROW_HEIGHT_COMPACT : ROW_HEIGHT))
const degree = computed(() => degreeMap(props.edges || []))
const standing = computed(() => {
  const map = new Map<string, AgentPresence[]>()
  for (const agent of props.presence || []) {
    if (!agent.positionId) continue
    const bucket = map.get(agent.positionId) || []
    bucket.push(agent)
    map.set(agent.positionId, bucket)
  }
  return map
})

const root = ref<HTMLElement | null>(null)
const cursor = ref(-1)
const reveal = ref<number | undefined>(undefined)

// One row at a time carries the tab stop, so a reader reaches the outline in a
// single Tab whatever its length and then walks it with the arrow keys.
const tabStop = computed(() => Math.min(Math.max(cursor.value, 0), Math.max(rows.value.length - 1, 0)))
// A record selected elsewhere is brought into view the first time its row is
// in the outline; after that the reader keeps their place.
let shown = ''
watch(() => [props.selectedId, rows.value] as const, ([id]) => {
  if (!id || id === shown) return
  const at = rows.value.findIndex(row => row.node.id === id)
  if (at < 0) return
  shown = id
  cursor.value = at
  reveal.value = at
}, { immediate: true })

function toggle(id: string) {
  const next = new Set(expanded.value)
  next.has(id) ? next.delete(id) : next.add(id)
  expanded.value = next
}

/** Puts the reading position on a row, bringing it into the window first. */
function land(index: number) {
  if (index < 0 || index >= rows.value.length) return
  cursor.value = index
  reveal.value = index
  nextTick(() => root.value?.querySelector<HTMLElement>(`[data-row="${index}"]`)?.focus())
}

/** The row that owns this one, found in the flattened order by depth. */
function parentOf(index: number): number {
  const depth = rows.value[index].depth
  for (let above = index - 1; above >= 0; above--) if (rows.value[above].depth < depth) return above
  return -1
}

function onKey(index: number, event: KeyboardEvent) {
  const row = rows.value[index]
  if (!row) return
  const below = rows.value[index + 1]
  switch (event.key) {
    case 'ArrowDown': land(index + 1); break
    case 'ArrowUp': land(index - 1); break
    case 'ArrowRight':
      if (!row.hasChildren) return
      if (row.expanded) { if (below && below.depth > row.depth) land(index + 1) } else toggle(row.node.id)
      break
    case 'ArrowLeft':
      if (row.hasChildren && row.expanded) toggle(row.node.id)
      else land(parentOf(index))
      break
    case 'Enter':
    case ' ':
      emit('select', row.node.id)
      break
    default: return
  }
  event.preventDefault()
}

function outcome(node: GraphNode): string { return String(node.status || node.metadata?.outcome || '') }
</script>

<template>
  <div ref="root" :class="['jr-tree', { compact }]" role="tree" aria-label="Journal outline" :style="{ '--jr-row-height': `${rowHeight}px` }">
    <p v-if="!rows.length" class="jr-empty-small">No records in this focus window.</p>
    <VirtualList
      v-else role="presentation" :items="rows" :row-height="rowHeight" :scroll-to-index="reveal"
      :restore-scroll-top="viewport?.scrollTop"
      @scroll="top => emit('viewport', { scrollTop: top })"
    >
      <template #row="{ item: row, index }">
        <div
          :class="['jr-tree-row', `family-${nodeFamily(row.node.kind)}`, {
            selected: row.node.id === selectedId,
            folded: isFolded(row.node),
            settled: isSettled(row.node),
            branch: row.hasChildren,
            occupied: standing.has(row.node.id),
            touched: touchedIds?.has(row.node.id),
          }]"
          :style="{ '--depth': row.depth, '--node-color': kindColor(row.node.kind) }"
          :data-row="index"
          role="treeitem" :tabindex="index === tabStop ? 0 : -1" :aria-level="row.depth + 1" :aria-selected="row.node.id === selectedId"
          :aria-setsize="rows.length" :aria-posinset="index + 1"
          :aria-expanded="row.hasChildren ? row.expanded : undefined"
          @click="emit('select', row.node.id)" @dblclick.prevent="emit('focus', row.node.id)"
          @contextmenu.prevent="emit('menu', row.node.id, $event)"
          @focusin="cursor = index"
          @keydown="onKey(index, $event)"
        >
          <span class="jr-tree-guides" aria-hidden="true"></span>
          <button v-if="row.hasChildren" class="jr-disclosure" :aria-label="row.expanded ? 'Collapse branch' : 'Expand branch'" @click.stop="toggle(row.node.id)">
            <Icon :icon="row.expanded ? 'tabler:chevron-down' : 'tabler:chevron-right'" aria-hidden="true" />
          </button>
          <span v-else class="jr-disclosure-spacer" aria-hidden="true"></span>

          <FamilyMark class="jr-kind-mark" :family="nodeFamily(row.node.kind)" :radius="7" view-box="-11 -11 22 22" />

          <span class="jr-tree-copy">
            <span class="jr-tree-title">{{ row.node.label }}</span>
            <span v-if="!compact && row.node.summary" class="jr-tree-summary">{{ row.node.summary }}</span>
          </span>

          <span class="jr-tree-meta">
            <span class="jr-tree-kind">{{ row.node.kind.replace(/_/g, ' ') }}</span>
            <span v-if="standing.get(row.node.id)" class="jr-tree-presence" :title="standing.get(row.node.id)!.map(agent => agent.label).join(', ')">
              <i v-for="agent in standing.get(row.node.id)!.slice(0, 3)" :key="agent.id">{{ agent.initials }}</i>
            </span>
            <span v-if="outcome(row.node)" :class="['jr-state-chip', `state-${outcome(row.node).toLowerCase()}`]">{{ outcome(row.node) }}</span>
            <span class="jr-tree-links jr-numeric" :title="`${degree.get(row.node.id) || 0} relations · ${row.node.child_count} children`">
              <Icon icon="tabler:link" aria-hidden="true" />{{ degree.get(row.node.id) || 0 }}
            </span>
          </span>

          <button class="jr-open-root" title="Open as focus root" :aria-label="`Open ${row.node.label} as focus root`" @click.stop="emit('focus', row.node.id)">
            <Icon icon="tabler:arrow-up-right" aria-hidden="true" />
          </button>
        </div>
      </template>
    </VirtualList>
  </div>
</template>
