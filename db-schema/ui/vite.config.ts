import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { wippyComponentPlugin } from '@wippy-fe/vite-plugin'
import { defineConfig } from 'vite'
import { hostExternals, wcRuntimeChunk } from '../../wc-build'

export default defineConfig({
  plugins: [vue(), wippyComponentPlugin()],
  base: '',
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}',
  },
  build: {
    target: 'esnext',
    outDir: resolve(__dirname, '../static'),
    emptyOutDir: true,
    lib: {
      entry: { index: resolve(__dirname, 'src/index.ts') },
      name: 'KicksideDbSchema',
      formats: ['es'],
    },
    rollupOptions: {
      input: { index: resolve(__dirname, 'src/index.ts') },
      external: hostExternals,
      preserveEntrySignatures: 'strict',
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
