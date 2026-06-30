<script setup lang="ts">
import { ref } from 'vue'

const editorIntegrations = ref([
  { editor: 'VS Code', ext: 'Prettier - Code formatter', id: 'esbenp.prettier-vscode', note: '最流行，市场占有率最高' },
  { editor: 'JetBrains', ext: '内置支持', id: '-', note: 'WebStorm/IDEA 内置 Prettier 支持' },
  { editor: 'Neovim', ext: 'null-ls / none-ls / conform.nvim', id: '-', note: '通过 LSP 或独立插件集成' },
  { editor: 'Emacs', ext: 'prettier-js / apheleia', id: '-', note: '通过 formatter 插件集成' },
])

const gitHooks = ref([
  { tool: 'lint-staged', desc: '只对 Git 暂存文件运行 Prettier', features: '配合 husky 使用、支持多命令、速度极快' },
  { tool: 'husky', desc: '管理 Git hooks，触发 pre-commit 脚本', features: '支持所有 Git hooks、配置简单、团队共享' },
  { tool: 'simple-git-hooks', desc: '轻量级 Git hooks 替代方案', features: '基于 .git 目录、无需额外依赖、配置极简' },
])

const ciExample = `# .github/workflows/format.yml
name: Check Formatting
on: [push, pull_request]
jobs:
  prettier:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm prettier --check src/`

const plugins = ref([
  {
    plugin: 'prettier-plugin-tailwindcss',
    desc: '自动排序 Tailwind CSS class 名称',
    stars: '自动按推荐顺序排列 class',
  },
  {
    plugin: 'prettier-plugin-packagejson',
    desc: '格式化 package.json 字段顺序',
    stars: '保持 package.json 字段规范有序',
  },
  { plugin: 'prettier-plugin-organize-imports', desc: '自动整理 import 语句', stars: '排序、合并、删除未使用 import' },
  { plugin: 'prettier-plugin-sort-json', desc: '对 JSON 文件的 key 排序', stars: '使 JSON 文件内容有序可读' },
  { plugin: 'prettier-plugin-svelte', desc: '格式化 Svelte 组件', stars: '支持 .svelte 单文件组件' },
])

const bestPractices = ref([
  '在项目根目录提交 .prettierrc.json，保证团队成员配置一致',
  '使用 .vscode/settings.json 设置 editor.formatOnSave: true',
  'CI 中用 --check 而非 --write，本地用 --write',
  '不要混用多个格式化工具（如 eslint --fix + prettier --write 同时运行）',
  'ESLint 只负责逻辑规则，格式化全交给 Prettier',
  'Monorepo 中根目录放共享配置，子包通过 overrides 微调',
])

const vscodeSettings = `// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}`
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>🌟 Stage 5：进阶与生态</h1>
      <p class="subtitle">Editor 集成、Git Hooks、CI/CD、插件生态、最佳实践</p>
    </header>

    <!-- Editor 集成 -->
    <section class="card">
      <h2>Editor/IDE 集成</h2>
      <p class="desc">在编辑器中集成 Prettier，保存时自动格式化，是提升开发体验的最佳方式。</p>
      <a-table
        :columns="[
          { title: '编辑器', dataIndex: 'editor', key: 'editor' },
          { title: '扩展/插件', dataIndex: 'ext', key: 'ext' },
          { title: 'ID', dataIndex: 'id', key: 'id' },
          { title: '备注', dataIndex: 'note', key: 'note' },
        ]"
        :data-source="editorIntegrations"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- VS Code 配置 -->
    <section class="card">
      <h2>VS Code 推荐配置</h2>
      <p class="desc">在项目 <code>.vscode/settings.json</code> 中配置，让团队成员打开项目即获得一致的格式化体验。</p>
      <div class="code-block">
        <pre><code>{{ vscodeSettings }}</code></pre>
      </div>
    </section>

    <!-- Git Hooks -->
    <section class="card">
      <h2>Git Hooks 集成</h2>
      <p class="desc">通过 Git pre-commit hook 在提交前自动格式化代码，确保仓库中代码始终规范。</p>
      <a-table
        :columns="[
          { title: '工具', dataIndex: 'tool', key: 'tool' },
          { title: '作用', dataIndex: 'desc', key: 'desc' },
          { title: '亮点', dataIndex: 'features', key: 'features' },
        ]"
        :data-source="gitHooks"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- CI/CD -->
    <section class="card">
      <h2>CI/CD 集成</h2>
      <p class="desc">
        在 CI 中用 <code>--check</code> 检查代码格式，不通过则阻断流水线。确保不会有不规范的代码进入主分支。
      </p>
      <div class="code-block">
        <pre><code>{{ ciExample }}</code></pre>
      </div>
    </section>

    <!-- 插件生态 -->
    <section class="card">
      <h2>prettier-plugin-* 插件生态</h2>
      <p class="desc">Prettier 通过插件机制支持更多文件格式和功能。插件通过 npm 安装后，Prettier 会自动发现并加载。</p>
      <a-table
        :columns="[
          { title: '插件', dataIndex: 'plugin', key: 'plugin' },
          { title: '功能', dataIndex: 'desc', key: 'desc' },
          { title: '效果', dataIndex: 'stars', key: 'stars' },
        ]"
        :data-source="plugins"
        :pagination="false"
        size="small"
      />
      <p class="note">⚠ Prettier 3.x 的插件 API 还在完善中（标记为 experimental），部分插件可能未兼容。</p>
    </section>

    <!-- 最佳实践 -->
    <section class="card">
      <h2>最佳实践清单</h2>
      <ul class="checklist">
        <li v-for="(item, idx) in bestPractices" :key="idx" class="check-item">
          <span class="check-mark">✓</span>
          <span>{{ item }}</span>
        </li>
      </ul>
    </section>

    <!-- 学习路线总结 -->
    <section class="card summary">
      <h2>学习路线回顾</h2>
      <div class="roadmap">
        <div class="road-step done">
          <span class="road-num">1</span>
          <strong>快速上手</strong>
          <span>安装、CLI、工作流程</span>
        </div>
        <div class="road-arrow">→</div>
        <div class="road-step done">
          <span class="road-num">2</span>
          <strong>核心配置</strong>
          <span>.prettierrc 所有选项</span>
        </div>
        <div class="road-arrow">→</div>
        <div class="road-step done">
          <span class="road-num">3</span>
          <strong>忽略与覆盖</strong>
          <span>.prettierignore、overrides</span>
        </div>
        <div class="road-arrow">→</div>
        <div class="road-step done">
          <span class="road-num">4</span>
          <strong>ESLint 集成</strong>
          <span>冲突解决、工具选择</span>
        </div>
        <div class="road-arrow">→</div>
        <div class="road-step current">
          <span class="road-num">5</span>
          <strong>进阶与生态</strong>
          <span>Editor、Hooks、CI/CD、插件</span>
        </div>
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
  margin: 12px 0 0;
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
.checklist {
  list-style: none;
  padding: 0;
  margin: 0;
}
.check-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
  font-size: 14px;
  color: #555;
}
.check-item:last-child {
  border-bottom: none;
}
.check-mark {
  color: #52c41a;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}
.roadmap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.road-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 10px;
  border-radius: 10px;
  text-align: center;
  flex: 1;
  min-width: 90px;
}
.road-step.done {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
}
.road-step.current {
  background: #fff7e6;
  border: 1px solid #ffd591;
}
.road-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}
.road-step.done .road-num {
  background: #52c41a;
}
.road-step.current .road-num {
  background: #fa8c16;
}
.road-step strong {
  font-size: 13px;
  color: #333;
}
.road-step span {
  font-size: 11px;
  color: #999;
}
.road-arrow {
  font-size: 18px;
  color: #bbb;
  flex-shrink: 0;
}
.summary {
  background: linear-gradient(135deg, #f6ffed 0%, #f0f5ff 100%);
}
@media (max-width: 768px) {
  .roadmap {
    flex-direction: column;
  }
  .road-arrow {
    transform: rotate(90deg);
  }
}
</style>
