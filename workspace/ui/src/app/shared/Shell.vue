<script setup lang="ts">
// Vendored from the canonical models shared shell (platform/models/ui/src/app/shared/Shell.vue). Keep in sync; shell consolidation tracked separately.
// Borderless two-zone shell: a navigation rail flush against the open content
// area. The rail holds the provider list; the default slot is the model pool.
// The rail collapses above the content on narrow widths.
</script>

<template>
  <div class="km-shell">
    <aside class="km-rail"><slot name="rail" /></aside>
    <main class="km-main"><slot /></main>
  </div>
</template>
