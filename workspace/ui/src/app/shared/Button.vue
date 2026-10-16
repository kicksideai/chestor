<script setup lang="ts">
// Vendored from the canonical models shared shell (platform/models/ui/src/app/shared/Button.vue). Keep in sync; shell consolidation tracked separately.
import { Icon } from '@iconify/vue'

// Text button. variant selects the fill; loading swaps the leading icon for a
// spinner and disables interaction.
withDefaults(defineProps<{
  icon?: string
  variant?: 'primary' | 'ghost' | 'soft' | 'danger'
  type?: 'button' | 'submit'
  loading?: boolean
  disabled?: boolean
  small?: boolean
}>(), { variant: 'primary', type: 'button' })
const emit = defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <button
    :type="type"
    class="km-btn"
    :class="[`km-btn-${variant}`, small && 'sm']"
    :disabled="disabled || loading"
    @click="emit('click')"
  >
    <span v-if="loading" class="km-spin" aria-hidden="true" />
    <Icon v-else-if="icon" :icon="icon" aria-hidden="true" />
    <slot />
  </button>
</template>
