<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { loadByTagName } from '@wippy-fe/proxy'
import { errorText } from './presentation.ts'
const props = defineProps<{ id: string; title: string }>()
const open = ref(false)
const shareHost = ref<HTMLElement | null>(null)
const error = ref('')
function close() { open.value = false }
watch(shareHost, async host => {
  if (!host) return
  error.value = ''
  try {
    if (!customElements.get('kickside-share')) await loadByTagName('kickside-share', { timeoutMs: 8000 })
    if (shareHost.value !== host) return
    const el = document.createElement('kickside-share')
    el.setAttribute('config', JSON.stringify({ resource_id: props.id, title: props.title,
      access_url: `/api/v1/component-access/grants/${encodeURIComponent(props.id)}`,
      share_url: `/api/v1/component-access/share/${encodeURIComponent(props.id)}` }))
    el.style.display = 'block'
    el.addEventListener('close', close)
    host.appendChild(el)
  } catch (e) { error.value = errorText(e, 'Could not open sharing.') }
})
</script>
<template>
  <button type="button" class="ac-icon-btn kx-focus-outline" title="Share" aria-label="Share" @click="open = true"><Icon icon="tabler:share" /></button>
  <div v-if="open" ref="shareHost"></div>
  <span v-if="error" class="kx-err" role="alert">{{ error }}</span>
</template>
