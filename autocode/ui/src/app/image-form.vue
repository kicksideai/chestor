<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { useRequiredCatalog } from './catalog.ts'
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { autocode, errorText, type ImageDetail, type ImageRunSettings, type ImageSettings } from './api.ts'

// Creates an image from a reference or a Dockerfile, or changes the label,
// home and run settings of the image in `edit`. capabilities: what agents may
// be allowed in a container, from the activated drivers; null while loading.
const props = defineProps<{ edit: ImageDetail | null; capabilities: string[] | null }>()
const emit = defineEmits<{ saved: []; cancel: [] }>()
const catalog = useRequiredCatalog()

type Form = ImageSettings & { ref: string; mode: 'build' | 'pull'; dockerfile: string; extra: string }
function blank(settings: ImageRunSettings | undefined = catalog.value.default_image.settings): Form | null {
  if (!settings) return null
  return {
    ref: '', mode: 'pull', dockerfile: '', label: '', home: catalog.value.default_image.home,
    ...settings, extra_args: [...settings.extra_args], allows: [...settings.allows], extra: '',
  }
}
const form = ref<Form | null>(blank())
const labelEdited = ref(false)
watch(() => form.value?.ref, reference => {
  if (form.value && !props.edit && !labelEdited.value && reference !== undefined) form.value.label = reference
})
const saving = ref(false)
const error = ref('')

watch(() => props.edit, (detail) => {
  error.value = ''
  labelEdited.value = !!detail
  if (!detail) { form.value = blank(); return }
  if (!detail.settings) { form.value = null; return }
  const s = detail.settings
  form.value = {
    ...s, ref: detail.image.ref, label: detail.image.label, home: detail.image.home, mode: 'pull', dockerfile: detail.dockerfile ?? '',
    extra: s.extra_args.join('\n'), allows: [...s.allows],
  }
}, { immediate: true })


function useDefault() {
  const d = catalog.value.default_image
  labelEdited.value = false
  const initial = blank()
  form.value = initial ? { ...initial, ref: d.ref, label: d.label, home: d.home, mode: 'build', dockerfile: d.dockerfile } : null
}

function settings(): ImageSettings {
  const f = form.value
  if (!f) throw new Error('Image settings are unavailable.')
  return {
    label: f.label, home: f.home, memory: f.memory, cpus: f.cpus, pids_limit: Number(f.pids_limit) || 0,
    gpus: f.gpus, network: f.network, extra_args: f.extra.split('\n').map((s) => s.trim()).filter(Boolean),
    allows: [...f.allows],
  }
}

async function save() {
  if (!form.value) return
  error.value = ''
  saving.value = true
  try {
    if (props.edit) {
      await autocode.updateImage(props.edit.image.id, settings())
    } else {
      const f = form.value
      await autocode.createImage({ ...settings(), ref: f.ref, dockerfile: f.mode === 'build' ? f.dockerfile : '' })
      form.value = blank()
    }
    emit('saved')
  } catch (e) {
    error.value = errorText(e, 'Could not save the image.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <p v-if="!form" class="kx-err" role="alert">{{ edit ? 'Image settings are unavailable.' : 'Image defaults are unavailable.' }} Ask an administrator to update the image configuration.</p>
  <section v-else class="ac-form">
    <div class="ac-card-head">
      <span class="ac-muted">{{ edit ? 'Container settings' : 'Use an image reference or the default agent recipe.' }}</span>
      <button v-if="!edit" type="button" class="ac-btn kx-focus-halo" @click="useDefault"><Icon icon="tabler:sparkles" /> Default agent image</button>

    </div>
    <template v-if="!edit">
      <label class="ac-field">
        <span>Image reference</span>
        <input v-model="form.ref" class="ac-mono kx-focus-halo" placeholder="registry/name:tag" />
      </label>
      <div class="ac-seg">
        <button type="button" class="kx-focus-outline" :class="{ active: form.mode === 'pull' }" @click="form.mode = 'pull'">Use or pull existing</button>
        <button type="button" class="kx-focus-outline" :class="{ active: form.mode === 'build' }" @click="form.mode = 'build'">Build from Dockerfile</button>
      </div>
      <label v-if="form.mode === 'build'" class="ac-field">
        <span>Dockerfile</span>
        <textarea v-model="form.dockerfile" rows="9" class="ac-mono kx-focus-halo" />
        <small class="ac-hint">Include <code>sh</code>, <code>git</code>, <code>mkdir</code>, <code>dirname</code>, a <code>timeout</code> that supports <code>-k</code>, and the agent CLIs. The image user needs writable home and work directories.</small>
      </label>
    </template>
    <p v-else class="ac-muted ac-mono">{{ edit.image.ref }}</p>
    <label class="ac-field">
      <span>Label</span>
      <input v-model="form.label" class="kx-focus-halo" @input="labelEdited = true" />
    </label>
    <label class="ac-field">
      <span>Home directory in the image</span>
      <input v-model="form.home" class="ac-mono kx-focus-halo" />
    </label>
    <div class="ac-row-fields">
      <label class="ac-field"><span>Memory</span><input v-model="form.memory" class="ac-mono kx-focus-halo" :placeholder="catalog.default_image.settings?.memory" /></label>
      <label class="ac-field"><span>CPUs</span><input v-model="form.cpus" class="ac-mono kx-focus-halo" :placeholder="catalog.default_image.settings?.cpus" /></label>
      <label class="ac-field"><span>PIDs limit</span><input v-model.number="form.pids_limit" type="number" min="0" class="ac-mono kx-focus-halo" /></label>
    </div>
    <div class="ac-row-fields">
      <label class="ac-field"><span>GPUs</span><input v-model="form.gpus" class="ac-mono kx-focus-halo" placeholder="all, or device=0" /></label>
      <label class="ac-field"><span>Network</span><input v-model="form.network" class="ac-mono kx-focus-halo" :placeholder="catalog.default_image.settings?.network" /></label>
    </div>
    <div v-if="capabilities?.length" class="ac-field">
      <span>Agents may</span>
      <div class="ac-checks">
        <label v-for="c in capabilities" :key="c" class="ac-check ac-mono">
          <input v-model="form.allows" type="checkbox" class="kx-focus-outline" :value="c" /> {{ c }}
        </label>
      </div>
    </div>
    <label class="ac-field">
      <span>Extra docker run arguments</span>
      <textarea v-model="form.extra" rows="3" class="ac-mono kx-focus-halo" placeholder="One argument per line, e.g.&#10;--device=/dev/dri&#10;--shm-size=2g" />
    </label>
    <footer class="ac-dialog-foot"><button type="button" class="ac-btn kx-focus-halo" @click="emit('cancel')">Cancel</button>
    <button type="button" class="ac-btn primary kx-focus-halo" :disabled="saving || !capabilities || (!edit && !form.ref)" @click="save">
      <Icon icon="tabler:box" /> {{ saving ? 'Saving…' : edit ? 'Save settings' : form.mode === 'build' ? 'Build image' : 'Add image' }}
    </button>
    </footer>
    <p v-if="error" class="kx-err">{{ error }}</p>
  </section>
</template>
