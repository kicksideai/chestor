<script setup lang="ts">
import { type CSSProperties, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{ x: number; y: number; items: MenuItem[] }>()

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

export interface MenuItem { label: string; action: () => void; danger?: boolean }
const emit = defineEmits<{ (e: 'close'): void }>()

function pick(item: MenuItem) { item.action(); emit('close') }
</script>

<template>
  <div ref="layer" class="de-ctx-overlay" @click="emit('close')" @contextmenu.prevent="emit('close')">
    <div ref="panel" class="de-ctx" :style="placement" @click.stop @contextmenu.prevent.stop>
      <button
        v-for="(item, i) in items"
        :key="i"
        class="de-ctx-item"
        :class="{ 'de-ctx-danger': item.danger }"
        @click="pick(item)"
      >{{ item.label }}</button>
    </div>
  </div>
</template>
