<script setup lang="ts">
/**
 * Element Plus Stage 2: 核心组件
 * 演示 Form、Table、Dialog、Pagination、Tree 等高频组件
 */
import { ref, reactive, computed } from 'vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// ============ Form 表单 ============
const formRef = ref()
const formData = reactive({
  name: '',
  region: '',
  date: '',
  delivery: false,
  type: [],
  desc: '',
})
const rules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
  ],
  region: [{ required: true, message: '请选择区域', trigger: 'change' }],
}

function submitForm() {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      addLog(`表单提交成功：${JSON.stringify(formData)}`)
    } else {
      addLog('表单校验失败')
    }
  })
}

// ============ Table 表格 ============
const tableData = ref([
  { id: 1, name: '张三', age: 28, city: '北京', status: '在职' },
  { id: 2, name: '李四', age: 32, city: '上海', status: '在职' },
  { id: 3, name: '王五', age: 24, city: '广州', status: '离职' },
  { id: 4, name: '赵六', age: 36, city: '深圳', status: '在职' },
  { id: 5, name: '孙七', age: 29, city: '杭州', status: '在职' },
])

function handleEdit(row: { id: number; name: string }) {
  addLog(`编辑：${row.name} (ID: ${row.id})`)
}
function handleDelete(row: { id: number; name: string }) {
  addLog(`删除：${row.name} (ID: ${row.id})`)
  tableData.value = tableData.value.filter((item) => item.id !== row.id)
}

// ============ Dialog 对话框 ============
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const dialogForm = reactive({ name: '', city: '' })

function openDialog(type: 'add' | 'edit') {
  dialogType.value = type
  dialogVisible.value = true
  if (type === 'add') {
    dialogForm.name = ''
    dialogForm.city = ''
  }
}

function confirmDialog() {
  addLog(`${dialogType.value === 'add' ? '新增' : '编辑'}：${dialogForm.name} - ${dialogForm.city}`)
  dialogVisible.value = false
}

// ============ Pagination ============
const currentPage = ref(1)
const pageSize = ref(3)
const total = computed(() => tableData.value.length)
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return tableData.value.slice(start, start + pageSize.value)
})

// ============ 代码示例字符串（避免模板中 HTML 标签冲突） ============
const dialogCode = `<el-dialog v-model="visible" title="标题" width="400px">
  <p>对话框内容</p>
  <template #footer>
    <el-button @click="visible = false">取消</el-button>
    <el-button type="primary" @click="confirm">确认</el-button>
  </template>
</el-dialog>`

const treeCode = `<el-tree :data="treeData" default-expand-all node-key="id">
  <template #default="{ node, data }">
    <span>{{ node.label }} - {{ data.label }}</span>
  </template>
</el-tree>`
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 2：核心组件</h1>
      <p>深入学习 Form 表单校验、Table 数据表格、Dialog 弹窗、Pagination 分页等高频组件。</p>
    </header>

    <!-- 2.1 Form 表单 -->
    <section class="card">
      <h2>2.1 Form 表单校验</h2>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px" style="max-width:500px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="区域" prop="region">
          <el-select v-model="formData.region" placeholder="请选择区域" style="width:100%">
            <el-option label="北京" value="beijing" />
            <el-option label="上海" value="shanghai" />
            <el-option label="广州" value="guangzhou" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="formData.date" type="date" placeholder="选择日期" style="width:100%" />
        </el-form-item>
        <el-form-item label="类型">
          <el-checkbox-group v-model="formData.type">
            <el-checkbox label="前端" value="frontend" />
            <el-checkbox label="后端" value="backend" />
            <el-checkbox label="全栈" value="fullstack" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.desc" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="formRef?.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </section>

    <!-- 2.2 Table 表格 -->
    <section class="card">
      <h2>2.2 Table 数据表格</h2>
      <el-table :data="pagedData" border stripe style="width:100%" size="small">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="city" label="城市" />
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-tag v-if="scope?.row" :type="scope.row.status === '在职' ? 'success' : 'danger'" size="small">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="scope">
            <template v-if="scope?.row">
              <el-button size="small" link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" link type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:12px;text-align:right">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[2, 3, 5]"
          layout="total, sizes, prev, pager, next"
          size="small"
        />
      </div>
    </section>

    <!-- 2.3 Dialog 对话框 -->
    <section class="card">
      <h2>2.3 Dialog 对话框</h2>
      <div class="demo-row">
        <el-button type="primary" @click="openDialog('add')">新增用户</el-button>
        <el-button @click="openDialog('edit')">编辑用户</el-button>
      </div>
      <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增用户' : '编辑用户'" width="400px">
        <el-form :model="dialogForm" label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="dialogForm.name" />
          </el-form-item>
          <el-form-item label="城市">
            <el-input v-model="dialogForm.city" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmDialog">确认</el-button>
        </template>
      </el-dialog>
      <pre class="code-block">{{ dialogCode }}</pre>
    </section>

    <!-- 2.4 Tree 树形控件 -->
    <section class="card">
      <h2>2.4 Tree 树形控件</h2>
      <el-tree :data="[
        { label: '一级 1', children: [{ label: '二级 1-1' }, { label: '二级 1-2' }] },
        { label: '一级 2', children: [{ label: '二级 2-1' }] },
      ]" default-expand-all node-key="label" />
      <pre class="code-block">{{ treeCode }}</pre>
    </section>

    <!-- 操作日志 -->
    <section class="card">
      <h2>操作日志</h2>
      <div class="log-area">
        <div v-if="log.length === 0" class="log-empty">暂无操作记录</div>
        <div v-for="(item, i) in log" :key="i" class="log-item">{{ item }}</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}
.page-header { text-align: center; margin-bottom: 24px; }
.page-header h1 { font-size: 24px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; }

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; padding-bottom: 6px; border-bottom: 1px solid #f0f0f0; }

.demo-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 16px; }

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre;
  margin-top: 12px;
}

.log-area { max-height: 200px; overflow-y: auto; background: #fafafa; border-radius: 8px; padding: 12px; }
.log-empty { color: #ccc; text-align: center; padding: 20px; }
.log-item { font-size: 12px; color: #666; padding: 3px 0; font-family: monospace; border-bottom: 1px dashed #f0f0f0; }
</style>
