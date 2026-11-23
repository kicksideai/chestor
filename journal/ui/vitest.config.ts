// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@kickside/ui-kit': fileURLToPath(new URL('./.wippy/npm/@kickside/ui-kit', import.meta.url)) } },
  test: { environment: 'happy-dom' },
})
