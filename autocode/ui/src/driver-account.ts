// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WippyVueElement, lazyVueConfig } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema, WippyVueMountConfig } from '@wippy-fe/webcomponent-vue'
import styles from './styles.css?inline'

export interface ProviderProps { providerId?: string }
export interface ProviderEvents { 'connection-saved': { success: true } }

const props = {
  type: 'object',
  properties: {
    'provider-id': { type: 'string', default: '', description: 'Registry ID of the Autocode driver binding.' },
  },
} satisfies WippyPropsSchema

export class DriverAccountsElement extends WippyVueElement<ProviderProps, ProviderEvents> {
  static get wippyConfig(): WippyElementConfig<ProviderProps> {
    return {
      propsSchema: props,
      hostCssKeys: ['themeConfigUrl', 'primeVueCssUrl', 'iframeCssUrl'] as const,
      inlineCss: styles + ':host, :host > div { height: auto; }',
    }
  }

}

export function providerAccountsConfig(load: () => Promise<WippyVueMountConfig>) {
  return lazyVueConfig(load, {
    surface: 'compact', loading: 'Loading accounts…', failed: 'Could not load accounts.', timeout: 30000,
  })
}
