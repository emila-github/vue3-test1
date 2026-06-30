<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { defineStore } from 'pinia'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'

// ─── 待办事项 Store ───
const useTodoStore = defineStore('todo-demo', () => {
  const list = ref([
    { id: 1, title: '学习 Pinia Setup Store', done: true },
    { id: 2, title: '掌握 State 与 Getters', done: true },
    { id: 3, title: '练习 Actions 异步操作', done: false },
  ])
  let nextId = 4

  const doneCount = computed(() => list.value.filter((i) => i.done).length)
  const totalCount = computed(() => list.value.length)

  // 同步 action
  function addTodo(title: string) {
    list.value.push({ id: nextId++, title, done: false })
    return nextId - 1
  }

  // 异步 action — 模拟 API 请求
  async function addTodoAsync(title: string) {
    // 模拟网络延迟
    await new Promise((r) => setTimeout(r, 800))
    list.value.push({ id: nextId++, title, done: false })
    return nextId - 1
  }

  function toggleDone(id: number) {
    const item = list.value.find((i) => i.id === id)
    if (item) item.done = !item.done
  }

  function removeTodo(id: number) {
    list.value = list.value.filter((i) => i.id !== id)
  }

  return { list, nextId, doneCount, totalCount, addTodo, addTodoAsync, toggleDone, removeTodo }
})()

const todoStore = useTodoStore()
const { list, doneCount, totalCount } = storeToRefs(todoStore)

// 表单
const newTitle = ref('')
const adding = ref(false)
const actionLog = ref<string[]>([])

async function handleAdd() {
  if (!newTitle.value.trim()) {
    message.warning('请输入待办内容')
    return
  }
  todoStore.addTodo(newTitle.value.trim())
  addLog(`同步 action → addTodo("${newTitle.value}")`)
  newTitle.value = ''
}

async function handleAddAsync() {
  if (!newTitle.value.trim()) {
    message.warning('请输入待办内容')
    return
  }
  adding.value = true
  addLog(`⏳ 异步 action → addTodoAsync("${newTitle.value}") 开始...`)
  await todoStore.addTodoAsync(newTitle.value.trim())
  adding.value = false
  addLog(`✅ 异步 action 完成，新 id=${todoStore.nextId - 1}`)
  message.success('添加成功')
  newTitle.value = ''
}

function handleToggle(id: number) {
  todoStore.toggleDone(id)
  addLog(`toggleDone(${id})`)
}

function handleRemove(id: number) {
  todoStore.removeTodo(id)
  addLog(`removeTodo(${id})`)
}

// $onAction — 监听所有 action
const actionWatcher = ref(true)
function setupActionWatcher() {
  const unsubscribe = todoStore.$onAction(({ name, store, args, after, onError }) => {
    addLog(`🔍 $onAction 触发 → ${name}(${JSON.stringify(args)})`)

    after(() => {
      addLog(`   ↳ after: ${name} 执行完成`)
    })

    onError((err) => {
      addLog(`   ↳ onError: ${name} 出错 → ${err}`)
    })
  })
  return unsubscribe
}

const unwatch = ref<(() => void) | null>(setupActionWatcher())

function toggleWatcher() {
  if (unwatch.value) {
    unwatch.value()
    unwatch.value = null
    actionWatcher.value = false
    message.info('$onAction 监听已关闭')
  } else {
    unwatch.value = setupActionWatcher()
    actionWatcher.value = true
    message.info('$onAction 监听已开启')
  }
}

function addLog(msg: string) {
  actionLog.value.push(msg)
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 3：Actions 与异步操作</h1>
      <p>定义同步/异步 actions、使用 <code>$onAction</code> 监听、完整 CRUD 实战。</p>
    </header>

    <!-- 3.1 定义 Actions -->
    <section class="card">
      <h2>3.1 定义同步与异步 Actions</h2>
      <p>
        Setup Store 中 action 就是普通函数，<strong>async/await</strong> 定义异步 action。 Pinia 中 action 可以直接修改
        state，无需 mutations。
      </p>
      <pre class="code-block">
export const useTodoStore = defineStore('todo', () => {
  const list = ref([...])

  // 同步 action
  function addTodo(title: string) {
    list.value.push({ id: nextId++, title, done: false })
  }

  // 异步 action — 模拟后端请求
  async function fetchTodos() {
    const res = await fetch('/api/todos')
    list.value = await res.json()
  }

  // action 可以有返回值
  async function createTodo(title: string) {
    const res = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title }),
    })
    const newTodo = await res.json()
    list.value.push(newTodo)
    return newTodo.id  // 返回 ID 给调用方
  }

  return { list, addTodo, fetchTodos, createTodo }
})</pre
      >
      <div class="tip-box">
        <strong>注意事项：</strong>
        <ul>
          <li>action 中的 <code>this</code> 只在 Options Store 中可用</li>
          <li>Setup Store 中直接用闭包变量，不需要 <code>this</code></li>
          <li>异步 action 的错误会传播，调用方可以 <code>try/catch</code></li>
        </ul>
      </div>
    </section>

    <!-- 3.2 $onAction -->
    <section class="card">
      <h2>3.2 $onAction：监听所有 Action</h2>
      <p>
        <code>$onAction</code> 可以在任意 action 调用前后执行回调，支持 <code>after</code>、<code>onError</code> 钩子。
      </p>
      <pre class="code-block">
const unsubscribe = store.$onAction(({ name, store, args, after, onError }) => {
  console.log(`Action "${name}" 开始执行，参数:`, args)

  after((result) => {
    console.log(`Action "${name}" 完成，返回值:`, result)
  })

  onError((error) => {
    console.error(`Action "${name}" 出错:`, error)
  })
})

// 停止监听
unsubscribe()</pre
      >
    </section>

    <!-- 3.3 待办事项演示 -->
    <section class="card">
      <h2>3.3 待办事项 Actions 演示</h2>

      <!-- 进度条 -->
      <div class="progress-bar-wrap">
        <div class="progress-bar" :style="{ width: totalCount ? (doneCount / totalCount) * 100 + '%' : '0%' }" />
      </div>
      <p style="font-size: 13px; color: #999; margin: 0 0 12px">已完成 {{ doneCount }} / {{ totalCount }}</p>

      <!-- 添加 -->
      <div style="display: flex; gap: 8px; margin-bottom: 16px">
        <a-input v-model:value="newTitle" placeholder="输入新的待办事项" style="flex: 1" />
        <a-button type="primary" @click="handleAdd">同步添加</a-button>
        <a-button :loading="adding" @click="handleAddAsync">异步添加（0.8s）</a-button>
      </div>

      <!-- 列表 -->
      <a-table
        :columns="[
          { title: '状态', key: 'done', width: 60 },
          { title: '待办内容', dataIndex: 'title', key: 'title' },
          { title: '操作', key: 'action', width: 140 },
        ]"
        :data-source="list"
        :pagination="false"
        size="small"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'done'">
            <span
              :style="{ color: record.done ? '#52c41a' : '#d9d9d9', fontSize: '18px', cursor: 'pointer' }"
              @click="handleToggle(record.id)"
            >
              {{ record.done ? '✅' : '⬜' }}
            </span>
          </template>
          <template v-if="column.key === 'action'">
            <a-button size="small" danger @click="handleRemove(record.id)">删除</a-button>
          </template>
        </template>
      </a-table>
    </section>

    <!-- 3.4 $onAction 演示 -->
    <section class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
        <h2 style="margin: 0">3.4 $onAction 监听日志</h2>
        <a-button size="small" :type="actionWatcher ? 'primary' : 'default'" @click="toggleWatcher">
          {{ actionWatcher ? '监听中' : '已关闭' }}
        </a-button>
      </div>
      <div v-if="actionLog.length === 0" style="color: #999; font-size: 13px">操作待办事项查看 $onAction 日志...</div>
      <div v-else>
        <div v-for="(item, i) in actionLog" :key="i" class="log-item">
          <span class="log-num">{{ i + 1 }}</span>
          <span>{{ item }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin: 0 0 6px;
}

.page-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin: 0 0 12px;
  font-size: 18px;
  color: #333;
}

.card p {
  font-size: 14px;
  color: #555;
  line-height: 1.7;
  margin: 0 0 12px;
}

.card p code,
.card li code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
  color: #d63384;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  margin: 12px 0;
  white-space: pre;
  tab-size: 2;
}

.tip-box {
  background: #fffbe6;
  border-left: 3px solid #faad14;
  padding: 12px 16px;
  border-radius: 4px;
  margin: 12px 0;
  font-size: 13px;
  color: #595959;
}

.tip-box ul {
  margin: 6px 0 0;
  padding-left: 20px;
}

.tip-box li {
  margin-bottom: 4px;
}

.progress-bar-wrap {
  background: #f0f0f0;
  border-radius: 100px;
  height: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  border-radius: 100px;
  transition: width 0.3s ease;
}

.log-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  color: #555;
}

.log-num {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e6f4ff;
  color: #1677ff;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
}
</style>
