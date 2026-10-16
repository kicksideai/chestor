<script setup lang="ts">
// Read-only table node (Beacon-style). A clean display card — the canvas stays
// reliable because there are no inline inputs fighting the drag/zoom. Editing is
// done in the side panel. Per-column source/target handles let relations connect
// column-to-column. Node `type` is "schemaTable".
import { Handle, Position, type NodeProps } from '@vue-flow/core'

type SchemaNodeData = {
  label: string
  tableId: string
  columns: Array<{
    id: string
    name: string
    col_type?: string
    primary_key?: boolean | number
    unique_col?: boolean | number
    nullable?: boolean | number
  }>
  columnCount: number
}

defineProps<NodeProps<SchemaNodeData>>()

const TYPE_LABEL: Record<string, string> = {
  TEXT: 'text', INTEGER: 'int', BIGINT: 'bigint', BOOLEAN: 'bool',
  NUMERIC: 'num', TIMESTAMP: 'ts', UUID: 'uuid', JSONB: 'json',
}
const isPK = (c: any) => c.primary_key === true || c.primary_key === 1
const isUQ = (c: any) => c.unique_col === true || c.unique_col === 1
const isNN = (c: any) => !(c.nullable === true || c.nullable === 1) && !isPK(c)
const tlabel = (t?: string) => TYPE_LABEL[t || ''] || (t || '').toLowerCase()
</script>

<template>
  <div class="schema-node" :class="{ 'schema-node--selected': selected }">
    <div class="schema-node__header">
      <span class="schema-node__header-name" :title="data.label">{{ data.label }}</span>
      <span class="schema-node__header-count">{{ data.columnCount }}</span>
    </div>
    <div class="schema-node__columns">
      <div v-for="col in data.columns" :key="col.id" class="schema-node__col">
        <Handle type="target" :position="Position.Left" :id="'target-' + col.id"
          class="schema-node__handle schema-node__handle--target" :style="{ top: 'auto' }" />
        <span class="schema-node__col-name" :title="col.name">{{ col.name }}</span>
        <span v-if="isPK(col)" class="schema-node__badge schema-node__badge--pk">PK</span>
        <span v-if="isUQ(col)" class="schema-node__badge schema-node__badge--uq">UQ</span>
        <span v-if="isNN(col)" class="schema-node__badge schema-node__badge--nn">NN</span>
        <span class="schema-node__col-type">{{ tlabel(col.col_type) }}</span>
        <Handle type="source" :position="Position.Right" :id="'source-' + col.id"
          class="schema-node__handle schema-node__handle--source" :style="{ top: 'auto' }" />
      </div>
      <div v-if="!data.columns.length" class="schema-node__empty">No columns</div>
    </div>
  </div>
</template>
