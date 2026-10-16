<script setup lang="ts">
// Vendored from the canonical models shared shell (platform/models/ui/src/app/shared/Confirm.vue). Keep in sync; shell consolidation tracked separately.
import Button from './Button.vue'

// Centered confirmation dialog for destructive actions.
defineProps<{
  open: boolean
  title: string
  message?: string
  confirmLabel?: string
  danger?: boolean
  busy?: boolean
}>()
const emit = defineEmits<{ (e: 'confirm'): void; (e: 'cancel'): void }>()
</script>

<template>
  <Transition name="km-modal">
    <div v-if="open" class="km-modal-mask" @click.self="emit('cancel')">
      <div class="km-confirm" role="alertdialog" aria-modal="true">
        <div class="km-confirm-title">{{ title }}</div>
        <p v-if="message" class="km-confirm-msg">{{ message }}</p>
        <div class="km-confirm-acts">
          <Button variant="ghost" :disabled="busy" @click="emit('cancel')">Cancel</Button>
          <Button :variant="danger ? 'danger' : 'primary'" :loading="busy" @click="emit('confirm')">
            {{ confirmLabel || 'Confirm' }}
          </Button>
        </div>
      </div>
    </div>
  </Transition>
</template>
