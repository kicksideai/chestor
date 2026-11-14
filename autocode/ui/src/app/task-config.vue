<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { errorText } from './presentation.ts'
import { ref, computed, watch, nextTick } from 'vue'
import { useProps, useEvents, useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { defaultAgent } from './defaults.ts'
import { useTaskTargeting, effectiveTask } from './task-targeting.ts'
import DriverOptions from './driver-options.vue'
import { taskConfigSchema, type TaskConfig } from '../task-config-types.ts'
import { autocode, type Account, type Catalog, type Image, type Workspace, type Profile } from './api.ts'
import { serial } from './live.ts'

// The config editor of the coding agent task Block: the agent, one of its
// usable accounts or balancing, an image that carries the agent's CLI, a workspace,
// the task, and the agent driver's own options. The workflow owns the value;
// valid edits emit the whole config; invalid drafts remain local.
const props = useProps<{ config?: TaskConfig | null }>()
const emit = useEvents<{ 'config-changed': TaskConfig }>()

const decoded = computed(() => taskConfigSchema.safeParse(props.value.config ?? {}))
const configError = computed(() => decoded.value.success ? '' : 'Workflow configuration is invalid.')
const config = ref<TaskConfig>(decoded.value.success ? decoded.value.data : {})
watch(decoded, result => {
  if (!result.success) return
  const next = result.data
  if (next && Object.keys(next).length) { config.value = next; pending.value = false }
  else {
    config.value = {}
    fillEmpty()
  }
})

const catalog = ref<Catalog | null>(null)
const accounts = ref<Account[]>([])
const images = ref<Image[]>([])
const workspaces = ref<Workspace[]>([])
const profiles = ref<Profile[]>([])
const selectedProfile = computed(() => profiles.value.find(p => p.id === config.value.profile_id))
const inherited = computed(() => effectiveTask(config.value, selectedProfile.value))
const error = ref('')
const pending = ref(false)

const { driver, agentAccounts, ready, agentImages, invalidAgent, invalidImage, invalidAccount, invalidWorkspace,
  invalidOptions, optionValues, initialSelection } = useTaskTargeting(inherited, {
  catalog: () => catalog.value, accounts: () => accounts.value, images: () => images.value, workspaces: () => workspaces.value,
}, 'saved')
const agentTitle = computed(() => driver.value?.title ?? config.value.agent ?? 'this agent')

function set(patch: Partial<TaskConfig>) {
  const next = { ...config.value, ...patch }
  config.value = next
  if (invalidOptions.value > 0) { pending.value = true; return }
  pending.value = false
  emit('config-changed', next)
}

function setEndpoint(field: 'protocol' | 'base_url' | 'model', value: string) {
  set({ endpoint: { protocol: inherited.value.endpoint?.protocol ?? driver.value?.endpoints[0] ?? '',
    base_url: inherited.value.endpoint?.base_url ?? '', ...inherited.value.endpoint, [field]: value } })
}

function optionsValidity(count: number) {
  invalidOptions.value = count
  if (!count && pending.value) void nextTick(() => { if (!invalidOptions.value && pending.value) set({}) })
}

function chooseAgent(agent: string) {
  set({ agent, account_id: '', image_id: images.value.find(i => i.usable && i.agents.includes(agent))?.id, options: {} })
}
function chooseProfile(id: string) {
  const next: TaskConfig = id ? { profile_id: id, prompt: config.value.prompt, include_input: config.value.include_input } : { ...initialSelection(), profile_id: undefined, prompt: config.value.prompt }
  config.value = next
  pending.value = false
  invalidOptions.value = 0
  emit('config-changed', next)
}

// Fill a new node once after all catalogs arrive. Stored selections stay intact
// until the user accepts a replacement, including missing or incompatible ids.
function fillEmpty() {
  if (!catalog.value || configError.value || Object.keys(config.value).length) return
  set({ ...initialSelection(), include_input: true })
}

useHostVisibilityRefresh(serial(async () => {
  try {
    const [c, a, i, w, p] = await Promise.all([autocode.catalog(), autocode.accounts(), autocode.images(), autocode.workspaces(), autocode.profiles()])
    profiles.value = p
    catalog.value = c
    accounts.value = a
    images.value = i
    workspaces.value = w.workspaces
    error.value = ''
    fillEmpty()
  } catch (e) {
    error.value = errorText(e, 'Could not load the agents.')
  }
}))
</script>

<template>
  <div class="tc">
    <p v-if="configError" class="kx-err" role="alert">{{ configError }}</p>
    <p v-if="error" class="kx-err inline">{{ error }}</p>
    <div v-else-if="!catalog" class="kx-loading">Loading agents…</div>
    <template v-else-if="!configError">
      <label class="tc-field"><span class="tc-lbl">Profile</span>
        <select class="tc-input kx-focus-halo" aria-label="Profile" :value="config.profile_id ?? ''" @change="chooseProfile(($event.target as HTMLSelectElement).value)">
          <option value="">Custom task</option>
          <option v-if="config.profile_id && !selectedProfile" :value="config.profile_id">Unavailable profile: {{ config.profile_id }}</option>
          <option v-for="p in profiles" :key="p.id" :value="p.id">{{ p.title }}</option>
        </select>
      </label>
      <p v-if="selectedProfile" class="tc-hint">Profile defaults apply at submission. Each field you edit overrides the profile; explicit driver options override unattended presets.</p>
      <div class="tc-pair">
        <label class="tc-field">
          <span class="tc-lbl">Agent</span>
          <select class="tc-input kx-focus-halo" aria-label="Agent" :value="inherited.agent" @change="chooseAgent(($event.target as HTMLSelectElement).value)">
            <option v-if="invalidAgent" aria-label="Agent" :value="inherited.agent">Unavailable agent: {{ inherited.agent }}</option>
            <option v-for="a in catalog.agents" :key="a.id" :value="a.id">{{ a.title }}</option>
          </select>
        </label>
        <label class="tc-field">
          <span class="tc-lbl">Account</span>
          <select class="tc-input kx-focus-halo" :value="inherited.account_id ?? ''" @change="set({ account_id: ($event.target as HTMLSelectElement).value, account_pool: [] })">
            <option value="">Auto ({{ ready.length }} ready)</option>
            <option v-if="invalidAccount" :value="inherited.account_id">Unavailable account: {{ inherited.account_id }}</option>
            <option v-for="a in agentAccounts" :key="a.id" :value="a.id">{{ a.label }}</option>
          </select>
        </label>
      </div>
      <label v-if="!inherited.account_id" class="tc-field"><span class="tc-lbl">Account pool (empty uses all usable accounts)</span>
        <select multiple class="tc-input kx-focus-halo" :value="inherited.account_pool ?? []" @change="set({ account_id: '', account_pool: Array.from(($event.target as HTMLSelectElement).selectedOptions, option => option.value) })"><option v-for="a in agentAccounts" :key="a.id" :value="a.id">{{ a.label }}</option></select>
      </label>
      <p v-if="invalidAgent" class="tc-hint" role="alert">This saved agent no longer exists.
        <button v-if="catalog.agents.length" type="button" class="ac-link kx-focus-outline" @click="chooseAgent(defaultAgent(catalog, accounts))">Use default agent</button>
      </p>
      <p v-if="invalidAccount" class="tc-hint" role="alert">This saved account no longer exists, is disabled or cannot run {{ agentTitle }}.
        <button type="button" class="ac-link kx-focus-outline" @click="set({ account_id: '' })">Use Auto</button>
      </p>
      <p v-if="!agentAccounts.length" class="tc-hint">Add an account on Autocode → Accounts to run {{ agentTitle }}.</p>
      <div class="tc-pair">
        <label class="tc-field">
          <span class="tc-lbl">Image (required)</span>
          <select class="tc-input kx-focus-halo" :value="inherited.image_id ?? ''" @change="set({ image_id: ($event.target as HTMLSelectElement).value })">
            <option v-if="invalidImage" :value="inherited.image_id ?? ''">{{ inherited.image_id ? 'Unavailable image: ' + inherited.image_id : 'Choose an image' }}</option>
            <option v-for="i in agentImages" :key="i.id" :value="i.id">{{ i.label }}</option>
          </select>
        </label>
        <label class="tc-field">
          <span class="tc-lbl">Workspace</span>
          <select class="tc-input kx-focus-halo" :value="inherited.workspace_id ?? ''" @change="set({ workspace_id: ($event.target as HTMLSelectElement).value })">
            <option value="">Scratch directory</option>
            <option v-if="invalidWorkspace" :value="inherited.workspace_id">Unavailable workspace: {{ inherited.workspace_id }}</option>
            <option v-for="w in workspaces" :key="w.id" :value="w.id">{{ w.name }}{{ w.writable ? '' : ' (read-only)' }}</option>
          </select>
        </label>
      </div>
      <p v-if="!agentImages.length" class="tc-hint" role="alert">No image with {{ agentTitle }}; ask an administrator.</p>
      <p v-else-if="invalidImage" class="tc-hint" role="alert">This saved image is missing, is not usable or does not include {{ agentTitle }}.
        <button type="button" class="ac-link kx-focus-outline" @click="set({ image_id: agentImages[0].id })">Use {{ agentImages[0].label }}</button>
      </p>
      <p v-if="invalidWorkspace" class="tc-hint" role="alert">This saved workspace no longer exists or is unavailable.
        <button type="button" class="ac-link kx-focus-outline" @click="set({ workspace_id: '' })">Use Scratch</button>
      </p>
      <label class="tc-field">
        <span class="tc-lbl">Task (required)</span>
        <textarea class="tc-input kx-focus-halo" rows="4" :value="inherited.prompt" placeholder="What should the agent do?"
          @input="set({ prompt: ($event.target as HTMLTextAreaElement).value })" />
      </label>
      <p v-if="!inherited.prompt?.trim()" class="kx-err" role="alert">Enter a task prompt.</p>
      <p v-if="!inherited.image_id && !config.profile_id" class="kx-err" role="alert">Choose an image.</p>
      <label class="tc-check">
        <input type="checkbox" class="kx-focus-outline" :checked="inherited.include_input !== false" @change="set({ include_input: ($event.target as HTMLInputElement).checked })" />
        Pass the node's input to the agent after the task
      </label>
      <details class="ac-advanced"><summary class="kx-focus-outline">Advanced</summary><div class="tc">
      <label v-if="driver?.unattended" class="tc-check">
        <input type="checkbox" class="kx-focus-outline" :checked="inherited.unattended !== false" @change="set({ unattended: ($event.target as HTMLInputElement).checked })" />
        Unattended: skip permission prompts
      </label>
      <template v-if="driver?.endpoints.length">
        <label class="tc-field"><span class="tc-lbl">Endpoint protocol</span><select class="tc-input kx-focus-halo" :value="inherited.endpoint?.protocol ?? driver.endpoints[0]" @change="setEndpoint('protocol', ($event.target as HTMLSelectElement).value)"><option v-for="protocol in driver.endpoints" :key="protocol" :value="protocol">{{ protocol }}</option></select></label>
        <label class="tc-field"><span class="tc-lbl">Endpoint URL</span><input class="tc-input kx-focus-halo" :value="inherited.endpoint?.base_url" placeholder="Use account endpoint" @change="setEndpoint('base_url', ($event.target as HTMLInputElement).value.trim())" /></label>
        <label class="tc-field"><span class="tc-lbl">Endpoint model</span><input class="tc-input kx-focus-halo" :value="inherited.endpoint?.model" @change="setEndpoint('model', ($event.target as HTMLInputElement).value.trim())" /></label>
      </template>
      <DriverOptions v-if="driver" :key="(config.profile_id ?? '') + driver.id" :options="driver.options" :model-value="optionValues" :defaults="{ ...(inherited.unattended !== false ? driver.unattended : {}), ...selectedProfile?.options }" @invalid="optionsValidity" @update:model-value="(v: Record<string, unknown>) => set({ options: v })" />
      <p v-if="invalidOptions" class="kx-err" role="alert">Driver options are invalid. These drafts and further changes are not applied to the workflow until all options are valid.</p>
      <label class="tc-field">
        <span class="tc-lbl">Run timeout</span>
        <input class="tc-input tc-mono kx-focus-halo" :value="inherited.run_timeout" placeholder="Use configured timeout" @change="set({ run_timeout: ($event.target as HTMLInputElement).value.trim() })" />
      </label>
      <label class="tc-field">
        <span class="tc-lbl">Git repository</span>
        <input class="tc-input tc-mono kx-focus-halo" :value="inherited.repo_url" placeholder="optional" @change="set({ repo_url: ($event.target as HTMLInputElement).value })" />
      </label>
      <label class="tc-field">
        <span class="tc-lbl">Repository ref</span>
        <input class="tc-input tc-mono kx-focus-halo" aria-label="Repository ref" :value="inherited.repo_ref" placeholder="Default branch" @change="set({ repo_ref: ($event.target as HTMLInputElement).value.trim() })" />
      </label>
      </div></details>
      <p class="tc-hint">Output: <code>run_id</code>, <code>status</code>, <code>answer</code>, <code>error</code>, <code>usage</code>, <code>agent</code>, <code>account_id</code>; next nodes read them as <code>output.answer</code>.</p>
    </template>
  </div>
</template>
