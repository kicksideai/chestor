<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { config, on } from '@wippy-fe/proxy'
import { useEvents, useProps } from '@wippy-fe/webcomponent-vue'
import SettingsRail from '@kickside/ui-kit/SettingsRail.vue'
import type { ComponentEvents, ComponentProps } from '../types.ts'
import { Icon } from '@iconify/vue'
import { useCatalog } from './catalog.ts'
import SettingsHead from './settings-head.vue'
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

function select(value: string) {
  const item = allowedSections.value.find(section => section.id === value)
  if (!item || item.id === section.value) return
  selected.value = item.id
  emit('navigate', { path: settingsPath.value + '?section=' + value })
}
const allowedSections = computed(() => sections.filter(section => catalog.value?.[section.permission]))
const active = computed(() => allowedSections.value.find(section => section.id === selected.value) ?? allowedSections.value[0])
const section = computed(() => active.value?.id)
const railGroups = computed(() => [
  { heading: 'Execution', items: allowedSections.value.filter(item => item.id === 'images' || item.id === 'workspaces' || item.id === 'docker') },
  { heading: 'Configuration', items: allowedSections.value.filter(item => item.id === 'limits' || item.id === 'accounts') },
].filter(group => group.items.length).map(group => ({
  heading: group.heading, items: group.items.map(({ id, label, icon }) => ({ value: id, label, icon })),
})))
const query = ref('')
const imageCount = ref<number>()
const workspaceCount = ref<number>()
const content = ref<HTMLElement>()
const images = ref<InstanceType<typeof ImagesTab> | null>(null)
const workspaces = ref<InstanceType<typeof WorkspacesTab> | null>(null)
const resource = computed(() => {
  if (section.value === 'images') return { title: 'Images', subtitle: 'Manage the container images that run tasks.', count: resourceCount(imageCount.value, 'image', 'images'), action: imageCount.value ? 'Add image' : undefined }
  if (section.value === 'workspaces') return { title: 'Workspaces', subtitle: 'Manage the host directories that tasks can use.', count: resourceCount(workspaceCount.value, 'workspace', 'workspaces'), action: workspaceCount.value ? 'Add workspace' : undefined }
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
// Chromium preserves focus-visible when a pointer clicks the already focused button.
function focusRailWithPointer(event: PointerEvent) {
  if (event.button === 0 && event.target instanceof Element) {
    event.target.closest<HTMLButtonElement>('.kx-settings-rail-item:focus-visible')?.blur()
  }
}
</script>

<template>
  <div class="ac ac-admin">
    <p v-if="error && !catalog" class="kx-err" role="alert">
      {{ error }} <button class="ac-link kx-focus-outline" type="button" @click="load">Retry</button>
    </p>
    <div v-else-if="!catalog" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" /> Loading…</div>
    <p v-else-if="!section" class="ac-muted">Ask an administrator for access to the Autocode settings you need.</p>
    <div v-else class="ac-settings-layout">
      <SettingsRail label="Autocode settings" :value="section" :groups="railGroups" @update:value="select" @pointerdown="focusRailWithPointer" />
      <main ref="content" class="ac-settings-pane" :aria-label="active?.label">
        <div class="ac-settings-content">
          <SettingsHead v-if="resource" v-bind="resource" v-model:query="query" :placeholder="resource.count && resource.action ? `Search ${section}…` : undefined" @create="create" />
          <ImagesTab v-if="catalog.can_images" v-show="section === 'images'" ref="images" :query="section === 'images' ? query : ''" @count="imageCount = $event" />
          <WorkspacesTab v-if="catalog.can_workspaces" v-show="section === 'workspaces'" ref="workspaces" :query="section === 'workspaces' ? query : ''" @count="workspaceCount = $event" />
          <MaintenanceTab v-if="section === 'docker'" />
          <LimitsTab v-if="section === 'limits'" @saved="load" />
          <AccountsTab v-if="catalog.can_accounts" v-show="section === 'accounts'" :active="section === 'accounts'" />
        </div>
      </main>
    </div>
  </div>
</template>
