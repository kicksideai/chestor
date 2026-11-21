<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Button from 'primevue/button'
import { useEvents, useProps } from '@wippy-fe/webcomponent-vue'
import type { ProviderEvents, ProviderProps } from '../driver-account.ts'
import { useCatalog } from './catalog.ts'
import Accounts from './accounts.vue'
import type { Account } from './dto.ts'
import type { Component } from 'vue'

defineProps<{ provider?: 'claude' | 'codex' }>()
defineSlots<{
  guide(): unknown
  usage(props: { account: Account }): unknown
  setup(props: { account?: Account; labelBytes?: number; busy: (busy: boolean) => void; saved: () => void; credential: Component }): unknown
}>()

const props = useProps<ProviderProps>()
const emit = useEvents<ProviderEvents>()
const { catalog, error, load } = useCatalog()
</script>

<template>
  <p v-if="!props.providerId" class="kx-err" role="alert">A provider is required.</p>
  <p v-else-if="error && !catalog" class="kx-err" role="alert">{{ error }} <Button label="Retry" severity="secondary" text size="small" @click="load" /></p>
  <p v-else-if="!catalog" class="kx-loading" role="status">Loading accounts…</p>
  <Accounts v-else :key="props.providerId" query="" selected-agent="" management :provider-id="props.providerId" :provider="provider"
    @changed="emit('connection-saved', { success: true })">
    <template v-if="$slots.guide" #guide><slot name="guide" /></template>
    <template v-if="$slots.usage" #usage="scope"><slot name="usage" v-bind="scope" /></template>
    <template v-if="$slots.setup" #setup="scope"><slot name="setup" v-bind="scope" /></template>
  </Accounts>
</template>
