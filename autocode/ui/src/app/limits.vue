<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import { host } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { autocode } from './api.ts'
import type { Limit } from './dto.ts'
import { serial, useAlive } from './live.ts'
import { errorText } from './presentation.ts'

const emit = defineEmits<{ saved: [] }>()
const alive = useAlive()
const limits = ref<Limit[]>([])
const drafts = ref<Record<string, string | number | null>>({})
const errors = ref<Record<string, string>>({})
const error = ref('')
const busy = ref('')
const loaded = ref(false)
const status = ref('')
const groups = computed(() => {
  const map = new Map<string, Limit[]>()
  for (const limit of [...limits.value].sort((a, b) => a.order - b.order)) {
    const group = map.get(limit.category) ?? []
    group.push(limit)
    map.set(limit.category, group)
  }
  return map
})

const load = serial(async () => {
  try {
    const current = await autocode.limits()
    if (!alive()) return
    if (!current.length) throw new Error('No Autocode limits were found.')
    const previous = new Map(limits.value.map(limit => [limit.key, limit.value]))
    for (const limit of current) {
      const draft = drafts.value[limit.key]
      if (draft === undefined || draft === previous.get(limit.key) || busy.value === limit.key) {
        drafts.value[limit.key] = limit.value
      }
    }
    limits.value = current
    loaded.value = true
    error.value = ''
  } catch (cause) {
    if (alive()) error.value = errorText(cause, 'Could not load limits.')
  }
}, alive)
useHostVisibilityRefresh(load)

async function save(limit: Limit, reset = false) {
  const value = reset ? null : drafts.value[limit.key]
  if (busy.value || (!reset && (value == null || value === '' || value === limit.value))) return
  busy.value = limit.key
  status.value = ''
  errors.value[limit.key] = ''
  try {
    if (limit.key === 'run_retention' && !await host.confirm({
      header: 'Change run retention?',
      message: 'Shorter retention can delete completed runs and their logs.',
      acceptLabel: 'Change retention',
      rejectLabel: 'Cancel',
    })) return
    if (!alive()) return
    await autocode.saveLimit(limit.key, value ?? null)
    if (!alive()) return
    await load()
    if (!alive()) return
    if (!error.value) status.value = reset ? `${limit.title} reset to default.` : `${limit.title} saved.`
    emit('saved')
  } catch (cause) {
    if (alive()) errors.value[limit.key] = errorText(cause, 'Could not save this limit.')
  } finally {
    if (alive()) busy.value = ''
  }
}
</script>

<template>
  <section class="ac-stack ac-limits" aria-labelledby="ac-limits-title">
    <div>
      <h2 id="ac-limits-title" class="ac-card-title">Limits</h2>
      <p class="ac-hint">These defaults apply to Autocode tasks. Enter durations like 30m or 2h.</p>
    </div>
    <p v-if="!loaded && !error" class="kx-loading" role="status">Loading limits…</p>
    <div v-if="error" class="kx-err" role="alert">{{ error }} <Button label="Retry" severity="secondary" text size="small" @click="load" /></div>
    <p v-if="status" class="ac-limit-status" role="status">{{ status }}</p>
    <section v-for="[category, fields] in groups" :key="category" class="ac-card ac-limit-group">
      <h3 class="ac-card-title">{{ category }}</h3>
      <form v-for="limit in fields" :key="limit.key" class="ac-limit-row" @submit.prevent="save(limit)">
        <div>
          <label :for="'ac-limit-' + limit.key" class="ac-strong">{{ limit.title }}</label>
          <p :id="'ac-limit-help-' + limit.key" class="ac-hint">{{ limit.description }}</p>
        </div>
        <div class="ac-limit-control">
          <InputNumber v-if="limit.value_type === 'int'" :input-id="'ac-limit-' + limit.key"
            :model-value="typeof drafts[limit.key] === 'number' ? Number(drafts[limit.key]) : null"
            :input-props="{ 'aria-describedby': 'ac-limit-help-' + limit.key }" :disabled="!!busy" fluid
            @input="drafts[limit.key] = typeof $event.value === 'number' ? $event.value : null"
            @update:model-value="drafts[limit.key] = $event" />
          <InputText v-else :id="'ac-limit-' + limit.key" :model-value="String(drafts[limit.key] ?? '')"
            :aria-describedby="'ac-limit-help-' + limit.key" :disabled="!!busy" fluid
            @update:model-value="drafts[limit.key] = $event ?? ''" />
          <p class="ac-hint">{{ limit.unit }} · {{ limit.overridden ? `Override · default ${limit.default}` : 'Default' }}</p>
        </div>
        <div class="ac-limit-actions">
          <Button v-if="drafts[limit.key] !== limit.value" type="submit" label="Save" size="small"
            :aria-label="'Save ' + limit.title" :disabled="!!busy || drafts[limit.key] == null || drafts[limit.key] === ''" />
          <Button v-if="limit.overridden" type="button" label="Reset" size="small" text severity="secondary"
            :aria-label="'Reset ' + limit.title + ' to default'" :disabled="!!busy" @click="save(limit, true)" />
        </div>
        <p v-if="errors[limit.key]" class="kx-err ac-limit-error" role="alert">{{ errors[limit.key] }}</p>
      </form>
    </section>
  </section>
</template>
