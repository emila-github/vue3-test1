# Stage 4: 构建与优化

## 学习目标

- 掌握生产构建配置
- 理解代码分割策略（vendor / 路由 / 组件）
- 使用 Tree Shaking 移除死代码
- 配置打包分析和资源优化

## 核心概念

### 代码分割策略

1. **vendor 拆分**：第三方库单独 chunk，利用浏览器缓存
2. **路由懒加载**：每个页面独立 chunk，按需下载
3. **组件懒加载**：`defineAsyncComponent` 加载重型组件

### Tree Shaking

- 依赖 ES Module 的静态结构
- Side-effect-free 的包更有效
- `package.json` 中 `"sideEffects": false` 标记

## API / 配置参考

```ts
export default defineConfig({
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
})
```

## 常见陷阱

- `manualChunks` 拆分过细反而增加请求数
- `assetsInlineLimit` 太小会导致过多 base64 内联
- `cssCodeSplit: false` 可能导致 CSS 过大
- 构建后在 `preview` 模式下验证，而非 `dev`

## 示例页面

打开 `/vite/stage4` 查看交互式演示。
