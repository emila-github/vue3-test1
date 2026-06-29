# 测试

## 学习目标

- 理解测试金字塔策略
- 掌握 Vitest 单元测试
- 了解 Vue Test Utils 组件测试
- 了解 Playwright E2E 测试

## 测试金字塔

```
      /\
     /E2E\       Playwright（少量、关键流程）
    /------\
   /组件测试\     Vue Test Utils（组件交互）
  /----------\
 / 单元测试   \   Vitest（Composables、工具函数）
/--------------\
```

## Vitest 配置

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

## 测试用例示例

```ts
// Composable 测试
test('increment 后 count 为 1', () => {
  const { count, increment } = useCounter()
  increment()
  expect(count.value).toBe(1)
})

// 组件测试
test('点击按钮内容更新', async () => {
  const wrapper = mount(Counter)
  await wrapper.find('button').trigger('click')
  expect(wrapper.text()).toContain('1')
})
```

## 运行测试

```bash
pnpm test:unit     # Vitest 单元测试
pnpm test:e2e      # Playwright E2E 测试
```

## 示例页面

打开 `/testing` 查看测试完整介绍。
