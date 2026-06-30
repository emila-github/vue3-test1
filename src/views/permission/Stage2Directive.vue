<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserPermissions, getMenusByRole } from '@/api/modules/permission'
import type { MenuItem } from '@/api/modules/permission'

const currentRole = ref('editor')
const permissions = ref<string[]>([])
const menus = ref<MenuItem[]>([])
const allMenus = ref<MenuItem[]>([])
const loading = ref(false)

// v-permission 指令定义
const vPermission = {
  mounted(el: HTMLElement, binding: { value: string | string[] }) {
    checkPermission(el, binding.value)
  },
  updated(el: HTMLElement, binding: { value: string | string[] }) {
    checkPermission(el, binding.value)
  },
}

function checkPermission(el: HTMLElement, value: string | string[]) {
  if (!value) return
  const perms = Array.isArray(value) ? value : [value]
  const has = perms.some((p) => permissions.value.includes(p))
  if (!has) {
    // 没有权限：按钮隐藏（display: none），并禁用点击
    el.style.display = 'none'
  } else {
    el.style.display = ''
  }
}

// 权限检查方法
function hasPermission(perm: string | string[]): boolean {
  const perms = Array.isArray(perm) ? perm : [perm]
  return perms.some((p) => permissions.value.includes(p))
}

const roles = [
  { key: 'admin', label: '超级管理员' },
  { key: 'manager', label: '部门经理' },
  { key: 'editor', label: '内容编辑' },
  { key: 'viewer', label: '访客' },
]

async function fetchData(role: string) {
  loading.value = true
  try {
    const [permInfo, menuData] = await Promise.all([getUserPermissions(role), getMenusByRole(role)])
    permissions.value = permInfo.permissions
    menus.value = menuData.menus
    allMenus.value = menuData.allMenus
  } finally {
    loading.value = false
  }
}

function switchRole(role: string) {
  currentRole.value = role
  fetchData(role)
}

onMounted(() => fetchData(currentRole.value))

// 按钮权限演示
const actionButtons = [
  { label: '新建用户', perm: 'btn:user-create', type: 'primary' },
  { label: '编辑用户', perm: 'btn:user-edit', type: 'default' },
  { label: '删除用户', perm: 'btn:user-delete', type: 'default', danger: true },
  { label: '导出数据', perm: 'btn:user-export', type: 'default' },
  { label: '导出报表', perm: 'btn:report-export', type: 'default' },
  { label: '保存设置', perm: 'btn:settings-save', type: 'primary' },
]

const logs = ref<string[]>([])
function handleClick(action: string) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${action} → 权限通过`)
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>🔐 Stage 2：指令控制 — 菜单与按钮</h1>
      <p>v-permission 自定义指令：控制菜单显隐、按钮可见性</p>
    </header>

    <!-- 角色切换 -->
    <section class="card">
      <h2>切换角色查看效果</h2>
      <a-space>
        <a-button
          v-for="r in roles"
          :key="r.key"
          :type="currentRole === r.key ? 'primary' : 'default'"
          @click="switchRole(r.key)"
          >{{ r.label }}</a-button
        >
      </a-space>
      <div style="margin-top: 12px; color: #999; font-size: 13px">
        当前角色：<a-tag color="blue">{{ currentRole }}</a-tag
        >， 权限数：<a-tag>{{ permissions.length }}</a-tag>
      </div>
    </section>

    <!-- 菜单控制 -->
    <section class="card">
      <h2>菜单权限控制</h2>
      <p class="desc">
        左侧：完整菜单列表（无权限的置灰）；右侧：实际可见菜单（已过滤）。 菜单通过
        <code>v-permission</code> 控制，多权限 OR 逻辑：任一个满足即可显示。
      </p>
      <div class="menu-compare">
        <div class="menu-panel">
          <h4>全部菜单</h4>
          <div
            v-for="m in allMenus"
            :key="m.key"
            class="menu-item"
            :class="{ disabled: !menus.some((am) => am.key === m.key) }"
          >
            <span>{{ m.label }}</span>
            <span class="perm-tag">{{ m.requiredPermissions.join(' 或 ') }}</span>
          </div>
        </div>
        <div class="menu-panel">
          <h4>可见菜单（已过滤）</h4>
          <div v-for="m in menus" :key="m.key" class="menu-item active">
            <span>{{ m.label }}</span>
            <span class="perm-tag">{{ m.requiredPermissions.join(' 或 ') }}</span>
          </div>
          <div v-if="menus.length === 0" class="empty-hint">无可见菜单</div>
        </div>
      </div>
    </section>

    <!-- 按钮权限控制 -->
    <section class="card">
      <h2>按钮权限控制 — 三种实现方式</h2>
      <div class="btn-demos">
        <!-- 方式1: v-permission 指令 -->
        <div class="demo-block">
          <h4>方式 1：v-permission 指令（display: none）</h4>
          <p class="small-desc">权限不满足时隐藏 DOM 元素</p>
          <a-space>
            <a-button
              v-for="btn in actionButtons.slice(0, 3)"
              :key="btn.perm"
              v-permission="btn.perm"
              :type="btn.type as any"
              :danger="btn.danger"
              @click="handleClick(btn.label)"
              >{{ btn.label }}</a-button
            >
          </a-space>
        </div>
        <!-- 方式2: v-if 条件渲染 -->
        <div class="demo-block">
          <h4>方式 2：v-if 条件渲染</h4>
          <p class="small-desc">权限不满足时不渲染 DOM 节点</p>
          <a-space>
            <a-button v-if="hasPermission('btn:user-export')" type="primary" @click="handleClick('导出数据(v-if)')"
              >导出数据</a-button
            >
            <a-button v-if="hasPermission('btn:report-export')" @click="handleClick('导出报表(v-if)')"
              >导出报表</a-button
            >
          </a-space>
        </div>
        <!-- 方式3: :disabled 禁用模式 -->
        <div class="demo-block">
          <h4>方式 3：:disabled 禁用模式（可见但不可操作）</h4>
          <p class="small-desc">按钮保留在界面上，但置灰不可点击，提示"无权限"</p>
          <a-tooltip v-if="hasPermission('btn:settings-save')" />
          <a-button
            :disabled="!hasPermission('btn:settings-save')"
            :type="hasPermission('btn:settings-save') ? 'primary' : 'default'"
            @click="handleClick('保存设置')"
          >
            {{ hasPermission('btn:settings-save') ? '保存设置' : '保存设置（无权限）' }}
          </a-button>
        </div>
      </div>
    </section>

    <!-- 方式对比 -->
    <section class="card">
      <h2>三种方式对比</h2>
      <a-table
        :columns="[
          { title: '方式', dataIndex: 'way', key: 'way' },
          { title: 'DOM', dataIndex: 'dom', key: 'dom' },
          { title: '适用场景', dataIndex: 'scene', key: 'scene' },
          { title: '缺点', dataIndex: 'cons', key: 'cons' },
        ]"
        :data-source="[
          { way: 'v-permission 指令', dom: '存在但隐藏', scene: '按钮数量多、布局固定', cons: 'DOM 残留，CSS 可覆盖' },
          { way: 'v-if 条件', dom: '不存在', scene: '组件级、大区块', cons: '频繁切换有性能开销' },
          { way: ':disabled 禁用', dom: '存在可见', scene: '提示用户该功能存在', cons: '需要额外 Tooltip 说明' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- 操作日志 -->
    <section class="card">
      <h2>操作日志（仅记录权限通过的操作）</h2>
      <div v-if="logs.length === 0" style="color: #999; font-size: 13px">点击上方有权限的按钮...</div>
      <div v-for="(l, i) in logs" :key="i" class="log-item">{{ l }}</div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}
.page-header {
  text-align: center;
  margin-bottom: 30px;
}
.page-header h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin: 0 0 6px;
}
.page-header p {
  color: #999;
  font-size: 14px;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.card h2 {
  margin: 0 0 12px;
  font-size: 18px;
  color: #333;
}
.card h4 {
  margin: 0 0 6px;
  font-size: 14px;
  color: #555;
}
.desc {
  color: #555;
  font-size: 14px;
  line-height: 1.8;
  margin: 0 0 12px;
}
.desc code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
}
.small-desc {
  font-size: 12px;
  color: #999;
  margin: 0 0 8px;
}
.menu-compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.menu-panel {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #f0f0f0;
}
.menu-panel h4 {
  margin: 0 0 10px;
  font-size: 13px;
  color: #999;
}
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  margin-bottom: 4px;
  font-size: 13px;
  background: #fff;
}
.menu-item.disabled {
  opacity: 0.4;
}
.menu-item.active {
  background: #e6f4ff;
  color: #1677ff;
}
.perm-tag {
  font-size: 11px;
  color: #999;
}
.empty-hint {
  text-align: center;
  color: #bbb;
  padding: 20px;
  font-size: 13px;
}
.btn-demos {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.demo-block {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}
.log-item {
  padding: 6px 0;
  border-bottom: 1px solid #f5f5f5;
  font-size: 13px;
  color: #555;
  font-family: monospace;
}
@media (max-width: 768px) {
  .menu-compare {
    grid-template-columns: 1fr;
  }
}
</style>
