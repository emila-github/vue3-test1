# Stage 2: 配置与环境

## 学习目标

- 掌握 `.env` 环境变量体系
- 理解多模式配置（development / production / 自定义）
- 配置路径别名和 CSS 预处理
- 设置开发代理解决跨域

## 核心概念

### 环境变量优先级

```
.env                # 所有模式
.env.local          # 本地（gitignore）
.env.development    # 开发覆盖
.env.production     # 生产覆盖
```

高优先级文件覆盖低优先级的同名变量。

### 多模式

通过 `--mode` 指定模式，加载对应的 `.env.[mode]` 文件。

```json
"scripts": {
  "dev:mock": "vite --mode mock"
}
```

## API / 配置参考

```ts
export default defineConfig({
  // 路径别名
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },

  // 开发代理
  server: { proxy: { '/api': { target: 'http://localhost:3000', changeOrigin: true } } },

  // CSS
  css: {
    preprocessorOptions: { scss: { additionalData: `@use "@/styles/variables" as *;` } },
    modules: { localsConvention: 'camelCaseOnly' },
  },
})
```

## 常见陷阱

- 非 `VITE_` 前缀的变量不会暴露给客户端
- 修改 `.env` 需要重启开发服务器
- TypeScript 别名需在 `tsconfig.json` 中同步配置
- `proxy` 只在开发环境生效，生产需 Nginx

## 示例页面

打开 `/vite/stage2` 查看交互式演示。
