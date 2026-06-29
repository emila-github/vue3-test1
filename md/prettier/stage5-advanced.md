# Stage 5：进阶与生态

## Editor/IDE 集成

| 编辑器 | 扩展/插件 | ID |
|--------|-----------|-----|
| VS Code | Prettier - Code formatter | `esbenp.prettier-vscode` |
| JetBrains | 内置支持 | - |
| Neovim | null-ls / conform.nvim | - |
| Emacs | prettier-js / apheleia | - |

## VS Code 推荐配置

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[vue]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[javascript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" }
}
```

## Git Hooks

| 工具 | 作用 | 亮点 |
|------|------|------|
| lint-staged | 只对暂存文件运行 | 配合 husky、速度极快 |
| husky | 管理 Git hooks | 支持所有 hooks、团队共享 |
| simple-git-hooks | 轻量级替代 | 无需额外依赖 |

## CI/CD 集成

```yaml
# .github/workflows/format.yml
name: Check Formatting
on: [push, pull_request]
jobs:
  prettier:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm prettier --check src/
```

CI 中用 `--check` 而非 `--write`，不通过则阻断流水线。

## 插件生态

| 插件 | 功能 |
|------|------|
| `prettier-plugin-tailwindcss` | 自动排序 Tailwind CSS class |
| `prettier-plugin-packagejson` | 格式化 package.json 字段顺序 |
| `prettier-plugin-organize-imports` | 自动整理 import 语句 |
| `prettier-plugin-sort-json` | 对 JSON key 排序 |
| `prettier-plugin-svelte` | 格式化 Svelte 组件 |

## 最佳实践

- 项目根目录提交 `.prettierrc.json`，保证团队一致
- `.vscode/settings.json` 设置 `editor.formatOnSave: true`
- CI 中用 `--check`，本地用 `--write`
- 不混用多个格式化工具
- ESLint 只负责逻辑规则，格式化全交给 Prettier

## Monorepo 场景

根目录放共享配置，子包通过 `overrides` 微调：

```
project-root/
├── .prettierrc.json     ← 共享配置
├── packages/
│   ├── web/
│   │   └── .prettierrc.json  ← 子包覆盖（如需）
│   └── admin/
│       └── .prettierrc.json  ← 子包覆盖（如需）
```
