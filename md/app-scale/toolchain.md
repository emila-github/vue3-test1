# 工具链

## 学习目标

- 了解 Vite 开发与构建流程
- 掌握 TypeScript + vue-tsc 类型检查
- 使用 ESLint + Prettier 规范代码

## 核心工具

| 工具 | 版本 | 用途 |
|------|------|------|
| Vite | ^8.0.8 | 开发服务器 + 构建 |
| TypeScript | ~6.0.0 | 类型系统 |
| vue-tsc | ^3.2.6 | Vue 类型检查 |
| Vitest | ^4.1.4 | 单元测试 |
| Playwright | ^1.59.1 | E2E 测试 |
| ESLint | ^9.x | 代码质量 |
| Prettier | ^3.x | 代码格式化 |

## 开发命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建
pnpm type-check   # 类型检查
pnpm lint         # 代码检查
pnpm format       # 代码格式化
pnpm test:unit    # 单元测试
pnpm test:e2e     # E2E 测试
```

## 示例页面

打开 `/toolchain` 查看完整工具链介绍。
