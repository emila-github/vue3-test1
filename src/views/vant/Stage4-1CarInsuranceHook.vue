<script setup lang="ts">
/**
 * 阶段四（Hook 版）：车险投保列表页 — 基于 useCrudList 通用增删改查 Hook
 *
 * 与 Stage4CarInsurance.vue 功能完全一致，但把「查询 / 无限加载 / 新增 / 编辑 /
 * 详情 / 删除 / 权限控制 / 日志」等公共逻辑下沉到 useCrudList，
 * 本文件仅保留车险特有的 UI 与表单 / Picker / 图片上传等交互。
 *
 * 新增同类 Vant4 列表页时，可照本文件复制改写，仅需替换：
 *   - 类型与 api 集合
 *   - initialForm / initialQuery
 *   - 列表卡片与表单模板
 * 其余逻辑（加载、增删改、权限、日志）全部复用 useCrudList。
 */

import { ref, reactive, computed, watch } from 'vue'
import {
  createCarInsurance,
  updateCarInsurance,
  deleteCarInsurance,
  getCarInsuranceList,
  uploadCarInsuranceImage,
} from '@/api/modules/car-insurance'
import type { CarInsurance, CarInsuranceForm, CarInsuranceQuery } from '@/api/modules/car-insurance'
import { useCrudList } from '@/composables/useCrudList'
import VantSelectField from '@/components/VantSelectField.vue'

// ==================== 通用 CRUD Hook ====================
// 查询初始条件（含自定义筛选），统一走 hook.query
const initialQuery: CarInsuranceQuery = {
  keyword: '',
  status: '',
  insuranceType: '',
  carBrand: '',
  insuranceStartFrom: '',
  insuranceStartTo: '',
  insuranceEndFrom: '',
  insuranceEndTo: '',
  priceMin: undefined,
  priceMax: undefined,
}

const {
  // 列表
  loading,
  refreshing,
  finished,
  list,
  query,
  onSearch,
  onLoad,
  onRefresh,
  // 表单 / 弹层
  isEdit,
  form,
  formVisible,
  submitting,
  openCreate,
  openEdit,
  submit,
  // 详情
  detailVisible,
  detailItem,
  openDetail,
  // 删除
  showDeleteDialog,
  confirmDelete,
  doDelete,
  // 权限
  permTick,
  permCodes,
  hasPerm,
  // 日志
  logs,
  addLog,
} = useCrudList<CarInsurance, CarInsuranceForm, CarInsuranceQuery>({
  api: {
    list: getCarInsuranceList,
    create: createCarInsurance,
    update: updateCarInsurance,
    remove: deleteCarInsurance,
  },
  initialForm: {
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
    extraInsurance: [],
    accidentRecord: '0',
    carConditionRate: 4,
  },
  initialQuery,
  permissionPrefix: 'car',
  enableLog: true,
})

// ==================== 车险特有 UI 状态 ====================
const statusTabs = [
  { name: '全部', value: '' },
  { name: '待审核', value: '待审核' },
  { name: '已生效', value: '已生效' },
  { name: '已过期', value: '已过期' },
]

const showMoreFilter = ref(false)

// Picker 选项
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
const insuranceTypeFilterOptions = [{ text: '不限险种', value: '' }, ...insuranceTypeOptions]
const carBrandFilterOptions = [{ text: '不限品牌', value: '' }, ...carBrandOptions]
const priceRangeOptions = [
  { text: '不限', value: '' },
  { text: '10万以下', value: '0-100000' },
  { text: '10-30万', value: '100000-300000' },
  { text: '30-50万', value: '300000-500000' },
  { text: '50-100万', value: '500000-1000000' },
  { text: '100万以上', value: '1000000-99999999' },
]

// Picker 弹出控制（车险特有，保留本地）
const insuranceTypeVisible = ref(false)
const insuranceStartVisible = ref(false)
const insuranceEndVisible = ref(false)
const coverageAreaVisible = ref(false)
const imagePreviewVisible = ref(false)
const previewImages = ref<string[]>([])
const previewIndex = ref(0)

// 更多筛选：日期区间
const filterStartFrom = computed({
  get: () => query.insuranceStartFrom ?? '',
  set: (v: string) => (query.insuranceStartFrom = v || undefined),
})
const filterStartTo = computed({
  get: () => query.insuranceStartTo ?? '',
  set: (v: string) => (query.insuranceStartTo = v || undefined),
})
const filterEndFrom = computed({
  get: () => query.insuranceEndFrom ?? '',
  set: (v: string) => (query.insuranceEndFrom = v || undefined),
})
const filterEndTo = computed({
  get: () => query.insuranceEndTo ?? '',
  set: (v: string) => (query.insuranceEndTo = v || undefined),
})
const dateStartPickerVisible = ref(false)
const dateEndPickerVisible = ref(false)
const datePickerMode = ref<'startFrom' | 'startTo' | 'endFrom' | 'endTo'>('startFrom')

const filterPriceMin = computed({
  get: () => (query.priceMin ?? '') as number | '',
  set: (v: number | '') => (query.priceMin = v === '' ? undefined : Number(v)),
})
const filterPriceMax = computed({
  get: () => (query.priceMax ?? '') as number | '',
  set: (v: number | '') => (query.priceMax = v === '' ? undefined : Number(v)),
})

// ==================== 图片上传 ====================
const uploadLoading = reactive({ front: false, back: false, car: false })

function getImagePreviewIndex(url: string) {
  previewImages.value = [form.driverLicenseFront, form.driverLicenseBack, form.carPhoto].filter(Boolean) as string[]
  const idx = previewImages.value.indexOf(url)
  previewIndex.value = idx >= 0 ? idx : 0
  imagePreviewVisible.value = true
}
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve((e.target?.result as string) || '')
    reader.onerror = () => reject(new Error('读取失败'))
    reader.readAsDataURL(file)
  })
}
async function afterRead(type: 'front' | 'back' | 'car', file: any) {
  uploadLoading[type] = true
  try {
    const base64 = await fileToBase64(file)
    const result = await uploadCarInsuranceImage(file.name || 'image.png', base64)
    if (type === 'front') form.driverLicenseFront = result.url
    else if (type === 'back') form.driverLicenseBack = result.url
    else form.carPhoto = result.url
  } finally {
    uploadLoading[type] = false
  }
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

// ==================== Picker 通用回调 ====================
function onPickType(values: any) {
  form.insuranceType = values.selectedOptions[0].value
  insuranceTypeVisible.value = false
}
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

// ==================== 状态 / 筛选 切换 ====================
function onStatusChange(tab: { name: string; value: string }) {
  query.status = tab.value
  onSearch()
}

function onDateFilterClick(mode: 'startFrom' | 'startTo' | 'endFrom' | 'endTo') {
  datePickerMode.value = mode
  const targetMode = mode.startsWith('start') ? 'start' : 'end'
  if (targetMode === 'start') dateStartPickerVisible.value = true
  else dateEndPickerVisible.value = true
}
function onDatePickerConfirm({ selectedValues }: { selectedValues: string[] }) {
  const dateStr = selectedValues.join('-')
  if (dateStartPickerVisible.value) {
    if (datePickerMode.value === 'startFrom') query.insuranceStartFrom = dateStr
    if (datePickerMode.value === 'startTo') query.insuranceStartTo = dateStr
    dateStartPickerVisible.value = false
  } else if (dateEndPickerVisible.value) {
    if (datePickerMode.value === 'endFrom') query.insuranceEndFrom = dateStr
    if (datePickerMode.value === 'endTo') query.insuranceEndTo = dateStr
    dateEndPickerVisible.value = false
  }
}
function onPriceRangeChange(val: string) {
  if (!val) {
    query.priceMin = undefined
    query.priceMax = undefined
  } else {
    const [min, max] = val.split('-')
    query.priceMin = Number(min)
    query.priceMax = Number(max)
  }
}

const activeFilterCount = computed(() => {
  let count = 0
  if (query.insuranceType) count++
  if (query.carBrand) count++
  if (filterStartFrom.value || filterStartTo.value || filterEndFrom.value || filterEndTo.value) count++
  if (filterPriceMin.value !== '' || filterPriceMax.value !== '') count++
  return count
})

function onMoreFilterApply() {
  showMoreFilter.value = false
  onSearch()
}
function onMoreFilterReset() {
  Object.assign(query, initialQuery)
}

// ==================== ActionSheet 批量操作（按权限过滤） ====================
const showActionSheet = ref(false)
const actionSheetItem = ref<CarInsurance | null>(null)
const actionSheetActions = computed(() =>
  [
    { name: '查看详情', value: 'detail', perm: permCodes.value.view },
    { name: '编辑', value: 'edit', perm: permCodes.value.edit },
    { name: '删除', value: 'delete', perm: permCodes.value.delete },
  ].filter((a) => hasPerm(a.perm)),
)
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

// ==================== 表单校验 ====================
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

function statusColor(status: string) {
  const map: Record<string, string> = {
    待审核: '#f59e0b',
    已生效: '#18a058',
    已过期: '#999',
  }
  return map[status] || '#999'
}

watch(formVisible, (v) => {
  if (v) addLog(isEdit.value ? `打开编辑：${form.plateNo}` : '打开新增投保')
})
watch(showDeleteDialog, (v) => {
  if (v) addLog('确认删除投保记录')
})
</script>

<template>
  <div class="ci-page picc-page" :data-perm="permTick">
    <!-- 导航栏 -->
    <van-nav-bar title="PICC 车险" class="van-nav-bar--picc-primary" left-text="返回" left-arrow> </van-nav-bar>

    <!-- 红色渐变英雄头图 -->
    <div class="picc-header-gradient">
      <p class="header-title">车险投保管理</p>
      <p class="header-sub">实时掌握保单状态 · 在线投保更便捷</p>
    </div>

    <!-- 暖色合规提示 -->
    <div class="picc-notice-warm">温馨提示：保单信息变更请及时更新，确保理赔与续保顺畅无忧。</div>

    <!-- 搜索栏 -->
    <div class="search-wrap">
      <van-search
        v-model="query.keyword"
        placeholder="搜索车牌号 / 车主 / 手机号 / 车架号"
        shape="round"
        show-action
        @search="onSearch"
        @clear="onSearch"
      >
        <template #action>
          <div @click="onSearch" style="color: #d71920; padding: 0 4px">搜索</div>
        </template>
      </van-search>
    </div>

    <!-- 状态筛选标签 -->
    <van-tabs :active="query.status" animated swipeable sticky @change="onStatusChange">
      <van-tab v-for="tab in statusTabs" :key="tab.value" :title="tab.name" :name="tab.value" />
    </van-tabs>

    <!-- 更多查询方案 -->
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
        <div class="ci-filter-row">
          <span class="ci-filter-label">保险期间</span>
          <div class="ci-date-filter-inline">
            <div
              :class="['ci-date-chip', filterStartFrom && 'ci-date-chip--active']"
              @click="onDateFilterClick('startFrom')"
            >
              {{ filterStartFrom || '起期从' }}
            </div>
            <div
              :class="['ci-date-chip', filterStartTo && 'ci-date-chip--active']"
              @click="onDateFilterClick('startTo')"
            >
              {{ filterStartTo || '起期至' }}
            </div>
            <div
              :class="['ci-date-chip', filterEndFrom && 'ci-date-chip--active']"
              @click="onDateFilterClick('endFrom')"
            >
              {{ filterEndFrom || '止期从' }}
            </div>
            <div :class="['ci-date-chip', filterEndTo && 'ci-date-chip--active']" @click="onDateFilterClick('endTo')">
              {{ filterEndTo || '止期至' }}
            </div>
          </div>
        </div>
        <div class="ci-filter-row">
          <span class="ci-filter-label">险种</span>
          <van-radio-group v-model="query.insuranceType" direction="horizontal">
            <van-radio v-for="opt in insuranceTypeFilterOptions" :key="opt.value" :name="opt.value" icon-size="14px">
              {{ opt.text }}
            </van-radio>
          </van-radio-group>
        </div>
        <div class="ci-filter-row">
          <span class="ci-filter-label">品牌</span>
          <van-radio-group v-model="query.carBrand" direction="horizontal">
            <van-radio v-for="opt in carBrandFilterOptions" :key="opt.value" :name="opt.value" icon-size="14px">
              {{ opt.text }}
            </van-radio>
          </van-radio-group>
        </div>
        <div class="ci-filter-row">
          <span class="ci-filter-label">估值</span>
          <van-radio-group
            :model-value="filterPriceMin === '' && filterPriceMax === '' ? '' : `${filterPriceMin}-${filterPriceMax}`"
            direction="horizontal"
            @update:model-value="onPriceRangeChange"
          >
            <van-radio v-for="opt in priceRangeOptions" :key="opt.value" :name="opt.value" icon-size="14px">
              {{ opt.text }}
            </van-radio>
          </van-radio-group>
        </div>
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
        <div v-for="item in list" :key="item.id" class="ci-card picc-card" @click="openDetail(item)">
          <div class="ci-card-header">
            <span class="ci-plate">{{ item.plateNo }}</span>
            <van-tag :color="statusColor(item.status)" text-color="#fff" size="medium">{{ item.status }}</van-tag>
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
              <span class="ci-value ci-price picc-price"
                >¥<span class="picc-number-display">{{ item.estimatedValue.toLocaleString() }}</span> 元</span
              >
            </div>
            <div class="ci-info-row">
              <span class="ci-label">保险期间</span>
              <span class="ci-value">{{ item.insuranceStart }} ~ {{ item.insuranceEnd }}</span>
            </div>
          </div>

          <div class="ci-card-actions">
            <van-button
              size="small"
              icon="eye-o"
              plain
              type="primary"
              v-permission="permCodes.view"
              @click.stop="openDetail(item)"
              >详情</van-button
            >
            <van-button
              size="small"
              icon="edit"
              plain
              type="primary"
              v-permission="permCodes.edit"
              @click.stop="openEdit(item)"
              >编辑</van-button
            >
            <van-button
              size="small"
              icon="delete-o"
              plain
              type="danger"
              v-permission="permCodes.delete"
              @click.stop="confirmDelete(item)"
              >删除</van-button
            >
            <van-button
              size="small"
              icon="ellipsis"
              plain
              type="default"
              v-permission="[permCodes.view, permCodes.edit, permCodes.delete]"
              @click.stop="openActionSheet(item)"
              >更多</van-button
            >
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 新增按钮（悬浮） -->
    <van-button class="ci-fab" type="primary" icon="plus" round v-permission="permCodes.create" @click="openCreate"
      >新增投保</van-button
    >

    <!-- ==================== 新增/编辑 Popup ==================== -->
    <van-popup v-model:show="formVisible" position="right" :style="{ width: '100%', height: '100%' }">
      <van-nav-bar :title="isEdit ? '编辑投保' : '新增投保'" left-arrow @click-left="formVisible = false">
        <template #right>
          <van-button type="primary" size="small" :loading="submitting" :disabled="!canSubmit" @click="submit"
            >提交</van-button
          >
        </template>
      </van-nav-bar>

      <div class="form-scroll picc-page">
        <div class="picc-section-title">车辆信息</div>
        <van-cell-group class="picc-card">
          <van-field
            v-model="form.plateNo"
            label="车牌号"
            placeholder="请输入车牌号"
            required
            clearable
            left-icon="guide-o"
          />
          <VantSelectField
            v-model="form.carBrand"
            :options="carBrandOptions"
            label="车辆品牌"
            title="选择品牌"
            placeholder="请选择品牌"
            left-icon="label-o"
            clearable
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

        <div class="picc-section-title">车主信息</div>
        <van-cell-group class="picc-card">
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

        <div class="picc-section-title">投保信息</div>
        <van-cell-group class="picc-card">
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

          <div class="ci-slider-cell">
            <div class="ci-slider-label">
              <span>估值调整</span>
              <span class="ci-slider-value picc-number-display">{{ form.estimatedValue.toLocaleString() }} 元</span>
            </div>
            <van-slider
              :model-value="Number(form.estimatedValue) || 0"
              @update:model-value="(v: number) => (form.estimatedValue = v)"
              :min="10000"
              :max="2000000"
              :step="10000"
              bar-height="4px"
            />
          </div>

          <div class="ci-rate-cell">
            <span class="ci-rate-label">车况评分</span>
            <van-rate v-model="form.carConditionRate" :size="20" void-color="#eee" void-icon="star" />
          </div>

          <van-field
            v-model="form.coverageArea"
            is-link
            readonly
            label="投保区域"
            placeholder="请选择所在地区"
            @click="coverageAreaVisible = true"
          />
        </van-cell-group>

        <div class="picc-section-title">证件资料</div>
        <van-cell-group class="picc-card">
          <div class="ci-upload-item">
            <span class="ci-upload-title">驾驶证正面</span>
            <div class="ci-upload-area">
              <van-uploader
                :model-value="form.driverLicenseFront ? [{ url: form.driverLicenseFront }] : []"
                :max-count="1"
                accept="image/*"
                :before-read="() => true"
                :after-read="(f: any) => onUploadFile('front', f)"
                :preview-full-image="false"
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
                :after-read="(f: any) => onUploadFile('back', f)"
                :preview-full-image="false"
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
                :after-read="(f: any) => onUploadFile('car', f)"
                :preview-full-image="false"
                @delete="deleteImage('car')"
                @click-preview="onPreviewImage"
              />
            </div>
          </div>
        </van-cell-group>

        <div class="picc-section-title">其他</div>
        <van-cell-group class="picc-card">
          <van-cell title="同意投保协议" center>
            <template #right-icon>
              <van-switch v-model="form.agreeTerms" size="24px" />
            </template>
          </van-cell>
          <div class="ci-checkbox-cell">
            <span class="ci-checkbox-label">附加险种</span>
            <van-checkbox-group v-model="form.extraInsurance" direction="horizontal">
              <van-checkbox name="glass" shape="square">玻璃险</van-checkbox>
              <van-checkbox name="scratch" shape="square">划痕险</van-checkbox>
              <van-checkbox name="water" shape="square">涉水险</van-checkbox>
              <van-checkbox name="theft" shape="square">盗抢险</van-checkbox>
            </van-checkbox-group>
          </div>
          <div class="ci-radio-cell">
            <span class="ci-radio-label">上年出险记录</span>
            <van-radio-group v-model="form.accidentRecord" direction="horizontal">
              <van-radio name="0">无出险</van-radio>
              <van-radio name="1">1次</van-radio>
              <van-radio name="2">2次及以上</van-radio>
            </van-radio-group>
          </div>
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

        <div v-if="formErrors.length" class="ci-form-errors">
          <van-notice-bar v-for="err in formErrors" :key="err" :text="err" mode="closeable" left-icon="warning-o" />
        </div>

        <div class="ci-submit-bar">
          <van-button type="primary" block round :loading="submitting" :disabled="!canSubmit" @click="submit">
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
            <van-tag :color="statusColor(detailItem.status)" text-color="#fff" size="medium">{{
              detailItem.status
            }}</van-tag>
          </van-cell>
          <van-cell title="创建时间" :value="detailItem.createTime" />
          <van-cell v-if="detailItem.notes" title="备注" :value="detailItem.notes" />
        </van-cell-group>

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
    <van-popup v-model:show="insuranceTypeVisible" position="bottom" round>
      <van-picker
        :columns="insuranceTypeOptions"
        @confirm="onPickType"
        @cancel="insuranceTypeVisible = false"
        title="选择险种"
      />
    </van-popup>

    <van-popup v-model:show="insuranceStartVisible" position="bottom" round>
      <van-date-picker
        title="选择保险起期"
        :min-date="new Date()"
        @confirm="(v: any) => onPickDate('start', v)"
        @cancel="insuranceStartVisible = false"
      />
    </van-popup>
    <van-popup v-model:show="insuranceEndVisible" position="bottom" round>
      <van-date-picker
        title="选择保险止期"
        :min-date="new Date()"
        @confirm="(v: any) => onPickDate('end', v)"
        @cancel="insuranceEndVisible = false"
      />
    </van-popup>
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
      <van-button size="small" plain type="default" block @click="logs = []" v-if="logs.length > 0"
        >清空日志</van-button
      >
    </div>
  </div>
</template>

<style scoped>
.ci-page {
  padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
}
.header-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}
.header-sub {
  margin: 6px 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}
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
  box-shadow: 0 6px 20px rgba(215, 25, 32, 0.35);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.ci-fab:active {
  transform: scale(0.97);
  box-shadow: 0 3px 10px rgba(215, 25, 32, 0.25);
}
.search-wrap {
  padding: 0 4px;
}
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
  color: #d71920;
  background: #fcebec;
  font-weight: 600;
}
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
:global(html:not(.picc-skin)) .ci-card {
  margin: 8px 12px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 12px;
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
  font-weight: 600;
}
:global(html:not(.picc-skin)) .ci-price {
  color: #d71920;
}
.ci-card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid #f5f5f5;
}
.form-scroll {
  height: calc(100% - 46px);
  overflow-y: auto;
  padding-bottom: 80px;
}
.ci-upload-item {
  padding: 12px 0;
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
.ci-slider-cell {
  padding: 12px 0;
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
  color: #d71920;
  font-weight: 600;
}
.ci-rate-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}
.ci-rate-label {
  font-size: 13px;
  color: #666;
}
.ci-checkbox-cell,
.ci-radio-cell {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.ci-checkbox-label,
.ci-radio-label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}
.ci-form-errors {
  margin: 12px 16px;
}
.ci-submit-bar {
  padding: 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  position: sticky;
  bottom: 0;
}
.ci-submit-hint {
  text-align: center;
  color: #d71920;
  font-size: 12px;
  margin-top: 6px;
}
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
