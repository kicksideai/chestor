import type { InjectionKey, Ref } from 'vue'

// Injected by GraphApp so a canvas node can rename itself in place. A non-null
// seed replaces the name with what was typed; a null seed edits the current
// name with the text selected.
export interface NodeEditState {
  id: string
  seed: string | null
}

export interface NodeEditCtx {
  state: Ref<NodeEditState | null>
  commit: (id: string, name: string) => void
  close: () => void
}

export const NODE_EDIT_KEY: InjectionKey<NodeEditCtx> = Symbol('kg-node-edit')
