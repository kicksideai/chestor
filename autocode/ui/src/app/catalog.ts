// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { provide, ref } from 'vue'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { autocode, errorText, serial, type Catalog } from './api.ts'

// useCatalog loads the agent catalog on every host reveal and provides it to
// the page's tabs as `catalog`.
export function useCatalog() {
  const catalog = ref<Catalog | null>(null)
  const error = ref('')
  const load = serial(async () => {
    try {
      catalog.value = await autocode.catalog()
      error.value = ''
    } catch (e) {
      error.value = errorText(e, 'Could not load the agent catalog.')
    }
  })
  provide('catalog', catalog)
  useHostVisibilityRefresh(load)
  return { catalog, error, load }
}
