<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: '快速上手：安装与基础组件',
    desc: '安装配置、按需导入、布局容器、按钮、图标、链接、基础用法',
    path: '/element/stage1',
    icon: '🚀',
    color: '#409eff',
  },
  {
    id: 2,
    title: '核心组件：表单与数据展示',
    desc: 'Form 表单校验、Table 表格、Dialog 对话框、Pagination 分页、Tree 树形控件',
    path: '/element/stage2',
    icon: '📋',
    color: '#67c23a',
  },
  {
    id: 3,
    title: '主题定制与进阶',
    desc: 'CSS 变量定制、暗黑模式切换、el-config-provider、国际化、按需加载优化',
    path: '/element/stage3',
    icon: '🎨',
    color: '#e6a23c',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="element-index">
    <header class="page-header">
      <h1>Element Plus 学习</h1>
      <p class="subtitle">
        基于 <code>element-plus@^2.x</code>，Vue 3 最流行的桌面端 UI 组件库之一，与 Ant Design Vue 并列两大生态。
      </p>
    </header>

    <!-- 核心 API 速览 -->
    <section class="card quick-ref">
      <h2>核心组件速览</h2>
      <div class="api-grid">
        <div class="api-item"><code>&lt;el-button&gt;</code><span>按钮</span></div>
        <div class="api-item"><code>&lt;el-input&gt;</code><span>输入框</span></div>
        <div class="api-item"><code>&lt;el-table&gt;</code><span>表格</span></div>
        <div class="api-item"><code>&lt;el-form&gt;</code><span>表单</span></div>
        <div class="api-item"><code>&lt;el-dialog&gt;</code><span>对话框</span></div>
        <div class="api-item"><code>&lt;el-select&gt;</code><span>选择器</span></div>
        <div class="api-item"><code>&lt;el-date-picker&gt;</code><span>日期选择</span></div>
        <div class="api-item"><code>&lt;el-pagination&gt;</code><span>分页</span></div>
        <div class="api-item"><code>&lt;el-tree&gt;</code><span>树形控件</span></div>
        <div class="api-item"><code>&lt;el-tabs&gt;</code><span>标签页</span></div>
        <div class="api-item"><code>&lt;el-menu&gt;</code><span>导航菜单</span></div>
        <div class="api-item"><code>&lt;el-popover&gt;</code><span>气泡卡片</span></div>
        <div class="api-item"><code>&lt;el-image&gt;</code><span>图片</span></div>
        <div class="api-item"><code>&lt;el-upload&gt;</code><span>上传</span></div>
        <div class="api-item"><code>&lt;el-empty&gt;</code><span>空状态</span></div>
      </div>
    </section>

    <!-- 学习阶段 -->
    <section class="stages">
      <h2>学习阶段（共 3 个）</h2>
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

    <!-- Element Plus vs Ant Design Vue -->
    <section class="card">
      <h2>Element Plus vs Ant Design Vue</h2>
      <div class="compare-table">
        <div class="compare-header">
          <span>维度</span><span>Element Plus</span><span>Ant Design Vue</span>
        </div>
        <div class="compare-row"><span>设计理念</span><span>Material Design 风格</span><span>蚂蚁设计规范</span></div>
        <div class="compare-row"><span>CSS 方式</span><span>SCSS 变量 + CSS 变量</span><span>CSS-in-JS (v4)</span></div>
        <div class="compare-row"><span>包大小</span><span>较大（全量引入）</span><span>Tree-Shaking 好</span></div>
        <div class="compare-row"><span>社区生态</span><span>非常活跃</span><span>企业级支持</span></div>
        <div class="compare-row"><span>适用场景</span><span>通用后台 / 中台</span><span>企业级复杂应用</span></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.element-index {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}
.page-header h1 { font-size: 28px; color: #1a1a1a; margin: 0 0 8px; }
.subtitle { color: #666; font-size: 14px; }
.subtitle code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 13px; }

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; }

.api-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.api-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}
.api-item code { font-size: 13px; color: #409eff; font-weight: 500; }
.api-item span { font-size: 12px; color: #999; }

.stages h2 { margin: 0 0 16px; font-size: 18px; color: #333; }
.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
.stage-card:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); transform: translateY(-2px); }
.stage-icon { font-size: 28px; }
.stage-card h3 { margin: 10px 0 6px; font-size: 15px; color: #333; }
.stage-desc { font-size: 12px; color: #999; line-height: 1.5; margin: 0; }
.stage-badge { position: absolute; top: 10px; right: 10px; font-size: 11px; padding: 2px 8px; border-radius: 10px; }

.compare-table {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
}
.compare-header, .compare-row {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  padding: 10px 16px;
  font-size: 13px;
}
.compare-header { background: #f5f7fa; font-weight: 600; color: #333; }
.compare-row { border-top: 1px solid #ebeef5; color: #666; }

@media (max-width: 768px) {
  .api-grid { grid-template-columns: repeat(3, 1fr); }
  .stage-grid { grid-template-columns: 1fr; }
  .compare-header, .compare-row { grid-template-columns: 1fr 1.5fr 1.5fr; }
}
</style>
