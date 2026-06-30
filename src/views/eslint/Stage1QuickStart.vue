<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'overview' | 'cli' | 'fix'>('overview')

const initSteps = ref([
  { step: 1, title: '安装 ESLint', cmd: 'pnpm add -D eslint' },
  { step: 2, title: '创建配置文件', cmd: 'npx eslint --init' },
  { step: 3, title: '运行检查', cmd: 'npx eslint src/' },
  { step: 4, title: '添加到 package.json', cmd: '"lint:eslint": "eslint . --fix --cache"' },
])

const cliOptions = ref([
  { option: '--ext', desc: '指定文件扩展名（Flat Config 中已不推荐）' },
  { option: '--fix', desc: '自动修复可修复的问题' },
  { option: '--cache', desc: '启用缓存，只检查变更文件' },
  { option: '--format', desc: '指定输出格式 (stylish, json, html 等)' },
  { option: '--quiet', desc: '只报告错误，忽略警告' },
  { option: '--max-warnings', desc: '设置警告上限，超出时退出码非零' },
  { option: '--no-warn-ignored', desc: '不报告被忽略的文件' },
  { option: '--rule', desc: '临时覆盖指定规则 (--rule no-console:error)' },
])
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>🚀 Stage 1：ESLint 快速上手</h1>
      <p class="subtitle">了解 ESLint 是什么，学会安装、配置和运行基础检查</p>
    </header>

    <!-- 什么是 ESLint -->
    <section class="card">
      <h2>什么是 ESLint？</h2>
      <div class="info-box">
        <p><strong>ESLint</strong> 是一个开源的 JavaScript / TypeScript 代码质量检查工具。</p>
        <ul>
          <li>🔍 <strong>发现</strong>：潜在的 bug、代码风格不一致、不良实践</li>
          <li>🔧 <strong>修复</strong>：许多规则支持自动修复（--fix）</li>
          <li>📏 <strong>约束</strong>：团队统一编码规范，减少 Code Review 工作</li>
          <li>📦 <strong>生态</strong>：数千个第三方插件和共享配置</li>
        </ul>
      </div>
    </section>

    <!-- 核心架构 -->
    <section class="card">
      <h2>ESLint 核心架构</h2>
      <div class="arch-flow">
        <div class="arch-block">
          <div class="arch-num">1</div>
          <strong>解析</strong>
          <span>Parser 把源码转为 AST</span>
        </div>
        <span class="arch-arrow">→</span>
        <div class="arch-block">
          <div class="arch-num">2</div>
          <strong>遍历</strong>
          <span>遍历 AST 节点树</span>
        </div>
        <span class="arch-arrow">→</span>
        <div class="arch-block">
          <div class="arch-num">3</div>
          <strong>规则匹配</strong>
          <span>每条规则检查对应节点</span>
        </div>
        <span class="arch-arrow">→</span>
        <div class="arch-block">
          <div class="arch-num">4</div>
          <strong>报告</strong>
          <span>收集并输出问题</span>
        </div>
      </div>
    </section>

    <!-- 初始化步骤 -->
    <section class="card">
      <h2>安装 &amp; 初始化</h2>
      <a-table
        :columns="[
          { title: '步骤', dataIndex: 'step', key: 'step', width: 80 },
          { title: '操作', dataIndex: 'title', key: 'title' },
          { title: '命令', dataIndex: 'cmd', key: 'cmd' },
        ]"
        :data-source="initSteps"
        :pagination="false"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'cmd'">
            <code class="code-inline">{{ record.cmd }}</code>
          </template>
        </template>
      </a-table>
      <div class="tip-box" style="margin-top: 12px">
        <strong>💡 提示</strong>：本项目已配置完成，可以直接运行 <code>pnpm lint:eslint</code> 体验效果。
      </div>
    </section>

    <!-- CLI 选项 -->
    <section class="card">
      <h2>常用 CLI 选项</h2>
      <a-table
        :columns="[
          { title: '选项', dataIndex: 'option', key: 'option', width: 160 },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="cliOptions"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- 演示：自动修复 -->
    <section class="card">
      <h2>自动修复演示</h2>
      <p class="section-desc">ESLint 可以自动修复许多规则违规。下面演示分号规则的自动修复：</p>
      <div class="code-compare">
        <div class="code-block">
          <div class="code-label">❌ 修复前 (无分号)</div>
          <pre><code>const a = 1
const b = 2
const sum = a + b</code></pre>
        </div>
        <div class="code-block">
          <div class="code-label">✅ 修复后 (eslint --fix)</div>
          <pre><code>const a = 1;
const b = 2;
const sum = a + b;</code></pre>
        </div>
      </div>
      <div class="info-box" style="margin-top: 12px">
        <strong>可自动修复的规则类型</strong>：分号、缩进、引号、逗号、空格、换行等格式类规则。<br />
        逻辑类规则（如 <code>no-unused-vars</code>）无法自动修复，需要手动处理。
      </div>
    </section>

    <!-- 退出码 -->
    <section class="card">
      <h2>ESLint 退出码</h2>
      <a-table
        :columns="[
          { title: '退出码', dataIndex: 'code', key: 'code', width: 80 },
          { title: '含义', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="[
          { code: 0, desc: '没有错误（可能有警告）' },
          { code: 1, desc: '存在 lint 错误（或警告超过上限）' },
          { code: 2, desc: '配置或运行时错误' },
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
  border-left: 3px solid #4b32c3;
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

.tip-box {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #666;
}

.code-inline {
  background: #f5f5f5;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-family: 'Consolas', monospace;
}

/* 架构流程图 */
.arch-flow {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.arch-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  min-width: 120px;
}

.arch-block .arch-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #4b32c3;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
}

.arch-block strong {
  font-size: 14px;
  color: #333;
}

.arch-block span {
  font-size: 11px;
  color: #999;
}

.arch-arrow {
  font-size: 20px;
  color: #ccc;
  margin: 0 2px;
}

/* 代码对比 */
.code-compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.code-block {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.code-label {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.code-block pre {
  margin: 0;
  padding: 12px;
  background: #1e1e1e;
  color: #d4d4d4;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
}

.code-block pre code {
  font-family: 'Consolas', monospace;
}

@media (max-width: 640px) {
  .code-compare {
    grid-template-columns: 1fr;
  }
  .arch-flow {
    flex-direction: column;
  }
}
</style>
