<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import SuspenseLoading from './SuspenseLoading.vue'
import SuspenseError from './SuspenseError.vue'

// 模拟加载延迟
const loadDelay = ref(1500)

const AsyncCard = defineAsyncComponent({
  loader: () =>
    new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve(import('./SuspenseCard.vue'))
      }, loadDelay.value)
    }),
  loadingComponent: SuspenseLoading,
  errorComponent: SuspenseError,
  delay: 200,
  timeout: 5000,
})

// 触发重新加载
const reloadKey = ref(0)
function reload() {
  reloadKey.value++
}

const error = ref<Error | null>(null)
</script>

<template>
  <div>
    <!-- 基本 Suspense -->
    <section class="demo-section">
      <h2>1. 基本用法 — 异步组件 + Suspense</h2>
      <div class="controls">
        <button @click="reload" class="demo-btn">重新加载</button>
        <span class="delay-hint">
          模拟延迟: {{ loadDelay }}ms
          <input
            type="range"
            v-model.number="loadDelay"
            min="500"
            max="3000"
            step="500"
          />
        </span>
      </div>

      <Suspense>
        <template #default>
          <AsyncCard :key="reloadKey" />
        </template>
        <template #fallback>
          <div class="fallback-box">
            <div class="spinner"></div>
            <p>正在加载异步组件...</p>
          </div>
        </template>
      </Suspense>
    </section>

    <!-- Suspense 事件 -->
    <section class="demo-section">
      <h2>2. Suspense 事件</h2>
      <pre class="code-hint">&lt;Suspense
  @pending="onPending"
  @resolve="onResolve"
  @fallback="onFallback"
&gt;
  &lt;template #default&gt;
    &lt;AsyncComponent /&gt;
  &lt;/template&gt;
  &lt;template #fallback&gt;
    &lt;Loading /&gt;
  &lt;/template&gt;
&lt;/Suspense&gt;</pre>
      <p class="hint">
        @pending: 进入挂起状态 | @resolve: default 插槽完成加载 | @fallback: 显示 fallback
      </p>
    </section>

    <!-- 错误处理 -->
    <section class="demo-section">
      <h2>3. 错误处理</h2>
      <pre class="code-hint">// defineAsyncComponent 配置错误处理
const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,          // loading 显示延迟
  timeout: 3000,       // 超时时间
  onError(error, retry, fail, attempts) {
    if (attempts &lt;= 3) retry()  // 自动重试
    else fail()
  }
})</pre>
      <p class="hint">
        Suspense 本身不处理错误，需配合 defineAsyncComponent 的 onError 或 onErrorCaptured
      </p>
    </section>

    <!-- 与路由懒加载结合 -->
    <section class="demo-section">
      <h2>4. 路由懒加载 + Suspense</h2>
      <pre class="code-hint">// router/index.ts
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue')
  }
]

// App.vue
&lt;Suspense&gt;
  &lt;template #default&gt;
    &lt;router-view /&gt;
  &lt;/template&gt;
  &lt;template #fallback&gt;
    &lt;PageLoading /&gt;
  &lt;/template&gt;
&lt;/Suspense&gt;</pre>
    </section>
  </div>
</template>

<style scoped>
.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #eb2f96;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 8px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.demo-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  transition: all 0.2s;
}

.demo-btn:hover {
  border-color: #eb2f96;
  color: #eb2f96;
}

.delay-hint {
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
}

.delay-hint input[type='range'] {
  width: 100px;
}

/* Fallback */
.fallback-box {
  padding: 30px;
  text-align: center;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
}

.fallback-box p {
  margin: 12px 0 0;
  color: #999;
}

.spinner {
  width: 32px;
  height: 32px;
  margin: 0 auto;
  border: 3px solid #eee;
  border-top-color: #eb2f96;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 代码块 */
.code-hint {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 14px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin: 0;
}
</style>
