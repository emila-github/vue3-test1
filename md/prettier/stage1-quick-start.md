# Stage 1：快速上手

## Prettier 是什么？

Prettier 是一个**有主见（opinionated）的代码格式化工具**。它读取源码 → 解析为 AST → 丢弃原始格式 → 按规则重新打印，保证团队内代码风格绝对一致。

- 零配置即可运行，默认规则已足够
- 多语言支持：JS/TS/CSS/SCSS/HTML/JSON/Vue/Markdown
- 与 ESLint 互补：Prettier 管格式，ESLint 管逻辑

## 安装

```bash
npm install --save-dev prettier
yarn add --dev prettier
pnpm add -D prettier
```

## CLI 命令

| 命令 | 说明 |
|------|------|
| `npx prettier --check src/` | 检查文件格式（只读，不修改） |
| `npx prettier --write src/` | 格式化所有匹配文件 |
| `npx prettier --write src/index.ts` | 格式化单个文件 |
| `npx prettier --write "src/**/*.{vue,ts}"` | 格式化指定扩展名文件 |
| `npx prettier --debug-check file.ts` | 验证输出是否为有效代码 |
| `npx prettier --list-different src/` | 列出与预期格式不符的文件 |

## 退出码

| 退出码 | 含义 |
|--------|------|
| 0 | 所有文件格式正确或格式化成功 |
| 1 | 存在格式不正确的文件（--check 模式） |
| 2 | 运行时错误 |

## 本项目的使用

```json
// package.json scripts
"format": "prettier --write --experimental-cli src/"
```

执行：`pnpm format`
