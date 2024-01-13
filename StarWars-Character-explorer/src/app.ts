import { createApp as createVueApp } from 'vue'
import { createHead } from '@unhead/vue'
import { InferSeoMetaPlugin } from '@unhead/addons'
import { createRouter } from './router'
import { createPinia } from 'pinia'
import AppVue from './App.vue'

export async function createApp() {
  const app = createVueApp(AppVue)

  const head = createHead({
    plugins: [InferSeoMetaPlugin()],
  })
  app.use(head)

  const router = createRouter()
  app.use(router)

  const store = createPinia()
  app.use(store)

  return app
}
