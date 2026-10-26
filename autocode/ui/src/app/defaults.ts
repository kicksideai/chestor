// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { Account, Catalog, DriverInfo, DriverOption, Image } from './api.ts'

export function defaultAgent(catalog: Catalog, accounts: Account[]): string {
  return catalog.agents.find(agent => accounts.some(a => a.agent === agent.id && a.usable && a.enabled))?.id
    ?? catalog.agents[0]?.id ?? ''
}

export function matchingImages(images: Image[], agent: string): Image[] {
  return images.filter(image => image.status === 'ready' && image.agents.includes(agent))
}

export function batchOptions(options: DriverOption[]): DriverOption[] {
  return options.filter(option => !option.profiles?.length || option.profiles.includes('batch'))
}

export function driverDefaults(driver: DriverInfo | undefined): Record<string, unknown> {
  return Object.fromEntries(batchOptions(driver?.options ?? [])
    .filter(option => option.default !== undefined && option.default !== null)
    .map(option => {
      const value: unknown = JSON.parse(JSON.stringify(option.default))
      return [option.name, value]
    }))
}
