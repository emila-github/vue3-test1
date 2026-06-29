# Stage 1: 快速上手

## 学习目标

- 了解 Vite 的设计理念和核心概念
- 使用 `npm create vite` 初始化项目
- 理解 `vite.config.ts` 最小配置
- 掌握开发服务器和 HMR 机制

## 核心概念

### Vite 设计理念

Vite 的核心思想是 **利用浏览器原生 ESM**：

1. **开发环境**：按需编译，只处理浏览器请求的模块，冷启动极快
2. **生产环境**：使用 Rollup 打包，输出优化后的静态资源

### 与 Webpack 的关键区别

| 维度 | Vite | Webpack |
|------|------|---------|
| 开发启动 | 毫秒级 | 秒~分钟级 |
| 模块处理 | 按需 ESM | 全量打包 |
| 预构建 | esbuild | 无 |
| 配置 | 简洁 | 繁琐 |

### HMR 工作原理

1. 文件修改 → Vite 检测变更
2. WebSocket 推送更新消息到浏览器
3. 浏览器增量加载变更模块
4. Vue 组件状态保持不变（响应式变量不丢失）

## API / 配置参考

```ts
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  server: { port: 5173, open: true },
  resolve: { alias: { '@': '/src' } },
})
```

## 常见陷阱

- `index.html` 必须放在项目根目录（不是 `public/`）
- 使用 `type="module"` 的 script 标签引用入口
- `.env` 变量必须以 `VITE_` 前缀开头
- 开发服务器启动后不要关闭 — HMR 自动生效

## 示例页面

打开 `/vite/stage1` 查看交互式演示。
