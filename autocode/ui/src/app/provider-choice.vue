<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Tag from 'primevue/tag'
defineProps<{ title: string; hint: string; icon: string; status: string; count?: string; severity: 'success' | 'warn' | 'danger' | 'secondary' }>()
</script>

<template>
  <button class="kx-card ac-provider-choice" type="button">
    <span class="kx-card-head">
      <span class="ac-provider-icon"><Icon :icon="icon" aria-hidden="true" /></span>
      <span class="kx-card-id">
        <span class="kx-card-name">{{ title }}</span>
        <span class="kx-card-desc">{{ hint }}</span>
      </span>
      <Icon icon="tabler:chevron-right" class="ac-provider-arrow" aria-hidden="true" />
    </span>
    <span class="kx-card-meta">
      <Tag :value="status" :severity="severity" />
      <small v-if="count" class="ac-muted">{{ count }}</small>
    </span>
  </button>
</template>
