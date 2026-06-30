<script setup lang="ts">
/**
 * 阶段二：核心组件与开发规范
 * 演示 Form 表单、Table 表格、Modal/Drawer 弹框
 */
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'

// ===== Form 表单 =====
interface UserForm {
  name: string
  email: string
  role: string
  status: boolean
  region: string
  bio: string
}

const formRef = ref<FormInstance>()
const formState = reactive<UserForm>({
  name: '',
  email: '',
  role: '',
  status: true,
  region: '',
  bio: '',
})

const formRules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

function handleSubmit() {
  formRef.value?.validate().then(() => {
    message.success('提交成功：' + JSON.stringify(formState))
  })
}

function handleReset() {
  formRef.value?.resetFields()
}

// 模拟编辑回显
// 注意：antdv 4.x 移除了 setFieldsValue，直接修改 reactive model 即可
function simulateEdit() {
  Object.assign(formState, {
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'editor',
    status: true,
    region: '上海',
    bio: 'Vue 开发者',
  })
  message.info('已回显编辑数据')
}

// ===== Table 表格 =====
interface DataItem {
  key: number
  name: string
  age: number
  address: string
  tags: string[]
}

const tableData = ref<DataItem[]>([
  { key: 1, name: '张三', age: 28, address: '上海市普陀区金沙江路 1518 弄', tags: ['developer', 'vue'] },
  { key: 2, name: '李四', age: 32, address: '北京市朝阳区望京 SOHO', tags: ['designer'] },
  { key: 3, name: '王五', age: 25, address: '深圳市南山区科技园', tags: ['manager', 'react'] },
  { key: 4, name: '王一', age: 25, address: '深圳市南山区科技园', tags: ['manager', 'react'] },
  { key: 5, name: '王二', age: 25, address: '深圳市南山区科技园', tags: ['manager', 'react'] },
  { key: 6, name: '王三', age: 25, address: '深圳市南山区科技园', tags: ['manager', 'react'] },
])

const columns: TableColumnsType = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age', sorter: (a: DataItem, b: DataItem) => a.age - b.age },
  { title: '地址', dataIndex: 'address', key: 'address' },
  { title: '标签', dataIndex: 'tags', key: 'tags' },
]

// 标签颜色映射，供 bodyCell 插槽使用
function getTagColor(tag: string) {
  if (tag === 'vue') return '#52c41a'
  if (tag === 'react') return '#1677ff'
  return 'default'
}

// ===== Modal 弹框 =====
const modalOpen = ref(false)
const modalData = ref('')

function showModal() {
  modalData.value = '这是 Modal 弹框内容'
  modalOpen.value = true
}

function handleModalOk() {
  message.success('确认操作')
  modalOpen.value = false
}

// ===== Drawer 抽屉 =====
const drawerOpen = ref(false)

function handleDrawerOk() {
  message.success('Drawer 确认')
  drawerOpen.value = false
}
</script>

<template>
  <div class="stage-page">
    <h1>阶段二：核心组件与开发规范</h1>
    <p class="subtitle">
      拥抱 <code>&lt;script setup lang="ts"&gt;</code>，掌握 Form 表单校验、Table 表格、Modal/Drawer 弹框。
    </p>

    <!-- Form 表单 -->
    <section class="card">
      <h2>2.1 Form 表单校验</h2>
      <p>⚠️ antdv 4.x 已移除 <code>setFieldsValue</code>，直接修改 <code>model</code> 对象即可实现回显。</p>
      <a-form
        ref="formRef"
        :model="formState"
        :rules="formRules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
        style="max-width: 600px"
      >
        <a-form-item label="用户名" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formState.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="角色" name="role">
          <a-select
            v-model:value="formState.role"
            placeholder="请选择角色"
            :options="[
              { value: 'admin', label: '管理员' },
              { value: 'editor', label: '编辑' },
              { value: 'viewer', label: '访客' },
            ]"
          />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-switch v-model:checked="formState.status" />
        </a-form-item>
        <a-form-item label="地区" name="region">
          <a-input v-model:value="formState.region" placeholder="请输入所在地区" />
        </a-form-item>
        <a-form-item label="简介" name="bio">
          <a-textarea v-model:value="formState.bio" placeholder="请输入个人简介" :rows="3" />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 4, span: 18 }">
          <a-space>
            <a-button type="primary" @click="handleSubmit">提交</a-button>
            <a-button @click="handleReset">重置</a-button>
            <a-button type="dashed" @click="simulateEdit">模拟编辑回显</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </section>

    <!-- Table 表格 -->
    <section class="card">
      <h2>2.2 Table 表格</h2>
      <p>支持列排序、<code>#bodyCell</code> 插槽自定义渲染（antdv 4.x 推荐）、分页。</p>
      <a-table :columns="columns" :data-source="tableData" :pagination="{ pageSize: 5 }" bordered>
        <template #bodyCell="{ column, text }">
          <template v-if="column.key === 'tags'">
            <a-tag v-for="tag in text" :key="tag" :color="getTagColor(tag)" style="margin-right: 4px">
              {{ tag }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </section>

    <!-- Modal 弹框 -->
    <section class="card">
      <h2>2.3 Modal 弹框 + Drawer 抽屉</h2>
      <p>⚠️ 4.x 中使用 <code>open</code> 而非 <code>visible</code>；二次封装务必加 <code>destroyOnClose</code>。</p>
      <a-space>
        <a-button type="primary" @click="showModal">打开 Modal</a-button>
        <a-button @click="drawerOpen = true">打开 Drawer</a-button>
      </a-space>

      <a-modal v-model:open="modalOpen" title="Modal 标题" @ok="handleModalOk">
        <p>{{ modalData }}</p>
      </a-modal>

      <a-drawer v-model:open="drawerOpen" title="Drawer 标题" placement="right" @close="handleDrawerOk">
        <p>这是 Drawer 抽屉内容</p>
        <p>使用 <code>open</code> 控制显隐，非 <code>visible</code></p>
      </a-drawer>
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
</style>
