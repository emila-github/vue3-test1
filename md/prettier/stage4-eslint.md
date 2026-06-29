# Stage 4：ESLint 集成

## 分工原则

**Prettier 管格式，ESLint 管逻辑**，两者互补而非竞争。

| 领域 | Prettier | ESLint |
|------|----------|--------|
| 缩进、空格、换行 | ✅ | ❌（应关闭） |
| 引号、分号、尾部逗号 | ✅ | ❌（应关闭） |
| 行宽控制 | ✅ | ❌（应关闭） |
| 未使用变量 | ❌ | ✅ |
| 禁止 console | ❌ | ✅ |
| Vue 组件命名 | ❌ | ✅ |
| TypeScript 类型检查 | ❌ | ✅ |

## 冲突场景

当 ESLint 的格式化规则与 Prettier 不一致时，会产生"格式化 → 检查 → 又格式化"的死循环。

| 规则 | Prettier | ESLint（冲突） |
|------|----------|----------------|
| semi | false | semi: ["error", "always"] |
| quotes | singleQuote: true | quotes: ["error", "double"] |
| indent | tabWidth: 2 | indent: ["error", 4] |
| comma-dangle | trailingComma: "all" | comma-dangle: ["error", "never"] |

## 解决冲突的两个工具

### eslint-config-prettier
关闭 ESLint 中所有与 Prettier 冲突的格式化规则。只需在配置最后引入即可。

### eslint-plugin-prettier
把 Prettier 作为 ESLint 的一条规则（`prettier/prettier`）运行。`eslint --fix` 时自动执行 Prettier 格式化。

## 集成策略

| 策略 | 方案 | 优点 | 缺点 |
|------|------|------|------|
| 分层方案（推荐） | ESLint(逻辑) + Prettier(格式) | 职责清晰、互不干扰 | 需要两条命令 |
| 合并方案 | ESLint 包含 Prettier 插件 | 一条命令搞定 | 稍慢、嵌套复杂 |

## 本项目配置

```ts
// eslint.config.ts
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default [
  // ...其他配置
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      ...pluginPrettier.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
  // eslint-config-prettier 必须放在最后
  configPrettier,
]
```

## lint-staged 推荐

```json
{
  "*.{js,ts,vue}": ["prettier --write", "eslint --fix"],
  "*.{json,css,scss,md}": ["prettier --write"]
}
```
