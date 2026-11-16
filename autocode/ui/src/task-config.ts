// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WippyVueElement, define, useEvents } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import { lazyControl } from './lazy'
import type { TaskConfig as TaskConfigValue } from './task-config-types.ts'
import stylesText from './task-config.css?inline'

const TaskConfig = lazyControl(
  () => import('./app/task-config.vue'),
  { loading: 'Loading the task config…', failed: 'Could not load the task config. Reload the page to try again.' },
  useEvents,
)

// chestor-autocode-task-config - the config editor of the coding agent task
// Block (presentation.config_wc). The workflow passes `config` and stores the
// `config-changed` it emits.
const PROPS_SCHEMA = {
  type: 'object',
  properties: { config: { type: 'object', default: {}, description: 'Coding agent task Block instance configuration.' } },
} satisfies WippyPropsSchema

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
