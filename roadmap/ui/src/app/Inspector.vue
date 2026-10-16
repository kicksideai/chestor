<script setup lang="ts">
// One panel for every entity. With nothing selected it carries the reading key
// instead, so the space is never blank.
import { computed } from 'vue'
import { COLOR_CHOICES } from './color-choices'
import { Icon } from '@iconify/vue'
import InitiativeForm from './InitiativeForm.vue'
import Legend from './Legend.vue'
import { periodChoices, periodLongLabel } from './periods'
import type { Trace } from './trace'
import { DEPENDENCY_KINDS, type Horizon, type RoadmapState } from './types'

export type SelectionKind = 'initiative' | 'dependency' | 'milestone' | 'layer' | 'outcome'
export interface Selection { kind: SelectionKind; id: string }
export interface ScheduleSuggestion { id: string; period: string; horizon: Horizon }

const props = defineProps<{
  state: RoadmapState
  selection: Selection | null
  trace: Trace
  editable: boolean
  suggestion: ScheduleSuggestion | null
}>()

const emit = defineEmits<{
  (e: 'patch', kind: SelectionKind, id: string, patch: Record<string, unknown>): void
  (e: 'remove', kind: SelectionKind, id: string): void
  (e: 'select', kind: SelectionKind, id: string): void
  (e: 'apply-suggestion'): void
  (e: 'dismiss-suggestion'): void
  (e: 'close'): void
}>()

const kind = computed(() => props.state.settings.period_kind)
const periods = computed(() => periodChoices(props.state.settings.origin, props.state.settings.columns, kind.value))

const initiative = computed(() => props.selection?.kind === 'initiative' ? props.state.initiatives.find(i => i.id === props.selection?.id) || null : null)
const layer = computed(() => props.selection?.kind === 'layer' ? props.state.layers.find(l => l.id === props.selection?.id) || null : null)
const outcome = computed(() => props.selection?.kind === 'outcome' ? props.state.outcomes.find(o => o.id === props.selection?.id) || null : null)
const milestone = computed(() => props.selection?.kind === 'milestone' ? props.state.milestones.find(m => m.id === props.selection?.id) || null : null)
const dependency = computed(() => props.selection?.kind === 'dependency' ? props.state.dependencies.find(d => d.id === props.selection?.id) || null : null)

const HEADINGS: Record<SelectionKind, string> = {
  initiative: 'Initiative',
  dependency: 'Dependency',
  milestone: 'Milestone',
  layer: 'Layer',
  outcome: 'Outcome',
}

const heading = computed(() => props.selection ? HEADINGS[props.selection.kind] : 'Roadmap')

function titleOf(id: string): string {
  return props.state.initiatives.find(i => i.id === id)?.title || 'Initiative outside this view'
}

function patch(patchBody: Record<string, unknown>) {
  if (props.selection) emit('patch', props.selection.kind, props.selection.id, patchBody)
}

function patchText(event: Event, key: string) {
  patch({ [key]: (event.target as HTMLInputElement | HTMLTextAreaElement).value })
}

function patchSelect(event: Event, key: string) {
  patch({ [key]: (event.target as HTMLSelectElement).value })
}

function patchOrder(event: Event) {
  patch({ sort_order: Math.round(Number((event.target as HTMLInputElement).value) || 0) })
}

const suggestionCopy = computed(() => {
  const suggestion = props.suggestion
  if (!suggestion) return ''
  return `Move to ${suggestion.horizon} by starting in ${periodLongLabel(suggestion.period, kind.value)}.`
})
</script>

<template>
  <aside class="rm-panel">
    <header class="rm-panel-head">
      <h3>{{ heading }}</h3>
      <button class="rm-icon-btn" title="Close panel" aria-label="Close panel" @click="emit('close')">
        <Icon icon="tabler:x" aria-hidden="true" />
      </button>
    </header>

    <div v-if="suggestion" class="rm-suggest">
      <p>{{ suggestionCopy }}</p>
      <div class="rm-suggest-actions">
        <button class="rm-btn rm-btn--primary rm-btn--mini" :disabled="!editable" @click="emit('apply-suggestion')">Set start</button>
        <button class="rm-btn rm-btn--mini" @click="emit('dismiss-suggestion')">Keep as is</button>
      </div>
    </div>

    <div class="rm-panel-body">
      <InitiativeForm
        v-if="initiative"
        :state="state"
        :initiative="initiative"
        :trace="trace"
        :editable="editable"
        @patch="patch"
        @select="(k, id) => emit('select', k, id)"
      />

      <div v-else-if="layer" class="rm-form">
        <label class="rm-field">
          <span>Title</span>
          <input class="rm-input" type="text" :value="layer.title" :disabled="!editable" @change="patchText($event, 'title')" />
        </label>
        <label class="rm-field">
          <span>Description</span>
          <input class="rm-input" type="text" :value="layer.description" :disabled="!editable" @change="patchText($event, 'description')" />
        </label>
        <div class="rm-field-row">
          <label class="rm-field">
            <span>Colour</span>
            <select class="rm-input" :value="layer.color || 'var(--p-text-muted-color)'" :disabled="!editable" @change="patchSelect($event, 'color')">
              <option v-for="c in COLOR_CHOICES" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
          </label>
          <label class="rm-field rm-field--narrow">
            <span>Order</span>
            <input class="rm-input" type="number" :value="layer.sort_order" :disabled="!editable" @change="patchOrder" />
          </label>
        </div>
        <p class="rm-note">Order runs bottom to top: the foundation is 0.</p>
      </div>

      <div v-else-if="outcome" class="rm-form">
        <label class="rm-field">
          <span>Title</span>
          <input class="rm-input" type="text" :value="outcome.title" :disabled="!editable" @change="patchText($event, 'title')" />
        </label>
        <label class="rm-field">
          <span>Why it exists</span>
          <textarea class="rm-input rm-input--area" rows="3" :value="outcome.description" :disabled="!editable" @change="patchText($event, 'description')"></textarea>
        </label>
        <label class="rm-field rm-field--narrow">
          <span>Order</span>
          <input class="rm-input" type="number" :value="outcome.sort_order" :disabled="!editable" @change="patchOrder" />
        </label>
      </div>

      <div v-else-if="milestone" class="rm-form">
        <label class="rm-field">
          <span>Title</span>
          <input class="rm-input" type="text" :value="milestone.title" :disabled="!editable" @change="patchText($event, 'title')" />
        </label>
        <label class="rm-field">
          <span>Description</span>
          <input class="rm-input" type="text" :value="milestone.description" :disabled="!editable" @change="patchText($event, 'description')" />
        </label>
        <div class="rm-field-row">
          <label class="rm-field">
            <span>Period</span>
            <select class="rm-input" :value="milestone.period" :disabled="!editable" @change="patchSelect($event, 'period')">
              <option v-for="period in periods" :key="period" :value="period">{{ periodLongLabel(period, kind) }}</option>
            </select>
          </label>
          <label class="rm-field">
            <span>Layer</span>
            <select class="rm-input" :value="milestone.layer_id" :disabled="!editable" @change="patchSelect($event, 'layer_id')">
              <option value="">— all layers —</option>
              <option v-for="l in state.layers" :key="l.id" :value="l.id">{{ l.title }}</option>
            </select>
          </label>
        </div>
        <section v-if="milestone.initiative_ids.length" class="rm-chain">
          <h4>Marks</h4>
          <button v-for="id in milestone.initiative_ids" :key="id" class="rm-chain-row" @click="emit('select', 'initiative', id)">{{ titleOf(id) }}</button>
        </section>
      </div>

      <div v-else-if="dependency" class="rm-form">
        <div class="rm-dep">
          <button class="rm-chain-row" @click="emit('select', 'initiative', dependency.from_id)">{{ titleOf(dependency.from_id) }}</button>
          <span class="rm-dep-arrow">unlocks</span>
          <button class="rm-chain-row" @click="emit('select', 'initiative', dependency.to_id)">{{ titleOf(dependency.to_id) }}</button>
        </div>
        <label class="rm-field">
          <span>Kind</span>
          <select class="rm-input" :value="dependency.kind" :disabled="!editable" @change="patchSelect($event, 'kind')">
            <option v-for="k in DEPENDENCY_KINDS" :key="k" :value="k">{{ k }}</option>
          </select>
        </label>
        <label class="rm-field">
          <span>Note</span>
          <input class="rm-input" type="text" :value="dependency.note" :disabled="!editable" @change="patchText($event, 'note')" />
        </label>
        <p class="rm-note">Only a requires edge sits on the critical path; informs is advisory.</p>
      </div>

      <Legend v-else :layers="state.layers" />
    </div>

    <footer v-if="selection && editable" class="rm-panel-foot">
      <button class="rm-btn rm-btn--danger" @click="emit('remove', selection.kind, selection.id)">
        <Icon icon="tabler:trash" aria-hidden="true" />Remove {{ heading.toLowerCase() }}
      </button>
    </footer>
  </aside>
</template>
