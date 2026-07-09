<script setup lang="ts">
/**
 * 文件上传组件（通用）
 *
 * Props:
 *   modelValue  — 文件 URL（v-model）
 *   accept      — 接受的文件类型（如 '.pdf,.doc'）
 *   maxSize     — 单文件大小限制 MB（默认 10）
 *   disabled    — 是否禁用
 *   hint        — 提示文字
 *
 * 特性：
 *   - 拖拽上传 + 点击上传
 *   - 自定义文件图标按钮
 *   - 上传进度显示
 */
import { watch, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  FileOutlined,
  InboxOutlined,
  PaperClipOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import { uploadFile } from '@/api/modules/upload'
import type { UploadChangeParam, UploadFile } from 'ant-design-vue'

const props = withDefaults(defineProps<{
  modelValue: string
  accept?: string
  maxSize?: number
  disabled?: boolean
  hint?: string
}>(), {
  accept: '',
  maxSize: 10,
  disabled: false,
  hint: '点击或拖拽文件到此区域上传',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'upload-success': [url: string, fileName: string]
}>()

const fileList = ref<UploadFile[]>([])
const uploading = ref(false)

// ===== 回显 =====
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      fileList.value = [
        { uid: '-file', name: val.split('/').pop() || 'file', status: 'done', url: val },
      ]
    } else {
      fileList.value = []
    }
  },
  { immediate: true },
)

// ===== 上传 =====
function handleBeforeUpload(file: File) {
  if (file.size / 1024 / 1024 > props.maxSize) {
    message.error(`文件大小不能超过 ${props.maxSize}MB！`)
    return false
  }
  doUpload(file)
  return false
}

async function doUpload(file: File) {
  uploading.value = true
  try {
    const base64 = await fileToBase64(file)
    const result = await uploadFile({ fileName: file.name, base64, type: 'file' })
    emit('update:modelValue', result.url)
    emit('upload-success', result.url, file.name)
    message.success('上传成功')
  } catch {
    message.error('上传失败，请重试')
  } finally {
    uploading.value = false
  }
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
  emit('update:modelValue', '')
}

function handleChange(info: UploadChangeParam) {
  fileList.value = info.fileList
}

// 从 URL 中提取文件名
function urlFileName(url: string) {
  return url.split('/').pop() || 'file'
}
</script>

<template>
  <div class="file-uploader">
    <a-upload-dragger
      v-model:file-list="fileList"
      :max-count="1"
      :accept="accept"
      :disabled="disabled"
      :before-upload="handleBeforeUpload"
      @remove="handleRemove"
      @change="handleChange"
    >
      <!-- 未上传：显示拖拽区域 -->
      <template v-if="!modelValue">
        <p class="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p class="ant-upload-text">{{ hint }}</p>
        <p v-if="accept" class="ant-upload-hint">
          支持格式：{{ accept }}
        </p>
      </template>

      <!-- 已上传：显示文件信息 -->
      <template v-else>
        <div class="file-preview">
          <FileOutlined class="file-preview-icon" />
          <span class="file-preview-name">{{ urlFileName(modelValue) }}</span>
        </div>
      </template>
    </a-upload-dragger>

    <div v-if="modelValue" class="file-actions">
      <a :href="modelValue" target="_blank">预览文件</a>
      <a-divider type="vertical" />
      <a-button type="link" danger size="small" @click="handleRemove">
        <DeleteOutlined /> 移除
      </a-button>
    </div>

    <span v-if="uploading" class="upload-hint">上传中...</span>
  </div>
</template>

<style scoped>
.file-uploader {
  width: 100%;
}

.ant-upload-drag-icon {
  margin-bottom: 12px;
}

.file-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
}

.file-preview-icon {
  font-size: 28px;
  color: #1677ff;
}

.file-preview-name {
  font-size: 14px;
  color: #333;
}

.file-actions {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.upload-hint {
  color: #1677ff;
  font-size: 12px;
  margin-top: 4px;
  display: inline-block;
}
</style>
