<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import ProviderAccounts from './provider-accounts.vue'
import ClaudeAccountUsage from './claude-account-usage.vue'
</script>

<template>
  <ProviderAccounts provider="claude">
    <template #guide>
      <p class="ac-hint">Connect your own Claude subscription to run tasks with Claude Code.</p>
      <ol class="ac-setup-steps">
        <li>Run <code>claude setup-token</code> in a terminal and sign in to your Claude account when the browser opens.</li>
        <li>Paste the generated subscription token below. An existing Claude Code login file also works.</li>
      </ol>
    </template>
    <template #usage="{ account }"><ClaudeAccountUsage :account="account" /></template>
  </ProviderAccounts>
</template>
