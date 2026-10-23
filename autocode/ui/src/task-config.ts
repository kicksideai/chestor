// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WippyVueElement, define } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import TaskConfig from './app/task-config.vue'
import type { TaskConfig as TaskConfigValue } from './app/task-config.vue'
import stylesText from './task-config.css?inline'

// chestor-autocode-task-config - the config editor of the coding agent task
// Block (presentation.config_wc). The workflow passes `config` and stores the
// `config-changed` it emits.
const PROPS_SCHEMA = {
  type: 'object',
  properties: { config: { type: 'object', description: 'Coding agent task Block instance configuration.' } },
} as unknown as WippyPropsSchema

class TaskConfigElement extends WippyVueElement<{ config?: TaskConfigValue }, { 'config-changed': TaskConfigValue }> {
  static get wippyConfig(): WippyElementConfig<{ config?: TaskConfigValue }> {
    return { propsSchema: PROPS_SCHEMA, hostCssKeys: ['themeConfigUrl'] as const, inlineCss: stylesText }
  }

  static get vueConfig() {
    return { rootComponent: TaskConfig }
  }
}

export async function webComponent() {
  return TaskConfigElement
}

define(import.meta.url, TaskConfigElement)
