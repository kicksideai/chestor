<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->

<script setup lang="ts">
import Tag from 'primevue/tag'
import { absoluteTime, relativeAge } from './format'
import type { Severity } from './format'

defineProps<{
  title: string
  detail?: string
  at?: number
  now: number
  tag?: string
  severity?: Severity
  active?: boolean
  fresh?: boolean
}>()
defineEmits<{ open: [] }>()
</script>

<template>
  <button type="button" class="jr-row" :class="{ fresh }" :aria-current="active ? 'true' : undefined" @click="$emit('open')">
    <span class="jr-row-main">
      <span class="jr-row-line">
        <span class="jr-row-title">{{ title }}</span>
        <time v-if="at" class="jr-row-time" :title="absoluteTime(at)">{{ relativeAge(at, now) }}</time>
      </span>
      <span v-if="detail || tag" class="jr-row-line">
        <Tag v-if="tag" :value="tag" :severity="severity || 'secondary'" class="kx-tag-sm" />
        <span v-if="detail" class="jr-row-detail">{{ detail }}</span>
      </span>
    </span>
  </button>
</template>
