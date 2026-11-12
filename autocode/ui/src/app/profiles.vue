<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { host } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { useRequiredCatalog } from './catalog.ts'
import { autocode, type Profile, type ProfileInput, type Account, type Image, type Workspace } from './api.ts'
import { serial, useAlive } from './live.ts'
import { errorText } from './presentation.ts'
import AppDialog from './app-dialog.vue'
import DriverOptions from './driver-options.vue'

const alive = useAlive()
const props = defineProps<{ query: string }>()
const emit = defineEmits<{ count: [value: number] }>()
const catalog = useRequiredCatalog()
const profiles = ref<Profile[]>([])
const accounts = ref<Account[]>([])
const images = ref<Image[]>([])
const workspaces = ref<Workspace[]>([])
const error = ref('')
const saveError = ref('')
const loading = ref(true)
const saving = ref(false)
const invalid = ref(0)
const editing = ref<string | null>(null)
const draft = ref<ProfileInput | null>(null)
const endpointProtocol = ref('')
const endpointUrl = ref('')
const endpointModel = ref('')
const driver = computed(() => catalog.value.agents.find(a => a.id === draft.value?.agent))
const shown = computed(() => profiles.value.filter(p => `${p.title} ${p.agent}`.toLowerCase().includes(props.query.toLowerCase())))
const load = serial(async () => {
  try {
    const [p, a, i, w] = await Promise.all([autocode.profiles(), autocode.accounts(), autocode.images(), autocode.workspaces()])
    if (!alive()) return
    profiles.value = p; accounts.value = a; images.value = i; workspaces.value = w.workspaces
    emit('count', p.length)
    error.value = ''
  } catch (e) { if (alive()) error.value = errorText(e, 'Could not load profiles.') }
  finally { if (alive()) loading.value = false }
}, alive)
useHostVisibilityRefresh(load)
function open(profile?: Profile, duplicate = false) {
  editing.value = profile && !duplicate ? profile.id : null
  draft.value = profile ? {
    title: profile.title + (duplicate ? ' copy' : ''), agent: profile.agent, account_id: profile.account_id ?? '',
    account_pool: [...(profile.account_pool ?? [])], image_id: profile.image_id, workspace_id: profile.workspace_id ?? '',
    tools: profile.tools, isolation: profile.isolation, repo_url: profile.repo_url, repo_ref: profile.repo_ref, run_timeout: profile.run_timeout,
    options: JSON.parse(JSON.stringify(profile.options)) as Record<string, unknown>, unattended: profile.unattended,
  } : { title: '', agent: catalog.value.agents[0]?.id ?? '', image_id: '', options: {}, account_pool: [], account_id: '', workspace_id: '' }
  endpointProtocol.value = profile?.endpoint?.protocol ?? driver.value?.endpoints[0] ?? ''
  endpointUrl.value = profile?.endpoint?.base_url ?? ''
  endpointModel.value = profile?.endpoint?.model ?? ''
  invalid.value = 0
  saveError.value = ''
}
function chooseAgent() {
  if (!draft.value) return
  draft.value.account_id = ''
  draft.value.account_pool = []
  draft.value.options = {}
  endpointProtocol.value = driver.value?.endpoints[0] ?? ''
  endpointUrl.value = ''; endpointModel.value = ''
}
async function save() {
  if (!draft.value || saving.value || invalid.value) return
  saving.value = true
  saveError.value = ''
  try {
    const body = { ...draft.value, account_pool: draft.value.account_id ? [] : draft.value.account_pool, endpoint: endpointUrl.value ? { protocol: endpointProtocol.value, base_url: endpointUrl.value.trim(), model: endpointModel.value.trim() || undefined } : { protocol: endpointProtocol.value, base_url: '' } }
    if (editing.value) await autocode.updateProfile(editing.value, body)
    else await autocode.createProfile(body)
    if (!alive()) return
    draft.value = null
    await load()
  } catch (e) { if (alive()) saveError.value = errorText(e, 'Could not save the profile.') }
  finally { if (alive()) saving.value = false }
}
async function remove(profile: Profile) {
  if (!await host.confirm({ header: 'Delete profile', message: `Delete ${profile.title}?`, acceptLabel: 'Delete' })) return
  try { await autocode.deleteProfile(profile.id); await load() }
  catch (e) { if (alive()) error.value = errorText(e, 'Could not delete the profile.') }
}
defineExpose({ open })
</script>

<template>
  <section>
    <p v-if="error" class="kx-err" role="alert">{{ error }}</p>
    <p v-if="!loading && !error && !profiles.length" class="kx-empty">Create a profile to reuse an agent, endpoint and task settings.</p>
    <ul class="ac-list">
      <li v-for="profile in shown" :key="profile.id" class="ac-row ac-account ac-hover-actions">
        <div class="ac-account-main"><div class="ac-row-title"><Icon icon="tabler:robot" /><span class="ac-row-name">{{ profile.title }}</span></div>
          <p class="ac-muted">{{ catalog.agents.find(a => a.id === profile.agent)?.title ?? profile.agent }} · {{ profile.endpoint?.model ?? profile.options.model ?? 'CLI default model' }}</p>
          <p v-if="profile.endpoint" class="ac-muted ac-mono">{{ profile.endpoint.base_url }}</p>
        </div>
        <div class="ac-row-actions">
          <button type="button" class="ac-icon-btn kx-focus-outline" aria-label="Duplicate profile" @click="open(profile, true)"><Icon icon="tabler:copy" /></button>
          <button v-if="profile.writable" type="button" class="ac-icon-btn kx-focus-outline" aria-label="Edit profile" @click="open(profile)"><Icon icon="tabler:pencil" /></button>
          <button v-if="profile.deletable" type="button" class="ac-icon-btn kx-focus-outline" aria-label="Delete profile" @click="remove(profile)"><Icon icon="tabler:trash" /></button>
        </div>
      </li>
    </ul>
    <AppDialog v-if="draft" :title="editing ? 'Edit profile' : 'Create profile'" :busy="saving" @close="draft = null">
      <form class="ac-form" @submit.prevent="save">
        <p v-if="saveError" class="kx-err" role="alert">{{ saveError }}</p>
        <fieldset class="ac-form" :disabled="saving">
          <label class="ac-field"><span>Title</span><input v-model="draft.title" aria-label="Profile title" class="kx-focus-halo" required maxlength="200" /></label>
          <label class="ac-field"><span>Agent</span><select v-model="draft.agent" class="kx-focus-halo" @change="chooseAgent"><option v-for="a in catalog.agents" :key="a.id" :value="a.id">{{ a.title }}</option></select></label>
          <label class="ac-field"><span>Account</span><select v-model="draft.account_id" class="kx-focus-halo"><option value="">Auto balance</option><option v-for="a in accounts.filter(a => a.agent === draft?.agent)" :key="a.id" :value="a.id">{{ a.label }}</option></select></label>
          <label v-if="!draft.account_id" class="ac-field"><span>Account pool (empty uses all usable accounts)</span><select v-model="draft.account_pool" multiple class="kx-focus-halo"><option v-for="a in accounts.filter(a => a.agent === draft?.agent)" :key="a.id" :value="a.id">{{ a.label }}</option></select></label>
          <label class="ac-field"><span>Image</span><select v-model="draft.image_id" required class="kx-focus-halo"><option value="">Choose an image</option><option v-for="i in images.filter(i => i.agents.includes(draft?.agent ?? ''))" :key="i.id" :value="i.id">{{ i.label }}</option></select></label>
          <label class="ac-field"><span>Workspace</span><select v-model="draft.workspace_id" class="kx-focus-halo"><option value="">Scratch directory</option><option v-for="w in workspaces" :key="w.id" :value="w.id">{{ w.name }}</option></select></label>
            <label>Workspace isolation<select v-model="draft.isolation" class="kx-focus-halo" aria-label="Workspace isolation"><option :value="undefined">Workspace default</option><option value="shared">Shared checkout</option><option value="worktree">Private git worktree</option></select></label>
          <template v-if="driver?.endpoints.length">
      <label class="ac-field"><span>Endpoint protocol</span><select v-model="endpointProtocol" class="kx-focus-halo"><option v-for="p in driver.endpoints" :key="p" :value="p">{{ p }}</option></select></label>
            <label class="ac-field"><span>Endpoint URL</span><input v-model="endpointUrl" class="kx-focus-halo" placeholder="Use account endpoint" maxlength="512" /></label>
            <label class="ac-field"><span>Endpoint model</span><input v-model="endpointModel" class="kx-focus-halo" maxlength="200" /></label>
          </template>
          <label class="ac-field"><span>Repository URL</span><input v-model="draft.repo_url" class="kx-focus-halo" maxlength="2000" /></label>
          <label class="ac-field"><span>Repository ref</span><input v-model="draft.repo_ref" class="kx-focus-halo" maxlength="200" /></label>
          <label class="ac-field"><span>Run timeout</span><input v-model="draft.run_timeout" class="kx-focus-halo" placeholder="Use configured timeout" maxlength="64" /></label>
          <label v-if="driver?.unattended" class="ac-check"><input :checked="draft.unattended !== false" @change="draft.unattended = ($event.target as HTMLInputElement).checked" type="checkbox" class="kx-focus-outline" />Unattended</label>
          <DriverOptions v-if="driver" :key="driver.id" v-model="draft.options" :options="driver.options" :defaults="draft.unattended !== false ? driver.unattended : {}" @invalid="invalid = $event" />
          <footer class="ac-dialog-foot"><button type="button" class="ac-btn kx-focus-halo" @click="draft = null">Cancel</button><button type="submit" class="ac-btn primary kx-focus-halo" :disabled="saving || !!invalid">Save</button></footer>
        </fieldset>
      </form>
    </AppDialog>
  </section>
</template>
