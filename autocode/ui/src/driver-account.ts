// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WippyVueElement, define, lazyVueConfig } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'

import stylesText from './driver-account.css?inline'
import type { DriverAccountConfig, DriverAccountEvents } from './driver-account-types.ts'



// chestor-autocode-driver-account - the credential card of one agent driver, built as
// its own bundle (driver-account.js) and registered as its own view.component
// so any surface that holds agent accounts mounts it by tag. The host passes
// `config` {driver, busy, error, saved} and stores the `submit` it emits.
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
    return lazyVueConfig(() => (() => import('./app/driver-account.vue'))().then(module => ({ rootComponent: module.default })), { surface: 'compact', loading: 'Loading the driver account card…', failed: 'Could not load the driver account card. Reload the page to try again.', delay: true ? 0 : 200, timeout: 30000 })
  }
}

export async function webComponent() {
  return DriverAccountElement
}

define(import.meta.url, DriverAccountElement)
