<script setup lang="ts">
import { computed, inject, nextTick, ref, shallowRef, watch } from 'vue'
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import { renderMarkdown } from './markdown'
import { RESIZE_NODE_KEY, type ResizeNodeFn } from './resize'
import { NODE_EDIT_KEY, type NodeEditCtx } from './canvas-edit'
import type { HandleDef, NodeBadge } from './graph-sync'

const props = defineProps<{
  id: string
  data: {
    label: string
    description: string
    nodeType: string
    typeLabel: string
    color: string
    bg: string
    border: string
    tags: string[]
    status: string
    hasChildren: boolean
    childCount: number
    materialCount: number
    badges: NodeBadge[]
    width: number
    radius: number
    borderStyle: string
    animation: string
    handles: HandleDef[]
  }
  selected?: boolean
}>()

const sideMap: Record<string, Position> = {
  top: Position.Top, bottom: Position.Bottom, left: Position.Left, right: Position.Right,
}

const MIN_W = 150
const MAX_W = 640

const resizeNode = inject<ResizeNodeFn>(RESIZE_NODE_KEY, () => {})
const nodeEdit = inject<NodeEditCtx>(NODE_EDIT_KEY, () => ({ state: shallowRef(null), commit: () => {}, close: () => {} }), true)
const { viewport } = useVueFlow()

// ── Inline rename ──
const nameInput = ref<HTMLInputElement | null>(null)
const editVal = ref('')
const isEditing = computed(() => nodeEdit.state.value?.id === props.id)

watch(isEditing, (on) => {
  if (!on) return
  const seed = nodeEdit.state.value?.seed
  editVal.value = seed ?? props.data.label
  void nextTick(() => {
    const el = nameInput.value
    if (!el) return
    el.focus()
    if (seed == null) el.select()
    else el.setSelectionRange(el.value.length, el.value.length)
  })
})

function commitName() {
  if (!isEditing.value) return
  nodeEdit.commit(props.id, editVal.value)
}
function onNameKeydown(e: KeyboardEvent) {
  e.stopPropagation()
  if (e.key === 'Enter') { e.preventDefault(); commitName() }
  else if (e.key === 'Escape') { e.preventDefault(); nodeEdit.close() }
}

// Live width during a grip drag; the persisted value takes over once the
// updated node data arrives.
const liveWidth = ref<number | null>(null)
watch(() => props.data.width, () => { liveWidth.value = null })

const width = computed(() => Math.max(MIN_W, Math.min(MAX_W, Number(liveWidth.value ?? props.data.width ?? 210))))
const radius = computed(() => Math.max(0, Math.min(30, Number(props.data.radius ?? 6))))
const descHtml = computed(() => renderMarkdown(props.data.description))

function startResize(e: PointerEvent) {
  const startX = e.clientX
  const startW = width.value
  const target = e.target as HTMLElement
  target.setPointerCapture(e.pointerId)
  const onMove = (ev: PointerEvent) => {
    const zoom = viewport.value.zoom || 1
    liveWidth.value = Math.max(MIN_W, Math.min(MAX_W, Math.round(startW + (ev.clientX - startX) / zoom)))
  }
  const onUp = () => {
    target.removeEventListener('pointermove', onMove)
    target.removeEventListener('pointerup', onUp)
    if (liveWidth.value !== null && liveWidth.value !== props.data.width) resizeNode(props.id, liveWidth.value)
  }
  target.addEventListener('pointermove', onMove)
  target.addEventListener('pointerup', onUp)
}

// Distribute multiple handles evenly along their side.
const handlePos = computed(() => {
  const bySide: Record<string, number[]> = {}
  props.data.handles.forEach((h, i) => { (bySide[h.side] ||= []).push(i) })
  const out: Record<number, { left?: string; top?: string }> = {}
  for (const [side, idxs] of Object.entries(bySide)) {
    idxs.forEach((gi, local) => {
      if (idxs.length <= 1) { out[gi] = {}; return }
      const pct = ((local + 1) / (idxs.length + 1)) * 100
      out[gi] = (side === 'top' || side === 'bottom') ? { left: `${pct}%` } : { top: `${pct}%` }
    })
  }
  return out
})
</script>

<template>
  <div
    class="g-node"
    :class="[{ 'g-node--selected': selected }, data.animation ? 'g-anim-' + data.animation : '']"
    :style="{ '--node-color': data.color, '--node-bg': data.bg, '--node-border': data.border, width: width + 'px', borderRadius: radius + 'px', borderStyle: data.borderStyle || 'solid' }"
  >
    <Handle
      v-for="(h, i) in data.handles"
      :key="h.id"
      :id="h.id"
      :type="h.type"
      :position="sideMap[h.side]"
      :style="handlePos[i]"
      class="g-port"
    />

    <div class="g-node-top">
      <span class="g-dot"></span>
      <span class="g-type">{{ data.typeLabel }}</span>
      <span v-if="data.status && data.status !== 'active'" class="g-status" :title="'status: ' + data.status">{{ data.status }}</span>
      <span v-if="data.materialCount" class="g-clip" :title="data.materialCount + ' material(s) — open panel'">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        {{ data.materialCount }}
      </span>
      <span v-if="data.childCount" class="g-count" title="Children">{{ data.childCount }}</span>
    </div>

    <input
      v-if="isEditing"
      ref="nameInput"
      v-model="editVal"
      class="g-name-input nodrag"
      spellcheck="false"
      @keydown="onNameKeydown"
      @blur="commitName"
      @pointerdown.stop
      @click.stop
      @dblclick.stop
    />
    <div v-else class="g-name">{{ data.label }}</div>
    <div v-if="descHtml" class="g-desc" v-html="descHtml"></div>

    <div v-if="data.badges.length" class="g-badges">
      <span v-for="(b, i) in data.badges" :key="i" class="g-badge" :style="{ '--badge-color': b.color }">{{ b.text }}</span>
    </div>
    <div v-if="data.tags.length" class="g-tags">
      <span v-for="tag in data.tags" :key="tag" class="g-tag">{{ tag }}</span>
    </div>

    <div v-if="selected" class="g-resize nodrag" title="Drag to resize" @pointerdown.stop.prevent="startResize"></div>
  </div>
</template>
