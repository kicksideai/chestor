<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { host } from '@wippy-fe/proxy'
import { autocode, errorText } from './api.ts'

const pruning = ref(false)
const output = ref('')
const error = ref('')

async function prune() {
  const ok = await host.confirm({
    header: 'Clean up Docker',
    message: 'Run the Docker cleanup on the host now?',
    icon: 'tabler:trash-x',
    acceptLabel: 'Clean up',
    rejectLabel: 'Cancel',
  })
  if (!ok) return
  error.value = ''
  pruning.value = true
  try {
    output.value = await autocode.prune()
  } catch (e) {
    error.value = errorText(e, 'Cleanup failed.')
  } finally {
    pruning.value = false
  }
}
</script>

<template>
  <section class="ac-card ac-narrow">
    <div class="ac-card-head">
      <h2 class="ac-card-title"><Icon icon="tabler:brand-docker" />Docker cleanup</h2>
      <button type="button" class="ac-btn kx-focus-halo" :disabled="pruning" @click="prune">
        <Icon :icon="pruning ? 'tabler:loader-2' : 'tabler:trash-x'" :class="{ spin: pruning }" /> {{ pruning ? 'Cleaning…' : 'Clean up Docker' }}
      </button>
    </div>
    <p class="ac-hint">Prune stopped autocode containers, dangling layers and build cache older than a day; keep tagged images.</p>
    <p v-if="error" class="ac-error">{{ error }}</p>
    <pre v-if="output" class="ac-pre">{{ output }}</pre>
  </section>
</template>
