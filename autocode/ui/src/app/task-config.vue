<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { useRunClock } from './presentation.ts'
import { ref, computed, watch, nextTick } from 'vue'
import { useProps, useEvents, useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { defaultAgent, driverDefaults, matchingImages } from './defaults.ts'
import DriverOptions from './driver-options.vue'
import { taskConfigSchema, type TaskConfig } from '../task-config-types.ts'
import { autocode, accountState, errorText, serial, type Account, type Catalog, type DriverInfo, type Image, type Workspace } from './api.ts'

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
  if (next && Object.keys(next).length) { config.value = { ...next }; pending.value = false }
  else {
    config.value = {}
    fillEmpty()
  }
})

const catalog = ref<Catalog | null>(null)
const accounts = ref<Account[]>([])
const images = ref<Image[]>([])
const workspaces = ref<Workspace[]>([])
const drivers = ref<DriverInfo[]>([])
const error = ref('')
const invalidOptions = ref(0)
const pending = ref(false)

const agentAccounts = computed(() => accounts.value.filter((a) => a.agent === config.value.agent && a.usable && a.enabled))
const now = useRunClock()
const ready = computed(() => agentAccounts.value.filter((a) => accountState(a, now.value) === 'ready'))
const agentImages = computed(() => matchingImages(images.value, config.value.agent ?? ''))
const driver = computed(() => drivers.value.find((d) => d.id === config.value.agent))

const agentTitle = computed(() => catalog.value?.agents.find(a => a.id === config.value.agent)?.title ?? config.value.agent ?? 'this agent')
const invalidAgent = computed(() => !!config.value.agent && !catalog.value?.agents.some(a => a.id === config.value.agent))
const invalidImage = computed(() => !agentImages.value.some(i => i.id === config.value.image_id))
const invalidAccount = computed(() => !!config.value.account_id && !agentAccounts.value.some(a => a.id === config.value.account_id))
const invalidWorkspace = computed(() => !!config.value.workspace_id && !workspaces.value.some(w => w.id === config.value.workspace_id))
const optionValues = computed(() => ({ ...driverDefaults(driver.value), ...config.value.options }))

function set(patch: Partial<TaskConfig>) {
  const next: TaskConfig = { ...config.value, ...patch }
  config.value = next
  if (invalidOptions.value > 0) { pending.value = true; return }
  pending.value = false
  emit('config-changed', next)
}

function optionsValidity(count: number) {
  invalidOptions.value = count
  if (!count && pending.value) void nextTick(() => { if (!invalidOptions.value && pending.value) set({}) })
}

function chooseAgent(agent: string) {
  invalidOptions.value = 0
  const choices = matchingImages(images.value, agent)
  const nextDriver = drivers.value.find(d => d.id === agent)
  set({ agent, account_id: '', options: driverDefaults(nextDriver), unattended: !!nextDriver?.unattended,
    image_id: choices.find(i => i.id === config.value.image_id)?.id ?? choices[0]?.id ?? '' })
}

// Fill a new node once after all catalogs arrive. Stored selections stay intact
// until the user accepts a replacement, including missing or incompatible ids.
function fillEmpty() {
  if (!catalog.value || configError.value || Object.keys(config.value).length) return
  const agent = defaultAgent(catalog.value, accounts.value)
  const nextDriver = drivers.value.find(d => d.id === agent)
  set({ agent, image_id: matchingImages(images.value, agent)[0]?.id ?? '', account_id: '', workspace_id: '',
    include_input: true, unattended: !!nextDriver?.unattended, options: driverDefaults(nextDriver) })
}

useHostVisibilityRefresh(serial(async () => {
  try {
    const [c, a, i, w, d] = await Promise.all([autocode.catalog(), autocode.accounts(), autocode.images(), autocode.workspaces(), autocode.drivers()])
    catalog.value = c
    accounts.value = a
    images.value = i
    workspaces.value = w.workspaces
    drivers.value = d
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
      <div class="tc-pair">
        <label class="tc-field">
          <span class="tc-lbl">Agent</span>
          <select class="tc-input kx-focus-halo" :value="config.agent" @change="chooseAgent(($event.target as HTMLSelectElement).value)">
            <option v-if="invalidAgent" :value="config.agent">Unavailable agent: {{ config.agent }}</option>
            <option v-for="a in catalog.agents" :key="a.id" :value="a.id">{{ a.title }}</option>
          </select>
        </label>
        <label class="tc-field">
          <span class="tc-lbl">Account</span>
          <select class="tc-input kx-focus-halo" :value="config.account_id ?? ''" @change="set({ account_id: ($event.target as HTMLSelectElement).value })">
            <option value="">Auto ({{ ready.length }} ready)</option>
            <option v-if="invalidAccount" :value="config.account_id">Unavailable account: {{ config.account_id }}</option>
            <option v-for="a in agentAccounts" :key="a.id" :value="a.id">{{ a.label }}</option>
          </select>
        </label>
      </div>
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
          <select class="tc-input kx-focus-halo" :value="config.image_id ?? ''" @change="set({ image_id: ($event.target as HTMLSelectElement).value })">
            <option v-if="invalidImage" :value="config.image_id ?? ''">{{ config.image_id ? 'Unavailable image: ' + config.image_id : 'Choose an image' }}</option>
            <option v-for="i in agentImages" :key="i.id" :value="i.id">{{ i.label }}</option>
          </select>
        </label>
        <label class="tc-field">
          <span class="tc-lbl">Workspace</span>
          <select class="tc-input kx-focus-halo" :value="config.workspace_id ?? ''" @change="set({ workspace_id: ($event.target as HTMLSelectElement).value })">
            <option value="">Scratch directory</option>
            <option v-if="invalidWorkspace" :value="config.workspace_id">Unavailable workspace: {{ config.workspace_id }}</option>
            <option v-for="w in workspaces" :key="w.id" :value="w.id">{{ w.name }}{{ w.writable ? '' : ' (read-only)' }}</option>
          </select>
        </label>
      </div>
      <p v-if="!agentImages.length" class="tc-hint" role="alert">No image with {{ agentTitle }}; ask an administrator.</p>
      <p v-else-if="invalidImage" class="tc-hint" role="alert">This saved image is missing, is not ready or does not include {{ agentTitle }}.
        <button type="button" class="ac-link kx-focus-outline" @click="set({ image_id: agentImages[0].id })">Use {{ agentImages[0].label }}</button>
      </p>
      <p v-if="invalidWorkspace" class="tc-hint" role="alert">This saved workspace no longer exists or is unavailable.
        <button type="button" class="ac-link kx-focus-outline" @click="set({ workspace_id: '' })">Use Scratch</button>
      </p>
      <label class="tc-field">
        <span class="tc-lbl">Task (required)</span>
        <textarea class="tc-input kx-focus-halo" rows="4" :value="config.prompt" placeholder="What should the agent do?"
          @input="set({ prompt: ($event.target as HTMLTextAreaElement).value })" />
      </label>
      <p v-if="!config.prompt?.trim()" class="kx-err" role="alert">Enter a task prompt.</p>
      <p v-if="!config.image_id" class="kx-err" role="alert">Choose an image.</p>
      <label class="tc-check">
        <input type="checkbox" class="kx-focus-outline" :checked="config.include_input !== false" @change="set({ include_input: ($event.target as HTMLInputElement).checked })" />
        Pass the node's input to the agent after the task
      </label>
      <details class="ac-advanced"><summary class="kx-focus-outline">Advanced</summary><div class="tc">
      <label v-if="driver?.unattended" class="tc-check">
        <input type="checkbox" class="kx-focus-outline" :checked="config.unattended !== false" @change="set({ unattended: ($event.target as HTMLInputElement).checked })" />
        Unattended: skip permission prompts
      </label>
      <DriverOptions v-if="driver" :key="driver.id" :options="driver.options" :model-value="optionValues"
        :locked="config.unattended !== false && driver.unattended ? driver.unattended : {}" @invalid="optionsValidity" @update:model-value="(v: Record<string, unknown>) => set({ options: v })" />
      <p v-if="invalidOptions" class="kx-err" role="alert">Driver options are invalid. These drafts and further changes are not applied to the workflow until all options are valid.</p>
      <label class="tc-field">
        <span class="tc-lbl">Git repository</span>
        <input class="tc-input tc-mono kx-focus-halo" :value="config.repo_url" placeholder="optional" @change="set({ repo_url: ($event.target as HTMLInputElement).value })" />
      </label>
      </div></details>
      <p class="tc-hint">Output: <code>run_id</code>, <code>status</code>, <code>answer</code>, <code>error</code>, <code>usage</code>, <code>agent</code>, <code>account_id</code>; next nodes read them as <code>output.answer</code>.</p>
    </template>
  </div>
</template>
