/**
 * The layout solve, off the reading thread.
 *
 * The projection itself is `forceLayout`, unchanged and still covered by its
 * own spec; this worker only moves the solve so that laying out a large graph
 * never freezes the pane the reader is panning.
 */
import { solveLayout } from './layout-protocol'
import type { LayoutRequest } from './layout-protocol'

const scope = self as unknown as {
  postMessage: (value: unknown, transfer?: Transferable[]) => void
  onmessage: ((event: MessageEvent<LayoutRequest>) => void) | null
}

scope.onmessage = event => {
  const result = solveLayout(event.data)
  scope.postMessage(result, [result.positions.buffer, result.geometry.buffer])
}

export {}
