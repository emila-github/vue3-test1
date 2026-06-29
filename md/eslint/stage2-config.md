# Stage 2：Flat Config 配置详解

## 学习目标

- 理解 Flat Config 格式 vs eslintrc 的差异
- 掌握配置对象的五个核心字段
- 学会规则配置语法

## 核心概念

ESLint 9+ 引入 Flat Config，用扁平数组替代嵌套继承。每个配置对象包含：

| 字段 | 说明 |
|------|------|
| `files` | 文件匹配模式 |
| `ignores` / `globalIgnores()` | 忽略模式 |
| `languageOptions` | 解析器、环境、全局变量 |
| `linterOptions` | 报告级别 |
| `plugins` | 插件引用 |
| `rules` | 规则配置 |

## 规则语法

```js
// 字符串简写
'no-console': 'off' | 'warn' | 'error'

// 数组配置（带选项）
'no-unused-vars': ['error', { args: 'none' }]
```

## 优先级

数组中**后定义的配置覆盖前面的**。公共规则放前面，特定文件覆盖放后面。

## 常见陷阱

- 不要混用 eslintrc 和 Flat Config
- `skipFormatting` 必须放数组最后
- `files` 只查匹配文件，`ignores` 全局忽略

## 示例页面

打开 `/eslint/stage2` 查看交互式演示。
