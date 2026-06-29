<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: '快速上手',
    desc: 'Prettier 介绍、安装、CLI 命令、--check / --write 用法',
    path: '/prettier/stage1',
    icon: '🚀',
    color: '#1a2b5a',
  },
  {
    id: 2,
    title: '核心配置',
    desc: '.prettierrc 配置项详解：缩进、引号、分号、宽度、换行等',
    path: '/prettier/stage2',
    icon: '⚙',
    color: '#52c41a',
  },
  {
    id: 3,
    title: '忽略与覆盖',
    desc: '.prettierignore、overrides、Prettier 范围选择性格式化',
    path: '/prettier/stage3',
    icon: '🎯',
    color: '#fa8c16',
  },
  {
    id: 4,
    title: 'ESLint 集成',
    desc: 'eslint-config-prettier、eslint-plugin-prettier、冲突解决策略',
    path: '/prettier/stage4',
    icon: '🔗',
    color: '#42b883',
  },
  {
    id: 5,
    title: '进阶与生态',
    desc: 'Editor 集成、Git Hooks、CI/CD、prettier-plugin-*、Monorepo',
    path: '/prettier/stage5',
    icon: '🌟',
    color: '#722ed1',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="prettier-index">
    <header class="page-header">
      <h1>✨ Prettier 学习教程</h1>
      <p class="subtitle">
        基于 <code>prettier@3.8.3</code>，涵盖 CLI、配置、忽略规则、ESLint 集成到进阶生态，5 阶段系统学习。
      </p>
    </header>

    <!-- 核心概念速览 -->
    <section class="card quick-ref">
      <h2>Prettier 核心概念</h2>
      <div class="concept-grid">
        <div class="concept-item">
          <strong>Opinionated</strong>
          <span>Prettier 是"有主见"的格式化工具，提供少量配置项而非一切可配</span>
        </div>
        <div class="concept-item">
          <strong>AST-based</strong>
          <span>基于 AST 解析而非正则替换，保证格式化准确且一致</span>
        </div>
        <div class="concept-item">
          <strong>Bracket Spacing</strong>
          <span>控制对象花括号内部空格，{ foo: bar } vs {foo: bar}</span>
        </div>
        <div class="concept-item">
          <strong>Print Width</strong>
          <span>单行最大字符数，超过后自动换行；本项目中设为 120</span>
        </div>
        <div class="concept-item">
          <strong>ECMAScript 5 Trailing Commas</strong>
          <span>控制尾部逗号策略：none / es5 / all，默认 all</span>
        </div>
        <div class="concept-item">
          <strong>Preprocessor</strong>
          <span>通过插件支持 .vue、.css、.scss、.json 等非 JS 格式</span>
        </div>
      </div>
    </section>

    <!-- 学习阶段 -->
    <section class="stages">
      <h2>学习阶段（共 5 个）</h2>
      <div class="stage-grid">
        <div
          v-for="s in stages"
          :key="s.id"
          class="stage-card"
          :style="{ borderTopColor: s.color }"
          @click="navigateTo(s.path)"
        >
          <span class="stage-icon">{{ s.icon }}</span>
          <h3>{{ s.title }}</h3>
          <p class="stage-desc">{{ s.desc }}</p>
          <div class="stage-badge" :style="{ background: s.color, color: '#fff' }">
            Stage {{ s.id }}
          </div>
        </div>
      </div>
    </section>

    <!-- Prettier vs 其他格式化工具 -->
    <section class="card">
      <h2>Prettier vs 其他格式化工具</h2>
      <a-table
        :columns="[
          { title: '对比维度', dataIndex: 'dim', key: 'dim' },
          { title: 'Prettier', dataIndex: 'prettier', key: 'prettier' },
          { title: 'ESLint (stylistic)', dataIndex: 'eslint', key: 'eslint' },
          { title: 'dprint', dataIndex: 'dprint', key: 'dprint' },
        ]"
        :data-source="[
          { dim: '专注领域', prettier: '纯代码格式化', eslint: '逻辑问题 + 风格规则', dprint: '纯代码格式化' },
          { dim: '配置量', prettier: '极少（~20 项）', eslint: '极多（数百条规则）', dprint: '极少' },
          { dim: '性能', prettier: '中等（JS 实现）', eslint: '中等', dprint: '极快（Rust 实现）' },
          { dim: '语言支持', prettier: 'JS/TS/CSS/HTML/JSON 等', eslint: 'JS/TS 为主', dprint: 'JS/TS/JSON/Toml 等' },
          { dim: 'Vue SFC 支持', prettier: '原生支持', eslint: '需要插件(eslint-plugin-vue)', dprint: '需要插件' },
          { dim: '生态成熟度', prettier: '最成熟、最广泛', eslint: '最成熟、最广泛', dprint: '新兴、快速增长' },
          { dim: '自动修复', prettier: 'prettier --write', eslint: 'eslint --fix', dprint: 'dprint fmt' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>
  </div>
</template>

<style scoped>
.prettier-index {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
}

.subtitle code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
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

.concept-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.concept-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.concept-item strong {
  font-size: 14px;
  color: #333;
}

.concept-item span {
  font-size: 12px;
  color: #999;
}

.stages h2 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stage-card {
  position: relative;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-top: 3px solid;
  border-radius: 10px;
  padding: 20px 16px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}

.stage-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.stage-icon {
  font-size: 28px;
}

.stage-card h3 {
  margin: 10px 0 6px;
  font-size: 15px;
  color: #333;
}

.stage-desc {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
  margin: 0;
}

.stage-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

@media (max-width: 768px) {
  .concept-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stage-grid {
    grid-template-columns: 1fr;
  }
}
</style>
