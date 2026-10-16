<script setup lang="ts">
// Vendored from the canonical models shared shell (platform/models/ui/src/app/shared/SelectField.vue). Keep in sync; shell consolidation tracked separately.
import { Icon } from '@iconify/vue'

// Styled select wrapper with a chevron affordance. Options are passed as the
// default slot so callers keep full control of <option> rendering.
defineProps<{ modelValue: string; ariaLabel?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>

<template>
  <div class="km-select">
    <select
      class="km-select-el"
      :aria-label="ariaLabel"
      :value="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <slot />
    </select>
    <Icon icon="tabler:chevron-down" class="km-select-chev" aria-hidden="true" />
  </div>
</template>
