# 阶段八：文件上传实战

## 学习目标

- 掌握 Ant Design Vue `a-upload` 组件的各种使用场景
- 学会封装可复用的上传组件
- 理解 Mock 环境下的文件上传完整流程
- 掌握 Excel 导入解析的前端实现

## 核心概念

### 1. a-upload 上传模式

Ant Design Vue 提供了 `beforeUpload` 钩子来控制上传流程：

```vue
<a-upload
  :before-upload="handleBeforeUpload"
  :max-count="1"
  accept="image/*"
>
  <a-button>选择文件</a-button>
</a-upload>
```

**关键点**：`beforeUpload` 返回 `false` 可以阻止默认上传行为，然后手动处理上传逻辑。

### 2. 手动上传流程（Mock 环境）

```
选文件 → FileReader.readAsDataURL() → base64 编码
  → POST /api/upload-file/{type}（携带 base64）
    → Mock 服务端：解码 base64 → 写入磁盘 → 返回文件 URL
      → 前端拿到 URL → 用于预览展示
```

### 3. 组件封装原则

- **Props 双向绑定**：使用 `v-model` 协议（`modelValue` + `update:modelValue`）
- **文件校验**：在 `beforeUpload` 中校验类型和大小
- **上传状态**：提供 `uploading` 状态和成功/失败回调
- **自定义按钮**：利用 `a-upload` 的默认插槽定制按钮样式

## 可复用组件

| 组件 | 用途 | 特色 |
|------|------|------|
| ImageUploader | 图片上传 | 支持单张/多张，picture-card 模式 |
| IdCardUploader | 身份证上传 | 自定义正面/反面图案按钮 |
| FileUploader | 通用文件上传 | 拖拽上传，支持文件类型过滤 |
| ExcelImporter | Excel 导入 | 上传→解析→预览→确认导入 |

### ImageUploader 使用示例

```vue
<script setup>
import ImageUploader from '@/components/ImageUploader.vue'

const imgUrl = ref('')
const imgUrls = ref<string[]>([])
</script>

<template>
  <!-- 单张 -->
  <ImageUploader v-model="imgUrl" />

  <!-- 多张 -->
  <ImageUploader v-model="imgUrls" :multiple="true" :max-count="5" />
</template>
```

### IdCardUploader 使用示例

```vue
<script setup>
import IdCardUploader from '@/components/IdCardUploader.vue'

const front = ref('')
const back = ref('')
</script>

<template>
  <IdCardUploader v-model="front" type="front" />
  <IdCardUploader v-model="back" type="back" />
</template>
```

### FileUploader 使用示例

```vue
<script setup>
import FileUploader from '@/components/FileUploader.vue'

const fileUrl = ref('')
</script>

<template>
  <FileUploader
    v-model="fileUrl"
    accept=".pdf,.doc"
    :max-size="10"
    @upload-success="(url, name) => console.log(name)"
  />
</template>
```

### ExcelImporter 使用示例

```vue
<script setup>
import ExcelImporter from '@/components/ExcelImporter.vue'

const excelData = ref<any[][]>([])
const excelUrl = ref('')
</script>

<template>
  <ExcelImporter
    v-model="excelData"
    v-model:url="excelUrl"
    @import="handleImport"
  />
</template>
```

## Mock 接口

| 方法 | URL | 说明 |
|------|-----|------|
| POST | `/api/upload-file/file` | 通用文件上传 |
| POST | `/api/upload-file/image` | 图片上传 |
| POST | `/api/upload-file/idcard` | 身份证上传 |
| POST | `/api/upload-file/excel` | Excel 上传 |
| GET | `/api/upload-file/excel/parse` | Excel 解析（模拟数据） |

## 常见问题

### 1. 上传后看不到预览

检查 Mock 中间件 `/upload` 是否正确映射到磁盘目录。`src/mock/index.ts` 中的静态文件中间件需要在上传请求之前注册。

### 2. 文件覆盖问题

文件名使用时间戳生成 `{type}-{timestamp}.{ext}`，避免重名覆盖。

### 3. 大文件上传

当前 Mock 方案使用 base64 编码传输，不适合大文件。生产环境应使用 FormData + multipart/form-data 方式。

## 示例页面

打开 `/antd/stage8` 查看交互式演示。
