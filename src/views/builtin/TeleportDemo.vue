<script setup lang="ts">
import { ref } from 'vue'

// ====== 1. 模态框（传送到 body） ======
const showModal = ref(false)
const modalInput = ref('')

function openModal() {
  modalInput.value = ''
  showModal.value = true
}

// ====== 2. Toast 通知（传送到 #toast-container） ======
const toasts = ref<{ id: number; message: string; type: string }[]>([])
let toastId = 0

function showToast(type: string) {
  const messages: Record<string, string> = {
    success: '操作成功！',
    error: '操作失败，请重试',
    warning: '请注意检查输入',
    info: '这是一条通知',
  }
  const newToast = { id: ++toastId, message: messages[type] || '通知', type }
  toasts.value.push(newToast)
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== newToast.id)
  }, 2500)
}
</script>

<template>
  <div>
    <!-- 1. 模态框 Teleport -->
    <section class="demo-section">
      <h2>1. 模态框 — Teleport to="body"</h2>
      <button @click="openModal" class="demo-btn">打开模态框</button>

      <Teleport to="body">
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
          <div class="modal-box">
            <h3>📋 模态框标题</h3>
            <p>这个模态框被 Teleport 到了 &lt;body&gt; 末尾</p>
            <p>不受父组件 overflow / z-index 限制</p>
            <input v-model="modalInput" placeholder="输入内容..." class="modal-input" />
            <div class="modal-actions">
              <button @click="showModal = false" class="btn-cancel">取消</button>
              <button @click="showModal = false" class="btn-ok">确定</button>
            </div>
          </div>
        </div>
      </Teleport>

      <p class="hint">
        打开开发者工具查看 DOM — 模态框在 &lt;body&gt; 下，不在当前组件内
      </p>
    </section>

    <!-- 2. Toast 通知 -->
    <section class="demo-section">
      <h2>2. Toast 通知 — Teleport to="#toast-container"</h2>
      <div class="toast-btns">
        <button @click="showToast('success')" class="toast-btn toast-success">成功</button>
        <button @click="showToast('error')" class="toast-btn toast-error">错误</button>
        <button @click="showToast('warning')" class="toast-btn toast-warning">警告</button>
        <button @click="showToast('info')" class="toast-btn toast-info">信息</button>
      </div>

      <!-- 多个 Teleport 到同一目标 -->
      <Teleport to="#toast-container">
        <TransitionGroup name="toast" tag="div" class="toast-list">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="`toast-item toast-${toast.type}`"
          >
            {{ toast.message }}
          </div>
        </TransitionGroup>
      </Teleport>

      <p class="hint">Toast 传送到 #toast-container（在 index.html 中预先定义）</p>
    </section>

    <!-- 3. :disabled 属性 -->
    <section class="demo-section">
      <h2>3. :disabled 属性</h2>
      <pre class="code-hint">&lt;Teleport to="body" :disabled="isMobile"&gt;
  &lt;Modal v-if="show" /&gt;
&lt;/Teleport&gt;</pre>
      <p class="hint">disabled 为 true 时，内容将在原位置渲染，不传送</p>
    </section>
  </div>
</template>

<style scoped>
.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #fa8c16;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 8px;
}

.demo-btn {
  padding: 8px 18px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  transition: all 0.2s;
}

.demo-btn:hover {
  border-color: #fa8c16;
  color: #fa8c16;
}

.code-hint {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 14px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin: 0;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-box {
  background: #fff;
  padding: 24px 30px;
  border-radius: 12px;
  min-width: 360px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.modal-box h3 {
  margin: 0 0 12px;
  color: #333;
}

.modal-box p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.modal-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  margin-top: 12px;
  box-sizing: border-box;
  outline: none;
}

.modal-input:focus {
  border-color: #fa8c16;
}

.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
}

.modal-actions button {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  background: #fff;
}

.btn-cancel:hover { border-color: #999; color: #999; }
.btn-ok {
  background: #fa8c16 !important;
  color: #fff !important;
  border-color: #fa8c16 !important;
}
.btn-ok:hover { opacity: 0.85; }

/* Toast */
.toast-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.toast-btn {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  background: #fff;
  transition: all 0.2s;
}

.toast-success:hover { border-color: #52c41a; color: #52c41a; background: #f6ffed; }
.toast-error:hover { border-color: #f5222d; color: #f5222d; background: #fff2f0; }
.toast-warning:hover { border-color: #faad14; color: #faad14; background: #fffbe6; }
.toast-info:hover { border-color: #1890ff; color: #1890ff; background: #e6f7ff; }

/* Toast 列表（在 #toast-container 中渲染） */
.toast-list {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toast-item {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
}

.toast-success { background: #52c41a; }
.toast-error { background: #f5222d; }
.toast-warning { background: #faad14; }
.toast-info { background: #1890ff; }
</style>

<!-- Toast 动画 -->
<style>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
