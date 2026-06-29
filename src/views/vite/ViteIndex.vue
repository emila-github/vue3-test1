<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: '快速上手',
    desc: '项目初始化、vite.config.ts、开发服务器、HMR 热更新',
    path: '/vite/stage1',
    icon: '🚀',
    color: '#646cff',
  },
  {
    id: 2,
    title: '配置与环境',
    desc: '环境变量、多模式、路径别名、CSS 预处理器、开发代理',
    path: '/vite/stage2',
    icon: '⚙',
    color: '#52c41a',
  },
  {
    id: 3,
    title: '插件系统',
    desc: '官方插件、社区插件、自定义插件开发、插件钩子',
    path: '/vite/stage3',
    icon: '🧩',
    color: '#fa8c16',
  },
  {
    id: 4,
    title: '构建与优化',
    desc: '生产构建、代码分割、Tree Shaking、打包分析、资源处理',
    path: '/vite/stage4',
    icon: '📦',
    color: '#1890ff',
  },
  {
    id: 5,
    title: '进阶特性',
    desc: 'SSR 支持、库模式、Worker 线程、WebAssembly、预构建',
    path: '/vite/stage5',
    icon: '🌟',
    color: '#722ed1',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="vite-index">
    <header class="page-header">
      <h1>⚡ Vite 学习教程</h1>
      <p class="subtitle">
        基于 <code>vite@^8.0.8</code>，覆盖项目初始化、配置、插件、构建优化到进阶特性，5 阶段系统学习。
      </p>
    </header>

    <!-- 核心概念速览 -->
    <section class="card quick-ref">
      <h2>Vite 核心概念</h2>
      <div class="concept-grid">
        <div class="concept-item">
          <strong>ESM Native</strong>
          <span>开发环境基于原生 ES Module，极速冷启动</span>
        </div>
        <div class="concept-item">
          <strong>HMR</strong>
          <span>模块热替换，修改代码即时生效不丢状态</span>
        </div>
        <div class="concept-item">
          <strong>esbuild</strong>
          <span>Go 语言编写的极速预构建与转译</span>
        </div>
        <div class="concept-item">
          <strong>Rollup</strong>
          <span>生产构建引擎，成熟稳定的打包能力</span>
        </div>
        <div class="concept-item">
          <strong>Plugin API</strong>
          <span>兼容 Rollup 插件，Vite 专属钩子扩展</span>
        </div>
        <div class="concept-item">
          <strong>SSR</strong>
          <span>内置服务端渲染支持，开箱即用</span>
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

    <!-- Vite vs Webpack / 关键对比 -->
    <section class="card">
      <h2>Vite vs 传统打包工具</h2>
      <a-table
        :columns="[
          { title: '对比维度', dataIndex: 'dim', key: 'dim' },
          { title: 'Vite', dataIndex: 'vite', key: 'vite' },
          { title: 'Webpack', dataIndex: 'webpack', key: 'webpack' },
        ]"
        :data-source="[
          { dim: '开发启动', vite: '毫秒级（ESM 按需编译）', webpack: '秒～分钟级（全量打包）' },
          { dim: 'HMR 速度', vite: '即时更新，不丢状态', webpack: '随项目增大而变慢' },
          { dim: '构建引擎', vite: 'Rollup（成熟生态）', webpack: '自研打包引擎' },
          { dim: '预构建', vite: 'esbuild 预构建依赖', webpack: '无预构建概念' },
          { dim: 'CSS 支持', vite: '原生 CSS Modules / PostCSS', webpack: '需要 css-loader 等' },
          { dim: 'TypeScript', vite: '内置转译（不类型检查）', webpack: '需 ts-loader/babel' },
          { dim: '配置复杂度', vite: '简洁直观，开箱即用', webpack: '配置繁琐，插件多' },
          { dim: '生态成熟度', vite: '快速增长，社区活跃', webpack: '非常成熟，生态庞大' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>
  </div>
</template>

<style scoped>
.vite-index {
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

/* 核心概念 */
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

/* 阶段卡片 */
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

/* 响应式 */
@media (max-width: 768px) {
  .concept-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stage-grid {
    grid-template-columns: 1fr;
  }
}
</style>
