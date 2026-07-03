import type { MockRoute } from './types'

const routes: MockRoute[] = [
  // ===== 基础 CRUD =====
  {
    url: '/axios-demo/list',
    method: 'GET',
    response: () => ({
      code: 200,
      data: {
        list: [
          { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active' },
          { id: 2, name: '李四', email: 'lisi@example.com', role: 'editor', status: 'active' },
          { id: 3, name: '王五', email: 'wangwu@example.com', role: 'viewer', status: 'inactive' },
        ],
        total: 3,
      },
      message: 'ok',
    }),
  },
  {
    url: '/axios-demo/1',
    method: 'GET',
    response: () => ({
      code: 200,
      data: { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active' },
      message: 'ok',
    }),
  },
  {
    url: '/axios-demo/2',
    method: 'GET',
    response: () => ({
      code: 200,
      data: { id: 2, name: '李四', email: 'lisi@example.com', role: 'editor', status: 'active' },
      message: 'ok',
    }),
  },
  {
    url: '/axios-demo/3',
    method: 'GET',
    response: () => ({
      code: 200,
      data: { id: 3, name: '王五', email: 'wangwu@example.com', role: 'viewer', status: 'inactive' },
      message: 'ok',
    }),
  },
  {
    url: '/axios-demo',
    method: 'POST',
    response: async (req) => {
      const body = await new Promise<string>((resolve) => {
        let data = ''
        req.on('data', (chunk) => (data += chunk))
        req.on('end', () => resolve(data))
      })
      const parsed = JSON.parse(body)
      return {
        code: 200,
        data: { id: Date.now(), ...parsed, status: 'active' },
        message: '创建成功',
      }
    },
  },
  {
    url: '/axios-demo',
    method: 'PUT',
    response: async (req) => {
      const body = await new Promise<string>((resolve) => {
        let data = ''
        req.on('data', (chunk) => (data += chunk))
        req.on('end', () => resolve(data))
      })
      const parsed = JSON.parse(body)
      return {
        code: 200,
        data: { ...parsed },
        message: '更新成功',
      }
    },
  },
  {
    url: '/axios-demo',
    method: 'DELETE',
    response: () => ({
      code: 200,
      data: null,
      message: '删除成功',
    }),
  },

  // ===== 上传 =====
  {
    url: '/axios-demo/upload',
    method: 'POST',
    response: () => ({
      code: 200,
      data: { url: 'https://example.com/uploads/file.pdf', filename: 'file.pdf', size: 102400 },
      message: '上传成功',
    }),
  },

  // ===== 下载 =====
  {
    url: '/axios-demo/download',
    method: 'GET',
    response: () => ({
      code: 200,
      data: { downloadUrl: '/api/axios-demo/download/file', filename: 'export.csv' },
      message: 'ok',
    }),
  },

  // ===== 错误模拟 =====
  {
    url: '/axios-demo/error/401',
    method: 'GET',
    response: () => ({
      code: 401,
      data: null,
      message: '未登录，请先登录',
    }),
  },
  {
    url: '/axios-demo/error/403',
    method: 'GET',
    response: () => ({
      code: 403,
      data: null,
      message: '无权限访问',
    }),
  },
  {
    url: '/axios-demo/error/500',
    method: 'GET',
    response: () => ({
      code: 500,
      data: null,
      message: '服务器内部错误',
    }),
  },

  // ===== 慢响应（模拟超时） =====
  {
    url: '/axios-demo/slow',
    method: 'GET',
    response: async () => {
      await new Promise((r) => setTimeout(r, 3000))
      return { code: 200, data: { msg: '3秒后才返回的数据' }, message: 'ok' }
    },
  },

  // ===== 缓存测试 =====
  {
    url: '/axios-demo/cache-test',
    method: 'GET',
    response: () => ({
      code: 200,
      data: { timestamp: Date.now(), random: Math.random().toFixed(4) },
      message: 'ok',
    }),
  },

  // ===== 去重测试 =====
  {
    url: '/axios-demo/dedup-test',
    method: 'GET',
    response: () => ({
      code: 200,
      data: { timestamp: Date.now(), message: 'dedup-test response' },
      message: 'ok',
    }),
  },

  // ===== 重试测试 =====
  {
    url: '/axios-demo/retry-test',
    method: 'GET',
    response: () => {
      // 50% 概率返回 500 用于测试重试
      if (Math.random() > 0.5) {
        return { code: 500, data: null, message: '模拟失败，触发重试' }
      }
      return { code: 200, data: { msg: '重试后成功' }, message: 'ok' }
    },
  },
]

export default routes
