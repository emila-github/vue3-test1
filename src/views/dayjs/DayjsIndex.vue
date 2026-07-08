<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: '快速上手：基础操作',
    desc: '解析、格式化、差值计算、增减时间、比较日期、Unix 时间戳',
    path: '/dayjs/stage1',
    icon: '📅',
    color: '#f59e0b',
  },
  {
    id: 2,
    title: '进阶技巧与插件',
    desc: '国际化、相对时间、UTC、持续时间、自定义格式、插件系统',
    path: '/dayjs/stage2',
    icon: '🌍',
    color: '#8b5cf6',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="dayjs-index">
    <header class="page-header">
      <h1>Day.js 日期库学习</h1>
      <p class="subtitle">
        基于 <code>dayjs@^1.11</code>，2KB 大小的 Moment.js 替代方案，API 几乎一致。
      </p>
    </header>

    <!-- 核心 API 速览 -->
    <section class="card quick-ref">
      <h2>核心 API 速览</h2>
      <div class="api-grid">
        <div class="api-item"><code>dayjs()</code><span>创建实例</span></div>
        <div class="api-item"><code>.format()</code><span>格式化输出</span></div>
        <div class="api-item"><code>.add()</code><span>增加时间</span></div>
        <div class="api-item"><code>.subtract()</code><span>减少时间</span></div>
        <div class="api-item"><code>.diff()</code><span>计算差值</span></div>
        <div class="api-item"><code>.isBefore()</code><span>比较先后</span></div>
        <div class="api-item"><code>.isAfter()</code><span>比较先后</span></div>
        <div class="api-item"><code>.isSame()</code><span>判断相同</span></div>
        <div class="api-item"><code>.startOf()</code><span>开始时间</span></div>
        <div class="api-item"><code>.endOf()</code><span>结束时间</span></div>
        <div class="api-item"><code>.fromNow()</code><span>相对时间</span></div>
        <div class="api-item"><code>.unix()</code><span>Unix 戳</span></div>
        <div class="api-item"><code>.valueOf()</code><span>毫秒戳</span></div>
        <div class="api-item"><code>.locale()</code><span>国际化</span></div>
        <div class="api-item"><code>.utc()</code><span>UTC 模式</span></div>
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

    <!-- 为什么选 Day.js -->
    <section class="card">
      <h2>为什么选择 Day.js？</h2>
      <ul class="why-list">
        <li><strong>轻量极简</strong>：压缩后仅 2KB，Moment.js 的 1/30</li>
        <li><strong>API 兼容</strong>：与 Moment.js API 高度一致，迁移成本低</li>
        <li><strong>不可变设计</strong>：所有操作返回新实例，避免副作用</li>
        <li><strong>插件化</strong>：按需加载功能插件（UTC、locale、relativeTime 等）</li>
        <li><strong>Tree Shakable</strong>：只打包使用的插件</li>
        <li><strong>TypeScript</strong>：完整的类型定义支持</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.dayjs-index {
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
.api-item code { font-size: 13px; color: #f59e0b; font-weight: 500; }
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
