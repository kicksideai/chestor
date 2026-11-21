<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<!-- Native dialog stays in this shadow root while the browser top layer handles focus and modality. See docs/reference.md#frontend-dialog-deviation. -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
const props = defineProps<{ title: string; wide?: boolean; busy?: boolean; icon?: string }>()
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
    <header class="ac-dialog-header">
      <span v-if="icon" class="kx-modal-head-icon"><Icon :icon="icon" aria-hidden="true" /></span>
      <h2 :class="{ 'kx-modal-head-title': icon }">{{ title }}</h2>
      <button type="button" class="ac-icon-btn kx-focus-outline" aria-label="Close dialog" :disabled="busy" @click="emit('close')">×</button>
    </header>
    <div class="ac-dialog-content"><slot /></div>
  </dialog>
</template>
