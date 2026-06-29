# Stage 3：忽略与覆盖

## .prettierignore

排除不需要格式化的文件，语法与 `.gitignore` 完全一致。

```gitignore
# .prettierignore
dist/
node_modules/
coverage/
pnpm-lock.yaml
*.min.js
.output/
```

- Prettier 默认排除 `node_modules/`
- 本项目中 format 命令明确指向 `src/`，故未配置 .prettierignore

## overrides — 差异化配置

为特定文件类型覆盖默认配置：

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": false,
  "singleQuote": true,
  "printWidth": 120,
  "overrides": [
    {
      "files": "*.json",
      "options": { "printWidth": 80 }
    },
    {
      "files": "*.md",
      "options": { "proseWrap": "always", "printWidth": 80 }
    },
    {
      "files": "*.{css,scss}",
      "options": { "singleQuote": false }
    }
  ]
}
```

## 常用 Override 示例

| 匹配文件 | 覆盖选项 | 说明 |
|----------|----------|------|
| `*.json` | `{ "printWidth": 80 }` | JSON 较短的行宽更易读 |
| `*.md` | `{ "proseWrap": "always" }` | Markdown 始终换行 |
| `*.{css,scss}` | `{ "singleQuote": false }` | CSS 社区惯例用双引号 |
| `*.yml,*.yaml` | `{ "tabWidth": 2, "singleQuote": false }` | YAML 用双引号 |

## CLI 相关参数

| 参数 | 说明 |
|------|------|
| `--config <path>` | 指定配置文件路径 |
| `--no-config` | 不使用配置文件，只用默认值 |
| `--ignore-path <path>` | 指定 .prettierignore 文件路径 |

## 配置文件优先级

Prettier 按以下顺序查找配置，找到第一个就停止：

1. `package.json` 的 `"prettier"` 字段
2. `.prettierrc`（JSON/YAML）
3. `.prettierrc.json`
4. `.prettierrc.yaml` / `.prettierrc.yml`
5. `.prettierrc.toml`
6. `prettier.config.js` / `.mjs` / `.cjs`
