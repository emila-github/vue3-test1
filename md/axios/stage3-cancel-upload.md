# Stage 3: 取消请求与上传下载

## 学习目标

- 掌握 AbortController 取消请求的用法
- 理解搜索防抖 + 请求取消的组合使用
- 学会 FormData 文件上传与进度监控
- 掌握 Blob 文件下载与进度监控

## 核心概念

### 1. AbortController 取消请求

```ts
const controller = new AbortController()

axios.get('/api/users', { signal: controller.signal })
  .catch(err => {
    if (axios.isCancel(err)) {
      console.log('请求已取消')
    }
  })

// 取消请求
controller.abort()
```

### 2. 搜索防抖 + 取消

```ts
let controller: AbortController | null = null

function search(keyword: string) {
  // 取消上一次搜索
  controller?.abort()
  controller = new AbortController()

  axios.get('/api/search', {
    params: { keyword },
    signal: controller.signal,
  })
}
```

### 3. 文件上传

```ts
const formData = new FormData()
formData.append('file', file)

axios.post('/api/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress: (e) => {
    const percent = Math.round((e.loaded * 100) / (e.total ?? 1))
    console.log(`上传进度: ${percent}%`)
  },
})
```

### 4. 文件下载

```ts
axios.get('/api/download', {
  responseType: 'blob',
  onDownloadProgress: (e) => {
    const percent = Math.round((e.loaded * 100) / (e.total ?? 1))
  },
}).then(res => {
  const url = URL.createObjectURL(res.data)
  const a = document.createElement('a')
  a.href = url
  a.download = 'file.pdf'
  a.click()
  URL.revokeObjectURL(url)
})
```

## 常见陷阱

- **组件卸载时忘记取消请求**：使用 `onUnmounted` 调用 `controller.abort()`
- **Axios > 0.22 废弃 CancelToken**：使用 AbortController 替代
- **大文件上传**：考虑分片上传和断点续传

## 示例页面

打开 `/axios/stage3` 查看交互式演示。
