import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { i18n } from './i18n'

import App from './App.vue'
import router from './router'

// Ant Design Vue 4.x 使用 CSS-in-JS，组件样式由各自内部自动注入
// 组件按需自动导入由 unplugin-vue-components 处理（见 vite.config.ts）
// 无需 app.use(Antd)，也无需手动 import 组件

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
