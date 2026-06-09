# 用户管理 CRUD 页面

基于 Vue 3 最佳实践开发的完整用户管理增删改查页面。

---

## 新增文件

| 文件 | 说明 |
|------|------|
| `src/stores/user.ts` | **Pinia Setup Store** — 用户实体类型定义、模拟数据、完整 CRUD 方法、统计计算属性 |
| `src/views/user/useUserCrud.ts` | **Composable 组合式函数** — 搜索/排序逻辑、弹窗控制、表单校验、多选/全选、导出 |
| `src/views/user/UserCrud.vue` | **主页面** — 完整 UI 交互界面 |

---

## 功能清单

| 功能 | 实现方式 |
|------|---------|
| **统计卡片** | 用户总数 / 启用数 / 禁用数，实时响应数据变化 |
| **搜索** | 按姓名/邮箱/角色模糊匹配，实时过滤 |
| **排序** | 点击表头按任意列升序/降序排列 |
| **新增用户** | 弹窗表单，含姓名、邮箱、角色、状态字段 |
| **编辑用户** | 弹窗预填数据，修改后保存 |
| **删除用户** | 单条删除 + confirm 确认 |
| **批量操作** | 多选复选框 + 全选 + 批量删除 |
| **状态切换** | 行内点击启用/禁用按钮即时切换 |
| **表单校验** | 姓名 ≥ 2 字符、邮箱正则校验，错误提示 |
| **导出 CSV** | 将当前列表导出为 UTF-8 BOM CSV 文件 |
| **Teleport 弹窗** | 弹窗渲染到 body，不受组件层级限制 |
| **Transition 动画** | 弹窗淡入淡出 + 缩放动画 |

---

## 架构亮点（Vue 3 最佳实践）

### 三层架构

```
数据层 (Pinia Store)    逻辑层 (Composable)    视图层 (Vue SFC)
┌──────────────────┐    ┌──────────────────┐   ┌──────────────────┐
│ useUserStore     │───▶│ useUserCrud      │──▶│ UserCrud.vue     │
│ - users[]        │    │ - filteredUsers  │   │ - 统计卡片       │
│ - addUser()      │    │ - searchKeyword  │   │ - 搜索工具栏     │
│ - updateUser()   │    │ - formData       │   │ - 数据表格       │
│ - deleteUser()   │    │ - validateForm() │   │ - 弹窗表单       │
│ - toggleStatus() │    │ - submitForm()   │   │ - 排序/多选/导出 │
└──────────────────┘    └──────────────────┘   └──────────────────┘
```

### 核心设计模式

| 模式 | 文件 | 说明 |
|------|------|------|
| **Pinia Setup Store** | `stores/user.ts` | 使用组合式 API 语法定义 Store，类型安全、简洁 |
| **Composable 逻辑分离** | `views/user/useUserCrud.ts` | 将 UI 无关逻辑抽离到组合式函数，可跨组件复用 |
| **显式数据流** | 整体架构 | Store → Composable → 组件，单向数据流，职责清晰 |
| **TypeScript 类型定义** | `stores/user.ts` | `User` 和 `UserFormData` 接口，全链路类型安全 |
| **表单校验** | `useUserCrud.ts` | 独立校验函数，返回错误对象，不依赖 UI 框架 |

### 关键技术点

#### 1. Pinia Setup Store（`src/stores/user.ts`）

```ts
// 组合式 API 风格的 Store 定义
export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>(generateMockUsers())

  // 计算属性
  const totalCount = computed(() => users.value.length)

  // 增删改查方法
  function addUser(form: UserFormData): User { ... }
  function updateUser(id: number, form: UserFormData): boolean { ... }
  function deleteUser(id: number): boolean { ... }

  return { users, totalCount, addUser, updateUser, deleteUser }
})
```

**为什么用 Setup Store 而非 Options Store？**
- 更好的 TypeScript 类型推断
- 与 `<script setup>` 编码风格统一
- 可以组合其他 composable

#### 2. Composable 逻辑复用（`src/views/user/useUserCrud.ts`）

```ts
export function useUserCrud() {
  const store = useUserStore()

  // 搜索状态
  const searchKeyword = ref('')
  // 计算搜索排序后的列表
  const filteredUsers = computed(() => {
    const list = store.searchUsers(searchKeyword.value)
    return [...list].sort((a, b) => { ... })
  })

  // 弹窗 + 表单逻辑
  const showDialog = ref(false)
  const formData = ref<UserFormData>({ ... })
  const formErrors = ref<...>({})

  function validateForm(): boolean { ... }
  function submitForm(): boolean { ... }

  return {
    searchKeyword, filteredUsers,
    showDialog, formData, formErrors,
    submitForm, validateForm,
  }
}
```

**Composable 的优势：**
- 逻辑与 UI 完全解耦，可独立测试
- 组件只需解构使用，模板保持简洁
- 可被多个组件共享

#### 3. 类型安全的表单校验

```ts
interface UserFormData {
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive'
}

function validateForm(): boolean {
  const errors: Partial<Record<keyof UserFormData, string>> = {}
  if (formData.value.name.trim().length < 2) {
    errors.name = '姓名至少 2 个字符'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.email = '请输入有效的邮箱地址'
  }
  formErrors.value = errors
  return Object.keys(errors).length === 0
}
```

**亮点：**
- `Partial<Record<keyof UserFormData, string>>` 确保错误对象的 key 只能是表单字段名
- 校验逻辑独立于 UI，可复用
- 错误信息与表单字段一一对应

#### 4. Teleport + Transition 弹窗

```html
<Teleport to="body">
  <Transition name="dialog">
    <div v-if="showDialog" class="dialog-overlay" @click.self="closeDialog">
      <div class="dialog-panel">
        <!-- 弹窗内容 -->
      </div>
    </div>
  </Transition>
</Teleport>
```

**为什么用 Teleport？**
- 弹窗渲染到 `<body>` 末尾，脱离组件层级
- 不受父组件 `overflow: hidden`、`z-index` 等影响
- 确保遮罩覆盖全屏

#### 5. CSV 导出

```ts
function exportCSV() {
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `用户列表_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
}
```

**注意点：**
- `\uFEFF`（BOM）确保 Excel 正确识别 UTF-8 编码
- 使用 Blob URL 而非直接文本，避免编码问题

---

## 数据流示意图

```
用户操作
  │
  ▼
┌──────────────────────────────────────────────────┐
│  UserCrud.vue（视图层）                           │
│  - 点击「新增」→ openCreateDialog()              │
│  - 点击「编辑」→ openEditDialog(user)            │
│  - 点击「删除」→ confirmDelete(id, name)         │
│  - 输入搜索词 → searchKeyword = 'xxx'            │
│  - 点击表头   → toggleSort('name')              │
│  - 提交表单   → submitForm()                    │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│  useUserCrud.ts（逻辑层）                         │
│  - filteredUsers: computed 搜索 + 排序           │
│  - validateForm(): 表单校验                       │
│  - submitForm(): 根据 mode 调 store.add/update   │
│  - exportCSV(): 数据导出                          │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│  user.ts Pinia Store（数据层）                    │
│  - users: ref<User[]>                            │
│  - addUser() / updateUser() / deleteUser()       │
│  - toggleStatus() / searchUsers()                │
│  - totalCount / activeCount / inactiveCount      │
└──────────────────────────────────────────────────┘
```

---

## 路由配置

```ts
// src/router/index.ts
{
  path: '/user-crud',
  name: 'user-crud',
  component: () => import('../views/user/UserCrud.vue'),
}
```

---

## 样式设计

| 特性 | 实现 |
|------|------|
| 布局 | `max-width: 1100px` 居中，`padding: 24px 20px` |
| 统计卡片 | Flex 布局，左侧彩色边框（蓝/绿/红） |
| 表格 | 圆角 + 阴影，hover 行高亮，选中行蓝色背景 |
| 角色徽章 | 三种颜色区分 admin/editor/viewer |
| 状态切换 | 按钮式切换，绿色=启用，红色=禁用 |
| 弹窗 | 居中固定定位，半透明遮罩，`@click.self` 点击外部关闭 |
| 响应式 | `@media (max-width: 768px)` 统计卡片/工具栏改为纵向堆叠 |

---

## 可扩展方向

- **分页**：当前是列表展示，可加入 `currentPage`/`pageSize` 分页逻辑
- **后端对接**：将 Store 中的模拟数据替换为 axios/fetch API 调用
- **权限控制**：结合自定义指令 `v-permission` 控制操作按钮显隐
- **撤销删除**：删除后显示 Toast 通知，支持 3 秒内撤销
- **高级筛选**：增加角色/状态下拉筛选器
- **数据持久化**：使用 `pinia-plugin-persistedstate` 持久化到 localStorage
