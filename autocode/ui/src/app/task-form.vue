<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { accountState, errorText, shortTime } from './presentation.ts'
import { useRequiredCatalog } from './catalog.ts'
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { defaultAgent } from './defaults.ts'
import { useTaskTargeting } from './task-targeting.ts'
import type { TaskConfig } from '../task-config-types.ts'
import AgentPicker from './agent-picker.vue'
import DriverOptions from './driver-options.vue'
import { autocode, type Account, type Image, type Workspace } from './api.ts'

// The new task form. Accounts list the caller's usable, enabled accounts of the
// agent; an empty account balances across the ready ones. Images list the
// usable images that carry the agent's CLI.
const props = defineProps<{ accounts: Account[]; images: Image[]; workspaces: Workspace[] }>()
const emit = defineEmits<{ started: [id: string]; goto: [tab: 'accounts', agent: string]; agentChanged: [agent: string]; cancel: []; busy: [value: boolean] }>()
const catalog = useRequiredCatalog()
const root = ref<HTMLElement | null>(null)

// Images live on the Autocode tab of the System settings.
function openImages() {
  const path = catalog.value.settings_path
  if (!path) return
  root.value?.dispatchEvent(new CustomEvent('navigate', { detail: { path }, bubbles: true, composed: true }))
}

const target = ref<TaskConfig>({ agent: defaultAgent(catalog.value, props.accounts), account_id: '', image_id: '', workspace_id: '', repo_url: '' })
const { now, driver, agentAccounts, ready, agentImages: readyImages, invalidOptions, optionValues, normalizeConfig, selectAgent } = useTaskTargeting(target, {
  catalog: () => catalog.value, accounts: () => props.accounts, images: () => props.images, workspaces: () => props.workspaces,
}, 'live')
const agentId = computed({
  get: () => target.value.agent ?? '',
  set: agent => { if (agent !== target.value.agent) target.value = selectAgent(agent) },
})
function field(name: 'account_id' | 'image_id' | 'workspace_id' | 'repo_url' | 'repo_ref') {
  return computed({ get: () => target.value[name] ?? '', set: value => { target.value[name] = value } })
}
const accountId = field('account_id')
const imageId = field('image_id')
const workspaceId = field('workspace_id')
const repoUrl = field('repo_url')
const repoRef = field('repo_ref')
const timeout = ref('')
const prompt = ref('')
const options = computed({ get: () => optionValues.value, set: value => { target.value.options = value } })
const unattended = computed({ get: () => target.value.unattended !== false, set: value => { target.value.unattended = value } })
const starting = ref(false)
const error = ref('')

function accountTitle(a: Account) {
  return accountState(a, now.value) === 'cooling' ? `${a.label} (cooling down until ${shortTime(a.cooldown_until)})` : a.label
}
watch(agentId, agent => emit('agentChanged', agent), { immediate: true })

let submission: { snapshot: string; key: string; body: Parameters<typeof autocode.startRun>[0] } | undefined
watch([agentId, accountId, imageId, workspaceId, repoUrl, repoRef, timeout, prompt, options, unattended], () => {
  submission = undefined
}, { deep: true, flush: 'sync' })

async function start() {
  if (starting.value) return
  error.value = ''
  starting.value = true
  emit('busy', true)
  try {
    const body = {
      agent: agentId.value, account_id: accountId.value, image_id: imageId.value, workspace_id: workspaceId.value,
      repo_url: repoUrl.value, repo_ref: repoRef.value.trim() || undefined, timeout: timeout.value.trim() || undefined, prompt: prompt.value, options: normalizeConfig(target.value).options ?? {}, unattended: unattended.value,
    }
    const snapshot = JSON.stringify(body)
    if (!submission || submission.snapshot !== snapshot) submission = { snapshot, key: crypto.randomUUID(), body: { ...body, options: JSON.parse(JSON.stringify(body.options)) as Record<string, unknown> } }
    const { run_id } = await autocode.startRun({ ...submission.body, idempotency_key: submission.key })
    submission = undefined
    prompt.value = ''
    emit('started', run_id)
  } catch (e) {
    error.value = errorText(e, 'Could not start the task.')
  } finally {
    starting.value = false
    emit('busy', false)
  }
}
</script>

<template>
  <fieldset ref="root" class="ac-form ac-new" :disabled="starting">
    <label class="ac-field ac-composer"><span>Prompt</span><textarea v-model="prompt" autofocus rows="8" class="kx-focus-halo" placeholder="What should the agent do?" /></label>
    <div class="ac-field"><span>Agent</span><AgentPicker v-model="agentId" :agents="catalog.agents" /></div>
    <p v-if="agentId && !agentAccounts.length" class="ac-muted">
      No {{ driver?.title }} accounts you can run on. <button class="ac-link kx-focus-outline" type="button" @click="emit('goto', 'accounts', agentId)">Add an account</button>
    </p>
    <p v-if="!readyImages.length" class="ac-muted">
      No image with {{ driver?.title ?? agentId }}; ask an administrator.
      <button v-if="catalog.can_images && catalog.settings_path" class="ac-link kx-focus-outline" type="button" @click="openImages">Manage images</button>
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
    <label class="ac-field">
      <span>Repository ref</span>
      <input v-model="repoRef" aria-label="Repository ref" class="ac-mono kx-focus-halo" placeholder="Default branch" />
    </label>
    <label class="ac-field">
      <span>Run timeout</span>
      <input v-model="timeout" maxlength="64" class="ac-mono kx-focus-halo" placeholder="Use configured timeout" />
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
  </fieldset>
</template>
