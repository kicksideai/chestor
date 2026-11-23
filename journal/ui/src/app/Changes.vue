<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->

<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
import ChangeList from './ChangeList.vue'
import type { ChangeDay, ItemRef } from './attention'

/** What changed since the reader last looked, a day at a time. */
const props = defineProps<{
  days: ChangeDay[]
  fresh: number
  visited: boolean
  moreHistory: boolean
  taskTitle: (id?: string) => string
  now: number
}>()
defineEmits<{ open: [target: ItemRef] }>()

const PAGE = 40
const shown = ref(PAGE)
const total = computed(() => props.days.reduce((sum, day) => sum + day.entries.length, 0))
/** The first page, plus every new entry wherever it falls. */
const visible = computed(() => {
  let left = shown.value
  return props.days.flatMap(day => {
    const take = left
    left -= day.entries.length
    const entries = day.entries.filter((entry, index) => index < take || entry.fresh)
    return entries.length ? [{ day: day.day, entries }] : []
  })
})
const hasHidden = computed(() => visible.value.reduce((sum, day) => sum + day.entries.length, 0) < total.value)

const description = computed(() => {
  if (!total.value) return 'Facts agents and people record appear here.'
  if (!props.visited) return 'The latest facts recorded in this journal.'
  if (!props.fresh) return 'Nothing new since your last visit.'
  const count = props.fresh >= total.value && props.moreHistory ? `More than ${props.fresh}` : String(props.fresh)
  return `${count} new since your last visit.`
})
</script>

<template>
  <section class="jr-section" aria-labelledby="jr-changes">
    <SettingsSectionHead id="jr-changes" title="What changed" :description="description" />
    <EmptyState v-if="!total" icon="tabler:notes" title="No facts yet" hint="When an agent or a person records a fact in this journal, it shows up here." />
    <div v-for="day in visible" :key="day.day" class="jr-block">
      <h2>{{ day.day }}</h2>
      <ChangeList :entries="day.entries" :task-title="taskTitle" show-task :now="now" @open="$emit('open', $event)" />
    </div>
    <Button v-if="hasHidden" class="jr-more" label="Show older" severity="secondary" text size="small" @click="shown += PAGE" />
  </section>
</template>
