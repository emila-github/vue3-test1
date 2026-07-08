<script setup lang="ts">
/**
 * Stage 2: Vue I18n 进阶功能
 * 演示复数、日期/数字格式化、组件插值、动态消息
 */
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'

const { t, d, n, locale } = useI18n()

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(msg)
}

// ============ 复数演示 ============
const appleCount = ref(0)
const carCount = ref(1)

// ============ 日期格式化 ============
const sampleDate = ref(new Date())
const sampleUnix = 1700000000000

// ============ 数字格式化 ============
const priceInput = ref(1234567.89)
const percentInput = ref(0.856)

// ============ 列表格式化 ============
const selectedFruits = ref<string[]>(['apple'])

function toggleFruit(fruit: string) {
  const idx = selectedFruits.value.indexOf(fruit)
  if (idx >= 0) {
    selectedFruits.value.splice(idx, 1)
  } else {
    selectedFruits.value.push(fruit)
  }
  addLog(`水果列表：${selectedFruits.value.join(', ')}`)
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 2：进阶功能与最佳实践</h1>
      <p>掌握复数、日期/数字格式化、组件插值、动态消息、懒加载语言包。</p>
    </header>

    <!-- 2.1 复数 -->
    <section class="card">
      <h2>2.1 复数（pluralization）</h2>
      <p>vue-i18n 使用 <code>|</code> 管道符分隔单复数形式。</p>
      <pre class="code-block">
// 语言包
{
  "apple": "没有苹果 | 1个苹果 | {count}个苹果",
  "car": "没有车 | 1辆车 | {count}辆车"
}

// 使用
t('apple', 0)    // "没有苹果"
t('apple', 1)    // "1个苹果"
t('apple', 5)    // "5个苹果"</pre>
      <div class="demo-box">
        <div class="plural-row">
          <span>苹果：{{ appleCount }}</span>
          <a-slider v-model:value="appleCount" :min="0" :max="10" style="width: 200px" />
          <strong class="primary">{{ t('apple', appleCount) }}</strong>
        </div>
        <div class="plural-row">
          <span>汽车：{{ carCount }}</span>
          <a-slider v-model:value="carCount" :min="0" :max="10" style="width: 200px" />
          <strong class="primary">{{ t('car', carCount) }}</strong>
        </div>
      </div>
    </section>

    <!-- 2.2 日期格式化 -->
    <section class="card">
      <h2>2.2 日期格式化（$d / d）</h2>
      <p>根据当前 locale 自动应用对应语言的日期格式。</p>
      <pre class="code-block">// Composition API
import { useI18n } from 'vue-i18n'
const { d } = useI18n()

d(new Date(), 'long')    // 2025年1月15日
d(new Date(), 'short')   // 2025/1/15</pre>
      <div class="demo-box">
        <div class="tl-item">
          <span class="tl-label">long：</span>
          <strong>{{ d(sampleDate, 'long') }}</strong>
        </div>
        <div class="tl-item">
          <span class="tl-label">short：</span>
          <strong>{{ d(sampleDate, 'short') }}</strong>
        </div>
        <div class="tl-item">
          <span class="tl-label">full：</span>
          <strong>{{ d(sampleUnix, 'long') }}</strong>
        </div>
      </div>
    </section>

    <!-- 2.3 数字格式化 -->
    <section class="card">
      <h2>2.3 数字格式化（$n / n）</h2>
      <p>自动根据 locale 格式化数字（千分位、货币、百分比）。</p>
      <pre class="code-block">n(1234567.89, 'currency')    // ¥1,234,567.89 (zh-CN)
n(0.856, 'percent')          // 86%</pre>
      <div class="demo-box">
        <div class="tl-item">
          <span class="tl-label">金额 (currency)：</span>
          <strong>{{ n(priceInput, 'currency') }}</strong>
        </div>
        <div class="tl-item">
          <span class="tl-label">百分比 (percent)：</span>
          <strong>{{ n(percentInput, 'percent') }}</strong>
        </div>
        <div class="tl-item">
          <span class="tl-label">整数 (decimal)：</span>
          <strong>{{ n(1234567, 'decimal') }}</strong>
        </div>
      </div>
    </section>

    <!-- 2.4 列表 -->
    <section class="card">
      <h2>2.4 列表选择与条件消息</h2>
      <pre class="code-block">// 语言包
{
  "fruit": {
    "selected": "已选择 {list}",
    "none": "未选择任何水果"
  }
}</pre>
      <div class="demo-box">
        <div class="fruit-grid">
          <a-checkbox
            v-for="fruit in ['apple', 'banana', 'orange', 'grape']"
            :key="fruit"
            :checked="selectedFruits.includes(fruit)"
            @change="() => toggleFruit(fruit)"
          >
            {{ t(`fruit.${fruit}`) }}
          </a-checkbox>
        </div>
        <p class="mt8" style="font-size: 15px;">
          <strong v-if="selectedFruits.length === 0">{{ t('fruit.none') }}</strong>
          <strong v-else>{{ t('fruit.selected', { list: selectedFruits.map(f => t(`fruit.${f}`)).join('、') }) }}</strong>
        </p>
      </div>
    </section>

    <!-- 2.5 组件插值 i18n-t -->
    <section class="card">
      <h2>2.5 i18n-t 组件插值</h2>
      <p>当消息中需要嵌入 HTML 或 Vue 组件时使用。</p>
      <pre class="code-block">// 语言包
"terms": "点击即表示同意我们的{0}和{1}"

// 模板使用 i18n-t 组件
&lt;i18n-t keypath="terms" tag="p"&gt;
  &lt;a href="/terms"&gt;{{ t('terms.service') }}&lt;/a&gt;
  &lt;a href="/privacy"&gt;{{ t('terms.privacy') }}&lt;/a&gt;
&lt;/i18n-t&gt;</pre>
      <div class="demo-box">
        <i18n-t keypath="terms.prompt" tag="p">
          <template #terms>
            <a href="javascript:void(0)" style="color: #1677ff">
              {{ t('terms.service') }}
            </a>
          </template>
          <template #privacy>
            <a href="javascript:void(0)" style="color: #1677ff">
              {{ t('terms.privacy') }}
            </a>
          </template>
        </i18n-t>
      </div>
    </section>

    <!-- 2.6 懒加载 -->
    <section class="card">
      <h2>2.6 懒加载语言包</h2>
      <pre class="code-block">
// 动态加载语言包（按需加载，减小初始包体积）
async function loadLocaleMessages(locale: string) {
  const messages = await import(`./locales/${locale}.json`)
  i18n.global.setLocaleMessage(locale, messages.default)
  i18n.global.locale.value = locale
}</pre>
      <div class="tip-box">
        <strong>最佳实践：</strong>
        <ul>
          <li>将不同语言包放在不同文件中（如 <code>locales/zh-CN.json</code>）</li>
          <li>初始只加载默认语言，其他语言懒加载</li>
          <li>使用 <code>setLocaleMessage()</code> 动态注册新语言包</li>
        </ul>
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

.primary { color: #10b981; }
.mt8 { margin-top: 8px; }

.tl-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}
.tl-label { color: #999; white-space: nowrap; font-size: 13px; }

.plural-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 14px;
}

.fruit-grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.tip-box {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #389e0d;
}
.tip-box strong { display: block; margin-bottom: 4px; }
.tip-box ul { margin: 4px 0 0; padding-left: 18px; }
.tip-box li { margin-bottom: 2px; }

.log-area { max-height: 200px; overflow-y: auto; font-size: 13px; }
.log-item { padding: 4px 0; color: #555; border-bottom: 1px dashed #f0f0f0; }
.log-empty { color: #ccc; text-align: center; padding: 20px; }

@media (max-width: 640px) { .stage-page { padding: 16px; } }
</style>
