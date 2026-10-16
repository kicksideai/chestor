import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { wippyComponentPlugin } from '@wippy-fe/vite-plugin';
import { defineConfig } from 'vite';
export default defineConfig({
    plugins: [vue(), wippyComponentPlugin()],
    base: '',
    build: {
        target: 'esnext',
        lib: {
            entry: { index: resolve(__dirname, 'src/index.ts') },
            name: 'ChestorJournal',
            formats: ['es'],
        },
        rollupOptions: {
            preserveEntrySignatures: false,
            input: { index: resolve(__dirname, 'src/index.ts') },
            external: ['vue', '@iconify/vue', '@wippy-fe/proxy'],
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name]-[hash].js',
                assetFileNames: '[name]-[hash][extname]',
            },
        },
        sourcemap: true,
    },
});
