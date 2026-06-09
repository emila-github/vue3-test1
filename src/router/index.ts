import { createRouter, createWebHistory } from 'vue-router'
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
    // ====== Vue 3 学习示例路由 ======
    {
      path: '/template-syntax',
      name: 'template-syntax',
      component: () => import('../views/TemplateSyntax.vue'),
    },
    {
      path: '/reactivity',
      name: 'reactivity',
      component: () => import('../views/Reactivity.vue'),
    },
    {
      path: '/computed',
      name: 'computed',
      component: () => import('../views/ComputedDemo.vue'),
    },
    {
      path: '/class-style',
      name: 'class-style',
      component: () => import('../views/ClassStyleBinding.vue'),
    },
    {
      path: '/conditional',
      name: 'conditional',
      component: () => import('../views/ConditionalRendering.vue'),
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('../views/ListRendering.vue'),
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/EventHandling.vue'),
    },
    {
      path: '/form',
      name: 'form',
      component: () => import('../views/FormBinding.vue'),
    },
    {
      path: '/watchers',
      name: 'watchers',
      component: () => import('../views/Watchers.vue'),
    },
    {
      path: '/template-refs',
      name: 'template-refs',
      component: () => import('../views/TemplateRefs.vue'),
    },
    {
      path: '/lifecycle',
      name: 'lifecycle',
      component: () => import('../views/Lifecycle.vue'),
    },
    {
      path: '/components-demo',
      name: 'components-demo',
      component: () => import('../views/ComponentsDemo.vue'),
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
  ],
})

export default router
