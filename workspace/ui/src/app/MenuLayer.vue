<script setup lang="ts">
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
onMounted(() => { void nextTick(place); window.addEventListener('resize', place) })
onBeforeUnmount(() => window.removeEventListener('resize', place))
const emit = defineEmits<{ close: [] }>()
</script>
<template>
  <div ref="layer" class="ws-menu-layer" @click="emit('close')" @contextmenu.prevent="emit('close')">
    <div ref="panel" class="ws-menu" :style="placement" @click.stop><slot /></div>
  </div>
</template>
