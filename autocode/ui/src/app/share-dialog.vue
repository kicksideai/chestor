<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { loadByTagName } from '@wippy-fe/proxy'
import { errorText, shareConfig } from './api.ts'

// The platform's kickside-share popup over one component's grants, mounted by
// tag. It owns its modal chrome; `close` ends it and `changed` follows a grant.
const props = defineProps<{ id: string; title: string }>()
const emit = defineEmits<{ close: []; changed: [] }>()

const ready = ref(false)
const error = ref('')
const config = computed(() => JSON.stringify(shareConfig(props.id, props.title)))

onMounted(async () => {
  try {
    await loadByTagName('kickside-share', { timeoutMs: 8000 })
    ready.value = true
  } catch (e) {
    error.value = errorText(e, 'The share dialog could not load.')
  }
})
</script>

<template>
  <kickside-share v-if="ready" :config.attr="config" @close="emit('close')" @changed="emit('changed')" />
  <p v-else-if="error" class="kx-err inline">{{ error }}</p>
</template>
