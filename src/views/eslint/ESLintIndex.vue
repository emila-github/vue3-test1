<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: '快速上手',
    desc: 'ESLint 是什么、安装初始化、基本命令、常用 CLI 选项',
    path: '/eslint/stage1',
    icon: '🚀',
    color: '#4b32c3',
  },
  {
    id: 2,
    title: 'Flat Config 配置',
    desc: 'eslint.config.ts 结构、languageOptions、linterOptions、rules',
    path: '/eslint/stage2',
    icon: '⚙',
    color: '#52c41a',
  },
  {
    id: 3,
    title: '插件与共享配置',
    desc: '插件机制、extends/configs、eslint-plugin-vue、typescript-eslint',
    path: '/eslint/stage3',
    icon: '🧩',
    color: '#fa8c16',
  },
  {
    id: 4,
    title: 'Vue + TS 实战',
    desc: '本项目配置拆解、vue-eslint-config、Prettier 集成、OXC',
    path: '/eslint/stage4',
    icon: '💚',
    color: '#42b883',
  },
  {
    id: 5,
    title: '进阶与生态',
    desc: '自定义规则、eslint-disable 策略、Git Hooks、CI/CD 集成',
    path: '/eslint/stage5',
    icon: '🌟',
    color: '#722ed1',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="eslint-index">
    <header class="page-header">
      <h1>🔍 ESLint 学习教程</h1>
      <p class="subtitle">
        基于 <code>eslint@^10.2.1</code> Flat Config，覆盖配置、插件、Vue/TS 集成到进阶生态，5 阶段系统学习。
      </p>
    </header>

    <!-- 核心概念速览 -->
    <section class="card quick-ref">
      <h2>ESLint 核心概念</h2>
      <div class="concept-grid">
        <div class="concept-item">
          <strong>Flat Config</strong>
          <span>ESLint 9+ 新配置格式，用 eslint.config.ts 替代 .eslintrc.*</span>
        </div>
        <div class="concept-item">
          <strong>Rules</strong>
          <span>规则是 ESLint 的核心，每条规则定义一种代码模式约束</span>
        </div>
        <div class="concept-item">
          <strong>Plugins</strong>
          <span>插件提供额外的规则和处理器，如 eslint-plugin-vue</span>
        </div>
        <div class="concept-item">
          <strong>Configs</strong>
          <span>可共享配置包，一键引入最佳实践规则集</span>
        </div>
        <div class="concept-item">
          <strong>Formatters</strong>
          <span>自定义输出格式，stylish、json、html 等多种选择</span>
        </div>
        <div class="concept-item">
          <strong>Processor</strong>
          <span>处理器让 ESLint 能检查非 JS 文件（如 .vue SFC）</span>
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
          <div class="stage-badge" :style="{ background: s.color, color: '#fff' }">Stage {{ s.id }}</div>
        </div>
      </div>
    </section>

    <!-- ESLint vs 其他工具对比 -->
    <section class="card">
      <h2>ESLint vs 其他 Lint 工具</h2>
      <a-table
        :columns="[
          { title: '对比维度', dataIndex: 'dim', key: 'dim' },
          { title: 'ESLint', dataIndex: 'eslint', key: 'eslint' },
          { title: 'TSLint', dataIndex: 'tslint', key: 'tslint' },
          { title: 'OXC/Oxlint', dataIndex: 'oxc', key: 'oxc' },
        ]"
        :data-source="[
          { dim: '状态', eslint: '活跃维护，生态最大', tslint: '已废弃（2019）', oxc: '新兴 Rust 工具链' },
          { dim: '配置格式', eslint: 'Flat Config (TS 原生)', tslint: 'tslint.json', oxc: '.oxlintrc.json' },
          { dim: '性能', eslint: '中等（JS 实现）', tslint: '中等', oxc: '极快（Rust 实现）' },
          { dim: '插件生态', eslint: '数千个插件', tslint: '已冻结', oxc: '快速成长中' },
          { dim: 'Vue 支持', eslint: 'eslint-plugin-vue', tslint: '不支持', oxc: '逐步支持中' },
          { dim: '自动修复', eslint: 'eslint --fix', tslint: 'tslint --fix', oxc: 'oxlint --fix' },
          { dim: '类型检查', eslint: 'type-aware linting', tslint: '内置', oxc: '规划中' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>
  </div>
</template>

<style scoped>
.eslint-index {
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
  transition:
    box-shadow 0.2s,
    transform 0.2s;
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
