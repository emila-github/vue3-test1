# VueRequest 概述与安装

## 是什么

`vue-request` 是由 **AttoJS** 开发的一个 Vue 请求状态管理库，兼容 **Vue 2 和 Vue 3**（本项目中安装的是 v2.0.4）。

它让你通过一个简洁的 `useRequest` 组合式函数，就能管理接口请求的 loading/error/data 状态，无需重复实现 loading 管理、节流防抖、数据缓存、分页等常见功能。

## 核心特性

| 特性 | 说明 |
|------|------|
| 🌈 兼容 Vue 2 & 3 | 基于 vue-demi，一套代码两个版本通用 |
| 🚀 响应式数据 | data / loading / error 均为 Vue Ref |
| 🔄 轮询请求 | `pollingInterval` 自动定时请求 |
| 🤖 自动错误重试 | `errorRetryCount` + `errorRetryInterval` |
| 🗄 请求缓存 | 内置 SWR 缓存策略（cacheTime / staleTime）|
| 💧 节流 & 防抖 | debounceInterval / throttleInterval |
| 🎯 窗口聚焦刷新 | `refreshOnWindowFocus` 自动重新请求 |
| ⚙️ 分页 & 加载更多 | `usePagination` / `useLoadMore` 扩展 |
| 📠 完整 TypeScript | 100% TS 编写，类型推断强大 |
| 🍃 轻量化 | 压缩后 ~5KB，开箱即用 |

## 灵感来源

- [vercel/swr](https://github.com/vercel/swr) — React 数据请求库
- [ahooks useRequest](https://ahooks.js.org/hooks/async#userequest) — 阿里 React Hooks 库

## 安装

> **本项目已安装完成：`vue-request@2.0.4`**

```bash
pnpm add vue-request   # 已执行
```

CDN 引入：

```html
<script src="https://unpkg.com/vue-request/dist/vue-request.min.js"></script>
```

通过 `window.VueRequest` 访问所有导出方法。

## 官方文档

- **中文文档**：https://www.attojs.com/
- **仓库**：https://github.com/AttoJS/vue-request

## 基本用法

```vue
<script setup lang="ts">
import { useRequest } from 'vue-request'

// service 必须是返回 Promise 的异步函数
function getUserInfo() {
  return fetch('/api/user').then(res => res.json())
}

const { data, loading, error } = useRequest(getUserInfo)
</script>

<template>
  <div v-if="loading">加载中...</div>
  <div v-else-if="error">请求失败: {{ error.message }}</div>
  <div v-else>数据: {{ data }}</div>
</template>
```

## 导出清单

```ts
import {
  useRequest,       // 核心请求 Hook
  usePagination,    // 分页扩展
  useLoadMore,      // 加载更多扩展
  setGlobalOptions, // 设置全局默认配置
  clearCache,       // 清除缓存
  definePlugin,     // 自定义插件
} from 'vue-request'
```
