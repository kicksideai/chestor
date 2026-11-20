<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useCatalog } from './catalog.ts'
import PageHead from './page-head.vue'
import ImagesTab from './images.vue'
import WorkspacesTab from './workspaces.vue'
import MaintenanceTab from './maintenance.vue'
import LimitsTab from './limits.vue'
import AccountsTab from './account-management.vue'

type Tab = 'images' | 'workspaces' | 'docker' | 'limits' | 'accounts'
const tabs: { id: Tab; label: string; icon: string; permission: 'can_images' | 'can_workspaces' | 'can_prune' | 'can_limits' | 'can_accounts' }[] = [
  { id: 'images', label: 'Images', icon: 'tabler:box', permission: 'can_images' },
  { id: 'workspaces', label: 'Workspaces', icon: 'tabler:folder', permission: 'can_workspaces' },
  { id: 'docker', label: 'Docker', icon: 'tabler:brand-docker', permission: 'can_prune' },
  { id: 'limits', label: 'Limits', icon: 'tabler:adjustments', permission: 'can_limits' },
  { id: 'accounts', label: 'Accounts', icon: 'tabler:key', permission: 'can_accounts' },
]

const tab = ref<Tab | undefined>()
const { catalog, error, load } = useCatalog()
const allowedTabs = computed(() => tabs.filter(t => catalog.value?.[t.permission]))
watch(allowedTabs, list => { if (!list.some(t => t.id === tab.value)) tab.value = list[0]?.id }, { immediate: true })
const query = ref('')
const imageCount = ref(0)
const workspaceCount = ref(0)
const searchable = computed(() => tab.value === 'images' || tab.value === 'workspaces')
const count = computed(() => tab.value === 'images' ? imageCount.value : workspaceCount.value)
const images = ref<InstanceType<typeof ImagesTab> | null>(null)
const workspaces = ref<InstanceType<typeof WorkspacesTab> | null>(null)
function create() { if (tab.value === 'images') images.value?.open(); else workspaces.value?.open() }
</script>

<template>
  <div class="ac">
    <PageHead title="Autocode" subtitle="Configure where tasks run, which accounts they use and what limits apply." :count="tab && searchable ? `${count} ${count === 1 ? tab.slice(0, -1) : tab}` : undefined" :action="tab === 'images' && imageCount ? 'Add image' : tab === 'workspaces' && workspaceCount ? 'Add workspace' : undefined" v-model:query="query" :placeholder="searchable ? 'Search resources…' : undefined" @create="create" />
    <div class="ac-bar">
      <nav class="ac-tabs" aria-label="Autocode management">
        <button v-for="t in allowedTabs" :key="t.id" type="button" class="ac-tab kx-focus-outline" :class="{ active: tab === t.id }" :aria-pressed="tab === t.id" @click="if (tab !== t.id) { tab = t.id; query = '' }">
          <Icon :icon="t.icon" /> {{ t.label }}
        </button>
      </nav>
    </div>

    <p v-if="error && !catalog" class="kx-err">
      {{ error }} <button class="ac-link kx-focus-outline" type="button" @click="load">Retry</button>
    </p>
    <div v-else-if="!catalog" class="kx-loading"><Icon icon="tabler:loader-2" class="spin" /> Loading…</div>
    <main v-else class="ac-body">
      <ImagesTab v-if="tab === 'images'" ref="images" :query="query" @count="imageCount = $event" />
      <WorkspacesTab v-if="catalog.can_workspaces" v-show="tab === 'workspaces'" ref="workspaces" :query="query" @count="workspaceCount = $event" />
      <MaintenanceTab v-if="tab === 'docker'" />
      <LimitsTab v-if="tab === 'limits'" @saved="load" />
      <AccountsTab v-if="tab === 'accounts'" />
      <p v-if="!tab" class="ac-muted">No management areas are available.</p>
    </main>
  </div>
</template>
