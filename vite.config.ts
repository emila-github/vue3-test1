import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { mockPlugin } from './src/mock'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    mockPlugin(), // ★ 无后端时使用 Mock，有后端时删除此行 + 启用下方 proxy
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // ===== 有后端时启用：删掉上方 mockPlugin()，取消下面注释 =====
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true,
  //       // 注意：rewrite 会去掉 /api 前缀，确保 target 用 ^ 锚定避免误匹配 /api-demo
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
})
