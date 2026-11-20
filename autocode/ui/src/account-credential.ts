// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WippyVueElement, define, lazyVueConfig } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'

import stylesText from './driver-account.css?inline'
import type { DriverAccountConfig, DriverAccountEvents } from './driver-account-types.ts'

// Credential editor shared by the personal Accounts page and the provider editors.
const PROPS_SCHEMA = {
  type: 'object',
  properties: {
    config: { type: 'object', default: {}, description: 'Driver credential card: { driver, busy, error, saved }' },
  },
} satisfies WippyPropsSchema

class DriverAccountElement extends WippyVueElement<{ config?: DriverAccountConfig }, DriverAccountEvents> {
  static get wippyConfig(): WippyElementConfig<{ config?: DriverAccountConfig }> {
    return { propsSchema: PROPS_SCHEMA, hostCssKeys: ['themeConfigUrl'] as const, inlineCss: stylesText }
  }

  static get vueConfig() {
    return lazyVueConfig(() => (() => import('./app/driver-account.vue'))().then(module => ({ rootComponent: module.default })), { surface: 'compact', loading: 'Loading the driver account card…', failed: 'Could not load the driver account card. Reload the page to try again.', delay: 0, timeout: 30000 })
  }
}

export async function webComponent() {
  return DriverAccountElement
}

define(import.meta.url, DriverAccountElement)
