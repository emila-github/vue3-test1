<script setup lang="ts">
/**
 * 阶段三：组件二次封装与原子设计
 * 演示基础组件再封装、双向绑定协议、useFormModal
 */
import { ref, h } from 'vue'
import { message } from 'ant-design-vue'
// 组件通过 unplugin-vue-components 自动按需导入，无需手动 import
import { resolveComponent } from 'vue'
import type { TableColumnsType } from 'ant-design-vue'
import AddButton from '@/components/AddButton.vue'
import SearchInput from '@/components/SearchInput.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useFormModal } from '@/composables/useFormModal'

// ============ 3.2 使用 SearchInput（v-model 双向绑定） ============
const searchVal = ref('')

// ============ 3.3 使用 ConfirmModal ============
const confirmOpen = ref(false)

function handleConfirm() {
  message.success('已确认删除')
  confirmOpen.value = false
}

// ============ 3.4 使用 useFormModal ============
interface TaskForm {
  id?: number
  title: string
}

const {
  open: taskFormOpen,
  isEdit: taskIsEdit,
  form: taskForm,
  openCreate,
  openEdit,
  handleSubmit: handleTaskSubmit,
} = useFormModal<TaskForm>({
  initialForm: { title: '' },
  onSubmit: (form, isEdit) => {
    if (isEdit) {
      const task = tasks.value.find((t) => t.id === form.id)
      if (task) task.title = form.title
      message.success(`已编辑: ${form.title}`)
    } else {
      tasks.value.push({ id: Date.now(), title: form.title, done: false })
      message.success(`已创建: ${form.title}`)
    }
  },
})

// ============ 任务列表 ============
interface TaskItem {
  id: number
  title: string
  done: boolean
}

const tasks = ref<TaskItem[]>([
  { id: 1, title: '完成 Ant Design Vue 学习', done: true },
  { id: 2, title: '封装通用组件', done: false },
  { id: 3, title: '编写单元测试', done: false },
])

function toggleDone(task: TaskItem) {
  task.done = !task.done
}

const taskColumns: TableColumnsType = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '任务', dataIndex: 'title', key: 'title' },
  {
    title: '状态',
    dataIndex: 'done',
    key: 'done',
    width: 100,
    customRender: ({ text }: { text: boolean }) => {
      const ATag = resolveComponent('a-tag')
      return h(ATag, { color: text ? '#52c41a' : '#fa8c16' }, () => (text ? '已完成' : '进行中'))
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    customRender: ({ record }: { record: TaskItem }) => {
      // resolveComponent API 获取组件
      const AButton = resolveComponent('a-button')
      const ASpace = resolveComponent('a-space')

      return h(ASpace, {}, () => [
        h(AButton, { size: 'small', type: 'link', onClick: () => openEdit(record) }, () => '编辑'),
        h(AButton, { size: 'small', type: 'link', onClick: () => toggleDone(record) }, () =>
          record.done ? '标为未完成' : '标为完成',
        ),
      ])
    },
  },
]
</script>

<template>
  <div class="stage-page">
    <h1>阶段三：组件二次封装与原子设计</h1>
    <p class="subtitle">
      按原子设计原则封装基础组件，遵循 <code>value</code> / <code>@change</code> 双向绑定协议，Modal 务必加
      <code>destroyOnClose</code>。
    </p>

    <!-- 3.1 使用封装后的 AddButton -->
    <section class="card">
      <h2>3.1 原子设计 — 使用封装的 AddButton</h2>
      <p>将「按钮 + 图标」封装为 <code>&lt;AddButton&gt;</code> 组件，统一行为与样式。</p>
      <div class="code-preview">
        <pre class="code-sm" v-pre>
// components/AddButton.vue
&lt;script setup lang="ts"&gt;
import { PlusOutlined } from '@ant-design/icons-vue'
defineProps&lt;{ label?: string }&gt;()
&lt;/script&gt;
&lt;template&gt;
  &lt;a-button type="primary"&gt;
    &lt;template #icon&gt;&lt;PlusOutlined /&gt;&lt;/template&gt;
    &lt;slot&gt;{{ label || '新建' }}&lt;/slot&gt;
  &lt;/a-button&gt;
&lt;/template&gt;</pre
        >
      </div>
      <p>实际使用：</p>
      <div class="demo-row">
        <AddButton label="新建任务" />
        <AddButton>新建用户</AddButton>
      </div>
    </section>

    <!-- 3.2 使用封装后的 SearchInput -->
    <section class="card">
      <h2>3.2 双向绑定协议 — 使用封装的 SearchInput</h2>
      <p>封装 <code>&lt;SearchInput&gt;</code>，支持 <code>v-model:value</code> 双向绑定。</p>
      <div class="code-preview">
        <pre class="code-sm" v-pre>
// 父组件使用
&lt;SearchInput v-model:value="searchVal" placeholder="搜索" /&gt;
&lt;span&gt;当前输入：{{ searchVal }}&lt;/span&gt;</pre
        >
      </div>
      <p>实际使用：</p>
      <div class="demo-row">
        <SearchInput v-model:value="searchVal" placeholder="搜索（封装组件 v-model）" />
        <span class="result-text">当前输入：{{ searchVal || '(空)' }}</span>
      </div>
    </section>

    <!-- 3.3 使用封装后的 ConfirmModal -->
    <section class="card">
      <h2>3.3 避坑：destroyOnClose — 使用封装的 ConfirmModal</h2>
      <p>⚠️ 封装 Modal 时必须加 <code>destroyOnClose</code>，封装为 <code>&lt;ConfirmModal&gt;</code> 统一管理。</p>
      <a-button danger @click="confirmOpen = true">删除确认弹框</a-button>

      <ConfirmModal
        v-model:open="confirmOpen"
        title="确认删除"
        content="此操作不可逆，确定删除？Modal 关闭后组件状态会被销毁（destroyOnClose）。"
        @ok="handleConfirm"
      />
    </section>

    <!-- 3.4 使用 useFormModal composable -->
    <section class="card">
      <h2>3.4 业务 Hook：使用 useFormModal</h2>
      <p>
        将新增/编辑表单弹框逻辑抽离为 <code>useFormModal</code> Hook，提供 <code>openCreate</code> /
        <code>openEdit</code> 统一管理。
      </p>
      <div class="code-preview">
        <pre class="code-sm">
// composables/useFormModal.ts
const { open, form, openCreate, openEdit, handleSubmit } = useFormModal({
  initialForm: { title: '' },
  onSubmit: (form, isEdit) => { /* 保存逻辑 */ },
})</pre
        >
      </div>

      <p>实际使用：</p>
      <div class="task-header">
        <AddButton label="新建任务" @click="openCreate" />
      </div>

      <a-table :columns="taskColumns" :data-source="tasks" :pagination="false" bordered />

      <!-- 新增/编辑弹框（由 useFormModal 驱动） -->
      <a-modal
        v-model:open="taskFormOpen"
        :title="taskIsEdit ? '编辑任务' : '新建任务'"
        destroy-on-close
        @ok="handleTaskSubmit"
      >
        <a-form layout="vertical">
          <a-form-item label="任务名称">
            <a-input v-model:value="taskForm.title" placeholder="请输入任务名称" />
          </a-form-item>
        </a-form>
      </a-modal>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: #f6f8fa;
  border-radius: 8px;
}

.subtitle code {
  background: #e8e8e8;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.card h2 {
  font-size: 16px;
  color: #333;
  margin: 0 0 8px 0;
}

.card p {
  color: #888;
  font-size: 13px;
  margin: 0 0 12px 0;
}

.card p code {
  background: #f5f5f5;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.code-preview {
  background: #1e1e1e;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 12px;
  overflow-x: auto;
}

.code-sm {
  color: #d4d4d4;
  font-size: 12px;
  line-height: 1.6;
  margin: 0;
  font-family: 'Fira Code', 'Consolas', monospace;
}

.demo-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.result-text {
  font-size: 13px;
  color: #1677ff;
}

.task-header {
  margin-bottom: 12px;
}
</style>
