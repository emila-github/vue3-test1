<script setup lang="ts">
/**
 * 阶段五：性能优化与工程化实践
 * 演示按需加载、图标优化、虚拟列表、防抖搜索
 */
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons-vue'

// ===== 大数据表格（虚拟滚动演示） =====
interface BigDataItem {
  key: number
  name: string
  age: number
  address: string
  email: string
}

// 生成 10000 条模拟数据
const bigData = ref<BigDataItem[]>(
  Array.from({ length: 10000 }, (_, i) => ({
    key: i + 1,
    name: `用户${i + 1}`,
    age: 20 + (i % 50),
    address: ['北京', '上海', '深圳', '广州', '杭州'][i % 5] + `市${(i % 100).toString().padStart(2, '0')}号`,
    email: `user${i + 1}@example.com`,
  })),
)

// ===== 防抖搜索 =====
const searchKeyword = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function onSearchChange(val: string) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchKeyword.value = val
    message.info(`搜索关键词: ${val || '(空)'}`)
  }, 300)
}

// ===== 虚拟滚动配置 (antd 4.x Table 内置 virtual 支持) =====
const scrollConfig = { y: 400 }

// ===== 性能指标模拟 =====
const bundleInfo = ref([
  { name: 'ant-design-vue (全量)', size: '~680 KB', gzip: '~180 KB' },
  { name: 'ant-design-vue (按需)', size: '~400 KB', gzip: '~110 KB' },
  { name: '@ant-design/icons-vue (按需)', size: '~5 KB/图标', gzip: '~2 KB/图标' },
  { name: 'Iconify CDN', size: '0 KB (本地打包)', gzip: '—' },
])

// ===== 优化清单 =====
const optimizationList = [
  {
    title: 'unplugin-vue-components 按需加载',
    desc: '自动将组件导入转为单文件引入，减少约 42% 打包体积。',
    done: false,
    code: `// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [AntDesignVueResolver({ importStyle: false })],
    }),
  ],
})`,
  },
  {
    title: 'vite-plugin-compression 预压缩',
    desc: '构建时生成 .gz 文件，Nginx 直接返回压缩资源，减少传输体积。',
    done: false,
    code: `// vite.config.ts
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    viteCompression({ algorithm: 'gzip', threshold: 10240 }),
  ],
})`,
  },
  {
    title: '图标按需引入',
    desc: '使用 @ant-design/icons-vue 按需引入，配合 Iconify 在线 CDN。',
    done: true,
    code: `// ✅ 按需引入（已完成）
import { SmileOutlined } from '@ant-design/icons-vue'

// ❌ 避免全量引入
// import * as Icons from '@ant-design/icons-vue'`,
  },
  {
    title: '自动化测试覆盖',
    desc: '利用 vitest（单元测试）和 Playwright/Cypress（E2E 测试）保障组件稳定性。',
    done: false,
    code: `// __tests__/button.test.ts
import { mount } from '@vue/test-utils'
import { Button } from 'ant-design-vue'

test('Button emits click', async () => {
  const wrapper = mount(Button)
  await wrapper.trigger('click')
  expect(wrapper.emitted()).toHaveProperty('click')
})`,
  },
]
</script>

<template>
  <div class="stage-page">
    <h1>阶段五：性能优化与工程化实践</h1>
    <p class="subtitle">按需加载、gzip 压缩、图标优化、自动化测试 —— 从开发到生产全链路优化。</p>

    <!-- 大数据表格 + 防抖搜索 -->
    <section class="card">
      <h2>5.1 大数据表格 + 虚拟滚动 + 防抖搜索</h2>
      <p>Table 内置 <code>virtual</code> 支持虚拟滚动；搜索输入使用防抖（debounce 300ms）避免频繁请求。</p>

      <div class="demo-row">
        <a-input
          placeholder="防抖搜索用户名（300ms）"
          style="width: 300px"
          @change="(e: any) => onSearchChange(e.target.value)"
        />
        <a-tag color="blue">共 {{ bigData.length.toLocaleString() }} 条数据</a-tag>
      </div>

      <a-table
        :columns="[
          { title: 'ID', dataIndex: 'key', key: 'key', width: 80 },
          { title: '姓名', dataIndex: 'name', key: 'name' },
          { title: '年龄', dataIndex: 'age', key: 'age', sorter: (a: any, b: any) => a.age - b.age },
          { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
          { title: '邮箱', dataIndex: 'email', key: 'email', ellipsis: true },
        ]"
        :data-source="bigData"
        :pagination="{ pageSize: 50, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }"
        :scroll="scrollConfig"
        bordered
        size="small"
        style="margin-top: 12px"
      />
    </section>

    <!-- 打包体积对比 -->
    <section class="card">
      <h2>5.2 打包体积对比</h2>
      <p>全量引入 vs 按需加载的体积差异。</p>

      <a-table
        :columns="[
          { title: '方案', dataIndex: 'name', key: 'name' },
          { title: '原始大小', dataIndex: 'size', key: 'size' },
          { title: 'Gzip 后', dataIndex: 'gzip', key: 'gzip' },
        ]"
        :data-source="bundleInfo"
        :pagination="false"
        bordered
      />

      <div style="margin-top: 16px">
        <a-progress :percent="42" :format="() => '按需加载可减少约 42% 体积'" />
      </div>
    </section>

    <!-- 优化清单 -->
    <section class="card">
      <h2>5.3 优化清单</h2>

      <div class="optimization-list">
        <div v-for="(item, index) in optimizationList" :key="index" class="opt-item">
          <div class="opt-header">
            <CheckCircleOutlined v-if="item.done" style="color: #52c41a; font-size: 18px" />
            <LoadingOutlined v-else style="color: #fa8c16; font-size: 18px" />
            <strong>{{ item.title }}</strong>
            <a-tag v-if="item.done" color="success">已完成</a-tag>
            <a-tag v-else color="warning">可选</a-tag>
          </div>
          <p class="opt-desc">{{ item.desc }}</p>
          <div v-if="item.code" class="code-preview">
            <pre class="code-sm">{{ item.code }}</pre>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 960px;
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
}

.card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.card h2 {
  font-size: 16px;
  color: #333;
  margin: 0 0 8px 0;
}

.card p {
  color: #888;
  font-size: 13px;
  margin: 0 0 12px 0;
}

.card p code {
  background: #f5f5f5;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.demo-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

/* 优化清单 */
.optimization-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.opt-item {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: #fafafa;
}

.opt-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.opt-header strong {
  font-size: 14px;
  color: #333;
}

.opt-desc {
  font-size: 13px;
  color: #888;
  margin: 4px 0 8px 26px;
}

.code-preview {
  background: #1e1e1e;
  border-radius: 6px;
  padding: 12px 16px;
  margin-left: 26px;
  overflow-x: auto;
}

.code-sm {
  color: #d4d4d4;
  font-size: 11px;
  line-height: 1.6;
  margin: 0;
  font-family: 'Fira Code', 'Consolas', monospace;
}
</style>
