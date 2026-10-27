<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { useRequiredCatalog } from './catalog.ts'
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { host } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { autocode, principalLabels, type Image, type ImageDetail } from './api.ts'
import { useComponentTopics, serial } from './live.ts'
import ShareControl from './share-control.vue'
import AppDialog from './app-dialog.vue'
import { agentIcon, errorText } from './presentation.ts'
import ImageForm from './image-form.vue'

const catalog = useRequiredCatalog()
const props = defineProps<{ query: string }>()
const emit = defineEmits<{ count: [value: number] }>()
const adding = ref(false)
const saving = ref(false)
const ownership = ref<Record<string, string>>({})
defineExpose({ open: openAdd })
const images = ref<Image[]>([])
const topicIds = ref<string[]>([])
const error = ref('')
const editing = ref<ImageDetail | null>(null)
const log = ref<{ id: string; ref: string; text: string } | null>(null)
const capabilities = computed(() => [...new Set(catalog.value.agents.flatMap(d => d.capabilities))].sort())
const loaded = ref(false)
let alive = true
let logGeneration = 0
let editGeneration = 0
let ownershipGeneration = 0
onUnmounted(() => { alive = false; logGeneration++; editGeneration++ })

async function readLog(id: string) {
  const generation = logGeneration
  const detail = await autocode.image(id)
  if (!alive || generation !== logGeneration || log.value?.id !== id) return
  log.value = { id, ref: detail.image.ref, text: detail.build_log || '(empty)' }
}

// A status change refetches the list and the open build log.
const refresh = serial(async () => {
  try {
    let list = await autocode.images()
    // Subscribe to discovered IDs before reconciling their current state.
    while (alive && list.some(i => !topicIds.value.includes(i.id))) {
      topicIds.value = list.map(i => i.id)
      await nextTick()
      list = await autocode.images()
    }
    if (!alive) return
    topicIds.value = list.map(i => i.id)
    images.value = list
    void readOwnership(list, ++ownershipGeneration)
    if (log.value && list.some(i => i.id === log.value?.id)) await readLog(log.value.id)
    loaded.value = true
    error.value = ''
  } catch (e) {
    error.value = errorText(e, 'Could not load images.')
  }
})
async function readOwnership(list: Image[], generation: number) {
  try {
    const labels = await principalLabels([...new Set(list.map(i => i.owner))])
    if (!alive || generation !== ownershipGeneration) return
    ownership.value = Object.fromEntries(list.map(i => [i.id, `Owner: ${labels[i.owner] || i.owner}`]))
  } catch (e) {
    if (alive && generation === ownershipGeneration) error.value = errorText(e, 'Could not load image owners.')
  }
}
useComponentTopics(() => topicIds.value, () => { void refresh() })
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

async function edit(image: Image) {
  const generation = ++editGeneration
  error.value = ''
  try {
    const detail = await autocode.image(image.id)
    if (alive && generation === editGeneration) editing.value = detail
  } catch (e) {
    if (alive && generation === editGeneration) error.value = errorText(e, 'Could not load the image settings.')
  }
}
function closeEdit() { editGeneration++; adding.value = false; editing.value = null }
function openAdd() { closeEdit(); adding.value = true }
const prepare = (image: Image) => attempt(() => autocode.prepareImage(image.id), 'Could not start the image preparation.')
function showLog(image: Image) {
  logGeneration++
  log.value = { id: image.id, ref: image.ref, text: 'Loading…' }
  void refresh()
}
function closeLog() { logGeneration++; log.value = null }

async function saved(warning?: string) {
  closeEdit()
  await refresh()
  if (warning) error.value = warning
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
  editGeneration++
  if (editing.value?.image.id === image.id) closeEdit()
  if (log.value?.id === image.id) closeLog()
  error.value = ''
  try {
    const result = await autocode.deleteImage(image.id, removeFromDocker)
    await refresh()
    if (result.docker_error) error.value = `Image deleted. Docker cleanup failed: ${result.docker_error.message}. Docker prune covers removal of unused images.`
  } catch (e) {
    error.value = errorText(e, 'Could not delete the image.')
  }
}
const filtered = computed(() => images.value.filter(i => [i.label, i.ref, ...i.agents].join(' ').toLowerCase().includes(props.query.toLowerCase())))
watch(images, value => emit('count', value.length))
</script>

<template>
  <div class="ac-stack">
    <p class="ac-hint">Share ready images to make them available for tasks.</p>
    <p v-if="error" class="kx-err" role="alert">{{ error }} <button type="button" class="ac-link kx-focus-outline" @click="refresh">Retry</button></p>
    <div v-if="!loaded && !error" class="kx-loading">Loading images…</div>
    <div v-if="loaded && !images.length" class="kx-empty"><div class="kx-empty-ico"><Icon icon="tabler:box" /></div><div class="kx-empty-title">No images yet</div><div class="kx-empty-sub">Start with the default agent recipe or use an existing image.</div><button class="ac-btn primary kx-focus-halo" @click="openAdd">Add image</button></div>
    <div v-else-if="loaded && !filtered.length" class="kx-empty"><div class="kx-empty-title">No matches</div><div class="kx-empty-sub">Try another image, reference or agent.</div></div>
    <ul class="ac-list ac-resource-list">
      <li v-for="i in filtered" :key="i.id" class="ac-row ac-resource">
        <span class="ac-resource-icon"><Icon icon="tabler:box" /></span>
        <div class="ac-account-main">
          <div class="ac-row-title">{{ i.label }}<span class="kx-tag-sm ac-tone" :class="i.status">{{ i.status === 'unprepared' ? 'Needs preparation' : i.status.charAt(0).toUpperCase() + i.status.slice(1) }}</span><span v-if="i.usable" class="kx-tag-sm ac-tone ready">Usable</span></div>
          <div class="ac-muted ac-mono">{{ i.ref }} · {{ i.home }}</div>
          <div class="ac-chips"><span v-for="a in i.agents" :key="a" class="kx-tag-sm ac-tone"><Icon :icon="agentIcon(a, catalog.agents)" />{{ a }}</span></div>
          <div class="ac-muted">{{ ownership[i.id] }}</div>
          <div v-if="i.last_error" class="kx-err ac-small">{{ i.last_error }}</div>
        </div>
        <div class="ac-row-actions"><ShareControl v-if="i.shareable" :id="i.id" :title="i.label" />
          <button v-if="i.writable" type="button" class="ac-icon-btn kx-focus-outline" title="Prepare image" aria-label="Prepare image" :disabled="i.status === 'preparing'" @click="prepare(i)"><Icon icon="tabler:refresh" /></button>
          <button type="button" class="ac-icon-btn kx-focus-outline" title="Build log" aria-label="Build log" @click="showLog(i)"><Icon icon="tabler:file-text" /></button>
          <button v-if="i.writable" type="button" class="ac-icon-btn kx-focus-outline" title="Edit settings" aria-label="Edit settings" @click="edit(i)"><Icon icon="tabler:pencil" /></button>
          <button v-if="i.deletable" type="button" class="ac-icon-btn kx-focus-outline" title="Delete image" aria-label="Delete image" @click="remove(i)"><Icon icon="tabler:trash" /></button>
        </div>
      </li>
    </ul>
    <AppDialog v-if="adding || editing" :title="editing ? 'Edit image' : 'Add image'" :busy="saving" wide @close="closeEdit()"><ImageForm @busy="saving = $event" :edit="editing" :capabilities="capabilities" @saved="saved" @cancel="closeEdit()" /></AppDialog>
    <AppDialog v-if="log" title="Build log" wide @close="closeLog"><div class="ac-form"><strong class="ac-mono">{{ log.ref }}</strong><pre class="ac-pre ac-build-log">{{ log.text }}</pre></div></AppDialog>
  </div>
</template>
