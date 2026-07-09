<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: '快速上手：移动端适配与基础组件',
    desc: '安装配置、Rem 适配、Button、Icon、Cell、NavBar、Tabbar 等基础组件',
    path: '/vant/stage1',
    icon: '📱',
    color: '#1989fa',
  },
  {
    id: 2,
    title: '表单与数据展示',
    desc: 'Form 表单、Field 输入、Picker 选择器、DatetimePicker、Uploader、List、Swipe 等',
    path: '/vant/stage2',
    icon: '📝',
    color: '#07c160',
  },
  {
    id: 3,
    title: '反馈与交互组件',
    desc: 'Dialog 弹窗、Toast 轻提示、Notify 通知、ActionSheet、PullRefresh、Lazyload 等',
    path: '/vant/stage3',
    icon: '💬',
    color: '#ee0a24',
  },
  {
    id: 4,
    title: '综合实战：车险投保列表页',
    desc: '列表展示+搜索筛选+新增编辑+图片上传，覆盖 Vant 4 全部表单控件',
    path: '/vant/stage4',
    icon: '🚗',
    color: '#ff976a',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="vant-index">
    <header class="page-header">
      <h1>Vant 移动端 UI 学习</h1>
      <p class="subtitle">
        基于 <code>vant@^4.x</code>，有赞开源、业界领先的 Vue 3 移动端组件库，覆盖 70+ 高质量组件。
      </p>
    </header>

    <!-- 核心组件速览 -->
    <section class="card quick-ref">
      <h2>核心组件速览</h2>
      <div class="api-grid">
        <div class="api-item"><code>&lt;van-button&gt;</code><span>按钮</span></div>
        <div class="api-item"><code>&lt;van-cell&gt;</code><span>单元格</span></div>
        <div class="api-item"><code>&lt;van-field&gt;</code><span>输入框</span></div>
        <div class="api-item"><code>&lt;van-form&gt;</code><span>表单</span></div>
        <div class="api-item"><code>&lt;van-popup&gt;</code><span>弹出层</span></div>
        <div class="api-item"><code>&lt;van-picker&gt;</code><span>选择器</span></div>
        <div class="api-item"><code>&lt;van-list&gt;</code><span>列表</span></div>
        <div class="api-item"><code>&lt;van-swipe&gt;</code><span>轮播</span></div>
        <div class="api-item"><code>&lt;van-tabbar&gt;</code><span>标签栏</span></div>
        <div class="api-item"><code>&lt;van-nav-bar&gt;</code><span>导航栏</span></div>
        <div class="api-item"><code>&lt;van-search&gt;</code><span>搜索</span></div>
        <div class="api-item"><code>&lt;van-dialog&gt;</code><span>对话框</span></div>
        <div class="api-item"><code>&lt;van-toast&gt;</code><span>轻提示</span></div>
        <div class="api-item"><code>&lt;van-uploader&gt;</code><span>上传</span></div>
        <div class="api-item"><code>&lt;van-image&gt;</code><span>图片</span></div>
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

    <!-- Vant 特点 -->
    <section class="card">
      <h2>Vant 4 特点</h2>
      <ul class="why-list">
        <li><strong>70+ 组件</strong>：覆盖移动端开发绝大部分场景</li>
        <li><strong>轻量</strong>：平均组件体积 &lt; 5KB（min+gzip），支持 Tree Shaking</li>
        <li><strong>Vue 3 原生</strong>：全面支持 Composition API 和 TypeScript</li>
        <li><strong>主题定制</strong>：CSS 变量方案，轻松实现品牌定制</li>
        <li><strong>国际化</strong>：内置 30+ 语言包</li>
        <li><strong>服务端渲染</strong>：支持 Nuxt 3 集成</li>
        <li><strong>Rem 适配</strong>：内置适配方案，自动处理不同屏幕</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.vant-index {
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
.api-item code { font-size: 13px; color: #1989fa; font-weight: 500; }
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

.why-list { list-style: none; padding: 0; }
.why-list li { padding: 6px 0; font-size: 14px; color: #555; line-height: 1.6; }

@media (max-width: 768px) {
  .api-grid { grid-template-columns: repeat(3, 1fr); }
  .stage-grid { grid-template-columns: 1fr; }
}
</style>
