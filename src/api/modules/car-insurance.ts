/**
 * 车险投保 API 模块
 */
import { get, post, put, del } from '../request'
import type { PageResult } from '../types'

// ==================== 类型定义 ====================
export interface CarInsurance {
  id: number
  plateNo: string
  ownerName: string
  ownerPhone: string
  carBrand: string
  carModel: string
  carYear: number
  vin: string
  engineNo: string
  insuranceType: string
  insuranceStart: string
  insuranceEnd: string
  deductible: number
  estimatedValue: number
  driverLicenseFront: string
  driverLicenseBack: string
  carPhoto: string
  status: string
  coverageArea: string
  agreeTerms: boolean
  notes: string
  createTime: string
  updateTime: string
}

export interface CarInsuranceQuery {
  keyword?: string
  status?: string
  page?: number
  pageSize?: number
}

export interface CarInsuranceForm {
  id?: number
  plateNo: string
  ownerName: string
  ownerPhone: string
  carBrand: string
  carModel: string
  carYear: number
  vin: string
  engineNo: string
  insuranceType: string
  insuranceStart: string
  insuranceEnd: string
  deductible: number
  estimatedValue: number
  driverLicenseFront: string
  driverLicenseBack: string
  carPhoto: string
  status?: string
  coverageArea: string
  agreeTerms: boolean
  notes: string
}

export interface UploadImageResult {
  url: string
  fileName: string
}

// ==================== API 函数 ====================

/** 投保列表查询 */
export function getCarInsuranceList(params: CarInsuranceQuery = {}) {
  return get<PageResult<CarInsurance>>('/car-insurance/list', params as Record<string, any>)
}

/** 投保详情 */
export function getCarInsuranceDetail(id: number) {
  return get<CarInsurance>('/car-insurance', { id } as Record<string, any>)
}

/** 新增投保 */
export function createCarInsurance(data: CarInsuranceForm) {
  return post<CarInsurance>('/car-insurance', data as Record<string, any>)
}

/** 编辑投保 */
export function updateCarInsurance(data: CarInsuranceForm) {
  return put<CarInsurance>('/car-insurance', data as Record<string, any>)
}

/** 删除投保 */
export function deleteCarInsurance(id: number) {
  return del<void>('/car-insurance', { id } as Record<string, any>)
}

/** 上传图片 */
export function uploadCarInsuranceImage(fileName: string, base64: string) {
  return post<UploadImageResult>('/car-insurance/upload', { fileName, base64 } as Record<string, any>)
}
