<script setup lang="ts">
/**
 * 阶段六：全控件 Table CRUD 实战
 *
 * 覆盖全部数据录入控件：
 *   a-input / a-input-search / a-input-number / a-select / a-radio-group
 *   a-checkbox-group / a-cascader / a-tree-select / a-date-picker
 *   a-range-picker / a-switch / a-textarea / a-rate / a-slider
 *
 * 特性：查询展开/收起、表单联动、防抖搜索、批量删除、服务端分页排序
 */
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { TableProps, FormInstance } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons-vue'
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  batchDeleteEmployees,
  getSkillOptions,
  getCityTree,
  getOrgTree,
  getDepartmentOptions,
} from '@/api/modules/employee'
import type { Employee, EmployeeQueryParams, CreateEmployeeParams, DictOption } from '@/api/modules/employee'

// ===== 字典数据 =====
const skillOptions = ref<DictOption[]>([])
const cityTree = ref<DictOption[]>([])
const orgTree = ref<DictOption[]>([])
const departOptions = ref<DictOption[]>([])

// ===== 表格数据 =====
const loading = ref(false)
const dataSource = ref<Employee[]>([])
const selectedRowKeys = ref<number[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '50'],
  showTotal: (total: number) => `共 ${total} 条`,
})

// ===== 查询区域 =====
const searchExpanded = ref(false)
const queryForm = reactive<Record<string, any>>({
  keyword: '',
  status: [],
  hireDateRange: null as [string, string] | null,
  ageMin: null as number | null,
  ageMax: null as number | null,
  gender: undefined,
  department: undefined,
  city: [] as string[],
  isFullTime: undefined as boolean | undefined,
})

function resetQuery() {
  queryForm.keyword = ''
  queryForm.status = []
  queryForm.hireDateRange = null
  queryForm.ageMin = null
  queryForm.ageMax = null
  queryForm.gender = undefined
  queryForm.department = undefined
  queryForm.city = []
  queryForm.isFullTime = undefined
  pagination.current = 1
  fetchData()
}

function toggleSearchExpand() {
  searchExpanded.value = !searchExpanded.value
}

// ===== 数据获取 =====
function buildQueryParams(): EmployeeQueryParams {
  const params: EmployeeQueryParams = {
    page: pagination.current,
    pageSize: pagination.pageSize,
  }
  if (queryForm.keyword) params.keyword = queryForm.keyword
  if (queryForm.status?.length) params.status = queryForm.status.join(',')
  if (queryForm.hireDateRange?.length === 2) {
    ;(params as any).hireStart = queryForm.hireDateRange[0]
    ;(params as any).hireEnd = queryForm.hireDateRange[1]
  }
  if (queryForm.ageMin != null) params.ageMin = queryForm.ageMin
  if (queryForm.ageMax != null) params.ageMax = queryForm.ageMax
  if (queryForm.gender) params.gender = queryForm.gender
  if (queryForm.department) params.department = queryForm.department
  if (queryForm.city?.length) params.city = queryForm.city.join(',')
  if (queryForm.isFullTime !== undefined) params.isFullTime = queryForm.isFullTime
  return params
}

async function fetchData() {
  loading.value = true
  try {
    const result = await getEmployees(buildQueryParams())
    dataSource.value = result.list
    pagination.total = result.total
    pagination.current = result.page
  } catch {
    message.error('数据加载失败，请重试')
  } finally {
    loading.value = false
  }
}

function handleTableChange(pag: { current: number; pageSize: number }) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchData()
}

// ✅ TableProps['onChange'] 推导出的完整签名：
// (pagination: TablePaginationConfig, filters: Record<string, FilterValue[] | null>, sorter: SorterResult | SorterResult[], extra: TableCurrentDataSource) => void

// 使用 TableProps<DataType>['onChange'] 为事件回调添加类型，自动推断 pagination、filters、sorter 参数类型

// const handleTableChange: TableProps['onChange'] = (
//   pag: { pageSize: number; current: number },
//   filters: any,
//   sorter: any,
//   extra: any,
// ) => {
//   console.log('handleTableChange')
//   pagination.current = pag.current
//   pagination.pageSize = pag.pageSize
//   fetchData()
// }

// 防抖搜索
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(
  () => queryForm.keyword,
  () => {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      pagination.current = 1
      fetchData()
    }, 400)
  },
)

function doSearch() {
  pagination.current = 1
  fetchData()
}

// ===== 新增/编辑抽屉 =====
const drawerOpen = ref(false)
const drawerTitle = ref('新增员工')
const drawerLoading = ref(false)
const isEdit = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()

interface FormState {
  name: string
  employeeNo: string
  gender: 'male' | 'female' | undefined
  age: number | null
  department: string | undefined
  positions: string[]
  city: string[]
  orgPath: string | undefined
  salary: number | null
  hireDate: string | undefined
  status: 'active' | 'inactive' | 'probation' | 'resigned' | undefined
  isFullTime: boolean
  email: string
  phone: string
  remark: string
}

const defaultForm: FormState = {
  name: '',
  employeeNo: '',
  gender: undefined,
  age: null,
  department: undefined,
  positions: [],
  city: [],
  orgPath: undefined,
  salary: null,
  hireDate: undefined,
  status: undefined,
  isFullTime: true,
  email: '',
  phone: '',
  remark: '',
}

const formState = reactive<FormState>({ ...defaultForm })

const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  employeeNo: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  hireDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

function openCreate() {
  isEdit.value = false
  editingId.value = null
  drawerTitle.value = '新增员工'
  Object.assign(formState, { ...defaultForm })
  drawerOpen.value = true
}

function openEdit(record: Employee) {
  isEdit.value = true
  editingId.value = record.id
  drawerTitle.value = `编辑员工 - ${record.name}`
  // 深拷贝数组，避免表单修改污染表格数据
  Object.assign(formState, {
    name: record.name,
    employeeNo: record.employeeNo,
    gender: record.gender,
    age: record.age,
    department: record.department,
    positions: [...(record.positions || [])],
    city: [...(record.city || [])],
    orgPath: record.orgPath || undefined,
    salary: record.salary,
    hireDate: record.hireDate,
    status: record.status,
    isFullTime: record.isFullTime,
    email: record.email,
    phone: record.phone,
    remark: record.remark || '',
  })
  drawerOpen.value = true
}

function closeDrawer() {
  // destroy-on-close 会自动销毁表单组件，无需手动 resetFields
  drawerOpen.value = false
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  drawerLoading.value = true
  try {
    const payload = { ...formState } as any
    // 清理空值字段，避免传给后端 undefined
    if (payload.age === null) delete payload.age
    if (payload.salary === null) delete payload.salary

    if (isEdit.value && editingId.value) {
      await updateEmployee({ id: editingId.value, ...payload })
      message.success('更新成功')
    } else {
      await createEmployee(payload as CreateEmployeeParams)
      message.success('创建成功')
    }
    drawerOpen.value = false
    fetchData()
  } catch {
    message.error('操作失败，请重试')
  } finally {
    drawerLoading.value = false
  }
}

// ===== 删除 =====
function handleDelete(record: Employee) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除员工「${record.name}」吗？此操作不可撤销。`,
    okText: '确认删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteEmployee(record.id)
        message.success('删除成功')
        fetchData()
      } catch {
        message.error('删除失败')
      }
    },
  })
}

function handleBatchDelete() {
  if (!selectedRowKeys.value.length) {
    message.warning('请先选择要删除的记录')
    return
  }
  Modal.confirm({
    title: '批量删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 条记录吗？`,
    okText: '确认删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        await batchDeleteEmployees(selectedRowKeys.value)
        message.success(`已删除 ${selectedRowKeys.value.length} 条记录`)
        selectedRowKeys.value = []
        fetchData()
      } catch {
        message.error('批量删除失败')
      }
    },
  })
}

// ===== 表格列定义 =====
// 辅助映射函数（供 bodyCell 插槽使用）
const deptNameMap: Record<string, string> = {
  'tech-frontend': '技术中心/前端研发部',
  'tech-backend': '技术中心/后端研发部',
  'tech-qa': '技术中心/测试部',
  'tech-ops': '技术中心/运维部',
  'product-design': '产品中心/产品设计部',
  'product-ux': '产品中心/用户体验部',
  'market-promotion': '市场中心/市场推广部',
  'market-sales': '市场中心/销售部',
  hr: '人力资源部',
  finance: '财务部',
}
const skillNameMap: Record<string, string> = {
  vue: 'Vue',
  react: 'React',
  angular: 'Angular',
  nodejs: 'Node.js',
  typescript: 'TS',
  java: 'Java',
  python: 'Python',
  go: 'Go',
}

// 列基础定义（不含 fixed，避免移动端遮挡）
const _columnDefs: TableProps['columns'] = [
  { title: '工号', dataIndex: 'employeeNo', key: 'employeeNo', width: 100 },
  { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
  { title: '性别', dataIndex: 'gender', key: 'gender', width: 70 },
  { title: '年龄', dataIndex: 'age', key: 'age', width: 70, sorter: (a: Employee, b: Employee) => a.age - b.age },
  { title: '部门', dataIndex: 'orgPath', key: 'orgPath', width: 150, ellipsis: true },
  { title: '技能', dataIndex: 'positions', key: 'positions', width: 160 },
  {
    title: '薪资',
    dataIndex: 'salary',
    key: 'salary',
    width: 110,
    align: 'right',
    sorter: (a: Employee, b: Employee) => a.salary - b.salary,
  },
  { title: '入职日期', dataIndex: 'hireDate', key: 'hireDate', width: 110 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '类型', dataIndex: 'isFullTime', key: 'isFullTime', width: 80 },
  { title: '手机号', dataIndex: 'phone', key: 'phone', width: 120 },
  { title: '操作', key: 'action', width: 140 },
]

// 桌面端给首尾列加 fixed，移动端不加（避免遮挡数据）
const columns = computed<TableProps['columns']>(() => {
  if (isMobile.value) return _columnDefs
  return _columnDefs.map((col, i) => {
    if (i === 0) return { ...col, fixed: 'left' as const }
    if (i === _columnDefs.length - 1) return { ...col, fixed: 'right' as const }
    return col
  })
})

// 表格横向滚动宽度
const scrollX = computed(() => (isMobile.value ? 1000 : 1400))

const hasSelected = computed(() => selectedRowKeys.value.length > 0)

// ===== 移动端适配 =====
const MOBILE_BREAKPOINT = 768
const isMobile = ref(window.innerWidth < MOBILE_BREAKPOINT)

function onResize() {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
}

const drawerWidth = computed(() => (isMobile.value ? '100%' : 640))
const formLayout = computed(() => (isMobile.value ? 'vertical' : 'horizontal'))
const formLabelCol = computed(() => (isMobile.value ? { span: 24 } : { span: 5 }))
const formWrapperCol = computed(() => (isMobile.value ? { span: 24 } : { span: 17 }))

// ===== 初始化 =====
onMounted(async () => {
  window.addEventListener('resize', onResize)

  const [skills, cities, orgs, depts] = await Promise.all([
    getSkillOptions(),
    getCityTree(),
    getOrgTree(),
    getDepartmentOptions(),
  ])
  skillOptions.value = skills
  cityTree.value = cities
  orgTree.value = orgs
  departOptions.value = depts
  fetchData()
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div class="stage-page">
    <h1>阶段六：全控件 Table CRUD 实战</h1>
    <p class="subtitle">
      覆盖
      <code
        >a-input / a-select / a-radio-group / a-cascader / a-tree-select / a-date-picker / a-range-picker /
        a-input-number / a-switch / a-textarea</code
      >
      等全部数据录入控件，支持查询展开/收起、防抖搜索、表单联动、批量删除、服务端分页。
    </p>

    <!-- ==================== 查询区域 ==================== -->
    <section class="card">
      <h2>查询条件</h2>

      <a-form layout="inline" class="query-form">
        <!-- 第一行：常用条件 -->
        <a-form-item label="关键字">
          <a-input
            v-model:value="queryForm.keyword"
            placeholder="姓名 / 工号 / 邮箱 / 手机"
            allow-clear
            style="width: 220px"
          >
            <template #prefix><SearchOutlined /></template>
          </a-input>
        </a-form-item>

        <a-form-item label="状态">
          <a-select
            v-model:value="queryForm.status"
            mode="multiple"
            placeholder="全部"
            allow-clear
            style="min-width: 180px"
            :max-tag-count="2"
          >
            <a-select-option value="active">在职</a-select-option>
            <a-select-option value="inactive">休假</a-select-option>
            <a-select-option value="probation">试用</a-select-option>
            <a-select-option value="resigned">离职</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="入职日期">
          <a-range-picker v-model:value="queryForm.hireDateRange" value-format="YYYY-MM-DD" style="width: 260px" />
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button type="primary" @click="doSearch">
              <template #icon><SearchOutlined /></template>
              查询
            </a-button>
            <a-button @click="resetQuery">
              <template #icon><ReloadOutlined /></template>
              重置
            </a-button>
            <a-button type="link" @click="toggleSearchExpand">
              {{ searchExpanded ? '收起' : '展开' }}更多
              <component :is="searchExpanded ? UpOutlined : DownOutlined" />
            </a-button>
          </a-space>
        </a-form-item>

        <!-- 展开行 -->
        <template v-if="searchExpanded">
          <a-form-item label="年龄范围">
            <a-space>
              <a-input-number
                v-model:value="queryForm.ageMin"
                :min="18"
                :max="queryForm.ageMax ?? 70"
                placeholder="最小"
                style="width: 100px"
              />
              <span>—</span>
              <a-input-number
                v-model:value="queryForm.ageMax"
                :min="queryForm.ageMin ?? 18"
                :max="70"
                placeholder="最大"
                style="width: 100px"
              />
            </a-space>
          </a-form-item>

          <a-form-item label="性别">
            <a-radio-group v-model:value="queryForm.gender">
              <a-radio-button value="">全部</a-radio-button>
              <a-radio-button value="male">男</a-radio-button>
              <a-radio-button value="female">女</a-radio-button>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="部门">
            <a-select v-model:value="queryForm.department" placeholder="全部" allow-clear style="width: 200px">
              <a-select-option v-for="d in departOptions" :key="d.value" :value="d.value">
                {{ d.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="城市">
            <a-cascader
              v-model:value="queryForm.city"
              :options="cityTree"
              placeholder="省/市/区"
              allow-clear
              style="width: 200px"
            />
          </a-form-item>

          <a-form-item label="是否全职">
            <a-space>
              <a-switch v-model:checked="queryForm.isFullTime" />
              <span style="font-size: 12px; color: #999">
                {{ queryForm.isFullTime === undefined ? '不限' : queryForm.isFullTime ? '仅全职' : '仅兼职' }}
              </span>
              <a-button
                v-if="queryForm.isFullTime !== undefined"
                type="link"
                size="small"
                @click="queryForm.isFullTime = undefined"
                >清除</a-button
              >
            </a-space>
          </a-form-item>
        </template>
      </a-form>
    </section>

    <!-- ==================== 工具栏 ==================== -->
    <section class="toolbar">
      <a-space>
        <a-button type="primary" @click="openCreate">
          <template #icon><PlusOutlined /></template>
          新增员工
        </a-button>
        <a-button danger :disabled="!hasSelected" @click="handleBatchDelete">
          <template #icon><DeleteOutlined /></template>
          批量删除
          <template v-if="hasSelected">({{ selectedRowKeys.length }})</template>
        </a-button>
      </a-space>
      <span class="toolbar-count">共 {{ pagination.total }} 条</span>
    </section>

    <!-- ==================== 数据表格 ==================== -->
    <section class="card" style="padding: 0">
      <a-table
        :sticky="{ offsetHeader: 53 }"
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        :scroll="{ x: scrollX }"
        :row-selection="{
          selectedRowKeys,
          onChange: (keys: number[]) => (selectedRowKeys = keys),
        }"
        row-key="id"
        size="middle"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- 性别 -->
          <template v-if="column.key === 'gender'">
            {{ record.gender === 'male' ? '男' : '女' }}
          </template>
          <!-- 部门 -->
          <template v-else-if="column.key === 'orgPath'">
            <a-tooltip :title="deptNameMap[record.orgPath] || record.orgPath">
              {{ deptNameMap[record.orgPath] || record.orgPath || '-' }}
            </a-tooltip>
          </template>
          <!-- 技能 -->
          <template v-else-if="column.key === 'positions'">
            <template v-if="record.positions?.length">
              <a-tag v-for="tag in record.positions" :key="tag" style="margin-bottom: 2px">
                {{ skillNameMap[tag] || tag }}
              </a-tag>
            </template>
            <span v-else>—</span>
          </template>
          <!-- 薪资 -->
          <template v-else-if="column.key === 'salary'"> ¥{{ Number(record.salary).toLocaleString() }} </template>
          <!-- 状态 -->
          <template v-else-if="column.key === 'status'">
            <a-tag v-if="record.status === 'active'" color="green">在职</a-tag>
            <a-tag v-else-if="record.status === 'inactive'" color="orange">休假</a-tag>
            <a-tag v-else-if="record.status === 'probation'" color="blue">试用</a-tag>
            <a-tag v-else-if="record.status === 'resigned'" color="red">离职</a-tag>
            <span v-else>{{ record.status }}</span>
          </template>
          <!-- 类型 -->
          <template v-else-if="column.key === 'isFullTime'">
            <a-tag :color="record.isFullTime ? 'blue' : 'default'">
              {{ record.isFullTime ? '全职' : '兼职' }}
            </a-tag>
          </template>
          <!-- 操作 -->
          <template v-else-if="column.key === 'action'">
            <a-space size="small">
              <a-button type="link" size="small" @click="openEdit(record as Employee)">
                <EditOutlined /> 编辑
              </a-button>
              <a-popconfirm
                title="确定删除该员工？"
                ok-text="删除"
                ok-type="danger"
                cancel-text="取消"
                @confirm="handleDelete(record as Employee)"
              >
                <a-button type="link" size="small" danger> <DeleteOutlined /> 删除 </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </section>

    <!-- ==================== 新增/编辑抽屉 ==================== -->
    <a-drawer
      v-model:open="drawerOpen"
      :title="drawerTitle"
      :width="drawerWidth"
      :closable="true"
      destroy-on-close
      :class="{ 'drawer-mobile': isMobile }"
    >
      <template #extra>
        <a-space :direction="isMobile ? 'vertical' : 'horizontal'" :class="{ 'drawer-extra-mobile': isMobile }">
          <a-button type="primary" :loading="drawerLoading" :block="isMobile" @click="handleSubmit">
            {{ isEdit ? '保存修改' : '确认创建' }}
          </a-button>
          <a-button :block="isMobile" @click="closeDrawer">取消</a-button>
        </a-space>
      </template>

      <a-form
        ref="formRef"
        :model="formState"
        :rules="formRules"
        :label-col="formLabelCol"
        :wrapper-col="formWrapperCol"
        :layout="formLayout"
      >
        <!-- 基本信息 -->
        <a-divider orientation="left">基本信息</a-divider>

        <a-form-item label="姓名" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入姓名" :maxlength="20" />
        </a-form-item>

        <a-form-item label="工号" name="employeeNo">
          <a-input v-model:value="formState.employeeNo" placeholder="请输入工号" />
        </a-form-item>

        <a-form-item label="性别" name="gender">
          <a-radio-group v-model:value="formState.gender">
            <a-radio value="male">男</a-radio>
            <a-radio value="female">女</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="年龄" name="age">
          <a-input-number v-model:value="formState.age" :min="18" :max="70" placeholder="18-70" style="width: 100%" />
        </a-form-item>

        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="formState.phone" placeholder="请输入手机号" :maxlength="11" />
        </a-form-item>

        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formState.email" placeholder="请输入邮箱" type="email" />
        </a-form-item>

        <!-- 归属信息 -->
        <a-divider orientation="left">归属信息</a-divider>

        <a-form-item label="所属部门" name="department">
          <a-select
            v-model:value="formState.department"
            placeholder="请选择部门"
            show-search
            option-filter-prop="label"
          >
            <a-select-option v-for="d in departOptions" :key="d.value" :value="d.value" :label="d.label">
              {{ d.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="组织路径" name="orgPath" help="树形选择，模拟组织架构">
          <a-tree-select
            v-model:value="formState.orgPath"
            :tree-data="orgTree"
            :field-names="{ children: 'children', label: 'label', value: 'value' }"
            tree-default-expand-all
            placeholder="请选择组织路径"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="所在城市">
          <a-cascader
            v-model:value="formState.city"
            :options="cityTree"
            placeholder="省/市/区"
            allow-clear
            style="width: 100%"
          />
        </a-form-item>

        <!-- 工作信息 -->
        <a-divider orientation="left">工作信息</a-divider>

        <a-form-item label="技能标签">
          <a-select
            v-model:value="formState.positions"
            mode="multiple"
            placeholder="请选择技能（可多选）"
            style="width: 100%"
          >
            <a-select-option v-for="s in skillOptions" :key="s.value" :value="s.value">
              {{ s.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="入职日期" name="hireDate">
          <a-date-picker
            v-model:value="formState.hireDate"
            value-format="YYYY-MM-DD"
            placeholder="请选择入职日期"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="薪资" name="salary">
          <a-input-number
            v-model:value="formState.salary"
            :min="0"
            :step="1000"
            :formatter="(v: string) => `¥ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="(v: string) => v.replace(/¥\s?|(,*)/g, '')"
            placeholder="请输入月薪"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="员工状态" name="status">
          <a-select v-model:value="formState.status" placeholder="请选择状态">
            <a-select-option value="active">在职</a-select-option>
            <a-select-option value="probation">试用期</a-select-option>
            <a-select-option value="inactive">休假</a-select-option>
            <a-select-option value="resigned">已离职</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="是否全职">
          <a-switch v-model:checked="formState.isFullTime" checked-children="全职" un-checked-children="兼职" />
        </a-form-item>

        <a-form-item label="备注">
          <a-textarea
            v-model:value="formState.remark"
            placeholder="备注信息（可选）"
            :rows="3"
            :maxlength="200"
            show-count
          />
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 1200px;
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
  line-height: 1.7;
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
  margin-bottom: 16px;
}

.card h2 {
  font-size: 16px;
  color: #333;
  margin: 0 0 12px 0;
}

/* ===== 查询表单 ===== */
.query-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.query-form :deep(.ant-form-item) {
  margin-bottom: 8px;
}

/* ===== 工具栏 ===== */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.toolbar-count {
  font-size: 13px;
  color: #888;
}

/* ===== 抽屉内部分割线 ===== */
:deep(.ant-divider-inner-text) {
  font-size: 13px;
  color: #1677ff;
  font-weight: 500;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .stage-page {
    padding: 16px;
  }
  .query-form {
    flex-direction: column;
  }
  .query-form :deep(.ant-form-item) {
    width: 100%;
  }

  /* 表格移动端：取消卡片内边距 */
  .card {
    padding: 0;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
  .toolbar {
    flex-wrap: wrap;
    gap: 8px;
  }
  .toolbar-count {
    width: 100%;
    text-align: left;
    margin-left: 0;
  }

  /* 抽屉移动端 */
  .drawer-mobile :deep(.ant-drawer-body) {
    padding: 12px;
  }
  .drawer-mobile :deep(.ant-drawer-header) {
    padding: 12px 16px;
  }
  .drawer-mobile :deep(.ant-drawer-header-title) {
    font-size: 16px;
  }
}

/* 移动端 drawer header extra 按钮撑满 */
.drawer-extra-mobile {
  width: 100%;
}
</style>
