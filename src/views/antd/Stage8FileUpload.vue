<script setup lang="ts">
/**
 * 阶段八：文件上传实战
 *
 * 覆盖 Ant Design Vue 上传全场景：
 *   - 图片上传（单张/多张，picture-card 模式）
 *   - 身份证正反面上传（自定义按钮样式）
 *   - 文件拖拽上传（通用文件）
 *   - Excel 导入解析（上传+预览+确认导入）
 *
 * 所有上传组件均已封装为独立可复用组件：
 *   ImageUploader / IdCardUploader / FileUploader / ExcelImporter
 */
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import IdCardUploader from '@/components/IdCardUploader.vue'
import ImageUploader from '@/components/ImageUploader.vue'
import FileUploader from '@/components/FileUploader.vue'
import ExcelImporter from '@/components/ExcelImporter.vue'

// ===== 图片上传 =====
const singleImageUrl = ref('')
const multiImageUrls = ref<string[]>([])

// ===== 身份证上传 =====
const idCardFront = ref('')
const idCardBack = ref('')

// ===== 文件上传 =====
const fileUrl = ref('')
const lastFileName = ref('')
function onFileSuccess(url: string, name: string) {
  lastFileName.value = name
}

// ===== Excel 导入 =====
const excelUrl = ref('')
const excelData = ref<any[][]>([])
const importedCount = ref(0)

function onExcelImport(data: any[][]) {
  importedCount.value = data.length - 1 // 减去表头
  excelData.value = data
  message.success(`Excel 导入成功，共 ${importedCount.value} 条数据`)
}

// ===== Excel 预览表格 =====
const excelColumns = computed(() => {
  const headers = excelData.value[0] || []
  return headers.map((h, i) => ({ title: h, dataIndex: String(i), key: i }))
})

const excelDataSource = computed(() => {
  return excelData.value.slice(1).map((row, ri) => {
    const obj: Record<string, any> = { key: ri }
    row.forEach((cell, ci) => { obj[String(ci)] = cell })
    return obj
  })
})

// ===== 统计数值样式（避免模板内单引号） =====
const statValueStyle = computed(() => ({
  color: importedCount.value > 0 ? '#52c41a' : '#999',
}))

// ===== 表格通用常量（避免模板内联对象含单引号触发 vue-inspector 解析错误） =====
const scrollX = { x: 'max-content' } as const

const commonApiColumns = [
  { title: 'Props', dataIndex: 'prop', key: 'prop', width: 120 },
  { title: '类型', dataIndex: 'type', key: 'type', width: 160 },
  { title: '说明', dataIndex: 'desc', key: 'desc' },
]

const commonEventColumns = [
  { title: 'Events', dataIndex: 'event', key: 'event', width: 140 },
  { title: '参数', dataIndex: 'params', key: 'params', width: 180 },
  { title: '说明', dataIndex: 'desc', key: 'desc' },
]

const imageApiRows = [
  { prop: 'modelValue', type: 'string | string[]', desc: '图片 URL 或 URL 数组（v-model）' },
  { prop: 'multiple', type: 'boolean', desc: '是否多选，默认 false' },
  { prop: 'maxCount', type: 'number', desc: '最大上传数量，默认 1' },
  { prop: 'maxSize', type: 'number', desc: '单文件大小限制（MB），默认 5' },
  { prop: 'disabled', type: 'boolean', desc: '是否禁用' },
  { prop: 'listType', type: 'string', desc: 'picture-card | picture | text' },
]

const imageApiCols = [
  { title: 'Props', dataIndex: 'prop', key: 'prop', width: 120 },
  { title: '类型', dataIndex: 'type', key: 'type', width: 160 },
  { title: '说明', dataIndex: 'desc', key: 'desc' },
]

const idCardApiRows = [
  { prop: 'modelValue', type: 'string', desc: '图片 URL（v-model）' },
  { prop: 'type', type: "front | back", desc: '身份证正面 / 反面' },
  { prop: 'disabled', type: 'boolean', desc: '是否禁用' },
]

const idCardApiCols = [
  { title: 'Props', dataIndex: 'prop', key: 'prop', width: 120 },
  { title: '类型', dataIndex: 'type', key: 'type', width: 160 },
  { title: '说明', dataIndex: 'desc', key: 'desc' },
]

const fileApiRows = [
  { prop: 'modelValue', type: 'string', desc: '文件 URL（v-model）' },
  { prop: 'accept', type: 'string', desc: '接受的文件类型，如 .pdf,.doc' },
  { prop: 'maxSize', type: 'number', desc: '大小限制（MB），默认 10' },
  { prop: 'disabled', type: 'boolean', desc: '是否禁用' },
  { prop: 'hint', type: 'string', desc: '上传区域提示文字' },
]

const fileApiCols = [
  { title: 'Props', dataIndex: 'prop', key: 'prop', width: 120 },
  { title: '类型', dataIndex: 'type', key: 'type', width: 160 },
  { title: '说明', dataIndex: 'desc', key: 'desc' },
]

const fileEventRows = [
  { event: 'upload-success', params: '(url, fileName)', desc: '上传成功回调' },
]

const fileEventCols = [
  { title: 'Events', dataIndex: 'event', key: 'event', width: 140 },
  { title: '参数', dataIndex: 'params', key: 'params', width: 160 },
  { title: '说明', dataIndex: 'desc', key: 'desc' },
]

const excelApiRows = [
  { prop: 'modelValue', type: 'any[][]', desc: '解析后的二维数组数据（v-model）' },
  { prop: 'url (v-model:url)', type: 'string', desc: '上传后的文件 URL' },
  { prop: 'columns', type: 'array', desc: '自定义表头映射（可选）' },
]

const excelApiCols = [
  { title: 'Props', dataIndex: 'prop', key: 'prop', width: 160 },
  { title: '类型', dataIndex: 'type', key: 'type', width: 140 },
  { title: '说明', dataIndex: 'desc', key: 'desc' },
]

const excelEventRows = [
  { event: 'import', params: '(data: any[][])', desc: '用户确认导入时触发' },
]

const excelEventCols = [
  { title: 'Events', dataIndex: 'event', key: 'event', width: 140 },
  { title: '参数', dataIndex: 'params', key: 'params', width: 180 },
  { title: '说明', dataIndex: 'desc', key: 'desc' },
]

const mockEndpointRows = [
  { method: 'POST', url: '/upload-file/file', desc: '通用文件上传' },
  { method: 'POST', url: '/upload-file/image', desc: '图片上传' },
  { method: 'POST', url: '/upload-file/idcard', desc: '身份证上传' },
  { method: 'POST', url: '/upload-file/excel', desc: 'Excel 上传' },
  { method: 'GET', url: '/upload-file/excel/parse', desc: 'Excel 解析（模拟）' },
]

const mockEndpointCols = [
  { title: '方法', dataIndex: 'method', key: 'method', width: 70 },
  { title: 'URL', dataIndex: 'url', key: 'url', width: 160 },
  { title: '说明', dataIndex: 'desc', key: 'desc' },
]

const fileListRows = [
  { file: 'src/components/ImageUploader.vue', desc: '图片上传（单张/多张，picture-card）' },
  { file: 'src/components/IdCardUploader.vue', desc: '身份证上传（正反面自定义按钮）' },
  { file: 'src/components/FileUploader.vue', desc: '通用文件拖拽上传' },
  { file: 'src/components/ExcelImporter.vue', desc: 'Excel 导入解析（上传+预览+确认）' },
  { file: 'src/api/modules/upload.ts', desc: '上传 API 模块' },
  { file: 'src/mock/upload.ts', desc: 'Mock 路由（写入磁盘+静态服务）' },
  { file: 'src/mock/index.ts', desc: 'Mock 入口（注册 uploadRoutes）' },
]

const fileListCols = [
  { title: '文件', dataIndex: 'file', key: 'file', width: 240 },
  { title: '说明', dataIndex: 'desc', key: 'desc' },
]
</script>

<template>
  <div class="stage-page">
    <h1>阶段八：文件上传实战</h1>
    <p class="subtitle">
      覆盖 Ant Design Vue <code>a-upload</code> 全部常用场景：图片上传、文件拖拽上传、身份证正反面上传、
      Excel 导入解析。所有上传功能均封装为<strong>独立可复用组件</strong>，Mock 层自动保存文件到
      <code>src/assets/upload/</code> 并返回可预览 URL。
    </p>

    <!-- ==================== 1. 图片上传 ==================== -->
    <section class="card">
      <h2>1. ImageUploader — 图片上传</h2>
      <p class="desc">封装了 <code>a-upload</code> 的 picture-card 模式，支持单张/多张上传，自定义上传按钮。</p>

      <a-row :gutter="[40, 24]">
        <!-- 单张上传 -->
        <a-col :xs="24" :md="12">
          <h3 class="demo-title">单张上传</h3>
          <ImageUploader v-model="singleImageUrl" />
          <div class="demo-result">
            <span v-if="singleImageUrl" class="url-text">{{ singleImageUrl }}</span>
            <span v-else class="empty-text">尚未上传</span>
          </div>
        </a-col>

        <!-- 多张上传 -->
        <a-col :xs="24" :md="12">
          <h3 class="demo-title">多张上传（最多 5 张）</h3>
          <ImageUploader v-model="multiImageUrls" :multiple="true" :max-count="5" />
          <div class="demo-result">
            <template v-if="multiImageUrls.length">
              <a-tag v-for="(url, i) in multiImageUrls" :key="i" style="margin: 2px">
                图片 {{ i + 1 }}
              </a-tag>
            </template>
            <span v-else class="empty-text">尚未上传</span>
          </div>
        </a-col>
      </a-row>

      <a-divider dashed />

      <h3 class="demo-title">组件 API</h3>
      <a-table
        :data-source="imageApiRows"
        :columns="imageApiCols"
        :pagination="false"
        size="small"
        bordered
      />
    </section>

    <!-- ==================== 2. 身份证上传 ==================== -->
    <section class="card">
      <h2>2. IdCardUploader — 身份证上传</h2>
      <p class="desc">
        自定义上传按钮，<strong>正面</strong>显示蓝色身份证图案（含照片区域），<strong>反面</strong>显示暖色图案（含国徽）。
      </p>

      <a-row :gutter="[40, 24]">
        <a-col :xs="24" :md="12">
          <h3 class="demo-title">身份证正面</h3>
          <IdCardUploader v-model="idCardFront" type="front" />
          <div class="demo-result">
            <span v-if="idCardFront" class="url-text">{{ idCardFront }}</span>
            <span v-else class="empty-text">尚未上传</span>
          </div>
        </a-col>
        <a-col :xs="24" :md="12">
          <h3 class="demo-title">身份证反面</h3>
          <IdCardUploader v-model="idCardBack" type="back" />
          <div class="demo-result">
            <span v-if="idCardBack" class="url-text">{{ idCardBack }}</span>
            <span v-else class="empty-text">尚未上传</span>
          </div>
        </a-col>
      </a-row>

      <a-divider dashed />

      <h3 class="demo-title">组件 API</h3>
      <a-table
        :data-source="idCardApiRows"
        :columns="idCardApiCols"
        :pagination="false"
        size="small"
        bordered
      />
    </section>

    <!-- ==================== 3. 文件上传 ==================== -->
    <section class="card">
      <h2>3. FileUploader — 通用文件上传</h2>
      <p class="desc">
        基于 <code>a-upload-dragger</code> 封装，支持拖拽上传，显示文件类型图标和预览链接。
      </p>

      <a-row :gutter="[40, 24]">
        <a-col :xs="24" :md="12">
          <h3 class="demo-title">拖拽上传（限 PDF / Word）</h3>
          <FileUploader
            v-model="fileUrl"
            accept=".pdf,.doc,.docx"
            :max-size="10"
            hint="拖拽 PDF 或 Word 文件到此处"
            @upload-success="onFileSuccess"
          />
        </a-col>
        <a-col :xs="24" :md="12">
          <h3 class="demo-title">上传结果</h3>
          <a-card size="small" title="状态信息">
            <a-descriptions :column="1" size="small" bordered>
              <a-descriptions-item label="上传状态">
                <a-tag v-if="fileUrl" color="success">已上传</a-tag>
                <a-tag v-else color="default">未上传</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="文件名">
                {{ lastFileName || '—' }}
              </a-descriptions-item>
              <a-descriptions-item label="文件地址">
                <span v-if="fileUrl" class="url-text" style="word-break: break-all">{{ fileUrl }}</span>
                <span v-else class="empty-text">—</span>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
      </a-row>

      <a-divider dashed />

      <h3 class="demo-title">组件 API</h3>
      <a-table
        :data-source="fileApiRows"
        :columns="fileApiCols"
        :pagination="false"
        size="small"
        bordered
      />
      <a-table
        :data-source="fileEventRows"
        :columns="fileEventCols"
        :pagination="false"
        size="small"
        bordered
        style="margin-top: 8px"
      />
    </section>

    <!-- ==================== 4. Excel 导入 ==================== -->
    <section class="card">
      <h2>4. ExcelImporter — Excel 导入解析</h2>
      <p class="desc">
        上传 Excel 后自动<strong>解析并预览数据</strong>，用户确认后执行导入。Mock 层模拟解析返回
        7 条示例数据。
      </p>

      <a-row :gutter="[40, 24]">
        <a-col :xs="24" :md="12">
          <h3 class="demo-title">上传 Excel 文件</h3>
          <ExcelImporter
            v-model="excelData"
            v-model:url="excelUrl"
            @import="onExcelImport"
          />
        </a-col>
        <a-col :xs="24" :md="12">
          <h3 class="demo-title">导入结果</h3>
          <a-card size="small" title="导入统计">
            <a-statistic
              title="已导入记录数"
              :value="importedCount"
              suffix="条"
              :value-style="statValueStyle"
            />
          </a-card>
          <a-card v-if="excelData.length > 1" size="small" title="导入数据" style="margin-top: 12px">
            <a-table
              :columns="excelColumns"
              :data-source="excelDataSource"
              :pagination="false"
              :scroll="scrollX"
              size="small"
              bordered
            />
          </a-card>
        </a-col>
      </a-row>

      <a-divider dashed />

      <h3 class="demo-title">组件 API</h3>
      <a-table
        :data-source="excelApiRows"
        :columns="excelApiCols"
        :pagination="false"
        size="small"
        bordered
      />
      <a-table
        :data-source="excelEventRows"
        :columns="excelEventCols"
        :pagination="false"
        size="small"
        bordered
        style="margin-top: 8px"
      />
    </section>

    <!-- ==================== 5. Mock 说明 ==================== -->
    <section class="card">
      <h2>5. Mock 上传架构</h2>

      <a-row :gutter="[24, 16]">
        <a-col :span="24">
          <h3 class="demo-title">数据流向</h3>
          <pre class="code-block">选文件 → FileReader(base64) → POST /api/upload-file/{type}
  → Mock: base64ToBuffer → fs.writeFileSync → src/assets/upload/{prefix}-{timestamp}.{ext}
  → 返回 { url: '/upload/{filename}' }
    → 前端通过 GET /upload/{filename} 访问
      → Vite 静态文件中间件 → 磁盘文件流</pre>
        </a-col>

        <a-col :xs="24" :md="12">
          <h3 class="demo-title">Mock 接口列表</h3>
          <a-table
            :data-source="mockEndpointRows"
            :columns="mockEndpointCols"
            :pagination="false"
            size="small"
            bordered
          />
        </a-col>

        <a-col :xs="24" :md="12">
          <h3 class="demo-title">文件存放</h3>
          <a-descriptions :column="1" size="small" bordered>
            <a-descriptions-item label="保存目录">src/assets/upload/</a-descriptions-item>
            <a-descriptions-item label="文件名格式">{type}-{timestamp}.{ext}</a-descriptions-item>
            <a-descriptions-item label="访问路径">/upload/{filename}</a-descriptions-item>
            <a-descriptions-item label="支持格式">png / jpg / gif / webp / pdf / doc / docx / xlsx / xls / csv</a-descriptions-item>
          </a-descriptions>
        </a-col>
      </a-row>
    </section>

    <!-- ==================== 组件文件清单 ==================== -->
    <section class="card">
      <h2>6. 组件文件清单</h2>
      <a-table
        :data-source="fileListRows"
        :columns="fileListCols"
        :pagination="false"
        size="small"
        bordered
      />
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: #f6f8fa;
  border-radius: 8px;
  line-height: 1.7;
}

.subtitle code {
  background: #e8e8e8;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
}

.card h2 {
  font-size: 18px;
  color: #333;
  margin: 0 0 4px 0;
}

.desc {
  color: #888;
  font-size: 13px;
  margin-bottom: 20px;
}

.demo-title {
  font-size: 14px;
  color: #555;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.demo-result {
  margin-top: 12px;
}

.url-text {
  font-size: 12px;
  color: #1677ff;
  word-break: break-all;
  background: #f0f5ff;
  padding: 2px 8px;
  border-radius: 4px;
}

.empty-text {
  font-size: 12px;
  color: #bbb;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.6;
  overflow-x: auto;
  margin: 12px 0 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .stage-page {
    padding: 16px;
  }
  .card {
    padding: 16px;
  }
}
</style>
