// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WippyVueElement, define, useEvents } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import type { ComponentProps } from './types.ts'
import { lazyPage } from './lazy'
import stylesText from './styles.css?inline'

// chestor-autocode-admin - the Autocode tab of the System settings, built as its
// own bundle (admin.js) from the page's sources and styles.
const PROPS_SCHEMA = { type: 'object', properties: {} } satisfies WippyPropsSchema

class ChestorAutocodeAdminElement extends WippyVueElement<ComponentProps, Record<string, never>> {
  static get wippyConfig(): WippyElementConfig<ComponentProps> {
    return { propsSchema: PROPS_SCHEMA, hostCssKeys: ['themeConfigUrl', 'primeVueCssUrl', 'iframeCssUrl'] as const, inlineCss: stylesText }
  }

  static get vueConfig() {
    return {
      lazyConfig: lazyPage(
        () => import('./admin-mount').then((module) => module.mountConfig),
        'Could not load Autocode settings. Reload the page to try again.',
        useEvents,
      ),
    }
  }
}

export async function webComponent() {
  return ChestorAutocodeAdminElement
}

define(import.meta.url, ChestorAutocodeAdminElement)
