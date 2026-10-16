import { useEvents, useProps } from '@wippy-fe/webcomponent-vue'
import type { ComponentProps } from './types'

export interface Events {
  load: undefined
  unload: undefined
  error: { message: string, error: unknown }
  // Deep-link navigation: a relative sub-path (entry id) opens that entry's full
  // view at /workspace/<id>; "" returns to the tree. The surface host turns this
  // into a shell route, so the manage view is a routed, deep-linkable inner page.
  navigate: string
}

export const useComponentProps = () => useProps<ComponentProps>()
export const useComponentEvents = () => useEvents<Events>()
