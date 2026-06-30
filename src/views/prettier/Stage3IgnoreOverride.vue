<script setup lang="ts">
import { ref } from 'vue'

const ignoreRules = ref([
  { pattern: 'dist/', desc: '构建产物目录' },
  { pattern: 'node_modules/', desc: '依赖目录（Prettier 默认排除）' },
  { pattern: 'coverage/', desc: '测试覆盖率报告' },
  { pattern: 'pnpm-lock.yaml', desc: '包管理器的锁文件' },
  { pattern: '*.min.js', desc: '压缩后的 JS 文件' },
  { pattern: '.output/', desc: 'Nuxt/其他框架的输出目录' },
])

const overrideExamples = ref([
  {
    files: '*.json',
    options: '{ "parser": "json", "printWidth": 80 }',
    desc: 'JSON 文件使用 80 字符宽度（更易读）',
  },
  {
    files: '*.md',
    options: '{ "proseWrap": "always", "printWidth": 80 }',
    desc: 'Markdown 始终换行，限制 80 字符',
  },
  {
    files: '*.{css,scss}',
    options: '{ "singleQuote": false }',
    desc: 'CSS/SCSS 使用双引号（社区惯例）',
  },
  {
    files: '*.yml,*.yaml',
    options: '{ "tabWidth": 2, "singleQuote": false }',
    desc: 'YAML 用 2 空格缩进、双引号',
  },
])

const configFormats = ref([
  { format: '.prettierrc', lang: 'JSON / YAML', note: '最常用、无后缀' },
  { format: '.prettierrc.json', lang: 'JSON', note: '明确 JSON 格式，本项目的选择' },
  { format: '.prettierrc.yaml / .yml', lang: 'YAML', note: 'YAML 格式' },
  { format: '.prettierrc.toml', lang: 'TOML', note: 'TOML 格式' },
  { format: 'prettier.config.js / .mjs / .cjs', lang: 'JavaScript', note: 'JS 格式，支持动态配置' },
  { format: 'package.json → "prettier"', lang: 'JSON', note: '在 package.json 中内联配置' },
])

const overrideFullExample = `{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": false,
  "singleQuote": true,
  "printWidth": 120,
  "overrides": [
    {
      "files": "*.json",
      "options": { "printWidth": 80 }
    },
    {
      "files": "*.md",
      "options": { "proseWrap": "always", "printWidth": 80 }
    },
    {
      "files": "*.{css,scss}",
      "options": { "singleQuote": false }
    }
  ]
}`

const ignoreFileExample = `# .prettierignore
dist/
node_modules/
coverage/
pnpm-lock.yaml
*.min.js
.output/`
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>🎯 Stage 3：忽略与覆盖</h1>
      <p class="subtitle">.prettierignore 忽略规则、overrides 差异化配置、配置文件格式</p>
    </header>

    <!-- .prettierignore -->
    <section class="card">
      <h2>.prettierignore — 排除不需要格式化的文件</h2>
      <p class="desc">
        Prettier 默认排除 <code>node_modules/</code>，通过 <code>.prettierignore</code> 可以排除更多文件。 语法与
        <code>.gitignore</code> 完全一致。
      </p>
      <div class="code-block">
        <pre><code>{{ ignoreFileExample }}</code></pre>
      </div>
      <p class="note">💡 本项目未配置 .prettierignore，因为 format 命令明确指向 src/ 目录。</p>
    </section>

    <!-- 常见忽略规则 -->
    <section class="card">
      <h2>常见忽略模式</h2>
      <a-table
        :columns="[
          { title: '模式', dataIndex: 'pattern', key: 'pattern' },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="ignoreRules"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- overrides 配置 -->
    <section class="card">
      <h2>overrides — 为不同文件类型定制配置</h2>
      <p class="desc">
        使用 <code>overrides</code> 字段可以为特定文件或 glob 模式覆盖默认配置。 每个 override 包含
        <code>files</code>（匹配规则）和 <code>options</code>（覆盖的选项）。
      </p>
      <div class="code-block">
        <pre><code>{{ overrideFullExample }}</code></pre>
      </div>
    </section>

    <!-- override 示例 -->
    <section class="card">
      <h2>常用 Override 示例</h2>
      <a-table
        :columns="[
          { title: '匹配文件', dataIndex: 'files', key: 'files' },
          { title: '覆盖选项', dataIndex: 'options', key: 'options' },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="overrideExamples"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- 配置文件格式 -->
    <section class="card">
      <h2>配置文件格式一览</h2>
      <p class="desc">Prettier 支持多种配置文件格式，按优先级查找顺序排列：</p>
      <a-table
        :columns="[
          { title: '文件名', dataIndex: 'format', key: 'format' },
          { title: '格式', dataIndex: 'lang', key: 'lang' },
          { title: '备注', dataIndex: 'note', key: 'note' },
        ]"
        :data-source="configFormats"
        :pagination="false"
        size="small"
      />
      <p class="note">
        ⚠ Prettier 按顺序查找配置，找到第一个就停止。例如同时有 <code>.prettierrc</code> 和
        <code>.prettierrc.json</code>，只会使用 <code>.prettierrc</code>。
      </p>
    </section>

    <!-- 通过 CLI 指定配置 -->
    <section class="card">
      <h2>CLI 指定配置文件</h2>
      <div class="cmd-list">
        <div class="cmd-item">
          <code>--config &lt;path&gt;</code>
          <span>指定配置文件路径</span>
        </div>
        <div class="cmd-item">
          <code>--no-config</code>
          <span>不使用任何配置文件，只使用 Prettier 默认值</span>
        </div>
        <div class="cmd-item">
          <code>--ignore-path &lt;path&gt;</code>
          <span>指定 .prettierignore 文件路径</span>
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
.note code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
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
.cmd-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cmd-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}
.cmd-item code {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 13px;
  white-space: nowrap;
}
.cmd-item span {
  color: #888;
  font-size: 13px;
}
</style>
