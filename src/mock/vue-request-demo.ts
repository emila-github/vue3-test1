import type { MockRoute } from './types'

const articles = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `文章标题 #${i + 1} — VueRequest 学习笔记`,
  summary: `这是第 ${i + 1} 篇文章的摘要，用于演示 useLoadMore 加载更多功能。`,
  author: 'AttoJS',
  createdAt: new Date(2026, 0, 1 + i).toISOString(),
}))

const users = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: i % 3 === 0 ? '禁用' : '正常',
  role: ['管理员', '编辑', '观察者'][i % 3],
}))

const routes: MockRoute[] = [
  // ========== 基础：用户详情 ==========
  {
    url: '/vr/demo/user',
    method: 'GET',
    response: (_req) => {
      // 模拟延迟
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 200,
            data: { id: 1, name: 'VueRequest', version: '2.0.4', author: 'AttoJS', desc: '一个 Vue 请求库' },
            message: 'ok',
          })
        }, 800)
      })
    },
  },

  // ========== 分页：用户列表 ==========
  {
    url: '/vr/demo/user-list',
    method: 'GET',
    response: (req) => {
      const url = new URL(req.url!, 'http://localhost')
      const page = Number(url.searchParams.get('page') || 1)
      const pageSize = Number(url.searchParams.get('pageSize') || 10)
      const keyword = url.searchParams.get('keyword') || ''

      let filtered = users
      if (keyword) {
        filtered = users.filter((u) => u.name.includes(keyword) || u.email.includes(keyword))
      }

      const start = (page - 1) * pageSize
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 200,
            data: {
              list: filtered.slice(start, start + pageSize),
              total: filtered.length,
              current: page,
              pageSize,
            },
            message: 'ok',
          })
        }, 600)
      })
    },
  },

  // ========== 加载更多：文章列表 ==========
  {
    url: '/vr/demo/articles',
    method: 'GET',
    response: (req) => {
      const url = new URL(req.url!, 'http://localhost')
      const page = Number(url.searchParams.get('page') || 1)
      const pageSize = Number(url.searchParams.get('pageSize') || 8)
      const totalPages = Math.ceil(articles.length / pageSize)
      const start = (page - 1) * pageSize

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 200,
            data: {
              list: articles.slice(start, start + pageSize),
              total: articles.length,
              currentPage: page,
              totalPages,
            },
            message: 'ok',
          })
        }, 500)
      })
    },
  },

  // ========== 表单提交/CURD ==========
  {
    url: '/vr/demo/create',
    method: 'POST',
    response: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ code: 200, data: { id: Date.now() }, message: '创建成功' })
        }, 1000)
      }),
  },

  // ========== 轮询演示：状态查询 ==========
  {
    url: '/vr/demo/status',
    method: 'GET',
    response: () => ({
      code: 200,
      data: {
        status: '运行中',
        version: '2.0.4',
        uptime: Math.floor(process.uptime()),
        timestamp: Date.now(),
        random: Math.random().toFixed(4),
      },
      message: 'ok',
    }),
  },

  // ========== 搜索防抖 ==========
  {
    url: '/vr/demo/search',
    method: 'GET',
    response: (req) => {
      const url = new URL(req.url!, 'http://localhost')
      const q = (url.searchParams.get('q') || '').trim()
      if (!q) return { code: 200, data: [], message: 'ok' }

      const results = users.filter((u) => u.name.includes(q) || u.email.includes(q)).slice(0, 10)

      // 模拟搜索延迟
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ code: 200, data: results, message: 'ok' })
        }, 300)
      })
    },
  },

  // ========== 错误重试：模拟 50% 失败率 ==========
  {
    url: '/vr/demo/retry',
    method: 'GET',
    response: () =>
      new Promise((resolve, reject) => {
        // 50% 概率失败
        if (Math.random() > 0.5) {
          resolve({ code: 200, data: { result: '请求成功！' }, message: 'ok' })
        } else {
          // 返回业务错误，触发 errorRetryCount 重试
          resolve({ code: 500, data: null, message: '服务器繁忙，请稍后重试' })
        }
      }),
  },
]

export default routes
