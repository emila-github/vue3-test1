# 阶段一：技术选型与项目起步

## 学习目标

- 锁定技术栈：Vue 3.5 + Vite 8 + Ant Design Vue 4.2.6
- 安装并全局注册 Ant Design Vue
- 掌握基础组件的使用：Button、Icon、Select、Radio、Switch、DatePicker、Tag

## 技术选型理由

### 为什么选 Ant Design Vue 4.2.6？

- **稳定性**：4.2.6 修复了 Select 虚拟滚动的内存泄漏问题
- **CSS-in-JS**：弃用 Less，运行时动态主题切换，无需 less-loader
- **Vue 3 原生适配**：完整支持 Composition API 和 TypeScript

### 推荐工具链

| 工具 | 说明 |
|------|------|
| pnpm | 节省磁盘空间，依赖提升（hoist）更可控 |
| Vite 8 | 极速冷启动与 HMR |
| TypeScript 6 | 完整类型支持 |

## 全局注册

```ts
// main.ts
import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)
app.use(Antd)
app.mount('#app')
```

> **注意**：必须引入 `ant-design-vue/dist/reset.css`，否则浏览器默认样式会干扰组件。

## 基础组件速查

### Button 按钮

```vue
<a-button type="primary">Primary</a-button>
<a-button type="default">Default</a-button>
<a-button type="dashed">Dashed</a-button>
<a-button type="text">Text</a-button>
<a-button type="link">Link</a-button>
<a-button danger>Danger</a-button>
<a-button :loading="loading" @click="handleClick">加载中</a-button>
```

| 属性 | 说明 | 类型 |
|------|------|------|
| `type` | 按钮类型 | `primary` / `default` / `dashed` / `text` / `link` |
| `danger` | 危险按钮 | `boolean` |
| `loading` | 加载状态 | `boolean` |
| `disabled` | 禁用 | `boolean` |
| `shape` | 形状 | `default` / `circle` / `round` |

### Icon 图标

```vue
<script setup lang="ts">
import { HomeOutlined, SettingOutlined } from '@ant-design/icons-vue'
</script>

<template>
  <HomeOutlined style="color: #1677ff; font-size: 24px" />
</template>
```

> **最佳实践**：按需引入每个图标，避免全量导入 `import * as Icons`。

### Select 选择器

```vue
<template>
  <a-select
    v-model:value="selected"
    :options="[
      { value: 'vue', label: 'Vue 3' },
      { value: 'react', label: 'React' },
    ]"
    style="width: 200px"
  />
</template>
```

### Radio 单选框

```vue
<a-radio-group v-model:value="size">
  <a-radio-button value="small">Small</a-radio-button>
  <a-radio-button value="default">Default</a-radio-button>
</a-radio-group>
```

### Switch 开关

```vue
<a-switch v-model:checked="enabled" />
```

### DatePicker 日期选择器

```vue
<a-date-picker v-model:value="date" placeholder="请选择日期" />
```

### Tag 标签

```vue
<a-tag v-for="tag in tags" :key="tag" closable @close="handleClose(tag)">
  {{ tag }}
</a-tag>
```

## 示例页面

打开 `/antd/stage1` 查看所有基础组件的交互式演示。
