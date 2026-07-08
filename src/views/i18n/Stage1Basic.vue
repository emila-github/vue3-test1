<script setup lang="ts">
/**
 * Stage 1: Vue I18n 基础配置与使用
 * 演示创建 i18n 实例、语言包定义、$t() 翻译、语言切换
 */
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'

const { t, locale } = useI18n()

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(msg)
}

// ============ 语言切换 ============
const currentLocale = computed(() => locale.value)

function switchLang(lang: string) {
  locale.value = lang
  message.success(t('langSwitched', { lang: lang === 'zh-CN' ? '中文' : 'English' }))
  addLog(`切换语言 → ${lang}`)
}

// ============ 产品数据 ============
const productCount = ref(5)
const productNames = ['笔记本电脑', '无线耳机', '机械键盘', '显示器', '鼠标']

// 订单状态
const orderStatuses = ['pending', 'processing', 'shipped', 'delivered'] as const
const selectedStatus = ref<string>('pending')
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 1：Vue I18n 基础配置</h1>
      <p>安装配置 vue-i18n、定义语言包、使用 $t() 翻译、语言切换。</p>
    </header>

    <!-- 1.1 安装配置 -->
    <section class="card">
      <h2>1.1 初始化 i18n 配置</h2>
      <pre class="code-block">
// i18n/index.ts
import { createI18n } from 'vue-i18n'

const messages = {
  'zh-CN': {
    hello: '你好，世界！',
    welcome: '欢迎来到 Vue 3 学习站点',
  },
  'en': {
    hello: 'Hello, World!',
    welcome: 'Welcome to Vue 3 Learning Station',
  },
}

export const i18n = createI18n({
  legacy: false,       // Composition API 模式
  locale: 'zh-CN',     // 默认语言
  fallbackLocale: 'zh-CN',
  messages,
})</pre>
    </section>

    <!-- 1.2 注册到 Vue -->
    <section class="card">
      <h2>1.2 在 main.ts 中注册</h2>
      <pre class="code-block">
// main.ts
import { createApp } from 'vue'
import { i18n } from './i18n'
import App from './App.vue'

const app = createApp(App)
app.use(i18n)  // 👈 注册 i18n
app.mount('#app')</pre>
    </section>

    <!-- 1.3 基本使用 -->
    <section class="card">
      <h2>1.3 在组件中使用翻译</h2>
      <pre class="code-block">
// Composition API
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

// 使用翻译
t('hello')           // "你好，世界！"
t('welcome')         // "欢迎来到 Vue 3 学习站点"

// 切换语言
locale.value = 'en'</pre>
    </section>

    <!-- 1.4 交互演示：语言切换 -->
    <section class="card">
      <h2>1.4 交互演示</h2>
      <div class="demo-box">
        <!-- 语言切换按钮 -->
        <div class="lang-switcher">
          <button
            :class="['lang-btn', { active: currentLocale === 'zh-CN' }]"
            @click="switchLang('zh-CN')"
          >
            🇨🇳 中文
          </button>
          <button
            :class="['lang-btn', { active: currentLocale === 'en' }]"
            @click="switchLang('en')"
          >
            🇺🇸 English
          </button>
        </div>

        <!-- 翻译区域 -->
        <div class="translate-section">
          <div class="tl-item">
            <span class="tl-label">hello：</span>
            <strong class="tl-value">{{ t('hello') }}</strong>
          </div>
          <div class="tl-item">
            <span class="tl-label">welcome：</span>
            <strong class="tl-value">{{ t('welcome') }}</strong>
          </div>
          <div class="tl-item">
            <span class="tl-label">app.title：</span>
            <strong class="tl-value">{{ t('app.title') }}</strong>
          </div>
          <div class="tl-item">
            <span class="tl-label">app.description：</span>
            <strong class="tl-value">{{ t('app.description') }}</strong>
          </div>
        </div>
      </div>
    </section>

    <!-- 1.5 嵌套消息与插值 -->
    <section class="card">
      <h2>1.5 嵌套消息与插值</h2>
      <pre class="code-block">
// 语言包
{
  "user": {
    "greeting": "你好，{name}！",
    "info": "年龄：{age}，城市：{city}"
  }
}

// 使用
t('user.greeting', { name: '张三' })    // "你好，张三！"
t('user.info', { age: 18, city: '深圳' })</pre>
      <div class="demo-box">
        <div class="tl-item">
          <span class="tl-label">user.greeting：</span>
          <strong class="tl-value">{{ t('user.greeting', { name: '张三' }) }}</strong>
        </div>
        <div class="tl-item">
          <span class="tl-label">user.info：</span>
          <strong class="tl-value">{{ t('user.info', { age: 18, city: '深圳' }) }}</strong>
        </div>
      </div>
    </section>

    <!-- 1.6 商品信息 -->
    <section class="card">
      <h2>1.6 实际场景：商品信息</h2>
      <div class="demo-box">
        <p class="tl-item"><strong>{{ t('product.list') }}</strong></p>
        <ul class="product-list">
          <li v-for="(name, i) in productNames" :key="i">
            {{ t('product.item', { id: i + 1, name }) }}
          </li>
        </ul>
        <p class="mt8">{{ t('product.count', productCount) }}</p>
        <div class="btn-row">
          <button class="btn" @click="productCount++">{{ t('product.add') }}</button>
          <button class="btn" @click="productCount--" :disabled="productCount <= 0">{{ t('product.remove') }}</button>
        </div>
      </div>
    </section>

    <!-- 日志 -->
    <section class="card">
      <h2>操作日志</h2>
      <div class="log-area">
        <div v-for="(item, i) in log" :key="i" class="log-item">[{{ i + 1 }}] {{ item }}</div>
        <div v-if="log.length === 0" class="log-empty">暂无操作记录</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.page-header { text-align: center; margin-bottom: 32px; }
.page-header h1 { font-size: 26px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; }

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.card h2 { margin: 0 0 12px; font-size: 18px; color: #333; }
.card p { font-size: 14px; color: #666; line-height: 1.6; margin: 0 0 12px; }

.code-block {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin-bottom: 16px;
  white-space: pre-wrap;
}

.demo-box {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.mt8 { margin-top: 8px; }

.lang-switcher {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.lang-btn {
  padding: 8px 20px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.lang-btn:hover { border-color: #3b82f6; }
.lang-btn.active { background: #3b82f6; color: #fff; border-color: #3b82f6; }

.translate-section { margin-bottom: 16px; }

.tl-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 15px;
}
.tl-label { color: #999; white-space: nowrap; font-size: 14px; }
.tl-value { color: #3b82f6; font-size: 16px; }

.product-list { margin: 8px 0; padding-left: 18px; }
.product-list li { padding: 3px 0; font-size: 14px; color: #555; }

.btn-row { display: flex; gap: 8px; flex-wrap: wrap; }
.btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn:hover { border-color: #3b82f6; color: #3b82f6; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.log-area { max-height: 200px; overflow-y: auto; font-size: 13px; }
.log-item { padding: 4px 0; color: #555; border-bottom: 1px dashed #f0f0f0; }
.log-empty { color: #ccc; text-align: center; padding: 20px; }

@media (max-width: 640px) { .stage-page { padding: 16px; } }
</style>
