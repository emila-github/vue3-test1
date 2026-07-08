<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: 'ref / reactive API 家族',
    desc: 'ref、reactive、readonly、shallowRef、toRef/toRefs、unref、isRef、toRaw、markRaw — 全家族对比与实战',
    path: '/reactivity-deep/stage1',
    icon: '⚛',
    color: '#1890ff',
  },
  {
    id: 2,
    title: 'computed & watch 深入',
    desc: '可写 computed、watch deep/immediate/flush、watchEffect、watchPostEffect — 精确把控副作用执行',
    path: '/reactivity-deep/stage2',
    icon: '👁',
    color: '#52c41a',
  },
  {
    id: 3,
    title: 'effectScope 作用域管理',
    desc: 'effectScope / onScopeDispose / getCurrentScope — 一键收拢和清理所有响应式副作用',
    path: '/reactivity-deep/stage3',
    icon: '🧹',
    color: '#722ed1',
  },
  {
    id: 4,
    title: 'customRef 自定义引用',
    desc: 'track + trigger 防抖 ref、节流 ref、带验证的 ref — 把控制权交给你',
    path: '/reactivity-deep/stage4',
    icon: '🎛',
    color: '#fa8c16',
  },
  {
    id: 5,
    title: '性能优化与常见陷阱',
    desc: 'shallowRef + triggerRef 大对象优化、v-once、v-memo、reactive 解构丢失响应性',
    path: '/reactivity-deep/stage5',
    icon: '⚡',
    color: '#cf1322',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="reactivity-index">
    <header class="page-header">
      <h1>响应式系统深入</h1>
      <p class="subtitle">
        基于 Vue 3 <code>@vue/reactivity</code> 底层，覆盖 <strong>ref 家族</strong>、<strong
          >computed/watch 进阶</strong
        >、 <strong>effectScope</strong>、<strong>customRef</strong>、<strong>性能优化</strong> 5 大主题。
      </p>
    </header>

    <!-- 核心 API 速览 -->
    <section class="card quick-ref">
      <h2>响应式 API 速览</h2>
      <div class="api-grid">
        <div class="api-item"><code>ref()</code><span>基本响应式值</span></div>
        <div class="api-item"><code>reactive()</code><span>响应式对象/数组</span></div>
        <div class="api-item"><code>computed()</code><span>计算属性</span></div>
        <div class="api-item"><code>watch()</code><span>侦听数据源</span></div>
        <div class="api-item"><code>watchEffect()</code><span>自动追踪副作用</span></div>
        <div class="api-item"><code>shallowRef()</code><span>浅层 ref</span></div>
        <div class="api-item"><code>toRef()</code><span>基于 reactive 创建 ref</span></div>
        <div class="api-item"><code>toRefs()</code><span>解构保持响应式</span></div>
        <div class="api-item"><code>readonly()</code><span>只读代理</span></div>
        <div class="api-item"><code>isRef()</code><span>判断是否为 ref</span></div>
        <div class="api-item"><code>unref()</code><span>ref 解包取值</span></div>
        <div class="api-item"><code>toRaw()</code><span>获取原始对象</span></div>
        <div class="api-item"><code>markRaw()</code><span>标记为非响应式</span></div>
        <div class="api-item"><code>triggerRef()</code><span>手动触发 shallowRef 更新</span></div>
        <div class="api-item"><code>customRef()</code><span>自定义 ref</span></div>
        <div class="api-item"><code>effectScope()</code><span>副作用作用域</span></div>
      </div>
    </section>

    <!-- 学习阶段 -->
    <section class="stages">
      <h2>学习阶段（共 {{ stages.length }} 个）</h2>
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

    <!-- 响应式原理简表 -->
    <section class="card">
      <h2>响应式系统核心概念</h2>
      <a-table
        :columns="[
          { title: '概念', dataIndex: 'concept', key: 'concept', width: 160 },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="[
          { concept: 'Proxy 代理', desc: 'Vue 3 使用 ES6 Proxy 拦截对象操作，替代 Vue 2 的 Object.defineProperty' },
          { concept: 'RefImpl', desc: 'ref() 内部创建 RefImpl 实例，通过 .value 访问/修改触发 getter/setter' },
          {
            concept: 'ReactiveEffect',
            desc: '每个响应式副作用（computed/watch/watchEffect）都对应一个 ReactiveEffect',
          },
          { concept: 'track（追踪）', desc: '在 getter 中调用 track() 收集依赖，建立「数据 → 副作用」映射' },
          { concept: 'trigger（触发）', desc: '在 setter 中调用 trigger() 通知所有依赖该数据的副作用重新执行' },
          { concept: 'effectScope', desc: '将多个 ReactiveEffect 归入作用域，调用 stop() 一次性全部清理' },
          {
            concept: 'shallow 系列',
            desc: 'shallowRef/shallowReactive 只在顶层做响应式，嵌套对象不被代理，适用于大数据集',
          },
        ]"
        :pagination="false"
        size="small"
      />
    </section>
  </div>
</template>

<style scoped>
.reactivity-index {
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
  line-height: 1.7;
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

/* 核心 API 速览 */
.api-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.api-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.api-item code {
  font-size: 13px;
  color: #1677ff;
  font-weight: 500;
}

.api-item span {
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
  .api-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stage-grid {
    grid-template-columns: 1fr;
  }
}
</style>
