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
    {
      path: '/permission/stage6',
      name: 'permission-stage6',
      component: () => import('../views/permission/Stage6SiteIntegration.vue'),
    },
    // ====== 加密技术学习 ======
    {
      path: '/crypto',
      name: 'crypto',
      component: () => import('../views/crypto/CryptoIndex.vue'),
    },
    {
      path: '/crypto/stage1',
      name: 'crypto-stage1',
      component: () => import('../views/crypto/Stage1CryptoJSBasic.vue'),
    },
    {
      path: '/crypto/stage2',
      name: 'crypto-stage2',
      component: () => import('../views/crypto/Stage2CryptoJSAdvanced.vue'),
    },
    {
      path: '/crypto/stage3',
      name: 'crypto-stage3',
      component: () => import('../views/crypto/Stage3JSEncryptBasic.vue'),
    },
    {
      path: '/crypto/stage4',
      name: 'crypto-stage4',
      component: () => import('../views/crypto/Stage4JSEncryptAdvanced.vue'),
    },
    {
      path: '/crypto/stage5',
      name: 'crypto-stage5',
      component: () => import('../views/crypto/Stage5HybridEncryption.vue'),
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
    {
      path: '/antd/stage7',
      name: 'antd-stage7',
      component: () => import('../views/antd/Stage7FormValidation.vue'),
    },
    // ====== Axios 学习 ======
    {
      path: '/axios',
      name: 'axios',
      component: () => import('../views/axios/AxiosIndex.vue'),
    },
    {
      path: '/axios/stage1',
      name: 'axios-stage1',
      component: () => import('../views/axios/Stage1QuickStart.vue'),
    },
    {
      path: '/axios/stage2',
      name: 'axios-stage2',
      component: () => import('../views/axios/Stage2Interceptors.vue'),
    },
    {
      path: '/axios/stage3',
      name: 'axios-stage3',
      component: () => import('../views/axios/Stage3CancelUpload.vue'),
    },
    {
      path: '/axios/stage4',
      name: 'axios-stage4',
      component: () => import('../views/axios/Stage4Advanced.vue'),
    },
    {
      path: '/axios/stage5',
      name: 'axios-stage5',
      component: () => import('../views/axios/Stage5Production.vue'),
    },
    // ====== VueUse 工具库 ======
    {
      path: '/vueuse',
      name: 'vueuse',
      component: () => import('../views/vueuse/VueUseIndex.vue'),
    },
    {
      path: '/vueuse/stage1',
      name: 'vueuse-stage1',
      component: () => import('../views/vueuse/Stage1State.vue'),
    },
    {
      path: '/vueuse/stage2',
      name: 'vueuse-stage2',
      component: () => import('../views/vueuse/Stage2Browser.vue'),
    },
    {
      path: '/vueuse/stage3',
      name: 'vueuse-stage3',
      component: () => import('../views/vueuse/Stage3Timing.vue'),
    },
    {
      path: '/vueuse/stage4',
      name: 'vueuse-stage4',
      component: () => import('../views/vueuse/Stage4Practical.vue'),
    },
    // ====== Pinia 持久化 ======
    {
      path: '/pinia-persist',
      name: 'pinia-persist',
      component: () => import('../views/pinia-persist/PiniaPersistIndex.vue'),
    },
    {
      path: '/pinia-persist/stage1',
      name: 'pinia-persist-stage1',
      component: () => import('../views/pinia-persist/Stage1Basic.vue'),
    },
    {
      path: '/pinia-persist/stage2',
      name: 'pinia-persist-stage2',
      component: () => import('../views/pinia-persist/Stage2Advanced.vue'),
    },
    // ====== Day.js 日期库 ======
    {
      path: '/dayjs',
      name: 'dayjs',
      component: () => import('../views/dayjs/DayjsIndex.vue'),
    },
    {
      path: '/dayjs/stage1',
      name: 'dayjs-stage1',
      component: () => import('../views/dayjs/Stage1Basic.vue'),
    },
    {
      path: '/dayjs/stage2',
      name: 'dayjs-stage2',
      component: () => import('../views/dayjs/Stage2Advanced.vue'),
    },
    // ====== Vue I18n 国际化 ======
    {
      path: '/i18n',
      name: 'i18n',
      component: () => import('../views/i18n/I18nIndex.vue'),
    },
    {
      path: '/i18n/stage1',
      name: 'i18n-stage1',
      component: () => import('../views/i18n/Stage1Basic.vue'),
    },
    {
      path: '/i18n/stage2',
      name: 'i18n-stage2',
      component: () => import('../views/i18n/Stage2Advanced.vue'),
    },
    // ====== Element Plus 学习 ======
    {
      path: '/element',
      name: 'element',
      component: () => import('../views/element/ElementIndex.vue'),
    },
    {
      path: '/element/stage1',
      name: 'element-stage1',
      component: () => import('../views/element/Stage1Basic.vue'),
    },
    {
      path: '/element/stage2',
      name: 'element-stage2',
      component: () => import('../views/element/Stage2CoreComponents.vue'),
    },
    {
      path: '/element/stage3',
      name: 'element-stage3',
      component: () => import('../views/element/Stage3Theme.vue'),
    },
    // ====== Vant 移动端 UI 学习 ======
    {
      path: '/vant',
      name: 'vant',
      component: () => import('../views/vant/VantIndex.vue'),
    },
    {
      path: '/vant/stage1',
      name: 'vant-stage1',
      component: () => import('../views/vant/Stage1Basic.vue'),
    },
    {
      path: '/vant/stage2',
      name: 'vant-stage2',
      component: () => import('../views/vant/Stage2Form.vue'),
    },
    {
      path: '/vant/stage3',
      name: 'vant-stage3',
      component: () => import('../views/vant/Stage3Feedback.vue'),
    },
    // ====== Nuxt 3 / SSR 学习 ======
    {
      path: '/nuxt',
      name: 'nuxt',
      component: () => import('../views/nuxt/NuxtIndex.vue'),
    },
    {
      path: '/nuxt/stage1',
      name: 'nuxt-stage1',
      component: () => import('../views/nuxt/Stage1SSR.vue'),
    },
    {
      path: '/nuxt/stage2',
      name: 'nuxt-stage2',
      component: () => import('../views/nuxt/Stage2Core.vue'),
    },
    {
      path: '/nuxt/stage3',
      name: 'nuxt-stage3',
      component: () => import('../views/nuxt/Stage3Advanced.vue'),
    },
    // ====== ECharts 数据可视化学习 ======
    {
      path: '/echarts',
      name: 'echarts',
      component: () => import('../views/echarts/EchartsIndex.vue'),
    },
    {
      path: '/echarts/stage1',
      name: 'echarts-stage1',
      component: () => import('../views/echarts/Stage1Basic.vue'),
    },
    {
      path: '/echarts/stage2',
      name: 'echarts-stage2',
      component: () => import('../views/echarts/Stage2Advanced.vue'),
    },
    {
      path: '/echarts/stage3',
      name: 'echarts-stage3',
      component: () => import('../views/echarts/Stage3Interaction.vue'),
    },
    // ====== Vue 3.4/3.5 新特性 ======
    {
      path: '/vue3-features',
      name: 'vue3-features',
      component: () => import('../views/vue3-features/Vue3FeaturesIndex.vue'),
    },
    {
      path: '/vue3-features/stage1',
      name: 'vue3-features-stage1',
      component: () => import('../views/vue3-features/Stage1DefineModel.vue'),
    },
    {
      path: '/vue3-features/stage2',
      name: 'vue3-features-stage2',
      component: () => import('../views/vue3-features/Stage2TemplateRef.vue'),
    },
    {
      path: '/vue3-features/stage3',
      name: 'vue3-features-stage3',
      component: () => import('../views/vue3-features/Stage3PropsDestructure.vue'),
    },
    {
      path: '/vue3-features/stage4',
      name: 'vue3-features-stage4',
      component: () => import('../views/vue3-features/Stage4ShorthandOptions.vue'),
    },
    {
      path: '/vue3-features/stage5',
      name: 'vue3-features-stage5',
      component: () => import('../views/vue3-features/Stage5ToValue.vue'),
    },
    // ====== 单元测试学习 ======
    {
      path: '/unit-test',
      name: 'unit-test',
      component: () => import('../views/unit-test/UnitTestIndex.vue'),
    },
    {
      path: '/unit-test/stage1',
      name: 'unit-test-stage1',
      component: () => import('../views/unit-test/Stage1VitestQuickStart.vue'),
    },
    {
      path: '/unit-test/stage2',
      name: 'unit-test-stage2',
      component: () => import('../views/unit-test/Stage2TestUtils.vue'),
    },
    {
      path: '/unit-test/stage3',
      name: 'unit-test-stage3',
      component: () => import('../views/unit-test/Stage3ComponentTest.vue'),
    },
    {
      path: '/unit-test/stage4',
      name: 'unit-test-stage4',
      component: () => import('../views/unit-test/Stage4AsyncMock.vue'),
    },
    {
      path: '/unit-test/stage5',
      name: 'unit-test-stage5',
      component: () => import('../views/unit-test/Stage5TDD.vue'),
    },
    // ====== Vue 3 性能优化 ======
    {
      path: '/vue-perf',
      name: 'vue-perf',
      component: () => import('../views/vue-perf/VuePerfIndex.vue'),
    },
    {
      path: '/vue-perf/stage1',
      name: 'vue-perf-stage1',
      component: () => import('../views/vue-perf/Stage1ShallowRef.vue'),
    },
    {
      path: '/vue-perf/stage2',
      name: 'vue-perf-stage2',
      component: () => import('../views/vue-perf/Stage2MemoOnce.vue'),
    },
    {
      path: '/vue-perf/stage3',
      name: 'vue-perf-stage3',
      component: () => import('../views/vue-perf/Stage3LazyLoad.vue'),
    },
    {
      path: '/vue-perf/stage4',
      name: 'vue-perf-stage4',
      component: () => import('../views/vue-perf/Stage4KeepAlive.vue'),
    },
    {
      path: '/vue-perf/stage5',
      name: 'vue-perf-stage5',
      component: () => import('../views/vue-perf/Stage5VirtualScroll.vue'),
    },
    // ====== 响应式系统深入 ======
    {
      path: '/reactivity-deep',
      name: 'reactivity-deep',
      component: () => import('../views/reactivity-deep/ReactivityIndex.vue'),
    },
    {
      path: '/reactivity-deep/stage1',
      name: 'reactivity-deep-stage1',
      component: () => import('../views/reactivity-deep/Stage1RefsApi.vue'),
    },
    {
      path: '/reactivity-deep/stage2',
      name: 'reactivity-deep-stage2',
      component: () => import('../views/reactivity-deep/Stage2ComputedWatch.vue'),
    },
    {
      path: '/reactivity-deep/stage3',
      name: 'reactivity-deep-stage3',
      component: () => import('../views/reactivity-deep/Stage3EffectScope.vue'),
    },
    {
      path: '/reactivity-deep/stage4',
      name: 'reactivity-deep-stage4',
      component: () => import('../views/reactivity-deep/Stage4CustomRef.vue'),
    },
    {
      path: '/reactivity-deep/stage5',
      name: 'reactivity-deep-stage5',
      component: () => import('../views/reactivity-deep/Stage5PerfOptimization.vue'),
    },
    ...routes,
  ],
})

// 支持开发环境下的热更新（无需刷新页面即可更新路由）
if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
