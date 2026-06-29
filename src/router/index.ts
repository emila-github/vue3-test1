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
      component: () => import('../views/DeepComponents.vue'),
    },
    // ====== 逻辑复用 ======
    {
      path: '/logic-reuse',
      name: 'logic-reuse',
      component: () => import('../views/LogicReuse.vue'),
    },
    // ====== 内置组件 ======
    {
      path: '/builtin-components',
      name: 'builtin-components',
      component: () => import('../views/BuiltinComponents.vue'),
    },
    // ====== TypeScript 学习 ======
    {
      path: '/typescript-demo',
      name: 'typescript-demo',
      component: () => import('../views/TypeScriptDemo.vue'),
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
