import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// ===== Ant Design Vue 4.x =====
// 注：v4 使用 CSS-in-JS，无需引入 CSS 文件，样式会自动注入
import Antd from 'ant-design-vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')
