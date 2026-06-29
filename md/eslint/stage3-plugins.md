# Stage 3：插件与共享配置

## 学习目标

- 区分插件（Plugin）和共享配置（Shareable Config）
- 掌握 Vue/TS 生态核心插件
- 学会自定义插件

## 核心概念

| 类型 | 提供 | 示例 |
|------|------|------|
| 插件 | 规则 + 处理器 | `eslint-plugin-vue` |
| 共享配置 | 规则预设 | `eslint-config-prettier` |

## 核心插件一览

| 插件 | 功能 |
|------|------|
| `eslint-plugin-vue` | Vue SFC 规则 |
| `typescript-eslint` | TS 规则与解析器 |
| `@vue/eslint-config-typescript` | Vue + TS 配置封装 |
| `eslint-config-prettier` | 关闭 Prettier 冲突规则 |
| `eslint-plugin-oxlint` | Oxlint 集成 |
| `eslint-plugin-playwright` | Playwright 测试规则 |
| `@vitest/eslint-plugin` | Vitest 测试规则 |

## 迁移指南

```js
// eslintrc（旧）
{ extends: ['plugin:vue/recommended'], plugins: ['vue'] }

// Flat Config（新）
import pluginVue from 'eslint-plugin-vue'
...pluginVue.configs['flat/recommended']
```

## 示例页面

打开 `/eslint/stage3` 查看交互式演示。
