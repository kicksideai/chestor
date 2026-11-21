// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define } from '@wippy-fe/webcomponent-vue'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import { DriverAccountsElement, providerAccountsConfig } from './driver-account.ts'

class ClaudeAccountsElement extends DriverAccountsElement {
  static get vueConfig() {
    return providerAccountsConfig(() => import('./app/claude-provider-accounts.vue').then(module => ({ rootComponent: module.default, plugins: [PrimeVuePlugin] })))
  }
}

export async function webComponent() {
  return ClaudeAccountsElement
}

define(import.meta.url, ClaudeAccountsElement)
