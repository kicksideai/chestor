<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { agentSummary, groupByLiveness, mergeAgents } from './agents'
import type { AgentRow, Liveness } from './agents'
import { relativeAge } from './assembly'
import type { JournalCursor, WorkSpan } from './types'

/**
 * Who is in this journal, journal-wide rather than scoped to the open graph.
 * Presence within the last hour is bright, today's is quiet, and everything
 * older is folded behind its own count — folded, never dropped, so the rail
 * always states how many identities the journal actually holds.
 */
const props = defineProps<{
  cursors: JournalCursor[]
  spans: WorkSpan[]
  now: number
  selectedAgent?: string
}>()
const emit = defineEmits<{ agent: [row: AgentRow] }>()

const showOlder = ref(false)
const rows = computed(() => mergeAgents(props.cursors, props.spans, props.now))
const groups = computed(() => groupByLiveness(rows.value))
const summary = computed(() => agentSummary(groups.value))

const TIER_LABEL: Record<Liveness, string> = { now: 'Now', today: 'Today', older: 'Earlier' }
</script>

<template>
  <section class="jr-agents-rail" aria-label="Agents in this journal">
    <h3 class="jr-section-label">
      <span>Agents</span>
      <em class="jr-numeric">{{ summary }}</em>
    </h3>

    <p v-if="!rows.length" class="jr-empty-small">No agent has written to this journal yet.</p>

    <template v-for="tier in (['now', 'today'] as Liveness[])" :key="tier">
      <div v-if="groups[tier].length" class="jr-agent-tier" :class="`tier-${tier}`">
        <h4 class="jr-eyebrow">{{ TIER_LABEL[tier] }} <span class="jr-numeric">{{ groups[tier].length }}</span></h4>
        <button
          v-for="row in groups[tier]" :key="row.id"
          :class="['jr-agent-card', `tier-${row.liveness}`, { working: row.working, active: row.id === selectedAgent }]"
          :title="`${row.purpose} · last wrote ${relativeAge(row.lastActivityAt, now)}`"
          @click="emit('agent', row)"
        >
          <span class="jr-avatar">{{ row.initials }}</span>
          <span class="jr-agent-copy">
            <b>{{ row.label }}</b>
            <small class="jr-agent-purpose">{{ row.purpose }}</small>
            <small v-if="row.headline" class="jr-agent-headline">{{ row.headline }}</small>
          </span>
          <span class="jr-agent-meta">
            <time class="jr-numeric">{{ relativeAge(row.lastActivityAt, now) }}</time>
            <em v-if="row.working" class="jr-working">open span</em>
            <em v-else class="jr-numeric">{{ row.factCount }} facts</em>
          </span>
        </button>
      </div>
    </template>

    <div v-if="groups.older.length" class="jr-agent-tier tier-older">
      <button class="jr-agent-fold" :aria-expanded="showOlder" @click="showOlder = !showOlder">
        <Icon :icon="showOlder ? 'tabler:chevron-down' : 'tabler:chevron-right'" aria-hidden="true" />
        <span>Earlier</span>
        <em class="jr-numeric">{{ groups.older.length }}</em>
      </button>
      <template v-if="showOlder">
        <button
          v-for="row in groups.older" :key="row.id"
          :class="['jr-agent-card', 'tier-older', { active: row.id === selectedAgent }]"
          :title="`${row.purpose} · last wrote ${relativeAge(row.lastActivityAt, now)}`"
          @click="emit('agent', row)"
        >
          <span class="jr-avatar">{{ row.initials }}</span>
          <span class="jr-agent-copy">
            <b>{{ row.label }}</b>
            <small class="jr-agent-purpose">{{ row.purpose }}</small>
          </span>
          <time class="jr-numeric">{{ relativeAge(row.lastActivityAt, now) }}</time>
        </button>
      </template>
    </div>
  </section>
</template>
