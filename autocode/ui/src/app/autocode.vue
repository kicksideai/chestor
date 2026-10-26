<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useCatalog } from './catalog.ts'
import PageHead from './page-head.vue'
import TasksTab from './tasks.vue'
import AccountsTab from './accounts.vue'

type Tab = 'tasks' | 'accounts'
const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'tasks', label: 'Tasks', icon: 'tabler:player-play' },
  { id: 'accounts', label: 'Accounts', icon: 'tabler:key' },
]

const tab = ref<Tab>('tasks')
const { catalog, error, load } = useCatalog()
const query = ref('')
const count = ref(0)
const tasks = ref<InstanceType<typeof TasksTab> | null>(null)
const accounts = ref<InstanceType<typeof AccountsTab> | null>(null)
const selectedAgent = ref('')
async function addAccount(agent?: string) {
  if (agent) selectedAgent.value = agent
  tab.value = 'accounts'
  query.value = ''
  await nextTick()
  accounts.value?.open()
}
function create() { if (tab.value === 'tasks') tasks.value?.open(); else accounts.value?.open() }
</script>

<template>
  <div class="ac">
    <PageHead title="Autocode" subtitle="Run coding agents with your accounts and workspaces." :count="`${count} ${tab === 'tasks' ? 'task' : 'account'}${count === 1 ? '' : 's'}`" :action="tab === 'tasks' ? 'New task' : 'Add account'" v-model:query="query" :placeholder="tab === 'tasks' ? 'Search tasks…' : 'Search accounts…'" @create="create" />
    <div class="ac-bar"><nav class="ac-tabs" aria-label="Autocode views">
      <button v-for="t in tabs" :key="t.id" type="button" class="ac-tab kx-focus-outline" :class="{ active: tab === t.id }" :aria-pressed="tab === t.id" @click="tab = t.id; query = ''; count = 0"><Icon :icon="t.icon" /> {{ t.label }}</button>
    </nav></div>

    <p v-if="error && !catalog" class="kx-err">
      {{ error }} <button class="ac-link kx-focus-outline" type="button" @click="load">Retry</button>
    </p>
    <div v-else-if="!catalog" class="kx-loading"><Icon icon="tabler:loader-2" class="spin" /> Loading…</div>
    <main v-else class="ac-body">
      <TasksTab v-if="tab === 'tasks'" ref="tasks" :query="query" @count="count = $event" @agent-changed="selectedAgent = $event" @goto="addAccount" />
      <AccountsTab v-else ref="accounts" :query="query" :selected-agent="selectedAgent" @count="count = $event" />
    </main>
  </div>
</template>
