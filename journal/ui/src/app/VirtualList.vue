<script setup lang="ts" generic="T">
/**
 * A windowed list over fixed-height rows.
 *
 * Only the rows the reader can resolve are in the document; the two spacers
 * carry the rest, so the scrollbar measures the whole list however long it is.
 * The list owns no semantics: the caller puts the role on the element it hands
 * down through fallthrough attributes, and the row slot renders the item.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { scrollToShow, windowFor } from './virtual'

const props = defineProps<{
  items: T[]
  rowHeight: number
  overscan?: number
  /** Row to bring into view; the list moves the shortest distance that does. */
  scrollToIndex?: number
  /** Where the reader had this list scrolled, when they are returning to it. */
  restoreScrollTop?: number
}>()
const emit = defineEmits<{ scroll: [top: number] }>()

const scroller = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const viewport = ref(0)
let frame = 0
let resize: ResizeObserver | null = null

const view = computed(() => windowFor(scrollTop.value, viewport.value, props.rowHeight, props.items.length, props.overscan))
const rendered = computed(() => props.items.slice(view.value.start, view.value.end).map((item, offset) => ({ item, index: view.value.start + offset })))

function measure() {
  const element = scroller.value
  if (!element) return
  viewport.value = element.clientHeight
  scrollTop.value = element.scrollTop
}

// A fast scroll fires far more often than the display refreshes, so the window
// is recomputed once per frame rather than once per event.
function onScroll() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    scrollTop.value = scroller.value?.scrollTop || 0
    emit('scroll', scrollTop.value)
  })
}

watch(() => props.scrollToIndex, index => {
  const element = scroller.value
  if (!element || index === undefined || index < 0) return
  const next = scrollToShow(index, element.scrollTop, element.clientHeight || viewport.value, props.rowHeight)
  if (next === scrollTop.value && next === element.scrollTop) return
  element.scrollTop = next
  scrollTop.value = next
})

/**
 * Reopening a list the reader has read before puts it back where they left it.
 * This is watched after the reveal above so a restored position wins: the two
 * were remembered together, so the row the reveal would chase is already in the
 * restored window.
 */
function restore(top: number | undefined) {
  if (top === undefined || top < 0) return
  const element = scroller.value
  scrollTop.value = top
  if (element) element.scrollTop = top
}
watch(() => props.restoreScrollTop, restore)

onMounted(() => {
  measure()
  restore(props.restoreScrollTop)
  resize = new ResizeObserver(measure)
  if (scroller.value) resize.observe(scroller.value)
})

onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  resize?.disconnect()
  resize = null
})
</script>

<template>
  <div ref="scroller" class="jr-vlist" @scroll.passive="onScroll">
    <div class="jr-vlist-pad" :style="{ height: `${view.padTop}px` }" aria-hidden="true"></div>
    <template v-for="row in rendered" :key="row.index">
      <slot name="row" :item="row.item" :index="row.index" />
    </template>
    <div class="jr-vlist-pad" :style="{ height: `${view.padBottom}px` }" aria-hidden="true"></div>
  </div>
</template>
