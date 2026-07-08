<template>
  <div class="about">
    <h1>项目依赖包</h1>

    <section class="dependencies-section">
      <h2>生产依赖 (Dependencies)</h2>
      <div class="dependency-grid">
        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">vue</span>
            <a href="https://cn.vuejs.org/" target="_blank" rel="noopener" class="link-btn">中文官网</a>
          </div>
          <p class="description">
            渐进式 JavaScript 框架，用于构建用户界面。Vue 3 采用 Composition API，提供更好的类型推断和代码组织。
          </p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">vue-router</span>
            <a href="https://router.vuejs.org/zh/" target="_blank" rel="noopener" class="link-btn">中文官网</a>
          </div>
          <p class="description">Vue.js 官方路由管理器，实现单页应用的路由功能，支持嵌套路由、路由守卫等特性。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">pinia</span>
            <a href="https://pinia.vuejs.org/zh/" target="_blank" rel="noopener" class="link-btn">中文官网</a>
          </div>
          <p class="description">
            Vue 官方状态管理库，支持 TypeScript，提供简洁的 API，替代 Vuex 成为新一代状态管理方案。
          </p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">ant-design-vue</span>
            <a href="https://www.antdv.com/docs/vue/introduce-cn/" target="_blank" rel="noopener" class="link-btn"
              >中文官网</a
            >
          </div>
          <p class="description">Ant Design 的 Vue 实现，提供丰富的高质量 UI 组件，开箱即用，设计规范统一。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">@ant-design/icons-vue</span>
            <a
              href="https://www.npmjs.com/package/@ant-design/icons-vue"
              target="_blank"
              rel="noopener"
              class="link-btn"
              >npm</a
            >
          </div>
          <p class="description">Ant Design 图标库的 Vue 版本，提供大量精美的图标组件，支持按需引入。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">axios</span>
            <a href="https://axios-http.com/zh/" target="_blank" rel="noopener" class="link-btn">中文文档</a>
          </div>
          <p class="description">基于 Promise 的 HTTP 客户端，支持浏览器和 Node.js，提供拦截器、请求取消等功能。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">vue-request</span>
            <a href="https://www.attojs.com/" target="_blank" rel="noopener" class="link-btn">官网</a>
          </div>
          <p class="description">Vue 3 的请求库，基于 Composition API，支持自动缓存、重试、防抖等特性。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">unplugin-vue-components</span>
            <a href="https://github.com/antfu/unplugin-vue-components" target="_blank" rel="noopener" class="link-btn"
              >GitHub</a
            >
          </div>
          <p class="description">Vue 组件自动按需引入插件，无需手动 import，自动扫描并注册组件。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">@vueuse/core</span>
            <a href="https://vueuse.org/" target="_blank" rel="noopener" class="link-btn">官网</a>
          </div>
          <p class="description">
            Vue Composition API 工具集，提供大量实用的组合式函数（如 useStorage、useMouse、useDark 等），简化常见开发场景。
          </p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">element-plus</span>
            <a href="https://element-plus.org/zh-CN/" target="_blank" rel="noopener" class="link-btn">中文官网</a>
          </div>
          <p class="description">
            Vue 3 桌面端 UI 组件库，提供丰富的组件和主题定制能力，是国内最流行的 Vue UI 框架之一。
          </p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">vant</span>
            <a href="https://vant-ui.github.io/vant/#/zh-CN" target="_blank" rel="noopener" class="link-btn">中文官网</a>
          </div>
          <p class="description">轻量、可靠的移动端 Vue 组件库，提供 70+ 高质量组件，支持按需引入和主题定制。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">echarts</span>
            <a href="https://echarts.apache.org/zh/index.html" target="_blank" rel="noopener" class="link-btn">中文官网</a>
          </div>
          <p class="description">
            Apache 开源的数据可视化图表库，基于 Canvas，支持海量图表类型和丰富的交互效果，在数据可视化领域广泛使用。
          </p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">vue-echarts</span>
            <a href="https://github.com/ecomfe/vue-echarts" target="_blank" rel="noopener" class="link-btn">GitHub</a>
          </div>
          <p class="description">
            ECharts 的 Vue 3 封装组件，通过 provide/inject 灵活传递 ECharts 实例，支持按需引入和响应式配置。
          </p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">dayjs</span>
            <a href="https://day.js.org/zh-CN/" target="_blank" rel="noopener" class="link-btn">中文官网</a>
          </div>
          <p class="description">
            Moment.js 的轻量替代品，仅 2KB 大小，提供相同的 API，支持插件扩展（国际化、相对时间等）。
          </p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">crypto-js</span>
            <a href="https://www.npmjs.com/package/crypto-js" target="_blank" rel="noopener" class="link-btn">npm</a>
          </div>
          <p class="description">
            纯 JavaScript 实现的加密算法库，支持 AES、SHA256、MD5、HMAC 等多种加密哈希算法。
          </p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">jsencrypt</span>
            <a href="https://www.npmjs.com/package/jsencrypt" target="_blank" rel="noopener" class="link-btn">npm</a>
          </div>
          <p class="description">
            客户端 RSA 加密库，用于前端数据加密场景，支持公私钥生成、加密、解密、签名和验签。
          </p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">vue-i18n</span>
            <a href="https://vue-i18n.intlify.dev/zh/" target="_blank" rel="noopener" class="link-btn">中文官网</a>
          </div>
          <p class="description">
            Vue 官方国际化插件，支持多语言切换、复数处理、日期/数字格式化，兼容 Vue 3 Composition API。
          </p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">pinia-plugin-persistedstate</span>
            <a
              href="https://prazdevs.github.io/pinia-plugin-persistedstate/"
              target="_blank"
              rel="noopener"
              class="link-btn"
              >官网</a
            >
          </div>
          <p class="description">
            Pinia 持久化插件，自动将 Store 状态同步到 localStorage/sessionStorage，支持自定义序列化。
          </p>
        </div>
      </div>
    </section>

    <section class="dependencies-section">
      <h2>开发依赖 (Dev Dependencies)</h2>
      <div class="dependency-grid">
        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">vite</span>
            <a href="https://cn.vite.dev/" target="_blank" rel="noopener" class="link-btn">官网</a>
          </div>
          <p class="description">下一代前端构建工具，基于 ES Module，提供极速的开发服务器启动和热模块替换。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">typescript</span>
            <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener" class="link-btn">官网</a>
          </div>
          <p class="description">JavaScript 的超集，添加静态类型检查，提升代码可维护性和开发体验。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">vitest</span>
            <a href="https://vitest.dev/" target="_blank" rel="noopener" class="link-btn">官网</a>
          </div>
          <p class="description">Vite 原生的测试框架，支持 ESM，提供极速的测试运行和快照测试功能。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">@vue/test-utils</span>
            <a href="https://test-utils.vuejs.org/" target="_blank" rel="noopener" class="link-btn">官网</a>
          </div>
          <p class="description">Vue 官方测试工具库，提供组件挂载、模拟事件、断言等测试能力。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">eslint</span>
            <a href="https://eslint.org/" target="_blank" rel="noopener" class="link-btn">官网</a>
          </div>
          <p class="description">JavaScript/TypeScript 代码检查工具，帮助发现代码问题和保持代码风格一致。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">prettier</span>
            <a href="https://prettier.io/" target="_blank" rel="noopener" class="link-btn">官网</a>
          </div>
          <p class="description">代码格式化工具，自动格式化代码风格，支持多种语言，与 ESLint 互补使用。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">@playwright/test</span>
            <a href="https://playwright.dev/" target="_blank" rel="noopener" class="link-btn">官网</a>
          </div>
          <p class="description">微软开源的端到端测试框架，支持多浏览器自动化测试，录制生成测试代码。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">jsdom</span>
            <a href="https://github.com/jsdom/jsdom" target="_blank" rel="noopener" class="link-btn">GitHub</a>
          </div>
          <p class="description">Node.js 环境下的 DOM 实现，用于在服务器端模拟浏览器环境进行测试。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">vue-tsc</span>
            <a href="https://github.com/vuejs/language-tools" target="_blank" rel="noopener" class="link-btn">GitHub</a>
          </div>
          <p class="description">Vue 的 TypeScript 类型检查工具，基于 Volar，提供完整的 Vue 组件类型推断。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">@vitejs/plugin-vue</span>
            <a
              href="https://github.com/vitejs/vite/tree/main/packages/plugin-vue"
              target="_blank"
              rel="noopener"
              class="link-btn"
              >GitHub</a
            >
          </div>
          <p class="description">Vite 的 Vue 插件，支持 Vue 单文件组件的编译和热模块替换。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">@vitejs/plugin-vue-jsx</span>
            <a
              href="https://github.com/vitejs/vite/tree/main/packages/plugin-vue-jsx"
              target="_blank"
              rel="noopener"
              class="link-btn"
              >GitHub</a
            >
          </div>
          <p class="description">Vite 的 Vue JSX 插件，支持在 Vue 中使用 JSX/TSX 语法编写组件。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">vite-plugin-vue-devtools</span>
            <a
              href="https://github.com/vuejs/devtools/tree/main/packages/plugin-vue"
              target="_blank"
              rel="noopener"
              class="link-btn"
              >GitHub</a
            >
          </div>
          <p class="description">Vue DevTools 的 Vite 插件，提供增强的开发调试体验和性能分析。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">@vue/eslint-config-typescript</span>
            <a href="https://github.com/vuejs/eslint-config-typescript" target="_blank" rel="noopener" class="link-btn"
              >GitHub</a
            >
          </div>
          <p class="description">Vue 官方的 ESLint TypeScript 配置，集成 Vue 和 TypeScript 的代码检查规则。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">eslint-plugin-vue</span>
            <a href="https://eslint.vuejs.org/" target="_blank" rel="noopener" class="link-btn">官网</a>
          </div>
          <p class="description">ESLint 的 Vue 插件，提供针对 Vue 单文件组件的代码检查规则。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">eslint-config-prettier</span>
            <a href="https://github.com/prettier/eslint-config-prettier" target="_blank" rel="noopener" class="link-btn"
              >GitHub</a
            >
          </div>
          <p class="description">禁用 ESLint 中与 Prettier 冲突的规则，确保两者协同工作。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">oxlint</span>
            <a href="https://oxc-project.github.io/oxlint/" target="_blank" rel="noopener" class="link-btn">官网</a>
          </div>
          <p class="description">基于 Rust 的极速 JavaScript/TypeScript 代码检查工具，性能远超传统检查器。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">eslint-plugin-oxlint</span>
            <a
              href="https://github.com/oxc-project/eslint-plugin-oxlint"
              target="_blank"
              rel="noopener"
              class="link-btn"
              >GitHub</a
            >
          </div>
          <p class="description">Oxlint 的 ESLint 插件，在 ESLint 流程中集成 Oxlint 的高速检查能力。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">eslint-plugin-playwright</span>
            <a
              href="https://github.com/playwright-community/eslint-plugin-playwright"
              target="_blank"
              rel="noopener"
              class="link-btn"
              >GitHub</a
            >
          </div>
          <p class="description">Playwright 测试的 ESLint 插件，提供针对 Playwright API 的代码检查规则。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">@vitest/eslint-plugin</span>
            <a
              href="https://github.com/vitest-dev/vitest/tree/main/packages/eslint-plugin"
              target="_blank"
              rel="noopener"
              class="link-btn"
              >GitHub</a
            >
          </div>
          <p class="description">Vitest 的 ESLint 插件，提供针对 Vitest 测试代码的检查规则。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">@vue/tsconfig</span>
            <a href="https://github.com/vuejs/tsconfig" target="_blank" rel="noopener" class="link-btn">GitHub</a>
          </div>
          <p class="description">Vue 官方的 TypeScript 配置文件，提供 Vue 项目最佳实践的 tsconfig 配置。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">@tsconfig/node24</span>
            <a href="https://github.com/tsconfig/bases" target="_blank" rel="noopener" class="link-btn">GitHub</a>
          </div>
          <p class="description">Node.js 24 的官方 TypeScript 配置基础，提供适合 Node.js 环境的编译选项。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">@types/node</span>
            <a href="https://www.npmjs.com/package/@types/node" target="_blank" rel="noopener" class="link-btn">npm</a>
          </div>
          <p class="description">Node.js 的 TypeScript 类型定义包，提供 Node.js API 的完整类型支持。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">@types/jsdom</span>
            <a href="https://www.npmjs.com/package/@types/jsdom" target="_blank" rel="noopener" class="link-btn">npm</a>
          </div>
          <p class="description">jsdom 的 TypeScript 类型定义包，支持在 TypeScript 中使用 jsdom。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">@types/crypto-js</span>
            <a href="https://www.npmjs.com/package/@types/crypto-js" target="_blank" rel="noopener" class="link-btn">npm</a>
          </div>
          <p class="description">crypto-js 的 TypeScript 类型定义包，支持在 TypeScript 中使用加密库。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">jiti</span>
            <a href="https://github.com/unjs/jiti" target="_blank" rel="noopener" class="link-btn">GitHub</a>
          </div>
          <p class="description">Just-In-Time 编译器，用于在运行时编译 TypeScript/JavaScript，支持按需加载。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">npm-run-all2</span>
            <a href="https://github.com/bcomnes/npm-run-all2" target="_blank" rel="noopener" class="link-btn">GitHub</a>
          </div>
          <p class="description">并行或串行运行多个 npm 脚本，简化项目脚本管理。</p>
        </div>

        <div class="dependency-card">
          <div class="card-header">
            <span class="package-name">rollup-plugin-visualizer</span>
            <a href="https://github.com/btd/rollup-plugin-visualizer" target="_blank" rel="noopener" class="link-btn"
              >GitHub</a
            >
          </div>
          <p class="description">Rollup/Vite 构建产物可视化工具，帮助分析打包体积和依赖关系。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
.about {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.about h1 {
  font-size: 28px;
  color: #1a1a1a;
  margin-bottom: 30px;
  text-align: center;
}

.dependencies-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.dependencies-section h2 {
  font-size: 18px;
  color: #333;
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.dependency-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.dependency-card {
  background: #fafafa;
  border-radius: 10px;
  padding: 18px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.dependency-card:hover {
  background: #fff;
  border-color: #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.package-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  font-family: 'Monaco', 'Menlo', monospace;
}

.link-btn {
  font-size: 12px;
  color: #1890ff;
  text-decoration: none;
  padding: 3px 8px;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 4px;
  transition: all 0.2s;
}

.link-btn:hover {
  background: rgba(24, 144, 255, 0.2);
  color: #096dd9;
}

.description {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    padding: 40px;
  }
}
</style>
