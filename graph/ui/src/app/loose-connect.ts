// Loose connect: a connection drag dropped on a node's body — not the 9px port
// dot — still connects, targeting the node under the pointer. Ports stay the
// precise path; the body is the forgiving one.
export interface NodeRect {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export function looseConnectTarget(
  startId: string,
  point: { x: number; y: number },
  nodes: NodeRect[],
): string | null {
  // Later entries render on top; walk from the top of the stack.
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i]
    if (n.id === startId) continue
    if (!n.width || !n.height) continue
    if (point.x >= n.x && point.x <= n.x + n.width && point.y >= n.y && point.y <= n.y + n.height) {
      return n.id
    }
  }
  return null
}
