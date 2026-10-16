<script setup lang="ts">
// Vendored from the canonical models shared shell (platform/models/ui/src/app/shared/Drawer.vue). Keep in sync; shell consolidation tracked separately.
import { watch, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import IconButton from './IconButton.vue'

// Right-docked slide-in drawer hosting the add / edit surfaces. A scrim click or
// Escape closes it; an optional back affordance steps within a multi-stage flow.
// The footer slot, when present, stays pinned below the scrolling body.
const props = defineProps<{ open: boolean; title: string; icon?: string; wide?: boolean; back?: boolean }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'back'): void }>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
watch(() => props.open, (open) => {
  if (open) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Transition name="km-drawer">
    <div v-if="open" class="km-drawer-mask" @click.self="emit('close')">
      <aside class="km-drawer" :class="{ wide }" role="dialog" :aria-label="title">
        <header class="km-drawer-h">
          <IconButton v-if="back" icon="tabler:chevron-left" label="Back" @click="emit('back')" />
          <span class="km-drawer-title"><Icon v-if="icon" :icon="icon" aria-hidden="true" />{{ title }}</span>
          <IconButton icon="tabler:x" label="Close" @click="emit('close')" />
        </header>
        <div class="km-drawer-b"><slot /></div>
        <footer v-if="$slots.footer" class="km-drawer-f"><slot name="footer" /></footer>
      </aside>
    </div>
  </Transition>
</template>
