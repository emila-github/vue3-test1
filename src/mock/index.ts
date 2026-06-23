/**
 * Mock 统一入口
 *
 * 新增 mock：
 *   1. 在 src/mock/ 下新建文件，export default routes 即可
 *   2. 在本文件底部添加静态 import 并合并到 allRoutes
 *   3. 无需修改 vite.config.ts
 */
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { MockRoute } from './types'
import type { Plugin } from 'vite'

import usersRoutes from './users'
import employeesRoutes from './employees'

// ===== 合并所有 mock 路由（新增文件后在这里加 import 并展开） =====
const allRoutes: MockRoute[] = [
  ...usersRoutes,
  ...employeesRoutes,
]

// ===== 匹配并返回响应 =====
function matchRoute(url: string, method: string | undefined) {
  return allRoutes.find((r) => url.startsWith(r.url) && r.method === method)
}

async function handleMock(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const { url, method } = req
  if (!url) return false

  const route = matchRoute(url, method)
  if (!route) return false

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  const data = typeof route.response === 'function' ? await route.response(req) : route.response
  res.end(JSON.stringify(data))
  return true
}

// ===== Vite 插件 =====
export function mockPlugin(): Plugin {
  return {
    name: 'mock-api',
    configureServer(server) {
      console.log('[mock] 插件已加载，共 %d 条路由', allRoutes.length)
      allRoutes.forEach((r) => console.log('  %s %s', r.method, r.url))

      server.middlewares.use('/api', async (req, res, next) => {
        try {
          console.log('[mock] 收到请求: %s %s', req.method, req.url)
          const matched = await handleMock(req, res)
          if (matched) {
            console.log('[mock] ✅ 已拦截 %s %s', req.method, req.url)
          } else {
            console.log('[mock] ❌ 未匹配 %s %s，放行', req.method, req.url)
            next()
          }
        } catch {
          next()
        }
      })
    },
  }
}
