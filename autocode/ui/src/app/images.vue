<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { useRequiredCatalog } from './catalog.ts'
import { ref, computed, watch, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { host } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { autocode, errorText, serial, principalLabels, type Image, type ImageDetail } from './api.ts'
import { useComponentTopics } from './live.ts'
import AppDialog from './app-dialog.vue'
import { agentIcon } from './presentation.ts'
import ImageForm from './image-form.vue'

const catalog = useRequiredCatalog()
const props = defineProps<{ query: string }>()
const emit = defineEmits<{ count: [value: number] }>()
const adding = ref(false)
const ownership = ref<Record<string, string>>({})
defineExpose({ open: () => { adding.value = true } })
const images = ref<Image[]>([])
const error = ref('')
const editing = ref<ImageDetail | null>(null)
const log = ref<{ id: string; ref: string; text: string } | null>(null)
const capabilities = ref<string[] | null>(null)
const loaded = ref(false)
let alive = true
let logGeneration = 0
onUnmounted(() => { alive = false; logGeneration++ })

async function readLog(id: string) {
  const generation = logGeneration
  const detail = await autocode.image(id)
  if (!alive || generation !== logGeneration || log.value?.id !== id) return
  log.value = { id, ref: detail.image.ref, text: detail.build_log || '(empty)' }
}

// A status change refetches the list and the open build log.
const refresh = serial(async () => {
  try {
    const [list, drivers] = await Promise.all([autocode.images(), autocode.drivers()])
    const labels = await principalLabels([...new Set(list.map(i => i.owner))])
    if (!alive) return
    images.value = list
    ownership.value = Object.fromEntries(list.map(i => [i.id, `Owner: ${labels[i.owner] || i.owner}`]))
    capabilities.value = [...new Set(drivers.flatMap(d => d.capabilities))].sort()
    if (log.value && list.some(i => i.id === log.value?.id)) await readLog(log.value.id)
    loaded.value = true
    error.value = ''
  } catch (e) {
    error.value = errorText(e, 'Could not load images.')
  }
})
useComponentTopics(() => images.value.map((i) => i.id), () => { void refresh() })
useHostVisibilityRefresh(refresh)

async function attempt(action: () => Promise<unknown>, failure: string) {
  error.value = ''
  try {
    await action()
    await refresh()
  } catch (e) {
    error.value = errorText(e, failure)
  }
}

const edit = (image: Image) => attempt(async () => { editing.value = await autocode.image(image.id) }, 'Could not load the image settings.')
const prepare = (image: Image) => attempt(() => autocode.prepareImage(image.id), 'Could not start the image preparation.')
function showLog(image: Image) {
  logGeneration++
  log.value = { id: image.id, ref: image.ref, text: 'Loading…' }
  void refresh()
}
function closeLog() { logGeneration++; log.value = null }

async function saved() {
  editing.value = null
  adding.value = false
  await refresh()
}

async function remove(image: Image) {
  const ok = await host.confirm({
    header: 'Delete image',
    message: `Delete image "${image.label}"? Tasks keep their history.`,
    icon: 'tabler:trash',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    acceptClass: 'p-button-danger',
  })
  if (!ok) return
  const removeFromDocker = await host.confirm({
    header: 'Docker image',
    message: `Also remove ${image.ref} from Docker on the host? Keeping it lets a later image with the same reference reuse it.`,
    icon: 'tabler:brand-docker',
    acceptLabel: 'Remove from Docker',
    rejectLabel: 'Keep in Docker',
    acceptClass: 'p-button-danger',
  })
  if (editing.value?.image.id === image.id) editing.value = null
  if (log.value?.id === image.id) closeLog()
  await attempt(() => autocode.deleteImage(image.id, removeFromDocker), 'Could not delete the image.')
}
const filtered = computed(() => images.value.filter(i => [i.label, i.ref, ...i.agents].join(' ').toLowerCase().includes(props.query.toLowerCase())))
watch(images, value => emit('count', value.length))
</script>

<template>
  <div class="ac-stack">
    <p class="ac-hint">Ready images with READ access are available to tasks.</p>
    <p v-if="error" class="kx-err" role="alert">{{ error }} <button type="button" class="ac-link kx-focus-outline" @click="refresh">Retry</button></p>
    <div v-if="!loaded && !error" class="kx-loading">Loading images…</div>
    <div v-if="loaded && !images.length" class="kx-empty"><div class="kx-empty-ico"><Icon icon="tabler:box" /></div><div class="kx-empty-title">No images yet</div><div class="kx-empty-sub">Start with the default agent recipe or use an existing image.</div><button class="ac-btn primary kx-focus-halo" @click="adding = true">Add image</button></div>
    <div v-else-if="loaded && !filtered.length" class="kx-empty"><div class="kx-empty-title">No matches</div><div class="kx-empty-sub">Try another image, reference or agent.</div></div>
    <ul class="ac-list ac-resource-list">
      <li v-for="i in filtered" :key="i.id" class="ac-row ac-resource">
        <span class="ac-resource-icon"><Icon icon="tabler:box" /></span>
        <div class="ac-account-main">
          <div class="ac-row-title">{{ i.label }}<span class="kx-tag-sm ac-tone" :class="i.status">{{ i.status }}</span></div>
          <div class="ac-muted ac-mono">{{ i.ref }} · {{ i.home }}</div>
          <div class="ac-chips"><span v-for="a in i.agents" :key="a" class="kx-tag-sm ac-tone"><Icon :icon="agentIcon(a, catalog.agents)" />{{ a }}</span></div>
          <div class="ac-muted">{{ ownership[i.id] }}</div>
          <div v-if="i.last_error" class="kx-err ac-small">{{ i.last_error }}</div>
        </div>
        <div class="ac-row-actions">
          <button v-if="i.writable" type="button" class="ac-icon-btn kx-focus-outline" title="Prepare image" aria-label="Prepare image" :disabled="i.status === 'preparing'" @click="prepare(i)"><Icon icon="tabler:refresh" /></button>
          <button type="button" class="ac-icon-btn kx-focus-outline" title="Build log" aria-label="Build log" @click="showLog(i)"><Icon icon="tabler:file-text" /></button>
          <button v-if="i.writable" type="button" class="ac-icon-btn kx-focus-outline" title="Edit settings" aria-label="Edit settings" @click="edit(i)"><Icon icon="tabler:pencil" /></button>
          <button v-if="i.deletable" type="button" class="ac-icon-btn kx-focus-outline" title="Delete image" aria-label="Delete image" @click="remove(i)"><Icon icon="tabler:trash" /></button>
        </div>
      </li>
    </ul>
    <AppDialog v-if="adding || editing" :title="editing ? 'Edit image' : 'Add image'" wide @close="adding = false; editing = null"><ImageForm :edit="editing" :capabilities="capabilities" @saved="saved" @cancel="adding = false; editing = null" /></AppDialog>
    <AppDialog v-if="log" title="Build log" wide @close="closeLog"><div class="ac-form"><strong class="ac-mono">{{ log.ref }}</strong><pre class="ac-pre ac-build-log">{{ log.text }}</pre></div></AppDialog>
  </div>
</template>
