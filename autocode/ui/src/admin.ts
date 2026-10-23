// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import { WippyVueElement, define } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import type { ComponentProps } from './types.ts'
import Admin from './app/admin.vue'
import stylesText from './styles.css?inline'

// chestor-autocode-admin - the Autocode tab of the System settings, built as its
// own bundle (admin.js) from the page's sources and styles.
const PROPS_SCHEMA = { type: 'object', properties: {} } as unknown as WippyPropsSchema

class ChestorAutocodeAdminElement extends WippyVueElement<ComponentProps, Record<string, never>> {
  static get wippyConfig(): WippyElementConfig<ComponentProps> {
    return { propsSchema: PROPS_SCHEMA, hostCssKeys: ['themeConfigUrl', 'primeVueCssUrl', 'iframeCssUrl'] as const, inlineCss: stylesText }
  }

  static get vueConfig() {
    return { rootComponent: Admin, plugins: [PrimeVuePlugin] }
  }
}

export async function webComponent() {
  return ChestorAutocodeAdminElement
}

define(import.meta.url, ChestorAutocodeAdminElement)
