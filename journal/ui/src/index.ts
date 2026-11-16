import { WippyVueElement, define, useEvents } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import { lazyPage } from './lazy'
// The stylesheet is inlined into the shadow root, so it is composed here rather
// than through @import, which a shadow root would never resolve.
import shellStyles from './styles.css?inline'
import lensStyles from './styles.lenses.css?inline'
import outlineStyles from './styles.outline.css?inline'

const stylesText = [shellStyles, lensStyles, outlineStyles].join('\n')

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
      description: 'Disables editing while retaining full reading and inspection controls.',
    },
    mode: {
      type: 'string',
      default: 'preview',
      description: 'Rendering context supplied by the workspace host: preview keeps recovery compact, while full exposes every Journal lens and inspector.',
    },
  },
} as WippyPropsSchema

class ChestorJournalElement extends WippyVueElement<Props, Events> {
  static get wippyConfig(): WippyElementConfig<Props> {
    return {
      propsSchema,
      hostCssKeys: ['themeConfigUrl', 'iframeCssUrl'] as const,
      inlineCss: stylesText,
    }
  }

  static get vueConfig() {
    return {
      lazyConfig: lazyPage(
        () => import('./lazy-mount').then((module) => module.mountConfig),
        'Could not load the journal. Reload the page to try again.',
        useEvents,
      ),
    }
  }
}

export async function webComponent() { return ChestorJournalElement }

define(import.meta.url, ChestorJournalElement)
