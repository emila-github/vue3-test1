<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: 'defineModel',
    desc: '简化 v-model 双向绑定，替代 props + emit 模式',
    path: '/vue3-features/stage1',
    icon: '🔗',
    color: '#3178c6',
  },
  {
    id: 2,
    title: 'useTemplateRef',
    desc: '类型安全的模板引用获取方式',
    path: '/vue3-features/stage2',
    icon: '🎯',
    color: '#52c41a',
  },
  {
    id: 3,
    title: 'Props 响应式解构 & useId',
    desc: 'props 直接解构保持响应式、唯一 ID 生成',
    path: '/vue3-features/stage3',
    icon: '🧩',
    color: '#fa8c16',
  },
  {
    id: 4,
    title: 'v-bind 同名简写 & defineOptions',
    desc: '省略属性值简写、Options API 宏',
    path: '/vue3-features/stage4',
    icon: '⚡',
    color: '#1890ff',
  },
  {
    id: 5,
    title: 'toValue & 其他新 API',
    desc: '统一处理 MaybeRef、onWatcherCleanup 等',
    path: '/vue3-features/stage5',
    icon: '🛠',
    color: '#722ed1',
  },
])

const apiList = ref([
  { api: 'defineModel()', version: '3.4+', desc: '声明双向绑定的 model prop' },
  { api: 'useTemplateRef()', version: '3.5+', desc: '类型安全的模板引用' },
  { api: 'Props 响应式解构', version: '3.5+', desc: '直接解构 props 保持响应式' },
  { api: 'useId()', version: '3.5+', desc: '生成唯一 ID，支持 SSR' },
  { api: 'v-bind 同名简写', version: '3.4+', desc: ':id 代替 :id="id"' },
  { api: 'defineOptions()', version: '3.3+', desc: '在 script setup 中声明组件选项' },
  { api: 'toValue()', version: '3.3+', desc: '统一规范化 MaybeRefOrGetter' },
  { api: 'onWatcherCleanup()', version: '3.5+', desc: 'watch/watchEffect 内部清理函数' },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Vue 3.4/3.5 新特性</h1>
      <p>深入掌握 Vue 3.4 ~ 3.5 引入的重要新特性，包括 defineModel、useTemplateRef、Props 响应式解构、useId、v-bind 同名简写、defineOptions、toValue 等。</p>
    </header>

    <!-- API 速览 -->
    <section class="card">
      <h2>新 API 速览</h2>
      <div class="info-grid">
        <div v-for="item in apiList" :key="item.api" class="info-item">
          <strong>
            <code>{{ item.api }}</code>
            <span class="version-tag">{{ item.version }}</span>
          </strong>
          <span>{{ item.desc }}</span>
        </div>
      </div>
    </section>

    <!-- 学习阶段 -->
    <section>
      <h2 style="margin: 0 0 16px; font-size: 18px; color: #333;">学习阶段（共 5 个）</h2>
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

    <!-- 版本对比 -->
    <section class="card">
      <h2>Vue 3.4 vs 3.5 特性对比</h2>
      <a-table
        :columns="[
          { title: '特性', dataIndex: 'feature', key: 'feature' },
          { title: '引入版本', dataIndex: 'version', key: 'version' },
          { title: '作用', dataIndex: 'purpose', key: 'purpose' },
        ]"
        :data-source="[
          { feature: 'defineModel', version: '3.4', purpose: '简化 v-model 双向绑定声明' },
          { feature: 'v-bind 同名简写', version: '3.4', purpose: '属性名与值相同时可省略值' },
          { feature: 'useTemplateRef', version: '3.5', purpose: '类型安全的模板引用 API' },
          { feature: 'Props 响应式解构', version: '3.5', purpose: '解构 props 自动保持响应式' },
          { feature: 'useId', version: '3.5', purpose: '生成应用级唯一 ID' },
          { feature: 'onWatcherCleanup', version: '3.5', purpose: 'watch 内部清理函数' },
        ]"
        :pagination="false"
        size="small"
      />
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
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.page-header p {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.info-item {
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item strong {
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-item code {
  background: #e8e8e8;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.version-tag {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 8px;
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 500;
}

.info-item span {
  font-size: 12px;
  color: #999;
}

/* 阶段卡片 */
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
  .info-grid {
    grid-template-columns: 1fr;
  }
  .stage-grid {
    grid-template-columns: 1fr;
  }
}
</style>
