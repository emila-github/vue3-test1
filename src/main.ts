import './assets/main.css'
import { initSkin } from './composables/usePiccSkin'

import 'element-plus/dist/index.css'
import 'vant/lib/index.css'
import './styles/vant-picc.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { i18n } from './i18n'

import App from './App.vue'
import router from './router'
import { usePermission } from './composables/usePermission'

// Ant Design Vue 4.x 使用 CSS-in-JS，组件样式由各自内部自动注入
// 组件按需自动导入由 unplugin-vue-components 处理（见 vite.config.ts）
// 无需 app.use(Antd)，也无需手动 import 组件

const app = createApp(App)

// ==================== 全局 v-permission 指令 ====================
// 与 Stage6（站点级权限整合）提交的 RBAC 方案一致：任意页面直接用
//   <van-button v-permission="'car:create'">新增</van-button>
//   <van-button v-permission="['car:edit','car:delete']">更多</van-button>
// 无权限时隐藏元素（display:none，规避 v-for 下 removeChild 的 DOM 复用问题），
// 并监听 updated，角色切换后自动重新生效（依赖 usePermission 全局单例）。
const { hasAny } = usePermission()
function applyPermission(el: HTMLElement, value: unknown) {
  const perms = Array.isArray(value) ? (value as string[]) : [value as string]
  el.style.display = hasAny(...perms) ? '' : 'none'
}
app.directive('permission', {
  mounted(el: HTMLElement, binding) {
    applyPermission(el, binding.value)
  },
  updated(el: HTMLElement, binding) {
    applyPermission(el, binding.value)
  },
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(i18n)

initSkin(true)
app.mount('#app')
