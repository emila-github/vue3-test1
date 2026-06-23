# 阶段二：核心组件与开发规范

## 学习目标

- 掌握 Form 表单的数据绑定与校验
- 掌握 Table 表格的列配置与自定义渲染
- 掌握 Modal/Drawer 弹框的 API 变更

## 编码规范

### 拥抱 Composition API

```vue
<script setup lang="ts">
// ✅ 推荐：<script setup> + TypeScript
import { ref } from 'vue'

const count = ref(0)
</script>
```

## Form 表单

### 基础使用

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'ant-design-vue'

const formRef = ref<FormInstance>()
const formState = reactive({
  name: '',
  email: '',
  role: '',
})

const rules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

function handleSubmit() {
  formRef.value?.validate().then(() => {
    // 提交逻辑
  })
}
</script>

<template>
  <a-form ref="formRef" :model="formState" :rules="rules">
    <a-form-item label="用户名" name="name">
      <a-input v-model:value="formState.name" />
    </a-form-item>
    <a-form-item label="邮箱" name="email">
      <a-input v-model:value="formState.email" />
    </a-form-item>
    <a-form-item label="角色" name="role">
      <a-select
        v-model:value="formState.role"
        :options="[
          { value: 'admin', label: '管理员' },
          { value: 'editor', label: '编辑' },
        ]"
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="handleSubmit">提交</a-button>
      <a-button @click="formRef?.resetFields()">重置</a-button>
    </a-form-item>
  </a-form>
</template>
```

### 关键要点

1. **避免过度依赖 v-model**：推荐通过 `:value` 和 `@change` 事件控制数据流
2. **自定义校验规则必须返回 Promise**：否则触发 "async-validator" 警告
3. **编辑回显**：在 `mounted` / `onMounted` 结合 `nextTick` 使用 `form.setFieldsValue()`

### 编辑回显示例

```ts
import { nextTick, onMounted } from 'vue'

onMounted(() => {
  nextTick(() => {
    formRef.value?.setFieldsValue({
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'editor',
    })
  })
})
```

## Table 表格

### 列配置

```vue
<script setup lang="ts">
import type { TableColumnsType } from 'ant-design-vue'

interface DataItem {
  key: number
  name: string
  age: number
  address: string
  tags: string[]
}

const columns: TableColumnsType = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    sorter: (a: DataItem, b: DataItem) => a.age - b.age,
  },
  { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
  {
    title: '标签',
    key: 'tags',
    customRender: ({ text }: { text: string[] }) =>
      text?.map(t => <a-tag key={t}>{t}</a-tag>),
  },
]
</script>

<template>
  <a-table
    :columns="columns"
    :data-source="data"
    :pagination="{ pageSize: 10 }"
    bordered
  />
</template>
```

### 关键要点

- `dataIndex` 必须与数据源字段严格对应
- 使用 `customRender`（JSX）进行自定义列渲染
- 使用 `sorter` 函数实现列排序

## Modal / Drawer 弹框

### ⚠️ API 变更：visible → open

```vue
<!-- ❌ 3.x -->
<a-modal v-model:visible="show" />

<!-- ✅ 4.x -->
<a-modal v-model:open="show" />
```

### Modal 示例

```vue
<script setup lang="ts">
import { ref } from 'vue'

const modalOpen = ref(false)

function handleOk() {
  modalOpen.value = false
}
</script>

<template>
  <a-modal
    v-model:open="modalOpen"
    title="标题"
    @ok="handleOk"
  >
    <p>弹框内容</p>
  </a-modal>
</template>
```

### Drawer 抽屉

```vue
<a-drawer
  v-model:open="drawerOpen"
  title="抽屉标题"
  placement="right"
>
  <p>抽屉内容</p>
</a-drawer>
```

## 示例页面

打开 `/antd/stage2` 查看 Form 表单校验、Table 表格、Modal/Drawer 的交互式演示。
