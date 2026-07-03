import { get, post, put, del } from '../request'

/** 用户数据 */
export interface AxiosUser {
  id: number
  name: string
  email: string
  role: string
  status: string
}

/** 分页结果 */
export interface AxiosPageResult<T> {
  list: T[]
  total: number
}

/** 查询参数 */
export interface AxiosQueryParams {
  keyword?: string
  page?: number
  pageSize?: number
}

// ==================== API 函数 ====================

/** 获取用户列表 */
export function getAxiosDemoList(params: AxiosQueryParams = {}) {
  return get<AxiosPageResult<AxiosUser>>('/axios-demo/list', params as Record<string, any>)
}

/** 获取单个用户 */
export function getAxiosDemoUser(id: number) {
  return get<AxiosUser>(`/axios-demo/${id}`)
}

/** 创建用户 */
export function createAxiosDemoUser(data: Partial<AxiosUser>) {
  return post<AxiosUser>('/axios-demo', data as Record<string, any>)
}

/** 更新用户 */
export function updateAxiosDemoUser(data: Partial<AxiosUser>) {
  return put<AxiosUser>('/axios-demo', data as Record<string, any>)
}

/** 删除用户 */
export function deleteAxiosDemoUser(id: number) {
  return del<void>('/axios-demo', { params: { id } })
}
