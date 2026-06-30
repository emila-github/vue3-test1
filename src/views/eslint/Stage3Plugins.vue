<script setup lang="ts">
import { ref } from 'vue'

const pluginList = ref([
  {
    name: 'eslint-plugin-vue',
    npm: 'eslint-plugin-vue',
    desc: 'Vue 官方 ESLint 插件，提供 Vue SFC 检查规则',
    provides: 'flat/essential, flat/recommended, flat/vue3-strongly-recommended',
    keyRule: 'vue/multi-word-component-names',
  },
  {
    name: 'typescript-eslint',
    npm: 'typescript-eslint',
    desc: 'TypeScript 的 ESLint 解析器和规则集',
    provides: 'tseslint.configs.recommended, type-aware',
    keyRule: '@typescript-eslint/no-explicit-any',
  },
  {
    name: '@vue/eslint-config-typescript',
    npm: '@vue/eslint-config-typescript',
    desc: 'Vue 项目的 TypeScript ESLint 配置封装',
    provides: 'defineConfigWithVueTs, vueTsConfigs',
    keyRule: 'vue/ + ts/ 联合规则',
  },
  {
    name: 'eslint-config-prettier',
    npm: 'eslint-config-prettier',
    desc: '关闭所有与 Prettier 冲突的规则',
    provides: '单一默认配置',
    keyRule: '关闭格式相关规则',
  },
  {
    name: 'eslint-plugin-oxlint',
    npm: 'eslint-plugin-oxlint',
    desc: '将 Oxlint 结果集成到 ESLint 输出',
    provides: '从 .oxlintrc.json 读取配置',
    keyRule: '无缝集成 OXC 工具链',
  },
  {
    name: 'eslint-plugin-playwright',
    npm: 'eslint-plugin-playwright',
    desc: 'Playwright E2E 测试专用规则',
    provides: 'flat/recommended',
    keyRule: 'playwright/no-skipped-test',
  },
  {
    name: '@vitest/eslint-plugin',
    npm: '@vitest/eslint-plugin',
    desc: 'Vitest 单元测试专用规则',
    provides: 'recommended',
    keyRule: 'vitest/no-disabled-tests',
  },
])

const configExample = ref(`// 1. 引入插件
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from 'eslint-config-prettier/flat'

// 2. Flat Config 组装
export default defineConfigWithVueTs(
  { files: ['**/*.{vue,ts,tsx}'] },
  // ⬇ 展开 vue 插件的 essential 配置
  ...pluginVue.configs['flat/essential'],
  // ⬇ 展开 TS 推荐配置
  vueTsConfigs.recommended,
  // ⬇ 放到最后，关闭与 Prettier 冲突的规则
  skipFormatting,
)`)

const extendsVsPlugins = ref([
  {
    dim: 'eslintrc extends',
    action: '字符串引用，@vue/eslint-config-typescript',
    flat: '直接 import JS 对象，@vue/eslint-config-typescript',
  },
  { dim: 'eslintrc plugins', action: '字符串数组，["vue", "jest"]', flat: 'import pluginVue from "eslint-plugin-vue"' },
  { dim: 'eslintrc rules 前缀', action: 'vue/rule-name', flat: 'vue/rule-name（无插件前缀）' },
  { dim: 'eslintrc 层级', action: 'extends 链式继承', flat: '数组顺序决定优先级' },
])
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>🧩 Stage 3：插件与共享配置</h1>
      <p class="subtitle">掌握 ESLint 插件机制和 Vue/TS 生态的核心插件</p>
    </header>

    <!-- 插件 vs 共享配置 -->
    <section class="card">
      <h2>插件 vs 共享配置</h2>
      <div class="diff-grid">
        <div class="diff-box plugin-box">
          <strong>🔌 插件 (Plugin)</strong>
          <p>提供 <strong>规则</strong> + <strong>处理器</strong>，定义新的检查逻辑。</p>
          <code>eslint-plugin-vue</code>
          <span class="exp">→ 定义了 vue/no-parsing-error 等规则</span>
        </div>
        <div class="diff-box config-box">
          <strong>📦 共享配置 (Shareable Config)</strong>
          <p>提供 <strong>规则预设</strong>，一组推荐配置的组合。</p>
          <code>eslint-config-prettier</code>
          <span class="exp">→ 关闭所有格式冲突规则</span>
        </div>
      </div>
    </section>

    <!-- 插件一览表 -->
    <section class="card">
      <h2>Vue/TS 生态核心插件</h2>
      <a-table
        :columns="[
          { title: '插件', dataIndex: 'name', key: 'name' },
          { title: '功能', dataIndex: 'desc', key: 'desc' },
          { title: '提供配置', dataIndex: 'provides', key: 'provides' },
        ]"
        :data-source="pluginList"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- Flat Config 组装 -->
    <section class="card">
      <h2>Flat Config 插件组装实例</h2>
      <p class="section-desc">下面展示本项目实际使用的配置组合方式：</p>
      <div class="code-block">
        <pre><code>{{ configExample }}</code></pre>
      </div>
      <div class="info-box" style="margin-top: 12px">
        <strong>关键点</strong>： 1. 使用 <code>...</code> 展开操作符将插件配置数组展平<br />
        2. <code>skipFormatting</code> 必须放在数组<strong>最后</strong>，确保覆盖所有前面的格式规则<br />
        3. <code>defineConfigWithVueTs</code> 自动合并 Vue 和 TS 的基础配置
      </div>
    </section>

    <!-- eslintrc → Flat Config 迁移 -->
    <section class="card">
      <h2>eslintrc → Flat Config 迁移指南</h2>
      <a-table
        :columns="[
          { title: '旧方式 (eslintrc)', dataIndex: 'action', key: 'action' },
          { title: '新方式 (Flat Config)', dataIndex: 'flat', key: 'flat' },
        ]"
        :data-source="extendsVsPlugins"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- 自定义插件示例 -->
    <section class="card">
      <h2>自定义插件结构</h2>
      <p class="section-desc">理解插件的基本结构，便于阅读源码或编写团队规范：</p>
      <div class="code-block">
        <pre><code>// custom-plugin.js - 插件基本结构
export default {
  meta: { name: 'my-custom-plugin', version: '1.0.0' },
  rules: {
    'no-inner-html': {
      meta: { type: 'problem', fixable: null },
      create(context) {
        return {
          // AST 节点选择器：监听所有 MemberExpression
          MemberExpression(node) {
            if (node.property.name === 'innerHTML') {
              context.report({
                node,
                message: '避免使用 innerHTML，可能有 XSS 风险',
              })
            }
          }
        }
      }
    }
  },
  // 可共享配置
  configs: {
    recommended: { rules: { 'my-custom/no-inner-html': 'error' } }
  }
}</code></pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 28px;
}

.page-header h1 {
  font-size: 26px;
  color: #1a1a1a;
  margin: 0 0 6px;
}

.subtitle {
  color: #888;
  font-size: 14px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin: 0 0 14px;
  font-size: 18px;
  color: #333;
  border-left: 3px solid #fa8c16;
  padding-left: 10px;
}

.section-desc {
  color: #666;
  font-size: 14px;
  margin: 0 0 12px;
}

.info-box {
  background: #f6f8ff;
  border: 1px solid #dce3ff;
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 13px;
  color: #555;
  line-height: 1.7;
}

/* 插件 vs 配置 */
.diff-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.diff-box {
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #f0f0f0;
}

.plugin-box {
  background: #f9f0ff;
  border-color: #d3adf7;
}
.config-box {
  background: #e6f7ff;
  border-color: #91d5ff;
}

.diff-box strong {
  display: block;
  font-size: 15px;
  margin-bottom: 6px;
  color: #333;
}

.diff-box p {
  font-size: 13px;
  color: #666;
  margin: 0 0 8px;
  line-height: 1.5;
}

.diff-box code {
  background: rgba(255, 255, 255, 0.7);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.diff-box .exp {
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

/* 代码块 */
.code-block {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
}

.code-block code {
  color: #d4d4d4;
  font-size: 13px;
  font-family: 'Consolas', monospace;
  line-height: 1.7;
}
</style>
