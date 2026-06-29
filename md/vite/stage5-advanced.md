# Stage 5: 进阶特性

## 学习目标

- 了解 Vite SSR 服务端渲染原理
- 使用库模式打包可发布的 npm 包
- 集成 Web Worker 处理密集计算
- 理解依赖预构建机制

## 核心概念

### SSR 服务端渲染

Vite 提供 `ssrLoadModule()` 在 Node.js 中加载 Vue 组件，配合 `renderToString()` 生成 HTML。

### 库模式

将项目构建为 npm 包，支持 ESM / UMD 多格式输出。需配置 `external` 外部化依赖。

### Web Worker

通过 `?worker` 后缀导入 Worker 文件，Vite 自动处理打包和 URL。

## API / 配置参考

```ts
// 库模式
build: {
  lib: { entry: 'src/index.ts', name: 'MyLib', fileName: 'my-lib', formats: ['es', 'umd'] },
  rollupOptions: { external: ['vue'], output: { globals: { vue: 'Vue' } } },
}

// 依赖预构建
optimizeDeps: {
  include: ['lodash-es'],
  exclude: ['your-local-package'],
}
```

## 常见陷阱

- SSR 中避免使用 `window`/`document` 等浏览器 API
- 库模式 `external` 配置不全会导致体积爆炸
- Worker 文件路径需使用 `new URL(..., import.meta.url)`
- 预构建缓存（`node_modules/.vite`）偶尔需清理

## 示例页面

打开 `/vite/stage5` 查看交互式演示。
