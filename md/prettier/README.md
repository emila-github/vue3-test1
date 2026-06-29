# ✨ Prettier 学习教程

基于 `prettier@3.8.3`，涵盖 CLI、配置、忽略规则、ESLint 集成到进阶生态，5 阶段系统学习。

## 学习路线

| 阶段 | 主题 | 内容 |
|------|------|------|
| Stage 1 | 快速上手 | Prettier 介绍、安装、CLI 命令、工作流程 |
| Stage 2 | 核心配置 | .prettierrc 配置项详解、格式化前后对比 |
| Stage 3 | 忽略与覆盖 | .prettierignore、overrides、配置文件格式 |
| Stage 4 | ESLint 集成 | eslint-config-prettier、冲突解决策略 |
| Stage 5 | 进阶与生态 | Editor 集成、Git Hooks、CI/CD、插件生态 |

## 本项目依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| prettier | ^3.8.3 | 代码格式化工具 |
| eslint-plugin-prettier | ^5.5.5 | 将 Prettier 作为 ESLint 规则运行 |
| eslint-config-prettier | ^10.1.8 | 关闭 ESLint 中与 Prettier 冲突的规则 |

## 命令速查

| 命令 | 说明 |
|------|------|
| `pnpm format` | 格式化 src/ 目录下的所有文件 |
| `pnpm lint` | 串联 oxlint → ESLint（含 prettier 规则） |
| `pnpm lint:eslint` | 仅运行 ESLint（含 prettier 规则） |
| `npx prettier --check src/` | 检查格式（只读） |
| `npx prettier --write src/` | 格式化并写入 |
