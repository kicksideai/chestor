<script setup lang="ts">
// Vendored from the canonical models shared shell (platform/models/ui/src/app/shared/Avatar.vue). Keep in sync; shell consolidation tracked separately.
import { Icon } from '@iconify/vue'

// Rounded provider glyph used in rows and editor headers.
withDefaults(defineProps<{ icon: string; size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })
</script>

<template>
  <span class="km-avatar" :class="size !== 'md' && size">
    <Icon :icon="icon" aria-hidden="true" />
  </span>
</template>
