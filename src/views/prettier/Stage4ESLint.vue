<script setup lang="ts">
import { ref } from 'vue'

const conflictExamples = ref([
  {
    rule: 'semi',
    prettier: 'false（无分号）',
    eslint: 'semi: ["error", "always"]',
    resolve: '用 Prettier 的值，ESLint 中关闭该规则',
  },
  {
    rule: 'quotes',
    prettier: 'singleQuote: true',
    eslint: 'quotes: ["error", "double"]',
    resolve: '用 Prettier 的值，ESLint 中关闭该规则',
  },
  {
    rule: 'indent',
    prettier: 'tabWidth: 2',
    eslint: 'indent: ["error", 4]',
    resolve: '用 Prettier 的值，ESLint 中关闭该规则',
  },
  {
    rule: 'comma-dangle',
    prettier: 'trailingComma: "all"',
    eslint: 'comma-dangle: ["error", "never"]',
    resolve: '用 Prettier 的值，ESLint 中关闭该规则',
  },
])

const configTypes = ref([
  {
    type: 'eslint-config-prettier',
    desc: '关闭 ESLint 中所有与 Prettier 冲突的规则',
    usage: '只在 extends/配置数组中引入即可',
  },
  {
    type: 'eslint-plugin-prettier',
    desc: '把 Prettier 作为 ESLint 的一条规则运行',
    usage: '需要插件 + config，ESLint --fix 会同时执行 Prettier',
  },
])

const strategyTable = ref([
  {
    strategy: '分层方案（推荐）',
    tools: 'ESLint(逻辑) + Prettier(格式)',
    pros: '职责清晰、互不干扰、社区主流',
    cons: '需要两条命令',
    setup: 'eslint-config-prettier',
  },
  {
    strategy: '合并方案',
    tools: 'ESLint(逻辑+格式) — Prettier 作为插件',
    pros: '一条命令搞定',
    cons: '稍慢、规则嵌套复杂',
    setup: 'eslint-plugin-prettier',
  },
])

const eslintRcPrettierExample = `// eslint.config.ts（本项目实际配置）
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default [
  // ...其他配置
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      ...pluginPrettier.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
  // eslint-config-prettier 必须放在最后，覆盖冲突规则
  configPrettier,
]`

const pkgScripts = ref([
  { cmd: 'pnpm lint', desc: '串联 oxlint → eslint（含 prettier 规则）' },
  { cmd: 'pnpm format', desc: '纯 Prettier 格式化，不经 ESLint' },
  { cmd: 'pnpm lint:eslint', desc: 'ESLint 包含 prettier/prettier 规则' },
])

const lintStagedExample = `// .lintstagedrc.json
{
  "*.{js,ts,vue}": [
    "prettier --write",
    "eslint --fix"
  ],
  "*.{json,css,scss,md}": [
    "prettier --write"
  ]
}`
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>🔗 Stage 4：ESLint 集成</h1>
      <p class="subtitle">eslint-config-prettier、eslint-plugin-prettier、冲突解决策略</p>
    </header>

    <!-- 分工理念 -->
    <section class="card">
      <h2>Prettier 与 ESLint 的分工</h2>
      <div class="split-grid">
        <div class="split-col prettier">
          <h3>✨ Prettier 负责</h3>
          <ul>
            <li>缩进、空格、换行</li>
            <li>引号、分号、尾部逗号</li>
            <li>行宽控制</li>
            <li>代码格式化（纯美观）</li>
          </ul>
        </div>
        <div class="split-vs">VS</div>
        <div class="split-col eslint">
          <h3>🔍 ESLint 负责</h3>
          <ul>
            <li>未使用变量 (no-unused-vars)</li>
            <li>禁止 console (no-console)</li>
            <li>Vue 组件命名规则</li>
            <li>TypeScript 类型检查</li>
          </ul>
        </div>
      </div>
      <p class="note">核心原则：<strong>Prettier 管格式，ESLint 管逻辑</strong>，两者互补而非竞争。</p>
    </section>

    <!-- 冲突问题 -->
    <section class="card">
      <h2>典型冲突场景</h2>
      <p class="desc">
        当 ESLint 的格式化规则（如 <code>semi</code>、<code>quotes</code>）与 Prettier
        设置不一致时，两者会互相覆盖，产生"格式化→检查→又格式化"的死循环。
      </p>
      <a-table
        :columns="[
          { title: '规则', dataIndex: 'rule', key: 'rule' },
          { title: 'Prettier', dataIndex: 'prettier', key: 'prettier' },
          { title: 'ESLint（冲突值）', dataIndex: 'eslint', key: 'eslint' },
          { title: '解决方案', dataIndex: 'resolve', key: 'resolve' },
        ]"
        :data-source="conflictExamples"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- 两个工具 -->
    <section class="card">
      <h2>解决冲突的两个工具</h2>
      <a-table
        :columns="[
          { title: '包名', dataIndex: 'type', key: 'type' },
          { title: '作用', dataIndex: 'desc', key: 'desc' },
          { title: '使用方式', dataIndex: 'usage', key: 'usage' },
        ]"
        :data-source="configTypes"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- 策略对比 -->
    <section class="card">
      <h2>集成策略对比</h2>
      <a-table
        :columns="[
          { title: '策略', dataIndex: 'strategy', key: 'strategy' },
          { title: '工具链', dataIndex: 'tools', key: 'tools' },
          { title: '优点', dataIndex: 'pros', key: 'pros' },
          { title: '缺点', dataIndex: 'cons', key: 'cons' },
          { title: '核心包', dataIndex: 'setup', key: 'setup' },
        ]"
        :data-source="strategyTable"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- 本项目配置 -->
    <section class="card">
      <h2>本项目的 ESLint + Prettier 配置</h2>
      <p class="desc">
        本项目中 ESLint 通过 <code>eslint-plugin-prettier</code> 把 Prettier 作为一条规则运行， 同时用
        <code>eslint-config-prettier</code> 关闭冲突规则。
      </p>
      <div class="code-block">
        <pre><code>{{ eslintRcPrettierExample }}</code></pre>
      </div>
    </section>

    <!-- package.json scripts -->
    <section class="card">
      <h2>相关 NPM Scripts</h2>
      <a-table
        :columns="[
          { title: '命令', dataIndex: 'cmd', key: 'cmd' },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="pkgScripts"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- lint-staged 建议 -->
    <section class="card">
      <h2>lint-staged 推荐配置</h2>
      <p class="desc">
        使用 <code>lint-staged</code> 在 Git pre-commit 时自动运行 Prettier + ESLint，只处理暂存文件，大幅提升效率。
      </p>
      <div class="code-block">
        <pre><code>{{ lintStagedExample }}</code></pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}
.page-header {
  text-align: center;
  margin-bottom: 30px;
}
.page-header h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin: 0 0 6px;
}
.subtitle {
  color: #999;
  font-size: 14px;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.card h2 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
}
.card h3 {
  margin: 0 0 8px;
  font-size: 15px;
  color: #555;
}
.desc {
  color: #555;
  font-size: 14px;
  line-height: 1.8;
  margin: 0 0 12px;
}
.desc code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
}
.note {
  margin: 16px 0 0;
  color: #888;
  font-size: 13px;
}
.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}
.code-block code {
  font-size: 13px;
  line-height: 1.8;
  white-space: pre;
}
.split-grid {
  display: flex;
  align-items: stretch;
  gap: 0;
  margin-bottom: 16px;
}
.split-col {
  flex: 1;
  border-radius: 10px;
  padding: 20px;
}
.split-col.prettier {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
}
.split-col.eslint {
  background: #f0f5ff;
  border: 1px solid #adc6ff;
}
.split-col ul {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: #555;
}
.split-col li {
  margin-bottom: 4px;
}
.split-vs {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  font-size: 14px;
  font-weight: 700;
  color: #bbb;
  flex-shrink: 0;
}
@media (max-width: 768px) {
  .split-grid {
    flex-direction: column;
    gap: 8px;
  }
  .split-vs {
    width: 100%;
    height: 24px;
  }
}
</style>
