# ESLint 学习教程 — 总览

基于 `eslint@^10.2.1` Flat Config，5 阶段系统学习代码质量检查与团队规范管理。

---

## 学习阶段

| 阶段 | 标题 | 内容 |
|------|------|------|
| Stage 1 | 快速上手 | ESLint 介绍、安装、CLI、自动修复 |
| Stage 2 | Flat Config | 配置结构、rules 语法、合并机制 |
| Stage 3 | 插件与共享配置 | 核心插件、自定义插件、迁移指南 |
| Stage 4 | Vue + TS 实战 | 项目配置拆解、工作流、最佳实践 |
| Stage 5 | 进阶与生态 | disable 策略、Git Hooks、CI/CD、展望 |

---

## 本项目依赖

```json
{
  "eslint": "^10.2.1",
  "@vue/eslint-config-typescript": "^14.7.0",
  "eslint-plugin-vue": "~10.8.0",
  "eslint-config-prettier": "^10.1.8",
  "eslint-plugin-oxlint": "~1.60.0",
  "eslint-plugin-playwright": "^2.10.1",
  "@vitest/eslint-plugin": "^1.6.16"
}
```

## 常用命令

```bash
pnpm lint              # 串联 oxlint + eslint
pnpm lint:eslint       # ESLint 检查 + 自动修复
pnpm lint:oxlint       # Oxlint 快速检查
pnpm format            # Prettier 格式化
```
