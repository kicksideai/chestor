<script setup lang="ts">
// Vendored from the canonical models shared shell (platform/models/ui/src/app/shared/Toggle.vue). Keep in sync; shell consolidation tracked separately.
// Switch control with an optional trailing label.
defineProps<{ modelValue: boolean; label?: string; disabled?: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()
</script>

<template>
  <label class="km-toggle" :class="{ on: modelValue, disabled }">
    <input
      type="checkbox"
      class="km-toggle-input"
      :checked="modelValue"
      :disabled="disabled"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="km-toggle-track"><span class="km-toggle-thumb" /></span>
    <span v-if="label" class="km-toggle-label">{{ label }}</span>
  </label>
</template>
