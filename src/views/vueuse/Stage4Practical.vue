<script setup lang="ts">
/**
 * Stage 4: VueUse 实战综合示例
 * 演示 useNetwork、useOnline、useIdle、useInfiniteScroll 的组合使用
 */
import { ref, computed } from 'vue'
import { useNetwork, useOnline, useIdle, useInfiniteScroll, useBreakpoints } from '@vueuse/core'
import { message } from 'ant-design-vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(msg)
}

// ============ useNetwork ============
const { isSupported: netSupported, isOnline, offlineAt, downlink, downlinkMax, effectiveType, rtt, saveData, type } =
  useNetwork()

// ============ useOnline (简化版) ============
const online = useOnline()

// ============ useIdle ============
const { idle, lastActive } = useIdle(5000) // 5 秒无操作即空闲

const idleTime = computed(() => {
  if (!lastActive.value) return '--'
  const sec = Math.floor((Date.now() - lastActive.value) / 1000)
  return `${sec}s 前`
})

// ============ useBreakpoints ============
const bp = useBreakpoints({
  mobile: 640,
  tablet: 1024,
})

const deviceType = computed(() => {
  if (bp.isSmallerOrEqual('mobile')) return '📱 手机'
  if (bp.isInBetween('mobile', 'tablet')) return '📟 平板'
  return '🖥 桌面'
})

// ============ useInfiniteScroll ============
interface ListItem {
  id: number
  title: string
  desc: string
}
const listData = ref<ListItem[]>([])
const page = ref(1)
const pageSize = 15
const loading = ref(false)
const noMore = ref(false)
const scrollEl = ref<HTMLElement | null>(null)

function genItem(id: number): ListItem {
  return {
    id,
    title: `数据条目 #${id}`,
    desc: `这是第 ${id} 条模拟数据的详细描述内容，VueUse 让组合式 API 开发变得更简单。`,
  }
}

// 初始数据
for (let i = 1; i <= pageSize; i++) {
  listData.value.push(genItem(i))
}
page.value = 1

async function loadMore() {
  if (loading.value || noMore.value) return
  loading.value = true
  // 模拟异步加载
  await new Promise((r) => setTimeout(r, 800))
  page.value++
  const start = listData.value.length + 1
  for (let i = 0; i < pageSize; i++) {
    listData.value.push(genItem(start + i))
  }
  loading.value = false
  addLog(`加载了第 ${page.value} 页，共 ${listData.value.length} 条`)
  if (listData.value.length >= 90) {
    noMore.value = true
    addLog('全部数据已加载完毕')
  }
}

useInfiniteScroll(scrollEl, loadMore, { distance: 50 })
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 4：实战综合示例</h1>
      <p>组合使用 <code>useNetwork</code>、<code>useOnline</code>、<code>useIdle</code>、<code>useInfiniteScroll</code>、<code>useBreakpoints</code>。</p>
    </header>

    <!-- 4.1 useNetwork -->
    <section class="card">
      <h2>4.1 useNetwork —— 网络信息监控</h2>
      <p>实时获取网络连接类型、带宽、RTT、是否省流量模式等。</p>
      <pre class="code-block">const { isOnline, type, downlink, rtt, saveData } = useNetwork()</pre>
      <div class="demo-box">
        <div class="network-grid">
          <div class="net-item">
            <span class="net-label">在线状态</span>
            <span :class="['net-value', isOnline ? 'online' : 'offline']">{{ isOnline ? '🟢 在线' : '🔴 离线' }}</span>
          </div>
          <div class="net-item">
            <span class="net-label">网络类型</span>
            <span class="net-value">{{ type || '未知' }}</span>
          </div>
          <div class="net-item">
            <span class="net-label">下行速度</span>
            <span class="net-value">{{ downlink ?? '--' }} Mbps</span>
          </div>
          <div class="net-item">
            <span class="net-label">RTT</span>
            <span class="net-value">{{ rtt }}ms</span>
          </div>
          <div class="net-item">
            <span class="net-label">有效类型</span>
            <span class="net-value">{{ effectiveType || '--' }}</span>
          </div>
          <div class="net-item">
            <span class="net-label">省流量</span>
            <span class="net-value">{{ saveData ? '是' : '否' }}</span>
          </div>
        </div>
        <div v-if="!netSupported" class="warning">当前浏览器不支持 Network Information API</div>
      </div>
    </section>

    <!-- 4.2 useOnline -->
    <section class="card">
      <h2>4.2 useOnline —— 简化在线检测</h2>
      <pre class="code-block">const online = useOnline()</pre>
      <div class="demo-box flex-center">
        <div :class="['status-indicator', online ? 'connected' : 'disconnected']">
          <span class="indicator-dot"></span>
          <span>{{ online ? '已连接网络' : '网络已断开' }}</span>
        </div>
      </div>
    </section>

    <!-- 4.3 useIdle -->
    <section class="card">
      <h2>4.3 useIdle —— 用户空闲检测</h2>
      <p>5 秒无鼠标/键盘操作即视为空闲。</p>
      <pre class="code-block">const { idle, lastActive } = useIdle(5000)</pre>
      <div class="demo-box flex-center">
        <div :class="['status-indicator', idle ? 'idle' : 'active']">
          <span class="indicator-dot"></span>
          <span>{{ idle ? `😴 空闲中（最后活跃：${idleTime}）` : '🟢 活跃中' }}</span>
        </div>
      </div>
      <p class="hint">试试停止操作鼠标键盘 5 秒</p>
    </section>

    <!-- 4.4 useBreakpoints -->
    <section class="card">
      <h2>4.4 useBreakpoints —— 断点检测</h2>
      <pre class="code-block">
const bp = useBreakpoints({ mobile: 640, tablet: 1024 })
bp.isSmallerOrEqual('mobile')</pre>
      <div class="demo-box flex-center">
        <span class="device-display">{{ deviceType }}</span>
      </div>
      <p class="hint">尝试缩放浏览器窗口</p>
    </section>

    <!-- 4.5 useInfiniteScroll -->
    <section class="card">
      <h2>4.5 useInfiniteScroll —— 无限滚动</h2>
      <p>监听滚动到底部自动加载更多数据。</p>
      <pre class="code-block">
useInfiniteScroll(scrollEl, async () => {
  await loadMore()
}, { distance: 50 })</pre>
      <div class="demo-box">
        <div ref="scrollEl" class="infinite-container">
          <div v-for="item in listData" :key="item.id" class="list-item">
            <span class="item-id">#{{ item.id }}</span>
            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.desc }}</p>
            </div>
          </div>
          <div v-if="loading" class="loading-more">加载中…</div>
          <div v-if="noMore" class="no-more">— 已加载全部数据 —</div>
        </div>
      </div>
    </section>

    <!-- 操作日志 -->
    <section class="card">
      <h2>操作日志</h2>
      <div class="log-area">
        <div v-for="(item, i) in log" :key="i" class="log-item">[{{ i + 1 }}] {{ item }}</div>
        <div v-if="log.length === 0" class="log-empty">暂无操作记录</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}
.page-header h1 { font-size: 26px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; }
.page-header code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; }

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.card h2 { margin: 0 0 12px; font-size: 18px; color: #333; }
.card p { font-size: 14px; color: #666; line-height: 1.6; margin: 0 0 12px; }

.code-block {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin-bottom: 16px;
}

.demo-box {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.flex-center { display: flex; align-items: center; justify-content: center; gap: 12px; }

.network-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.net-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}
.net-label { font-size: 12px; color: #999; }
.net-value { font-size: 15px; font-weight: 600; color: #333; }
.net-value.online { color: #10b981; }
.net-value.offline { color: #ef4444; }

.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
}

.status-indicator.connected { background: #ecfdf5; color: #10b981; }
.status-indicator.disconnected { background: #fef2f2; color: #ef4444; }
.status-indicator.active { background: #eff6ff; color: #3b82f6; }
.status-indicator.idle { background: #fefce8; color: #eab308; }

.indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
}

.warning { color: #f59e0b; font-size: 13px; margin-top: 10px; }

.hint { color: #999; font-size: 12px; margin-top: 8px; }

.device-display { font-size: 28px; font-weight: 700; }

.infinite-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.list-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.2s;
}
.list-item:hover { background: #fafafa; }

.item-id {
  color: #1677ff;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
}
.list-item strong { font-size: 14px; color: #333; }
.list-item p { font-size: 12px; color: #999; margin: 4px 0 0; }

.loading-more { text-align: center; padding: 16px; color: #999; }
.no-more { text-align: center; padding: 16px; color: #ccc; font-size: 13px; }

.log-area { max-height: 200px; overflow-y: auto; font-size: 13px; }
.log-item { padding: 4px 0; color: #555; border-bottom: 1px dashed #f0f0f0; }
.log-empty { color: #ccc; text-align: center; padding: 20px; }

@media (max-width: 640px) {
  .stage-page { padding: 16px; }
  .network-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
