<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const value = defineModel<string>({ required: true })
const input = ref<HTMLInputElement | null>(null)
defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <div class="kx-search jr-search">
    <Icon icon="tabler:search" class="kx-search-ico" aria-hidden="true" />
    <input
      ref="input" v-model="value" class="kx-search-input" type="search"
      placeholder="Find a task or fact" aria-label="Find a task or fact"
      @keydown.esc="value = ''"
    >
    <button v-if="value" type="button" class="kx-search-clear" aria-label="Clear search" @click="value = ''">
      <Icon icon="tabler:x" aria-hidden="true" />
    </button>
  </div>
</template>
