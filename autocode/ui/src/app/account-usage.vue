<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import ProgressBar from 'primevue/progressbar'
import type { Account } from './dto.ts'
import { resetLabel, usageLabel } from './account-health.ts'
defineProps<{ account: Account }>()
</script>

<template>
  <div v-if="account.rate_limits?.windows.length" class="ac-usage-list">
    <div v-for="window in account.rate_limits.windows" :key="window.window" class="ac-usage-window">
      <div class="ac-usage-label">
        <span>{{ usageLabel(window.window) }}</span>
        <span v-if="window.resets_at" class="ac-muted">Resets {{ resetLabel(window.resets_at * 1000) }}</span>
      </div>
      <ProgressBar v-if="window.utilization !== undefined || window.status === 'rejected'"
        :value="window.utilization === undefined ? 100 : Math.max(0, Math.min(100, Math.round(window.utilization * 100)))"
        :show-value="false" :aria-label="usageLabel(window.window)" class="ac-usage-meter"
        :class="{ 'ac-usage-limited': window.status !== 'allowed' }" />
      <small v-else class="ac-muted">{{ window.status === 'warning' ? 'Approaching the limit.' : 'Within the limit.' }}</small>
    </div>
  </div>
</template>
