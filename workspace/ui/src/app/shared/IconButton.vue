<script setup lang="ts">
// Vendored from the canonical models shared shell (platform/models/ui/src/app/shared/IconButton.vue). Keep in sync; shell consolidation tracked separately.
import { Icon } from '@iconify/vue'

// Square glyph button used across rails, rows, and drawer headers. variant picks
// the resting treatment, size the footprint (28 / 32 / 36).
withDefaults(defineProps<{
  icon: string
  label: string
  active?: boolean
  disabled?: boolean
  variant?: 'plain' | 'bordered' | 'danger'
  tone?: 'ok' | 'bad' | 'warn' | 'info'
  size?: 'sm' | 'md' | 'lg'
  spin?: boolean
}>(), { variant: 'plain', size: 'md' })
const emit = defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <button
    class="km-iconbtn"
    :class="[variant !== 'plain' && variant, size !== 'md' && size, active && 'on', tone && `tone-${tone}`]"
    :aria-label="label"
    :title="label"
    :disabled="disabled"
    @click="emit('click')"
  >
    <span v-if="spin" class="km-spin" aria-hidden="true" />
    <Icon v-else :icon="icon" aria-hidden="true" />
  </button>
</template>
