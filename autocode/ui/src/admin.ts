// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WippyVueElement, define, lazyVueConfig } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import type { ComponentProps } from './types.ts'

import stylesText from './styles.css?inline'
import adminStyles from './admin.css?inline'

// chestor-autocode-admin - the Autocode tab of the System settings, built as its
// own bundle (admin.js) from the page's sources and styles.
const PROPS_SCHEMA = { type: 'object', properties: {} } satisfies WippyPropsSchema

class ChestorAutocodeAdminElement extends WippyVueElement<ComponentProps, Record<string, never>> {
  static get wippyConfig(): WippyElementConfig<ComponentProps> {
    return { propsSchema: PROPS_SCHEMA, hostCssKeys: ['themeConfigUrl', 'primeVueCssUrl', 'iframeCssUrl'] as const, inlineCss: stylesText + adminStyles }
  }

  static get vueConfig() {
    return {
      ...lazyVueConfig(() => import('./admin-mount').then((module) => module.mountConfig), { surface: 'page', loading: 'Loading…', failed: 'Could not load Autocode settings. Reload the page to try again.', timeout: 30000 }),
    }
  }
}

export async function webComponent() {
  return ChestorAutocodeAdminElement
}

define(import.meta.url, ChestorAutocodeAdminElement)
