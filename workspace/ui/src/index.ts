import { WippyVueElement, define, lazyVueConfig } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import type { ComponentProps } from './types'
import type { Events } from './constants'

import stylesText from './styles.css?inline'

// chestor-workspace -- the canonical workspace shell. It owns navigation
// (breadcrumbs/back) and the entry tree, and mounts each entry's declared
// renderer web component by tag. Entry types are pure registry declarations.
class WorkspaceElement extends WippyVueElement<ComponentProps, Events> {
  static get wippyConfig(): WippyElementConfig<ComponentProps> {
    return {
      propsSchema: { type: 'object', properties: { route: { type: 'string' } } } as WippyPropsSchema,
      hostCssKeys: ['themeConfigUrl', 'primeVueCssUrl', 'iframeCssUrl'] as const,
      inlineCss: stylesText,
    }
  }

  static get vueConfig() {
    return {
      ...lazyVueConfig(() => import('./lazy-mount').then((module) => module.mountConfig), { surface: 'page', loading: 'Loading…', failed: 'Could not load the workspace. Reload the page to try again.', timeout: 30000 }),
    }
  }
}

export async function webComponent() {
  return WorkspaceElement
}

define(import.meta.url, WorkspaceElement)
