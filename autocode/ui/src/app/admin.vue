<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { config, on } from '@wippy-fe/proxy'
import { useEvents, useProps } from '@wippy-fe/webcomponent-vue'
import Listbox from 'primevue/listbox'
import type { ComponentEvents, ComponentProps } from '../types.ts'
import { Icon } from '@iconify/vue'
import { useCatalog } from './catalog.ts'
import PageHead from './page-head.vue'
import ImagesTab from './images.vue'
import WorkspacesTab from './workspaces.vue'
import MaintenanceTab from './maintenance.vue'
import LimitsTab from './limits.vue'
import AccountsTab from './account-management.vue'

const sections = [
  { id: 'images', label: 'Images', icon: 'tabler:box', permission: 'can_images' },
  { id: 'workspaces', label: 'Workspaces', icon: 'tabler:folder', permission: 'can_workspaces' },
  { id: 'docker', label: 'Docker', icon: 'tabler:brand-docker', permission: 'can_prune' },
  { id: 'limits', label: 'Limits', icon: 'tabler:adjustments', permission: 'can_limits' },
  { id: 'accounts', label: 'Accounts', icon: 'tabler:key', permission: 'can_accounts' },
] as const

type Section = typeof sections[number]['id']
const props = useProps<ComponentProps>()
const emit = useEvents<ComponentEvents>()
const { catalog, error, load } = useCatalog()
const settingsPath = computed(() => catalog.value?.settings_path || '/system/autocode')
const selected = ref(sectionFromPath(props.value.route?.includes('?') ? props.value.route : config.context?.route))
const stop = on('@history', ({ path }) => {
  if (path.split(/[?#]/, 1)[0] === settingsPath.value) selected.value = sectionFromPath(path)
})
onUnmounted(stop)
watch(() => props.value.route, path => {
  if (path?.includes('?')) selected.value = sectionFromPath(path)
})

function sectionFromPath(path?: string): Section | undefined {
  const value = new URLSearchParams(path?.split('?')[1]?.split('#', 1)[0]).get('section')
  return sections.find(item => item.id === value)?.id
}

async function select(value: Section | null) {
  if (!value) {
    // Listbox permits deselecting an option. A settings view always has a
    // current section, including after tapping the selected row.
    listboxValue.value = null
    await nextTick()
    listboxValue.value = section.value ?? null
    return
  }
  if (value === section.value) return
  selected.value = value
  emit('navigate', { path: settingsPath.value + '?section=' + value })
}
const allowedSections = computed(() => sections.filter(section => catalog.value?.[section.permission]))
const active = computed(() => allowedSections.value.find(section => section.id === selected.value) ?? allowedSections.value[0])
const section = computed(() => active.value?.id)
const listboxValue = ref<Section | null>(null)
watch(section, value => { listboxValue.value = value ?? null }, { immediate: true })
const query = ref('')
const imageCount = ref<number>()
const workspaceCount = ref<number>()
const accountStatus = ref<string>()
const content = ref<HTMLElement>()
const images = ref<InstanceType<typeof ImagesTab> | null>(null)
const workspaces = ref<InstanceType<typeof WorkspacesTab> | null>(null)
const hints = computed<Record<Section, string>>(() => ({
  images: resourceCount(imageCount.value, 'image', 'images') ?? 'Execution images',
  workspaces: resourceCount(workspaceCount.value, 'workspace', 'workspaces') ?? 'Host directories',
  docker: `${catalog.value?.build_cache_retention} cache retention`,
  limits: 'Run and resource defaults',
  accounts: accountStatus.value ?? 'Provider credentials',
}))
const resource = computed(() => {
  if (section.value === 'images') return { title: 'Images', subtitle: 'Manage the container images that run tasks.', icon: 'tabler:box', action: imageCount.value ? 'Add image' : undefined }
  if (section.value === 'workspaces') return { title: 'Workspaces', subtitle: 'Manage the host directories that tasks can use.', icon: 'tabler:folder', action: workspaceCount.value ? 'Add workspace' : undefined }
})
watch(section, () => {
  query.value = ''
  if (content.value) content.value.scrollTop = 0
})

function resourceCount(count: number | undefined, singular: string, plural: string) {
  return count === undefined ? undefined : `${count} ${count === 1 ? singular : plural}`
}

function create() {
  if (section.value === 'images') images.value?.open()
  else if (section.value === 'workspaces') workspaces.value?.open()
}
</script>

<template>
  <div class="ac ac-admin">
    <p v-if="error && !catalog" class="kx-err" role="alert">
      {{ error }} <button class="ac-link kx-focus-outline" type="button" @click="load">Retry</button>
    </p>
    <div v-else-if="!catalog" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" /> Loading…</div>
    <p v-else-if="!section" class="ac-muted">No management areas are available.</p>
    <div v-else class="kx-shell">
      <nav class="kx-rail" aria-label="Autocode sections">
        <div class="kx-rail-body">
          <Listbox :model-value="listboxValue" :options="allowedSections" option-label="label" option-value="id"
            aria-label="Autocode settings" scroll-height="none" :select-on-focus="false" :meta-key-selection="true" @update:model-value="select">
            <template #option="{ option }">
              <span class="ac-section">
                <Icon :icon="option.icon" aria-hidden="true" />
                <span>{{ option.label }}<small>{{ hints[option.id as Section] }}</small></span>
              </span>
            </template>
          </Listbox>
        </div>
      </nav>
      <main class="kx-main" :aria-label="active?.label">
        <div ref="content" class="kx-main-scroll">
          <PageHead v-if="resource" v-bind="resource" v-model:query="query" :placeholder="`Search ${section}…`" @create="create" />
          <ImagesTab v-if="catalog.can_images" v-show="section === 'images'" ref="images" :query="section === 'images' ? query : ''" @count="imageCount = $event" />
          <WorkspacesTab v-if="catalog.can_workspaces" v-show="section === 'workspaces'" ref="workspaces" :query="section === 'workspaces' ? query : ''" @count="workspaceCount = $event" />
          <MaintenanceTab v-if="section === 'docker'" />
          <LimitsTab v-if="section === 'limits'" @saved="load" />
          <AccountsTab v-if="catalog.can_accounts" v-show="section === 'accounts'" :active="section === 'accounts'" @status="accountStatus = $event" />
        </div>
      </main>
    </div>
  </div>
</template>
