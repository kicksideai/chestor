<script setup lang="ts">
// The initiative editor. Every vocabulary is closed, so every one of them is a
// select; the period pickers are built from the roadmap's own period rules.
import { computed } from 'vue'
import ConfidenceMeter from './ConfidenceMeter.vue'
import { periodChoices, periodLongLabel } from './periods'
import type { Trace } from './trace'
import { CONFIDENCES, SIZES, STATUSES, type Initiative, type Layer, type Outcome, type RoadmapState } from './types'

const props = defineProps<{
  state: RoadmapState
  initiative: Initiative
  trace: Trace
  editable: boolean
}>()

const emit = defineEmits<{
  (e: 'patch', patch: Record<string, unknown>): void
  (e: 'select', kind: 'initiative', id: string): void
}>()

const kind = computed(() => props.state.settings.period_kind)
const periods = computed(() => periodChoices(props.state.settings.origin, props.state.settings.columns, kind.value))
const layers = computed<Layer[]>(() => props.state.layers)
const outcomes = computed<Outcome[]>(() => props.state.outcomes)

function titleOf(id: string): string {
  return props.state.initiatives.find(i => i.id === id)?.title || 'Unavailable initiative'
}

const needs = computed(() => [...props.trace.needs])
const unlocks = computed(() => [...props.trace.unlocks])

function patchText(event: Event, key: string) {
  emit('patch', { [key]: (event.target as HTMLInputElement | HTMLTextAreaElement).value })
}

function patchSelect(event: Event, key: string) {
  emit('patch', { [key]: (event.target as HTMLSelectElement).value })
}

function patchSpan(event: Event) {
  const value = Math.max(1, Math.round(Number((event.target as HTMLInputElement).value) || 1))
  emit('patch', { span: value })
}

function patchProgress(event: Event) {
  const value = Math.min(1, Math.max(0, Number((event.target as HTMLInputElement).value) / 100))
  emit('patch', { progress: value })
}

function patchTags(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  emit('patch', { tags: raw.split(',').map(t => t.trim()).filter(Boolean) })
}
</script>

<template>
  <div class="rm-form">
    <label class="rm-field">
      <span>Title</span>
      <input class="rm-input" type="text" :value="initiative.title" :disabled="!editable" @change="patchText($event, 'title')" />
    </label>

    <label class="rm-field">
      <span>Description</span>
      <textarea class="rm-input rm-input--area" rows="3" :value="initiative.description" :disabled="!editable" @change="patchText($event, 'description')"></textarea>
    </label>

    <div class="rm-field-row">
      <label class="rm-field">
        <span>Layer</span>
        <select class="rm-input" :value="initiative.layer_id" :disabled="!editable" @change="patchSelect($event, 'layer_id')">
          <option v-for="layer in layers" :key="layer.id" :value="layer.id">{{ layer.title }}</option>
        </select>
      </label>
      <label class="rm-field">
        <span>Outcome</span>
        <select class="rm-input" :value="initiative.outcome_id" :disabled="!editable" @change="patchSelect($event, 'outcome_id')">
          <option value="">— none —</option>
          <option v-for="outcome in outcomes" :key="outcome.id" :value="outcome.id">{{ outcome.title }}</option>
        </select>
      </label>
    </div>

    <div class="rm-field-row">
      <label class="rm-field">
        <span>Status</span>
        <select class="rm-input" :value="initiative.status" :disabled="!editable" @change="patchSelect($event, 'status')">
          <option v-for="status in STATUSES" :key="status" :value="status">{{ status }}</option>
        </select>
      </label>
      <label class="rm-field">
        <span>Size</span>
        <select class="rm-input" :value="initiative.size" :disabled="!editable" @change="patchSelect($event, 'size')">
          <option v-for="size in SIZES" :key="size" :value="size">{{ size }}</option>
        </select>
      </label>
    </div>

    <label class="rm-field">
      <span>Confidence <ConfidenceMeter :confidence="initiative.confidence" /></span>
      <select class="rm-input" :value="initiative.confidence" :disabled="!editable" @change="patchSelect($event, 'confidence')">
        <option v-for="confidence in CONFIDENCES" :key="confidence" :value="confidence">{{ confidence }}</option>
      </select>
    </label>

    <div class="rm-field-row">
      <label class="rm-field">
        <span>Start</span>
        <select class="rm-input" :value="initiative.start_period" :disabled="!editable" @change="patchSelect($event, 'start_period')">
          <option value="">— unscheduled —</option>
          <option v-for="period in periods" :key="period" :value="period">{{ periodLongLabel(period, kind) }}</option>
        </select>
      </label>
      <label class="rm-field rm-field--narrow">
        <span>Span</span>
        <input class="rm-input" type="number" min="1" :value="initiative.span" :disabled="!editable" @change="patchSpan" />
      </label>
    </div>

    <label class="rm-field">
      <span>Progress <em class="rm-field-value">{{ Math.round((initiative.progress || 0) * 100) }}%</em></span>
      <input
        class="rm-range"
        type="range"
        min="0"
        max="100"
        step="5"
        :value="Math.round((initiative.progress || 0) * 100)"
        :disabled="!editable || initiative.status === 'done'"
        @change="patchProgress"
      />
    </label>

    <div class="rm-field-row">
      <label class="rm-field">
        <span>Owner</span>
        <input class="rm-input" type="text" :value="initiative.owner" :disabled="!editable" @change="patchText($event, 'owner')" />
      </label>
      <label class="rm-field">
        <span>Tags</span>
        <input class="rm-input" type="text" :value="initiative.tags.join(', ')" :disabled="!editable" @change="patchTags" />
      </label>
    </div>

    <section class="rm-chain">
      <h4>Needs</h4>
      <p v-if="!needs.length" class="rm-chain-empty">Nothing — this can start on its own.</p>
      <button v-for="id in needs" :key="id" class="rm-chain-row" @click="emit('select', 'initiative', id)">{{ titleOf(id) }}</button>

      <h4>Unlocks</h4>
      <p v-if="!unlocks.length" class="rm-chain-empty">Nothing depends on this yet.</p>
      <button v-for="id in unlocks" :key="id" class="rm-chain-row" @click="emit('select', 'initiative', id)">{{ titleOf(id) }}</button>
    </section>
  </div>
</template>
