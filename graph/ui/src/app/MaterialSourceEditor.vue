<script setup lang="ts">
import { computed } from 'vue'
import ComponentPicker from './ComponentPicker.vue'
import type { GraphMaterial } from './types'

const props = defineProps<{ material: GraphMaterial }>()
const emit = defineEmits<{ (e: 'update', patch: Record<string, unknown>): void }>()

const sourceType = computed(() => String(props.material.source?.type || 'inline'))

function setSourceType(type: string) {
  emit('update', { source: { ...(props.material.source || {}), type } })
}

function setSourceField(key: string, value: string) {
  emit('update', { source: { ...(props.material.source || {}), [key]: value } })
}
</script>

<template>
  <div class="kg-source">
    <select class="kg-input kg-small" :value="sourceType" @change="setSourceType(($event.target as HTMLSelectElement).value)">
      <option value="inline">inline</option>
      <option value="url">url</option>
      <option value="upload">upload</option>
      <option value="component">component</option>
    </select>
    <textarea v-if="sourceType === 'inline'" class="kg-textarea kg-small" rows="2" :value="String(material.source?.text || '')" placeholder="inline text" @change="setSourceField('text', ($event.target as HTMLTextAreaElement).value)"></textarea>
    <div v-else-if="sourceType === 'url'" class="kg-url">
      <input class="kg-input kg-small" :value="String(material.source?.url || '')" placeholder="https://..." @change="setSourceField('url', ($event.target as HTMLInputElement).value)" />
      <a v-if="material.source?.url" class="kg-url-go" :href="String(material.source?.url)" target="_blank" rel="noopener" title="Open">↗</a>
    </div>
    <input v-else-if="sourceType === 'upload'" class="kg-input kg-small" :value="String(material.source?.upload_id || '')" placeholder="upload id" @change="setSourceField('upload_id', ($event.target as HTMLInputElement).value)" />
    <ComponentPicker v-else-if="sourceType === 'component'" :model-value="String(material.source?.component_id || '')" @update:model-value="setSourceField('component_id', $event)" />
  </div>
</template>
