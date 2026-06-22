<script setup lang="ts">
/**
 * 阶段四：主题定制与样式隔离
 * 演示 CSS-in-JS 动态主题切换、主题色修改
 */
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { BgColorsOutlined, CheckOutlined } from '@ant-design/icons-vue'

// ===== 动态主题色 =====
const themeColors = [
  { name: '拂晓蓝（默认）', color: '#1677ff' },
  { name: '极客蓝', color: '#2f54eb' },
  { name: '日暮橙', color: '#fa541c' },
  { name: '极光绿', color: '#52c41a' },
  { name: '酱紫', color: '#722ed1' },
  { name: '薄暮红', color: '#f5222d' },
  { name: '拂晓青', color: '#13c2c2' },
]

const currentColor = ref('#1677ff')

function setThemeColor(color: string) {
  currentColor.value = color
  message.success(`主题色已切换为 ${color}`)
}

// 注入全局 CSS 变量模拟主题切换（4.x CSS-in-JS 运行时方案）
const rootStyle = computed(() => ({
  '--ant-primary-color': currentColor.value,
  '--ant-primary-color-hover': currentColor.value + 'cc',
}))

// ===== 自定义 CSS-in-JS 示例 =====
// 4.x 通过 createTheme 或 AppConfigProvider 注入 token
</script>

<template>
  <div class="stage-page">
    <h1>阶段四：主题定制与样式隔离</h1>
    <p class="subtitle">
      Ant Design Vue 4.x 弃用 Less，采用 <strong>CSS-in-JS</strong>（基于
      <code>@ant-design/cssinjs</code>），支持运行时动态切换主题色。
    </p>

    <!-- 主题色切换 -->
    <section class="card">
      <h2>4.1 动态主题色切换</h2>
      <p>
        通过 <code>ConfigProvider</code> 的 <code>theme.token.colorPrimary</code>
        即可运行时修改全局主题色，无需 less-loader 和重新编译。
      </p>

      <div class="theme-grid">
        <div
          v-for="item in themeColors"
          :key="item.color"
          class="theme-item"
          :class="{ active: currentColor === item.color }"
          :style="{ borderColor: currentColor === item.color ? item.color : '#e0e0e0' }"
          @click="setThemeColor(item.color)"
        >
          <div class="theme-swatch" :style="{ background: item.color }">
            <CheckOutlined v-if="currentColor === item.color" style="color: #fff; font-size: 16px" />
          </div>
          <span class="theme-name">{{ item.name }}</span>
          <code class="theme-hex">{{ item.color }}</code>
        </div>
      </div>
    </section>

    <!-- ConfigProvider 示例代码 -->
    <section class="card">
      <h2>4.2 ConfigProvider 全局配置</h2>

      <div class="code-preview">
        <pre class="code-sm">// main.ts — 全局主题配置
import { createApp } from 'vue'
import Antd from 'ant-design-vue'

const app = createApp(App)
app.use(Antd)

// 方式一：ConfigProvider 包裹根组件
&lt;a-config-provider
  :theme="{
    token: {
      colorPrimary: '#52c41a',
      borderRadius: 6,
      fontSize: 14,
    },
  }"
&gt;
  &lt;App /&gt;
&lt;/a-config-provider&gt;

// 方式二：使用 @ant-design/colors 生成色板
// import { generate } from '@ant-design/colors'
// const palette = generate('#52c41a')</pre>
      </div>
    </section>

    <!-- 样式隔离 -->
    <section class="card">
      <h2>4.3 样式隔离最佳实践</h2>

      <div class="info-list">
        <div class="info-item">
          <span class="info-badge">1</span>
          <div>
            <strong>引入 reset.css</strong>
            <p>全局注册时同步引入 <code>ant-design-vue/dist/reset.css</code>，防止浏览器默认样式干扰。</p>
          </div>
        </div>
        <div class="info-item">
          <span class="info-badge">2</span>
          <div>
            <strong>使用 &lt;App&gt; 组件包裹</strong>
            <p>防止全局 CSS 变量污染，<code>&lt;App&gt;</code> 会重置 CSS 作用域。</p>
          </div>
        </div>
        <div class="info-item">
          <span class="info-badge">3</span>
          <div>
            <strong>UnoCSS 语义色</strong>
            <p>推荐使用 UnoCSS 的语义色系统，避免手动覆盖底层样式变量。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 主题预览 -->
    <section class="card">
      <h2>4.4 主题效果预览</h2>
      <p>当前主题色：<code>{{ currentColor }}</code></p>

      <div class="preview-grid">
        <div class="preview-item">
          <a-button type="primary">Primary 按钮</a-button>
        </div>
        <div class="preview-item">
          <a-tag color="processing">进行中</a-tag>
        </div>
        <div class="preview-item">
          <a-switch v-model:checked="true" />
        </div>
        <div class="preview-item">
          <a-progress :percent="72" style="width: 200px" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: #f6f8fa;
  border-radius: 8px;
}

.subtitle code {
  background: #e8e8e8;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.card h2 {
  font-size: 16px;
  color: #333;
  margin: 0 0 8px 0;
}

.card p {
  color: #888;
  font-size: 13px;
  margin: 0 0 12px 0;
}

.card p code {
  background: #f5f5f5;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
}

/* 主题色选择网格 */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.theme-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.theme-item.active {
  background: #f6f8fa;
}

.theme-swatch {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.theme-name {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.theme-hex {
  font-size: 11px;
  color: #999;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
}

/* 代码块 */
.code-preview {
  background: #1e1e1e;
  border-radius: 6px;
  padding: 16px;
  margin-top: 12px;
  overflow-x: auto;
}

.code-sm {
  color: #d4d4d4;
  font-size: 12px;
  line-height: 1.7;
  margin: 0;
  font-family: 'Fira Code', 'Consolas', monospace;
}

/* 信息列表 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.info-badge {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e6f4ff;
  color: #1677ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
}

.info-item strong {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
}

.info-item p {
  margin: 0;
  font-size: 13px;
  color: #888;
}

/* 预览 */
.preview-grid {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 12px;
}

.preview-item {
  display: flex;
  align-items: center;
}
</style>
