<script setup lang="ts">
import { ref } from 'vue'

const configParts = ref([
  {
    key: 'files',
    name: 'files',
    desc: '指定要检查的文件模式',
    required: '推荐',
    example: `files: ['**/*.{vue,ts,mts,tsx}']`,
  },
  {
    key: 'ignores',
    name: 'ignores / globalIgnores()',
    desc: '全局忽略文件/目录',
    required: '推荐',
    example: `globalIgnores(['**/dist/**', '**/coverage/**'])`,
  },
  {
    key: 'languageOptions',
    name: 'languageOptions',
    desc: '运行时环境、解析器、全局变量',
    required: '可选',
    example: `languageOptions: {
  ecmaVersion: 2024,
  sourceType: 'module',
  parser: tsParser,
  globals: { ...browser }
}`,
  },
  {
    key: 'linterOptions',
    name: 'linterOptions',
    desc: '报告级别、未禁用文件处理',
    required: '可选',
    example: `linterOptions: {
  reportUnusedDisableDirectives: true
}`,
  },
  {
    key: 'rules',
    name: 'rules',
    desc: '规则配置：off(0) / warn(1) / error(2)',
    required: '核心',
    example: `rules: {
  'no-console': 'warn',
  'no-debugger': 'error',
  'no-unused-vars': ['error', { args: 'none' }]
}`,
  },
  {
    key: 'plugins',
    name: 'plugins',
    desc: '插件引入，提供额外规则',
    required: '常用',
    example: `import pluginVue from 'eslint-plugin-vue'
// 使用: pluginVue.configs['flat/essential']`,
  },
])

const rulesExamples = ref([
  {
    rule: 'no-unused-vars',
    level: 'error',
    desc: '禁止未使用的变量',
    fixable: '否',
    bad: 'const a = 1; // 从未使用',
    good: '// 移除未使用变量',
  },
  {
    rule: 'no-console',
    level: 'off',
    desc: '禁止 console 语句',
    fixable: '否',
    bad: 'console.log("debug")',
    good: '// 使用 debugger 或日志库',
  },
  {
    rule: 'eqeqeq',
    level: 'error',
    desc: '强制使用 === 和 !==',
    fixable: '是',
    bad: 'if (a == b)',
    good: 'if (a === b)',
  },
  {
    rule: 'semi',
    level: 'off',
    desc: '要求或禁止分号',
    fixable: '是',
    bad: 'const a = 1',
    good: 'const a = 1;',
  },
  {
    rule: 'no-var',
    level: 'error',
    desc: '禁止 var，强制 let/const',
    fixable: '否',
    bad: 'var x = 1;',
    good: 'const x = 1;',
  },
])
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>⚙ Stage 2：Flat Config 配置详解</h1>
      <p class="subtitle">深入理解 ESLint 9+ 的 Flat Config 格式</p>
    </header>

    <!-- Flat Config 简介 -->
    <section class="card">
      <h2>Flat Config 是什么？</h2>
      <div class="info-box">
        <p>ESLint 9.0 引入了 <strong>Flat Config</strong>，替代传统的 <code>.eslintrc.*</code> 格式。核心变化：</p>
        <ul>
          <li>用 <code>eslint.config.js</code>（或 <code>.ts</code>）一个文件替代多层配置</li>
          <li>每个配置对象是 <strong>扁平数组</strong>，不再有 extends 嵌套继承</li>
          <li>原生支持 ESM 和 TypeScript</li>
          <li><code>plugin:</code> 前缀被废弃，直接用 JS 对象引用</li>
        </ul>
      </div>
    </section>

    <!-- 配置结构 -->
    <section class="card">
      <h2>配置对象结构</h2>
      <div class="config-diagram">
        <div class="config-node" v-for="item in configParts" :key="item.key">
          <div class="node-header">
            <span class="node-key">{{ item.name }}</span>
            <span class="node-badge">{{ item.required }}</span>
          </div>
          <p class="node-desc">{{ item.desc }}</p>
          <pre class="node-example"><code>{{ item.example }}</code></pre>
        </div>
      </div>
    </section>

    <!-- 配置合并机制 -->
    <section class="card">
      <h2>配置合并与优先级</h2>
      <p class="section-desc">数组中的匹配配置对象按 <strong>后定义的覆盖前面的</strong>，实现更灵活的规则覆盖。</p>
      <div class="merge-example">
        <pre><code>// 后面的配置覆盖前面同名规则
export default [
  {
    rules: { 'no-console': 'warn' }  // ← 被覆盖
  },
  {
    rules: { 'no-console': 'error' } // ← 生效：error
  }
]</code></pre>
      </div>
      <div class="info-box" style="margin-top: 12px">
        <strong>实战技巧</strong>：公共配置放前面，针对特定文件的覆盖放后面。文件/目录级别的配置通过
        <code>files</code> 字段限定作用范围。
      </div>
    </section>

    <!-- Rules 深度讲解 -->
    <section class="card">
      <h2>规则配置语法</h2>
      <div class="rule-syntax">
        <div class="syntax-item">
          <strong>字符串简写</strong>
          <code>'规则名': 'off' | 'warn' | 'error'</code>
        </div>
        <div class="syntax-item">
          <strong>数组配置</strong>
          <code>'规则名': ['error', { options }]</code>
        </div>
      </div>
      <a-table
        :columns="[
          { title: '规则', dataIndex: 'rule', key: 'rule', width: 150 },
          { title: '级别', dataIndex: 'level', key: 'level', width: 70 },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
          { title: '可修复', dataIndex: 'fixable', key: 'fixable', width: 70 },
        ]"
        :data-source="rulesExamples"
        :pagination="false"
        size="small"
        style="margin-top: 12px"
      />
      <div class="code-compare">
        <div v-for="r in rulesExamples" :key="r.rule" class="rule-row">
          <div class="rule-name">
            <span class="rule-tag" :class="r.level === 'error' ? 'tag-error' : 'tag-off'">
              {{ r.level.toUpperCase() }}
            </span>
            <code>{{ r.rule }}</code>
          </div>
          <div class="rule-desc">{{ r.desc }}</div>
          <div class="code-pair">
            <div class="code-bad">
              <span class="label">❌ 违反</span>
              <code>{{ r.bad }}</code>
            </div>
            <div class="code-good">
              <span class="label">✅ 规范</span>
              <code>{{ r.good }}</code>
            </div>
          </div>
        </div>
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
  border-left: 3px solid #52c41a;
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

.info-box ul {
  margin: 6px 0 0;
  padding-left: 20px;
}

.config-diagram {
  display: grid;
  gap: 12px;
}

.config-node {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 14px 16px;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.node-key {
  font-weight: 700;
  font-size: 15px;
  color: #333;
  font-family: 'Consolas', monospace;
}

.node-badge {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 10px;
  background: #e6f7ff;
  color: #1890ff;
}

.node-desc {
  font-size: 13px;
  color: #888;
  margin: 0 0 8px;
}

.node-example {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 12px;
  margin: 0;
  overflow-x: auto;
}

.node-example code {
  font-family: 'Consolas', monospace;
}

.merge-example {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 14px 16px;
  overflow-x: auto;
}

.merge-example code {
  color: #d4d4d4;
  font-size: 13px;
  font-family: 'Consolas', monospace;
}

.merge-example pre {
  margin: 0;
}

.rule-syntax {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.syntax-item {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 10px 14px;
  flex: 1;
}

.syntax-item strong {
  display: block;
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}

.syntax-item code {
  font-size: 13px;
  color: #4b32c3;
}

/* Rules 示例 */
.code-compare {
  margin-top: 16px;
}

.rule-row {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 10px;
}

.rule-name {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.rule-tag {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.tag-error {
  background: #fff1f0;
  color: #cf1322;
}

.tag-warn {
  background: #fffbe6;
  color: #ad8b00;
}

.tag-off {
  background: #f0f0f0;
  color: #999;
}

.rule-desc {
  font-size: 12px;
  color: #888;
  margin-bottom: 8px;
}

.code-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.code-bad,
.code-good {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 12px;
  font-family: 'Consolas', monospace;
}

.code-bad .label,
.code-good .label {
  display: block;
  font-size: 10px;
  margin-bottom: 4px;
  color: #888;
}

.code-bad code {
  color: #cf1322;
}
.code-good code {
  color: #389e0d;
}

@media (max-width: 640px) {
  .code-pair {
    grid-template-columns: 1fr;
  }
  .rule-syntax {
    flex-direction: column;
  }
}
</style>
