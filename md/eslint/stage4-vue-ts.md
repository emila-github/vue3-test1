# Stage 4：Vue + TypeScript 实战配置

## 学习目标

- 逐行拆解本项目的 `eslint.config.ts`
- 理解 ESLint 检查工作流程
- 掌握团队协作最佳实践

## 项目配置结构

```ts
// eslint.config.ts
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfigWithVueTs(
  { files: ['**/*.{vue,ts,tsx}'] },
  globalIgnores(['**/dist/**', '**/coverage/**']),
  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
)
```

## 配置逐层说明

| 配置块 | 作用 |
|--------|------|
| `files` | 限制检查范围 |
| `globalIgnores` | 忽略构建产物 |
| `flat/essential` | Vue 基础语法检查 |
| `vueTsConfigs.recommended` | TS 类型规则 |
| `skipFormatting` | 关闭 Prettier 冲突规则 |

## 最佳实践

1. CI 中只检查不修复
2. `eslint-disable` 必须加注释说明
3. 使用 lint-staged 只检查暂存文件

## 示例页面

打开 `/eslint/stage4` 查看交互式演示。
