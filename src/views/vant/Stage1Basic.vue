<script setup lang="ts">
/**
 * Vant Stage 1: 快速上手与基础组件
 * 演示安装配置、Rem 适配、Button、Icon、Cell、NavBar、Tabbar 等
 */
import { ref } from 'vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

const btnLoading = ref(false)
const activeTab = ref('home')

function simulateLoading() {
  btnLoading.value = true
  addLog('开始加载...')
  setTimeout(() => {
    btnLoading.value = false
    addLog('加载完成')
  }, 2000)
}

function handleTabClick(name: string) {
  activeTab.value = name
  addLog(`切换到标签页：${name}`)
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 1：快速上手与基础组件</h1>
      <p>掌握 Vant 4 安装配置、Rem 适配方案、按钮、图标、单元格、导航栏、标签栏等移动端基础组件。</p>
    </header>

    <!-- 1.1 安装与适配 -->
    <section class="card">
      <h2>1.1 安装与 Rem 适配</h2>
      <pre class="code-block">{{ `// 安装
pnpm add vant

// 按需引入（推荐）
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// Rem 适配（postcss-pxtorem）
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5,    // 设计稿宽度 375px，对应 1rem = 37.5px
      propList: ['*'],
    },
  },
}` }}</pre>
      <p class="note">Vant 默认使用 <code>px</code> 单位，配合 postcss-pxtorem 自动转换为 <code>rem</code>，实现移动端适配。</p>
    </section>

    <!-- 1.2 Button 按钮 -->
    <section class="card">
      <h2>1.2 Button 按钮</h2>
      <div class="demo-row">
        <van-button type="primary">主要按钮</van-button>
        <van-button type="success">成功按钮</van-button>
        <van-button type="danger">危险按钮</van-button>
        <van-button type="warning">警告按钮</van-button>
      </div>
      <div class="demo-row">
        <van-button plain type="primary">朴素按钮</van-button>
        <van-button round type="primary">圆角按钮</van-button>
        <van-button :loading="btnLoading" type="primary" @click="simulateLoading">
          加载按钮
        </van-button>
        <van-button icon="plus" type="primary" />
        <van-button icon="plus" type="primary">带图标</van-button>
      </div>
      <van-divider />
      <div class="demo-row">
        <van-button size="large" type="primary">大号按钮</van-button>
        <van-button size="small" type="primary">小号按钮</van-button>
        <van-button size="mini" type="primary">迷你按钮</van-button>
      </div>
    </section>

    <!-- 1.3 Cell 单元格 -->
    <section class="card">
      <h2>1.3 Cell 单元格 &amp; CellGroup</h2>
      <van-cell-group>
        <van-cell title="用户名" value="张三" />
        <van-cell title="手机号" value="138****8888" label="已绑定" />
        <van-cell title="邮箱" value="zhangsan@example.com" is-link />
        <van-cell title="收货地址" is-link @click="addLog('点击了收货地址')" />
        <van-cell title="设置" is-link>
          <template #icon>
            <van-icon name="setting-o" style="margin-right:8px;font-size:18px" />
          </template>
        </van-cell>
      </van-cell-group>
      <pre class="code-block">{{ `<van-cell-group>
  <van-cell title="用户名" value="张三" />
  <van-cell title="手机号" value="138****" label="已绑定" />
  <van-cell title="设置" is-link>
    <template #icon><van-icon name="setting-o" /></template>
  </van-cell>
</van-cell-group>` }}</pre>
    </section>

    <!-- 1.4 NavBar + Tabbar -->
    <section class="card">
      <h2>1.4 NavBar 导航栏 &amp; Tabbar 标签栏</h2>
      <div style="border:1px solid #ebedf0;border-radius:8px;overflow:hidden">
        <van-nav-bar title="页面标题" left-text="返回" right-text="按钮" @click-left="addLog('点击返回')" @click-right="addLog('点击按钮')" />
        <div style="padding:20px;text-align:center;color:#999;background:#fff">
          页面内容区域
        </div>
        <van-tabbar v-model="activeTab" @change="handleTabClick">
          <van-tabbar-item name="home" icon="home-o">首页</van-tabbar-item>
          <van-tabbar-item name="search" icon="search">搜索</van-tabbar-item>
          <van-tabbar-item name="cart" icon="cart-o" badge="5">购物车</van-tabbar-item>
          <van-tabbar-item name="user" icon="user-o">我的</van-tabbar-item>
        </van-tabbar>
      </div>
      <pre class="code-block">{{ `<van-nav-bar title="标题" left-text="返回" right-text="按钮" />

<van-tabbar v-model="active">
  <van-tabbar-item name="home" icon="home-o">首页</van-tabbar-item>
  <van-tabbar-item name="cart" icon="cart-o" badge="5">购物车</van-tabbar-item>
</van-tabbar>` }}</pre>
    </section>

    <!-- 1.5 Icon -->
    <section class="card">
      <h2>1.5 Icon 图标 &amp; Image 图片</h2>
      <div class="demo-row">
        <van-icon name="chat-o" size="24" color="#1989fa" />
        <van-icon name="star-o" size="24" color="#ee0a24" />
        <van-icon name="fire-o" size="24" color="#ff976a" />
        <van-icon name="like-o" size="24" color="#07c160" />
        <van-icon name="smile-o" size="24" color="#ffd700" />
      </div>
      <div class="demo-row" style="margin-top:12px">
        <van-icon name="chat-o" badge="99+" size="28" color="#1989fa" />
        <van-icon name="cart-o" badge="5" size="28" />
        <van-icon name="chat-o" dot size="28" />
      </div>
      <pre class="code-block">{{ `<van-icon name="chat-o" size="24" color="#1989fa" />
<van-icon name="chat-o" badge="9" dot />
<van-icon name="cart-o" badge="5" />

// Image 支持懒加载、圆角、占位图
<van-image width="100" height="100" src="..." round />
<van-image width="100" height="100" src="...">
  <template #loading>加载中...</template>
</van-image>` }}</pre>
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
.log-area { max-height: 200px; overflow-y: auto; background: #fafafa; border-radius: 8px; padding: 12px; }
.log-empty { color: #ccc; text-align: center; padding: 20px; }
.log-item { font-size: 12px; color: #666; padding: 3px 0; font-family: monospace; border-bottom: 1px dashed #f0f0f0; }
</style>
