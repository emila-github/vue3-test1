# Vant4 列表页快速生成指南（基于 useCrudList Hook）

> 配套产物：
> - 通用 Hook：`src/composables/useCrudList.ts`
> - 标准示例页：`src/views/vant/Stage4-1CarInsuranceHook.vue`（车险投保）
> - 旧版对照页：`src/views/vant/Stage4CarInsurance.vue`（未抽 hook，供对比）
>
> 目标：拿到任意「列表 + 增删改查 + 权限」的接口，10 分钟内产出符合 PICC 设计标准的 Vant4 页面。

---

## 一、Hook 能帮你做什么

`useCrudList<T, F, Q>` 把下列公共逻辑一次性封装，页面里只写「业务特有」部分：

| 能力 | Hook 返回 | 说明 |
|---|---|---|
| 列表无限加载 | `list / loading / finished / refreshing / onLoad / onRefresh / onSearch` | 基于 `van-list` + `van-pull-refresh` |
| 查询条件 | `query`（响应式） | 自动合并 `page/pageSize` 传给 `api.list` |
| 新增 / 编辑 | `formVisible / isEdit / form / openCreate / openEdit / submit / resetForm` | 表单复用同一 `form`，按 `isEdit` 切换 |
| 详情 | `detailVisible / detailItem / openDetail` | |
| 删除 | `showDeleteDialog / confirmDelete / doDelete` | 配合 `van-dialog` |
| 权限控制 | `permTick / permCodes / hasPerm / currentRole` | 共享 `usePermission` 单例，角色切换自动重渲染 |
| 操作日志 | `logs / addLog`（需 `enableLog: true`） | |

**约定（必须遵守，否则类型报错）**：
1. 列表项类型 `T` 必须带 `id: number`。
2. `api.update` 接收「含 `id` 的完整表单 `F`」（与 `car-insurance` 模块一致）。若你后端是 `update(id, data)`，请在页面层包一层再传入。
3. 权限码 = `permissionPrefix:action`，`action ∈ create|edit|view|delete`。无前缀则直接用 `action` 作为权限码。

### Hook 入参 `UseCrudListOptions`

```ts
useCrudList<T extends { id: number }, F, Q extends Record<string, any>>({
  api: {                 // CRUD 接口集合（create/update/remove 缺省则对应操作不可用）
    list, create?, update?, remove?, detail?
  },
  initialForm: F,        // 表单初始值（必填，用于 resetForm 与 openCreate）
  initialQuery?: Q,      // 查询初始条件（含 keyword/status/自定义筛选）
  pageSize?: number,     // 默认 10
  permissionPrefix?: string, // 如 'car' → car:create / car:edit ...
  permissionActions?: Partial<Record<'create'|'edit'|'view'|'delete', string>>, // 自定义后缀
  enableLog?: boolean,   // 默认 false
})
```

### Hook 返回（模板中可直接用）

```ts
{ loading, refreshing, finished, list, page, pageSize, query,
  onSearch, onLoad, onRefresh,
  isEdit, editingId, form, formVisible, submitting, resetForm, openCreate, openEdit, submit,
  detailVisible, detailItem, openDetail,
  deleteId, showDeleteDialog, confirmDelete, doDelete,
  permTick, permCodes, hasPerm, currentRole, permissions, loaded, loadPermissions,
  logs, addLog }
```

- `permCodes` 是 computed：`{ create, edit, view, delete }` 字符串，直接用于 `v-permission="permCodes.create"`。
- `permTick` 绑定到根节点 `:data-perm`，权限/角色变化时整页重渲染，指令 `updated` 重新求值。

---

## 二、从接口快速生成新页面（5 步）

假设后端给了列表接口 `/orders/list` 与类型 `Order`：

### 第 1 步：定义类型与 API（`src/api/modules/order.ts`）

```ts
import { get, post, put, del } from '../request'
import type { PageResult } from '../types'

export interface Order {
  id: number
  orderNo: string
  customer: string
  amount: number
  status: string
  createTime: string
}
export interface OrderQuery { keyword?: string; status?: string; page?: number; pageSize?: number }
export interface OrderForm {
  id?: number
  orderNo: string
  customer: string
  amount: number
}

export const getOrderList = (p: OrderQuery) => get<PageResult<Order>>('/orders/list', p as any)
export const createOrder = (d: OrderForm) => post<Order>('/orders', d as any)
export const updateOrder = (d: OrderForm) => put<Order>('/orders', d as any)
export const deleteOrder = (id: number) => del<void>('/orders', { id } as any)
```

### 第 2 步：新建页面 `OrderList.vue`，脚本只写「特有」部分

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { getOrderList, createOrder, updateOrder, deleteOrder } from '@/api/modules/order'
import type { Order, OrderForm, OrderQuery } from '@/api/modules/order'
import { useCrudList } from '@/composables/useCrudList'

const {
  loading, refreshing, finished, list, query,
  onSearch, onLoad, onRefresh,
  form, formVisible, isEdit, submitting, openCreate, openEdit, submit,
  detailVisible, detailItem, openDetail,
  showDeleteDialog, confirmDelete, doDelete,
  permTick, permCodes,
} = useCrudList<Order, OrderForm, OrderQuery>({
  api: { list: getOrderList, create: createOrder, update: updateOrder, remove: deleteOrder },
  initialForm: { orderNo: '', customer: '', amount: 0 },
  initialQuery: { keyword: '', status: '' },
  permissionPrefix: 'order',
})
// 状态标签、局部 Picker 等「业务特有」状态写这里
const statusTabs = [{ name: '全部', value: '' }, { name: '待付款', value: '待付款' }]
</script>
```

### 第 3 步：模板套用「标准骨架」

```vue
<template>
  <div class="picc-page" :data-perm="permTick">
    <van-nav-bar title="订单管理" class="van-nav-bar--picc-primary" left-arrow />
    <div class="picc-header-gradient">
      <p class="header-title">订单管理</p>
      <p class="header-sub">实时掌握订单状态</p>
    </div>

    <van-search v-model="query.keyword" placeholder="搜索订单号/客户" show-action @search="onSearch" @clear="onSearch" />
    <van-tabs :active="query.status" @change="(t) => { query.status = t.value; onSearch() }">
      <van-tab v-for="t in statusTabs" :key="t.value" :title="t.name" :name="t.value" />
    </van-tabs>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div v-for="item in list" :key="item.id" class="picc-card" @click="openDetail(item)">
          <div class="ci-card-header">
            <span class="ci-plate">{{ item.orderNo }}</span>
            <van-tag :color="statusColor(item.status)" text-color="#fff">{{ item.status }}</van-tag>
          </div>
          <div class="ci-card-actions">
            <van-button size="small" icon="eye-o" plain type="primary" v-permission="permCodes.view" @click.stop="openDetail(item)">详情</van-button>
            <van-button size="small" icon="edit" plain type="primary" v-permission="permCodes.edit" @click.stop="openEdit(item)">编辑</van-button>
            <van-button size="small" icon="delete-o" plain type="danger" v-permission="permCodes.delete" @click.stop="confirmDelete(item)">删除</van-button>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <van-button class="ci-fab" type="primary" icon="plus" round v-permission="permCodes.create" @click="openCreate">新增订单</van-button>

    <!-- 新增/编辑 Popup：用 form 绑定字段 -->
    <!-- 详情 Popup：用 detailItem 展示 -->
    <!-- 删除 Dialog：v-model:show="showDeleteDialog" @confirm="doDelete" -->
  </div>
</template>
```

### 第 4 步：补全 mock 权限（如需要演示 RBAC）

在 `src/mock/permission.ts` 按角色补齐 `order:create/edit/view/delete`，并加到 `allPermissionsDefine` 的分组里（参考现有 `car:*` 写法）。

### 第 5 步：注册路由

```ts
{ path: '/vant/order', name: 'vant-order', component: () => import('../views/vant/OrderList.vue') }
```

> 列表卡片、表单、详情三块是「业务特有」UI，可直接复制 `Stage4-1CarInsuranceHook.vue` 对应区块改写字段即可。

---

## 三、将旧页面改造成 Stage4-1 标准（4 步）

以任意「自己写了一堆 `ref` 管理列表/增删改」的旧 `.vue` 为例：

1. **抽逻辑**：把 `loading/refreshing/finished/list/page/keyword/activeStatus/fetchList/onLoad/onRefresh/onSearch`、`isEdit/editId/form/formPopupVisible/resetForm/openAdd/openEdit/submit`、`detail*`、`delete*` 全部删掉，改为调用 `useCrudList`。
2. **并查询**：旧页面里分散的筛选 `ref`（如 `filterType`、`filterBrand`）改为挂到 `query.*`（即 `initialQuery` 里声明），模板 `v-model="query.xxx"`，`fetchList` 自动带上。
3. **改权限**：删除手写的 `v-if="hasPerm(...)"` 显隐判断，改为 `v-permission="permCodes.xxx"`（指令自动隐藏）；ActionSheet 选项用 `hasPerm(code)` 过滤。
4. **换类名**：把页面自带的卡片/背景样式逐步替换为 PICC 设计类（见第四节），保证皮肤开启时统一风格、关闭时仍可一键撤销。

---

## 四、UI 设计规范（有 `vant-picc-skin` 时）

`vant-picc-skin` 激活后，下列类由全局皮肤 CSS 接管，**页面只需挂上类即可，不要自己写覆盖样式**：

| 类名 | 作用 | 皮肤开启效果 | 关闭时兜底 |
|---|---|---|---|
| `picc-page` | 页面根容器 | 浅灰画布背景 | 透明（页面自带 padding） |
| `picc-card` | 白卡片 | 白底 + 12px 圆角 + 轻阴影 | `:global(html:not(.picc-skin))` 提供等价白卡 |
| `van-nav-bar--picc-primary` | 导航栏红色变体 | 品牌红渐变 | 由 Vant 默认 |
| `picc-header-gradient` | 英雄头图 | 红→深红渐变 + 白字 | 同上 |
| `picc-notice-warm` | 合规提示条 | 暖红底 | 同上 |
| `picc-section-title` | 表单分区标题 | 红色左边框 + 加粗 | 同上 |
| `picc-price` | 价格文字 | 品牌红 `#d71920` | `:global(html:not(.picc-skin)) .ci-price` 兜底红 |
| `picc-number-display` | 数字展示 | DIN 等宽数字体 | 同上 |

### 必须遵守的 UI 约定

1. **根节点**：列表页根 `div` 同时挂 `picc-page` 与 `:data-perm="permTick"`，例：`<div class="ci-page picc-page" :data-perm="permTick">`。
2. **卡片列表项**：用 `class="ci-card picc-card"`，内部三段式 `ci-card-header / ci-card-body / ci-card-actions`（头：主标识+状态 tag；体：信息行；脚：操作按钮）。
3. **主按钮（PILL 全圆角）**：`van-button` 加 `round`，提交/新增用 `type="primary"`（品牌红）。
4. **状态标签**：用 `van-tag :color="statusColor(status)" text-color="#fff"`，颜色映射集中在一个 `statusColor()` 函数里（绿=生效、橙=待审、灰=过期）。
5. **详情/表单弹层**：详情用 `position="bottom"` 高度 75%；表单用 `position="right"` 全屏，内部 `form-scroll picc-page` 滚动，分区用 `picc-section-title` 分隔。
6. **悬浮新增（FAB）**：`class="ci-fab"` + `round` + `v-permission`，固定底部居中，最大宽 480px。
7. **电话脱敏**：列表展示用 `phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')`。
8. **Toast / Notify**：无需处理，全局 CSS `vant-picc.css` 已修复「白底白字」（Toast 深灰底；Notify 按类型彩色底）。

### 关闭皮肤时的兜底写法（保留可一键撤销能力）

皮肤关闭后 `.picc-card` 等类不再生效，页面需用 `:global(html:not(.picc-skin))` 提供等价基础样式，例如：

```css
:global(html:not(.picc-skin)) .ci-card {
  margin: 8px 12px; padding: 12px 16px;
  background: #fff; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
:global(html:not(.picc-skin)) .ci-price { color: #d71920; }
```

---

## 五、权限码与 mock 数据速查

- 页面用 `permissionPrefix: 'xxx'` → 生成 `xxx:create / xxx:edit / xxx:view / xxx:delete`。
- 按钮：`v-permission="permCodes.create"`（单个）或 `v-permission="[permCodes.view, permCodes.edit, permCodes.delete]"`（OR）。
- ActionSheet：`actions.filter(a => hasPerm(a.perm))`。
- `src/mock/permission.ts`：在对应角色数组追加码，并加到 `allPermissionsDefine` 的新分组（如「订单模块权限」）。角色梯度建议：`admin/manager` 全有、`editor` 无 `delete`、`viewer` 仅 `view`。

---

## 六、验证清单

- [ ] `pnpm dev` 打开该页，列表可下拉刷新、上拉加载更多。
- [ ] 在 Stage6 切换角色后回到本页，操作按钮随权限显隐（角色切换即时生效）。
- [ ] 新增/编辑提交后列表自动刷新；删除二次确认后刷新。
- [ ] 开启 `vant-picc-skin`：导航红渐变、白卡 12px 圆角、价格红色、Toast/Notify 正常可见。
- [ ] 关闭皮肤：上述 PICC 类由 `:global(html:not(.picc-skin))` 兜底，布局不塌。
