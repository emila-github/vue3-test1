import { get, post, put, del } from '../request'
import type { PageResult } from '../types'

// ==================== 员工类型 ====================
export interface Employee {
  id: number
  name: string
  employeeNo: string
  gender: 'male' | 'female'
  age: number
  department: string
  positions: string[]
  city: string[] // 级联：省/市/区
  orgPath: string // 树形部门路径
  salary: number
  hireDate: string
  status: 'active' | 'inactive' | 'probation' | 'resigned'
  isFullTime: boolean
  email: string
  phone: string
  remark: string
  createdAt: string
}

export interface CreateEmployeeParams {
  name: string
  employeeNo: string
  gender: Employee['gender']
  age: number
  department: string
  positions: string[]
  city: string[]
  orgPath: string
  salary: number
  hireDate: string
  status: Employee['status']
  isFullTime: boolean
  email: string
  phone: string
  remark?: string
}

export interface UpdateEmployeeParams extends Partial<CreateEmployeeParams> {
  id: number
}

export interface EmployeeQueryParams {
  keyword?: string
  status?: string
  hireDateRange?: [string, string]
  ageMin?: number
  ageMax?: number
  gender?: string
  department?: string
  city?: string[]
  isFullTime?: boolean
  page?: number
  pageSize?: number
}

// ==================== 字典选项 ====================
export interface DictOption {
  label: string
  value: string
  children?: DictOption[]
}

export function getSkillOptions(): Promise<DictOption[]> {
  return get<DictOption[]>('/employees/skills')
}

export function getCityTree(): Promise<DictOption[]> {
  return get<DictOption[]>('/employees/cities')
}

export function getOrgTree(): Promise<DictOption[]> {
  return get<DictOption[]>('/employees/org-tree')
}

export function getDepartmentOptions(): Promise<DictOption[]> {
  return get<DictOption[]>('/employees/departments')
}

// ==================== 员工 CRUD API ====================

/** 查询员工列表 */
export function getEmployees(params: EmployeeQueryParams = {}) {
  return get<PageResult<Employee>>('/employees', params as Record<string, any>)
}

/** 获取单个员工 */
export function getEmployeeById(id: number) {
  return get<Employee>(`/employees/${id}`)
}

/** 新增员工 */
export function createEmployee(data: CreateEmployeeParams) {
  return post<Employee>('/employees', data as Record<string, any>)
}

/** 更新员工 */
export function updateEmployee(data: UpdateEmployeeParams) {
  return put<Employee>(`/employees/${data.id}`, data as Record<string, any>)
}

/** 删除员工 */
export function deleteEmployee(id: number) {
  return del<void>(`/employees/${id}`)
}

/** 批量删除 */
export function batchDeleteEmployees(ids: number[]) {
  return del<void>('/employees/batch', { data: { ids } } as any)
}
