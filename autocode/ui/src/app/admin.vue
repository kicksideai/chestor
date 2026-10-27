<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useCatalog } from './catalog.ts'
import PageHead from './page-head.vue'
import ImagesTab from './images.vue'
import WorkspacesTab from './workspaces.vue'
import MaintenanceTab from './maintenance.vue'

// The Autocode tab of the System settings: the images and workspaces runs
// use, who may use each, and Docker maintenance on the host.
type Tab = 'images' | 'workspaces' | 'docker'
const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'images', label: 'Images', icon: 'tabler:box' },
  { id: 'workspaces', label: 'Workspaces', icon: 'tabler:folder' },
  { id: 'docker', label: 'Docker', icon: 'tabler:brand-docker' },
]

const tab = ref<Tab | undefined>()
const { catalog, error, load } = useCatalog()
const allowedTabs = computed(() => tabs.filter(t => t.id === 'images' ? catalog.value?.can_images : t.id === 'workspaces' ? catalog.value?.can_workspaces : catalog.value?.can_prune))
watch(allowedTabs, list => { if (!list.some(t => t.id === tab.value)) tab.value = list[0]?.id }, { immediate: true })
const query = ref('')
const count = ref(0)
const images = ref<InstanceType<typeof ImagesTab> | null>(null)
const workspaces = ref<InstanceType<typeof WorkspacesTab> | null>(null)
function create() { if (tab.value === 'images') images.value?.open(); else workspaces.value?.open() }
</script>

<template>
  <div class="ac">
    <PageHead title="Autocode" subtitle="Manage agent images, workspaces and Docker." :count="tab && tab !== 'docker' ? `${count} ${count === 1 ? tab.slice(0, -1) : tab}` : undefined" :action="tab === 'images' ? 'Add image' : tab === 'workspaces' ? 'Add workspace' : undefined" v-model:query="query" :placeholder="tab === 'docker' ? undefined : 'Search resources…'" @create="create" />
    <div class="ac-bar">
      <nav class="ac-tabs" aria-label="Autocode management">
        <button v-for="t in allowedTabs" :key="t.id" type="button" class="ac-tab kx-focus-outline" :class="{ active: tab === t.id }" :aria-pressed="tab === t.id" @click="tab = t.id; query = ''; count = 0">
          <Icon :icon="t.icon" /> {{ t.label }}
        </button>
      </nav>
    </div>

    <p v-if="error && !catalog" class="kx-err">
      {{ error }} <button class="ac-link kx-focus-outline" type="button" @click="load">Retry</button>
    </p>
    <div v-else-if="!catalog" class="kx-loading"><Icon icon="tabler:loader-2" class="spin" /> Loading…</div>
    <main v-else class="ac-body">
      <ImagesTab v-if="tab === 'images'" ref="images" :query="query" @count="count = $event" />
      <WorkspacesTab v-else-if="tab === 'workspaces'" ref="workspaces" :query="query" @count="count = $event" />
      <MaintenanceTab v-else-if="tab === 'docker'" />
      <p v-else class="ac-muted">No management areas are available.</p>
    </main>
  </div>
</template>
