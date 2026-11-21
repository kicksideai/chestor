<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import type { Account } from './dto.ts'
import AccountUsage from './account-usage.vue'

const props = defineProps<{ account: Account }>()
const overage = computed(() => {
  const limits = props.account.rate_limits
  if (limits?.overage_disabled_reason === 'org_level_disabled') return 'Your organization has disabled extra usage. Wait for the reset or use another account.'
  if (limits?.overage_status === 'rejected' || limits?.overage_disabled_reason) return 'Extra usage is unavailable for this account. Wait for the reset or use another account.'
  if (limits?.overage_status === 'warning') return 'Claude is approaching its extra usage limit.'
  if (limits?.is_using_overage) return 'Claude is using extra usage.'
  if (limits?.overage_status === 'allowed') return 'Extra usage is available for this account.'
  return ''
})
const hasDetails = computed(() => !!props.account.rate_limits?.windows.length || !!overage.value)
</script>

<template>
  <AccountUsage :account="account" />
  <p v-if="overage" class="ac-hint">{{ overage }}</p>
  <details v-if="hasDetails" class="ac-account-details">
    <summary class="kx-focus-outline">Usage details</summary>
    <div v-for="window in account.rate_limits?.windows" :key="window.window"><code>{{ window.window }} · {{ window.status }}</code></div>
    <div v-if="overage"><code>{{ account.rate_limits?.overage_disabled_reason || account.rate_limits?.overage_status }}</code></div>
  </details>
</template>
