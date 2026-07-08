<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: '快速上手：本地持久化',
    desc: '安装配置 pinia-plugin-persistedstate，实现 Pinia Store 数据自动持久化到 localStorage',
    path: '/pinia-persist/stage1',
    icon: '💾',
    color: '#52c41a',
  },
  {
    id: 2,
    title: '进阶配置与策略',
    desc: 'sessionStorage、自定义 serializer、部分持久化、多 Store 策略、迁移与版本控制',
    path: '/pinia-persist/stage2',
    icon: '⚙',
    color: '#722ed1',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="persist-index">
    <header class="page-header">
      <h1>Pinia 持久化插件学习</h1>
      <p class="subtitle">
        基于 <code>pinia-plugin-persistedstate@^4</code>，实现 Pinia Store 数据的自动持久化与恢复。
      </p>
    </header>

    <!-- 核心 API 速览 -->
    <section class="card quick-ref">
      <h2>核心 API 速览</h2>
      <div class="api-grid">
        <div class="api-item">
          <code>persist: true</code>
          <span>启用持久化（默认 localStorage）</span>
        </div>
        <div class="api-item">
          <code>storage</code>
          <span>指定存储引擎（localStorage/sessionStorage/自定义）</span>
        </div>
        <div class="api-item">
          <code>paths</code>
          <span>指定需要持久化的字段</span>
        </div>
        <div class="api-item">
          <code>serializer</code>
          <span>自定义序列化/反序列化</span>
        </div>
        <div class="api-item">
          <code>beforeRestore</code>
          <span>恢复前回调（数据迁移）</span>
        </div>
        <div class="api-item">
          <code>afterRestore</code>
          <span>恢复后回调</span>
        </div>
        <div class="api-item">
          <code>debug</code>
          <span>开启调试日志</span>
        </div>
        <div class="api-item">
          <code>pick</code>
          <span>pick 模式：仅持久化指定字段</span>
        </div>
        <div class="api-item">
          <code>omit</code>
          <span>omit 模式：排除指定字段</span>
        </div>
        <div class="api-item">
          <code>key</code>
          <span>自定义存储 key 前缀</span>
        </div>
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
      <h2>为什么需要持久化插件？</h2>
      <ul class="why-list">
        <li><strong>避免手写逻辑</strong>：不再需要 watch + localStorage 的样板代码</li>
        <li><strong>自动同步</strong>：Store 状态变化时自动写入存储，页面加载时自动恢复</li>
        <li><strong>灵活配置</strong>：支持按 Store、按字段粒度的持久化策略</li>
        <li><strong>多后端支持</strong>：localStorage、sessionStorage、自定义 storage（如 IndexedDB）</li>
        <li><strong>类型安全</strong>：完美配合 Pinia 的 TypeScript 支持</li>
      </ul>
    </section>

    <section class="card">
      <h2>安装与配置</h2>
      <pre class="code-block">
// npm
npm i pinia-plugin-persistedstate

// pnpm
pnpm add pinia-plugin-persistedstate

// main.ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)  // 👈 注册插件

app.use(pinia)</pre>
    </section>
  </div>
</template>

<style scoped>
.persist-index {
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

.code-block {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin-bottom: 16px;
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
.api-item code { font-size: 13px; color: #1677ff; font-weight: 500; }
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
