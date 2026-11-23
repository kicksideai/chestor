<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->

<script setup lang="ts">
import { computed, ref } from 'vue'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
import ItemRow from './ItemRow.vue'
import { agentIdentity } from './agents'
import type { LivenessGroups } from './agents'
import type { ChangeDay, ItemRef } from './attention'
import { kindLabel, kindSeverity, relativeAge } from './format'
import { DORMANT_AFTER_S } from './staleness'
import type { DormantProgram } from './staleness'

/** What changed since the reader last looked, who is at work, and what went quiet. */
const props = defineProps<{
  days: ChangeDay[]
  fresh: number
  visited: boolean
  moreHistory: boolean
  agents: LivenessGroups
  agentTasks: Map<string, string>
  quiet: DormantProgram[]
  taskTitle: (id?: string) => string
  now: number
}>()
const emit = defineEmits<{ open: [target: ItemRef] }>()

const PAGE = 40
const shown = ref(PAGE)
const total = computed(() => props.days.reduce((sum, day) => sum + day.events.length, 0))
const visible = computed(() => {
  let left = shown.value
  return props.days.flatMap(day => {
    const take = left
    left -= day.events.length
    const events = day.events.filter((event, index) => index < take || event.fresh)
    return events.length ? [{ day: day.day, events }] : []
  })
})
const hasHidden = computed(() => visible.value.reduce((sum, day) => sum + day.events.length, 0) < total.value)
const quietDays = Math.round(DORMANT_AFTER_S / 86400)
const active = computed(() => [...props.agents.now, ...props.agents.today])

const description = computed(() => {
  if (!total.value) return 'Facts agents and people record appear here.'
  if (!props.visited) return 'The latest facts recorded in this journal.'
  if (!props.fresh) return 'Nothing new since your last visit.'
  const count = props.fresh >= total.value && props.moreHistory ? `More than ${props.fresh}` : String(props.fresh)
  return `${count} new since your last visit.`
})

function detail(actor: string | undefined, taskId: string | undefined): string {
  return [agentIdentity(actor || '').label, props.taskTitle(taskId)].filter(Boolean).join(' · ')
}

function openAgent(id: string) {
  const taskId = props.agentTasks.get(id)
  if (taskId) emit('open', { kind: 'task', id: taskId })
}
</script>

<template>
  <section class="jr-section" aria-labelledby="jr-changes">
    <SettingsSectionHead id="jr-changes" title="What changed" :description="description" />
    <EmptyState v-if="!total" icon="tabler:notes" title="No facts yet" hint="When an agent or a person records a fact in this journal, it shows up here." />
    <div v-for="day in visible" :key="day.day" class="jr-day">
      <div class="kx-settings-rail-group">{{ day.day }}</div>
      <ItemRow
        v-for="event in day.events" :key="event.id"
        :title="event.title || event.body || 'Untitled'" :detail="detail(event.actor_id, event.task_id)"
        :at="event.ts" :now="now" :tag="kindLabel(event.event_type)" :severity="kindSeverity(event.event_type)"
        :fresh="event.fresh"
        @open="$emit('open', { kind: 'fact', id: event.id })"
      />
    </div>
    <Button v-if="hasHidden" class="jr-more" label="Show older" severity="secondary" text size="small" @click="shown += PAGE" />
  </section>

  <section class="jr-section" aria-labelledby="jr-agents">
    <SettingsSectionHead id="jr-agents" title="Agents"
      :description="active.length ? `${agents.now.length} working in the last hour, ${agents.today.length} earlier today.` : 'No agent has written here today.'" />
    <component v-for="row in active" :key="row.id" :is="agentTasks.get(row.id) ? 'button' : 'div'"
      :type="agentTasks.get(row.id) ? 'button' : undefined" class="jr-row jr-agent" @click="openAgent(row.id)">
      <Avatar :label="row.initials" shape="circle" class="jr-avatar" :class="{ working: row.working }" />
      <span class="jr-row-main">
        <span class="jr-row-line">
          <span class="jr-row-title">{{ row.label }}</span>
          <time class="jr-row-time">{{ relativeAge(row.lastActivityAt, now) }}</time>
        </span>
        <span class="jr-row-line"><span class="jr-row-detail">{{ row.headline || row.purpose }}</span></span>
      </span>
    </component>
    <Disclosure v-if="agents.older.length" :label="`Earlier (${agents.older.length})`">
      <component v-for="row in agents.older" :key="row.id" :is="agentTasks.get(row.id) ? 'button' : 'div'"
        :type="agentTasks.get(row.id) ? 'button' : undefined" class="jr-row jr-agent" @click="openAgent(row.id)">
        <Avatar :label="row.initials" shape="circle" class="jr-avatar" />
        <span class="jr-row-main">
          <span class="jr-row-line">
            <span class="jr-row-title">{{ row.label }}</span>
            <time class="jr-row-time">{{ relativeAge(row.lastActivityAt, now) }}</time>
          </span>
          <span class="jr-row-line"><span class="jr-row-detail">{{ row.purpose }}</span></span>
        </span>
      </component>
    </Disclosure>
  </section>

  <section v-if="quiet.length" class="jr-section" aria-label="Gone quiet">
    <Disclosure :label="`Gone quiet (${quiet.length})`">
      <p class="jr-note">Open work nothing has touched for {{ quietDays }} days or more. Ask an agent to settle it after reading its history.</p>
      <ItemRow
        v-for="program in quiet" :key="program.root.id"
        :title="program.root.title" :detail="`${program.open} open of ${program.tasks} tasks`"
        :at="program.lastActivityAt" :now="now"
        @open="$emit('open', { kind: 'task', id: program.root.id })"
      />
    </Disclosure>
  </section>
</template>
