<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
const props = defineProps<{ title: string; wide?: boolean; busy?: boolean }>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
function cancel(event: Event) {
  event.preventDefault()
  if (!props.busy) emit('close')
}
function backdrop(event: MouseEvent) {
  const el = dialog.value
  if (!el || event.target !== el) return
  const rect = el.getBoundingClientRect()
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) cancel(event)
}
onMounted(async () => {
  await nextTick()
  if (dialog.value && !dialog.value.open) dialog.value.showModal()
})
onBeforeUnmount(() => { if (dialog.value?.open) dialog.value.close() })
</script>

<template>
  <dialog ref="dialog" :class="['ac-dialog', { 'ac-dialog-wide': wide }]" :aria-label="title" aria-modal="true" :aria-busy="busy || undefined" @cancel="cancel" @close="!busy && emit('close')" @click="backdrop">
    <header class="ac-dialog-header"><h2>{{ title }}</h2><button type="button" class="ac-icon-btn kx-focus-outline" aria-label="Close dialog" :disabled="busy" @click="emit('close')">×</button></header>
    <div class="ac-dialog-content"><slot /></div>
  </dialog>
</template>
