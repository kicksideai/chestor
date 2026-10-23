// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { wippyComponentPlugin } from '@wippy-fe/vite-plugin'
import { defineConfig } from 'vite'

const moduleRoot = fileURLToPath(new URL('.', import.meta.url))

// The KickSide shell serves these packages through its import map; they must
// stay external so the bundle never ships its own copy (a bundled copy both
// bloats the artifact and breaks on `process.env` references in library code).
const shellProvided = [
  'vue',
  'pinia',
  'vue-router',
  'axios',
  'nanoevents',
  'luxon',
  '@iconify/vue',
  'iconify-icon',
  '@tanstack/vue-query',
  'sanitize-html',
  'markdown-it',
  'markdown-it-async',
  '@wippy-fe/proxy',
  '@wippy-fe/markdown-iframe',
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

export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { isCustomElement: customElement } } }), wippyComponentPlugin()],
  // Lib builds don't auto-replace process.env; provide it so deps that read
  // NODE_ENV don't throw "process is not defined" in the browser/shadow DOM.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
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
      external: [...shellProvided, /^primevue\//],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
      },
      preserveEntrySignatures: false,
    },
    sourcemap: true,
  },
})
