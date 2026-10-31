// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { computed, inject, provide, ref, type Ref } from 'vue'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { autocode, type Catalog } from './api.ts'
import { serial, useAlive } from './live.ts'
import { errorText } from './presentation.ts'

// useCatalog loads the agent catalog on every host reveal and provides it to
// the page's tabs as `catalog`.
export function useCatalog() {
  const alive = useAlive()
  const catalog = ref<Catalog | null>(null)
  const error = ref('')
  const load = serial(async () => {
    try {
      const result = await autocode.catalog()
      if (!alive()) return
      catalog.value = result
      error.value = ''
    } catch (e) {
      if (!alive()) return
      error.value = errorText(e, 'Could not load the agent catalog.')
    }
  }, alive)
  provide('catalog', catalog)
  useHostVisibilityRefresh(load)
  return { catalog, error, load }
}

export function useRequiredCatalog() {
  const provided = inject<Ref<Catalog | null>>('catalog')
  if (!provided) throw new Error('Autocode catalog provider is missing.')
  return computed(() => {
    if (!provided.value) throw new Error('Autocode catalog is not loaded.')
    return provided.value
  })
}
