<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Avatar from 'primevue/avatar'
import ItemRow from './ItemRow.vue'
import type { AgentRow } from './agents'
import { factTitle } from './facts'
import { kindLabel, kindSeverity, relativeAge, statusLabel, statusSeverity } from './format'
import type { ItemRef, NeedItem, NeedReason, WorkItem } from './attention'
import type { JournalEvent, JournalTask } from './types'

/**
 * The left list of the page: what needs a person, what is being worked, which
 * agents are at it and how much went quiet; while a query is typed, the tasks
 * and facts that match it.
 */
const props = defineProps<{
  needs: NeedItem[]
  working: WorkItem[]
  query: string
  matchedTasks: JournalTask[]
  matchedFacts: JournalEvent[]
  searching: boolean
  searchError: string
  agents: AgentRow[]
  agentTasks: ReadonlyMap<string, string>
  quietCount: number
  quietOpen: boolean
  selected: ItemRef | null
  taskTitle: (id?: string) => string
  now: number
}>()
const emit = defineEmits<{ open: [target: ItemRef]; quiet: [] }>()

function agentTask(row: AgentRow): string { return props.agentTasks.get(row.id) || '' }
function openAgent(row: AgentRow) {
  const taskId = agentTask(row)
  if (taskId) emit('open', { kind: 'task', id: taskId })
}

const REASON: Record<NeedReason, { label: string; severity: 'danger' | 'warn' }> = {
  blocked: { label: 'Blocked', severity: 'danger' },
  blocker: { label: 'Blocker', severity: 'danger' },
  question: { label: 'Question', severity: 'warn' },
  stalled: { label: 'Stopped', severity: 'warn' },
}

function active(target: ItemRef): boolean {
  return props.selected?.kind === target.kind && props.selected.id === target.id
}
</script>

<template>
  <div class="jr-list">
    <template v-if="query.trim()">
      <div class="kx-settings-rail-group">Tasks</div>
      <p v-if="!matchedTasks.length" class="jr-list-empty">No task matches.</p>
      <ItemRow
        v-for="task in matchedTasks" :key="`t:${task.id}`"
        :title="task.title" :detail="taskTitle(task.parent_task_id)" :at="task.updated_at" :now="now"
        :tag="statusLabel(task.status)" :severity="statusSeverity(task.status)"
        :active="active({ kind: 'task', id: task.id })"
        @open="$emit('open', { kind: 'task', id: task.id })"
      />
      <div class="kx-settings-rail-group">Facts</div>
      <p v-if="searching" class="jr-list-empty">Searching…</p>
      <p v-else-if="searchError" class="jr-list-empty">{{ searchError }}</p>
      <p v-else-if="!matchedFacts.length" class="jr-list-empty">No fact matches.</p>
      <ItemRow
        v-for="fact in matchedFacts" :key="`f:${fact.id}`"
        :title="factTitle(fact, taskTitle)" :detail="taskTitle(fact.task_id)" :at="fact.ts" :now="now"
        :tag="kindLabel(fact.event_type)" :severity="kindSeverity(fact.event_type)"
        :active="active({ kind: 'fact', id: fact.id })"
        @open="$emit('open', { kind: 'fact', id: fact.id })"
      />
    </template>

    <template v-else>
      <div class="kx-settings-rail-group">Needs you <span v-if="needs.length" class="kx-count">{{ needs.length }}</span></div>
      <p v-if="!needs.length" class="jr-list-empty">Nothing needs you right now.</p>
      <ItemRow
        v-for="item in needs" :key="`${item.ref.kind}:${item.ref.id}`"
        :title="item.title" :detail="item.detail" :at="item.at" :now="now"
        :tag="REASON[item.reason].label" :severity="REASON[item.reason].severity"
        :active="active(item.ref)"
        @open="$emit('open', item.ref)"
      />
      <template v-if="working.length">
        <div class="kx-settings-rail-group">In progress <span class="kx-count">{{ working.length }}</span></div>
        <ItemRow
          v-for="item in working" :key="`${item.ref.kind}:${item.ref.id}`"
          :title="item.title" :detail="item.detail" :at="item.at" :now="now"
          :active="active(item.ref)"
          @open="$emit('open', item.ref)"
        />
      </template>
      <template v-if="agents.length">
        <div class="kx-settings-rail-group">Agents now <span class="kx-count">{{ agents.length }}</span></div>
        <component
          :is="agentTask(row) ? 'button' : 'div'" v-for="row in agents" :key="row.id"
          :type="agentTask(row) ? 'button' : undefined" class="jr-row jr-agent"
          @click="openAgent(row)"
        >
          <Avatar :label="row.initials" shape="circle" class="jr-avatar" :class="{ working: row.working }" />
          <span class="jr-row-main">
            <span class="jr-row-line">
              <span class="jr-row-title">{{ row.label }}</span>
              <time class="jr-row-time">{{ relativeAge(row.lastActivityAt, now) }}</time>
            </span>
            <span class="jr-row-line"><span class="jr-row-detail">{{ taskTitle(agentTask(row)) || row.headline || row.purpose }}</span></span>
          </span>
        </component>
      </template>
      <button v-if="quietCount" type="button" class="jr-row jr-quiet" :aria-current="quietOpen ? 'true' : undefined" @click="$emit('quiet')">
        <Icon icon="tabler:moon" aria-hidden="true" />
        <span class="jr-row-title">{{ quietCount }} gone quiet</span>
        <Icon icon="tabler:chevron-right" aria-hidden="true" />
      </button>
    </template>
  </div>
</template>
