<script setup lang="ts">
/**
 * 阶段三：组件二次封装与原子设计
 * 演示基础组件再封装、双向绑定协议、useFormModal
 */
import { ref, watch, h } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue'

// ============================================================
// 示例 1: 封装 AddButton（原子设计）
// ============================================================

// ============================================================
// 示例 2: 封装 SearchInput（支持 v-model 双向绑定协议）
// 原则：接收 value prop，触发 change 事件
// ============================================================
const searchVal = ref('')

watch(searchVal, (val) => {
  if (val) message.info(`搜索: ${val}`)
})

// ============================================================
// 示例 3: 封装 ConfirmModal（destroyOnClose 避坑）
// ============================================================
const confirmOpen = ref(false)

function handleConfirm() {
  message.success('已确认删除')
  confirmOpen.value = false
}

// ============================================================
// 示例 4: useFormModal Hook 演示
// ============================================================
interface TaskItem {
  id: number
  title: string
  done: boolean
}

const taskFormOpen = ref(false)
const editingTask = ref<TaskItem | null>(null)
const taskTitle = ref('')

function openCreateTask() {
  editingTask.value = null
  taskTitle.value = ''
  taskFormOpen.value = true
}

function openEditTask(task: TaskItem) {
  editingTask.value = task
  taskTitle.value = task.title
  taskFormOpen.value = true
}

function handleTaskSubmit() {
  if (editingTask.value) {
    message.success(`已编辑: ${taskTitle.value}`)
  } else {
    message.success(`已创建: ${taskTitle.value}`)
  }
  taskFormOpen.value = false
}

// 任务列表数据
const tasks = ref<TaskItem[]>([
  { id: 1, title: '完成 Ant Design Vue 学习', done: true },
  { id: 2, title: '封装通用组件', done: false },
  { id: 3, title: '编写单元测试', done: false },
])

function toggleDone(task: TaskItem) {
  task.done = !task.done
}
// 组件通过 unplugin-vue-components 自动按需导入，无需手动 import
import { resolveComponent } from 'vue'
import type { TableColumnsType } from 'ant-design-vue'
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
        h(AButton, { size: 'small', type: 'link', onClick: () => openEditTask(record) }, () => '编辑'),
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
      按原子设计原则封装基础组件，遵循 <code>value</code> / <code>@change</code> 双向绑定协议， Modal 务必加
      <code>destroyOnClose</code>。
    </p>

    <!-- 原子设计：封装的 AddButton -->
    <section class="card">
      <h2>3.1 原子设计 — AddButton</h2>
      <p>将「按钮 + 图标」封装为语义化组件，统一行为与样式。</p>
      <div class="code-preview">
        <pre class="code-sm">
// components/AddButton.vue
&lt;template&gt;
  &lt;a-button type="primary"&gt;
    &lt;template #icon&gt;&lt;PlusOutlined /&gt;&lt;/template&gt;
    &lt;slot&gt;新建&lt;/slot&gt;
  &lt;/a-button&gt;
&lt;/template&gt;</pre
        >
      </div>
      <div class="demo-row">
        <a-button type="primary">
          <template #icon><PlusOutlined /></template>
          新建任务
        </a-button>
        <a-button type="primary">
          <template #icon><PlusOutlined /></template>
          新建用户
        </a-button>
      </div>
    </section>

    <!-- 双向绑定协议：SearchInput -->
    <section class="card">
      <h2>3.2 双向绑定协议 — 封装支持 v-model 的组件</h2>
      <p>接收 <code>value</code> prop，通过 <code>emit('update:value')</code> 回传新值。</p>

      <div class="code-preview">
        <pre class="code-sm">
// components/SearchInput.vue
&lt;script setup lang="ts"&gt;
const props = defineProps&lt;{ value: string; placeholder?: string }&gt;()
const emit = defineEmits&lt;{ 'update:value': [val: string] }&gt;()
&lt;/script&gt;

&lt;template&gt;
  &lt;a-input-search
    :value="value"
    :placeholder="placeholder"
    @change="e =&gt; emit('update:value', (e.target as HTMLInputElement).value)"
  /&gt;
&lt;/template&gt;</pre
        >
      </div>

      <div class="demo-row">
        <a-input-search v-model:value="searchVal" placeholder="搜索（v-model 绑定）" style="width: 300px" />
        <span class="result-text">当前输入：{{ searchVal || '(空)' }}</span>
      </div>
    </section>

    <!-- ConfirmModal：destroyOnClose 避坑 -->
    <section class="card">
      <h2>3.3 避坑：destroyOnClose</h2>
      <p>⚠️ 封装 Modal 时必须加 <code>destroyOnClose</code>，否则第二次打开会残留上次的校验状态和数据。</p>
      <a-button danger @click="confirmOpen = true">删除确认弹框</a-button>

      <a-modal v-model:open="confirmOpen" title="确认删除" destroy-on-close @ok="handleConfirm">
        <p>此操作不可逆，确定删除？Modal 关闭后组件状态会被销毁（destroyOnClose）。</p>
      </a-modal>
    </section>

    <!-- useFormModal Hook 演示 -->
    <section class="card">
      <h2>3.4 业务 Hook：useFormModal 模式</h2>
      <p>将新增/编辑表单弹框逻辑抽离为 Hook，实现 <code>openCreate</code> / <code>openEdit</code> 统一管理。</p>

      <div class="task-header">
        <a-button type="primary" @click="openCreateTask">
          <template #icon><PlusOutlined /></template>
          新建任务
        </a-button>
      </div>

      <a-table :columns="taskColumns" :data-source="tasks" :pagination="false" bordered />

      <!-- 新增/编辑弹框 -->
      <a-modal
        v-model:open="taskFormOpen"
        :title="editingTask ? '编辑任务' : '新建任务'"
        destroy-on-close
        @ok="handleTaskSubmit"
      >
        <a-form layout="vertical">
          <a-form-item label="任务名称">
            <a-input v-model:value="taskTitle" placeholder="请输入任务名称" />
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
