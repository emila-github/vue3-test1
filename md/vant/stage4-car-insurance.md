# 阶段四：综合实战 — 车险投保列表页

## 学习目标

- 掌握 Vant 4 **列表展示**与**无限滚动**（PullRefresh + List）
- 学会 **搜索筛选**（Search + Tabs 状态切换）
- 掌握 **新增/编辑表单**（Popup + 全部表单控件）
- 学会 **图片上传**（Uploader + base64 上传 + ImagePreview）
- 掌握 **操作交互**（Dialog 删除确认、ActionSheet 批量操作）

## 核心概念

### 1. 列表加载模式

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { getCarInsuranceList } from '@/api/modules/car-insurance'

const list = ref([])
const loading = ref(false)
const finished = ref(false)
const page = ref(1)

async function onLoad() {
  const result = await getCarInsuranceList({ page: page.value, pageSize: 10 })
  list.value.push(...result.list)
  page.value++
  if (result.list.length < 10) finished.value = true
}

async function onRefresh() {
  page.value = 1
  finished.value = false
  list.value = []
  await onLoad()
}
</script>

<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list v-model:loading="loading" :finished="finished" @load="onLoad">
      <div v-for="item in list" :key="item.id">...</div>
    </van-list>
  </van-pull-refresh>
</template>
```

### 2. Popup + 滚动表单

编辑表单使用 `van-popup` 的 `position="right"` 全屏模式，配合 `van-nav-bar` 实现类似原生页面的沉浸式编辑体验。表单内容放在可滚动容器中，提交按钮 `sticky` 固定在底部。

```vue
<van-popup v-model:show="visible" position="right" :style="{ width: '100%', height: '100%' }">
  <van-nav-bar title="编辑" left-arrow @click-left="visible = false" />
  <div class="form-scroll" style="overflow-y: auto">
    <!-- 表单控件 -->
  </div>
</van-popup>
```

### 3. 图片上传数据流

```
选图 → FileReader(base64) → POST /api/car-insurance/upload
  → Mock: fs.writeFileSync → src/assets/upload/
  → 返回 { url: '/upload/xxx' }
  → 前端通过 Image/ImagePreview 预览
```

```ts
async function afterRead(file) {
  const base64 = await fileToBase64(file)
  const result = await uploadCarInsuranceImage(file.name, base64)
  form.driverLicenseFront = result.url // v-model 到 image url
}

function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.readAsDataURL(file)
  })
}
```

## 覆盖的 Vant 4 组件

### 容器/导航
| 组件 | 用途 |
|------|------|
| `van-nav-bar` | 页面标题栏、编辑页返回 |
| `van-popup` | 新增/编辑表单弹层、详情弹层、Picker 容器 |
| `van-tabs` / `van-tab` | 状态筛选标签栏 |

### 列表
| 组件 | 用途 |
|------|------|
| `van-pull-refresh` | 下拉刷新 |
| `van-list` | 上拉加载更多（无限滚动） |

### 表单控件
| 组件 | 用途 | 演示位置 |
|------|------|----------|
| `van-field` | 文本/电话/数字/textarea 输入 | 车牌号、姓名、电话、备注 |
| `van-picker` | 选择器 | 险种、品牌、投保区域 |
| `van-date-picker` | 日期选择器 | 保险起期/止期 |
| `van-stepper` | 步进器 | 车龄、免赔额 |
| `van-switch` | 开关 | 同意协议 |
| `van-checkbox` / `van-checkbox-group` | 复选框组 | 附加险种 |
| `van-radio` / `van-radio-group` | 单选框组 | 出险记录 |
| `van-slider` | 滑块 | 估值调整 |
| `van-rate` | 评分 | 车况评分 |
| `van-uploader` | 图片上传 | 驾驶证正/反面、车辆照片 |
| `van-search` | 搜索框 | 关键词搜索 |

### 反馈
| 组件 | 用途 |
|------|------|
| `van-dialog` | 删除确认弹窗 |
| `van-action-sheet` | 列表项多操作菜单 |
| `van-tag` | 状态标签 |
| `van-image` | 图片展示（支持预览） |
| `van-image-preview` | 图片预览（全屏） |
| `van-notice-bar` | 表单校验错误提示 |
| `van-button` | 按钮（plain / round / block / loading） |
| `van-cell` / `van-cell-group` | 详情展示 / 表单分组 |

## Mock 接口

| 方法 | URL | 说明 |
|------|-----|------|
| GET | `/car-insurance/list` | 列表查询（keyword/status/page/pageSize） |
| GET | `/car-insurance?id=` | 详情查询 |
| POST | `/car-insurance` | 新增投保 |
| PUT | `/car-insurance` | 编辑投保 |
| DELETE | `/car-insurance` | 删除投保 |
| POST | `/car-insurance/upload` | 图片上传（base64 → 磁盘 + URL） |

## 组件文件清单

| 文件 | 说明 |
|------|------|
| `src/views/vant/Stage4CarInsurance.vue` | 主视图：列表 + 搜索 + 新增/编辑表单 + 详情 |
| `src/api/modules/car-insurance.ts` | API 模块：6 个接口函数 + 类型定义 |
| `src/mock/car-insurance.ts` | Mock 数据：5 条初始数据 + 6 个接口路由 |

## 常见陷阱

1. **Uploader 的 after-read 回调**：Vant 4 的 `after-read` 回调参数结构与文档可能不同，`file.file` 或直接 `file` 都可能出现，需要做兼容处理。

2. **PullRefresh + List 嵌套**：注意下拉刷新和上拉加载的冲突。`onRefresh` 中要重置 `page`、`finished`、`list`；`onLoad` 中仅追加数据。

3. **Picker 的多级级联**：使用嵌套结构的 `columns` 数组，`selectedOptions.map(o => o.text).join('/')` 即可拼接显示文本。

4. **DatePicker 的 min-date**：应使用 `new Date()` 限制保险起期不能早于今天。

5. **表单校验**：使用 `computed` 计算错误列表，结合 `van-notice-bar` 动态展示，按钮 `disabled` 属性绑定 `canSubmit`。

6. **图片 base64 上传**：mock 不支持 multipart/form-data，统一使用 `FileReader` 读取 base64 后 POST JSON 体。

## 示例页面

打开 `/vant/stage4` 查看交互式演示。
