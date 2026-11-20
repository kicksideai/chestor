// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { WippyVueMountConfig } from '@wippy-fe/webcomponent-vue'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import ProviderAccounts from './app/provider-accounts.vue'

export const mountConfig: WippyVueMountConfig = {
  rootComponent: ProviderAccounts,
  plugins: [PrimeVuePlugin],
}
