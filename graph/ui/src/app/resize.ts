import type { InjectionKey } from 'vue'

// Injected by GraphApp so canvas nodes can persist a grip-drag width change
// through the command pipeline.
export type ResizeNodeFn = (id: string, width: number) => void
export const RESIZE_NODE_KEY: InjectionKey<ResizeNodeFn> = Symbol('kg-resize-node')
