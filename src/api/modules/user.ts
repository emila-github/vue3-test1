import { get, post, put, del } from '../request'
import type { PageParams, PageResult } from '../types'

// ==================== 用户类型 ====================
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive'
  createdAt: string
}

export interface CreateUserParams {
  name: string
  email: string
  role: User['role']
}

export interface UpdateUserParams extends Partial<CreateUserParams> {
  id: number
  status?: User['status']
}

// ==================== 用户 API ====================

/** 获取用户列表（分页） */
export function getUsers(params: Partial<PageParams> = {}) {
  return get<PageResult<User>>('/users', params)
}

/** 获取单个用户 */
export function getUserById(id: number) {
  return get<User>(`/users/${id}`)
}

/** 创建用户 */
export function createUser(data: CreateUserParams) {
  return post<User>('/users', data)
}

/** 更新用户 */
export function updateUser(data: UpdateUserParams) {
  return put<User>(`/users/${data.id}`, data)
}

/** 删除用户 */
export function deleteUser(id: number) {
  return del<void>(`/users/${id}`)
}
