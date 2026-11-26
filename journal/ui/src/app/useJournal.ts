import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import type { ComputedRef } from 'vue'
import { on } from '@wippy-fe/proxy'
import { JournalApi } from './api'
import { agentTaskId, groupByLiveness, mergeAgents } from './agents'
import { changeDays, freshCount, inProgress, matchTasks, needsYou } from './attention'
import type { ItemRef } from './attention'
import { isMeaningful } from './facts'
import { dormantPrograms } from './staleness'
import type { BranchView, HealthState, JournalCursor, JournalEvent, JournalTask, WorkControlState, WorkSpan } from './types'

const EMPTY_CONTROL: WorkControlState = {
  now: 0, leases: [], resumable: [], counts: { active: 0, write: 0, planning: 0, resumable: 0 }, limit: 100, has_more: false,
}

/** The newest fact this browser has shown for one journal. */
function seenKey(journalId: string) { return `chestor.journal.seen:${journalId}` }

function readSeen(journalId: string): number | null {
  try {
    const value = Number(localStorage.getItem(seenKey(journalId)))
    return Number.isFinite(value) && value > 0 ? value : null
  } catch { return null }
}

function writeSeen(journalId: string, seq: number) {
  try { if (seq > 0) localStorage.setItem(seenKey(journalId), String(seq)) } catch { /* Private windows keep no visit marker. */ }
}

export type Detail =
  | { kind: 'task'; branch: BranchView }
  | { kind: 'fact'; event: JournalEvent }

function message(cause: unknown, fallback: string): string {
  return cause instanceof Error ? cause.message : fallback
}

export function useJournal(entryId: ComputedRef<string>) {
  const client = computed(() => new JournalApi(entryId.value))

  const tasks = shallowRef<JournalTask[]>([])
  const tasksBounded = ref(false)
  const events = shallowRef<JournalEvent[]>([])
  const eventsHasMore = ref(false)
  const control = shallowRef<WorkControlState>(EMPTY_CONTROL)
  const cursors = shallowRef<JournalCursor[]>([])
  const spans = shallowRef<WorkSpan[]>([])
  const health = ref<HealthState>({ status: 'unknown' })
  const loading = ref(true)
  const loaded = ref(false)
  const error = ref('')
  /** The visit marker this page opened with; facts past it are new to the reader. */
  const seenSeq = ref<number | null>(null)
  const clock = ref(Math.floor(Date.now() / 1000))

  const query = ref('')
  const matchedFacts = shallowRef<JournalEvent[]>([])
  const searching = ref(false)
  const searchError = ref('')

  const selected = ref<ItemRef | null>(null)
  /** The items the reader followed links from, so back returns to them. */
  const trail = ref<ItemRef[]>([])
  const detail = shallowRef<Detail | null>(null)
  const detailLoading = ref(false)
  const detailError = ref('')

  let searchTimer: ReturnType<typeof setTimeout> | undefined
  let clockTimer: ReturnType<typeof setInterval> | undefined
  let refreshTimer: ReturnType<typeof setInterval> | undefined
  let searchGeneration = 0
  let detailGeneration = 0
  let readGeneration = 0

  const needs = computed(() => needsYou(tasks.value, events.value, control.value, clock.value))
  const taskById = computed(() => new Map(tasks.value.map(task => [task.id, task])))
  function taskTitle(id?: string): string { return id ? taskById.value.get(id)?.title || '' : '' }
  const working = computed(() => inProgress(control.value, needs.value, taskTitle))
  const days = computed(() => changeDays(events.value, seenSeq.value, clock.value))
  const fresh = computed(() => freshCount(days.value))
  const agentRows = computed(() => mergeAgents(cursors.value, spans.value, clock.value))
  const agents = computed(() => groupByLiveness(agentRows.value))
  const agentTasks = computed(() => {
    const factTasks = new Map(events.value.map(event => [event.id, event.task_id]))
    return new Map(agentRows.value.map(row => [row.id, agentTaskId(row, factTasks)]))
  })
  const quiet = computed(() => dormantPrograms(tasks.value, clock.value))
  const matchedTasks = computed(() => matchTasks(tasks.value, query.value))

  async function read(generation: number) {
    const [state, tree, status] = await Promise.all([client.value.state(), client.value.tasks(), client.value.health()])
    if (generation !== readGeneration) return
    tasks.value = tree.tasks
    tasksBounded.value = tree.bounded
    events.value = state.events || []
    eventsHasMore.value = state.event_page?.has_more === true
    control.value = state.work_control || EMPTY_CONTROL
    cursors.value = state.cursors?.items || []
    spans.value = state.spans?.items || []
    health.value = status
    if (!loaded.value) seenSeq.value = readSeen(entryId.value)
    writeSeen(entryId.value, state.stats?.last_seq || 0)
    loaded.value = true
  }

  async function load() {
    const generation = ++readGeneration
    if (!entryId.value) {
      error.value = 'Journal entry id is required.'
      loading.value = false
      return
    }
    loading.value = true
    try {
      await read(generation)
      if (generation === readGeneration) error.value = ''
    } catch (cause) {
      if (generation === readGeneration) error.value = message(cause, 'Couldn’t read this journal.')
    } finally {
      if (generation === readGeneration) loading.value = false
    }
  }

  /** A live update keeps the last good view when a read fails; the next signal retries. */
  async function refresh() {
    if (!entryId.value || loading.value) return
    const generation = ++readGeneration
    try {
      await read(generation)
      if (generation === readGeneration && selected.value?.kind === 'task') await openDetail(selected.value, true)
    } catch { /* The next projection signal or tick retries. */ }
  }

  /** The facts on screen when an item was opened; one of them opens without another read. */
  let shownFacts: JournalEvent[] = []
  function knownFact(id: string): JournalEvent | undefined {
    return shownFacts.find(event => event.id === id)
  }
  function holdShownFacts() {
    shownFacts = [...events.value, ...matchedFacts.value, ...(detail.value?.kind === 'task' ? detail.value.branch.facts : [])]
  }

  async function openDetail(target: ItemRef, quietly = false) {
    const generation = ++detailGeneration
    if (!quietly) { detailLoading.value = true; detailError.value = '' }
    try {
      let value: Detail
      if (target.kind === 'task') {
        value = { kind: 'task', branch: await client.value.branch(target.id) }
      } else {
        value = { kind: 'fact', event: knownFact(target.id) || await client.value.event(target.id) }
      }
      if (generation !== detailGeneration) return
      detail.value = value
      detailError.value = ''
    } catch (cause) {
      if (generation === detailGeneration && !quietly) detailError.value = message(cause, 'Couldn’t open this item.')
    } finally {
      if (generation === detailGeneration) detailLoading.value = false
    }
  }

  /** Opens an item from a list; following a link inside an open item keeps the way back. */
  function open(target: ItemRef, follow = false) {
    trail.value = follow && selected.value ? [...trail.value, selected.value] : []
    holdShownFacts()
    selected.value = target
    detail.value = null
    void openDetail(target)
  }

  function back() {
    const previous = trail.value[trail.value.length - 1]
    if (!previous) return
    trail.value = trail.value.slice(0, -1)
    holdShownFacts()
    selected.value = previous
    detail.value = null
    void openDetail(previous)
  }

  function close() {
    detailGeneration++
    trail.value = []
    selected.value = null
    detail.value = null
    detailError.value = ''
    detailLoading.value = false
  }

  async function search() {
    const text = query.value.trim()
    const generation = ++searchGeneration
    if (!text) { matchedFacts.value = []; searching.value = false; searchError.value = ''; return }
    searching.value = true
    try {
      const found = await client.value.recall(text)
      if (generation !== searchGeneration) return
      matchedFacts.value = found.filter(isMeaningful)
      searchError.value = ''
    } catch (cause) {
      if (generation === searchGeneration) { matchedFacts.value = []; searchError.value = message(cause, 'Search failed.') }
    } finally {
      if (generation === searchGeneration) searching.value = false
    }
  }

  watch(query, () => {
    searchGeneration++
    clearTimeout(searchTimer)
    searchTimer = setTimeout(search, 300)
  })
  watch(entryId, () => {
    loaded.value = false
    tasks.value = []
    events.value = []
    control.value = EMPTY_CONTROL
    spans.value = []
    cursors.value = []
    matchedFacts.value = []
    shownFacts = []
    searchGeneration++
    query.value = ''
    searchError.value = ''
    searching.value = false
    close()
    void load()
  })

  onMounted(() => {
    watch(entryId, (id, _, onCleanup) => {
      if (id) onCleanup(on(`kickside.thread.${id}.projection.chestor.journal:state`, () => { void refresh() }))
    }, { immediate: true })
    refreshTimer = setInterval(refresh, 15000)
    clockTimer = setInterval(() => { clock.value = Math.floor(Date.now() / 1000) }, 30000)
  })
  onBeforeUnmount(() => {
    clearTimeout(searchTimer)
    if (refreshTimer) clearInterval(refreshTimer)
    if (clockTimer) clearInterval(clockTimer)
    readGeneration++
    searchGeneration++
    detailGeneration++
  })

  return {
    tasks, tasksBounded, events, eventsHasMore, health, loading, loaded, error, clock, seenSeq,
    needs, working, days, fresh, agents, agentTasks, quiet, taskById, taskTitle,
    query, matchedTasks, matchedFacts, searching, searchError,
    selected, trail, detail, detailLoading, detailError,
    load, refresh, open, back, close,
  }
}
