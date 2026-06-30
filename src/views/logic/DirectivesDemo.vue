<script setup lang="ts">
import { ref } from 'vue'

// ====== 1. v-focus — 自动聚焦指令 ======
const vFocus = {
  mounted: (el: HTMLElement) => {
    el.focus()
  },
}

// ====== 2. v-highlight — 高亮指令 ======
const highlightColor = ref('#e6f7ff')
const vHighlight = (el: HTMLElement, binding: { value: string }) => {
  el.style.backgroundColor = binding.value || '#ffff00'
  el.style.padding = '2px 6px'
  el.style.borderRadius = '4px'
}

// ====== 3. v-tooltip — 提示指令 ======
const vTooltip = {
  mounted(el: HTMLElement, binding: { value: string }) {
    el.style.position = 'relative'
    el.style.cursor = 'help'

    const tooltip = document.createElement('span')
    tooltip.textContent = binding.value
    tooltip.style.cssText = `
      position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
      background: #333; color: #fff; padding: 4px 10px; border-radius: 4px;
      font-size: 12px; white-space: nowrap; opacity: 0; pointer-events: none;
      transition: opacity 0.2s; margin-bottom: 4px; z-index: 100;
    `
    el.appendChild(tooltip)

    el.addEventListener('mouseenter', () => (tooltip.style.opacity = '1'))
    el.addEventListener('mouseleave', () => (tooltip.style.opacity = '0'))
  },
}

// ====== 4. v-debounce-click — 防抖点击指令 ======
const clickCount = ref(0)

const vDebounceClick = {
  mounted(el: HTMLElement, binding: { value: (e: MouseEvent) => void; arg?: string }) {
    let timer: ReturnType<typeof setTimeout> | null = null
    const delay = binding.arg ? Number(binding.arg) : 500

    el.addEventListener('click', (e) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        binding.value(e as MouseEvent)
      }, delay)
    })
  },
}

function onDebounceClick() {
  clickCount.value++
}

// ====== 5. v-permission — 权限指令 ======
const vPermission = {
  mounted(el: HTMLElement, binding: { value: string }) {
    // 模拟当前用户权限
    const userPermissions = ['read', 'write']

    if (!userPermissions.includes(binding.value)) {
      el.style.display = 'none'
    }
  },
}
</script>

<template>
  <div>
    <!-- 1. v-focus -->
    <section class="demo-section">
      <h2>1. v-focus — 自动聚焦</h2>
      <input v-focus placeholder="页面加载时自动聚焦" class="demo-input" />
      <p class="hint">mounted 钩子中调用 el.focus()</p>
    </section>

    <!-- 2. v-highlight -->
    <section class="demo-section">
      <h2>2. v-highlight — 动态高亮</h2>
      <p>
        选择颜色：
        <label v-for="c in ['#e6f7ff', '#fff7e6', '#f9f0ff', '#fff2f0']" :key="c" class="color-label">
          <input type="radio" v-model="highlightColor" :value="c" />
          <span :style="{ background: c }" class="color-dot"></span>
        </label>
      </p>
      <p v-highlight="highlightColor">这是一个高亮文本示例</p>
      <p class="hint">函数简写形式 = mounted + updated 相同逻辑</p>
    </section>

    <!-- 3. v-tooltip -->
    <section class="demo-section">
      <h2>3. v-tooltip — 鼠标悬浮提示</h2>
      <div class="tooltip-demo">
        <span v-tooltip="'这是 Vue 3 自定义指令'">悬停查看提示</span>
        &nbsp;
        <span v-tooltip="'支持动态内容！'">另一个提示</span>
      </div>
      <p class="hint">在 mounted 中创建 DOM 元素，通过事件控制显隐</p>
    </section>

    <!-- 4. v-debounce-click -->
    <section class="demo-section">
      <h2>4. v-debounce-click — 防抖点击</h2>
      <button v-debounce-click:1000="onDebounceClick" class="demo-btn">防抖按钮（1秒）</button>
      <p>
        实际触发次数: <strong>{{ clickCount }}</strong>
      </p>
      <p class="hint">1秒内重复点击只触发一次，使用 :arg 传递延迟时间</p>
    </section>

    <!-- 5. v-permission -->
    <section class="demo-section">
      <h2>5. v-permission — 权限控制</h2>
      <p>当前用户权限: <code>['read', 'write']</code></p>
      <div class="perm-demo">
        <button v-permission="'read'" class="demo-btn">读取数据 ✅</button>
        <button v-permission="'write'" class="demo-btn">编辑数据 ✅</button>
        <button
          v-permission="'admin'"
          class="demo-btn"
          style="background: #fff2f0; border-color: #f5222d; color: #f5222d"
        >
          删除用户 ❌
        </button>
      </div>
      <p class="hint">无权限时通过 el.parentNode?.removeChild 移除元素</p>
    </section>
  </div>
</template>

<style scoped>
.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #eb2f96;
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

.demo-input {
  padding: 8px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  width: 280px;
  outline: none;
}

.demo-input:focus {
  border-color: #597ef7;
}

.demo-btn {
  padding: 8px 18px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  margin: 4px;
  transition: all 0.2s;
}

.demo-btn:hover {
  border-color: #597ef7;
  color: #597ef7;
}

/* 颜色选择 */
.color-label {
  margin-right: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.color-dot {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

/* 提示 */
.tooltip-demo {
  display: flex;
  gap: 16px;
}

.tooltip-demo span {
  padding: 4px 12px;
  background: #f0f0f0;
  border-radius: 4px;
  display: inline-block;
}

/* 权限 */
.perm-demo {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}
</style>
