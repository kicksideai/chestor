<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { useRunClock } from './presentation.ts'
import { useRequiredCatalog } from './catalog.ts'
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { defaultAgent, driverDefaults, matchingImages } from './defaults.ts'
import AgentPicker from './agent-picker.vue'
import DriverOptions from './driver-options.vue'
import { autocode, accountState, errorText, shortTime, type Account, type DriverInfo, type Image, type Workspace } from './api.ts'

// The new task form. Accounts list the caller's usable, enabled accounts of the
// agent; an empty account balances across the ready ones. Images list the
// ready images that carry the agent's CLI.
const props = defineProps<{ accounts: Account[]; images: Image[]; workspaces: Workspace[]; drivers: DriverInfo[] }>()
const emit = defineEmits<{ started: [id: string]; goto: [tab: 'accounts', agent: string]; agentChanged: [agent: string]; cancel: [] }>()
const catalog = useRequiredCatalog()
const root = ref<HTMLElement | null>(null)

// Images live on the Autocode tab of the System settings.
function openImages() {
  const path = catalog.value.settings_path
  if (!path) return
  root.value?.dispatchEvent(new CustomEvent('navigate', { detail: { path }, bubbles: true, composed: true }))
}

const agentId = ref(defaultAgent(catalog.value, props.accounts))
const accountId = ref('')
const imageId = ref('')
const workspaceId = ref('')
const repoUrl = ref('')
const prompt = ref('')
const options = ref<Record<string, unknown>>({})
const unattended = ref(false)
const invalidOptions = ref(0)
const starting = ref(false)
const error = ref('')

const agent = computed(() => catalog.value.agents.find((a) => a.id === agentId.value))
const driver = computed(() => props.drivers.find((d) => d.id === agentId.value))
const agentAccounts = computed(() => props.accounts.filter((a) => a.agent === agentId.value && a.usable && a.enabled))
const now = useRunClock()
const ready = computed(() => agentAccounts.value.filter((a) => accountState(a, now.value) === 'ready'))
const readyImages = computed(() => matchingImages(props.images, agentId.value))

function accountTitle(a: Account) {
  return accountState(a, now.value) === 'cooling' ? `${a.label} (cooling down until ${shortTime(a.cooldown_until)})` : a.label
}

// The chosen image, account and workspace stay while the lists hold them.
watch([readyImages, agentAccounts, () => props.workspaces], () => {
  if (!readyImages.value.some((i) => i.id === imageId.value)) imageId.value = readyImages.value[0]?.id ?? ''
  if (accountId.value && !agentAccounts.value.some((a) => a.id === accountId.value)) accountId.value = ''
  if (workspaceId.value && !props.workspaces.some((w) => w.id === workspaceId.value)) workspaceId.value = ''
}, { immediate: true })

watch(agentId, () => {
  accountId.value = ''
  invalidOptions.value = 0
  emit('agentChanged', agentId.value)
}, { immediate: true })

watch(() => driver.value?.id, () => {
  const value = driver.value
  options.value = driverDefaults(value)
  unattended.value = !!value?.unattended
}, { immediate: true })

// Unattended mode sets its own option values; drop the member's values for them.
watch(unattended, (on) => {
  const preset = driver.value?.unattended
  if (!on || !preset) return
  const next = { ...options.value }
  for (const name of Object.keys(preset)) delete next[name]
  options.value = next
})

async function start() {
  error.value = ''
  starting.value = true
  try {
    const { id } = await autocode.startRun({
      agent: agentId.value, account_id: accountId.value, image_id: imageId.value, workspace_id: workspaceId.value,
      repo_url: repoUrl.value, prompt: prompt.value, options: options.value, unattended: unattended.value,
    })
    prompt.value = ''
    emit('started', id)
  } catch (e) {
    error.value = errorText(e, 'Could not start the task.')
  } finally {
    starting.value = false
  }
}
</script>

<template>
  <section ref="root" class="ac-form ac-new">
    <label class="ac-field ac-composer"><span>Prompt</span><textarea v-model="prompt" autofocus rows="8" class="kx-focus-halo" placeholder="What should the agent do?" /></label>
    <div class="ac-field"><span>Agent</span><AgentPicker v-model="agentId" :agents="catalog.agents" /></div>
    <p v-if="agentId && !agentAccounts.length" class="ac-muted">
      No {{ agent?.title }} accounts you can run on. <button class="ac-link kx-focus-outline" type="button" @click="emit('goto', 'accounts', agentId)">Add an account</button>
    </p>
    <p v-if="!readyImages.length" class="ac-muted">
      No image with {{ agent?.title ?? agentId }}; ask an administrator.
      <button v-if="catalog.manage && catalog.settings_path" class="ac-link kx-focus-outline" type="button" @click="openImages">Manage images</button>
    </p>
    <div class="ac-picker-row">
      <label class="ac-field">
        <span>Account</span>
        <select v-model="accountId" class="kx-focus-halo">
          <option value="">Auto ({{ ready.length }} ready)</option>
          <option v-for="a in agentAccounts" :key="a.id" :value="a.id">{{ accountTitle(a) }}</option>
        </select>
      </label>
    <label class="ac-field">
      <span>Image</span>
      <select v-model="imageId" class="kx-focus-halo"><option v-for="i in readyImages" :key="i.id" :value="i.id">{{ i.label }}</option></select>
    </label>
    <label class="ac-field">
      <span>Workspace</span>
      <select v-model="workspaceId" class="kx-focus-halo">
        <option value="">Scratch directory</option>
        <option v-for="w in workspaces" :key="w.id" :value="w.id">{{ w.name }}{{ w.writable ? '' : ' (read-only)' }}</option>
      </select>
    </label>
    </div>
    <details class="ac-advanced"><summary class="kx-focus-outline">Advanced</summary><div class="ac-form">
    <label class="ac-field">
      <span>Git repository</span>
      <input v-model="repoUrl" class="ac-mono kx-focus-halo" placeholder="Optional: https://github.com/org/repo.git" />
    </label>
    <label v-if="driver?.unattended" class="ac-check">
      <input v-model="unattended" type="checkbox" class="kx-focus-outline" />
      Unattended · skip permission prompts when the image allows it
    </label>
    <DriverOptions v-if="driver" :key="driver.id" v-model="options" :options="driver.options"
      :locked="unattended && driver.unattended ? driver.unattended : {}" @invalid="(n: number) => (invalidOptions = n)" />
    </div></details>
    <p v-if="error" class="kx-err" role="alert">{{ error }}</p>
    <footer class="ac-dialog-foot"><button type="button" class="ac-btn kx-focus-halo" @click="emit('cancel')">Cancel</button>
    <button type="button" class="ac-btn primary kx-focus-halo"
      :disabled="starting || invalidOptions > 0 || !agentId || !(accountId || ready.length) || !imageId || !prompt.trim()" @click="start">
      <Icon icon="tabler:player-play" /> {{ starting ? 'Starting…' : 'Start' }}
    </button>
    </footer>
  </section>
</template>
