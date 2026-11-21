<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { ref } from 'vue'
import ProviderAccounts from './provider-accounts.vue'
import CodexDeviceSetup from './codex-device-setup.vue'

const inProgress = ref(false)
</script>

<template>
  <ProviderAccounts provider="codex">
    <template #setup="{ account, labelBytes, busy, saved, credential }">
      <CodexDeviceSetup :account="account" :label-bytes="labelBytes"
        @busy="inProgress = $event; busy($event)" @saved="saved" />
      <Disclosure v-if="!inProgress" class="ac-advanced-credential" label="Advanced · Paste a credential">
        <p class="ac-hint">Use an OpenAI API key or upload the login file from an existing Codex installation.</p>
        <component :is="credential" />
      </Disclosure>
    </template>
  </ProviderAccounts>
</template>
