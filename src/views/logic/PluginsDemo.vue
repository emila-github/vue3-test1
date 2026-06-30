<script setup lang="ts">
import { ref, getCurrentInstance, inject } from 'vue'

// ====== 模拟插件注入的数据 ======
// 假设 main.js 中已通过 app.use(myPlugin, {...}) 注入
// 这里直接通过 inject 获取，或通过全局属性访问
const instance = getCurrentInstance()

// 模拟插件提供的 i18n
const mockI18n = {
  locale: ref<'zh' | 'en'>('zh'),
  messages: {
    zh: { hello: '你好，世界！', welcome: '欢迎学习 Vue 3', goodbye: '再见' },
    en: { hello: 'Hello, World!', welcome: 'Welcome to Vue 3', goodbye: 'Goodbye' },
  },
}

// 模拟全局 $t 方法
function $t(key: string) {
  return (mockI18n.messages[mockI18n.locale.value] as Record<string, string>)[key] || key
}

function toggleLocale() {
  mockI18n.locale.value = mockI18n.locale.value === 'zh' ? 'en' : 'zh'
}

// 模拟全局 loading
const loadingVisible = ref(false)
const loadingText = ref('加载中...')

function simulateLoading() {
  loadingVisible.value = true
  setTimeout(() => {
    loadingVisible.value = false
  }, 2000)
}

// 插件代码展示
const pluginCode = `// plugins/i18n.js
export default {
  install(app, options) {
    // 1. 注册全局组件
    app.component('TranslatedText', { ... })

    // 2. 提供全局属性
    app.config.globalProperties.$t = (key) => {
      return options.messages[options.locale]?.[key] || key
    }

    // 3. 提供依赖注入
    app.provide('i18n', options)

    // 4. 注册全局指令
    app.directive('translate', { ... })
  }
}

// main.js
app.use(i18n, {
  locale: 'zh',
  messages: { zh: {...}, en: {...} }
})`
</script>

<template>
  <div>
    <!-- 插件介绍 -->
    <section class="demo-section">
      <h2>什么是插件？</h2>
      <p>插件是能为 Vue 应用添加全局功能的工具，通过 <code>app.use()</code> 安装。</p>
      <p>一个插件可以：注册全局组件、提供全局属性/方法、注入依赖、注册全局指令。</p>
    </section>

    <!-- 插件代码 -->
    <section class="demo-section">
      <h2>插件示例代码</h2>
      <pre class="code-block">{{ pluginCode }}</pre>
    </section>

    <!-- i18n 效果演示 -->
    <section class="demo-section">
      <h2>i18n 插件效果演示</h2>
      <div class="i18n-demo">
        <button @click="toggleLocale" class="demo-btn">
          切换语言: {{ mockI18n.locale.value === 'zh' ? '中文' : 'English' }}
        </button>
        <div class="i18n-cards">
          <div class="i18n-card">
            <span class="key">$t('hello')</span>
            <span class="value">{{ $t('hello') }}</span>
          </div>
          <div class="i18n-card">
            <span class="key">$t('welcome')</span>
            <span class="value">{{ $t('welcome') }}</span>
          </div>
          <div class="i18n-card">
            <span class="key">$t('goodbye')</span>
            <span class="value">{{ $t('goodbye') }}</span>
          </div>
        </div>
      </div>
      <p class="hint">通过 app.config.globalProperties.$t 提供全局翻译方法</p>
    </section>

    <!-- Loading 插件演示 -->
    <section class="demo-section">
      <h2>全局 Loading 插件演示</h2>
      <button @click="simulateLoading" class="demo-btn">显示 Loading (2s)</button>

      <!-- 模拟全屏 Loading -->
      <Teleport to="body">
        <div v-if="loadingVisible" class="loading-overlay">
          <div class="loading-box">
            <div class="spinner"></div>
            <p>{{ loadingText }}</p>
          </div>
        </div>
      </Teleport>
    </section>

    <!-- 插件能做什么 -->
    <section class="demo-section">
      <h2>插件的四大能力</h2>
      <div class="plugin-features">
        <div class="feature-item">
          <span class="feature-num">1</span>
          <div>
            <strong>全局组件</strong>
            <p>app.component() 注册</p>
          </div>
        </div>
        <div class="feature-item">
          <span class="feature-num">2</span>
          <div>
            <strong>全局属性</strong>
            <p>app.config.globalProperties</p>
          </div>
        </div>
        <div class="feature-item">
          <span class="feature-num">3</span>
          <div>
            <strong>依赖注入</strong>
            <p>app.provide() 注入</p>
          </div>
        </div>
        <div class="feature-item">
          <span class="feature-num">4</span>
          <div>
            <strong>全局指令</strong>
            <p>app.directive() 注册</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #2f54eb;
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

.demo-btn {
  padding: 8px 18px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  transition: all 0.2s;
}

.demo-btn:hover {
  border-color: #2f54eb;
  color: #2f54eb;
}

code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}

/* 代码块 */
.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin: 0;
}

/* i18n */
.i18n-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.i18n-cards {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.i18n-card {
  flex: 1;
  min-width: 180px;
  padding: 16px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.i18n-card .key {
  font-size: 12px;
  color: #999;
  font-family: monospace;
}

.i18n-card .value {
  font-size: 18px;
  font-weight: 600;
  color: #2f54eb;
}

/* Loading */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-box {
  background: #fff;
  padding: 30px 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.loading-box p {
  margin: 12px 0 0;
  color: #666;
}

.spinner {
  width: 36px;
  height: 36px;
  margin: 0 auto;
  border: 3px solid #eee;
  border-top-color: #2f54eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 四大能力 */
.plugin-features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.feature-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #eee;
}

.feature-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #2f54eb;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  flex-shrink: 0;
}

.feature-item strong {
  display: block;
  font-size: 14px;
  color: #333;
}

.feature-item p {
  margin: 2px 0 0;
  font-size: 12px;
  color: #999;
}
</style>
