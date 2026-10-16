<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEvents, useProps } from '@wippy-fe/webcomponent-vue'
import { useWorkspaceApi } from './useWorkspaceApi'
import { Button, FormField, Notice, TextInput } from './shared'
import { IconField } from './shared'

// wc-entry-create -- the canonical generic create form. The workspace shell mounts
// it (via EntryRenderer) for any kind whose create.view is this tag: a compact
// name + icon form that POSTs through the workspace host api and signals the shell
// with bubbling `created`/`close` DOM events.
interface Props { type?: string; parentId?: string; 'parent-id'?: string }
interface Events { created: { id: string }; close: Record<string, never> }

const props = useProps<Props>()
const emit = useEvents<Events>()
const api = useWorkspaceApi()

const typeLabel = computed(() => props.value.type || 'entry')
const name = ref('')
const icon = ref('')
const saving = ref(false)
const error = ref('')

async function submit() {
  if (!name.value.trim() || saving.value) return
  saving.value = true
  error.value = ''
  try {
    const entry = await api.create({
      type: props.value.type || '',
      name: name.value.trim(),
      icon: icon.value,
      // useProps exposes host attributes camelCased (parent-id -> parentId); kebab fallback.
      parent_id: props.value.parentId ?? props.value['parent-id'] ?? null,
    })
    emit('created', { id: entry.id })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'failed to create'
    saving.value = false
  }
}
function cancel() { emit('close', {}) }
</script>

<template>
  <div style="height:100%;display:grid;place-items:center" @click.self="cancel">
    <div class="ws-dialog">
      <div class="ws-dialog-head">New {{ typeLabel }}</div>
      <FormField label="Name">
        <div class="ec-name-row">
          <IconField v-model="icon" />
          <TextInput v-model="name" placeholder="Name" @keyup.enter="submit" />
        </div>
      </FormField>
      <Notice v-if="error" tone="error">{{ error }}</Notice>
      <div class="ws-dialog-foot">
        <Button variant="ghost" @click="cancel">Cancel</Button>
        <Button icon="tabler:check" :disabled="!name.trim() || saving" @click="submit">Create</Button>
      </div>
    </div>
  </div>
</template>
