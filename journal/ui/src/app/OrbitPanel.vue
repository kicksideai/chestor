<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { edgeFamily, kindColor, nodeFamily } from './force-layout'
import FamilyMark from './FamilyMark.vue'
import { agentIdentity } from './presence'
import { relativeAge } from './assembly'
import { isFolded } from './tree'
import type { AgentPresence, GraphEdge, GraphNode, JournalEvent, WorkSpan } from './types'

/**
 * The orbit of one record: what it hangs from, what hangs from it, what argues
 * with it, which facts are attached to it, and who has been standing on it. The
 * same panel answers in every lens, so the reader can read a record's
 * surroundings without giving up the place they are reading from — peeking is
 * not descending.
 */
const props = defineProps<{
  node?: GraphNode | null
  nodes: GraphNode[]
  edges: GraphEdge[]
  presence?: AgentPresence[]
  spans?: WorkSpan[]
  events?: JournalEvent[]
  graphId?: string
  now: number
  /** True while the panel is showing a record the reader only pointed at. */
  peek?: boolean
}>()
const emit = defineEmits<{ select: [id: string]; focus: [id: string]; close: [] }>()

const byId = computed(() => new Map(props.nodes.map(node => [node.id, node])))
const incoming = computed(() => props.node ? props.edges.filter(edge => edge.to === props.node!.id && edgeFamily(edge.kind) !== 'presence') : [])
const outgoing = computed(() => props.node ? props.edges.filter(edge => edge.from === props.node!.id && edgeFamily(edge.kind) !== 'presence') : [])
const attrs = computed(() => ({ ...(props.node?.attrs || {}), ...(props.node?.metadata || {}) }))

/** The chain from the graph root down to this record. */
const parents = computed(() => {
  const chain: GraphNode[] = []
  const seen = new Set<string>()
  let current = props.node?.parent_id ? byId.value.get(props.node.parent_id) : undefined
  while (current && !seen.has(current.id) && chain.length < 32) {
    seen.add(current.id)
    chain.push(current)
    current = current.parent_id ? byId.value.get(current.parent_id) : undefined
  }
  return chain.reverse()
})

const children = computed(() => props.node
  ? props.nodes.filter(node => node.parent_id === props.node!.id).sort((a, b) => b.updated_at - a.updated_at)
  : [])

/** Relations grouped by the kind they carry, in and out kept apart. */
const relationGroups = computed(() => {
  const groups = new Map<string, { kind: string; out: GraphEdge[]; in: GraphEdge[] }>()
  const bucket = (kind: string) => {
    const existing = groups.get(kind)
    if (existing) return existing
    const created = { kind, out: [] as GraphEdge[], in: [] as GraphEdge[] }
    groups.set(kind, created)
    return created
  }
  for (const edge of outgoing.value) bucket(edge.kind).out.push(edge)
  for (const edge of incoming.value) bucket(edge.kind).in.push(edge)
  return [...groups.values()].sort((a, b) => (b.out.length + b.in.length) - (a.out.length + a.in.length))
})

const blocks = computed(() => outgoing.value.filter(edge => /^(blocks|threatens|invalidates)$/i.test(edge.kind)))
const blockedBy = computed(() => incoming.value.filter(edge => /^(blocks|threatens|invalidates)$/i.test(edge.kind)))
const contradictions = computed(() => [...incoming.value, ...outgoing.value].filter(edge => edgeFamily(edge.kind) === 'conflict'))
const sources = computed(() => [...incoming.value, ...outgoing.value]
  .filter(edge => /support|evidence|source|reference|provenance|verif/.test(edge.kind)).slice(0, 8))
const successor = computed(() => outgoing.value.find(edge => /supersed|successor|learned/.test(edge.kind)))

/**
 * The facts attached to this record. A projected record carries the id of the
 * fact that wrote it, so the attachment is read from that rather than guessed
 * from the text.
 */
const attachedFacts = computed(() => {
  const id = props.node?.id || ''
  if (!id) return []
  const eventId = String((attrs.value as Record<string, unknown>).event_id || '')
  const stripped = id.replace(/^event:/, '')
  return (props.events || [])
    .filter(event => event.id === stripped || event.id === eventId || (event.linked_task_ids || []).includes(stripped))
    .sort((a, b) => b.seq - a.seq)
})

/** Every identity whose watermark or position has been on this record. */
const standing = computed(() => (props.presence || []).filter(agent => agent.positionId === props.node?.id || agent.touchNodeId === props.node?.id))
const touchingSpans = computed(() => {
  const eventIds = new Set(attachedFacts.value.map(event => event.id))
  return (props.spans || [])
    .filter(span => span.last_fact && eventIds.has(span.last_fact.event_id))
    .sort((a, b) => b.last_activity_at - a.last_activity_at)
})

interface ContentBlock { id: string; title: string; body: string; format: string; role: string; collapsed: boolean }
function text(value: unknown): string {
  if (typeof value === 'string') return value
  return value == null ? '' : JSON.stringify(value, null, 2)
}
const contentBlocks = computed<ContentBlock[]>(() => {
  const value = attrs.value as Record<string, unknown>
  const blocks: ContentBlock[] = []
  const add = (raw: unknown, index: number, fallback = 'Content') => {
    if (typeof raw === 'string') {
      if (raw) blocks.push({ id: `content-${index}`, title: fallback, body: raw, format: 'text', role: 'content', collapsed: false })
      return
    }
    if (!raw || typeof raw !== 'object') return
    const item = raw as Record<string, unknown>
    const body = text(item.body ?? item.text ?? item.content)
    if (!body) return
    blocks.push({
      id: String(item.id || `content-${index}`),
      title: String(item.title || item.name || fallback),
      body,
      format: String(item.format || item.media_type || 'text').toLowerCase(),
      role: String(item.role || 'content'),
      collapsed: item.collapsed === true,
    })
  }
  add(value.content, 0)
  const documents = Array.isArray(value.documents) ? value.documents : Array.isArray(value.content_blocks) ? value.content_blocks : []
  documents.forEach((item, index) => add(item, index + 1, `Document ${index + 1}`))
  return blocks
})
const displayAttrs = computed(() => {
  const value = { ...(attrs.value as Record<string, unknown>) }
  delete value.content; delete value.documents; delete value.content_blocks
  return value
})
const noteFields = computed(() => Object.entries(displayAttrs.value)
  .filter(([key, value]) => key !== 'journal_write' && key !== 'provenance'
    && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'))
  .slice(0, 10)
  .map(([key, value]) => ({
    key,
    label: key.replace(/[_-]+/g, ' ').replace(/\b\w/g, character => character.toUpperCase()),
    value: String(value),
  })))
const summary = computed(() => {
  const value = props.node?.summary || 'No summary has been recorded for this record.'
  return value.length > 600 ? `${value.slice(0, 599)}…` : value
})

const tab = ref<'orbit' | 'record'>('orbit')
watch(() => props.node?.id, () => { tab.value = 'orbit' })

function endpoint(edge: GraphEdge) { return edge.from === props.node?.id ? edge.to : edge.from }
function label(id: string) { return byId.value.get(id)?.label || 'Record outside this view' }
function date(value?: number) { return value ? new Date(value * 1000).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Unknown' }
</script>

<template>
  <section class="jr-orbit" aria-label="Record orbit">
    <header class="jr-panel-head">
      <span>{{ peek ? 'Peek' : 'Record' }}</span>
      <nav v-if="node" class="jr-orbit-tabs" aria-label="Orbit or record">
        <button :class="{ active: tab === 'orbit' }" @click="tab = 'orbit'">Orbit</button>
        <button :class="{ active: tab === 'record' }" @click="tab = 'record'">Record</button>
      </nav>
      <button aria-label="Close" title="Close" @click="emit('close')"><Icon icon="tabler:x" aria-hidden="true" /></button>
    </header>

    <div v-if="!node" class="jr-empty-state">
      <Icon icon="tabler:focus-2" aria-hidden="true" />
      <h3>Nothing selected</h3>
      <p>Pick a record in any lens to read what it hangs from, what argues with it, and who has been standing on it.</p>
    </div>

    <template v-else>
      <div class="jr-orbit-body" :class="`family-${nodeFamily(node.kind)}`" :style="{ '--node-color': kindColor(node.kind) }">
        <div class="jr-detail-head">
          <div class="jr-detail-title">
            <FamilyMark class="jr-kind-mark large" :family="nodeFamily(node.kind)" :radius="9" view-box="-14 -14 28 28" />
            <div>
              <span class="jr-eyebrow">{{ node.kind.replace(/_/g, ' ') }}</span>
              <h2>{{ node.label }}</h2>
            </div>
          </div>
          <p class="jr-detail-summary">{{ summary }}</p>
          <div class="jr-detail-meta">
            <span v-if="node.status" :class="['jr-state-chip', `state-${node.status.toLowerCase()}`]">{{ node.status }}</span>
            <span class="jr-numeric">rev {{ node.revision }}</span>
            <span class="jr-numeric">{{ incoming.length + outgoing.length }} relations</span>
            <span class="jr-numeric">{{ relativeAge(node.updated_at, now) }}</span>
            <button class="jr-root-action" @click="emit('focus', node.id)"><Icon icon="tabler:arrow-up-right" aria-hidden="true" /> Descend</button>
          </div>
        </div>

        <template v-if="tab === 'orbit'">
          <section v-if="parents.length" class="jr-detail-section jr-orbit-chain">
            <h3>Hangs from <span class="jr-numeric">{{ parents.length }}</span></h3>
            <ol class="jr-chain">
              <li v-for="(item, index) in parents" :key="item.id" :style="{ '--step': index }">
                <button class="jr-related" @click="emit('select', item.id)">
                  <FamilyMark class="jr-kind-mark" :family="nodeFamily(item.kind)" :radius="9" />
                  <span>{{ item.label }}</span>
                  <b aria-hidden="true">›</b>
                </button>
              </li>
            </ol>
          </section>

          <section v-if="children.length" class="jr-detail-section">
            <h3>Holds <span class="jr-numeric">{{ children.length }}</span></h3>
            <button v-for="child in children.slice(0, 12)" :key="child.id" class="jr-related" @click="emit('select', child.id)">
              <i>{{ child.kind.replace(/_/g, ' ') }}</i>
              <span>{{ child.label }}</span>
              <b aria-hidden="true">›</b>
            </button>
            <button v-if="children.length > 12" class="jr-orbit-more" @click="emit('focus', node.id)">
              Descend to read all {{ children.length }}
            </button>
          </section>

          <section v-if="blockedBy.length || blocks.length" class="jr-detail-section jr-danger-section">
            <h3>Blocking <span class="jr-numeric">{{ blockedBy.length + blocks.length }}</span></h3>
            <button v-for="edge in blockedBy" :key="edge.id" class="jr-related" @click="emit('select', endpoint(edge))">
              <i class="danger">blocked by</i><span>{{ label(endpoint(edge)) }}</span><b aria-hidden="true">‹</b>
            </button>
            <button v-for="edge in blocks" :key="edge.id" class="jr-related" @click="emit('select', endpoint(edge))">
              <i class="danger">blocks</i><span>{{ label(endpoint(edge)) }}</span><b aria-hidden="true">›</b>
            </button>
          </section>

          <section v-if="contradictions.length" class="jr-detail-section jr-danger-section">
            <h3>Contested by <span class="jr-numeric">{{ contradictions.length }}</span></h3>
            <button v-for="edge in contradictions" :key="edge.id" class="jr-related" @click="emit('select', endpoint(edge))">
              <i class="danger">{{ edge.kind.replace(/_/g, ' ') }}</i><span>{{ label(endpoint(edge)) }}</span><b aria-hidden="true">›</b>
            </button>
          </section>

          <section v-if="relationGroups.length" class="jr-detail-section">
            <h3>Relations by kind <span class="jr-numeric">{{ relationGroups.length }}</span></h3>
            <details v-for="group in relationGroups" :key="group.kind" class="jr-relation-group" :open="group.out.length + group.in.length <= 4">
              <summary>
                <span :class="['jr-relation-kind', `edge-${edgeFamily(group.kind)}`]">{{ group.kind.replace(/_/g, ' ') }}</span>
                <em class="jr-numeric">{{ group.out.length }} out · {{ group.in.length }} in</em>
              </summary>
              <button v-for="edge in group.out" :key="`o-${edge.id}`" class="jr-related" @click="emit('select', endpoint(edge))">
                <i>out</i><span>{{ label(endpoint(edge)) }}</span><b aria-hidden="true">›</b>
              </button>
              <button v-for="edge in group.in" :key="`i-${edge.id}`" class="jr-related" @click="emit('select', endpoint(edge))">
                <i>in</i><span>{{ label(endpoint(edge)) }}</span><b aria-hidden="true">‹</b>
              </button>
            </details>
          </section>

          <section v-if="attachedFacts.length" class="jr-detail-section">
            <h3>Facts attached <span class="jr-numeric">{{ attachedFacts.length }}</span></h3>
            <div v-for="fact in attachedFacts.slice(0, 10)" :key="fact.id" class="jr-orbit-fact">
              <span :class="['jr-eyebrow', `family-${nodeFamily(fact.event_type)}`]">{{ fact.event_type.replace(/_/g, ' ') }}</span>
              <b>{{ fact.title || fact.body || 'Journal entry' }}</b>
              <time class="jr-numeric">{{ relativeAge(fact.ts, now) }}</time>
            </div>
          </section>

          <section v-if="standing.length || touchingSpans.length" class="jr-detail-section jr-presence-section">
            <h3>Who has been here <span class="jr-numeric">{{ standing.length + touchingSpans.length }}</span></h3>
            <div v-for="agent in standing" :key="agent.id" class="jr-presence-row">
              <span class="jr-avatar">{{ agent.initials }}</span>
              <span><b>{{ agent.label }}</b><small>{{ agent.purpose }}</small></span>
            </div>
            <div v-for="span in touchingSpans" :key="span.span_id" class="jr-presence-row">
              <span class="jr-avatar">{{ agentIdentity(span.agent_id || span.cursor_id || '').initials }}</span>
              <span>
                <b>{{ agentIdentity(span.agent_id || span.cursor_id || '').label }}</b>
                <small>{{ span.working_on?.text || 'Wrote here' }} · {{ relativeAge(span.last_activity_at, now) }}</small>
              </span>
            </div>
          </section>
        </template>

        <template v-else>
          <section v-if="isFolded(node)" class="jr-learning">
            <span class="jr-eyebrow">Distilled learning</span>
            <p>{{ attrs.learning || attrs.distilled || node.summary || 'This branch was folded without a learning summary.' }}</p>
          </section>

          <section v-if="contentBlocks.length" class="jr-content-stack">
            <h3>Content <span class="jr-numeric">{{ contentBlocks.length }}</span></h3>
            <details v-for="(block, index) in contentBlocks" :key="block.id" class="jr-content-block" :open="!block.collapsed && index === 0">
              <summary><span>{{ block.title }}</span><em>{{ block.role }} · {{ block.format }}</em></summary>
              <pre v-if="/json|code|lua|typescript|javascript|yaml/.test(block.format)">{{ block.body }}</pre>
              <div v-else>{{ block.body }}</div>
            </details>
          </section>

          <section v-if="noteFields.length" class="jr-detail-section jr-note-fields">
            <h3>Context <span class="jr-numeric">{{ noteFields.length }}</span></h3>
            <dl><template v-for="field in noteFields" :key="field.key"><dt>{{ field.label }}</dt><dd>{{ field.value }}</dd></template></dl>
          </section>

          <section v-if="sources.length" class="jr-detail-section">
            <h3>Evidence <span class="jr-numeric">{{ sources.length }}</span></h3>
            <button v-for="edge in sources" :key="edge.id" class="jr-related" @click="emit('select', endpoint(edge))">
              <i>{{ edge.kind.replace(/_/g, ' ') }}</i><span>{{ label(endpoint(edge)) }}</span><b aria-hidden="true">›</b>
            </button>
          </section>

          <section v-if="successor" class="jr-detail-section">
            <h3>Superseded by</h3>
            <button class="jr-related" @click="emit('select', endpoint(successor))">
              <i>{{ successor.kind.replace(/_/g, ' ') }}</i><span>{{ label(endpoint(successor)) }}</span><b aria-hidden="true">›</b>
            </button>
          </section>

          <section class="jr-detail-section">
            <h3>Position</h3>
            <dl>
              <dt>Parent</dt><dd>{{ byId.get(node.parent_id || '')?.label || (node.parent_id ? 'Parent outside this view' : 'Graph root') }}</dd>
              <dt>Children</dt><dd class="jr-numeric">{{ node.child_count }}</dd>
              <dt>Updated</dt><dd class="jr-numeric">{{ date(node.updated_at) }}</dd>
              <dt>Created</dt><dd class="jr-numeric">{{ date(node.created_at) }}</dd>
            </dl>
          </section>


        </template>
      </div>
    </template>
  </section>
</template>
