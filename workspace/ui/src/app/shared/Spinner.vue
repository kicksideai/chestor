<script setup lang="ts">
// Vendored from the canonical models shared shell (platform/models/ui/src/app/shared/Spinner.vue). Keep in sync; shell consolidation tracked separately.
// Centered loading indicator: a ring spinner with an optional label.
defineProps<{ label?: string }>()
</script>

<template>
  <div class="km-loading">
    <span class="km-spin lg" aria-hidden="true" />
    <span v-if="label">{{ label }}</span>
  </div>
</template>
