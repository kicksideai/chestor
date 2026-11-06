import { WippyVueElement, define, useEvents } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import { lazyControl } from './lazy'
import stylesText from './styles.css?inline'

// wc-entry-create -- the canonical generic create element. A kind whose create.view
// is this tag gets a name + icon form; the shell mounts it in a popup and listens
// for the bubbling `created`/`close` events EntryCreate emits via useEvents.
interface EntryCreateProps {
  type?: string
  'parent-id'?: string
}

const PROPS_SCHEMA: WippyPropsSchema = {
  type: 'object',
  properties: {
    type: { type: 'string' },
    'parent-id': { type: 'string' },
  },
}

const EntryCreate = lazyControl(
  () => import('./app/EntryCreate.vue'),
  { loading: 'Loading the create form…', failed: 'Could not load the create form. Reload the page to try again.' },
  useEvents,
)

class KicksideEntryCreateElement extends WippyVueElement<EntryCreateProps> {
  static get wippyConfig(): WippyElementConfig<EntryCreateProps> {
    return {
      propsSchema: PROPS_SCHEMA,
      hostCssKeys: ['themeConfigUrl', 'iframeCssUrl'] as const,
      inlineCss: stylesText,
    }
  }

  static get vueConfig() {
    return { rootComponent: EntryCreate }
  }
}

export async function webComponent() {
  return KicksideEntryCreateElement
}

define(import.meta.url, KicksideEntryCreateElement)
