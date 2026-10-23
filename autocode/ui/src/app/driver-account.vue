<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useProps, useEvents } from '@wippy-fe/webcomponent-vue'
import type { DriverAccountConfig, DriverAccountEvents } from '../driver-account-types.ts'

// The credential card of one agent driver: which credential to import, the
// credential itself - dropped as the CLI's login file or pasted - and, for an
// API key, an optional endpoint the account's runs reach. It owns no storage;
// the host persists the `submit` it emits and reports back through `config`.
const props = useProps<{ config?: DriverAccountConfig | null }>()
const emit = useEvents<DriverAccountEvents>()

const config = computed<DriverAccountConfig | null>(() => props.value.config ?? null)
const driver = computed(() => config.value?.driver ?? null)

const kind = ref('')
const label = ref('')
const labelEdited = ref(false)
const secret = ref('')
const dropped = ref('')
const baseUrl = ref('')
const model = ref('')
const protocol = ref('')
const dragging = ref(false)
const problem = ref('')

const choice = computed(() => driver.value?.credentials.find((c) => c.id === kind.value) ?? null)
const endpointable = computed(() => !!choice.value && !choice.value.file && !choice.value.subscription && (driver.value?.endpoints.length ?? 0) > 0)

watch(() => driver.value?.id, () => {
  const next = driver.value
  kind.value = next?.credentials.find(c => !c.subscription && !c.file)?.id ?? next?.credentials[0]?.id ?? ''
  protocol.value = next?.endpoints[0] ?? ''
  reset(true)
}, { immediate: true })

// The host bumps `saved` after it stores a submitted account.
watch(() => config.value?.saved, (next, previous) => { if (next !== previous) reset() })

function reset(keepLabel = false) {
  if (!keepLabel || !labelEdited.value) {
    labelEdited.value = false
    label.value = defaultLabel()
  }
  secret.value = ''
  dropped.value = ''
  baseUrl.value = ''
  model.value = ''
  problem.value = ''
}

function defaultLabel() { return [driver.value?.title, choice.value?.label].filter(Boolean).join(' ') }
watch(() => [driver.value?.title, choice.value?.label], () => {
  if (!labelEdited.value) label.value = defaultLabel()
})

function basename(path: string) { return path.split('/').pop() ?? path }

// A dropped file whose name is one of the driver's login files selects that
// credential; any other file is read as the pasted value.
async function drop(event: DragEvent) {
  dragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (!file) return
  if (file.size > 65536) { problem.value = `${file.name} is larger than a credential file can be.`; return }
  const login = driver.value?.credentials.find((c) => c.file && basename(c.file) === file.name)
  if (login) kind.value = login.id
  secret.value = (await file.text()).trim()
  dropped.value = file.name
}

function submit() {
  problem.value = ''
  if (!choice.value) return
  const endpoint = endpointable.value && baseUrl.value.trim()
    ? { protocol: protocol.value, base_url: baseUrl.value.trim(), model: model.value.trim() || undefined }
    : undefined
  emit('submit', { agent: driver.value!.id, credential_kind: choice.value.id, label: label.value.trim(), secret: secret.value.trim(), endpoint })
}
</script>

<template>
  <section v-if="driver" class="da">
    <div class="kx-card-head">
      <div class="kx-card-name">Add a {{ driver.title }} account</div>
    </div>

    <label class="da-field">
      <span class="da-lbl">Credential</span>
      <select v-model="kind" class="da-input kx-focus-halo"><option v-for="c in driver.credentials" :key="c.id" :value="c.id">{{ c.label }}</option></select>
    </label>

    <p v-if="choice?.subscription" class="da-notice" role="note">
      <Icon icon="tabler:alert-triangle" />
      <span><strong>Personal use only.</strong> A subscription login is for your own personal use; running it through this tool for
        anyone else is not compliant with the provider's terms, and the provider may restrict or suspend the account. Only you run on
        it and it cannot be shared. Use an official API key or your own endpoint for production or multiple users.</span>
    </p>

    <div class="da-drop" :class="{ over: dragging, filled: !!dropped }" @dragover.prevent="dragging = true" @dragleave="dragging = false" @drop.prevent="drop">
      <Icon :icon="dropped ? 'tabler:file-check' : 'tabler:file-upload'" />
      <span v-if="dropped">{{ dropped }} loaded. <button type="button" class="da-link kx-focus-outline" @click="secret = ''; dropped = ''">Clear</button></span>
      <span v-else>Drop {{ choice?.file ? '~/' + choice.file : 'a file with the value' }} here, or paste below.</span>
    </div>
    <label v-if="!dropped" class="da-field">
      <span class="da-lbl">{{ choice?.file ? 'Login file content' : 'Value' }}</span>
      <textarea v-model="secret" rows="4" class="da-input da-mono kx-focus-halo" :placeholder="choice?.hint" />
    </label>

    <template v-if="endpointable">
      <label class="da-field">
        <span class="da-lbl">Custom endpoint <span class="da-opt">optional</span></span>
        <input v-model="baseUrl" class="da-input da-mono kx-focus-halo" placeholder="http://api.example.com:8000/v1 - empty uses the vendor's API" />
        <small class="da-hint">Send this account's runs to a gateway or a model server you operate; the key authenticates to it.</small>
      </label>
      <div v-if="baseUrl.trim()" class="da-pair">
        <label v-if="driver.endpoints.length > 1" class="da-field">
          <span class="da-lbl">Protocol</span>
          <select v-model="protocol" class="da-input kx-focus-halo"><option v-for="p in driver.endpoints" :key="p" :value="p">{{ p }}</option></select>
        </label>
        <label class="da-field">
          <span class="da-lbl">Model <span class="da-opt">when the endpoint serves several</span></span>
          <input v-model="model" class="da-input da-mono kx-focus-halo" placeholder="qwen3-coder" />
        </label>
      </div>
    </template>

    <label class="da-field">
      <span class="da-lbl">Label</span>
      <input v-model="label" class="da-input kx-focus-halo" @input="labelEdited = true" />
    </label>

    <div class="da-foot">
      <small class="da-hint">Checked against the credential's format, kept in the account's private context, never shown again.</small>
      <button type="button" class="da-btn kx-focus-halo" :disabled="config?.busy || !label.trim() || !secret.trim()" @click="submit">
        <Icon icon="tabler:key" /> {{ config?.busy ? 'Saving…' : 'Save account' }}
      </button>
    </div>
    <p v-if="problem || config?.error" class="kx-err inline">{{ problem || config?.error }}</p>
  </section>
</template>
