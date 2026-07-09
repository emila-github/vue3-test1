<script setup lang="ts">
/**
 * 阶段四：车险投保列表页综合示例
 *
 * 覆盖 Vant 4 全部表单控件 + 图片上传：
 *   - 列表展示：PullRefresh + List 无限滚动
 *   - 搜索筛选：Search + Tabs 状态筛选
 *   - 新增/编辑：Popup + 完整投保表单
 *   - 表单控件：Field（8种类型）、Picker、DatetimePicker、
 *     Radio/Checkbox/Switch、Stepper、Rate、Slider、Uploader
 *   - 操作交互：Dialog 确认删除、ActionSheet 批量操作、ImagePreview
 *   - 详情查看：Popup 展示全部字段
 */

import { ref, reactive, computed, watch } from 'vue'
import {
  createCarInsurance,
  updateCarInsurance,
  deleteCarInsurance,
  getCarInsuranceList,
  uploadCarInsuranceImage,
} from '@/api/modules/car-insurance'
import type { CarInsurance, CarInsuranceForm } from '@/api/modules/car-insurance'

// ==================== 列表状态 ====================
const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)
const list = ref<CarInsurance[]>([])
const page = ref(1)
const pageSize = 10

const keyword = ref('')
const activeStatus = ref('')
const statusTabs = [
  { name: '全部', value: '' },
  { name: '待审核', value: '待审核' },
  { name: '已生效', value: '已生效' },
  { name: '已过期', value: '已过期' },
]

// ==================== 更多筛选 ====================
const showMoreFilter = ref(false)
const filterInsuranceType = ref('')
const filterCarBrand = ref('')
const filterPriceMin = ref<number | ''>('')
const filterPriceMax = ref<number | ''>('')

// 保险期间筛选
const filterStartFrom = ref('')
const filterStartTo = ref('')
const filterEndFrom = ref('')
const filterEndTo = ref('')
const dateStartPickerVisible = ref(false)
const dateEndPickerVisible = ref(false)
const datePickerMode = ref<'startFrom' | 'startTo' | 'endFrom' | 'endTo'>('startFrom')

// ==================== 表单编辑状态 ====================
const isEdit = ref(false)
const editId = ref(0)
const formPopupVisible = ref(false)
const detailVisible = ref(false)
const detailItem = ref<CarInsurance | null>(null)
const submitting = ref(false)

const form = reactive<CarInsuranceForm>({
  plateNo: '',
  ownerName: '',
  ownerPhone: '',
  carBrand: '',
  carModel: '',
  carYear: 1,
  vin: '',
  engineNo: '',
  insuranceType: '交强险',
  insuranceStart: '',
  insuranceEnd: '',
  deductible: 0,
  estimatedValue: 0,
  driverLicenseFront: '',
  driverLicenseBack: '',
  carPhoto: '',
  coverageArea: '',
  agreeTerms: false,
  notes: '',
})

// ==================== Picker 选项 ====================
const insuranceTypeOptions = [
  { text: '交强险', value: '交强险' },
  { text: '商业险', value: '商业险' },
  { text: '全险', value: '全险' },
]

const carBrandOptions = [
  { text: '宝马', value: '宝马' },
  { text: '奔驰', value: '奔驰' },
  { text: '奥迪', value: '奥迪' },
  { text: '特斯拉', value: '特斯拉' },
  { text: '丰田', value: '丰田' },
  { text: '本田', value: '本田' },
  { text: '大众', value: '大众' },
  { text: '比亚迪', value: '比亚迪' },
  { text: '蔚来', value: '蔚来' },
  { text: '其他', value: '其他' },
]

// 更多筛选选项（基于上面的选项扩展）
const insuranceTypeFilterOptions = [
  { text: '不限险种', value: '' },
  ...insuranceTypeOptions,
]

const carBrandFilterOptions = [
  { text: '不限品牌', value: '' },
  ...carBrandOptions,
]

const priceRangeOptions = [
  { text: '不限', value: '' },
  { text: '10万以下', value: '0-100000' },
  { text: '10-30万', value: '100000-300000' },
  { text: '30-50万', value: '300000-500000' },
  { text: '50-100万', value: '500000-1000000' },
  { text: '100万以上', value: '1000000-99999999' },
]

// ==================== Picker 弹出控制 ====================
const insuranceTypeVisible = ref(false)
const carBrandVisible = ref(false)
const insuranceStartVisible = ref(false)
const insuranceEndVisible = ref(false)
const coverageAreaVisible = ref(false)
const imagePreviewVisible = ref(false)
const previewImages = ref<string[]>([])
const previewIndex = ref(0)

// 附加险种、出险记录、车况评分（用于展示 Radio/Checkbox/Rate）
const extraInsurance = ref<string[]>([])
const accidentRecord = ref('0')
const carConditionRate = ref(4)

// ==================== 图片上传 ====================
const uploadLoading = reactive({
  front: false,
  back: false,
  car: false,
})

function getImagePreviewIndex(url: string) {
  previewImages.value = [form.driverLicenseFront, form.driverLicenseBack, form.carPhoto].filter(Boolean)
  const idx = previewImages.value.indexOf(url)
  previewIndex.value = idx >= 0 ? idx : 0
  imagePreviewVisible.value = true
}

async function afterRead(type: 'front' | 'back' | 'car', file: any) {
  uploadLoading[type] = true
  try {
    const base64 = await fileToBase64(file)
    const result = await uploadCarInsuranceImage(file.name || 'image.png', base64)
    if (type === 'front') form.driverLicenseFront = result.url
    else if (type === 'back') form.driverLicenseBack = result.url
    else form.carPhoto = result.url
    uploadLoading[type] = false
  } catch {
    uploadLoading[type] = false
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve((e.target?.result as string) || '')
    reader.onerror = () => reject(new Error('读取失败'))
    reader.readAsDataURL(file)
  })
}

function deleteImage(type: 'front' | 'back' | 'car') {
  if (type === 'front') form.driverLicenseFront = ''
  else if (type === 'back') form.driverLicenseBack = ''
  else form.carPhoto = ''
}

function onUploadFile(type: 'front' | 'back' | 'car', fileOrEvent: any) {
  const file = fileOrEvent.file || fileOrEvent
  afterRead(type, file)
}

function onPreviewImage(fileOrEvent: any) {
  const url = fileOrEvent.url || fileOrEvent
  getImagePreviewIndex(url)
}

// ==================== 日期格式化（Picker 确认回调） ====================

function confirmDatePicker(type: 'start' | 'end', val: { selectedValues: string[] }) {
  const [y, m, d] = val.selectedValues
  const dateStr = `${y}-${String(Number(m) + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  if (type === 'start') {
    form.insuranceStart = dateStr
    insuranceStartVisible.value = false
  } else {
    form.insuranceEnd = dateStr
    insuranceEndVisible.value = false
  }
}

// ==================== Picker 通用确认回调（避免模板内联 TS 类型注解） ====================
function onPickType(values: any) {
  form.insuranceType = values.selectedOptions[0].value
  insuranceTypeVisible.value = false
}
function onPickBrand(values: any) {
  form.carBrand = values.selectedOptions[0].value
  carBrandVisible.value = false
}
function onPickDate(type: 'start' | 'end', values: any) {
  confirmDatePicker(type, values)
}
function onPickArea(values: any) {
  form.coverageArea = values.selectedOptions.map((o: any) => o.text).join('/')
  coverageAreaVisible.value = false
}
function onPreviewDetailImage(url: string) {
  previewImages.value = [url]
  previewIndex.value = 0
  imagePreviewVisible.value = true
}

// ==================== 列表操作 ====================
async function onRefresh() {
  refreshing.value = true
  page.value = 1
  finished.value = false
  await fetchList(true)
  refreshing.value = false
}

async function onLoad() {
  // van-list v-model:loading 已自动将 loading 设为 true
  await fetchList()
  loading.value = false
}

async function fetchList(reset = false) {
  try {
    const params: Record<string, any> = {
      keyword: keyword.value,
      status: activeStatus.value,
      page: page.value,
      pageSize,
    }
    // 更多筛选参数
    if (filterInsuranceType.value) params.insuranceType = filterInsuranceType.value
    if (filterCarBrand.value) params.carBrand = filterCarBrand.value
    if (filterStartFrom.value) params.insuranceStartFrom = filterStartFrom.value
    if (filterStartTo.value) params.insuranceStartTo = filterStartTo.value
    if (filterEndFrom.value) params.insuranceEndFrom = filterEndFrom.value
    if (filterEndTo.value) params.insuranceEndTo = filterEndTo.value
    if (filterPriceMin.value !== '') params.priceMin = Number(filterPriceMin.value)
    if (filterPriceMax.value !== '') params.priceMax = Number(filterPriceMax.value)

    const result = await getCarInsuranceList(params)
    if (reset) {
      list.value = result.list
    } else {
      list.value = [...list.value, ...result.list]
    }
    if (result.list.length < pageSize) {
      finished.value = true
    } else {
      page.value++
    }
  } catch {
    finished.value = true
  }
}

function onSearch() {
  page.value = 1
  finished.value = false
  list.value = []
  fetchList(true)
}

function onStatusChange(tab: { name: string; value: string }) {
  activeStatus.value = tab.value
  onSearch()
}

// ==================== 更多筛选 ====================
function onDateFilterClick(mode: 'startFrom' | 'startTo' | 'endFrom' | 'endTo') {
  datePickerMode.value = mode
  const targetMode = mode.startsWith('start') ? 'start' : 'end'
  if (targetMode === 'start') {
    dateStartPickerVisible.value = true
  } else {
    dateEndPickerVisible.value = true
  }
}

function onDatePickerConfirm({ selectedValues }: { selectedValues: string[] }) {
  const dateStr = selectedValues.join('-')
  if (dateStartPickerVisible.value) {
    if (datePickerMode.value === 'startFrom') filterStartFrom.value = dateStr
    if (datePickerMode.value === 'startTo') filterStartTo.value = dateStr
    dateStartPickerVisible.value = false
  } else if (dateEndPickerVisible.value) {
    if (datePickerMode.value === 'endFrom') filterEndFrom.value = dateStr
    if (datePickerMode.value === 'endTo') filterEndTo.value = dateStr
    dateEndPickerVisible.value = false
  }
}

function onPriceRangeChange(val: string) {
  if (!val) {
    filterPriceMin.value = ''
    filterPriceMax.value = ''
  } else {
    const [min, max] = val.split('-')
    filterPriceMin.value = Number(min)
    filterPriceMax.value = Number(max)
  }
}

// 当前激活的筛选数量
const activeFilterCount = computed(() => {
  let count = 0
  if (filterInsuranceType.value) count++
  if (filterCarBrand.value) count++
  if (filterStartFrom.value || filterStartTo.value || filterEndFrom.value || filterEndTo.value) count++
  if (filterPriceMin.value !== '' || filterPriceMax.value !== '') count++
  return count
})

function onMoreFilterApply() {
  showMoreFilter.value = false
  onSearch()
}

function onMoreFilterReset() {
  filterInsuranceType.value = ''
  filterCarBrand.value = ''
  filterStartFrom.value = ''
  filterStartTo.value = ''
  filterEndFrom.value = ''
  filterEndTo.value = ''
  filterPriceMin.value = ''
  filterPriceMax.value = ''
}

// ==================== 新增/编辑 ====================
function openAdd() {
  isEdit.value = false
  editId.value = 0
  resetForm()
  formPopupVisible.value = true
}

function openEdit(item: CarInsurance) {
  isEdit.value = true
  editId.value = item.id
  form.plateNo = item.plateNo
  form.ownerName = item.ownerName
  form.ownerPhone = item.ownerPhone
  form.carBrand = item.carBrand
  form.carModel = item.carModel
  form.carYear = item.carYear
  form.vin = item.vin
  form.engineNo = item.engineNo
  form.insuranceType = item.insuranceType
  form.insuranceStart = item.insuranceStart
  form.insuranceEnd = item.insuranceEnd
  form.deductible = item.deductible
  form.estimatedValue = item.estimatedValue
  form.driverLicenseFront = item.driverLicenseFront
  form.driverLicenseBack = item.driverLicenseBack
  form.carPhoto = item.carPhoto
  form.coverageArea = item.coverageArea
  form.agreeTerms = item.agreeTerms
  form.notes = item.notes
  formPopupVisible.value = true
}

function resetForm() {
  form.plateNo = ''
  form.ownerName = ''
  form.ownerPhone = ''
  form.carBrand = ''
  form.carModel = ''
  form.carYear = 1
  form.vin = ''
  form.engineNo = ''
  form.insuranceType = '交强险'
  form.insuranceStart = ''
  form.insuranceEnd = ''
  form.deductible = 0
  form.estimatedValue = 0
  form.driverLicenseFront = ''
  form.driverLicenseBack = ''
  form.carPhoto = ''
  form.coverageArea = ''
  form.agreeTerms = false
  form.notes = ''
}

function closeFormPopup() {
  formPopupVisible.value = false
}

async function submitForm() {
  if (!form.plateNo) {
    return
  }
  if (!form.ownerName) {
    return
  }
  if (!form.ownerPhone) {
    return
  }

  submitting.value = true
  try {
    if (isEdit.value) {
      const data = { ...form, id: editId.value }
      await updateCarInsurance(data)
    } else {
      await createCarInsurance(form)
    }
    formPopupVisible.value = false
    onRefresh()
  } catch {
    // handle error
  } finally {
    submitting.value = false
  }
}

// ==================== 删除 ====================
const deleteId = ref(0)
const showDeleteDialog = ref(false)

function confirmDelete(item: CarInsurance) {
  deleteId.value = item.id
  showDeleteDialog.value = true
}

async function doDelete() {
  try {
    await deleteCarInsurance(deleteId.value)
    showDeleteDialog.value = false
    onRefresh()
  } catch {
    showDeleteDialog.value = false
  }
}

// ==================== 详情 ====================
function openDetail(item: CarInsurance) {
  detailItem.value = item
  detailVisible.value = true
}

// ==================== ActionSheet 批量操作 ====================
const showActionSheet = ref(false)
const actionSheetItem = ref<CarInsurance | null>(null)
const actionSheetActions = [
  { name: '查看详情', value: 'detail' },
  { name: '编辑', value: 'edit' },
  { name: '删除', value: 'delete' },
]

function openActionSheet(item: CarInsurance) {
  actionSheetItem.value = item
  showActionSheet.value = true
}

function onActionSelect(act: { name: string; value: string }) {
  showActionSheet.value = false
  if (!actionSheetItem.value) return
  if (act.value === 'detail') openDetail(actionSheetItem.value)
  else if (act.value === 'edit') openEdit(actionSheetItem.value)
  else if (act.value === 'delete') confirmDelete(actionSheetItem.value)
}

// ==================== 表单校验状态 ====================
const formErrors = computed(() => {
  const errs: string[] = []
  if (!form.plateNo) errs.push('车牌号必填')
  if (!form.ownerName) errs.push('车主姓名必填')
  if (!form.ownerPhone) errs.push('联系电话必填')
  if (form.ownerPhone && !/^1\d{10}$/.test(form.ownerPhone)) errs.push('手机号格式不正确')
  if (!form.insuranceStart) errs.push('请选择保险起期')
  if (!form.insuranceEnd) errs.push('请选择保险止期')
  if (!form.agreeTerms) errs.push('请同意投保协议')
  return errs
})

const canSubmit = computed(() => formErrors.value.length === 0)

// ==================== 状态标签颜色 ====================
function statusColor(status: string) {
  const map: Record<string, string> = {
    待审核: '#ff976a',
    已生效: '#07c160',
    已过期: '#999',
  }
  return map[status] || '#999'
}

// ==================== 日志 ====================
const logs = ref<string[]>([])
function addLog(msg: string) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// 监听关键操作

watch(formPopupVisible, (v) => {
  if (v) addLog(isEdit.value ? `打开编辑：${form.plateNo}` : '打开新增投保')
})
watch(showDeleteDialog, (v) => {
  if (v) addLog(`确认删除投保记录 #${deleteId.value}`)
})

// ==================== initial load ====================
// van-list 组件挂载时自动触发 @load，无需手动调用 onLoad()
</script>

<template>
  <div class="ci-page">
    <!-- 导航栏 -->
    <van-nav-bar title="车险投保管理" fixed placeholder>
      <template #right>
        <van-button type="primary" size="small" @click="openAdd">新增</van-button>
      </template>
    </van-nav-bar>

    <!-- 搜索栏 -->
    <div class="search-wrap">
      <van-search
        v-model="keyword"
        placeholder="搜索车牌号 / 车主 / 手机号 / 车架号"
        shape="round"
        show-action
        @search="onSearch"
        @clear="onSearch"
      >
        <template #action>
          <div @click="onSearch" style="color: #1989fa; padding: 0 4px">搜索</div>
        </template>
      </van-search>
    </div>

    <!-- 状态筛选标签 -->
    <van-tabs :active="activeStatus" animated swipeable sticky @change="onStatusChange">
      <van-tab v-for="tab in statusTabs" :key="tab.value" :title="tab.name" :name="tab.value" />
    </van-tabs>

    <!-- 更多查询方案（可展开） -->
    <div class="ci-more-filter-wrap">
      <div class="ci-more-filter-bar" @click="showMoreFilter = !showMoreFilter">
        <span>
          <van-icon name="filter-o" size="15" />
          更多查询方案
          <van-badge v-if="activeFilterCount" :content="activeFilterCount" style="margin-left: 6px" />
        </span>
        <van-icon :name="showMoreFilter ? 'arrow-up' : 'arrow-down'" size="14" color="#999" />
      </div>
      <div class="ci-more-filter-body" v-show="showMoreFilter">
        <!-- 保险期间 -->
        <div class="ci-filter-row">
          <span class="ci-filter-label">保险期间</span>
          <div class="ci-date-filter-inline">
            <div :class="['ci-date-chip', filterStartFrom && 'ci-date-chip--active']" @click="onDateFilterClick('startFrom')">
              {{ filterStartFrom || '起期从' }}
            </div>
            <div :class="['ci-date-chip', filterStartTo && 'ci-date-chip--active']" @click="onDateFilterClick('startTo')">
              {{ filterStartTo || '起期至' }}
            </div>
            <div :class="['ci-date-chip', filterEndFrom && 'ci-date-chip--active']" @click="onDateFilterClick('endFrom')">
              {{ filterEndFrom || '止期从' }}
            </div>
            <div :class="['ci-date-chip', filterEndTo && 'ci-date-chip--active']" @click="onDateFilterClick('endTo')">
              {{ filterEndTo || '止期至' }}
            </div>
          </div>
        </div>
        <!-- 险种 -->
        <div class="ci-filter-row">
          <span class="ci-filter-label">险种</span>
          <van-radio-group v-model="filterInsuranceType" direction="horizontal">
            <van-radio v-for="opt in insuranceTypeFilterOptions" :key="opt.value" :name="opt.value" icon-size="14px">
              {{ opt.text }}
            </van-radio>
          </van-radio-group>
        </div>
        <!-- 车辆品牌 -->
        <div class="ci-filter-row">
          <span class="ci-filter-label">品牌</span>
          <van-radio-group v-model="filterCarBrand" direction="horizontal">
            <van-radio v-for="opt in carBrandFilterOptions" :key="opt.value" :name="opt.value" icon-size="14px">
              {{ opt.text }}
            </van-radio>
          </van-radio-group>
        </div>
        <!-- 估值区间 -->
        <div class="ci-filter-row">
          <span class="ci-filter-label">估值</span>
          <van-radio-group :model-value="filterPriceMin === '' && filterPriceMax === '' ? '' : `${filterPriceMin}-${filterPriceMax}`" direction="horizontal" @update:model-value="onPriceRangeChange">
            <van-radio v-for="opt in priceRangeOptions" :key="opt.value" :name="opt.value" icon-size="14px">
              {{ opt.text }}
            </van-radio>
          </van-radio-group>
        </div>
        <!-- 操作按钮 -->
        <div class="ci-filter-actions">
          <van-button size="small" plain type="default" @click="onMoreFilterReset">重置</van-button>
          <van-button size="small" type="primary" @click="onMoreFilterApply">应用筛选</van-button>
        </div>
      </div>
    </div>

    <!-- 保险期间日期选择器 -->
    <van-popup v-model:show="dateStartPickerVisible" position="bottom" round>
      <van-date-picker
        title="选择起始日期"
        :min-date="new Date(2020, 0, 1)"
        :max-date="new Date(2030, 11, 31)"
        @confirm="onDatePickerConfirm"
        @cancel="dateStartPickerVisible = false"
      />
    </van-popup>
    <van-popup v-model:show="dateEndPickerVisible" position="bottom" round>
      <van-date-picker
        title="选择截止日期"
        :min-date="new Date(2020, 0, 1)"
        :max-date="new Date(2030, 11, 31)"
        @confirm="onDatePickerConfirm"
        @cancel="dateEndPickerVisible = false"
      />
    </van-popup>

    <!-- 投保列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div v-for="item in list" :key="item.id" class="ci-card" @click="openDetail(item)">
          <div class="ci-card-header">
            <span class="ci-plate">{{ item.plateNo }}</span>
            <van-tag :color="statusColor(item.status)" text-color="#fff" size="medium">
              {{ item.status }}
            </van-tag>
          </div>

          <div class="ci-card-body">
            <div class="ci-info-row">
              <span class="ci-label">车主</span>
              <span class="ci-value">{{ item.ownerName }}</span>
              <span class="ci-label" style="margin-left: 16px">电话</span>
              <span class="ci-value">{{ item.ownerPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}</span>
            </div>
            <div class="ci-info-row">
              <span class="ci-label">车型</span>
              <span class="ci-value">{{ item.carBrand }} {{ item.carModel }}</span>
              <span class="ci-label" style="margin-left: 16px">车龄</span>
              <span class="ci-value">{{ item.carYear }}年</span>
            </div>
            <div class="ci-info-row">
              <span class="ci-label">险种</span>
              <van-tag type="primary" plain>{{ item.insuranceType }}</van-tag>
              <span class="ci-label" style="margin-left: 16px">保额</span>
              <span class="ci-value ci-price">{{ item.estimatedValue.toLocaleString() }} 元</span>
            </div>
            <div class="ci-info-row">
              <span class="ci-label">保险期间</span>
              <span class="ci-value">{{ item.insuranceStart }} ~ {{ item.insuranceEnd }}</span>
            </div>
          </div>

          <div class="ci-card-actions">
            <van-button size="small" icon="eye-o" plain type="primary" @click.stop="openDetail(item)">详情</van-button>
            <van-button size="small" icon="edit" plain type="primary" @click.stop="openEdit(item)">编辑</van-button>
            <van-button size="small" icon="delete-o" plain type="danger" @click.stop="confirmDelete(item)"
              >删除</van-button
            >
            <van-button size="small" icon="ellipsis" plain type="default" @click.stop="openActionSheet(item)"
              >更多</van-button
            >
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 新增按钮（悬浮） -->
    <van-button class="ci-fab" type="primary" icon="plus" round @click="openAdd">新增投保</van-button>

    <!-- ==================== 新增/编辑 Popup ==================== -->
    <van-popup v-model:show="formPopupVisible" position="right" :style="{ width: '100%', height: '100%' }">
      <van-nav-bar :title="isEdit ? '编辑投保' : '新增投保'" left-arrow @click-left="closeFormPopup">
        <template #right>
          <van-button type="primary" size="small" :loading="submitting" :disabled="!canSubmit" @click="submitForm">
            提交
          </van-button>
        </template>
      </van-nav-bar>

      <div class="form-scroll">
        <!-- ===== 1. 车辆信息 ===== -->
        <van-cell-group title="车辆信息">
          <van-field
            v-model="form.plateNo"
            label="车牌号"
            placeholder="请输入车牌号"
            required
            clearable
            left-icon="guide-o"
          />
          <van-field
            v-model="form.carBrand"
            is-link
            readonly
            label="车辆品牌"
            placeholder="请选择品牌"
            left-icon="label-o"
            @click="carBrandVisible = true"
          />
          <van-field v-model="form.carModel" label="车型" placeholder="如 X5、C260L" left-icon="smile-o" />
          <van-field label="车龄（年）" left-icon="clock-o">
            <template #input>
              <van-stepper v-model="form.carYear" :min="0" :max="30" />
            </template>
          </van-field>
          <van-field
            v-model="form.vin"
            label="车架号/VIN"
            placeholder="17位车架号"
            maxlength="17"
            left-icon="notes-o"
          />
          <van-field v-model="form.engineNo" label="发动机号" placeholder="发动机编号" left-icon="setting-o" />
        </van-cell-group>

        <!-- ===== 2. 车主信息 ===== -->
        <van-cell-group title="车主信息">
          <van-field v-model="form.ownerName" label="车主姓名" placeholder="请输入姓名" required left-icon="user-o" />
          <van-field
            v-model="form.ownerPhone"
            label="联系电话"
            type="tel"
            placeholder="请输入手机号"
            required
            maxlength="11"
            left-icon="phone-o"
          >
            <template #extra>
              <van-tag v-if="form.ownerPhone && /^1\d{10}$/.test(form.ownerPhone)" type="success">有效</van-tag>
              <van-tag v-else-if="form.ownerPhone" type="danger">格式错误</van-tag>
            </template>
          </van-field>
        </van-cell-group>

        <!-- ===== 3. 投保信息 ===== -->
        <van-cell-group title="投保信息">
          <van-field
            v-model="form.insuranceType"
            is-link
            readonly
            label="险种"
            placeholder="请选择险种"
            required
            @click="insuranceTypeVisible = true"
          >
            <template #extra>
              <van-tag
                :type="
                  form.insuranceType === '全险' ? 'primary' : form.insuranceType === '商业险' ? 'warning' : 'default'
                "
              >
                {{ form.insuranceType }}
              </van-tag>
            </template>
          </van-field>

          <van-field
            v-model="form.insuranceStart"
            is-link
            readonly
            label="保险起期"
            placeholder="选择日期"
            required
            @click="insuranceStartVisible = true"
          />
          <van-field
            v-model="form.insuranceEnd"
            is-link
            readonly
            label="保险止期"
            placeholder="选择日期"
            required
            @click="insuranceEndVisible = true"
          />

          <van-field label="免赔额（元）">
            <template #input>
              <van-stepper v-model="form.deductible" :min="0" :max="10000" :step="100" />
            </template>
          </van-field>

          <van-field
            :model-value="form.estimatedValue"
            label="估价值（元）"
            type="digit"
            placeholder="请输入车辆估价值"
            required
            @update:model-value="(v: string) => (form.estimatedValue = v === '' ? 0 : Number(v))"
          >
            <template #button>
              <van-button size="small" type="primary" @click="form.estimatedValue = 300000">30万</van-button>
            </template>
          </van-field>

          <!-- Slider 估计值 -->
          <div class="ci-slider-cell">
            <div class="ci-slider-label">
              <span>估值调整</span>
              <span class="ci-slider-value">{{ form.estimatedValue.toLocaleString() }} 元</span>
            </div>
            <van-slider
              :model-value="Number(form.estimatedValue) || 0"
              @update:model-value="(v: number) => (form.estimatedValue = v)"
              :min="10000"
              :max="2000000"
              :step="10000"
              bar-height="4px"
              active-color="#1989fa"
            />
          </div>

          <!-- Rate 车况评分 -->
          <div class="ci-rate-cell">
            <span class="ci-rate-label">车况评分</span>
            <van-rate v-model="carConditionRate" :size="20" color="#ee0a24" void-color="#eee" void-icon="star" />
          </div>

          <!-- 投保区域 -->
          <van-field
            v-model="form.coverageArea"
            is-link
            readonly
            label="投保区域"
            placeholder="请选择所在地区"
            @click="coverageAreaVisible = true"
          />
        </van-cell-group>

        <!-- ===== 4. 证件图片上传 ===== -->
        <van-cell-group title="证件资料">
          <div class="ci-upload-item">
            <span class="ci-upload-title">驾驶证正面</span>
            <div class="ci-upload-area">
              <van-uploader
                :model-value="form.driverLicenseFront ? [{ url: form.driverLicenseFront }] : []"
                :max-count="1"
                accept="image/*"
                :before-read="() => true"
                :after-read="(f) => onUploadFile('front', f)"
                @delete="deleteImage('front')"
                @click-preview="onPreviewImage"
              />
            </div>
          </div>
          <div class="ci-upload-item">
            <span class="ci-upload-title">驾驶证背面</span>
            <div class="ci-upload-area">
              <van-uploader
                :model-value="form.driverLicenseBack ? [{ url: form.driverLicenseBack }] : []"
                :max-count="1"
                accept="image/*"
                :before-read="() => true"
                :after-read="(f) => onUploadFile('back', f)"
                @delete="deleteImage('back')"
                @click-preview="onPreviewImage"
              />
            </div>
          </div>
          <div class="ci-upload-item">
            <span class="ci-upload-title">车辆照片（45度角）</span>
            <div class="ci-upload-area">
              <van-uploader
                :model-value="form.carPhoto ? [{ url: form.carPhoto }] : []"
                :max-count="1"
                accept="image/*"
                :before-read="() => true"
                :after-read="(f) => onUploadFile('car', f)"
                @delete="deleteImage('car')"
                @click-preview="onPreviewImage"
              />
            </div>
          </div>
        </van-cell-group>

        <!-- ===== 5. 协议与备注 ===== -->
        <van-cell-group title="其他">
          <!-- Switch 开关 -->
          <van-cell title="同意投保协议" center>
            <template #right-icon>
              <van-switch v-model="form.agreeTerms" size="24px" />
            </template>
          </van-cell>

          <!-- Checkbox 附加险种 -->
          <div class="ci-checkbox-cell">
            <span class="ci-checkbox-label">附加险种</span>
            <van-checkbox-group v-model="extraInsurance" direction="horizontal">
              <van-checkbox name="glass" shape="square">玻璃险</van-checkbox>
              <van-checkbox name="scratch" shape="square">划痕险</van-checkbox>
              <van-checkbox name="water" shape="square">涉水险</van-checkbox>
              <van-checkbox name="theft" shape="square">盗抢险</van-checkbox>
            </van-checkbox-group>
          </div>

          <!-- Radio 出险记录 -->
          <div class="ci-radio-cell">
            <span class="ci-radio-label">上年出险记录</span>
            <van-radio-group v-model="accidentRecord" direction="horizontal">
              <van-radio name="0">无出险</van-radio>
              <van-radio name="1">1次</van-radio>
              <van-radio name="2">2次及以上</van-radio>
            </van-radio-group>
          </div>

          <!-- 备注 -->
          <van-field
            v-model="form.notes"
            label="备注"
            type="textarea"
            rows="3"
            autosize
            placeholder="填写补充说明（选填）"
            maxlength="200"
            show-word-limit
          />
        </van-cell-group>

        <!-- ===== 表单校验提示 ===== -->
        <div v-if="formErrors.length" class="ci-form-errors">
          <van-notice-bar
            v-for="err in formErrors"
            :key="err"
            :text="err"
            mode="closeable"
            color="#ee0a24"
            background="#fff2f0"
            left-icon="warning-o"
          />
        </div>

        <!-- 底部提交按钮 -->
        <div class="ci-submit-bar">
          <van-button type="primary" block round :loading="submitting" :disabled="!canSubmit" @click="submitForm">
            {{ isEdit ? '保存修改' : '确认投保' }}
          </van-button>
          <p v-if="!canSubmit" class="ci-submit-hint">请完善必填信息后再提交</p>
        </div>
      </div>
    </van-popup>

    <!-- ==================== 详情 Popup ==================== -->
    <van-popup v-model:show="detailVisible" position="bottom" round :style="{ height: '75%' }" closeable>
      <div class="detail-wrap" v-if="detailItem">
        <h3 class="detail-title">投保详情</h3>
        <van-cell-group>
          <van-cell title="车牌号" :value="detailItem.plateNo" />
          <van-cell title="车主" :value="detailItem.ownerName" />
          <van-cell title="联系电话" :value="detailItem.ownerPhone" />
          <van-cell title="车型" :value="`${detailItem.carBrand} ${detailItem.carModel}`" />
          <van-cell title="车龄" :value="`${detailItem.carYear} 年`" />
          <van-cell title="车架号" :value="detailItem.vin" />
          <van-cell title="发动机号" :value="detailItem.engineNo" />
          <van-cell title="险种">
            <van-tag type="primary" plain>{{ detailItem.insuranceType }}</van-tag>
          </van-cell>
          <van-cell title="保险起期" :value="detailItem.insuranceStart" />
          <van-cell title="保险止期" :value="detailItem.insuranceEnd" />
          <van-cell title="免赔额" :value="`${detailItem.deductible} 元`" />
          <van-cell title="估价值" :value="`${detailItem.estimatedValue.toLocaleString()} 元`" />
          <van-cell title="投保区域" :value="detailItem.coverageArea" />
          <van-cell title="状态">
            <van-tag :color="statusColor(detailItem.status)" text-color="#fff" size="medium">
              {{ detailItem.status }}
            </van-tag>
          </van-cell>
          <van-cell title="创建时间" :value="detailItem.createTime" />
          <van-cell v-if="detailItem.notes" title="备注" :value="detailItem.notes" />
        </van-cell-group>

        <!-- 图片预览 -->
        <div
          class="detail-images"
          v-if="detailItem.driverLicenseFront || detailItem.driverLicenseBack || detailItem.carPhoto"
        >
          <h4>证件图片</h4>
          <div class="detail-img-grid">
            <van-image
              v-if="detailItem.driverLicenseFront"
              :src="detailItem.driverLicenseFront"
              width="80"
              height="50"
              fit="cover"
              radius="4"
              @click="onPreviewDetailImage(detailItem!.driverLicenseFront)"
            />
            <van-image
              v-if="detailItem.driverLicenseBack"
              :src="detailItem.driverLicenseBack"
              width="80"
              height="50"
              fit="cover"
              radius="4"
              @click="onPreviewDetailImage(detailItem!.driverLicenseBack)"
            />
            <van-image
              v-if="detailItem.carPhoto"
              :src="detailItem.carPhoto"
              width="80"
              height="50"
              fit="cover"
              radius="4"
              @click="onPreviewDetailImage(detailItem!.carPhoto)"
            />
          </div>
        </div>
      </div>
    </van-popup>

    <!-- ==================== 图片预览 ==================== -->
    <van-image-preview v-model:show="imagePreviewVisible" :images="previewImages" :start-position="previewIndex" />

    <!-- ==================== Picker 弹层 ==================== -->
    <!-- 险种选择 -->
    <van-popup v-model:show="insuranceTypeVisible" position="bottom" round>
      <van-picker
        :columns="insuranceTypeOptions"
        @confirm="onPickType"
        @cancel="insuranceTypeVisible = false"
        title="选择险种"
      />
    </van-popup>

    <!-- 品牌选择 -->
    <van-popup v-model:show="carBrandVisible" position="bottom" round>
      <van-picker
        :columns="carBrandOptions"
        @confirm="onPickBrand"
        @cancel="carBrandVisible = false"
        title="选择品牌"
      />
    </van-popup>

    <!-- 保险起期 -->
    <van-popup v-model:show="insuranceStartVisible" position="bottom" round>
      <van-date-picker
        title="选择保险起期"
        :min-date="new Date()"
        @confirm="(v) => onPickDate('start', v)"
        @cancel="insuranceStartVisible = false"
      />
    </van-popup>

    <!-- 保险止期 -->
    <van-popup v-model:show="insuranceEndVisible" position="bottom" round>
      <van-date-picker
        title="选择保险止期"
        :min-date="new Date()"
        @confirm="(v) => onPickDate('end', v)"
        @cancel="insuranceEndVisible = false"
      />
    </van-popup>

    <!-- 区域选择 -->
    <van-popup v-model:show="coverageAreaVisible" position="bottom" round>
      <van-picker
        title="选择投保区域"
        :columns="[
          { text: '北京', children: [{ text: '朝阳区' }, { text: '海淀区' }] },
          { text: '上海', children: [{ text: '浦东新区' }, { text: '徐汇区' }] },
          { text: '广东', children: [{ text: '深圳' }, { text: '广州' }, { text: '东莞' }] },
          { text: '浙江', children: [{ text: '杭州' }, { text: '宁波' }] },
          { text: '江苏', children: [{ text: '南京' }, { text: '苏州' }] },
        ]"
        @confirm="onPickArea"
        @cancel="coverageAreaVisible = false"
      />
    </van-popup>

    <!-- ==================== 删除确认 ==================== -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="确认删除"
      message="删除后将无法恢复，确定要删除该投保记录吗？"
      show-cancel-button
      confirm-button-text="删除"
      confirm-button-color="#ee0a24"
      @confirm="doDelete"
    />

    <!-- ==================== ActionSheet ==================== -->
    <van-action-sheet
      v-model:show="showActionSheet"
      :actions="actionSheetActions"
      cancel-text="取消"
      @select="onActionSelect"
    />

    <!-- ==================== 操作日志 ==================== -->
    <div class="ci-log-area" v-if="logs.length">
      <h4 class="ci-log-title">操作日志</h4>
      <div class="ci-log-list">
        <div v-for="(log, i) in logs.slice(0, 10)" :key="i" class="ci-log-item">{{ log }}</div>
      </div>
      <van-button size="small" plain type="default" block @click="logs = []" v-if="logs.length > 0">
        清空日志
      </van-button>
    </div>
  </div>
</template>

<style scoped>
.ci-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
}

/* ===== FAB ===== */
.ci-fab {
  position: fixed;
  left: 16px;
  right: 16px;
  margin: 0 auto;
  max-width: 480px;
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  z-index: 999;
  height: 44px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
  border: none;
  box-shadow: 0 6px 20px rgba(25, 137, 250, 0.45);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.ci-fab:active {
  transform: scale(0.97);
  box-shadow: 0 3px 10px rgba(25, 137, 250, 0.3);
}

/* ===== Search ===== */
.search-wrap {
  padding: 0 4px;
}

/* ===== Date Filter Chips ===== */
.ci-date-filter-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ci-date-chip {
  text-align: center;
  font-size: 12px;
  color: #969799;
  background: #f7f8fa;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ci-date-chip--active {
  color: #1989fa;
  background: #ecf5ff;
  font-weight: 600;
}

/* ===== More Filter ===== */
.ci-more-filter-wrap {
  background: #fff;
}

.ci-more-filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  font-size: 13px;
  color: #646566;
  cursor: pointer;
  border-top: 1px solid #f5f5f5;
}

.ci-more-filter-body {
  padding: 0 16px 12px;
  border-top: 1px solid #f5f5f5;
}

.ci-filter-row {
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.ci-filter-row:last-child {
  border-bottom: none;
}

.ci-filter-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 8px;
}

.ci-filter-actions {
  display: flex;
  gap: 10px;
  padding-top: 12px;
}

.ci-filter-actions .van-button {
  flex: 1;
}

/* ===== Card ===== */
.ci-card {
  margin: 8px 12px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.ci-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.ci-plate {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: 0.5px;
}

.ci-card-body {
  margin-bottom: 10px;
}

.ci-info-row {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 13px;
}

.ci-label {
  color: #999;
  min-width: 28px;
  flex-shrink: 0;
}

.ci-value {
  color: #333;
  margin-left: 4px;
}

.ci-price {
  color: #ee0a24;
  font-weight: 600;
}

.ci-card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid #f5f5f5;
}

/* ===== Form Scroll ===== */
.form-scroll {
  height: calc(100% - 46px);
  overflow-y: auto;
  padding-bottom: 80px;
}

/* ===== Upload ===== */
.ci-upload-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.ci-upload-title {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  display: block;
}

.ci-upload-area {
  display: flex;
}

/* ===== Slider ===== */
.ci-slider-cell {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.ci-slider-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
  color: #666;
}

.ci-slider-value {
  color: #ee0a24;
  font-weight: 600;
}

/* ===== Rate ===== */
.ci-rate-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.ci-rate-label {
  font-size: 13px;
  color: #666;
}

/* ===== Checkbox & Radio ===== */
.ci-checkbox-cell,
.ci-radio-cell {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.ci-checkbox-label,
.ci-radio-label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

/* ===== Form Errors ===== */
.ci-form-errors {
  margin: 12px 16px;
}

/* ===== Submit Bar ===== */
.ci-submit-bar {
  padding: 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  position: sticky;
  bottom: 0;
}

.ci-submit-hint {
  text-align: center;
  color: #ee0a24;
  font-size: 12px;
  margin-top: 6px;
}

/* ===== Detail ===== */
.detail-wrap {
  padding: 16px 0 40px;
}

.detail-title {
  text-align: center;
  font-size: 17px;
  margin: 0 0 12px 0;
  color: #1a1a1a;
}

.detail-images {
  padding: 12px 16px;
}

.detail-images h4 {
  font-size: 14px;
  color: #333;
  margin: 0 0 8px 0;
}

.detail-img-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ===== Log ===== */
.ci-log-area {
  margin: 16px 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
}

.ci-log-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.ci-log-list {
  max-height: 200px;
  overflow-y: auto;
}

.ci-log-item {
  font-size: 11px;
  color: #999;
  padding: 2px 0;
  font-family: monospace;
}
</style>
