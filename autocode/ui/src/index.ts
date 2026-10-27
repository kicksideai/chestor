// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import { WippyVueElement, define } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import type { ComponentProps } from './types.ts'
import Autocode from './app/autocode.vue'
import stylesText from './styles.css?inline'
import pkg from '../package.json'

class ChestorAutocodeElement extends WippyVueElement<ComponentProps, Record<string, never>> {
  static get wippyConfig(): WippyElementConfig<ComponentProps> {
    return {
      propsSchema: pkg.wippy.props satisfies WippyPropsSchema,
      hostCssKeys: ['themeConfigUrl', 'primeVueCssUrl', 'iframeCssUrl'] as const,
      inlineCss: stylesText,
    }
  }

  static get vueConfig() {
    return { rootComponent: Autocode, plugins: [PrimeVuePlugin] }
  }
}

export async function webComponent() {
  return ChestorAutocodeElement
}

define(import.meta.url, ChestorAutocodeElement)
