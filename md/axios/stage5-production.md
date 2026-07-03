# Stage 5: 实战 — 从零封装生产级 request.ts

## 学习目标

- 从零搭建生产级 axios 封装
- 理解 6 个步骤的设计思路
- 掌握项目文件结构的最佳实践
- 学会团队协作中的 API 层规范

## 核心概念

### 架构分层

```
.vue 组件  →  api/modules/  →  request.ts  →  Mock / Server
(调用API)    (业务封装)       (拦截器/实例)   (数据层)
```

### 六步搭建

**Step 1**: 创建 axios 实例（baseURL、timeout、headers）

**Step 2**: 定义 TypeScript 类型（ApiResponse、BizError）

**Step 3**: 请求拦截器（Token 注入、时间戳防缓存、日志）

**Step 4**: 响应拦截器（业务码校验、统一错误处理、错误分类）

**Step 5**: 便捷方法封装（get/post/put/del 泛型函数）

**Step 6**: 业务模块拆分（按模块分文件，统一从 index.ts 导出）

### 目录结构

```
src/api/
  ├── request.ts     # axios 实例 + 拦截器
  ├── types.ts       # 公共类型
  ├── index.ts       # 统一导出
  └── modules/       # 业务模块
      ├── user.ts
      ├── employee.ts
      └── permission.ts
```

### 最佳实践

1. **单一实例**：create() 创建独立实例，不修改全局 axios
2. **类型安全**：泛型约束请求/响应，API 层定义完整接口
3. **错误分层**：拦截器处理通用异常，组件 try/catch 处理业务逻辑
4. **模块拆分**：按业务分文件，避免单文件过大
5. **环境隔离**：环境变量管理 baseURL
6. **Loading 计数器**：支持并发请求的全局 Loading
7. **请求防抖**：搜索场景结合防抖 + AbortController
8. **日志输出**：开发环境输出日志，生产环境精简

## 示例页面

打开 `/axios/stage5` 查看完整代码与架构说明。

打开 `src/api/request.ts` 查看项目实际代码。
