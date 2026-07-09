<script setup lang="ts">
/**
 * Excel 导入组件
 *
 * Props:
 *   modelValue  — 解析后的表格数据（二维数组）
 *   url         — 已上传文件的 URL（双向绑定）
 *   columns     — 表头映射配置
 *
 * 特性：
 *   - 拖拽/点击上传 Excel 文件
 *   - Mock 解析并预览数据
 *   - 表格预览 + 确认导入
 */
import { watch, ref, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { FileExcelOutlined, InboxOutlined, EyeOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { uploadExcel, parseExcel } from '@/api/modules/upload'
import type { UploadChangeParam, UploadFile } from 'ant-design-vue'

const props = withDefaults(defineProps<{
  modelValue: any[][]
  url?: string
  columns?: { title: string; key: string }[]
}>(), {
  url: '',
  columns: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: any[][]]
  'update:url': [value: string]
  'import': [data: any[][]]
}>()

const fileList = ref<UploadFile[]>([])
const uploading = ref(false)
const previewOpen = ref(false)
// 原始解析数据（二维数组，第一行为表头）
const rawData = ref<any[][]>([])
// 转换后的对象数组（用于表格展示）
const previewData = ref<Record<string, any>[]>([])
const previewColumns = ref<{ title: string; dataIndex: string; key: string }[]>([])

// ===== 回显 =====
watch(
  () => props.url,
  (val) => {
    if (val) {
      fileList.value = [
        { uid: '-xls', name: val.split('/').pop() || 'excel.xlsx', status: 'done', url: val },
      ]
    } else {
      fileList.value = []
    }
  },
  { immediate: true },
)

// ===== 上传 Excel =====
function handleBeforeUpload(file: File) {
  const isValid = /\.(xlsx|xls|csv)$/i.test(file.name)
  if (!isValid) {
    message.error('只支持 .xlsx / .xls / .csv 格式！')
    return false
  }
  if (file.size / 1024 / 1024 > 10) {
    message.error('文件大小不能超过 10MB！')
    return false
  }
  doUpload(file)
  return false
}

async function doUpload(file: File) {
  uploading.value = true
  try {
    const base64 = await fileToBase64(file)
    const result = await uploadExcel({ fileName: file.name, base64 })
    emit('update:url', result.url)
    message.success('文件上传成功，正在解析...')

    // 解析 Excel 获取预览数据
    const parseResult = await parseExcel({ fileName: file.name })
    rawData.value = parseResult.data
    if (parseResult.data && parseResult.data.length > 0) {
      buildPreview(parseResult.data)
      previewOpen.value = true
    } else {
      message.warning('文件中没有数据')
    }
  } catch {
    message.error('上传或解析失败，请重试')
  } finally {
    uploading.value = false
  }
}

function buildPreview(data: any[][]) {
  if (data.length === 0) return
  const headers = data[0] as string[]
  const rows = data.slice(1)

  previewColumns.value = headers.map((h, i) => ({
    title: h,
    dataIndex: `col_${i}`,
    key: `col_${i}`,
  }))

  previewData.value = rows.map((row) => {
    const obj: Record<string, any> = {}
    headers.forEach((_, i) => {
      obj[`col_${i}`] = row[i] ?? ''
    })
    return obj
  })
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve((e.target?.result as string) || '')
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

function handleRemove() {
  emit('update:url', '')
  emit('update:modelValue', [])
  rawData.value = []
  previewData.value = []
  previewColumns.value = []
}

function handleChange(info: UploadChangeParam) {
  fileList.value = info.fileList
}

// ===== 确认导入 =====
function handleConfirmImport() {
  if (rawData.value.length > 0) {
    emit('update:modelValue', rawData.value)
    emit('import', rawData.value)
    message.success(`成功导入 ${rawData.value.length - 1} 条数据`)
  }
  previewOpen.value = false
}

function handleCancelPreview() {
  previewOpen.value = false
}

function handlePreview() {
  if (rawData.value.length > 0) {
    previewOpen.value = true
  }
}

// 已上传文件名
function fileName() {
  return props.url ? props.url.split('/').pop() || 'excel.xlsx' : ''
}
</script>

<template>
  <div class="excel-importer">
    <!-- 上传区域 -->
    <a-upload-dragger
      v-model:file-list="fileList"
      :max-count="1"
      accept=".xlsx,.xls,.csv"
      :before-upload="handleBeforeUpload"
      @remove="handleRemove"
      @change="handleChange"
    >
      <template v-if="!url">
        <p class="ant-upload-drag-icon">
          <FileExcelOutlined style="color: #52c41a; font-size: 48px" />
        </p>
        <p class="ant-upload-text">点击或拖拽 Excel 文件到此区域</p>
        <p class="ant-upload-hint">支持 .xlsx / .xls / .csv 格式</p>
      </template>
      <template v-else>
        <div class="excel-preview-badge">
          <FileExcelOutlined style="color: #52c41a; font-size: 36px" />
          <span class="excel-name">{{ fileName() }}</span>
          <a-button type="link" size="small" @click.stop="handlePreview">
            <EyeOutlined /> 预览数据
          </a-button>
        </div>
      </template>
    </a-upload-dragger>

    <span v-if="uploading" class="upload-hint">解析中...</span>

    <!-- 数据预览弹窗 -->
    <a-modal
      v-model:open="previewOpen"
      title="数据预览"
      width="800px"
      :footer="null"
    >
      <a-alert
        :message="`共 ${rawData.length - 1} 条数据，${rawData[0]?.length || 0} 列`"
        type="info"
        show-icon
        style="margin-bottom: 16px"
      />
      <a-table
        :columns="previewColumns"
        :data-source="previewData"
        :pagination="{ pageSize: 5 }"
        :scroll="{ x: 'max-content' }"
        size="small"
        bordered
      />
      <div class="excel-actions">
        <a-button @click="handleCancelPreview">取消</a-button>
        <a-button type="primary" @click="handleConfirmImport">
          <CheckOutlined /> 确认导入
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.excel-importer {
  width: 100%;
}

.ant-upload-drag-icon {
  margin-bottom: 12px;
}

.excel-preview-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.excel-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.excel-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.upload-hint {
  color: #1677ff;
  font-size: 12px;
  margin-top: 4px;
  display: inline-block;
}
</style>
