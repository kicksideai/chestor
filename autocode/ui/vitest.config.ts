// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

const dependency = (path: string) => new URL(`./node_modules/${path}`, import.meta.url).pathname
export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { isCustomElement: tag => tag.startsWith('chestor-') || tag.startsWith('kickside-') } } })],
  server: { fs: { allow: ['..'] } },
  resolve: { alias: {
    '@iconify/vue': dependency('@iconify/vue/dist/iconify.mjs'),
    '@wippy-fe/proxy': dependency('@wippy-fe/proxy/index.mjs'),
    '@wippy-fe/webcomponent-vue': dependency('@wippy-fe/webcomponent-vue/dist/index.js'),
    vitest: dependency('vitest/dist/index.js'),
    vue: dependency('vue/dist/vue.runtime.esm-bundler.js'),
    '@vue/test-utils': dependency('@vue/test-utils/dist/vue-test-utils.esm-bundler.mjs'),
    ajv: dependency('ajv/dist/ajv.js'),
  } },
  test: { environment: 'happy-dom', include: ['../test/ui/**/*.test.ts'], clearMocks: true },
})
