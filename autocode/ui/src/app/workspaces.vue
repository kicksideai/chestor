<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { host } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { autocode, errorText, serial, type Workspace } from './api.ts'
import AppDialog from './app-dialog.vue'

const props = defineProps<{ query: string }>()
const emit = defineEmits<{ count: [value: number] }>()
const adding = ref(false)
defineExpose({ open: () => { adding.value = true } })
const workspaces = ref<Workspace[]>([])
const roots = ref<string[]>([])
const error = ref('')
const saving = ref(false)
const name = ref('')
const nameEdited = ref(false)
const hostPath = ref('')
const loaded = ref(false)

function rootPath(root: string) { return root.replace(/\/+$/, '') + '/' }
watch([adding, roots], () => {
  if (adding.value && !hostPath.value && roots.value.length) hostPath.value = rootPath(roots.value[0])
})
watch(hostPath, path => {
  if (!nameEdited.value) name.value = path.trim().split('/').filter(Boolean).pop() ?? ''
})

const refresh = serial(async () => {
  try {
    const data = await autocode.workspaces()
    workspaces.value = data.workspaces
    roots.value = data.roots ?? []
    loaded.value = true
    error.value = ''
  } catch (e) {
    error.value = errorText(e, 'Could not load workspaces.')
  }
})
useHostVisibilityRefresh(refresh)

async function save() {
  error.value = ''
  saving.value = true
  try {
    await autocode.createWorkspace({ name: name.value, host_path: hostPath.value })
    nameEdited.value = false
    name.value = ''
    hostPath.value = ''
    adding.value = false
    await refresh()
  } catch (e) {
    error.value = errorText(e, 'Could not save the workspace.')
  } finally {
    saving.value = false
  }
}

async function remove(w: Workspace) {
  const ok = await host.confirm({
    header: 'Delete workspace',
    message: `Delete workspace "${w.name}"? The host directory stays untouched.`,
    icon: 'tabler:trash',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    acceptClass: 'p-button-danger',
  })
  if (!ok) return
  error.value = ''
  try {
    await autocode.deleteWorkspace(w.id)
    await refresh()
  } catch (e) {
    error.value = errorText(e, 'Could not delete the workspace.')
  }
}
const filtered = computed(() => workspaces.value.filter(w => [w.name, w.host_path].join(' ').toLowerCase().includes(props.query.toLowerCase())))
watch(workspaces, value => emit('count', value.length))
</script>

<template>
  <div class="ac-stack">
    <p class="ac-hint">READ mounts a workspace read-only; WRITE allows changes.</p>
    <p v-if="error && !adding" class="kx-err" role="alert">{{ error }} <button type="button" class="ac-link kx-focus-outline" @click="refresh">Retry</button></p>
    <div v-if="!loaded && !error" class="kx-loading">Loading workspaces…</div>
    <div class="ac-chips"><span class="ac-muted">Allowed roots</span><span v-for="r in roots" :key="r" class="ac-hint-chip ac-mono">{{ r }}</span></div>
    <div v-if="loaded && !workspaces.length" class="kx-empty"><div class="kx-empty-ico"><Icon icon="tabler:folder" /></div><div class="kx-empty-title">No workspaces yet</div><div class="kx-empty-sub">Add a host directory, or let tasks use a scratch directory.</div><button class="ac-btn primary kx-focus-halo" @click="adding = true">Add workspace</button></div>
    <div v-else-if="loaded && !filtered.length" class="kx-empty"><div class="kx-empty-title">No matches</div><div class="kx-empty-sub">Try another workspace name or path.</div></div>
    <ul class="ac-list ac-resource-list">
      <li v-for="w in filtered" :key="w.id" class="ac-row ac-resource">
        <span class="ac-resource-icon"><Icon icon="tabler:folder" /></span>
        <div class="ac-account-main"><div class="ac-row-title">{{ w.name }}<span class="kx-tag-sm ac-tone">{{ w.writable ? 'read-write' : 'read-only' }}</span></div><div v-if="w.host_path" class="ac-muted ac-mono">{{ w.host_path }}</div></div>
        <div class="ac-row-actions"><button v-if="w.deletable" type="button" class="ac-icon-btn kx-focus-outline" title="Delete workspace" aria-label="Delete workspace" @click="remove(w)"><Icon icon="tabler:trash" /></button></div>
      </li>
    </ul>
    <AppDialog v-if="adding" title="Add workspace" @close="adding = false">
      <div class="ac-form">
        <p v-if="!roots.length" class="ac-muted">The host administrator configures allowed workspace roots.</p>
        <div v-else class="ac-field"><span>Allowed roots</span><div class="ac-chips"><button v-for="r in roots" :key="r" type="button" class="ac-chip ac-mono kx-focus-halo" title="Start from this root" @click="hostPath = rootPath(r)">{{ r }}</button></div></div>
        <label class="ac-field"><span>Name</span><input v-model="name" @input="nameEdited = true" autofocus class="kx-focus-halo" placeholder="e.g. Kickside checkout" /></label>
        <label class="ac-field"><span>Host directory</span><input v-model="hostPath" class="ac-mono kx-focus-halo" :placeholder="(roots[0] ?? '/srv/work') + '/project'" /><small class="ac-hint">An existing directory, mounted at <code>/workspace</code>.</small></label>
        <p v-if="error" class="kx-err" role="alert">{{ error }}</p>
        <footer class="ac-dialog-foot"><button class="ac-btn kx-focus-halo" @click="adding = false">Cancel</button><button type="button" class="ac-btn primary kx-focus-halo" :disabled="saving || !name || !hostPath" @click="save"><Icon icon="tabler:folder-plus" />{{ saving ? 'Saving…' : 'Add workspace' }}</button></footer>
      </div>
    </AppDialog>
  </div>
</template>
