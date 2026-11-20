// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { wippyComponentPlugin } from '@wippy-fe/vite-plugin'
import { defineConfig } from 'vite'
import { hostExternals, wcRuntimeChunk } from '../../wc-build'

const moduleRoot = fileURLToPath(new URL('.', import.meta.url))

// Each registered element has its own entry so Wippy can load it by tag.
const entries = {
  index: resolve(moduleRoot, 'src/index.ts'),
  admin: resolve(moduleRoot, 'src/admin.ts'),
  'driver-account': resolve(moduleRoot, 'src/account-credential.ts'),
  'provider-accounts': resolve(moduleRoot, 'src/provider-accounts.ts'),
  'claude-accounts': resolve(moduleRoot, 'src/claude-accounts.ts'),
  'codex-accounts': resolve(moduleRoot, 'src/codex-accounts.ts'),
  'task-config': resolve(moduleRoot, 'src/task-config.ts'),
}

const customElement = (tag: string) => tag.startsWith('wc-') || tag.startsWith('chestor-') || tag.startsWith('kickside-')

export default defineConfig(({ mode }) => ({
  plugins: [vue({ template: { compilerOptions: { isCustomElement: customElement } } }), wippyComponentPlugin({ required: true, lazyEntries: Object.keys(entries) })],
  // The kickside/ui-kit stylesheets are a build input `make ui-kit` materializes
  // from the Hub; they are bundled, never installed as an npm dependency.
  resolve: { alias: { '@kickside/ui-kit': resolve(moduleRoot, '.wippy/npm/@kickside/ui-kit') } },
  // Lib builds don't auto-replace process.env; provide it so deps that read
  // NODE_ENV don't throw "process is not defined" in the browser/shadow DOM.
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env': '{}',
  },
  build: {
    target: 'esnext',
    lib: {
      entry: entries,
      name: 'ChestorAutocode',
      formats: ['es'],
    },
    rollupOptions: {
      input: entries,
      external: hostExternals,
      output: {
        manualChunks: wcRuntimeChunk,
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
      },
      preserveEntrySignatures: 'strict',
    },
    sourcemap: false,
  },
}))
