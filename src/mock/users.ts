import type { MockRoute } from './types'

// 注意：url 不需要 /api 前缀，中间件已挂在 /api 下，Connect 会自动截掉前缀
const routes: MockRoute[] = [
  // GET /api/users
  {
    url: '/users',
    method: 'GET',
    response: {
      code: 200,
      data: {
        list: [
          { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'editor', status: 'active', createdAt: '2025-01-01' },
          { id: 2, name: '李四', email: 'lisi@example.com', role: 'viewer', status: 'active', createdAt: '2025-02-15' },
        ],
        total: 2,
        page: 1,
        pageSize: 10,
      },
      message: 'ok',
    },
  },
  // POST /api/users
  {
    url: '/users',
    method: 'POST',
    response: {
      code: 200,
      data: { id: Date.now(), name: '张三', email: 'zhangsan@example.com', role: 'editor', status: 'active', createdAt: new Date().toISOString() },
      message: 'ok',
    },
  },
  // PUT /api/users/xxx
  {
    url: '/users',
    method: 'PUT',
    response: {
      code: 200,
      data: { id: 1, name: '已更新' },
      message: 'ok',
    },
  },
  // DELETE /api/users/xxx
  {
    url: '/users',
    method: 'DELETE',
    response: {
      code: 200,
      data: null,
      message: 'ok',
    },
  },
]

export default routes
