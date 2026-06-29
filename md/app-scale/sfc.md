# 单文件组件 (SFC)

## 学习目标

- 理解 `.vue` 文件的三部分结构
- 掌握 `<script setup>` 的优势
- 了解 scoped CSS、CSS Modules、v-bind in CSS

## SFC 结构

```vue
<script setup lang="ts">
// 逻辑 — Composition API
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <!-- 模板 — HTML + 指令 -->
  <button @click="count++">{{ count }}</button>
</template>

<style scoped>
/* 样式 — 组件作用域 */
button { font-weight: bold; }
</style>
```

## `<script setup>` 优势

- 顶级变量自动暴露给模板
- 编译时优化，更小运行时开销
- TypeScript 原生支持
- 减少样板代码（无需 data/methods/computed）
- 可直接使用 Composables

## CSS 特性

| 特性 | 语法 | 说明 |
|------|------|------|
| scoped | `<style scoped>` | 仅作用于当前组件 |
| :deep() | `.parent :deep(.child)` | 穿透 scoped |
| CSS Modules | `<style module>` | 编译为唯一类名 |
| v-bind() | `color: v-bind(var)` | JS 变量注入 CSS |

## 示例页面

打开 `/sfc` 查看交互式演示。
