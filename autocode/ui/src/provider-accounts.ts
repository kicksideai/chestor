// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { define } from '@wippy-fe/webcomponent-vue'
import { DriverAccountsElement, providerAccountsConfig } from './driver-account.ts'

class ProviderAccountsElement extends DriverAccountsElement {
  static get vueConfig() {
    return providerAccountsConfig(() => import('./provider-accounts-mount').then(module => module.mountConfig))
  }
}

export async function webComponent() {
  return ProviderAccountsElement
}

define(import.meta.url, ProviderAccountsElement)
