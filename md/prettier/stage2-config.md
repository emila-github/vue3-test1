# Stage 2：核心配置

## 配置文件格式

Prettier 支持多种配置文件格式：

| 文件名 | 格式 | 备注 |
|--------|------|------|
| `.prettierrc` | JSON/YAML | 最常用 |
| `.prettierrc.json` | JSON | 本项目使用 |
| `.prettierrc.yaml` | YAML | YAML 格式 |
| `.prettierrc.toml` | TOML | TOML 格式 |
| `prettier.config.js` | JavaScript | 支持动态配置 |
| `package.json` → `"prettier"` | JSON | 内联在 package.json 中 |

## 本项目的配置

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": false,
  "singleQuote": true,
  "printWidth": 120
}
```

## 配置项详解

| 配置项 | 类型 | 默认值 | 本项目 | 说明 |
|--------|------|--------|--------|------|
| `printWidth` | number | 80 | 120 | 单行最大字符数 |
| `tabWidth` | number | 2 | 2 | 缩进空格数 |
| `useTabs` | boolean | false | false | 是否使用 Tab 缩进 |
| `semi` | boolean | true | false | 是否加分号 |
| `singleQuote` | boolean | false | true | 是否使用单引号 |
| `quoteProps` | string | "as-needed" | "as-needed" | 对象属性何时加引号 |
| `jsxSingleQuote` | boolean | false | false | JSX 中是否用单引号 |
| `trailingComma` | string | "all" | 默认 | 尾部逗号策略 |
| `bracketSpacing` | boolean | true | 默认 | 花括号内空格 |
| `bracketSameLine` | boolean | false | 默认 | JSX 标签闭合括号位置 |
| `arrowParens` | string | "always" | 默认 | 箭头函数参数括号 |
| `endOfLine` | string | "lf" | 默认 | 换行符类型 |
| `embeddedLanguageFormatting` | string | "auto" | 默认 | 是否格式化嵌入语言 |

## 关键选项说明

### printWidth
Prettier 尽量让每行不超过此值。建议 80-120。

### trailingComma
- `"none"` - 永远不加尾部逗号
- `"es5"` - ES5 支持的地方加（对象、数组）
- `"all"` - 所有可能的地方都加（含函数参数）← 默认

### endOfLine
- `"lf"` - \\n（Unix/Mac）
- `"crlf"` - \\r\\n（Windows）
- `"cr"` - \\r（旧 Mac）
- `"auto"` - 自动判断系统类型
