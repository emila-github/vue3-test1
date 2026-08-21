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
import { permissionDirective, permissionAllDirective, permissionNoneDirective } from './directives/permission'

// Ant Design Vue 4.x 使用 CSS-in-JS，组件样式由各自内部自动注入
// 组件按需自动导入由 unplugin-vue-components 处理（见 vite.config.ts）
// 无需 app.use(Antd)，也无需手动 import 组件

const app = createApp(App)

// ==================== 全局权限指令家族 ====================
// 基于 usePermission 单例：任意页面直接用
//   <van-button v-permission="'car:create'">新增</van-button>          // 拥有其一即可见
//   <van-button v-permission-all="['car:edit','car:delete']">更多</van-button> // 需全部拥有
//   <van-button v-permission-none="'car:view'">访客可见</van-button>   // 拥有任一即隐藏
// 无权限时隐藏元素（display:none，规避 v-for 下 removeChild 的 DOM 复用问题），
// 并 watch 权限集合变化，角色切换后自动重新生效。
app.directive('permission', permissionDirective)
app.directive('permission-all', permissionAllDirective)
app.directive('permission-none', permissionNoneDirective)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(i18n)

initSkin(true)
app.mount('#app')
