// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { wippyComponentPlugin } from '@wippy-fe/vite-plugin'
import { defineConfig } from 'vite'

const moduleRoot = fileURLToPath(new URL('.', import.meta.url))

// Both the web host and the shell import maps provide these packages.
// Every other dependency, including PrimeVue, belongs to the bundle.
const hostProvided = [
  'vue', 'pinia', 'vue-router', 'axios', 'nanoevents', 'luxon',
  '@iconify/vue', '@wippy-fe/proxy',
]

// One bundle per registered element: the page, the System settings tab, the
// driver credential card and the task Block's config editor.
const entries = {
  index: resolve(moduleRoot, 'src/index.ts'),
  admin: resolve(moduleRoot, 'src/admin.ts'),
  'driver-account': resolve(moduleRoot, 'src/driver-account.ts'),
  'task-config': resolve(moduleRoot, 'src/task-config.ts'),
}

const customElement = (tag: string) => tag.startsWith('wc-') || tag.startsWith('chestor-') || tag.startsWith('kickside-')

export default defineConfig(({ mode }) => ({
  plugins: [vue({ template: { compilerOptions: { isCustomElement: customElement } } }), wippyComponentPlugin()],
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
      external: hostProvided,
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
      },
      preserveEntrySignatures: false,
    },
    sourcemap: false,
  },
}))
