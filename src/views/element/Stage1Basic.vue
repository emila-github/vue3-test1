<script setup lang="ts">
/**
 * Element Plus Stage 1: 快速上手与基础组件
 * 演示安装配置、布局、按钮、图标、链接等基础用法
 */
import { ref, shallowRef } from 'vue'
import { message } from 'ant-design-vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// ============ 基础状态 ============
const btnLoading = ref(false)
const btnDisabled = ref(false)
const iconType = ref('Edit')

// ============ 布局容器演示 ============
const layoutType = ref<'classic' | 'sidebar'>('classic')

// ============ 按钮演示 ============
function handleClick(type: string) {
  addLog(`点击了 ${type} 按钮`)
}

function simulateLoading() {
  btnLoading.value = true
  addLog('开始加载...')
  setTimeout(() => {
    btnLoading.value = false
    addLog('加载完成！')
  }, 2000)
}

// ============ 代码示例字符串 ============
const installCode = `// pnpm add element-plus @element-plus/icons-vue

// main.ts - 全量引入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus, { locale: zhCn })

// 或按需引入（推荐使用 unplugin-vue-components）
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
Components({ resolvers: [ElementPlusResolver()] })`

const buttonCode = `<el-button type="primary">主要按钮</el-button>
<el-button plain>朴素按钮</el-button>
<el-button round>圆角按钮</el-button>
<el-button :loading="loading">加载中</el-button>
<el-button :disabled="disabled">禁用</el-button>
<el-button @click="handleClick">点击事件</el-button>`

const linkTextCode = `<el-link type="primary" href="https://..." target="_blank">官网</el-link>
<el-text type="danger" tag="del">删除线文本</el-text>
<el-text tag="mark">高亮文本</el-text>`

const containerCode = `<el-container>
  <el-header>Header</el-header>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-main>Main Content</el-main>
  </el-container>
  <el-footer>Footer</el-footer>
</el-container>`
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 1：快速上手与基础组件</h1>
      <p>掌握 Element Plus 安装配置、布局容器、按钮、图标、链接等基础组件的使用。</p>
    </header>

    <!-- 1.1 安装与引入 -->
    <section class="card">
      <h2>1.1 安装与配置</h2>
      <pre class="code-block">{{ installCode }}</pre>
      <p class="note">Element Plus 也支持按需导入，通过 unplugin-vue-components 自动完成。</p>
    </section>

    <!-- 1.2 按钮组件 -->
    <section class="card">
      <h2>1.2 Button 按钮</h2>
      <div class="demo-row">
        <el-button type="primary" @click="handleClick('主要')">主要按钮</el-button>
        <el-button type="success" @click="handleClick('成功')">成功按钮</el-button>
        <el-button type="warning" @click="handleClick('警告')">警告按钮</el-button>
        <el-button type="danger" @click="handleClick('危险')">危险按钮</el-button>
        <el-button type="info" @click="handleClick('信息')">信息按钮</el-button>
      </div>
      <div class="demo-row">
        <el-button plain>朴素按钮</el-button>
        <el-button round>圆角按钮</el-button>
        <el-button circle :icon="ElIconEdit" />
        <el-button :loading="btnLoading" type="primary" @click="simulateLoading">
          点击加载
        </el-button>
        <el-button :disabled="btnDisabled" @click="btnDisabled = !btnDisabled">
          切换禁用
        </el-button>
      </div>
      <pre class="code-block">{{ buttonCode }}</pre>
    </section>

    <!-- 1.3 链接与文本 -->
    <section class="card">
      <h2>1.3 Link 链接 &amp; Text 文本</h2>
      <div class="demo-row">
        <el-link href="https://element-plus.org" target="_blank" type="primary">Element Plus 官网</el-link>
        <el-link type="success" :underline="false">无下划线</el-link>
        <el-link type="warning" disabled>禁用链接</el-link>
      </div>
      <div class="demo-row">
        <el-text type="primary">主要文本</el-text>
        <el-text type="success">成功文本</el-text>
        <el-text type="danger">危险文本</el-text>
        <el-text tag="del">删除线文本</el-text>
        <el-text tag="mark">高亮文本</el-text>
      </div>
      <pre class="code-block">{{ linkTextCode }}</pre>
    </section>

    <!-- 1.4 布局容器 -->
    <section class="card">
      <h2>1.4 Container 布局容器</h2>
      <p class="note">Element Plus 提供 el-container、el-header、el-aside、el-main、el-footer 五个容器组件。</p>
      <div class="layout-demo">
        <el-container>
          <el-header style="background:#409eff;color:#fff;padding:0 20px;line-height:60px;">
            Header — 60px 高
          </el-header>
          <el-container>
            <el-aside width="200px" style="background:#e6f7ff;padding:20px;min-height:120px;">
              Aside — 200px 宽
            </el-aside>
            <el-main style="background:#f0f9ff;padding:20px;">
              Main — 主内容区
            </el-main>
          </el-container>
          <el-footer style="background:#f5f7fa;line-height:40px;text-align:center;color:#999;">
            Footer — 40px 高
          </el-footer>
        </el-container>
      </div>
      <pre class="code-block">{{ containerCode }}</pre>
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
.stage-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}
.page-header {
  text-align: center;
  margin-bottom: 24px;
}
.page-header h1 { font-size: 24px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; }

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; padding-bottom: 6px; border-bottom: 1px solid #f0f0f0; }

.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre;
}

.note {
  font-size: 13px;
  color: #999;
  margin: 8px 0;
}

.layout-demo { margin-bottom: 16px; border-radius: 8px; overflow: hidden; }

.log-area {
  max-height: 200px;
  overflow-y: auto;
  background: #fafafa;
  border-radius: 8px;
  padding: 12px;
}
.log-empty { color: #ccc; text-align: center; padding: 20px; }
.log-item { font-size: 12px; color: #666; padding: 3px 0; font-family: monospace; border-bottom: 1px dashed #f0f0f0; }
</style>
