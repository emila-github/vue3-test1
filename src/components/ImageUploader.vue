<script setup lang="ts">
/**
 * 图片上传组件
 *
 * Props:
 *   modelValue  — 图片 URL 或 URL 数组（v-model）
 *   multiple    — 是否多选（默认 false）
 *   maxCount    — 最大上传数量（默认 1）
 *   maxSize     — 单文件大小限制 MB（默认 5）
 *   disabled    — 是否禁用
 *   listType    — 展示类型: 'picture-card' | 'picture' | 'text'
 *
 * 自定义上传按钮展示图片图标
 */
import { watch, ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, PictureOutlined } from '@ant-design/icons-vue'
import { uploadFile } from '@/api/modules/upload'
import type { UploadChangeParam, UploadFile } from 'ant-design-vue'

const props = withDefaults(defineProps<{
  modelValue: string | string[]
  multiple?: boolean
  maxCount?: number
  maxSize?: number
  disabled?: boolean
  listType?: 'picture-card' | 'picture' | 'text'
}>(), {
  multiple: false,
  maxCount: 1,
  maxSize: 5,
  disabled: false,
  listType: 'picture-card',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const fileList = ref<UploadFile[]>([])
const uploading = ref(false)

// ===== 回显同步 =====
watch(
  () => props.modelValue,
  (val) => {
    if (!val || (Array.isArray(val) && val.length === 0)) {
      fileList.value = []
      return
    }
    const urls = Array.isArray(val) ? val : [val]
    fileList.value = urls.map((url, i) => ({
      uid: `-img-${i}`,
      name: `image-${i}.png`,
      status: 'done' as const,
      url,
    }))
  },
  { immediate: true },
)

// ===== 上传 =====
function handleBeforeUpload(file: File) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件！')
    return false
  }
  if (file.size / 1024 / 1024 > props.maxSize) {
    message.error(`图片大小不能超过 ${props.maxSize}MB！`)
    return false
  }
  doUpload(file)
  return false
}

async function doUpload(file: File) {
  uploading.value = true
  try {
    const base64 = await fileToBase64(file)
    const result = await uploadFile({ fileName: file.name, base64, type: 'image' })
    if (props.multiple) {
      const arr = Array.isArray(props.modelValue) ? [...props.modelValue] : props.modelValue ? [props.modelValue] : []
      arr.push(result.url)
      emit('update:modelValue', arr)
    } else {
      emit('update:modelValue', result.url)
    }
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

function handleRemove(file: UploadFile) {
  if (props.multiple) {
    const arr = (Array.isArray(props.modelValue) ? props.modelValue : []).filter(
      (url) => url !== file.url,
    )
    emit('update:modelValue', arr)
  } else {
    emit('update:modelValue', '')
  }
}

function handleChange(info: UploadChangeParam) {
  fileList.value = info.fileList
}

// 是否还能继续上传
const canUpload = computed(() => fileList.value.length < props.maxCount)
</script>

<template>
  <div class="image-uploader">
    <a-upload
      v-model:file-list="fileList"
      :list-type="listType"
      :max-count="maxCount"
      accept="image/*"
      :disabled="disabled"
      :before-upload="handleBeforeUpload"
      @remove="handleRemove"
      @change="handleChange"
    >
      <template v-if="canUpload">
        <div v-if="listType === 'picture-card'" class="img-btn img-btn--card">
          <PlusOutlined />
          <span class="img-btn-text">上传图片</span>
        </div>
        <a-button v-else :disabled="disabled" :loading="uploading">
          <template #icon><PictureOutlined /></template>
          选择图片
        </a-button>
      </template>
    </a-upload>
  </div>
</template>

<style scoped>
.image-uploader {
  display: inline-block;
}

.img-btn--card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #999;
  transition: color 0.2s;
}

.img-btn--card:hover {
  color: #1677ff;
}

.img-btn-text {
  font-size: 12px;
}
</style>
