<script setup lang="ts">
import { ref } from 'vue'

const installWays = ref([
  { way: 'npm', cmd: 'npm install --save-dev prettier' },
  { way: 'yarn', cmd: 'yarn add --dev prettier' },
  { way: 'pnpm', cmd: 'pnpm add -D prettier' },
])

const commands = ref([
  { cmd: 'npx prettier --check src/', desc: '检查文件格式（只读，不修改）' },
  { cmd: 'npx prettier --write src/', desc: '格式化所有匹配文件（写操作）' },
  { cmd: 'npx prettier --write src/index.ts', desc: '格式化单个文件' },
  { cmd: 'npx prettier --write "src/**/*.{vue,ts}"', desc: '格式化指定扩展名文件' },
  { cmd: 'npx prettier --debug-check file.ts', desc: '验证输出是否为有效代码' },
  { cmd: 'npx prettier --list-different src/', desc: '列出与预期格式不符的文件（同 --check）' },
])
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>🚀 Stage 1：快速上手</h1>
      <p class="subtitle">Prettier 是什么、安装方式、CLI 命令速查</p>
    </header>

    <!-- Prettier 是什么 -->
    <section class="card">
      <h2>Prettier 是什么？</h2>
      <p class="desc">
        Prettier 是一个<strong>有主见（opinionated）的代码格式化工具</strong>。不同于 ESLint 提供数百条可配置规则，Prettier
        只保留极少量配置项，保证团队内代码风格<strong>绝对一致</strong>。
      </p>
      <div class="feature-grid">
        <div class="feature-item">
          <strong>📐 统一风格</strong>
          <span>自动解析 AST 并重新打印，消除所有风格争议</span>
        </div>
        <div class="feature-item">
          <strong>⚡ 零配置可运行</strong>
          <span>不写任何配置文件即可格式化，默认规则已足够</span>
        </div>
        <div class="feature-item">
          <strong>🔌 多语言支持</strong>
          <span>JS/TS/CSS/SCSS/HTML/JSON/Vue/Markdown 等开箱即用</span>
        </div>
        <div class="feature-item">
          <strong>🔄 与 ESLint 互补</strong>
          <span>Prettier 管格式，ESLint 管逻辑，两者搭配最佳</span>
        </div>
      </div>
    </section>

    <!-- 安装 -->
    <section class="card">
      <h2>安装 Prettier</h2>
      <a-table
        :columns="[
          { title: '包管理器', dataIndex: 'way', key: 'way' },
          { title: '命令', dataIndex: 'cmd', key: 'cmd' },
        ]"
        :data-source="installWays"
        :pagination="false"
        size="small"
      />
      <p class="note">💡 本项目中已安装 prettier@3.8.3，可通过 pnpm format 运行。</p>
    </section>

    <!-- 工作流程 -->
    <section class="card">
      <h2>Prettier 工作流程</h2>
      <div class="flow">
        <div class="flow-step">
          <span class="step-num">1</span>
          <strong>解析</strong>
          <span>读取源代码 → 解析为 AST</span>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">
          <span class="step-num">2</span>
          <strong>丢弃原始格式</strong>
          <span>忽略原有空格、缩进、换行</span>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">
          <span class="step-num">3</span>
          <strong>按规则打印</strong>
          <span>根据 Prettier 规则重新生成代码</span>
        </div>
      </div>
    </section>

    <!-- CLI 命令 -->
    <section class="card">
      <h2>CLI 命令速查</h2>
      <a-table
        :columns="[
          { title: '命令', dataIndex: 'cmd', key: 'cmd' },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="commands"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- 本项目的使用 -->
    <section class="card">
      <h2>本项目中的 Prettier</h2>
      <div class="code-block">
        <pre><code>// package.json scripts
"format": "prettier --write --experimental-cli src/"

// 执行
pnpm format</code></pre>
      </div>
      <p class="note">
        <code>--experimental-cli</code> 是 Prettier 3.8 引入的参数，表示使用新版 CLI API，未来版本将默认启用。
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
.desc {
  color: #555;
  font-size: 14px;
  line-height: 1.8;
  margin: 0 0 16px;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.feature-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}
.feature-item strong {
  font-size: 14px;
  color: #333;
}
.feature-item span {
  font-size: 12px;
  color: #999;
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
.flow {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 12px;
  background: #fafafa;
  border-radius: 8px;
  flex: 1;
  min-width: 120px;
  text-align: center;
}
.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1a2b5a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}
.flow-step strong {
  font-size: 13px;
}
.flow-step span {
  font-size: 11px;
  color: #999;
}
.flow-arrow {
  font-size: 20px;
  color: #bbb;
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
@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
  .flow {
    flex-direction: column;
  }
  .flow-arrow {
    transform: rotate(90deg);
  }
}
</style>
