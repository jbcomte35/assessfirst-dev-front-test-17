import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import UnheadVite from '@unhead/addons/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import { unheadVueComposablesImports } from '@unhead/vue'

const isProd = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
  root: process.cwd(),
  base: '/',
  publicDir: 'public',
  logLevel: 'info',
  server: {
    // Vite 4 defaults to 5173, but you can override it with the port option.
    port: 3000,
  },
  /**
   * By default, Vite will crawl your index.html to detect dependencies that
   * need to be pre-bundled. If build.rollupOptions.input is specified,
   * Vite will crawl those entry points instead.
   *
   * @see https://vitejs.dev/config/#optimizedeps-entries
   */
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'unplugin-vue-router/runtime',
    ],
  },
  resolve: {
    alias: [
      {
        find: '/@src/',
        replacement: `/src/`,
      },
    ],
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    // Do not warn about large chunks
    // chunkSizeWarningLimit: Infinity,
    // Double the default size threshold for inlined assets
    // https://vitejs.dev/config/build-options.html#build-assetsinlinelimit
    assetsInlineLimit: 4096 * 2,
  },
  plugins: [
    /**
     * plugin-vue plugin inject vue library and allow sfc files to work (*.vue)
     *
     * @see https://github.com/vitejs/vite/tree/main/packages/plugin-vue
     */
    Vue({
      include: [/\.vue$/],
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    }),

    /**
     * unplugin-vue-router plugin generate routes based on file system
     * allow to use typed routes and usage of defineLoader
     *
     * @see https://github.com/posva/unplugin-vue-router
     * @see https://github.com/vuejs/rfcs/blob/ad69da2aee9242ef88f036713db68f3ef274bb1b/active-rfcs/0000-router-use-loader.md
     */
    VueRouter({
      routesFolder: 'src/pages',
      dts: './types/router.d.ts',

      /**
       * Data Fetching is an experimental feature from vue & vue-router
       *
       * @see https://github.com/vuejs/rfcs/discussions/460
       * @see https://github.com/posva/unplugin-vue-router/tree/main/src/data-fetching
       */
      dataFetching: true,
    }),

    /**
     * Unhead provides a Vite plugin to optimise your builds, by removing composables that aren't needed and simplifying your code.
     *
     * @see https://unhead.harlanzw.com/guide/getting-started/vite-plugin
     */
    UnheadVite(),


    /**
     * unplugin-auto-import allow to automaticaly import modules/components
     *
     * @see https://github.com/antfu/unplugin-auto-import
     */
    AutoImport({
      dts: './types/imports.d.ts',
      imports: ['vue', VueRouterAutoImports, unheadVueComposablesImports],
    }),

    /**
     * unplugin-vue-components plugin is responsible of autoloading components
     *
     * @see https://github.com/antfu/unplugin-vue-components
     */
    Components({
      dirs: ['src/components', 'src/layouts'],
      extensions: ['vue', 'md'],
      dts: './types/components.d.ts',
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    }),
  ],
  mode: isProd ? 'production' : 'development',
})
