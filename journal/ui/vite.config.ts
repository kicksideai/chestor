import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { wippyComponentPlugin } from '@wippy-fe/vite-plugin'
import { defineConfig } from 'vite'
import { hostExternals, wcRuntimeChunk } from '../../wc-build'

export default defineConfig({
  plugins: [vue(), wippyComponentPlugin({ required: true, lazyEntries: ['index'] })],
  // The kickside/ui-kit package is a build input `make ui-kit` materializes
  // from the Hub; it is bundled, never installed as an npm dependency.
  resolve: { alias: { '@kickside/ui-kit': resolve(__dirname, '.wippy/npm/@kickside/ui-kit') } },
  base: '',
  define: { 'process.env.NODE_ENV': JSON.stringify('production'), 'process.env': '{}' },
  build: {
    target: 'esnext',
    lib: {
      entry: { index: resolve(__dirname, 'src/index.ts') },
      name: 'ChestorJournal',
      formats: ['es'],
    },
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      input: { index: resolve(__dirname, 'src/index.ts') },
      external: hostExternals,
      output: {
        manualChunks: wcRuntimeChunk,
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
      },
    },
    sourcemap: true,
  },
})
