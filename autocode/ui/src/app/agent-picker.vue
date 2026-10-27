<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { agentIcon } from './presentation.ts'
defineProps<{ agents: { id: string; title: string; icon?: string }[]; modelValue: string; disabled?: boolean }>()
defineEmits<{ 'update:modelValue': [id: string] }>()
</script>

<template>
  <div v-if="agents.length <= 6" class="ac-chips" role="group" aria-label="Agent">
    <button v-for="a in agents" :key="a.id" :disabled="disabled" type="button" class="ac-chip kx-focus-halo" :class="{ active: modelValue === a.id }" :aria-pressed="modelValue === a.id" @click="$emit('update:modelValue', a.id)"><Icon :icon="agentIcon(a.id, agents)" aria-hidden="true" />{{ a.title }}</button>
  </div>
  <select v-else :disabled="disabled" class="kx-focus-halo" aria-label="Agent" :value="modelValue" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"><option v-for="a in agents" :key="a.id" :value="a.id">{{ a.title }}</option></select>
</template>
