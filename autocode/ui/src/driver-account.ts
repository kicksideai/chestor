// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WippyVueElement, define } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import DriverAccount from './app/driver-account.vue'
import stylesText from './driver-account.css?inline'
import type { DriverAccountConfig, DriverAccountEvents } from './driver-account-types.ts'

// chestor-autocode-driver-account - the credential card of one agent driver, built as
// its own bundle (driver-account.js) and registered as its own view.component
// so any surface that holds agent accounts mounts it by tag. The host passes
// `config` {driver, busy, error, saved} and stores the `submit` it emits.
const PROPS_SCHEMA = {
  type: 'object',
  properties: {
    config: { type: 'object', description: 'Driver credential card: { driver, busy, error, saved }' },
  },
} as unknown as WippyPropsSchema

class DriverAccountElement extends WippyVueElement<{ config?: DriverAccountConfig }, DriverAccountEvents> {
  static get wippyConfig(): WippyElementConfig<{ config?: DriverAccountConfig }> {
    return { propsSchema: PROPS_SCHEMA, hostCssKeys: ['themeConfigUrl'] as const, inlineCss: stylesText }
  }

  static get vueConfig() {
    return { rootComponent: DriverAccount }
  }
}

export async function webComponent() {
  return DriverAccountElement
}

define(import.meta.url, DriverAccountElement)
