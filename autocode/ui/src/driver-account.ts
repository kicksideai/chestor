// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WippyVueElement, define, useEvents } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import { lazyControl } from './lazy'
import stylesText from './driver-account.css?inline'
import type { DriverAccountConfig, DriverAccountEvents } from './driver-account-types.ts'

const DriverAccount = lazyControl(
  () => import('./app/driver-account.vue'),
  { immediate: true, loading: 'Loading the driver account card…', failed: 'Could not load the driver account card. Reload the page to try again.' },
  useEvents,
)

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
    return { rootComponent: DriverAccount }
  }
}

export async function webComponent() {
  return DriverAccountElement
}

define(import.meta.url, DriverAccountElement)
