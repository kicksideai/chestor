<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
defineProps<{ title: string; subtitle: string; count?: string; action?: string; query: string; placeholder: string }>()
defineEmits<{ 'update:query': [value: string]; create: [] }>()
</script>

<template>
  <header class="kx-head">
    <div class="kx-head-icon"><Icon icon="tabler:robot" aria-hidden="true" /></div>
    <div class="kx-head-text"><h1 class="kx-title">{{ title }}</h1><p class="kx-head-sub">{{ subtitle }}</p></div>
    <div class="kx-head-actions">
      <span v-if="count" class="kx-count">{{ count }}</span>
      <div class="kx-search"><Icon icon="tabler:search" aria-hidden="true" /><input :value="query" class="kx-search-input kx-focus-halo" :placeholder="placeholder" :aria-label="placeholder" @input="$emit('update:query', ($event.target as HTMLInputElement).value)" /></div>
      <Button v-if="action" :label="action" @click="$emit('create')"><template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template></Button>
    </div>
  </header>
</template>
