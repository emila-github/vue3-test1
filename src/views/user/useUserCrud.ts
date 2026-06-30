import { ref, computed } from 'vue'
import { useUserStore, type User, type UserFormData } from '@/stores/user'

/**
 * 用户 CRUD 组合式函数
 * 封装用户管理的所有逻辑，可跨组件复用
 */
export function useUserCrud() {
  const store = useUserStore()

  // --- 状态 ---

  const searchKeyword = ref('')
  const sortField = ref<keyof User>('id')
  const sortOrder = ref<'asc' | 'desc'>('asc')

  // 弹窗控制
  const showDialog = ref(false)
  const dialogMode = ref<'create' | 'edit'>('create')
  const editingUserId = ref<number | null>(null)

  // 表单数据
  const formData = ref<UserFormData>({
    name: '',
    email: '',
    role: 'viewer',
    status: 'active',
  })

  // 表单校验错误
  const formErrors = ref<Partial<Record<keyof UserFormData, string>>>({})

  // 多选
  const selectedIds = ref<Set<number>>(new Set())

  // --- 计算属性 ---

  /** 搜索并排序后的用户列表 */
  const filteredUsers = computed(() => {
    const list = store.searchUsers(searchKeyword.value)
    return [...list].sort((a, b) => {
      const va = a[sortField.value]
      const vb = b[sortField.value]
      if (typeof va === 'string' && typeof vb === 'string') {
        return sortOrder.value === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      }
      return sortOrder.value === 'asc' ? Number(va) - Number(vb) : Number(vb) - Number(va)
    })
  })

  /** 表单是否有效 */
  const isFormValid = computed(() => {
    return formData.value.name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email.trim())
  })

  /** 全选状态 */
  const isAllSelected = computed(() => {
    if (filteredUsers.value.length === 0) return false
    return filteredUsers.value.every((u) => selectedIds.value.has(u.id))
  })

  // --- 弹窗操作 ---

  /** 打开创建弹窗 */
  function openCreateDialog() {
    dialogMode.value = 'create'
    editingUserId.value = null
    formData.value = { name: '', email: '', role: 'viewer', status: 'active' }
    formErrors.value = {}
    showDialog.value = true
  }

  /** 打开编辑弹窗 */
  function openEditDialog(user: User) {
    dialogMode.value = 'edit'
    editingUserId.value = user.id
    formData.value = {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    }
    formErrors.value = {}
    showDialog.value = true
  }

  /** 关闭弹窗 */
  function closeDialog() {
    showDialog.value = false
    formErrors.value = {}
  }

  // --- 校验 ---

  function validateForm(): boolean {
    const errors: typeof formErrors.value = {}

    if (formData.value.name.trim().length < 2) {
      errors.name = '姓名至少 2 个字符'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email.trim())) {
      errors.email = '请输入有效的邮箱地址'
    }

    formErrors.value = errors
    return Object.keys(errors).length === 0
  }

  // --- 提交 ---

  function submitForm(): boolean {
    if (!validateForm()) return false

    if (dialogMode.value === 'create') {
      store.addUser({ ...formData.value })
    } else if (editingUserId.value !== null) {
      store.updateUser(editingUserId.value, { ...formData.value })
    }

    closeDialog()
    return true
  }

  // --- 删除 ---

  function deleteUser(id: number) {
    store.deleteUser(id)
    selectedIds.value.delete(id)
  }

  function batchDelete() {
    store.deleteUsers([...selectedIds.value])
    selectedIds.value.clear()
  }

  // --- 排序 ---

  function toggleSort(field: keyof User) {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortOrder.value = 'asc'
    }
  }

  // --- 多选 ---

  function toggleSelect(id: number) {
    const next = new Set(selectedIds.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    selectedIds.value = next
  }

  function toggleSelectAll() {
    if (isAllSelected.value) {
      selectedIds.value = new Set()
    } else {
      selectedIds.value = new Set(filteredUsers.value.map((u) => u.id))
    }
  }

  // --- 导出 ---

  function exportCSV() {
    const headers = ['ID', '姓名', '邮箱', '角色', '状态', '创建时间']
    const rows = filteredUsers.value.map((u) => [u.id, u.name, u.email, u.role, u.status, u.createdAt])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `用户列表_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    // 状态
    searchKeyword,
    sortField,
    sortOrder,
    showDialog,
    dialogMode,
    editingUserId,
    formData,
    formErrors,
    selectedIds,
    // 计算
    filteredUsers,
    isFormValid,
    isAllSelected,
    // 弹窗
    openCreateDialog,
    openEditDialog,
    closeDialog,
    // CRUD
    submitForm,
    deleteUser,
    batchDelete,
    // 其他
    toggleSort,
    toggleSelect,
    toggleSelectAll,
    exportCSV,
  }
}
