import { WippyVueElement, define, useEvents } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import { lazyPage } from './lazy'
// @vue-flow styles must live in the shadow root (the renderer is a shadow-DOM web
// component), so they are inlined alongside the renderer's own styles.
import vfCore from '@vue-flow/core/dist/style.css?inline'
import vfTheme from '@vue-flow/core/dist/theme-default.css?inline'
import vfControls from '@vue-flow/controls/dist/style.css?inline'
import vfMinimap from '@vue-flow/minimap/dist/style.css?inline'
import stylesText from './styles.css?inline'

// All of @vue-flow's structural CSS (viewport/pane/node positioning, handles,
// edges, controls, minimap) MUST be in the shadow root, then our overrides last.
const SHADOW_CSS = [vfCore, vfTheme, vfControls, vfMinimap, stylesText].join('\n')

interface Props { entryId?: string; mode?: string; readOnly?: boolean }
interface Events { load: undefined; error: { message: string; error: unknown } }

// chestor-db-schema -- the renderer the workspace shell mounts for a `database`
// entry. It receives the entry id and reads/writes its typed schema. Proves an
// entry type is a pure declarative module: type + lifecycle + this renderer.
class KicksideDbSchemaElement extends WippyVueElement<Props, Events> {
  static get wippyConfig(): WippyElementConfig<Props> {
    return {
      propsSchema: { type: 'object', properties: { 'entry-id': { type: 'string' }, mode: { type: 'string' }, 'read-only': { type: 'boolean', default: false, description: 'Disables editing while retaining full reading and inspection controls.' } } } as WippyPropsSchema,
      hostCssKeys: ['themeConfigUrl', 'iframeCssUrl'] as const,
      inlineCss: SHADOW_CSS,
    }
  }

  static get vueConfig() {
    return {
      lazyConfig: lazyPage(
        () => import('./lazy-mount').then((module) => module.mountConfig),
        'Could not load the database schema. Reload the page to try again.',
        useEvents,
      ),
    }
  }
}

export async function webComponent() {
  return KicksideDbSchemaElement
}

define(import.meta.url, KicksideDbSchemaElement)
