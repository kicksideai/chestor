<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Dialog from 'primevue/dialog'
defineProps<{ title: string; wide?: boolean }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <Dialog :visible="true" modal block-scroll dismissable-mask :draggable="false" :header="title" :class="['ac-dialog', { 'ac-dialog-wide': wide }]" @update:visible="!$event && $emit('close')">
    <slot />
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </Dialog>
</template>
