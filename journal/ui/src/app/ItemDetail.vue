<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import Tag from 'primevue/tag'
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
import ItemRow from './ItemRow.vue'
import { agentIdentity } from './agents'
import type { ItemRef } from './attention'
import { absoluteTime, kindLabel, kindSeverity, relativeAge, statusLabel, statusSeverity } from './format'
import type { Detail } from './useJournal'

/** One item: a task with its place, links and history, or one fact with its task. */
const props = defineProps<{
  detail: Detail | null
  loading: boolean
  error: string
  canBack: boolean
  taskTitle: (id?: string) => string
  now: number
}>()
const emit = defineEmits<{ open: [target: ItemRef]; back: []; close: [] }>()

const branch = computed(() => props.detail?.kind === 'task' ? props.detail.branch : null)
const fact = computed(() => props.detail?.kind === 'fact' ? props.detail.event : null)
const task = computed(() => branch.value?.task || null)

const waitingOn = computed(() => (branch.value?.deps?.incoming || []).filter(dep => dep.kind === 'blocks').map(dep => dep.from_task_id))
const holdsUp = computed(() => (branch.value?.deps?.outgoing || []).filter(dep => dep.kind === 'blocks').map(dep => dep.to_task_id))
const related = computed(() => [
  ...(branch.value?.deps?.outgoing || []).filter(dep => dep.kind !== 'blocks').map(dep => ({ id: dep.to_task_id, kind: dep.kind })),
  ...(branch.value?.deps?.incoming || []).filter(dep => dep.kind !== 'blocks').map(dep => ({ id: dep.from_task_id, kind: dep.kind })),
])

const title = computed(() => task.value?.title || fact.value?.title || fact.value?.body?.slice(0, 120) || 'Untitled')
const description = computed(() => {
  if (task.value) {
    const parts = [statusLabel(task.value.status), `updated ${relativeAge(task.value.updated_at, props.now)}`]
    return parts.join(' · ')
  }
  if (fact.value) return `${kindLabel(fact.value.event_type)} by ${agentIdentity(fact.value.actor_id || '').label} · ${absoluteTime(fact.value.ts)}`
  return ''
})
const summary = computed(() => task.value?.description || task.value?.digest || '')
const lifecycle = computed(() => {
  const state = String(fact.value?.effective_state || fact.value?.lifecycle || 'active').toLowerCase()
  return state === 'active' ? '' : statusLabel(state)
})

function follow(target: ItemRef) { emit('open', target) }
</script>

<template>
  <article class="jr-detail" aria-live="polite">
    <SettingsSectionHead :title="loading && !detail ? 'Opening…' : title" :description="loading && !detail ? '' : description">
      <template #actions>
        <button v-if="canBack" type="button" class="kx-iconbtn" aria-label="Back" title="Back" @click="emit('back')">
          <Icon icon="tabler:arrow-left" aria-hidden="true" />
        </button>
        <button type="button" class="kx-iconbtn" aria-label="Close" title="Close" @click="emit('close')">
          <Icon icon="tabler:x" aria-hidden="true" />
        </button>
      </template>
    </SettingsSectionHead>

    <EmptyState v-if="error" icon="tabler:alert-triangle" title="This item could not be opened" :hint="error" />
    <div v-else-if="loading && !detail" class="kx-loading"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" /> Loading…</div>

    <template v-else-if="branch && task">
      <nav v-if="branch.ancestors.length" class="jr-path" aria-label="Part of">
        <template v-for="(item, index) in branch.ancestors" :key="item.id">
          <Icon v-if="index" icon="tabler:chevron-right" aria-hidden="true" />
          <button type="button" @click="follow({ kind: 'task', id: item.id })">{{ item.title }}</button>
        </template>
      </nav>
      <div class="jr-tags">
        <Tag :value="statusLabel(task.status)" :severity="statusSeverity(task.status)" class="kx-tag-sm" />
        <Tag v-if="task.work_kind" :value="statusLabel(task.work_kind)" severity="secondary" class="kx-tag-sm" />
      </div>
      <p v-if="summary" class="jr-body">{{ summary }}</p>

      <section v-if="waitingOn.length" class="jr-block">
        <h2>Waiting on</h2>
        <ItemRow v-for="id in waitingOn" :key="id" :title="taskTitle(id) || 'Untitled task'" :now="now" @open="follow({ kind: 'task', id })" />
      </section>
      <section v-if="holdsUp.length" class="jr-block">
        <h2>Holds up</h2>
        <ItemRow v-for="id in holdsUp" :key="id" :title="taskTitle(id) || 'Untitled task'" :now="now" @open="follow({ kind: 'task', id })" />
      </section>
      <section v-if="related.length" class="jr-block">
        <h2>Related</h2>
        <ItemRow v-for="item in related" :key="`${item.kind}:${item.id}`" :title="taskTitle(item.id) || 'Untitled task'" :tag="statusLabel(item.kind)" :now="now" @open="follow({ kind: 'task', id: item.id })" />
      </section>
      <section v-if="branch.children.length" class="jr-block">
        <h2>Parts <span class="kx-count">{{ branch.children.length }}</span></h2>
        <ItemRow
          v-for="child in branch.children" :key="child.id"
          :title="child.title" :at="child.updated_at" :now="now"
          :tag="statusLabel(child.status)" :severity="statusSeverity(child.status)"
          :detail="child.open_count ? `${child.open_count} open inside` : ''"
          @open="follow({ kind: 'task', id: child.id })"
        />
      </section>
      <section class="jr-block">
        <h2>History <span class="kx-count">{{ branch.facts.length }}</span></h2>
        <p v-if="!branch.facts.length" class="jr-list-empty">Nothing has been recorded on this task yet.</p>
        <ItemRow
          v-for="item in branch.facts" :key="item.id"
          :title="item.title || item.body || 'Untitled'" :detail="agentIdentity(item.actor_id || '').label"
          :at="item.ts" :now="now" :tag="kindLabel(item.event_type)" :severity="kindSeverity(item.event_type)"
          @open="follow({ kind: 'fact', id: item.id })"
        />
      </section>
    </template>

    <EmptyState v-else-if="branch" icon="tabler:file-unknown" title="This task is no longer in the journal" />

    <template v-else-if="fact">
      <div class="jr-tags">
        <Tag :value="kindLabel(fact.event_type)" :severity="kindSeverity(fact.event_type)" class="kx-tag-sm" />
        <Tag v-if="lifecycle" :value="lifecycle" severity="secondary" class="kx-tag-sm" />
        <Tag v-for="tag in fact.tags || []" :key="tag" :value="tag" severity="secondary" class="kx-tag-sm" />
      </div>
      <p v-if="fact.body && fact.body !== fact.title" class="jr-body">{{ fact.body }}</p>
      <section v-if="fact.task_id" class="jr-block">
        <h2>Task</h2>
        <ItemRow :title="taskTitle(fact.task_id) || 'Untitled task'" :now="now" @open="follow({ kind: 'task', id: fact.task_id })" />
      </section>
    </template>
  </article>
</template>
