# Ant Design Vue 4.2.6 学习文档

> 基于 Vue 3.5 + Vite 8 + TypeScript 6，从 0 到 1 系统学习 Ant Design Vue 4.x。

---

## 目录

- [快速开始](#快速开始)
- [阶段一：技术选型与项目起步](./stage1-getting-started.md)
- [阶段二：核心组件与开发规范](./stage2-core-components.md)
- [阶段三：组件二次封装与原子设计](./stage3-encapsulation.md)
- [阶段四：主题定制与样式隔离](./stage4-theme.md)
- [阶段五：性能优化与工程化实践](./stage5-optimization.md)

---

## 快速开始

### 安装依赖

```bash
pnpm add ant-design-vue@4.x @ant-design/icons-vue
```

### 全局注册

```ts
// main.ts
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)
app.use(Antd)
app.mount('#app')
```

### 技术栈版本

| 依赖 | 版本 |
|------|------|
| Vue | ≥3.5 |
| Vite | ≥6 |
| TypeScript | ~6.0 |
| Ant Design Vue | 4.2.6 |
| @ant-design/icons-vue | ^7.0 |

### 访问示例

启动项目后访问：

- `/antd` — 学习总览
- `/antd/stage1` — 阶段一：基础组件
- `/antd/stage2` — 阶段二：核心组件
- `/antd/stage3` — 阶段三：组件封装
- `/antd/stage4` — 阶段四：主题定制
- `/antd/stage5` — 阶段五：性能优化

---

## API 变更要点（4.x vs 3.x）

| 变更项 | 3.x | 4.x |
|--------|-----|-----|
| 样式方案 | Less | CSS-in-JS |
| Modal/Drawer 显隐 | `visible` | `open` |
| 主题定制 | less-loader + 变量覆盖 | `ConfigProvider.theme.token` 运行时 |
| 按需引入 | `babel-plugin-import` | `unplugin-vue-components` |
| 全局样式 | 全量 CSS | 仅需引入 `reset.css` |
