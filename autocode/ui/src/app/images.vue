<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { host } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { autocode, errorText, serial, grantCount, principalLabels, type Image, type ImageDetail } from './api.ts'
import { useComponentTopics } from './live.ts'
import AppDialog from './app-dialog.vue'
import { agentIcon } from './presentation.ts'
import ImageForm from './image-form.vue'
import ShareDialog from './share-dialog.vue'

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
const sharing = ref<Image | null>(null)

async function readLog(id: string) {
  const detail = await autocode.image(id)
  log.value = { id, ref: detail.image.ref, text: detail.build_log || '(empty)' }
}

// A status change refetches the list and the open build log.
const refresh = serial(async () => {
  try {
    images.value = await autocode.images()
    const labels = await principalLabels([...new Set(images.value.map(i => i.owner))])
    const lines = await Promise.all(images.value.map(async i => [i.id, i.shareable ? `Owner: ${labels[i.owner] || i.owner} · shared with ${await grantCount(i.id)}` : `Shared with you by ${labels[i.owner] || i.owner}`]))
    ownership.value = Object.fromEntries(lines)
    if (log.value && images.value.some((i) => i.id === log.value?.id)) await readLog(log.value.id)
  } catch (e) {
    error.value = errorText(e, 'Could not load images.')
  }
})
useComponentTopics(() => images.value.map((i) => i.id), () => { void refresh() })
useHostVisibilityRefresh(async () => {
  await refresh()
  if (capabilities.value) return
  try {
    const drivers = await autocode.drivers()
    capabilities.value = [...new Set(drivers.flatMap((d) => d.capabilities))].sort()
  } catch (e) {
    error.value = errorText(e, 'Could not load driver capabilities.')
  }
})

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
const showLog = (image: Image) => attempt(() => readLog(image.id), 'Could not load the log.')

async function saved() {
  editing.value = null
  adding.value = false
  await refresh()
}

async function remove(image: Image) {
  const ok = await host.confirm({
    header: 'Delete image',
    message: `Delete image "${image.label}"? Runs keep their history.`,
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
  if (log.value?.id === image.id) log.value = null
  await attempt(() => autocode.deleteImage(image.id, removeFromDocker), 'Could not delete the image.')
}
const filtered = computed(() => images.value.filter(i => [i.label, i.ref, ...i.agents].join(' ').toLowerCase().includes(props.query.toLowerCase())))
watch(images, value => emit('count', value.length))
</script>

<template>
  <div class="ac-stack">
    <p class="ac-hint">Share an image with READ access to let people run agents on it.</p>
    <p v-if="error" class="ac-error" role="alert">{{ error }}</p>
    <div v-if="!images.length" class="kx-empty"><div class="kx-empty-ico"><Icon icon="tabler:box" /></div><div class="kx-empty-title">No images yet</div><div class="kx-empty-sub">Start with the default agent recipe or use an existing image.</div><button class="ac-btn primary kx-focus-halo" @click="adding = true">Add image</button></div>
    <div v-else-if="!filtered.length" class="kx-empty"><div class="kx-empty-title">No matches</div></div>
    <ul class="ac-list ac-resource-list">
      <li v-for="i in filtered" :key="i.id" class="ac-row ac-resource">
        <span class="ac-resource-icon"><Icon icon="tabler:box" /></span>
        <div class="ac-account-main">
          <div class="ac-row-title">{{ i.label }}<span class="kx-tag-sm ac-tone" :class="i.status">{{ i.status }}</span></div>
          <div class="ac-muted ac-mono">{{ i.ref }} · {{ i.home }}</div>
          <div class="ac-chips"><span v-for="a in i.agents" :key="a" class="kx-tag-sm ac-tone"><Icon :icon="agentIcon(a)" />{{ a }}</span></div>
          <div class="ac-muted">{{ ownership[i.id] }}</div>
          <div v-if="i.last_error" class="ac-error ac-small">{{ i.last_error }}</div>
        </div>
        <div class="ac-row-actions">
          <button v-if="i.writable" type="button" class="ac-icon-btn kx-focus-outline" title="Prepare image" aria-label="Prepare image" :disabled="i.status === 'preparing'" @click="prepare(i)"><Icon icon="tabler:refresh" /></button>
          <button type="button" class="ac-icon-btn kx-focus-outline" title="Build log" aria-label="Build log" @click="showLog(i)"><Icon icon="tabler:file-text" /></button>
          <button v-if="i.writable" type="button" class="ac-icon-btn kx-focus-outline" title="Edit settings" aria-label="Edit settings" @click="edit(i)"><Icon icon="tabler:pencil" /></button>
          <button v-if="i.shareable" type="button" class="ac-icon-btn kx-focus-outline" title="Share image" aria-label="Share image" @click="sharing = i"><Icon icon="tabler:user-share" /></button>
          <button v-if="i.writable" type="button" class="ac-icon-btn kx-focus-outline" title="Delete image" aria-label="Delete image" @click="remove(i)"><Icon icon="tabler:trash" /></button>
        </div>
      </li>
    </ul>
    <AppDialog v-if="adding || editing" :title="editing ? 'Edit image' : 'Add image'" wide @close="adding = false; editing = null"><ImageForm :edit="editing" :capabilities="capabilities" @saved="saved" @cancel="adding = false; editing = null" /></AppDialog>
    <AppDialog v-if="log" title="Build log" wide @close="log = null"><div class="ac-form"><strong class="ac-mono">{{ log.ref }}</strong><pre class="ac-pre ac-build-log">{{ log.text }}</pre></div></AppDialog>
    <ShareDialog v-if="sharing" :id="sharing.id" :title="sharing.label" @close="sharing = null" @changed="refresh" />
  </div>
</template>
