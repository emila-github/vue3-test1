<script setup lang="ts">
/**
 * Element Plus Stage 3: 主题定制与国际化
 * 演示 CSS 变量定制、暗黑模式、国际化、el-config-provider 等
 */
import { ref, computed } from 'vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// ============ 暗黑模式 ============
const isDark = ref(false)

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  addLog(`切换到${isDark.value ? '暗黑' : '明亮'}模式`)
}

// ============ 代码示例字符串 ============
const themeCode = `// 动态修改主题色
document.documentElement.style.setProperty('--el-color-primary', '#409eff')

// 暗黑模式：给 html 添加 class="dark"
document.documentElement.classList.toggle('dark')

// 也可以 Import 暗黑主题样式：
// import 'element-plus/theme-chalk/dark/css-vars.css'`

const providerCode = `// App.vue 中包裹 el-config-provider
<el-config-provider :size="size" :locale="locale">
  <router-view />
</el-config-provider>

import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'`

const messageCode = `import { ElMessage, ElNotification } from 'element-plus'

ElMessage.success('操作成功')
ElMessage.warning('警告信息')
ElMessage.error('操作失败')

ElNotification({
  title: '通知',
  message: '这是一条通知消息',
  type: 'success',
  duration: 3000,
})`

const cssCode = `/* 自定义 CSS 变量覆盖示例 */
:root {
  --el-color-primary: #409eff;
  --el-border-radius-base: 6px;
  --el-font-size-base: 14px;
}

.dark {
  --el-bg-color: #141414;
  --el-text-color-primary: #e5eaf3;
}`

// ============ 主题色动态切换 ============
const themeColor = ref('#409eff')
const themeOptions = [
  { label: '默认蓝', value: '#409eff' },
  { label: '优雅绿', value: '#67c23a' },
  { label: '温暖橙', value: '#e6a23c' },
  { label: '危险红', value: '#f56c6c' },
  { label: '神秘紫', value: '#8b5cf6' },
]

function changeTheme(color: string) {
  themeColor.value = color
  document.documentElement.style.setProperty('--el-color-primary', color)
  addLog(`主题色切换为 ${color}`)
}

// ============ 尺寸切换 ============
const compSize = ref<'large' | 'default' | 'small'>('default')

// ============ 国际化 ============
const currentLocale = ref('zhCn')
const localeLabel = computed(() => (currentLocale.value === 'zhCn' ? '中文' : 'English'))

function toggleLocale() {
  currentLocale.value = currentLocale.value === 'zhCn' ? 'en' : 'zhCn'
  addLog(`语言切换为 ${currentLocale.value === 'zhCn' ? '中文' : 'English'}`)
}

// ============ Message 弹框 ============
const msgText = ref('这是一条消息')
function showMsg(type: 'success' | 'warning' | 'error' | 'info') {
  ElMessage[type](msgText.value)
  addLog(`显示 ${type} 消息：${msgText.value}`)
}

// ============ Notification 通知 ============
function showNotify() {
  ElNotification({
    title: '通知标题',
    message: '这是一条来自 Element Plus 的通知消息',
    type: 'success',
    duration: 3000,
  })
  addLog('显示通知')
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 3：主题定制与进阶</h1>
      <p>掌握 CSS 变量主题定制、暗黑模式、国际化、el-config-provider 等进阶特性。</p>
    </header>

    <!-- 3.1 主题色切换 -->
    <section class="card">
      <h2>3.1 CSS 变量主题定制</h2>
      <p class="note">Element Plus 使用 CSS 变量实现主题定制，可通过 JS 动态修改。</p>
      <div class="demo-row">
        <el-radio-group v-model="themeColor" @change="changeTheme">
          <el-radio-button v-for="t in themeOptions" :key="t.value" :value="t.value">
            {{ t.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="demo-row" style="margin-top:12px">
        <el-button type="primary">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-tag>标签</el-tag>
        <el-switch v-model="isDark" active-text="暗黑" @change="toggleDark" />
      </div>
      <pre class="code-block">{{ themeCode }}</pre>
    </section>

    <!-- 3.2 尺寸控制 -->
    <section class="card">
      <h2>3.2 el-config-provider 全局配置</h2>
      <div class="demo-row">
        <span style="margin-right:8px">组件尺寸：</span>
        <el-radio-group v-model="compSize">
          <el-radio-button value="large">Large</el-radio-button>
          <el-radio-button value="default">Default</el-radio-button>
          <el-radio-button value="small">Small</el-radio-button>
        </el-radio-group>
        <span style="margin-left:16px;margin-right:8px">语言：</span>
        <el-button @click="toggleLocale">{{ localeLabel }}</el-button>
      </div>
      <!-- 注意：实际 el-config-provider 应包裹在 App 层级，此处仅做演示说明 -->
      <pre class="code-block">{{ providerCode }}</pre>
    </section>

    <!-- 3.3 Message / Notification -->
    <section class="card">
      <h2>3.3 Message &amp; Notification</h2>
      <div class="demo-row" style="align-items:flex-end">
        <el-input v-model="msgText" placeholder="输入消息内容" style="width:200px" />
        <el-button @click="showMsg('success')">成功</el-button>
        <el-button @click="showMsg('warning')">警告</el-button>
        <el-button @click="showMsg('error')">错误</el-button>
        <el-button @click="showMsg('info')">提示</el-button>
      </div>
      <div class="demo-row" style="margin-top:8px">
        <el-button type="primary" @click="showNotify">显示通知 (Notification)</el-button>
      </div>
      <pre class="code-block">{{ messageCode }}</pre>
    </section>

    <!-- 3.4 自定义主题工具 -->
    <section class="card">
      <h2>3.4 主题定制工具</h2>
      <ul class="tool-list">
        <li><strong>官方主题编辑器</strong>：<el-link href="https://element-plus.org/zh-CN/guide/theming.html" target="_blank" type="primary">在线生成自定义主题</el-link>，下载 CSS 替换即可</li>
        <li><strong>SCSS 变量覆盖</strong>：覆盖 <code>$--el-color-primary</code> 等 SCSS 变量后重新编译</li>
        <li><strong>CSS 变量方案（推荐）</strong>：运行时动态修改 CSS 变量，支持在线切换</li>
        <li><strong>暗黑模式</strong>：`element-plus/theme-chalk/dark/css-vars.css` 提供完整暗黑变量</li>
      </ul>
      <pre class="code-block">{{ cssCode }}</pre>
    </section>

    <!-- 操作日志 -->
    <section class="card">
      <h2>操作日志</h2>
      <div class="log-area">
        <div v-if="log.length === 0" class="log-empty">暂无操作记录</div>
        <div v-for="(item, i) in log" :key="i" class="log-item">{{ item }}</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page { max-width: 960px; margin: 0 auto; padding: 24px; }
.page-header { text-align: center; margin-bottom: 24px; }
.page-header h1 { font-size: 24px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; }
.card { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; padding-bottom: 6px; border-bottom: 1px solid #f0f0f0; }
.demo-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.note { font-size: 13px; color: #999; margin: 8px 0; }
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; font-size: 13px; line-height: 1.6; overflow-x: auto; white-space: pre; margin-top: 12px; }
.tool-list { padding: 0 0 0 20px; }
.tool-list li { padding: 6px 0; font-size: 14px; color: #555; line-height: 1.6; }
.log-area { max-height: 200px; overflow-y: auto; background: #fafafa; border-radius: 8px; padding: 12px; }
.log-empty { color: #ccc; text-align: center; padding: 20px; }
.log-item { font-size: 12px; color: #666; padding: 3px 0; font-family: monospace; border-bottom: 1px dashed #f0f0f0; }
</style>
