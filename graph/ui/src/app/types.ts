export interface MaterialSource {
  type?: 'component' | 'upload' | 'url' | 'inline' | string
  component_id?: string
  upload_id?: string
  url?: string
  text?: string
}

export interface GraphMaterial {
  id: string
  target_type: 'graph' | 'node' | 'edge'
  target_id?: string
  kind: string
  title?: string
  summary?: string
  source?: MaterialSource
  meta?: Record<string, unknown>
  sort_order?: number
}

export interface GraphNode {
  id: string
  type: string
  name: string
  description?: string
  parent_id?: string
  properties?: Record<string, unknown>
  tags?: string[]
  status?: string
  sort_order?: number
  layout?: LayoutPosition
  materials?: GraphMaterial[]
  children?: GraphNode[]
  child_count?: number
}

export interface GraphEdge {
  id: string
  type: string
  source_id: string
  target_id: string
  label?: string
  properties?: Record<string, unknown>
  materials?: GraphMaterial[]
}

export interface GraphTypeDef {
  id: string
  title?: string
  icon?: string
  color?: string
  stroke?: string
  strokeWidth?: number
  category?: string
  targets?: string[]
  display?: string
  fields?: Record<string, unknown>
  render?: Record<string, unknown>
  source_schema?: Record<string, unknown>
  [key: string]: unknown
}

export interface LayoutPosition {
  x: number
  y: number
  width?: number
  height?: number
  pinned?: boolean
  meta?: Record<string, unknown>
}

export interface GraphState {
  entry_id?: string
  thread_id?: string
  nodes: GraphNode[]
  edges: GraphEdge[]
  materials: GraphMaterial[]
  schema: {
    node_types: GraphTypeDef[]
    edge_types: GraphTypeDef[]
    material_types: GraphTypeDef[]
  }
  layout: {
    positions: Record<string, LayoutPosition>
    viewport?: { root_id?: string; x: number; y: number; zoom: number }
  }
  settings: Record<string, unknown>
  counts?: { nodes: number; edges: number; materials: number }
  can_undo?: boolean
  can_redo?: boolean
}

export interface FlatGraph {
  nodes: GraphNode[]
  nodeById: Map<string, GraphNode>
  childrenByParent: Map<string, GraphNode[]>
}

export const EV = {
  NODE_ADDED: 'chestor.graph.events:node.added',
  NODE_UPDATED: 'chestor.graph.events:node.updated',
  NODE_REMOVED: 'chestor.graph.events:node.removed',
  EDGE_ADDED: 'chestor.graph.events:edge.added',
  EDGE_UPDATED: 'chestor.graph.events:edge.updated',
  EDGE_REMOVED: 'chestor.graph.events:edge.removed',
  MATERIAL_ATTACHED: 'chestor.graph.events:material.attached',
  MATERIAL_UPDATED: 'chestor.graph.events:material.updated',
  MATERIAL_DETACHED: 'chestor.graph.events:material.detached',
  NODE_TYPE_REGISTERED: 'chestor.graph.events:node-type.registered',
  NODE_TYPE_UPDATED: 'chestor.graph.events:node-type.updated',
  NODE_TYPE_REMOVED: 'chestor.graph.events:node-type.removed',
  EDGE_TYPE_REGISTERED: 'chestor.graph.events:edge-type.registered',
  EDGE_TYPE_UPDATED: 'chestor.graph.events:edge-type.updated',
  EDGE_TYPE_REMOVED: 'chestor.graph.events:edge-type.removed',
  MATERIAL_TYPE_REGISTERED: 'chestor.graph.events:material-type.registered',
  MATERIAL_TYPE_UPDATED: 'chestor.graph.events:material-type.updated',
  MATERIAL_TYPE_REMOVED: 'chestor.graph.events:material-type.removed',
  LAYOUT_POSITION_SET: 'chestor.graph.events:layout.position-set',
  LAYOUT_POSITION_CLEARED: 'chestor.graph.events:layout.position-cleared',
  LAYOUT_VIEWPORT_SET: 'chestor.graph.events:layout.viewport-set',
} as const

export const PROJECTION_KIND = 'chestor.graph:state'
