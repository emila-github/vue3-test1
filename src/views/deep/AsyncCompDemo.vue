<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
import ErrorDisplay from './ErrorDisplay.vue'

// 定义异步组件
const AsyncCard = defineAsyncComponent({
  loader: () => {
    // 模拟加载延迟
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(import('./AsyncCard.vue'))
      }, 1500)
    })
  },
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 300,   // 300ms 后才显示 loading
  timeout: 5000, // 5 秒超时
})

const showAsync = ref(false)

function loadComponent() {
  showAsync.value = true
}
</script>

<template>
  <div class="section">
    <h2>异步组件</h2>

    <!-- 触发加载 -->
    <div class="panel">
      <h4>1. defineAsyncComponent 异步加载</h4>
      <p class="hint">点击按钮后，模拟 1.5 秒加载延迟</p>
      <button v-if="!showAsync" @click="loadComponent" class="load-btn">
        加载异步组件
      </button>

      <!-- 使用 Suspense 包裹 -->
      <Suspense v-if="showAsync">
        <template #default>
          <AsyncCard title="异步加载的卡片" />
        </template>
        <template #fallback>
          <div class="fallback">
            <div class="spinner"></div>
            <p>Suspense fallback 加载中...</p>
          </div>
        </template>
      </Suspense>
    </div>

    <!-- 路由懒加载说明 -->
    <div class="panel">
      <h4>2. 路由懒加载</h4>
      <pre><code>const router = createRouter({
  routes: [
    {
      path: '/dashboard',
      // 路由级别的异步加载
      component: () => import('./views/Dashboard.vue')
    }
  ]
})</code></pre>
      <p class="hint">项目中的所有示例页面都是通过路由懒加载实现的</p>
    </div>

    <div class="info">
      <h4>异步组件要点：</h4>
      <ul>
        <li><code>defineAsyncComponent(() => import(...))</code> 定义异步组件</li>
        <li><code>loadingComponent</code> 加载中显示的组件</li>
        <li><code>errorComponent</code> 加载失败显示的组件</li>
        <li><code>delay</code> 延迟显示 loading（避免闪烁）</li>
        <li><code>timeout</code> 超时时间</li>
        <li><code>&lt;Suspense&gt;</code> 提供声明式异步依赖管理</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #fa8c16;
}

h2 { margin: 0 0 16px 0; color: #333; }
h4 { margin: 0 0 8px 0; color: #555; }

.panel {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #f0f0f0;
}

.hint { color: #999; font-size: 13px; margin-top: 4px; }

.load-btn {
  padding: 10px 24px;
  background: #fa8c16;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
}

.load-btn:hover { opacity: 0.9; }

.fallback {
  text-align: center;
  padding: 30px;
  color: #999;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top-color: #fa8c16;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

pre {
  background: #1e1e1e;
  color: #a0d911;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 13px;
  margin: 8px 0;
}

.info {
  background: #fff7e6;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #555;
}

.info ul { margin: 4px 0; padding-left: 20px; }
.info li { margin: 4px 0; }
.info code {
  background: #ffe7ba;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  color: #d46b08;
}
</style>
