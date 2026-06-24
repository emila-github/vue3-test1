import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { mockPlugin } from './src/mock'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  console.log('mode:', mode)
  const isMock = mode === 'mock'

  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      ...(isMock ? [mockPlugin()] : []), // ★ 无后端时使用 Mock，有后端时启用下方 proxy
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // 有后端时启用
    server: isMock
      ? undefined
      : {
          proxy: {
            // 正则 ^/api(/|$) 只匹配 /api 或 /api/xxx，不会误匹配 /api-demo
            '^/api(/|$)': {
              target: 'http://localhost:8080',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          },
        },
  }
})
