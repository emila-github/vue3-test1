<script setup lang="ts">
import { ref } from 'vue'

const configBreakdown = ref([
  {
    part: 'file scope',
    title: '文件范围',
    desc: '定义检查哪些文件',
    code: `{
  name: 'app/files-to-lint',
  files: ['**/*.{vue,ts,mts,tsx}'],
}`,
  },
  {
    part: 'ignores',
    title: '忽略目录',
    desc: '排除 dist、coverage 等构建产物',
    code: `globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**'])`,
  },
  {
    part: 'vue core',
    title: 'Vue Essential',
    desc: 'Vue 基础规则（保证 SFC 解析正确性）',
    code: `...pluginVue.configs['flat/essential']`,
  },
  {
    part: 'typescript',
    title: 'TypeScript 推荐',
    desc: '类型推断相关规则（no-explicit-any 等）',
    code: `vueTsConfigs.recommended`,
  },
  {
    part: 'playwright',
    title: 'Playwright 测试',
    desc: 'E2E 测试文件专用规则，仅作用于 e2e/',
    code: `{
  ...pluginPlaywright.configs['flat/recommended'],
  files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
}`,
  },
  {
    part: 'vitest',
    title: 'Vitest 测试',
    desc: '单元测试文件专用规则',
    code: `{
  ...pluginVitest.configs.recommended,
  files: ['src/**/__tests__/*'],
}`,
  },
  {
    part: 'oxlint',
    title: 'Oxlint 集成',
    desc: '从 .oxlintrc.json 读取 OXC 规则配置',
    code: `...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json')`,
  },
  {
    part: 'prettier',
    title: 'Prettier 兼容',
    desc: '关闭所有与 Prettier 冲突的格式规则',
    code: `skipFormatting,  // ⇐ 必须放最后！`,
  },
])

const workflowDiagram = ref([
  { step: '保存文件', tool: 'VSCode / IDE', action: '触发 lintOnSave' },
  { step: 'ESLint 检查', tool: 'ESLint', action: '应用规则集，收集问题' },
  { step: '自动修复', tool: 'eslint --fix', action: '修复可自动修复的问题' },
  { step: 'Oxlint 检查', tool: 'Oxlint (Rust)', action: '并行执行，报告额外问题' },
  { step: '报告结果', tool: 'IDE / CLI', action: '显示 Error/Warning' },
])

const bestPractices = ref([
  'yarn lint 在 CI/CD 的 pre-commit 钩子前运行',
  'pnpm lint:eslint 检查代码规范，pnpm lint:oxlint 快速检查',
  '不要混用 --fix 和 CI，本地修、CI 检',
  '使用 lint-staged 只检查 Git 暂存的文件',
  '/** eslint-disable */ 加注释说明，避免无节制的禁用',
])

const pkgScripts = ref([
  { cmd: 'pnpm lint', desc: '串联执行 lint:oxlint → lint:eslint，全量检查' },
  { cmd: 'pnpm lint:eslint', desc: '运行 ESLint，自动修复并缓存结果' },
  { cmd: 'pnpm lint:oxlint', desc: '运行 Oxlint（Rust 引擎，极速检查）' },
  { cmd: 'pnpm format', desc: 'Prettier 格式化 src/ 目录所有文件' },
])

const faqList = ref([
  { q: 'Parsing error at template block', r: '未使用 vue-eslint-parser', a: '确保 eslint-plugin-vue 已引入' },
  { q: 'Cannot find module tsconfig.json', r: 'parserOptions.project 路径错误', a: '检查 project 路径或使用 projectService' },
  { q: 'Rule not found: vue/...', r: '插件未导入', a: 'import pluginVue from eslint-plugin-vue' },
  { q: 'Expected linebreaks to be LF...', r: 'linebreak-style 与 git 冲突', a: '添加 * text=auto 到 .gitattributes' },
])
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>💚 Stage 4：Vue + TypeScript 实战</h1>
      <p class="subtitle">逐行拆解本项目的 ESLint 配置，掌握真实项目的配置套路</p>
    </header>

    <!-- 完整配置拆解 -->
    <section class="card">
      <h2>本项目 eslint.config.ts 逐层拆解</h2>
      <p class="section-desc">文件位置：<code>eslint.config.ts</code>，每个配置块都有明确职责：</p>
      <div class="breakdown-list">
        <div v-for="item in configBreakdown" :key="item.part" class="breakdown-item">
          <div class="bd-header">
            <span class="bd-badge">{{ item.part }}</span>
            <strong>{{ item.title }}</strong>
          </div>
          <p class="bd-desc">{{ item.desc }}</p>
          <pre class="bd-code"><code>{{ item.code }}</code></pre>
        </div>
      </div>
    </section>

    <!-- 工作流程 -->
    <section class="card">
      <h2>检查工作流程</h2>
      <div class="work-flow">
        <div v-for="(item, idx) in workflowDiagram" :key="idx" class="wf-step">
          <div class="wf-num">{{ idx + 1 }}</div>
          <strong>{{ item.step }}</strong>
          <span class="wf-tool">{{ item.tool }}</span>
          <span class="wf-action">{{ item.action }}</span>
        </div>
      </div>
    </section>

    <!-- 项目脚本解读 -->
    <section class="card">
      <h2>package.json 脚本解读</h2>
      <a-table
        :columns="[
          { title: '命令', dataIndex: 'cmd', key: 'cmd' },
          { title: '作用', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="pkgScripts"
        :pagination="false"
        size="small"
      />
      <div class="info-box" style="margin-top: 12px;">
        <strong>lint vs format</strong>：<code>lint</code> 关注<strong>代码质量</strong>（语法错误、不良实践），
        <code>format</code> 关注<strong>代码风格</strong>（缩进、引号、换行）。两者互补不冲突。
      </div>
    </section>

    <!-- 最佳实践 -->
    <section class="card">
      <h2>团队协作最佳实践</h2>
      <div class="practice-list">
        <div v-for="(tip, idx) in bestPractices" :key="idx" class="practice-item">
          <span class="practice-num">{{ idx + 1 }}</span>
          <span>{{ tip }}</span>
        </div>
      </div>
    </section>

    <!-- 常见问题 -->
    <section class="card">
      <h2>常见问题排查</h2>
      <a-table
        :columns="[
          { title: '问题', dataIndex: 'q', key: 'q' },
          { title: '原因', dataIndex: 'r', key: 'r' },
          { title: '解决', dataIndex: 'a', key: 'a' },
        ]"
        :data-source="faqList"
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
  border-left: 3px solid #42b883;
  padding-left: 10px;
}

.section-desc {
  color: #666;
  font-size: 14px;
  margin: 0 0 12px;
}

.section-desc code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
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

/* 配置拆解 */
.breakdown-list {
  display: grid;
  gap: 12px;
}

.breakdown-item {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 14px 16px;
}

.bd-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.bd-badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  background: #e6fffb;
  color: #13c2c2;
  font-weight: 600;
  text-transform: uppercase;
}

.bd-desc {
  font-size: 13px;
  color: #888;
  margin: 0 0 8px;
}

.bd-code {
  background: #1e1e1e;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 12px;
  margin: 0;
  overflow-x: auto;
}

.bd-code code {
  color: #d4d4d4;
  font-family: 'Consolas', monospace;
}

/* 工作流 */
.work-flow {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.wf-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 12px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  min-width: 120px;
  text-align: center;
}

.wf-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #42b883;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
}

.wf-step strong {
  font-size: 13px;
  color: #333;
}

.wf-tool {
  font-size: 11px;
  color: #42b883;
  font-weight: 600;
}

.wf-action {
  font-size: 11px;
  color: #999;
}

/* 实践 */
.practice-list {
  display: grid;
  gap: 10px;
}

.practice-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  font-size: 13px;
  color: #555;
}

.practice-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #52c41a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .work-flow {
    flex-direction: column;
  }
}
</style>
