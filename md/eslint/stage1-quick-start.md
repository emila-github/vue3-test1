# Stage 1：ESLint 快速上手

## 学习目标

- 理解 ESLint 的作用和核心架构
- 学会安装和初始化 ESLint
- 掌握常用 CLI 命令

## 核心概念

ESLint 是 JavaScript/TypeScript 代码质量检查工具，通过 **解析源码 → 遍历 AST → 匹配规则 → 输出报告** 四步流程检查代码。

## 安装

```bash
pnpm add -D eslint
npx eslint --init
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npx eslint src/` | 检查 src 目录 |
| `npx eslint --fix src/` | 自动修复可修复问题 |
| `npx eslint --cache` | 启用缓存加速 |
| `npx eslint --quiet` | 只报告错误，忽略警告 |
| `npx eslint --format json` | JSON 格式输出 |

## 退出码

| 退出码 | 含义 |
|--------|------|
| 0 | 没有错误 |
| 1 | 存在 lint 错误 |
| 2 | 配置或运行时错误 |

## 示例页面

打开 `/eslint/stage1` 查看交互式演示。
