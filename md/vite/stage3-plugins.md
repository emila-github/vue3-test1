# Stage 3: 插件系统

## 学习目标

- 理解 Vite 插件架构（兼容 Rollup）
- 熟悉官方插件和常用社区插件
- 学会编写自定义 Vite 插件
- 掌握 `enforce` 控制执行顺序

## 核心概念

### 插件架构

Vite 插件 API = Rollup 插件接口 + Vite 专有钩子：

- **通用钩子**（Rollup）：`buildStart`、`resolveId`、`load`、`transform`、`buildEnd`...
- **Vite 专有钩子**：`config`、`configResolved`、`configureServer`、`transformIndexHtml`...

### enforce 执行顺序

```
enforce: 'pre'  →  默认（无 enforce）  →  enforce: 'post'
```

## API / 配置参考

```ts
import type { Plugin } from 'vite'

export default function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    resolveId(id) { /* 解析模块 */ },
    load(id) { /* 加载内容 */ },
    transform(code, id) { /* 转换代码 */ },
  }
}
```

## 常见陷阱

- 自定义插件必须有唯一的 `name` 属性
- `enforce: 'pre'` 的插件先于核心插件执行
- 虚拟模块 ID 需以 `\0` 开头
- 社区插件注意与 Vite 版本兼容性

## 示例页面

打开 `/vite/stage3` 查看交互式演示。
