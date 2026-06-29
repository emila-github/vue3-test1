<script setup lang="ts">
import { ref } from 'vue'

const schemaUrl = 'https://json.schemastore.org/prettierrc'

const configItems = ref([
  {
    option: 'printWidth',
    type: 'number',
    default: '80',
    project: '120',
    desc: '单行最大字符数，超过后自动换行',
  },
  {
    option: 'tabWidth',
    type: 'number',
    default: '2',
    project: '2',
    desc: '缩进空格数',
  },
  {
    option: 'useTabs',
    type: 'boolean',
    default: 'false',
    project: 'false',
    desc: '是否使用 Tab 缩进（false 即空格）',
  },
  {
    option: 'semi',
    type: 'boolean',
    default: 'true',
    project: 'false',
    desc: '是否在语句末尾添加分号',
  },
  {
    option: 'singleQuote',
    type: 'boolean',
    default: 'false',
    project: 'true',
    desc: '是否使用单引号（false 即双引号）',
  },
  {
    option: 'quoteProps',
    type: 'string',
    default: '"as-needed"',
    project: '"as-needed"',
    desc: '对象属性何时加引号：as-needed / consistent / preserve',
  },
  {
    option: 'jsxSingleQuote',
    type: 'boolean',
    default: 'false',
    project: 'false',
    desc: 'JSX 中是否用单引号',
  },
  {
    option: 'trailingComma',
    type: 'string',
    default: '"all"',
    project: '默认',
    desc: '尾部逗号：none / es5 / all（ES5 即数组+对象）',
  },
  {
    option: 'bracketSpacing',
    type: 'boolean',
    default: 'true',
    project: '默认',
    desc: '对象花括号内是否加空格 { foo }',
  },
  {
    option: 'bracketSameLine',
    type: 'boolean',
    default: 'false',
    project: '默认',
    desc: 'JSX 标签闭合括号是否与最后一行同行',
  },
  {
    option: 'arrowParens',
    type: 'string',
    default: '"always"',
    project: '默认',
    desc: '箭头函数参数括号：always / avoid',
  },
  {
    option: 'endOfLine',
    type: 'string',
    default: '"lf"',
    project: '默认',
    desc: '换行符类型：lf / crlf / cr / auto',
  },
  {
    option: 'embeddedLanguageFormatting',
    type: 'string',
    default: '"auto"',
    project: '默认',
    desc: '是否格式化嵌入语言（如 HTML 内 CSS）：auto / off',
  },
])

const beforeAfter = ref([
  { before: `const   obj =   {name:"foo",age:18 ,  gender:"male" }`, after: `const obj = { name: 'foo', age: 18, gender: 'male' }` },
  { before: `function  hello(  x , y ){return x+y}`, after: `function hello(x, y) { return x + y }` },
  { before: `if( x ){ doSomething ( ) }`, after: `if (x) { doSomething() }` },
  { before: `import { A ,B , C} from "foo"`, after: `import { A, B, C } from 'foo'` },
])
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>⚙ Stage 2：核心配置</h1>
      <p class="subtitle">.prettierrc.json 配置文件详解、各选项含义与效果演示</p>
    </header>

    <!-- 配置文件概览 -->
    <section class="card">
      <h2>配置文件总览</h2>
      <p class="desc">
        Prettier 支持多种配置文件格式：<code>.prettierrc</code>（JSON/YAML）、<code>.prettierrc.json</code>、<code>prettier.config.js</code>、或在 <code>package.json</code> 中通过 <code>"prettier"</code> 字段配置。
      </p>
      <div class="code-block">
        <pre><code>// .prettierrc.json (本项目)
{
  "$schema": "{{ schemaUrl }}",
  "semi": false,
  "singleQuote": true,
  "printWidth": 120
}</code></pre>
      </div>
      <p class="note">
        <code>$schema</code> 提供 IDE 自动补全和校验，指向 <a :href="schemaUrl" target="_blank">{{ schemaUrl }}</a>。
      </p>
    </section>

    <!-- 配置项详解 -->
    <section class="card">
      <h2>配置项详解</h2>
      <a-table
        :columns="[
          { title: '配置项', dataIndex: 'option', key: 'option' },
          { title: '类型', dataIndex: 'type', key: 'type' },
          { title: '默认值', dataIndex: 'default', key: 'default' },
          { title: '本项目', dataIndex: 'project', key: 'project' },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="configItems"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- 格式化前后对比 -->
    <section class="card">
      <h2>格式化前后对比</h2>
      <p class="desc">基于本项目配置（无分号，单引号，printWidth 120）的效果演示：</p>
      <div class="compare-grid">
        <div v-for="(item, idx) in beforeAfter" :key="idx" class="compare-row">
          <div class="compare-col before">
            <span class="label">Before</span>
            <code>{{ item.before }}</code>
          </div>
          <span class="arrow">→</span>
          <div class="compare-col after">
            <span class="label">After</span>
            <code>{{ item.after }}</code>
          </div>
        </div>
      </div>
    </section>

    <!-- 关键选项详解 -->
    <section class="card">
      <h2>关键选项详解</h2>

      <h3>printWidth — 控制行宽</h3>
      <p class="desc">
        Prettier 会尽量让每行不超过 <code>printWidth</code> 个字符。但有些内容如长字符串、注释中的 URL 不会被硬换行。建议设为 80-120，本项目设为 <strong>120</strong>。
      </p>

      <h3>semi / singleQuote — 风格控制</h3>
      <p class="desc">
        本项目设为 <code>semi: false, singleQuote: true</code>，即不用分号、字符串用单引号。这是 Vue 社区的常见偏好。
      </p>

      <h3>trailingComma — 尾部逗号</h3>
      <div class="options-detail">
        <div class="opt-row"><code>"none"</code> - 永远不加尾部逗号</div>
        <div class="opt-row"><code>"es5"</code> - ES5 支持的地方加（对象、数组）</div>
        <div class="opt-row"><code>"all"</code> - 所有可能的地方都加（含函数参数）<strong>← 默认</strong></div>
      </div>

      <h3>endOfLine — 换行符</h3>
      <p class="desc">
        默认 <code>lf</code>（\n，Unix/Mac）。Windows 下建议设为 <code>auto</code> 让 Prettier 自动判断当前操作系统的换行符，避免 Git 提交时产生大量差异。
      </p>
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
  margin: 20px 0 10px;
  font-size: 15px;
  color: #555;
}
.desc {
  color: #555;
  font-size: 14px;
  line-height: 1.8;
  margin: 0 0 12px;
}
.desc code, .desc strong {
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
}
.compare-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.compare-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.compare-col {
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 12px;
  overflow-x: auto;
}
.compare-col.before {
  background: #fff2f0;
  border: 1px solid #ffccc7;
}
.compare-col.after {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
}
.compare-col .label {
  display: block;
  font-size: 11px;
  color: #999;
  margin-bottom: 4px;
  font-weight: 700;
}
.compare-col code {
  font-size: 12px;
  word-break: break-all;
}
.arrow {
  font-size: 18px;
  color: #bbb;
  flex-shrink: 0;
}
.options-detail {
  background: #fafafa;
  border-radius: 8px;
  padding: 12px 16px;
}
.opt-row {
  padding: 6px 0;
  font-size: 13px;
  color: #555;
}
.opt-row code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
}
@media (max-width: 768px) {
  .compare-row {
    flex-direction: column;
  }
  .arrow {
    transform: rotate(90deg);
  }
}
</style>
