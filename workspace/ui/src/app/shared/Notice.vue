<script setup lang="ts">
// Vendored from the canonical models shared shell (platform/models/ui/src/app/shared/Notice.vue). Keep in sync; shell consolidation tracked separately.
import { Icon } from '@iconify/vue'

// Inline banner for errors and informational messages, with a dismiss control.
withDefaults(defineProps<{ tone?: 'info' | 'error' }>(), { tone: 'info' })
const emit = defineEmits<{ (e: 'dismiss'): void }>()
</script>

<template>
  <div class="km-notice" :class="`t-${tone}`" role="status">
    <Icon :icon="tone === 'error' ? 'tabler:alert-triangle' : 'tabler:info-circle'" aria-hidden="true" />
    <span class="km-notice-text"><slot /></span>
    <button class="km-notice-x" aria-label="Dismiss" @click="emit('dismiss')">
      <Icon icon="tabler:x" aria-hidden="true" />
    </button>
  </div>
</template>
