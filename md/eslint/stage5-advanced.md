# Stage 5：进阶与生态

## 学习目标

- 掌握 eslint-disable 的合理使用策略
- 集成 Git Hooks 和 CI/CD
- 了解 ESLint 生态未来方向

## eslint-disable 策略

| 级别 | 语法 | 风险 |
|------|------|------|
| 文件 | `/* eslint-disable */` | 高 |
| 规则 | `/* eslint-disable no-console */` | 中 |
| 行 | `// eslint-disable-next-line` | 低 |
| 块 | `disable ... enable` | 中 |

## Git Hooks 推荐栈

```
pre-commit  → lint-staged（只检查暂存文件）
commit-msg  → commitlint（校验提交信息）
pre-push    → 完整 lint + type-check
CI/CD       → GitHub Actions 自动化
```

## CI 示例

```yaml
# .github/workflows/lint.yml
jobs:
  lint:
    steps:
      - run: pnpm lint
      - run: pnpm type-check
```

## 生态展望

- Flat Config 是唯一格式（eslintrc 已完全移除）
- OXC/Oxlint 作为 Rust 加速补充
- Type-Aware Linting 逐步成为标配

## 示例页面

打开 `/eslint/stage5` 查看交互式演示。
