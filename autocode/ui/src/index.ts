// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WippyVueElement, define, lazyVueConfig } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import type { ComponentProps, ComponentEvents } from './types.ts'

import stylesText from './styles.css?inline'
import pkg from '../package.json'

class ChestorAutocodeElement extends WippyVueElement<ComponentProps, ComponentEvents> {
  static get wippyConfig(): WippyElementConfig<ComponentProps> {
    return {
      propsSchema: pkg.wippy.props as WippyPropsSchema,
      hostCssKeys: ['themeConfigUrl', 'primeVueCssUrl', 'iframeCssUrl'] as const,
      inlineCss: stylesText,
    }
  }

  static get vueConfig() {
    return {
      ...lazyVueConfig(() => import('./index-mount').then((module) => module.mountConfig), { surface: 'page', loading: 'Loading…', failed: 'Could not load Autocode. Reload the page to try again.', timeout: 30000 }),
    }
  }
}

export async function webComponent() {
  return ChestorAutocodeElement
}

define(import.meta.url, ChestorAutocodeElement)
