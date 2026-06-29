# Vite 学习教程

基于 `vite@^8.0.8`，5 阶段系统学习 Vite 构建工具。

## 学习阶段

| Stage | 主题 | 路由 | 内容 |
|-------|------|------|------|
| 1 | 快速上手 | `/vite/stage1` | 项目初始化、vite.config.ts、HMR |
| 2 | 配置与环境 | `/vite/stage2` | 环境变量、多模式、别名、代理 |
| 3 | 插件系统 | `/vite/stage3` | 官方/社区插件、自定义插件 |
| 4 | 构建优化 | `/vite/stage4` | 代码分割、Tree Shaking、打包分析 |
| 5 | 进阶特性 | `/vite/stage5` | SSR、库模式、Worker、预构建 |

## 核心 API

| API | 说明 |
|-----|------|
| `defineConfig()` | 定义 Vite 配置（类型推导） |
| `import.meta.env` | 环境变量访问 |
| `import.meta.glob()` | 批量导入模块 |
| `import.meta.url` | 当前模块 URL |
| `ssrLoadModule()` | SSR 模块加载 |
| `createServer()` | 编程式创建开发服务器 |
| `build()` | 编程式构建 |

## 相关链接

- [Vite 官方文档](https://vite.dev/)
- [Vite 插件 API](https://vite.dev/guide/api-plugin.html)
- [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer)
