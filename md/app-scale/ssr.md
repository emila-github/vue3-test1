# 服务端渲染 (SSR)

## 学习目标

- 理解 SSR 与 CSR 的区别
- 了解 Vue 3 SSR 核心 API
- 了解 Nuxt 框架
- 认识 SSG（静态站点生成）

## CSR vs SSR

| 特性 | CSR | SSR |
|------|-----|-----|
| 首屏速度 | 慢（等 JS 执行） | 快（直接返回 HTML） |
| SEO | 不友好 | 友好 |
| 服务器负载 | 低 | 较高 |
| 适用场景 | 后台管理 | 内容/电商站 |

## Vue 3 SSR API

```ts
// 服务端
import { renderToString } from 'vue/server-renderer'
const html = await renderToString(app)

// 客户端 — Hydration（水合）
import { createSSRApp } from 'vue'
const app = createSSRApp(App)
app.mount('#app')
```

## 渲染模式对比

| 模式 | 渲染时机 | SEO | 适用 |
|------|----------|-----|------|
| CSR | 浏览器端 | ❌ | 后台管理 |
| SSR | 每次请求 | ✅ | 电商/社交 |
| SSG | 构建时 | ✅ | 博客/文档 |

## SSR 注意事项

- 避免在 setup 中访问 `window`/`document`
- 每个请求创建独立 app 实例（防状态污染）
- 服务端/客户端渲染结果必须一致（防水合不匹配）

## 示例页面

打开 `/ssr` 查看 SSR 完整介绍。
