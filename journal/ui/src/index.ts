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
      description: 'Workspace Journal component id to load; an empty value renders the required-id state without issuing API requests.',
    },
    'read-only': {
      type: 'boolean',
      default: false,
      description: 'Accepted for host compatibility; the page only reads.',
    },
    mode: {
      type: 'string',
      default: 'preview',
      description: 'Rendering context supplied by the workspace host: preview stacks the page into one column, full shows the list beside the open item.',
    },
  },
} as WippyPropsSchema

class ChestorJournalElement extends WippyVueElement<Props, Events> {
  static get wippyConfig(): WippyElementConfig<Props> {
    return {
      propsSchema,
      hostCssKeys: ['themeConfigUrl', 'primeVueCssUrl', 'iframeCssUrl'] as const,
      inlineCss: stylesText,
    }
  }

  static get vueConfig() {
    return {
      ...lazyVueConfig(() => import('./lazy-mount').then((module) => module.mountConfig), { surface: 'page', loading: 'Loading…', failed: 'Could not load the journal. Reload the page to try again.', timeout: 30000 }),
    }
  }
}

export async function webComponent() { return ChestorJournalElement }

define(import.meta.url, ChestorJournalElement)
