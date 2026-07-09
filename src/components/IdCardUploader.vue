<script setup lang="ts">
/**
 * 身份证上传组件
 *
 * Props:
 *   modelValue        — 身份证图片 URL（v-model 双向绑定）
 *   type              — 'front'（正面）| 'back'（反面）
 *   disabled          — 是否禁用
 *
 * 特性：
 *   - 自定义上传按钮，展示身份证正面/反面图案
 *   - 上传后返回可预览 URL
 *   - 支持移除/重新上传
 */
import { watch, ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { uploadFile } from '@/api/modules/upload'
import type { UploadChangeParam } from 'ant-design-vue'

const props = defineProps<{
  modelValue: string
  type: 'front' | 'back'
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// ===== 内部状态 =====
const fileList = ref<any[]>([])
const uploading = ref(false)

const accept = computed(() => (props.type === 'front' ? '身份证正面' : '身份证反面'))

// ===== 编辑回显同步 =====
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      fileList.value = [
        { uid: `-${props.type}`, name: `idcard-${props.type}.png`, status: 'done', url: val },
      ]
    } else {
      fileList.value = []
    }
  },
  { immediate: true },
)

// ===== 上传处理 =====
function handleBeforeUpload(file: File) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件！')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('图片大小不能超过 5MB！')
    return false
  }
  uploadIdCard(file)
  return false
}

async function uploadIdCard(file: File) {
  uploading.value = true
  try {
    const base64 = await fileToBase64(file)
    const result = await uploadFile({ fileName: file.name, base64, type: 'idcard' })
    emit('update:modelValue', result.url)
    message.success(`${accept.value}上传成功`)
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
  fileList.value = []
}

function handleChange(info: UploadChangeParam) {
  fileList.value = info.fileList
}
</script>

<template>
  <div class="idcard-uploader">
    <a-upload
      v-model:file-list="fileList"
      list-type="picture-card"
      :max-count="1"
      accept="image/*"
      :disabled="disabled"
      :show-upload-list="{ showPreviewIcon: true, showRemoveIcon: true }"
      :before-upload="handleBeforeUpload"
      @remove="handleRemove"
      @change="handleChange"
    >
      <template v-if="fileList.length < 1">
        <div class="idcard-btn" :class="`idcard-btn--${type}`">
          <!-- 正面：蓝色卡片 + 头像 -->
          <div v-if="type === 'front'" class="idcard-card-front">
            <div class="card-photo">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" opacity="0.7">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div class="card-lines">
              <span class="card-line" style="width:70%" />
              <span class="card-line" style="width:55%" />
              <span class="card-line" style="width:80%" />
              <span class="card-line" style="width:45%" />
            </div>
          </div>
          <!-- 反面：暖色卡片 + 国徽 -->
          <div v-else class="idcard-card-back">
            <div class="card-emblem">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" opacity="0.8">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div class="card-lines">
              <span class="card-line" style="width:80%" />
              <span class="card-line" style="width:60%" />
              <span class="card-line" style="width:70%" />
            </div>
          </div>
          <span class="card-label">{{ type === 'front' ? '身份证正面' : '身份证反面' }}</span>
          <span v-if="uploading" class="card-status">上传中...</span>
        </div>
      </template>
    </a-upload>
  </div>
</template>

<style scoped>
.idcard-uploader {
  display: inline-block;
}

/* ===== 统一按钮容器 ===== */
.idcard-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

/* ===== 卡片图案：正面 ===== */
.idcard-card-front,
.idcard-card-back {
  width: 72px;
  height: 46px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 5px 7px;
  box-sizing: border-box;
  transition: transform 0.2s, box-shadow 0.2s;
}

.idcard-card-front {
  background: linear-gradient(135deg, #d6e4ff, #e6f0ff 50%, #d0e1ff);
  border: 1px solid #adc6ff;
  gap: 5px;
}

.idcard-card-back {
  background: linear-gradient(135deg, #fffbe6, #fff1b8 50%, #ffe7ba);
  border: 1px solid #ffd591;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

/* 照片区域 */
.card-photo {
  width: 20px;
  height: 24px;
  min-width: 20px;
  background: linear-gradient(135deg, #91caff, #4096ff);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.7);
  flex-shrink: 0;
}

/* 国徽区域 */
.card-emblem {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #ff9c6e, #fa8c16);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.85);
  flex-shrink: 0;
}

/* 文字线条 */
.card-lines {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.idcard-card-back .card-lines {
  width: 100%;
  align-items: center;
}

.card-line {
  display: block;
  height: 3px;
  border-radius: 1.5px;
}

.idcard-card-front .card-line {
  background: rgba(64,150,255,0.25);
}

.idcard-card-back .card-line {
  background: rgba(250,140,22,0.25);
}

/* 标签与状态 */
.card-label {
  font-size: 11px;
  color: #8c8c8c;
}

.card-status {
  font-size: 10px;
  color: #1677ff;
}

/* hover 交互 */
.idcard-btn:hover .idcard-card-front {
  transform: scale(1.06);
  border-color: #597ef7;
  box-shadow: 0 2px 8px rgba(24,144,255,0.2);
}

.idcard-btn:hover .idcard-card-back {
  transform: scale(1.06);
  border-color: #fa8c16;
  box-shadow: 0 2px 8px rgba(250,140,22,0.2);
}
</style>
