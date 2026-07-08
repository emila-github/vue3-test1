<script setup lang="ts">
/**
 * Vant Stage 3: 反馈与交互组件
 * 演示 Dialog、Toast、Notify、ActionSheet、Popup、Overlay、PullRefresh 等
 */
import { ref } from 'vue'
import { showToast, showDialog, showNotify, showConfirmDialog } from 'vant'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// ============ Toast ============
function showToastDemo(type: 'text' | 'success' | 'fail' | 'loading') {
  if (type === 'text') {
    showToast('这是一条文字提示')
  } else if (type === 'success') {
    showToast({ type: 'success', message: '操作成功', duration: 2000 })
  } else if (type === 'fail') {
    showToast({ type: 'fail', message: '操作失败', duration: 2000 })
  } else if (type === 'loading') {
    const t = showToast({ type: 'loading', message: '加载中...', duration: 0 })
    setTimeout(() => t.close(), 2000)
  }
  addLog(`Toast: ${type}`)
}

// ============ Dialog ============
function showDialogDemo() {
  showDialog({
    title: '确认操作',
    message: '确定要执行此操作吗？删除后数据无法恢复。',
  }).then(() => {
    addLog('Dialog: 用户确认了操作')
    showToast('已确认')
  }).catch(() => {
    addLog('Dialog: 用户取消了操作')
  })
}

function showDialogCustom() {
  showConfirmDialog({
    title: '删除确认',
    message: '确定要删除这条记录吗？删除后不可恢复。',
    confirmButtonText: '删除',
    confirmButtonColor: '#ee0a24',
    cancelButtonText: '再想想',
  }).then(() => {
    addLog('确认删除')
    showToast('已删除')
  }).catch(() => {
    addLog('取消删除')
  })
}

// ============ Notify ============
function showNotifyDemo(type: 'primary' | 'success' | 'danger' | 'warning') {
  showNotify({ type, message: `${type.toUpperCase()} 类型的通知`, duration: 2000 })
  addLog(`Notify: ${type}`)
}

// ============ ActionSheet ============
const actionSheetVisible = ref(false)
const actionSheetActions = [
  { name: '选项一', color: '#1989fa' },
  { name: '选项二' },
  { name: '选项三', subname: '描述信息', disabled: true },
]

function onActionSelect(action: { name: string }) {
  actionSheetVisible.value = false
  addLog(`ActionSheet: 选择了 "${action.name}"`)
  showToast(`选择了 ${action.name}`)
}

// ============ Popup + PullRefresh ============
const popupVisible = ref(false)
const popupPosition = ref<'top' | 'bottom' | 'left' | 'right' | 'center'>('bottom')

function showPopup(pos: 'top' | 'bottom' | 'left' | 'right' | 'center') {
  popupPosition.value = pos
  popupVisible.value = true
  addLog(`弹出 Popup: ${pos}`)
}

const refreshing = ref(false)
function onRefresh() {
  refreshing.value = true
  addLog('下拉刷新中...')
  setTimeout(() => {
    refreshing.value = false
    addLog('刷新完成')
    showToast('刷新成功')
  }, 1500)
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 3：反馈与交互组件</h1>
      <p>掌握 Dialog 弹窗、Toast 轻提示、Notify 通知、ActionSheet、Popup 弹出层、PullRefresh 下拉刷新等交互组件。</p>
    </header>

    <!-- 3.1 Toast -->
    <section class="card">
      <h2>3.1 Toast 轻提示</h2>
      <div class="demo-row">
        <van-button @click="showToastDemo('text')">文字提示</van-button>
        <van-button type="success" @click="showToastDemo('success')">成功提示</van-button>
        <van-button type="danger" @click="showToastDemo('fail')">失败提示</van-button>
        <van-button @click="showToastDemo('loading')">加载提示</van-button>
      </div>
      <pre class="code-block">{{ `import { showToast } from 'vant'

showToast('文字提示')
showToast({ type: 'success', message: '成功', duration: 2000 })
showToast({ type: 'loading', message: '加载中...', duration: 0 })
// duration为0时不自动关闭，需要手动 close()
const toast = showToast({ type: 'loading', duration: 0 })
setTimeout(() => toast.close(), 2000)` }}</pre>
    </section>

    <!-- 3.2 Dialog -->
    <section class="card">
      <h2>3.2 Dialog 对话框</h2>
      <div class="demo-row">
        <van-button type="primary" @click="showDialogDemo">普通确认框</van-button>
        <van-button type="danger" @click="showDialogCustom">删除确认框</van-button>
      </div>
      <pre class="code-block">{{ `import { showDialog, showConfirmDialog } from 'vant'

// 普通对话框
showDialog({
  title: '标题',
  message: '这是内容',
}).then(() => { /* 确认 */ }).catch(() => { /* 取消 */ })

// 确认删除对话框
showConfirmDialog({
  title: '删除确认',
  message: '确定删除？不可恢复。',
  confirmButtonText: '删除',
  confirmButtonColor: '#ee0a24',
})` }}</pre>
    </section>

    <!-- 3.3 Notify -->
    <section class="card">
      <h2>3.3 Notify 消息通知</h2>
      <div class="demo-row">
        <van-button type="primary" @click="showNotifyDemo('primary')">主要通知</van-button>
        <van-button type="success" @click="showNotifyDemo('success')">成功通知</van-button>
        <van-button type="danger" @click="showNotifyDemo('danger')">危险通知</van-button>
        <van-button type="warning" @click="showNotifyDemo('warning')">警告通知</van-button>
      </div>
      <pre class="code-block">{{ `import { showNotify } from 'vant'

showNotify({ type: 'primary', message: '通知内容' })
showNotify({ type: 'danger', message: '操作失败' })
showNotify({ type: 'warning', message: '请注意' })` }}</pre>
    </section>

    <!-- 3.4 ActionSheet + Popup -->
    <section class="card">
      <h2>3.4 ActionSheet &amp; Popup</h2>
      <div class="demo-row">
        <van-button @click="actionSheetVisible = true">弹出菜单</van-button>
        <van-button @click="showPopup('bottom')">底部弹出</van-button>
        <van-button @click="showPopup('center')">居中弹出</van-button>
        <van-button @click="showPopup('right')">右侧弹出</van-button>
      </div>
      <van-popup v-model:show="popupVisible" :position="popupPosition" round closeable style="width:80%;max-width:400px;padding:24px">
        <h3>{{ popupPosition }} 方向弹出层</h3>
        <p style="color:#999">这是一个从 {{ popupPosition }} 弹出的内容区域。Popup 支持多种弹出方向。</p>
        <van-button block type="primary" style="margin-top:16px" @click="popupVisible = false">关闭</van-button>
      </van-popup>
      <van-action-sheet
        v-model:show="actionSheetVisible"
        :actions="actionSheetActions"
        cancel-text="取消"
        close-on-click-action
        @select="onActionSelect"
        @cancel="actionSheetVisible = false"
      />
      <pre class="code-block">{{ `<van-action-sheet
  v-model:show="show"
  :actions="actions"
  cancel-text="取消"
  close-on-click-action
  @select="onSelect"
/>

// Popup
<van-popup v-model:show="show" position="bottom" round>
  <div>内容</div>
</van-popup>` }}</pre>
    </section>

    <!-- 3.5 PullRefresh 下拉刷新 -->
    <section class="card">
      <h2>3.5 PullRefresh &amp; Overlay</h2>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="min-height:150px">
        <div style="padding:30px;text-align:center;color:#999;border:1px dashed #ebedf0;border-radius:8px">
          {{ refreshing ? '刷新中...' : '下拉试试看 ↓' }}
        </div>
      </van-pull-refresh>
      <pre class="code-block">{{ `<van-pull-refresh v-model="loading" @refresh="onRefresh">
  <p>下拉刷新内容</p>
</van-pull-refresh>

const onRefresh = () => {
  setTimeout(() => { loading.value = false }, 1000)
}` }}</pre>
    </section>

    <!-- 3.6 组件方法 vs 组件标签 -->
    <section class="card">
      <h2>3.6 函数式调用 vs 组件式使用</h2>
      <div class="compare-table">
        <div class="compare-header"><span>组件</span><span>函数式调用</span><span>组件式使用</span></div>
        <div class="compare-row"><span>Toast</span><code>showToast()</code><code>&lt;van-toast&gt;</code></div>
        <div class="compare-row"><span>Dialog</span><code>showDialog()</code><code>&lt;van-dialog&gt;</code></div>
        <div class="compare-row"><span>Notify</span><code>showNotify()</code><code>&lt;van-notify&gt;</code></div>
        <div class="compare-row"><span>ActionSheet</span><code>（组件式）</code><code>&lt;van-action-sheet&gt;</code></div>
        <div class="compare-row"><span>ImagePreview</span><code>showImagePreview()</code><code>&lt;van-image-preview&gt;</code></div>
      </div>
      <p class="note">Vant 同时支持函数式调用和组件式使用。函数式调用更简洁，适合简单场景；组件式使用更灵活，适合需要精细控制的场景。</p>
    </section>

    <!-- 操作日志 -->
    <section class="card">
      <h2>操作日志</h2>
      <div class="log-area">
        <div v-if="log.length === 0" class="log-empty">暂无操作记录</div>
        <div v-for="(item, i) in log" :key="i" class="log-item">{{ item }}</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page { max-width: 960px; margin: 0 auto; padding: 24px; }
.page-header { text-align: center; margin-bottom: 24px; }
.page-header h1 { font-size: 24px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; }
.card { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; padding-bottom: 6px; border-bottom: 1px solid #f0f0f0; }
.demo-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.note { font-size: 13px; color: #999; margin: 12px 0 0; }
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; font-size: 13px; line-height: 1.6; overflow-x: auto; white-space: pre; margin-top: 12px; }
.compare-table { border: 1px solid #ebedf0; border-radius: 8px; overflow: hidden; margin-bottom: 8px; }
.compare-header, .compare-row { display: grid; grid-template-columns: 1fr 1.5fr 1.5fr; padding: 10px 16px; font-size: 13px; }
.compare-header { background: #f7f8fa; font-weight: 600; color: #333; }
.compare-row { border-top: 1px solid #ebedf0; color: #666; align-items: center; }
.compare-row code { color: #1989fa; font-size: 12px; }
.log-area { max-height: 200px; overflow-y: auto; background: #fafafa; border-radius: 8px; padding: 12px; }
.log-empty { color: #ccc; text-align: center; padding: 20px; }
.log-item { font-size: 12px; color: #666; padding: 3px 0; font-family: monospace; border-bottom: 1px dashed #f0f0f0; }
</style>
