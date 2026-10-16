<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { buildLanes, buildTimeScale, scaleExtent, scaleOffset } from './lanes'
import type { LaneSpan } from './lanes'
import { relativeAge } from './assembly'
import type { ActivityBucket, WorkSpan } from './types'

/**
 * One lane per agent, along the journal's own clock. A span is the bar — what
 * the identity was working on, how many facts it wrote, how it ended — and the
 * ticks under it are the server's own time buckets, so a journal with a hundred
 * thousand facts draws counts rather than a hundred thousand marks. The clock
 * is activity-shaped: bursts run linear at reading size, idle stretches fold to
 * labelled breaks, and work nothing claimed rides the journal's own lane.
 */
const props = defineProps<{ spans: WorkSpan[]; buckets: ActivityBucket[]; bucketWidthS?: number; now: number }>()
const emit = defineEmits<{ agent: [agentId: string]; span: [spanId: string] }>()

const scale = computed(() => buildTimeScale(props.spans, props.buckets, props.bucketWidthS || 3600, props.now))
const lanes = computed(() => buildLanes(props.spans, props.buckets, props.now))
const peak = computed(() => Math.max(1, ...lanes.value.flatMap(lane => lane.ticks.map(tick => tick.events))))

function barStyle(span: LaneSpan) {
  const extent = scaleExtent(span, scale.value)
  return { left: `${extent.start * 100}%`, width: `${extent.width * 100}%` }
}
</script>

<template>
  <section class="jr-lanes" aria-label="Agent lanes">
    <div class="jr-lens-meta">
      <span class="jr-lens-title">Lanes</span>
      <span class="jr-lens-facts">
        <b class="jr-numeric">{{ lanes.length }}</b> lanes
        <i aria-hidden="true"></i>
        <b class="jr-numeric">{{ spans.length }}</b> spans
        <i aria-hidden="true"></i>
        <b class="jr-numeric">{{ buckets.length }}</b> buckets
      </span>
    </div>

    <div v-if="!lanes.length" class="jr-empty-state">
      <Icon icon="tabler:timeline" aria-hidden="true" />
      <h3>No agent has worked in this journal yet</h3>
      <p>A lane appears the moment an identity writes its first fact; the span it opens is the bar.</p>
    </div>

    <div v-else class="jr-lane-board">
      <div class="jr-lane-ruler" aria-hidden="true">
        <span v-for="mark in scale.marks" :key="mark.at" :style="{ left: `${mark.offset * 100}%` }">{{ mark.label }}</span>
      </div>
      <div class="jr-lane-rows">
        <!-- Folded idle stretches run down the whole board, labelled once. -->
        <div class="jr-lane-gaps" aria-hidden="true">
          <div
            v-for="gap in scale.gaps" :key="gap.offset"
            class="jr-lane-gap" :style="{ left: `${gap.offset * 100}%`, width: `${gap.width * 100}%` }"
          >
            <span>{{ gap.label }}</span>
          </div>
        </div>
        <div v-for="lane in lanes" :key="lane.agentId" :class="['jr-lane', { unattributed: lane.unattributed }]">
          <button class="jr-lane-name" :title="lane.label" :disabled="lane.unattributed" @click="emit('agent', lane.agentId)">
            <span class="jr-avatar">{{ lane.initials }}</span>
            <span>
              <b>{{ lane.label }}</b>
              <small class="jr-numeric">{{ lane.events }} fact{{ lane.events === 1 ? '' : 's' }} · {{ relativeAge(lane.lastActivityAt, now) }}</small>
            </span>
          </button>
          <div class="jr-lane-track">
            <i
              v-for="tick in lane.ticks" :key="tick.at"
              class="jr-lane-tick"
              :style="{ left: `${scaleOffset(tick.at, scale) * 100}%`, height: `${Math.max(12, (tick.events / peak) * 100)}%` }"
              :title="`${tick.events} facts`"
            ></i>
            <button
              v-for="span in lane.spans" :key="span.spanId"
              :class="['jr-lane-span', { open: span.open, [`outcome-${span.outcome}`]: span.outcome }]"
              :style="barStyle(span)"
              :title="`${span.purpose} · ${span.factCount} facts · ${span.open ? 'still open' : span.outcome}`"
              @click="emit('span', span.spanId)"
            >
              <span>{{ span.purpose }}</span>
              <em class="jr-numeric">{{ span.factCount }}</em>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
