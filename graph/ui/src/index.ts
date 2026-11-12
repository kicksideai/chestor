import { WippyVueElement, define, useEvents } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import { lazyPage } from './lazy'
import vfCore from '@vue-flow/core/dist/style.css?inline'
import vfTheme from '@vue-flow/core/dist/theme-default.css?inline'
import vfControls from '@vue-flow/controls/dist/style.css?inline'
import vfMinimap from '@vue-flow/minimap/dist/style.css?inline'
import stylesText from './styles.css?inline'

const SHADOW_CSS = [vfCore, vfTheme, vfControls, vfMinimap, stylesText].join('\n')

interface Props { entryId?: string; mode?: string; readOnly?: boolean }
interface Events { load: undefined; error: { message: string; error: unknown } }

const propsSchema = {
  type: 'object',
  properties: {
    'entry-id': {
      type: 'string',
      default: '',
      description: 'Workspace graph component id to load; an empty value renders the required-id error state.',
    },
    'read-only': {
      type: 'boolean',
      default: false,
      description: 'Disables editing while retaining full reading and inspection controls.',
    },
    mode: {
      type: 'string',
      default: 'preview',
      description: 'Rendering mode: preview for the compact read-focused canvas, or full for editing and navigation controls.',
    },
  },
} as WippyPropsSchema

class KicksideGraphElement extends WippyVueElement<Props, Events> {
  static get wippyConfig(): WippyElementConfig<Props> {
    return {
      propsSchema,
      hostCssKeys: ['themeConfigUrl', 'iframeCssUrl'] as const,
      inlineCss: SHADOW_CSS,
    }
  }

  static get vueConfig() {
    return {
      lazyConfig: lazyPage(
        () => import('./lazy-mount').then((module) => module.mountConfig),
        'Could not load the graph. Reload the page to try again.',
        useEvents,
      ),
    }
  }
}

export async function webComponent() {
  return KicksideGraphElement
}

define(import.meta.url, KicksideGraphElement)
