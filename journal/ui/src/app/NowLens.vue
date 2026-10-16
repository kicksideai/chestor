<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { agentIdentity } from './presence'
import { relativeAge } from './assembly'
import { ageOf, dormantSubtrees, isEnded, splitByActivity } from './staleness'
import { kindColor, nodeFamily } from './force-layout'
import type { JournalEvent, JournalTask, WorkControlState, WorkSpan } from './types'

/**
 * What is happening in this journal right now: which agents have an open
 * activity span, who actually holds mutation authority, which tasks are open
 * or blocked, and the facts that changed the picture.
 * Everything here is current by construction — the settled and the dormant are
 * counted and named, and reached through the lenses that own them.
 */
const props = defineProps<{
  spans: WorkSpan[]
  workControl: WorkControlState
  tasks: JournalTask[]
  events: JournalEvent[]
  now: number
  spanCounts: { open: number; sealed: number; total: number }
  /** How much of the journal's task list this read actually carries. */
  taskBound: { loaded: number; total: number; hasMore: boolean }
}>()
const emit = defineEmits<{ task: [id: string]; agent: [agentId: string]; stale: [] }>()

/** The kinds that change what a reader believes, rather than narrating work. */
const SIGNIFICANT = /^(milestone|decision|blocker|finding|risk|contradiction|acceptance|reflection)$/i

const openSpans = computed(() => props.spans
  .filter(span => span.state === 'open')
  .sort((a, b) => b.last_activity_at - a.last_activity_at))

/**
 * The open work this journal holds. It is read from the projection alone, so the
 * reading clock decides how old a task is and never which tasks there are — and
 * the list keeps its identity between ticks, so the shape read over it is taken
 * once per projection rather than once per tick.
 */
const openWork = computed(() => props.tasks.filter(task => !isEnded(task.status)))
const split = computed(() => splitByActivity(openWork.value, props.now))
const inProgress = computed(() => split.value.worked
  .filter(task => task.status !== 'blocked')
  .sort((a, b) => b.updated_at - a.updated_at))
const blocked = computed(() => props.tasks
  .filter(task => task.status === 'blocked')
  .sort((a, b) => b.updated_at - a.updated_at))
/**
 * The programs the review offers to settle: dormant work grouped under the
 * task it hangs from, so the count is a number of judgements rather than a
 * number of rows.
 */
const dormant = computed(() => {
  const byId = new Map(props.tasks.map(task => [task.id, task]))
  const roots = new Set<string>()
  for (const subtree of dormantSubtrees(props.tasks, props.now)) {
    let current = byId.get(subtree.root.id)
    const seen = new Set<string>()
    while (current?.parent_task_id && byId.has(current.parent_task_id) && !seen.has(current.id)) {
      seen.add(current.id)
      current = byId.get(current.parent_task_id)
    }
    roots.add(current?.id || subtree.root.id)
  }
  return [...roots]
})

const significant = computed(() => props.events
  .filter(event => SIGNIFICANT.test(event.event_type))
  .sort((a, b) => b.seq - a.seq)
  .slice(0, 24))

function who(span: WorkSpan): string {
  return agentIdentity(span.agent_id || span.cursor_id || '').label
}
function initials(span: WorkSpan): string {
  return agentIdentity(span.agent_id || span.cursor_id || '').initials
}
function working(span: WorkSpan): string {
  return span.working_on?.text || span.last_fact?.title || 'Open activity span'
}
function expiresIn(expiresAt: number): string {
  const seconds = Math.max(0, Math.floor(expiresAt - props.now))
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.ceil(seconds / 60)}m`
  return `${Math.ceil(seconds / 3600)}h`
}
</script>

<template>
  <section class="jr-now" aria-label="What is happening now">
    <div class="jr-lens-meta">
      <span class="jr-lens-title">Now</span>
      <span class="jr-lens-facts">
        <b class="jr-numeric">{{ openSpans.length }}</b> open span{{ openSpans.length === 1 ? '' : 's' }}
        <i aria-hidden="true"></i>
        <b class="jr-numeric">{{ workControl.counts.active }}</b> active lease{{ workControl.counts.active === 1 ? '' : 's' }}
        <i aria-hidden="true"></i>
        <b class="jr-numeric">{{ blocked.length }}</b> blocked
        <i aria-hidden="true"></i>
        <b class="jr-numeric">{{ dormant.length }}</b> dormant program{{ dormant.length === 1 ? '' : 's' }}
      </span>
      <span v-if="taskBound.hasMore" class="jr-lens-bound" :title="`The journal task read returns one page; ${(taskBound.total - taskBound.loaded).toLocaleString()} more tasks exist and this view does not count them`">
        <Icon icon="tabler:alert-circle" aria-hidden="true" />
        counted over {{ taskBound.loaded.toLocaleString() }} of {{ taskBound.total.toLocaleString() }} tasks
      </span>
      <button v-if="dormant.length" class="jr-lens-advice" title="Review the work nothing has touched for days" @click="emit('stale')">
        <Icon icon="tabler:archive" aria-hidden="true" />
        Review {{ dormant.length }} dormant
      </button>
    </div>

    <div class="jr-now-grid">
      <section class="jr-now-block wide" aria-label="Mutation authority">
        <h3>
          <Icon icon="tabler:key" aria-hidden="true" />
          Authority
          <em class="jr-numeric">{{ workControl.counts.active }} live · {{ workControl.counts.resumable }} resumable</em>
        </h3>
        <p v-if="!workControl.leases.length && !workControl.resumable.length" class="jr-empty-small">
          No mutation lease is active and no started task is waiting to be resumed.
        </p>
        <button
          v-for="lease in workControl.leases" :key="lease.lease_id"
          :class="['jr-now-task', 'jr-authority-row', { planning: lease.capability === 'PLANNING' }]"
          @click="emit('task', lease.task_id)"
        >
          <span :class="['jr-state-chip', lease.capability === 'WRITE' ? 'state-in_progress' : 'state-blocked']">
            {{ lease.capability === 'WRITE' ? 'write' : 'planning' }}
          </span>
          <span class="jr-now-copy">
            <b>{{ lease.task_title || 'Untitled task' }}</b>
            <small>{{ agentIdentity(lease.agent_id).label }} · {{ lease.task_status || 'unknown task state' }}</small>
          </span>
          <time class="jr-numeric">expires in {{ expiresIn(lease.expires_at) }}</time>
        </button>
        <button
          v-for="task in workControl.resumable" :key="`resume:${task.task_id}`"
          class="jr-now-task jr-authority-row resumable" @click="emit('task', task.task_id)"
        >
          <span class="jr-state-chip state-open">resume</span>
          <span class="jr-now-copy">
            <b>{{ task.task_title || 'Untitled task' }}</b>
            <small>No live lease · open this branch to continue in place</small>
          </span>
          <time v-if="task.task_updated_at" class="jr-numeric">{{ relativeAge(task.task_updated_at, now) }}</time>
        </button>
        <p v-if="workControl.has_more" class="jr-empty-small">More authority rows exist beyond this bounded control view.</p>
      </section>

      <section class="jr-now-block" aria-label="Open work spans">
        <h3>
          <Icon icon="tabler:activity-heartbeat" aria-hidden="true" />
          Open spans
          <em class="jr-numeric">{{ spanCounts.open || openSpans.length }}</em>
        </h3>
        <p v-if="!openSpans.length" class="jr-empty-small">No identity has an open activity span.</p>
        <button
          v-for="span in openSpans" :key="span.span_id"
          class="jr-now-span" @click="emit('agent', span.agent_id || span.cursor_id || '')"
        >
          <span class="jr-avatar">{{ initials(span) }}</span>
          <span class="jr-now-copy">
            <b>{{ who(span) }}</b>
            <small>{{ working(span) }}</small>
            <small v-if="span.last_fact?.title" class="jr-now-fact">
              <Icon icon="tabler:point" aria-hidden="true" />{{ span.last_fact.title }}
            </small>
          </span>
          <span class="jr-now-meta">
            <time class="jr-numeric">{{ relativeAge(span.last_activity_at, now) }}</time>
            <em class="jr-numeric">{{ span.fact_count || 0 }} fact{{ span.fact_count === 1 ? '' : 's' }}</em>
          </span>
        </button>
      </section>

      <section class="jr-now-block" aria-label="Open tasks">
        <h3>
          <Icon icon="tabler:checkbox" aria-hidden="true" />
          Open work
          <em class="jr-numeric">{{ inProgress.length + blocked.length }}</em>
        </h3>
        <p v-if="!inProgress.length && !blocked.length" class="jr-empty-small">Nothing is open in this journal.</p>
        <button
          v-for="task in blocked" :key="task.id"
          class="jr-now-task blocked" @click="emit('task', task.id)"
        >
          <span class="jr-state-chip state-blocked">blocked</span>
          <span class="jr-now-copy"><b>{{ task.title }}</b><small v-if="task.description">{{ task.description }}</small></span>
          <time class="jr-numeric" :class="ageOf(task.updated_at, now).tier">{{ ageOf(task.updated_at, now).label }}</time>
        </button>
        <button
          v-for="task in inProgress" :key="task.id"
          class="jr-now-task" @click="emit('task', task.id)"
        >
          <span :class="['jr-state-chip', `state-${task.status}`]">{{ task.status.replace(/_/g, ' ') }}</span>
          <span class="jr-now-copy"><b>{{ task.title }}</b><small v-if="task.description">{{ task.description }}</small></span>
          <time class="jr-numeric" :class="ageOf(task.updated_at, now).tier">{{ ageOf(task.updated_at, now).label }}</time>
        </button>
      </section>

      <section class="jr-now-block wide" aria-label="Recent significant facts">
        <h3>
          <Icon icon="tabler:sparkles" aria-hidden="true" />
          What changed
          <em class="jr-numeric">{{ significant.length }}</em>
        </h3>
        <p v-if="!significant.length" class="jr-empty-small">
          Nothing decided, finished or blocked in the facts this journal has published so far.
        </p>
        <ol v-else class="jr-now-facts">
          <li v-for="event in significant" :key="event.id">
            <span class="jr-now-dot" :style="{ background: kindColor(event.event_type) }" aria-hidden="true"></span>
            <span :class="['jr-eyebrow', `family-${nodeFamily(event.event_type)}`]">{{ event.event_type.replace(/_/g, ' ') }}</span>
            <b>{{ event.title || event.body || 'Journal entry' }}</b>
            <time class="jr-numeric">{{ relativeAge(event.ts, now) }}</time>
          </li>
        </ol>
      </section>
    </div>
  </section>
</template>
