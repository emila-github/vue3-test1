import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/** 用户实体 */
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive'
  createdAt: string
}

/** 创建用户时的表单数据 */
export interface UserFormData {
  name: string
  email: string
  role: User['role']
  status: User['status']
}

// 模拟初始数据
function generateMockUsers(): User[] {
  return [
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active', createdAt: '2025-01-15' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: 'editor', status: 'active', createdAt: '2025-02-20' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: 'viewer', status: 'inactive', createdAt: '2025-03-10' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: 'editor', status: 'active', createdAt: '2025-04-05' },
    { id: 5, name: '孙七', email: 'sunqi@example.com', role: 'viewer', status: 'active', createdAt: '2025-05-18' },
  ]
}

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>(generateMockUsers())
  let nextId = 6

  // --- 计算属性 ---

  const totalCount = computed(() => users.value.length)
  const activeCount = computed(() => users.value.filter((u) => u.status === 'active').length)
  const inactiveCount = computed(() => users.value.filter((u) => u.status === 'inactive').length)

  // --- 增删改查 ---

  /** 根据 ID 查找用户 */
  function findById(id: number): User | undefined {
    return users.value.find((u) => u.id === id)
  }

  /** 添加用户 */
  function addUser(form: UserFormData): User {
    const user: User = {
      id: nextId++,
      name: form.name,
      email: form.email,
      role: form.role,
      status: form.status,
      createdAt: new Date().toISOString().split('T')[0]!,
    }
    users.value.push(user)
    return user
  }

  /** 更新用户 */
  function updateUser(id: number, form: UserFormData): boolean {
    const existing = users.value.find((u) => u.id === id)
    if (!existing) return false
    existing.name = form.name
    existing.email = form.email
    existing.role = form.role
    existing.status = form.status
    return true
  }

  /** 删除用户 */
  function deleteUser(id: number): boolean {
    const index = users.value.findIndex((u) => u.id === id)
    if (index === -1) return false
    users.value.splice(index, 1)
    return true
  }

  /** 批量删除 */
  function deleteUsers(ids: number[]): number {
    const before = users.value.length
    users.value = users.value.filter((u) => !ids.includes(u.id))
    return before - users.value.length
  }

  /** 切换用户状态 */
  function toggleStatus(id: number): boolean {
    const user = users.value.find((u) => u.id === id)
    if (!user) return false
    user.status = user.status === 'active' ? 'inactive' : 'active'
    return true
  }

  /** 搜索用户 */
  function searchUsers(keyword: string): User[] {
    const kw = keyword.toLowerCase().trim()
    if (!kw) return users.value
    return users.value.filter(
      (u) =>
        u.name.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw) || u.role.toLowerCase().includes(kw),
    )
  }

  return {
    users,
    nextId,
    totalCount,
    activeCount,
    inactiveCount,
    findById,
    addUser,
    updateUser,
    deleteUser,
    deleteUsers,
    toggleStatus,
    searchUsers,
  }
})
