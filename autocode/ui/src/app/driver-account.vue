<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useProps, useEvents } from '@wippy-fe/webcomponent-vue'
import { driverAccountConfig, type DriverAccountConfig, type DriverAccountEvents } from '../driver-account-types.ts'

// The credential card of one agent driver: which credential to import, the
// credential itself - dropped as the CLI's login file or pasted - and, for an
// API key, an optional endpoint the account's runs reach. It owns no storage;
// the host persists the `submit` it emits and reports back through `config`.
const props = useProps<{ config?: DriverAccountConfig | null }>()
const emit = useEvents<DriverAccountEvents>()

const decoded = computed(() => driverAccountConfig.safeParse(props.value.config))
const config = computed<DriverAccountConfig | null>(() => decoded.value.success ? decoded.value.data : null)
const configError = computed(() => props.value.config && !decoded.value.success ? 'Account form configuration is invalid.' : '')
const driver = computed(() => config.value?.driver ?? null)
const account = computed(() => config.value?.account)
const needsSecret = computed(() => !account.value || kind.value !== account.value.credential_kind)

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
let generation = 0
onUnmounted(() => { generation++ })

const choice = computed(() => driver.value?.credentials.find((c) => c.id === kind.value) ?? null)
const endpointable = computed(() => !!choice.value && !choice.value.file && !choice.value.subscription && (driver.value?.endpoints.length ?? 0) > 0)

const byteLength = (text: string) => new TextEncoder().encode(text).length
const validation = computed(() => {
  const errors: Record<string, string> = {}
  const limits = config.value?.limits
  if (limits && byteLength(label.value.trim()) > limits.label_bytes) errors.label = `Label exceeds ${limits.label_bytes} bytes.`
  const value = secret.value.trim()
  if (limits && byteLength(value) > limits.secret_bytes) errors.secret = `Credential exceeds ${limits.secret_bytes} bytes.`
  else if (value && choice.value?.format === 'single_line' && /[\r\n]/.test(value)) errors.secret = 'Credential must be a single line.'
  else if (value && choice.value?.format === 'json_object') {
    try {
      const decoded: unknown = JSON.parse(value)
      if (!decoded || typeof decoded !== 'object' || Array.isArray(decoded)) errors.secret = 'Credential must be a JSON object.'
    } catch { errors.secret = 'Credential must be a JSON object.' }
  }
  const url = baseUrl.value.trim()
  if (endpointable.value && url) {
    if (limits && byteLength(url) > limits.endpoint_url_bytes) errors.endpoint = `Endpoint URL exceeds ${limits.endpoint_url_bytes} bytes.`
    if (limits && byteLength(model.value.trim()) > limits.endpoint_model_bytes) errors.model = `Model exceeds ${limits.endpoint_model_bytes} bytes.`
  }
  return errors
})

watch(() => driver.value?.id, () => {
  const next = driver.value
  kind.value = next?.credentials.find(c => !c.subscription && !c.file)?.id ?? next?.credentials[0]?.id ?? ''
  protocol.value = next?.endpoints[0] ?? ''
  reset(true)
}, { immediate: true })

watch(kind, () => { protocol.value = driver.value?.endpoints[0] ?? ''; reset() }, { flush: 'sync' })
watch(() => config.value?.busy, busy => { if (busy) generation++ }, { flush: 'sync' })

watch(() => JSON.stringify(config.value?.account), () => {
  kind.value = account.value?.credential_kind ?? driver.value?.credentials.find(c => !c.subscription && !c.file)?.id ?? driver.value?.credentials[0]?.id ?? ''
  reset()
}, { immediate: true })

// The host bumps `saved` after it stores a submitted account.
watch(() => config.value?.saved, (next, previous) => { if (next !== previous) reset() })

function reset(keepLabel = false) {
  generation++
  dragging.value = false
  if (!keepLabel || !labelEdited.value) {
    labelEdited.value = false
    label.value = account.value?.label ?? defaultLabel()
  }
  secret.value = ''
  dropped.value = ''
  const endpoint = kind.value === account.value?.credential_kind ? account.value.endpoint : undefined
  baseUrl.value = endpoint?.base_url ?? ''
  model.value = endpoint?.model ?? ''
  protocol.value = endpoint?.protocol ?? driver.value?.endpoints[0] ?? ''
  problem.value = ''
}

function defaultLabel() { return [driver.value?.title, choice.value?.label].filter(Boolean).join(' ') }
watch(() => [driver.value?.title, choice.value?.label], () => {
  if (!labelEdited.value) label.value = account.value?.label ?? defaultLabel()
})

function basename(path: string) { return path.split('/').pop() ?? path }

// A dropped file whose name is one of the driver's login files selects that
// credential; any other file is read as the pasted value.
async function drop(event: DragEvent) {
  dragging.value = false
  if (config.value?.busy) return
  const file = event.dataTransfer?.files?.[0]
  if (!file) return
  const limit = config.value?.limits?.secret_bytes
  if (limit && file.size > limit) { problem.value = `${file.name} exceeds the ${limit}-byte credential limit.`; return }
  const login = driver.value?.credentials.find(c => c.file && basename(c.file) === file.name)
  if (login) kind.value = login.id
  const current = ++generation
  try {
    const value = await file.text()
    if (current !== generation || config.value?.busy) return
    secret.value = value.trim()
    dropped.value = file.name
    problem.value = ''
  } catch {
    if (current === generation) problem.value = 'Could not read the credential file. Try dropping it again.'
  }
}
function editSecret() { generation++; dropped.value = ''; problem.value = '' }
function clearSecret() { generation++; secret.value = ''; dropped.value = ''; problem.value = '' }

function submit() {
  problem.value = ''
  const selectedDriver = driver.value
  const selectedKind = choice.value
  if (!selectedDriver || !selectedKind || config.value?.busy || Object.keys(validation.value).length || !label.value.trim() || (needsSecret.value && !secret.value.trim())) return
  const endpoint = endpointable.value && baseUrl.value.trim()
    ? { protocol: protocol.value, base_url: baseUrl.value.trim(), model: model.value.trim() || undefined }
    : undefined
  emit('submit', { agent: selectedDriver.id, credential_kind: selectedKind.id, label: label.value.trim(), secret: secret.value.trim(), endpoint })
}
</script>

<template>
  <p v-if="configError" class="kx-err" role="alert">{{ configError }}</p>
  <section v-if="driver" class="da">
    <div class="kx-card-head">
      <div class="kx-card-name">{{ account ? 'Edit' : 'Add a' }} {{ driver.title }} account</div>
    </div>

    <label class="da-field">
      <span class="da-lbl">Credential</span>
      <select :disabled="config?.busy" v-model="kind" class="da-input kx-focus-halo"><option v-for="c in driver.credentials" :key="c.id" :value="c.id">{{ c.label }}</option></select>
    </label>

    <p v-if="choice?.subscription" class="da-notice" role="note">
      <Icon icon="tabler:alert-triangle" />
      <span><strong>Personal use only.</strong> A subscription login is for your own personal use; running it through this tool for
        anyone else is not compliant with the provider's terms, and the provider may restrict or suspend the account. Only you run on
        it. Use an official API key or your own endpoint for production or multiple users.</span>
    </p>

    <div class="da-drop" :class="{ over: dragging, filled: !!dropped }" @dragover.prevent="dragging = !config?.busy" @dragleave="dragging = false" @drop.prevent="drop">
      <Icon :icon="dropped ? 'tabler:file-check' : 'tabler:file-upload'" />
      <span v-if="dropped">{{ dropped }} loaded. <button type="button" class="da-link kx-focus-outline" @click="clearSecret" :disabled="config?.busy">Clear</button></span>
      <span v-else>Drop {{ choice?.file ? '~/' + choice.file : 'a file with the value' }} here, or paste below.</span>
    </div>
    <label v-if="!dropped" class="da-field">
      <span class="da-lbl">{{ choice?.file ? 'Login file content' : 'Value' }}<span v-if="account && !needsSecret" class="da-opt"> · leave empty to keep the credential</span></span>
      <textarea :disabled="config?.busy" v-model="secret" @input="editSecret" rows="4" class="da-input da-mono kx-focus-halo" :placeholder="choice?.hint" />
    </label>

    <small v-if="validation.secret" class="kx-err" role="alert">{{ validation.secret }}</small>

    <template v-if="endpointable">
      <label class="da-field">
        <span class="da-lbl">Custom endpoint <span class="da-opt">optional</span></span>
        <input :disabled="config?.busy" v-model="baseUrl" class="da-input da-mono kx-focus-halo" placeholder="http://api.example.com:8000/v1 - empty uses the vendor's API" />
        <small v-if="validation.endpoint" class="kx-err" role="alert">{{ validation.endpoint }}</small>
        <small class="da-hint">Send this account's tasks to a gateway or a model server you operate; the key authenticates to it.</small>
      </label>
      <div v-if="baseUrl.trim()" class="da-pair">
        <label v-if="driver.endpoints.length > 1" class="da-field">
          <span class="da-lbl">Protocol</span>
          <select :disabled="config?.busy" v-model="protocol" class="da-input kx-focus-halo"><option v-for="p in driver.endpoints" :key="p" :value="p">{{ p }}</option></select>
        </label>
        <label class="da-field">
          <span class="da-lbl">Model <span class="da-opt">when the endpoint serves several</span></span>
          <input :disabled="config?.busy" v-model="model" class="da-input da-mono kx-focus-halo" placeholder="qwen3-coder" />
          <small v-if="validation.model" class="kx-err" role="alert">{{ validation.model }}</small>
        </label>
      </div>
    </template>

    <label class="da-field">
      <span class="da-lbl">Label</span>
      <input :disabled="config?.busy" v-model="label" class="da-input kx-focus-halo" @input="labelEdited = true" />
    </label>

    <small v-if="validation.label" class="kx-err" role="alert">{{ validation.label }}</small>

    <div class="da-foot">
      <small class="da-hint">Checked against the credential's format, kept in the account's private context, never shown again.</small>
      <button type="button" class="da-btn kx-focus-halo" :disabled="config?.busy || Object.keys(validation).length > 0 || !choice || !label.trim() || (needsSecret && !secret.trim())" @click="submit">
        <Icon icon="tabler:key" /> {{ config?.busy ? 'Saving…' : 'Save account' }}
      </button>
    </div>
    <p v-if="problem || config?.error" class="kx-err inline">{{ problem || config?.error }}</p>
  </section>
</template>
