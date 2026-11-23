<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useHostVisibilityRefresh, useProps } from '@wippy-fe/webcomponent-vue'
import Message from 'primevue/message'
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import ListRail from '@kickside/ui-kit/ListRail.vue'
import ItemDetail from './ItemDetail.vue'
import Overview from './Overview.vue'
import SearchBox from './SearchBox.vue'
import WorkList from './WorkList.vue'
import { useJournal } from './useJournal'

interface Props { entryId?: string; mode?: string; readOnly?: boolean }

const props = useProps<Props>()
const entryId = computed(() => props.value?.entryId || '')
/** A side-panel preview has room for one column, so the list and the open item stack. */
const compact = computed(() => (props.value?.mode || 'preview') === 'preview')

const journal = useJournal(entryId)
const {
  loading, loaded, error, health, clock, seenSeq, eventsHasMore, tasksBounded,
  needs, working, days, fresh, agents, quiet, taskById,
  query, matchedTasks, matchedFacts, searching, searchError,
  selected, trail, detail, detailLoading, detailError,
  load, open, back, close, openAgent,
} = journal

useHostVisibilityRefresh(load)

const searchBox = ref<InstanceType<typeof SearchBox> | null>(null)
const degraded = computed(() => health.value.status === 'degraded')

function taskTitle(id?: string): string { return id ? taskById.value.get(id)?.title || '' : '' }

/** "/" finds, Escape closes the open item; typing in a field is left alone. */
function keydown(event: KeyboardEvent) {
  const target = event.composedPath()[0] as HTMLElement | undefined
  if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
  if (event.key === '/') { event.preventDefault(); searchBox.value?.focus() }
  else if (event.key === 'Escape' && selected.value) close()
}
onMounted(() => window.addEventListener('keydown', keydown))
onBeforeUnmount(() => window.removeEventListener('keydown', keydown))
</script>

<template>
  <div class="jr" :class="{ compact }">
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
          :searching="searching" :search-error="searchError" :selected="selected" :task-title="taskTitle" :now="clock"
          @open="open"
        />
      </ListRail>

      <main class="kx-main">
        <div class="kx-main-scroll">
          <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>
          <Message v-if="degraded" severity="warn" :closable="false">
            This journal is behind on processing new facts{{ health.reasons?.length ? `: ${health.reasons.join(', ')}` : '' }}. What you see may be out of date.
          </Message>
          <Message v-if="tasksBounded" severity="secondary" :closable="false">
            This journal holds more tasks than the page reads at once; search and counts cover the first {{ taskById.size.toLocaleString() }}.
          </Message>

          <ItemDetail
            v-if="selected"
            :detail="detail" :loading="detailLoading" :error="detailError" :can-back="trail.length > 0"
            :task-title="taskTitle" :now="clock"
            @open="target => open(target, true)" @back="back" @close="close"
          />
          <template v-else>
            <template v-if="compact">
              <SearchBox ref="searchBox" v-model="query" />
              <WorkList
                :needs="needs" :working="working" :query="query" :matched-tasks="matchedTasks" :matched-facts="matchedFacts"
                :searching="searching" :search-error="searchError" :selected="selected" :task-title="taskTitle" :now="clock"
                @open="open"
              />
            </template>
            <Overview
              v-if="!compact || !query.trim()"
              :days="days" :fresh="fresh" :visited="seenSeq !== null" :more-history="eventsHasMore"
              :agents="agents" :quiet="quiet" :task-title="taskTitle" :now="clock"
              @open="open" @agent="openAgent"
            />
          </template>
        </div>
      </main>
    </div>
  </div>
</template>
