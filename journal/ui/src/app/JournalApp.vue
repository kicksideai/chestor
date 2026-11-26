<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useHostVisibilityRefresh, useProps } from '@wippy-fe/webcomponent-vue'
import Message from 'primevue/message'
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import ListRail from '@kickside/ui-kit/ListRail.vue'
import Changes from './Changes.vue'
import ItemDetail from './ItemDetail.vue'
import QuietList from './QuietList.vue'
import SearchBox from './SearchBox.vue'
import WorkList from './WorkList.vue'
import { useJournal } from './useJournal'

interface Props { entryId?: string; mode?: string; readOnly?: boolean }

/** Below this frame width the list and the reader take turns instead of sharing the row. */
const TWO_COLUMNS_MIN = 760

const props = useProps<Props>()
const entryId = computed(() => props.value?.entryId || '')
const root = ref<HTMLElement | null>(null)
const width = ref(Number.POSITIVE_INFINITY)
/** A side-panel preview or a narrow frame has room for one column. */
const compact = computed(() => (props.value?.mode || 'preview') === 'preview' || width.value < TWO_COLUMNS_MIN)

const journal = useJournal(entryId)
const {
  loading, loaded, error, health, clock, seenSeq, eventsHasMore, tasksBounded,
  needs, working, days, fresh, agents, agentTasks, quiet, taskById, taskTitle,
  query, matchedTasks, matchedFacts, searching, searchError,
  selected, trail, detail, detailLoading, detailError,
  load, open, back, close,
} = journal

useHostVisibilityRefresh(load)

const searchBox = ref<InstanceType<typeof SearchBox> | null>(null)
const degraded = computed(() => health.value.status === 'degraded')
const quietOpen = ref(false)

/** The quiet list opens over the changes; pressed again with nothing open, it closes. */
function toggleQuiet() {
  quietOpen.value = selected.value ? true : !quietOpen.value
  close()
}

/** "/" finds, Escape closes the open item; typing in a field is left alone. */
function keydown(event: KeyboardEvent) {
  const target = event.composedPath()[0] as HTMLElement | undefined
  if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
  if (event.key === '/') {
    if (searchBox.value) {
      event.preventDefault()
      searchBox.value.focus()
    } else if (compact.value && (selected.value || quietOpen.value)) {
      event.preventDefault()
      close()
      quietOpen.value = false
      void nextTick(() => searchBox.value?.focus())
    }
  } else if (event.key === 'Escape' && selected.value) close()
}

let observer: ResizeObserver | undefined
onMounted(() => {
  window.addEventListener('keydown', keydown)
  if (typeof ResizeObserver === 'undefined' || !root.value) return
  observer = new ResizeObserver(entries => { width.value = entries[0]?.contentRect.width || width.value })
  observer.observe(root.value)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', keydown)
  observer?.disconnect()
})
</script>

<template>
  <div ref="root" class="jr" :class="{ compact }">
    <div v-if="!loaded && loading" class="kx-loading kx-loading-centered">
      <div class="kx-loading-inner"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Opening the journal…</div>
    </div>
    <EmptyState v-else-if="!loaded" icon="tabler:alert-triangle" title="Journal is unavailable"
      :hint="error" cta="Try again" cta-icon="tabler:refresh" @cta="load" />

    <div v-else class="kx-shell jr-shell">
      <ListRail v-if="!compact" title="Journal">
        <template #toolbar><div class="jr-rail-search"><SearchBox ref="searchBox" v-model="query" /></div></template>
        <WorkList
          :needs="needs" :working="working" :query="query" :matched-tasks="matchedTasks" :matched-facts="matchedFacts"
          :searching="searching" :search-error="searchError" :agents="agents.now" :agent-tasks="agentTasks"
          :quiet-count="quiet.length" :quiet-open="quietOpen && !selected"
          :selected="selected" :task-title="taskTitle" :now="clock"
          @open="open" @quiet="toggleQuiet"
        />
      </ListRail>

      <main class="kx-main">
        <div class="kx-main-scroll">
          <div class="jr-reader">
            <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>
            <Message v-if="degraded" severity="warn" :closable="false">
              This journal is behind on processing new facts{{ health.reasons?.length ? `: ${health.reasons.join(', ')}` : '' }}. What you see may be out of date.
            </Message>
            <Message v-if="tasksBounded" severity="secondary" :closable="false">
              This journal holds more tasks than the page reads at once; search and counts cover the first {{ taskById.size.toLocaleString() }}.
            </Message>

            <ItemDetail
              v-if="selected"
              :detail="detail" :loading="detailLoading" :error="detailError" :can-back="trail.length > 0" :compact="compact"
              :task-title="taskTitle" :now="clock"
              @open="target => open(target, true)" @back="back" @close="close"
            />
            <QuietList v-else-if="quietOpen" :quiet="quiet" :now="clock" @open="open" @close="quietOpen = false" />
            <template v-else>
              <template v-if="compact">
                <SearchBox ref="searchBox" v-model="query" />
                <WorkList
                  :needs="needs" :working="working" :query="query" :matched-tasks="matchedTasks" :matched-facts="matchedFacts"
                  :searching="searching" :search-error="searchError" :agents="agents.now" :agent-tasks="agentTasks"
                  :quiet-count="quiet.length" :quiet-open="false"
                  :selected="selected" :task-title="taskTitle" :now="clock"
                  @open="open" @quiet="toggleQuiet"
                />
              </template>
              <Changes
                v-if="!compact || !query.trim()"
                :days="days" :fresh="fresh" :visited="seenSeq !== null" :more-history="eventsHasMore"
                :task-title="taskTitle" :now="clock"
                @open="open"
              />
            </template>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
