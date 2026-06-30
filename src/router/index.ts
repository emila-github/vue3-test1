import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    // ====== Vue 3 基础 ======
    {
      path: '/vue-basics',
      name: 'vue-basics',
      component: () => import('../views/basics/index.vue'),
    },
    // ====== 深入组件 ======
    {
      path: '/deep-components',
      name: 'deep-components',
      component: () => import('../views/deep/DeepComponentsIndex.vue'),
    },
    // ====== 逻辑复用 ======
    {
      path: '/logic-reuse',
      name: 'logic-reuse',
      component: () => import('../views/logic/LogicReuseIndex.vue'),
    },
    // ====== 内置组件 ======
    {
      path: '/builtin-components',
      name: 'builtin-components',
      component: () => import('../views/builtin/BuiltinComponentsIndex.vue'),
    },
    // ====== 应用规模化 ======
    {
      path: '/app-scale',
      name: 'app-scale',
      component: () => import('../views/app-scale/AppScaleIndex.vue'),
    },
    {
      path: '/app-scale/sfc',
      name: 'app-scale-sfc',
      component: () => import('../views/app-scale/SfcDemo.vue'),
    },
    {
      path: '/app-scale/toolchain',
      name: 'app-scale-toolchain',
      component: () => import('../views/app-scale/ToolchainDemo.vue'),
    },
    {
      path: '/app-scale/routing',
      name: 'app-scale-routing',
      component: () => import('../views/app-scale/RoutingOverview.vue'),
    },
    {
      path: '/app-scale/state',
      name: 'app-scale-state',
      component: () => import('../views/app-scale/StateOverview.vue'),
    },
    {
      path: '/app-scale/testing',
      name: 'app-scale-testing',
      component: () => import('../views/app-scale/TestingDemo.vue'),
    },
    {
      path: '/app-scale/ssr',
      name: 'app-scale-ssr',
      component: () => import('../views/app-scale/SsrDemo.vue'),
    },
    // ====== Vite 学习 ======
    {
      path: '/vite',
      name: 'vite',
      component: () => import('../views/vite/ViteIndex.vue'),
    },
    {
      path: '/vite/stage1',
      name: 'vite-stage1',
      component: () => import('../views/vite/Stage1QuickStart.vue'),
    },
    {
      path: '/vite/stage2',
      name: 'vite-stage2',
      component: () => import('../views/vite/Stage2Config.vue'),
    },
    {
      path: '/vite/stage3',
      name: 'vite-stage3',
      component: () => import('../views/vite/Stage3Plugins.vue'),
    },
    {
      path: '/vite/stage4',
      name: 'vite-stage4',
      component: () => import('../views/vite/Stage4Build.vue'),
    },
    {
      path: '/vite/stage5',
      name: 'vite-stage5',
      component: () => import('../views/vite/Stage5Advanced.vue'),
    },
    // ====== Prettier 学习 ======
    {
      path: '/prettier',
      name: 'prettier',
      component: () => import('../views/prettier/PrettierIndex.vue'),
    },
    {
      path: '/prettier/stage1',
      name: 'prettier-stage1',
      component: () => import('../views/prettier/Stage1QuickStart.vue'),
    },
    {
      path: '/prettier/stage2',
      name: 'prettier-stage2',
      component: () => import('../views/prettier/Stage2Config.vue'),
    },
    {
      path: '/prettier/stage3',
      name: 'prettier-stage3',
      component: () => import('../views/prettier/Stage3IgnoreOverride.vue'),
    },
    {
      path: '/prettier/stage4',
      name: 'prettier-stage4',
      component: () => import('../views/prettier/Stage4ESLint.vue'),
    },
    {
      path: '/prettier/stage5',
      name: 'prettier-stage5',
      component: () => import('../views/prettier/Stage5Advanced.vue'),
    },
    // ====== 权限控制学习 ======
    {
      path: '/permission',
      name: 'permission',
      component: () => import('../views/permission/PermissionIndex.vue'),
    },
    {
      path: '/permission/stage1',
      name: 'permission-stage1',
      component: () => import('../views/permission/Stage1Concept.vue'),
    },
    {
      path: '/permission/stage2',
      name: 'permission-stage2',
      component: () => import('../views/permission/Stage2Directive.vue'),
    },
    {
      path: '/permission/stage3',
      name: 'permission-stage3',
      component: () => import('../views/permission/Stage3DataControl.vue'),
    },
    {
      path: '/permission/stage4',
      name: 'permission-stage4',
      component: () => import('../views/permission/Stage4MultiPermission.vue'),
    },
    {
      path: '/permission/stage5',
      name: 'permission-stage5',
      component: () => import('../views/permission/Stage5FullExample.vue'),
    },
    // ====== ESLint 学习 ======
    {
      path: '/eslint',
      name: 'eslint',
      component: () => import('../views/eslint/ESLintIndex.vue'),
    },
    {
      path: '/eslint/stage1',
      name: 'eslint-stage1',
      component: () => import('../views/eslint/Stage1QuickStart.vue'),
    },
    {
      path: '/eslint/stage2',
      name: 'eslint-stage2',
      component: () => import('../views/eslint/Stage2Config.vue'),
    },
    {
      path: '/eslint/stage3',
      name: 'eslint-stage3',
      component: () => import('../views/eslint/Stage3Plugins.vue'),
    },
    {
      path: '/eslint/stage4',
      name: 'eslint-stage4',
      component: () => import('../views/eslint/Stage4VueTs.vue'),
    },
    {
      path: '/eslint/stage5',
      name: 'eslint-stage5',
      component: () => import('../views/eslint/Stage5Advanced.vue'),
    },
    // ====== TypeScript 学习 ======
    {
      path: '/typescript-demo',
      name: 'typescript-demo',
      component: () => import('../views/ts/TypeScriptDemoIndex.vue'),
    },
    // ====== 综合实战 ======
    {
      path: '/user-crud',
      name: 'user-crud',
      component: () => import('../views/user/UserCrud.vue'),
    },
    {
      path: '/api-demo',
      name: 'api-demo',
      component: () => import('../views/ApiDemo.vue'),
    },
    // ====== VueRequest 示例 ======
    {
      path: '/vue-request',
      name: 'vue-request',
      component: () => import('../views/vue-request/VueRequestIndex.vue'),
    },
    {
      path: '/vue-request/basic',
      name: 'vue-request-basic',
      component: () => import('../views/vue-request/BasicDemo.vue'),
    },
    {
      path: '/vue-request/pagination',
      name: 'vue-request-pagination',
      component: () => import('../views/vue-request/PaginationDemo.vue'),
    },
    {
      path: '/vue-request/load-more',
      name: 'vue-request-load-more',
      component: () => import('../views/vue-request/LoadMoreDemo.vue'),
    },
    {
      path: '/vue-request/advanced',
      name: 'vue-request-advanced',
      component: () => import('../views/vue-request/AdvancedDemo.vue'),
    },
    // ====== Vue Router 5.x 学习 ======
    {
      path: '/vue-router',
      name: 'vue-router',
      component: () => import('../views/vue-router/VueRouterIndex.vue'),
    },
    {
      path: '/vue-router/stage1',
      name: 'vue-router-stage1',
      component: () => import('../views/vue-router/Stage1Basic.vue'),
    },
    {
      path: '/vue-router/stage2',
      name: 'vue-router-stage2',
      component: () => import('../views/vue-router/Stage2Dynamic.vue'),
    },
    {
      path: '/vue-router/stage2/:id',
      name: 'vue-router-stage2-product',
      component: () => import('../views/vue-router/ProductDetail.vue'),
    },
    {
      path: '/vue-router/stage3',
      name: 'vue-router-stage3',
      component: () => import('../views/vue-router/Stage3Nested.vue'),
      children: [
        {
          path: 'profile',
          component: () => import('../views/vue-router/NestedProfile.vue'),
        },
        {
          path: 'orders',
          component: () => import('../views/vue-router/NestedOrders.vue'),
        },
        {
          path: 'settings',
          component: () => import('../views/vue-router/NestedSettings.vue'),
        },
      ],
    },
    {
      path: '/vue-router/stage4',
      name: 'vue-router-stage4',
      component: () => import('../views/vue-router/Stage4Guards.vue'),
    },
    {
      path: '/vue-router/stage4/admin',
      name: 'vue-router-stage4-admin',
      component: () => import('../views/vue-router/NestedAdmin.vue'),
    },
    {
      path: '/vue-router/stage5',
      name: 'vue-router-stage5',
      component: () => import('../views/vue-router/Stage5Advanced.vue'),
    },
    // ====== Pinia 状态管理 ======
    {
      path: '/pinia',
      name: 'pinia',
      component: () => import('../views/pinia/PiniaIndex.vue'),
    },
    {
      path: '/pinia/stage1',
      name: 'pinia-stage1',
      component: () => import('../views/pinia/Stage1Setup.vue'),
    },
    {
      path: '/pinia/stage2',
      name: 'pinia-stage2',
      component: () => import('../views/pinia/Stage2State.vue'),
    },
    {
      path: '/pinia/stage3',
      name: 'pinia-stage3',
      component: () => import('../views/pinia/Stage3Actions.vue'),
    },
    {
      path: '/pinia/stage4',
      name: 'pinia-stage4',
      component: () => import('../views/pinia/Stage4Multiple.vue'),
    },
    {
      path: '/pinia/stage5',
      name: 'pinia-stage5',
      component: () => import('../views/pinia/Stage5Advanced.vue'),
    },
    // ====== Ant Design Vue 学习 ======
    {
      path: '/antd',
      name: 'antd',
      component: () => import('../views/antd/AntdIndex.vue'),
    },
    {
      path: '/antd/stage1',
      name: 'antd-stage1',
      component: () => import('../views/antd/Stage1GettingStarted.vue'),
    },
    {
      path: '/antd/stage2',
      name: 'antd-stage2',
      component: () => import('../views/antd/Stage2CoreComponents.vue'),
    },
    {
      path: '/antd/stage3',
      name: 'antd-stage3',
      component: () => import('../views/antd/Stage3Encapsulation.vue'),
    },
    {
      path: '/antd/stage4',
      name: 'antd-stage4',
      component: () => import('../views/antd/Stage4Theme.vue'),
    },
    {
      path: '/antd/stage5',
      name: 'antd-stage5',
      component: () => import('../views/antd/Stage5Optimization.vue'),
    },
    {
      path: '/antd/stage6',
      name: 'antd-stage6',
      component: () => import('../views/antd/Stage6TableDemo.vue'),
    },
    ...routes,
  ],
})

// 支持开发环境下的热更新（无需刷新页面即可更新路由）
if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
