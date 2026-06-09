# Vue 3 推荐 Skills

Skills 是 AI 编程助手的领域扩展包，提供专家知识、标准化工作流和可执行工具。以下是 `hyf0/vue-skills` 仓库中推荐的 Vue 3 相关 Skills。

---

## 安装命令

```bash
# 一键安装所有 Vue 3 推荐 Skills
npx skills add hyf0/vue-skills
```

安装后会在项目根目录生成 `skills-lock.json` 锁定版本，Skills 文件写入 `.agents/skills/` 目录。

**团队协作：** `.agents/` 已被 `.gitignore` 忽略，新成员 clone 后执行 `pnpm skill:install` 即可从 `skills-lock.json` 同步安装。

```bash
# 安装/更新所有 skill
pnpm skill:install

# 仅检查哪些 skill 需要更新
pnpm skill:check
```

---

## Skills 清单（共 8 个）

### 1. create-adaptable-composable

| 属性 | 值 |
|------|-----|
| **名称** | `create-adaptable-composable` |
| **描述** | 创建库级别的 Vue Composable，支持 MaybeRef / MaybeRefOrGetter 参数，调用方可传入普通值、ref 或 getter |
| **触发场景** | 用户要求创建可复用、适应性强的 composable 时 |
| **核心概念** | `toValue()` 解析非响应式值、`toRef()` 解析响应式源、`MaybeRefOrGetter<T>` 类型 |

---

### 2. vue-best-practices ★

| 属性 | 值 |
|------|-----|
| **名称** | `vue-best-practices` |
| **描述** | Vue.js 核心最佳实践，强烈推荐 Composition API + `<script setup>` + TypeScript。覆盖 Vue 3、SSR、Volar、vue-tsc |
| **触发场景** | 任何 Vue、.vue 文件、Vue Router、Pinia、Vite 相关任务时自动加载 |
| **覆盖范围** | 响应式、组件通信、动画、性能优化、SFC、渲染函数、状态管理、自定义指令、插件、组合式函数等 |
| **参考文档** | 24 篇详细参考文档（见下方附录） |

---

### 3. vue-debug-guides

| 属性 | 值 |
|------|-----|
| **名称** | `vue-debug-guides` |
| **描述** | Vue 3 调试和错误处理指南，覆盖运行时错误、警告、异步失败、SSR/水合问题 |
| **触发场景** | 诊断或修复 Vue 问题时 |
| **覆盖范围** | 响应式调试、组件问题、异步组件、composable 陷阱、计算属性、事件处理、表单绑定等 |
| **参考文档** | 60+ 篇调试参考文档 |

---

### 4. vue-pinia-best-practices

| 属性 | 值 |
|------|-----|
| **名称** | `vue-pinia-best-practices` |
| **描述** | Pinia Store 定义、状态管理模式、Store 设置和响应式交互 |
| **触发场景** | 涉及 Pinia 状态管理时 |
| **核心概念** | Setup Store vs Options Store、Store 组合、响应式解构、插件系统 |

---

### 5. vue-router-best-practices

| 属性 | 值 |
|------|-----|
| **名称** | `vue-router-best-practices` |
| **描述** | Vue Router 4 模式、导航守卫、路由参数、路由与组件生命周期的交互 |
| **触发场景** | 涉及路由配置、导航守卫、路由参数传递时 |
| **核心概念** | 动态路由、嵌套路由、导航守卫链、路由元信息、懒加载 |

---

### 6. vue-testing-best-practices

| 属性 | 值 |
|------|-----|
| **名称** | `vue-testing-best-practices` |
| **描述** | Vue.js 测试最佳实践，覆盖 Vitest、Vue Test Utils、组件测试、Mock、Playwright E2E 测试 |
| **触发场景** | 编写或修改 Vue 测试代码时 |
| **核心概念** | 单元测试模式、组件挂载、事件模拟、异步测试、E2E 测试 |

---

### 7. vue-options-api-best-practices

| 属性 | 值 |
|------|-----|
| **名称** | `vue-options-api-best-practices` |
| **描述** | Vue 3 Options API 风格（data()、methods、this 上下文），每个参考文档仅提供 Options API 方案 |
| **触发场景** | 项目明确使用 Options API 风格时 |
| **核心概念** | TypeScript 与 Options API 集成、this 上下文、生命周期钩子 |

---

### 8. vue-jsx-best-practices

| 属性 | 值 |
|------|-----|
| **名称** | `vue-jsx-best-practices` |
| **描述** | Vue 中的 JSX 语法差异（如 class vs className）、JSX 插件配置 |
| **触发场景** | 使用 JSX/TSX 编写 Vue 组件时 |
| **核心概念** | Vue JSX 与 React JSX 的区别、属性映射、事件绑定 |

---

## 版本锁定

安装后在项目根目录生成 `skills-lock.json`：

```json
{
  "version": 1,
  "skills": {
    "create-adaptable-composable": {
      "source": "hyf0/vue-skills",
      "sourceType": "github",
      "skillPath": "skills/create-adaptable-composable/SKILL.md",
      "computedHash": "2f215126..."
    },
    "vue-best-practices": {
      "source": "hyf0/vue-skills",
      "sourceType": "github",
      "skillPath": "skills/vue-best-practices/SKILL.md",
      "computedHash": "3df585ad..."
    }
    // ... 其余 6 个
  }
}
```

每个 skill 通过 `computedHash` 锁定版本，确保团队成员安装到完全一致的内容。

---

## 使用流程

```
团队初始化                              日常开发
──────────                             ──────────
新成员 clone 项目                       AI 对话中自动触发
      │                                      │
      ▼                                      ▼
pnpm skill:install                    Skill 被加载
      │                               提供领域知识指导
      ▼
从 GitHub 拉取所有 SKILL.md
写入 .agents/skills/ 目录
      │
      ▼
✅ 开发环境就绪
```

---

## 附录：vue-best-practices 参考文档列表

`vue-best-practices` 是覆盖面最广的 skill，内含 24 篇详细参考文档：

| 分类 | 参考文档 |
|------|---------|
| **响应式** | `reactivity.md` |
| **组件通信** | `component-data-flow.md` |
| **插槽** | `component-slots.md` |
| **透传 Attributes** | `component-fallthrough-attrs.md` |
| **异步组件** | `component-async.md` |
| **KeepAlive** | `component-keep-alive.md` |
| **Teleport** | `component-teleport.md` |
| **Suspense** | `component-suspense.md` |
| **Transition** | `component-transition.md` |
| **TransitionGroup** | `component-transition-group.md` |
| **动画技术** | `animation-class-based-technique.md`、`animation-state-driven-technique.md` |
| **组合式函数** | `composables.md` |
| **自定义指令** | `directives.md` |
| **插件** | `plugins.md` |
| **渲染函数** | `render-functions.md` |
| **SFC** | `sfc.md` |
| **状态管理** | `state-management.md` |
| **性能优化** | `perf-avoid-component-abstraction-in-lists.md`、`perf-v-once-v-memo-directives.md`、`perf-virtualize-large-lists.md`、`updated-hook-performance.md` |

---

## 项目文件结构

```
项目根目录/
├── skills-lock.json          ← 版本锁定文件（提交到 Git）
├── package.json              ← 集成安装脚本
│   └── "skill:install"
│   └── "skill:check"
├── scripts/
│   └── install-skills.js     ← 自动安装脚本
└── .agents/                  ← 被 .gitignore 忽略
    └── skills/
        ├── create-adaptable-composable/
        │   └── SKILL.md
        ├── vue-best-practices/
        │   ├── SKILL.md
        │   └── references/   ← 24 篇参考文档
        ├── vue-debug-guides/
        │   ├── SKILL.md
        │   └── reference/    ← 60+ 篇调试参考
        ├── vue-jsx-best-practices/
        ├── vue-options-api-best-practices/
        ├── vue-pinia-best-practices/
        ├── vue-router-best-practices/
        └── vue-testing-best-practices/
```
