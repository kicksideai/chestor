<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { type CSSProperties, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{ x: number; y: number }>()

const layer = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const placement = ref<CSSProperties>({ left: '0px', top: '0px', visibility: 'hidden' })
function place() {
  const bounds = layer.value?.getBoundingClientRect()
  const size = panel.value?.getBoundingClientRect()
  if (!bounds || !size) return
  const left = Math.max(0, Math.min(props.x - bounds.left, bounds.width - size.width))
  const top = Math.max(0, Math.min(props.y - bounds.top, bounds.height - size.height))
  placement.value = { left: `${left}px`, top: `${top}px`, visibility: 'visible' }
}
watch(() => [props.x, props.y], () => { void nextTick(place) })
onMounted(() => { void nextTick(() => { place(); panel.value?.focus() }); window.addEventListener('resize', place) })
onBeforeUnmount(() => window.removeEventListener('resize', place))

const emit = defineEmits<(event: 'close' | 'details' | 'focus' | 'copy') => void>()
function choose(action: 'details' | 'focus' | 'copy') { emit(action); emit('close') }
</script>

<template>
  <div ref="layer" class="jr-context-overlay" @click="emit('close')" @contextmenu.prevent="emit('close')">
    <div ref="panel" class="jr-context-menu" :style="placement" role="menu" tabindex="-1" @keydown.esc.stop.prevent="emit('close')" @click.stop @contextmenu.prevent.stop>
      <button role="menuitem" @click="choose('details')"><Icon icon="tabler:info-circle" aria-hidden="true" /> Details</button>
      <button role="menuitem" @click="choose('focus')"><Icon icon="tabler:arrow-up-right" aria-hidden="true" /> Focus here</button>
      <button role="menuitem" @click="choose('copy')"><Icon icon="tabler:copy" aria-hidden="true" /> Copy address</button>
    </div>
  </div>
</template>
