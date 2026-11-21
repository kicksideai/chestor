<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Button from 'primevue/button'
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import PageHead from './page-head.vue'
import { ref } from 'vue'
import { useRequiredCatalog } from './catalog.ts'
import { Icon } from '@iconify/vue'
import { host } from '@wippy-fe/proxy'
import { autocode } from './api.ts'
import { errorText } from './presentation.ts'

const catalog = useRequiredCatalog()
const pruning = ref(false)
const output = ref('')
const error = ref('')

async function prune() {
  const ok = await host.confirm({
    header: 'Clean up Docker',
    message: `Prune stopped Autocode containers, unused images and build cache older than ${catalog.value.build_cache_retention} across this Docker host? Other modules may use the shared image cache.`,
    icon: 'tabler:trash-x',
    acceptLabel: 'Clean up',
    rejectLabel: 'Cancel',
  })
  if (!ok) return
  error.value = ''
  output.value = ''
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
  <section class="ac-stack ac-narrow">
    <PageHead title="Docker cleanup" icon="tabler:brand-docker"
      subtitle="Reclaim disk space used by finished tasks and old builds."
      :count="`Cache retention · ${catalog.build_cache_retention}`">
      <template #actions>
        <Button label="Clean up Docker" :loading="pruning" :disabled="pruning" @click="prune">
          <template #icon><Icon icon="tabler:trash-x" aria-hidden="true" /></template>
        </Button>
      </template>
    </PageHead>
    <div class="ac-card">
      <p class="ac-hint">Remove stopped Autocode containers, dangling images and unused build cache older than the retention window. The cache is shared with other modules. Tagged images stay.</p>
      <p v-if="error" class="kx-err" role="alert">{{ error }} Check the Docker host and try again.</p>
      <template v-if="output">
        <p role="status">Cleanup finished.</p>
        <Disclosure label="Technical details"><pre class="ac-pre">{{ output }}</pre></Disclosure>
      </template>
    </div>
  </section>
</template>
