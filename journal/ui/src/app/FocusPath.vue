<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import type { Focus } from './navigation'

/**
 * The breadcrumb is the focus stack made visible: journal, graph, branch,
 * record. Every crumb is a way back to that level, and the movement controls
 * beside it move through places the reader has actually been rather than up
 * the tree.
 */
const props = defineProps<{ focus: Focus[]; canBack?: boolean; canForward?: boolean }>()
const emit = defineEmits<{ crumb: [index: number]; back: []; forward: []; up: [] }>()

const path = ref<HTMLElement | null>(null)
watch(() => props.focus.length, () => nextTick(() => {
  if (path.value) path.value.scrollLeft = path.value.scrollWidth
}))

const ICONS: Record<string, string> = {
  journal: 'tabler:notebook',
  graph: 'tabler:topology-star-3',
  branch: 'tabler:git-branch',
  node: 'tabler:point',
}
</script>

<template>
  <nav class="jr-focus-path" aria-label="Focus path">
    <div class="jr-focus-moves">
      <button :disabled="!canBack" aria-label="Back" title="Back (Alt+←)" @click="emit('back')">
        <Icon icon="tabler:chevron-left" aria-hidden="true" />
      </button>
      <button :disabled="!canForward" aria-label="Forward" title="Forward (Alt+→)" @click="emit('forward')">
        <Icon icon="tabler:chevron-right" aria-hidden="true" />
      </button>
      <button :disabled="focus.length < 2" aria-label="Step out one level" title="Step out (Esc)" @click="emit('up')">
        <Icon icon="tabler:arrow-back-up" aria-hidden="true" />
      </button>
    </div>
    <ol ref="path" class="jr-crumbs">
      <li v-for="(item, index) in focus" :key="`${item.kind}:${item.id}`">
        <span v-if="index" class="jr-crumb-sep" aria-hidden="true">/</span>
        <button
          :class="['jr-crumb', `kind-${item.kind}`, { current: index === focus.length - 1 }]"
          :title="item.label"
          :aria-current="index === focus.length - 1 ? 'true' : undefined"
          @click="emit('crumb', index)"
        >
          <Icon :icon="ICONS[item.kind] || ICONS.node" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </button>
      </li>
    </ol>
  </nav>
</template>
