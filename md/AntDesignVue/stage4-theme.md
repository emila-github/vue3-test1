# 阶段四：主题定制与样式隔离

## 学习目标

- 理解 Ant Design Vue 4.x 的 CSS-in-JS 主题方案
- 掌握 ConfigProvider 动态主题配置
- 了解样式隔离的最佳实践

## CSS-in-JS 方案

Ant Design Vue 4.x 弃用 Less，默认采用 CSS-in-JS（基于 `@ant-design/cssinjs`），带来以下优势：

- ✅ 运行时动态切换主题色，无需 less-loader
- ✅ 无需重新编译即可修改主题
- ✅ Tree-shaking 友好，产物不包含未使用的样式

## 动态主题配置

### 使用 ConfigProvider

```vue
<!-- App.vue -->
<script setup lang="ts">
const themeConfig = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 6,
    fontSize: 14,
    colorSuccess: '#52c41a',
    colorWarning: '#fa8c16',
    colorError: '#f5222d',
  },
}
</script>

<template>
  <a-config-provider :theme="themeConfig">
    <RouterView />
  </a-config-provider>
</template>
```

### 运行时切换主题色

```ts
// 通过 reactive 响应式切换
import { reactive } from 'vue'

const theme = reactive({
  token: {
    colorPrimary: '#1677ff',
  },
})

// 切换主题
function setTheme(color: string) {
  theme.token.colorPrimary = color
}
```

### 使用 @ant-design/colors 生成色板

```bash
pnpm add @ant-design/colors
```

```ts
import { generate } from '@ant-design/colors'

// 生成完整色板（10 个色阶）
const palette = generate('#52c41a')
// ['#f6ffed', '#d9f7be', ... '#135200']
```

## 常用 Design Token

| Token | 说明 | 默认值 |
|-------|------|--------|
| `colorPrimary` | 主色 | `#1677ff` |
| `colorSuccess` | 成功色 | `#52c41a` |
| `colorWarning` | 警告色 | `#fa8c16` |
| `colorError` | 错误色 | `#f5222d` |
| `colorInfo` | 信息色 | `#1677ff` |
| `borderRadius` | 圆角 | `6` |
| `fontSize` | 字号 | `14` |
| `fontFamily` | 字体 | `-apple-system, BlinkMacSystemFont...` |

## 样式隔离

### 1. 引入 reset.css

```ts
// main.ts
import 'ant-design-vue/dist/reset.css'
```

> 4.x 产物不再包含全量 CSS，必须手动引入 reset.css 重置浏览器默认样式。

### 2. 使用 `<App>` 组件

```vue
<template>
  <a-app>
    <RouterView />
  </a-app>
</template>
```

`<App>` 组件会重置 CSS 作用域，防止全局样式污染。

### 3. UnoCSS 语义色

推荐使用 UnoCSS 的语义色系统，避免手动覆盖底层样式变量：

```css
/* ✅ 使用语义色变量 */
.my-component {
  color: var(--ant-primary-color);
}

/* ❌ 避免硬编码覆盖 */
.ant-btn {
  color: red !important;
}
```

## 预设算法（algorithm）

antdv 4.x 内置了两种预设算法，通过 `theme` 导出：

| 算法 | 说明 | 效果 |
|------|------|------|
| `darkAlgorithm` | 暗色模式 | 全局切换深色背景、浅色文字 |
| `compactAlgorithm` | 紧凑模式 | 缩小组件间距和 padding |

两种算法可以**自由组合**，互不冲突：

```ts
import { theme } from 'ant-design-vue'
const { darkAlgorithm, compactAlgorithm } = theme
```

### 单独使用暗色模式

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { theme } from 'ant-design-vue'
const { darkAlgorithm } = theme

const isDark = ref(false)

const themeConfig = computed(() => ({
  algorithm: isDark.value ? darkAlgorithm : undefined,
  token: { colorPrimary: '#1677ff' },
}))
</script>

<template>
  <a-config-provider :theme="themeConfig">
    <a-switch :checked="isDark" @change="isDark = $event" />
    <!-- 子组件自动跟随暗色模式 -->
    <RouterView />
  </a-config-provider>
</template>
```

### 同时启用暗色 + 紧凑

```ts
const themeConfig = computed(() => ({
  algorithm: [darkAlgorithm, compactAlgorithm],  // 数组组合
}))
```

### 手动过滤（响应式切换）

```ts
const themeConfig = computed(() => {
  const algorithms: any[] = []
  if (isDark.value) algorithms.push(darkAlgorithm)
  if (isCompact.value) algorithms.push(compactAlgorithm)
  return {
    algorithm: algorithms.length > 0 ? algorithms : undefined,
    token: { colorPrimary: currentColor.value },
  }
})
```

> ⚠️ `algorithm` 接受单个算法或算法数组。传 `undefined` 表示不启用任何预设算法。
>
> 暗色模式会自动调整所有组件（按钮、表格、输入框等）的背景色和文字色，无需额外写 CSS。

### algorithm 与 token 的关系

```
ConfigProvider theme:
  ├── algorithm          ← 预设算法（暗色/紧凑），影响全局基础样式
  │     └── darkAlgorithm   → 背景色、文字色、边框色
  │     └── compactAlgorithm → 间距、字号、组件尺寸
  └── token              ← 自定义 token，覆盖具体值
        └── colorPrimary → 主色
        └── borderRadius → 圆角
        └── ...
```

`token` 的优先级**高于** `algorithm` 的默认值——如果你同时在 `algorithm: darkAlgorithm` 时设置 `token.colorPrimary: '#52c41a'`，组件会使用你的自定义主色，但背景色仍由暗色算法决定。

## 主题色推荐组合

| 主题 | colorPrimary | 色板 |
|------|-------------|------|
| 拂晓蓝（默认） | `#1677ff` | 蓝 |
| 极光绿 | `#52c41a` | 绿 |
| 日暮橙 | `#fa541c` | 橙 |
| 酱紫 | `#722ed1` | 紫 |
| 薄暮红 | `#f5222d` | 红 |
| 极客蓝 | `#2f54eb` | 深蓝 |
| 拂晓青 | `#13c2c2` | 青 |

## 示例页面

打开 `/antd/stage4` 查看动态主题色切换、暗色/紧凑模式切换和 ConfigProvider 的交互式演示。
