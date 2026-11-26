<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
import ItemRow from './ItemRow.vue'
import type { ItemRef } from './attention'
import { DORMANT_AFTER_S } from './staleness'
import type { DormantProgram } from './staleness'

/** Open programs nothing has touched for days, oldest first. */
defineProps<{ quiet: DormantProgram[]; now: number }>()
defineEmits<{ open: [target: ItemRef]; close: [] }>()

const days = Math.round(DORMANT_AFTER_S / 86400)
</script>

<template>
  <section class="jr-section" aria-labelledby="jr-quiet">
    <SettingsSectionHead id="jr-quiet" title="Gone quiet"
      :description="`Open work nothing has touched for ${days} days or more. Ask an agent to settle it after reading its history.`">
      <template #actions>
        <button type="button" class="kx-iconbtn" aria-label="Close" title="Close" @click="$emit('close')">
          <Icon icon="tabler:x" aria-hidden="true" />
        </button>
      </template>
    </SettingsSectionHead>
    <ItemRow
      v-for="program in quiet" :key="program.root.id"
      :title="program.root.title" :detail="`${program.open} open of ${program.tasks} tasks`"
      :at="program.lastActivityAt" :now="now"
      @open="$emit('open', { kind: 'task', id: program.root.id })"
    />
  </section>
</template>
