# 阶段五：性能优化与工程化实践

## 学习目标

- 掌握按需加载配置（unplugin-vue-components）
- 了解生产环境优化（gzip 压缩、CDN）
- 掌握图标优化策略
- 了解自动化测试方案

## 按需加载

### unplugin-vue-components

```bash
pnpm add -D unplugin-vue-components
```

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        AntDesignVueResolver({
          // 4.x 使用 CSS-in-JS，无需引入样式文件
          importStyle: false,
        }),
      ],
    }),
  ],
})
```

**效果**：
- 自动将 `<a-button>` 转为 `import { Button } from 'ant-design-vue'`
- 减少约 **42%** 打包体积
- 开发体验不变，无额外心智负担

### 体积对比

| 方案 | 原始大小 | Gzip 后 |
|------|---------|---------|
| 全量引入 | ~680 KB | ~180 KB |
| 按需加载 | ~400 KB | ~110 KB |

## 生产环境优化

### vite-plugin-compression

```bash
pnpm add -D vite-plugin-compression
```

```ts
// vite.config.ts
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'gzip',
      threshold: 10240, // 大于 10KB 才压缩
    }),
  ],
})
```

构建后生成 `.gz` 文件，配合 Nginx 直接返回：

```nginx
# nginx.conf
gzip_static on;
```

## 图标优化

### 策略一：按需引入

```ts
// ✅ 按需引入（仅打包使用到的图标）
import { HomeOutlined, UserOutlined } from '@ant-design/icons-vue'

// ❌ 避免全量引入（增加 ~200KB）
// import * as Icons from '@ant-design/icons-vue'
```

### 策略二：Iconify CDN

```bash
pnpm add -D @iconify/vue
```

```vue
<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <Icon icon="mdi:home" />
</template>
```

使用 Iconify CDN 时图标不纳入本地打包，首屏更小。

## 虚拟滚动

Ant Design Vue 4.x Table 内置虚拟滚动支持：

```vue
<a-table
  :columns="columns"
  :data-source="bigData"
  :scroll="{ y: 400 }"
  virtual
/>
```

适用于万级数据的表格渲染，只渲染可视区域内的行，大幅提升性能。

## 自动化测试

### 单元测试（Vitest）

```ts
// __tests__/UserForm.test.ts
import { mount } from '@vue/test-utils'
import UserForm from '@/components/UserForm.vue'

test('renders form fields', () => {
  const wrapper = mount(UserForm)
  expect(wrapper.find('input').exists()).toBe(true)
})

test('validates required fields', async () => {
  const wrapper = mount(UserForm)
  await wrapper.find('button[type="submit"]').trigger('click')
  expect(wrapper.text()).toContain('请输入用户名')
})
```

### E2E 测试（Playwright）

```ts
// e2e/user-crud.spec.ts
import { test, expect } from '@playwright/test'

test('create user flow', async ({ page }) => {
  await page.goto('/user-crud')
  await page.click('button:has-text("新建")')
  await page.fill('#name', '测试用户')
  await page.click('button:has-text("确定")')
  await expect(page.locator('.ant-message')).toContainText('成功')
})
```

## 优化清单

| 优化项 | 收益 | 状态 |
|--------|------|------|
| unplugin-vue-components | 减少 ~42% 体积 | 推荐使用 |
| vite-plugin-compression | 减少传输体积 | 生产环境推荐 |
| 图标按需引入 | 减少 ~200KB | 必须遵循 |
| Iconify CDN | 图标零打包 | 可选 |
| 虚拟滚动 | 大数据表格性能 | 按需开启 |
| Vitest 单元测试 | 保障组件稳定性 | 推荐配置 |
| Playwright E2E | 保障业务流程 | 推荐配置 |

## 示例页面

打开 `/antd/stage5` 查看虚拟滚动、防抖搜索、打包体积对比的交互式演示。
