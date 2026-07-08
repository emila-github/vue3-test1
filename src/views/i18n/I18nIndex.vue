<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: '快速上手：基础配置',
    desc: '安装 vue-i18n、创建语言包、在组件中使用 $t() 翻译、切换语言',
    path: '/i18n/stage1',
    icon: '🌍',
    color: '#3b82f6',
  },
  {
    id: 2,
    title: '进阶功能与最佳实践',
    desc: '插值、复数、日期/数字格式化、组件插值、懒加载语言包',
    path: '/i18n/stage2',
    icon: '🔧',
    color: '#10b981',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="i18n-index">
    <header class="page-header">
      <h1>Vue I18n 国际化学习</h1>
      <p class="subtitle">
        基于 <code>vue-i18n@^11</code>，支持 Composition API 风格的国际化方案。
      </p>
    </header>

    <!-- 核心 API 速览 -->
    <section class="card quick-ref">
      <h2>核心 API 速览</h2>
      <div class="api-grid">
        <div class="api-item"><code>createI18n()</code><span>创建 i18n 实例</span></div>
        <div class="api-item"><code>$t()</code><span>翻译文本</span></div>
        <div class="api-item"><code>$d()</code><span>日期格式化</span></div>
        <div class="api-item"><code>$n()</code><span>数字格式化</span></div>
        <div class="api-item"><code>useI18n()</code><span>Composition API 方式</span></div>
        <div class="api-item"><code>locale</code><span>当前语言</span></div>
        <div class="api-item"><code>fallbackLocale</code><span>回退语言</span></div>
        <div class="api-item"><code>messages</code><span>语言包消息</span></div>
        <div class="api-item"><code>$tc()</code><span>复数翻译</span></div>
        <div class="api-item"><code>i18n-t</code><span>组件插值</span></div>
      </div>
    </section>

    <!-- 学习阶段 -->
    <section class="stages">
      <h2>学习阶段（共 2 个）</h2>
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

    <!-- 核心特性 -->
    <section class="card">
      <h2>Vue I18n 核心特性</h2>
      <ul class="why-list">
        <li><strong>Composition API 支持</strong>：<code>useI18n()</code> 返回完整的 i18n 实例</li>
        <li><strong>消息格式</strong>：支持插值、复数、列表、日期/数字格式化</li>
        <li><strong>懒加载</strong>：支持按需加载语言包文件</li>
        <li><strong>SSR 支持</strong>：完整的服务端渲染支持</li>
        <li><strong>TypeScript</strong>：提供完整的类型定义</li>
        <li><strong>回退策略</strong>：支持多级回退（locale → fallback → 默认）</li>
      </ul>
    </section>

    <section class="card">
      <h2>安装</h2>
      <pre class="code-block">
pnpm add vue-i18n</pre>
    </section>
  </div>
</template>

<style scoped>
.i18n-index {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.page-header { text-align: center; margin-bottom: 32px; }
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

.code-block {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
}

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
.api-item code { font-size: 13px; color: #3b82f6; font-weight: 500; }
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
  .api-grid { grid-template-columns: repeat(2, 1fr); }
  .stage-grid { grid-template-columns: 1fr; }
}
</style>
