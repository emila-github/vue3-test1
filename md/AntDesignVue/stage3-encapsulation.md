# 阶段三：组件二次封装与原子设计

## 学习目标

- 掌握组件二次封装的原则和模式
- 理解双向绑定协议（v-model 支持）
- 了解原子设计原则在组件封装中的应用

## 目录规范

```
src/
├── api/              # 按业务模块拆分 API
│   └── modules/
│       └── user.ts
├── components/       # 全局通用组件
│   ├── AddButton.vue
│   ├── SearchInput.vue
│   └── ConfirmModal.vue
└── hooks/            # 业务 Hook
    └── useFormModal.ts
```

## 原子设计原则

将基础组件再封装为语义化组件，保持统一的行为和样式。

### AddButton 封装

将「按钮 + 图标」封装为独立的语义化组件：

```vue
<!-- components/AddButton.vue -->
<script setup lang="ts">
defineProps<{ text?: string }>()
</script>

<template>
  <a-button type="primary">
    <template #icon><PlusOutlined /></template>
    <slot>{{ text || '新建' }}</slot>
  </a-button>
</template>
```

使用时：

```vue
<AddButton text="新建用户" @click="openCreate" />
<AddButton @click="openCreateTask">新建任务</AddButton>
```

## 双向绑定协议

二次封装组件时，遵循标准的 v-model 协议，使组件能无缝作为表单项使用。

### 封装 SearchInput（支持 v-model）

```vue
<!-- components/SearchInput.vue -->
<script setup lang="ts">
const props = defineProps<{
  value: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:value': [val: string]
}>()

function onInput(val: string) {
  emit('update:value', val)
}
</script>

<template>
  <a-input-search
    :value="value"
    :placeholder="placeholder || '搜索...'"
    @change="(e: any) => onInput(e.target.value)"
  />
</template>
```

使用时：

```vue
<SearchInput v-model:value="keyword" placeholder="搜索用户" />
```

### 双向绑定协议规则

| 项目 | 约定 |
|------|------|
| props | 接收 `value` |
| emits | 触发 `update:value` |
| 使用 | 父组件用 `v-model:value` |

> 如果只发 `v-model`（不带参数），需改为 `modelValue` / `update:modelValue`。

## 避坑：destroyOnClose

封装 Modal/Drawer 时必须加上 `destroyOnClose` 属性：

```vue
<!-- ❌ 错误：第二次打开残留上次校验状态 -->
<a-modal v-model:open="visible" @ok="handleOk">
  <a-form>...</a-form>
</a-modal>

<!-- ✅ 正确：关闭时销毁组件状态 -->
<a-modal v-model:open="visible" destroy-on-close @ok="handleOk">
  <a-form>...</a-form>
</a-modal>
```

**原因**：不使用 `destroyOnClose` 时，Modal 关闭后组件实例不会被销毁，第二次打开会残留：
- 表单校验错误状态
- 输入框已填入的值
- 下拉框已选项

## useFormModal Hook 模式

将新增/编辑表单弹框逻辑抽离为可复用的 Hook：

```ts
// hooks/useFormModal.ts
import { ref } from 'vue'

export function useFormModal<T>() {
  const visible = ref(false)
  const editingRecord = ref<T | null>(null)
  const isEdit = ref(false)

  function openCreate() {
    editingRecord.value = null
    isEdit.value = false
    visible.value = true
  }

  function openEdit(record: T) {
    editingRecord.value = record
    isEdit.value = true
    visible.value = true
  }

  function close() {
    visible.value = false
  }

  return { visible, editingRecord, isEdit, openCreate, openEdit, close }
}
```

使用：

```vue
<script setup lang="ts">
const { visible, isEdit, openCreate, openEdit, close } = useFormModal<Task>()
</script>

<template>
  <a-button @click="openCreate">新建</a-button>
  <a-button @click="openEdit(task)">编辑</a-button>
  <a-modal v-model:open="visible" destroy-on-close @ok="close">
    ...
  </a-modal>
</template>
```

## 示例页面

打开 `/antd/stage3` 查看 AddButton 封装、v-model 协议、destroyOnClose、useFormModal 的交互式演示。
