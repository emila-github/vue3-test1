<script setup lang="ts">
import { ref } from 'vue'

const disableStrategies = ref([
  {
    level: '文件级别',
    syntax: '/* eslint-disable */',
    desc: '禁用整个文件的所有规则检查',
    risk: '🔴 高风险',
    advice: '尽量避免，通常意味着文件需要重构',
  },
  {
    level: '文件级别',
    syntax: '/* eslint-disable no-console */',
    desc: '禁用文件中的指定规则',
    risk: '🟡 中风险',
    advice: '对合法场景（如 CLI 工具）可接受',
  },
  {
    level: '行级别',
    syntax: '// eslint-disable-next-line no-console',
    desc: '仅禁用下一行的指定规则',
    risk: '🟢 低风险',
    advice: '推荐方式，精确控制影响范围',
  },
  {
    level: '块级别',
    syntax: '/* eslint-disable */ ... /* eslint-enable */',
    desc: '临时禁用一段代码块',
    risk: '🟡 中风险',
    advice: '必须配 enable 确保范围封闭',
  },
])

const hooksFlow = ref([
  { phase: 'pre-commit', tool: 'husky + lint-staged', desc: '只检查 git add 的文件，速度最快' },
  { phase: 'commit-msg', tool: 'commitlint', desc: '校验 commit message 格式规范' },
  { phase: 'pre-push', tool: 'husky', desc: '推送前执行完整类型检查 + lint' },
  { phase: 'CI/CD', tool: 'GitHub Actions / GitLab CI', desc: 'PR 合并前自动检查，不通过即拒绝' },
])

const ciExample = ref(`# .github/workflows/lint.yml
name: Lint Check
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint           # 全量检查
      - run: pnpm type-check     # TypeScript 类型检查`)

const advancedTopics = ref([
  {
    title: 'Type-Aware Linting',
    desc: 'typescript-eslint 的类型感知检查，需要 tsconfig 信息',
    code: `// 配置类型感知规则
import tseslint from 'typescript-eslint'
{
  languageOptions: {
    parserOptions: {
      projectService: true,       // 自动发现 tsconfig
      tsconfigRootDir: import.meta.dirname,
    }
  },
  rules: {
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
  }
}`,
  },
  {
    title: 'Ignore 模式管理',
    desc: '全局忽略 vs 局部忽略的最佳实践',
    code: `// glob 模式（推荐用于构建产物）
globalIgnores(['**/dist/**', '**/coverage/**'])

// 文件内忽略注释（仅用于特殊情况）
// eslint-disable-next-line no-undef -- 全局变量由 vite 注入
const env = import.meta.env`,
  },
  {
    title: '自定义规则编写',
    desc: '当现有生态不能满足时，编写团队专属规则',
    code: `// no-direct-api-import.ts - 团队规则示例
export default {
  meta: { type: 'problem', docs: { description: '禁���直接导入 API 模块' } },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value.startsWith('@/api/')) {
          context.report({
            node,
            message: '请通过 composable 间接调用 API，不要直接导入',
          })
        }
      }
    }
  }
}`,
  },
])
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>🌟 Stage 5：进阶与生态</h1>
      <p class="subtitle">eslint-disable 管理、Git Hooks 集成、CI/CD、自定义规则</p>
    </header>

    <!-- eslint-disable 策略 -->
    <section class="card">
      <h2>eslint-disable 使用策略</h2>
      <a-table
        :columns="[
          { title: '级别', dataIndex: 'level', key: 'level', width: 80 },
          { title: '语法', dataIndex: 'syntax', key: 'syntax' },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
          { title: '风险', dataIndex: 'risk', key: 'risk', width: 90 },
          { title: '建议', dataIndex: 'advice', key: 'advice' },
        ]"
        :data-source="disableStrategies"
        :pagination="false"
        size="small"
      />
      <div class="info-box" style="margin-top: 12px;">
        <strong>铁律</strong>：每一条 <code>eslint-disable</code> 都应该附带注释说明原因，
        否则 Code Review 时必须要求补充。<br>
        示例：<code>// eslint-disable-next-line no-console -- CLI 工具需要输出日志</code>
      </div>
    </section>

    <!-- Git Hooks -->
    <section class="card">
      <h2>Git Hooks 工具链</h2>
      <div class="hook-flow">
        <div v-for="(item, idx) in hooksFlow" :key="idx" class="hook-step">
          <div class="hook-phase">{{ item.phase }}</div>
          <div class="hook-tool">{{ item.tool }}</div>
          <div class="hook-desc">{{ item.desc }}</div>
        </div>
      </div>
    </section>

    <!-- CI/CD -->
    <section class="card">
      <h2>CI/CD 集成</h2>
      <p class="section-desc">以 GitHub Actions 为例，在 PR 时自动检查：</p>
      <div class="code-block">
        <pre><code>{{ ciExample }}</code></pre>
      </div>
    </section>

    <!-- 进阶主题 -->
    <section class="card">
      <h2>进阶主题详解</h2>
      <div v-for="topic in advancedTopics" :key="topic.title" class="topic-section">
        <h3>{{ topic.title }}</h3>
        <p class="topic-desc">{{ topic.desc }}</p>
        <pre class="topic-code"><code>{{ topic.code }}</code></pre>
      </div>
    </section>

    <!-- ESLint + OXC 未来 -->
    <section class="card">
      <h2>ESLint 生态展望</h2>
      <a-table
        :columns="[
          { title: '方向', dataIndex: 'dir', key: 'dir' },
          { title: '趋势', dataIndex: 'trend', key: 'trend' },
        ]"
        :data-source="[
          { dir: 'Flat Config', trend: 'ESLint 10+ 已完全移除 eslintrc 支持，Flat Config 是唯一格式' },
          { dir: 'OXC / Oxlint', trend: 'Rust 引擎并行运行，作为 ESLint 的加速补充而非替代' },
          { dir: 'Type-Aware Lint', trend: '类型感知规则逐渐成为标配，尤其是大型 TS 项目' },
          { dir: 'Biome', trend: 'Rust 全栈工具链（格式化 + lint），吸引 ESLint 用户迁移' },
          { dir: 'AI 辅助', trend: 'GitHub Copilot / AI Code Review 自动标记 ESLint 违规' },
        ]"
        :pagination="false"
        size="small"
      />
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
  border-left: 3px solid #722ed1;
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

/* Git Hooks */
.hook-flow {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.hook-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 14px;
  background: #f9f0ff;
  border: 1px solid #d3adf7;
  border-radius: 10px;
  min-width: 140px;
  text-align: center;
}

.hook-phase {
  font-size: 13px;
  font-weight: 700;
  color: #722ed1;
  font-family: 'Consolas', monospace;
}

.hook-tool {
  font-size: 12px;
  color: #531dab;
  font-weight: 600;
}

.hook-desc {
  font-size: 11px;
  color: #999;
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
  font-size: 12px;
  font-family: 'Consolas', monospace;
  line-height: 1.6;
  white-space: pre;
}

/* 进阶主题 */
.topic-section {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.topic-section h3 {
  margin: 0 0 6px;
  font-size: 15px;
  color: #333;
}

.topic-desc {
  font-size: 13px;
  color: #888;
  margin: 0 0 10px;
}

.topic-code {
  background: #1e1e1e;
  padding: 12px 14px;
  border-radius: 6px;
  margin: 0;
  overflow-x: auto;
}

.topic-code code {
  color: #d4d4d4;
  font-size: 12px;
  font-family: 'Consolas', monospace;
}

@media (max-width: 640px) {
  .hook-flow {
    flex-direction: column;
  }
}
</style>
