// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: { environment: 'happy-dom' },
})
