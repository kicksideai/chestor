import { WippyVueElement, define, lazyVueConfig } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'

import stylesText from './styles.css?inline'

interface Props { entryId?: string; mode?: string; readOnly?: boolean }
interface Events { load: undefined; error: { message: string; error: unknown } }

const propsSchema = {
  type: 'object',
  properties: {
    'entry-id': {
      type: 'string',
      default: '',
      description: 'Workspace roadmap component id to load; an empty value renders the required-id error state without issuing API requests.',
    },
    'read-only': {
      type: 'boolean',
      default: false,
      description: 'Disables editing while retaining full reading and inspection controls.',
    },
    mode: {
      type: 'string',
      default: 'preview',
      description: 'Rendering mode: preview for the compact read-only timeline, or full for the lens switcher, editing controls, inspector, and undo/redo.',
    },
  },
} as WippyPropsSchema

class ChestorRoadmapElement extends WippyVueElement<Props, Events> {
  static get wippyConfig(): WippyElementConfig<Props> {
    return {
      propsSchema,
      hostCssKeys: ['themeConfigUrl', 'iframeCssUrl'] as const,
      inlineCss: stylesText,
    }
  }

  static get vueConfig() {
    return {
      ...lazyVueConfig(() => import('./lazy-mount').then((module) => module.mountConfig), { surface: 'page', loading: 'Loading…', failed: 'Could not load the roadmap. Reload the page to try again.', timeout: 30000 }),
    }
  }
}

export async function webComponent() {
  return ChestorRoadmapElement
}

define(import.meta.url, ChestorRoadmapElement)
