<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserPermissions, getMenusByRole, getUsersByRole } from '@/api/modules/permission'
import type { MenuItem, UserRecord, UserListResult } from '@/api/modules/permission'
import { message } from 'ant-design-vue'

const currentRole = ref('editor')
const permissions = ref<string[]>([])
const menus = ref<MenuItem[]>([])
const allMenus = ref<MenuItem[]>([])
const users = ref<UserRecord[]>([])
const dataPermissions = ref<UserListResult['permissions']>({
  canViewAll: false, canViewOwn: false, canViewSensitive: false, canViewSalary: false,
})
const loading = ref(false)
const activeMenu = ref('user-manage')

const roles = [
  { key: 'admin', label: '超级管理员', icon: '👑' },
  { key: 'manager', label: '部门经理', icon: '🎯' },
  { key: 'editor', label: '内容编辑', icon: '✏️' },
  { key: 'viewer', label: '访客', icon: '👁️' },
]

const logEntries = ref<string[]>([])

function hasAny(...perms: string[]): boolean {
  return perms.some((p) => permissions.value.includes(p))
}

// 指令定义
const vPermission = {
  mounted(el: HTMLElement, binding: { value: string | string[] }) {
    const perms = Array.isArray(binding.value) ? binding.value : [binding.value]
    if (!perms.some((p) => permissions.value.includes(p))) {
      el.style.display = 'none'
    }
  },
}

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '姓名', dataIndex: 'name', key: 'name', width: 90 },
  { title: '部门', dataIndex: 'dept', key: 'dept', width: 100 },
  { title: '手机号', dataIndex: 'phone', key: 'phone', width: 130 },
  { title: '身份证', dataIndex: 'idCard', key: 'idCard', width: 180 },
  { title: '薪资', dataIndex: 'salary', key: 'salary', width: 100 },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '操作', key: 'action', width: 200 },
]

const reportData = ref([
  { dept: '技术部', members: 2, avgSalary: '***', projectCount: 12, kpi: '95%' },
  { dept: '产品部', members: 2, avgSalary: '***', projectCount: 8, kpi: '88%' },
  { dept: '市场部', members: 1, avgSalary: '***', projectCount: 5, kpi: '82%' },
])

const reportColumns = [
  { title: '部门', dataIndex: 'dept', key: 'dept' },
  { title: '人数', dataIndex: 'members', key: 'members' },
  { title: '平均薪资', dataIndex: 'avgSalary', key: 'avgSalary' },
  { title: '项目数', dataIndex: 'projectCount', key: 'projectCount' },
  { title: 'KPI', dataIndex: 'kpi', key: 'kpi' },
]

async function fetchAll(role: string) {
  loading.value = true
  try {
    const [permInfo, menuData, userData] = await Promise.all([
      getUserPermissions(role),
      getMenusByRole(role),
      getUsersByRole(role),
    ])
    permissions.value = permInfo.permissions
    menus.value = menuData.menus
    allMenus.value = menuData.allMenus
    users.value = userData.list
    dataPermissions.value = userData.permissions
    // 更新报表薪资数据
    if (userData.permissions.canViewSalary) {
      reportData.value[0]!.avgSalary = '¥20,000'
      reportData.value[1]!.avgSalary = '¥18,000'
      reportData.value[2]!.avgSalary = '¥12,000'
    } else {
      reportData.value.forEach((r) => { r.avgSalary = '***' })
    }
  } finally {
    loading.value = false
  }
}

function switchRole(role: string) {
  currentRole.value = role
  if (!menus.value.some((m) => m.key === activeMenu.value)) {
    activeMenu.value = menus.value[0]?.key || 'user-manage'
  }
  fetchAll(role)
}

function addLog(msg: string) {
  logEntries.value.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// 按钮操作（模拟）
function handleCreate() { addLog('新建用户（权限通过）'); message.success('新建成功') }
function handleEdit() { addLog('编辑用户（权限通过）'); message.success('编辑成功') }
function handleDelete() { addLog('删除用户（权限通过）'); message.success('删除成功') }
function handleExport() { addLog('导出数据（权限通过）'); message.success('导出成功') }
function handleExportReport() { addLog('导出报表（权限通过）'); message.success('报表导出成功') }
function handleSaveSettings() { addLog('保存设置（权限通过）'); message.success('保存成功') }
function handleClearLogs() { logEntries.value = [] }

onMounted(() => fetchAll(currentRole.value))
</script>

<template>
  <div class="admin-layout">
    <!-- 顶栏 -->
    <header class="admin-header">
      <h2>🛡️ 权限管理后台</h2>
      <div class="header-right">
        <span class="role-label">当前角色：</span>
        <a-select
          :value="currentRole"
          style="width: 140px"
          size="small"
          @change="switchRole"
        >
          <a-select-option v-for="r in roles" :key="r.key" :value="r.key">
            {{ r.icon }} {{ r.label }}
          </a-select-option>
        </a-select>
        <span class="perm-count">{{ permissions.length }} 个权限</span>
      </div>
    </header>

    <div class="admin-body">
      <!-- 侧边栏 -->
      <nav class="admin-sidebar">
        <h4>导航菜单</h4>
        <div
          v-for="m in menus"
          :key="m.key"
          class="nav-item"
          :class="{ active: activeMenu === m.key }"
          @click="activeMenu = m.key"
        >
          {{ m.label }}
        </div>
        <div class="sidebar-section">
          <h4 style="margin-top: 16px">隐藏菜单（无权限）</h4>
          <div
            v-for="m in allMenus.filter(am => !menus.some(m2 => m2.key === am.key))"
            :key="'hidden-' + m.key"
            class="nav-item hidden"
          >
            {{ m.label }} <a-tag color="default" size="small">无权限</a-tag>
          </div>
        </div>
      </nav>

      <!-- 主内容 -->
      <main class="admin-content">
        <a-spin :spinning="loading">

          <!-- 用户管理页面 -->
          <template v-if="activeMenu === 'user-manage'">
            <section class="admin-card">
              <div class="card-header">
                <h3>👥 用户管理</h3>
                <div class="card-actions">
                  <a-button v-permission="['btn:user-create']" type="primary" size="small" @click="handleCreate">
                    新建用户
                  </a-button>
                  <a-button v-permission="['btn:user-edit']" size="small" @click="handleEdit" style="margin-left: 8px">
                    编辑
                  </a-button>
                  <a-button v-permission="['btn:user-delete']" size="small" danger @click="handleDelete" style="margin-left: 8px">
                    删除
                  </a-button>
                  <a-button v-permission="['btn:user-export']" size="small" @click="handleExport" style="margin-left: 8px">
                    导出
                  </a-button>
                </div>
              </div>
              <div class="perm-indicator">
                <a-space size="small">
                  <a-tag v-if="hasAny('btn:user-create')" color="green">可新建</a-tag>
                  <a-tag v-else color="default">无新建权限</a-tag>
                  <a-tag v-if="hasAny('btn:user-edit')" color="green">可编辑</a-tag>
                  <a-tag v-else color="default">无编辑权限</a-tag>
                  <a-tag v-if="hasAny('btn:user-delete')" color="green">可删除</a-tag>
                  <a-tag v-else color="default">无删除权限</a-tag>
                  <a-tag v-if="hasAny('btn:user-export')" color="green">可导出</a-tag>
                  <a-tag v-else color="default">无导出权限</a-tag>
                  <a-tag v-if="hasAny('data:user-view-sensitive')" color="orange">可见敏感</a-tag>
                  <a-tag v-else color="default">敏感脱敏</a-tag>
                  <a-tag v-if="hasAny('data:user-view-salary')" color="orange">可见薪资</a-tag>
                  <a-tag v-else color="default">薪资隐藏</a-tag>
                </a-space>
              </div>
              <a-table
                :columns="columns"
                :data-source="users"
                :pagination="false"
                size="small"
                :row-key="(r: UserRecord) => r.id"
                bordered
                style="margin-top: 12px"
              >
                <template #bodyCell="{ column, text }">
                  <template v-if="['phone', 'idCard'].includes(column.key)">
                    <span :style="{ color: text === '****' ? '#fa8c16' : '' }">{{ text }}</span>
                  </template>
                  <template v-if="column.key === 'salary'">
                    <span :style="{ color: text === '***' ? '#ff4d4f' : '' }">{{ text }}</span>
                  </template>
                  <template v-if="column.key === 'action'">
                    <a-button v-permission="['btn:user-edit']" size="small" type="link">编辑</a-button>
                    <a-button
                      v-permission="['btn:user-delete']"
                      size="small"
                      type="link"
                      danger
                    >删除</a-button>
                  </template>
                </template>
              </a-table>
              <div class="table-footer">
                共 {{ users.length }} 条记录
                <span v-if="!dataPermissions.canViewAll && dataPermissions.canViewOwn" style="color: #fa8c16; margin-left: 8px">
                  （仅显示本部门数据）
                </span>
              </div>
            </section>
          </template>

          <!-- 报表页面 -->
          <template v-if="activeMenu === 'report'">
            <section class="admin-card">
              <div class="card-header">
                <h3>📊 数据报表</h3>
                <a-button v-permission="['btn:report-export', 'data:report-view-all']" size="small" @click="handleExportReport">
                  导出报表
                </a-button>
              </div>
              <div class="perm-indicator">
                <a-tag v-if="hasAny('data:report-view-all')" color="green">查看全部部门</a-tag>
                <a-tag v-else-if="hasAny('data:report-view-own')" color="orange">仅本部门</a-tag>
                <a-tag v-else color="default">无报表权限</a-tag>
                <a-tag v-if="hasAny('btn:report-export')" color="green">可导出</a-tag>
                <a-tag v-else color="default">不可导出</a-tag>
              </div>
              <a-table
                :columns="reportColumns"
                :data-source="reportData"
                :pagination="false"
                size="small"
                style="margin-top: 12px"
              >
                <template #bodyCell="{ column, text }">
                  <template v-if="column.key === 'avgSalary'">
                    <span :style="{ color: text === '***' ? '#ff4d4f' : '' }">{{ text }}</span>
                  </template>
                </template>
              </a-table>
            </section>
          </template>

          <!-- 设置页面 -->
          <template v-if="activeMenu === 'settings'">
            <section class="admin-card">
              <div class="card-header">
                <h3>⚙ 系统设置</h3>
                <a-button
                  :disabled="!hasAny('btn:settings-save')"
                  :type="hasAny('btn:settings-save') ? 'primary' : 'default'"
                  size="small"
                  @click="handleSaveSettings"
                >
                  {{ hasAny('btn:settings-save') ? '保存设置' : '保存设置（无权限）' }}
                </a-button>
              </div>
              <div class="perm-indicator">
                <a-tag v-if="hasAny('btn:settings-save')" color="green">可保存</a-tag>
                <a-tag v-else color="default">只读</a-tag>
              </div>
              <div style="padding: 20px; color: #999; text-align: center; font-size: 13px">
                系统设置表单内容（仅当有 <code>btn:settings-save</code> 权限时可操作）
              </div>
            </section>
          </template>

          <!-- 管理员面板 -->
          <template v-if="activeMenu === 'admin'">
            <section class="admin-card">
              <div class="card-header">
                <h3>🔒 管理员面板</h3>
                <span style="font-size: 12px; color: #999">
                  需要 <code>menu:admin</code> 或 <code>admin:full</code> 权限
                </span>
              </div>
              <div class="perm-indicator">
                <a-tag v-if="hasAny('menu:admin', 'admin:full')" color="green">多权限 OR 通过</a-tag>
              </div>
              <div style="padding: 16px">
                <p style="color: #555; font-size: 13px">
                  此面板通过 <strong>多权限 OR 逻辑</strong>控制访问：
                  <code>hasAny('menu:admin', 'admin:full')</code> — 任一满足即可。
                </p>
              </div>
            </section>
          </template>

        </a-spin>
      </main>
    </div>

    <!-- 操作日志 -->
    <footer class="admin-footer">
      <div class="log-header">
        <h4>操作日志</h4>
        <a-button size="small" @click="handleClearLogs">清除</a-button>
      </div>
      <div v-if="logEntries.length === 0" style="color: #999; font-size: 13px; padding: 8px 0">点击上方按钮触发操作</div>
      <div v-for="(l, i) in logEntries" :key="i" class="log-line">{{ l }}</div>
    </footer>
  </div>
</template>

<style scoped>
.admin-layout { max-width: 1100px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; }
.admin-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: #fff; border-bottom: 1px solid #f0f0f0; }
.admin-header h2 { margin: 0; font-size: 18px; color: #1a1a1a; }
.header-right { display: flex; align-items: center; gap: 8px; }
.role-label { font-size: 13px; color: #999; }
.perm-count { font-size: 12px; color: #1677ff; background: #e6f4ff; padding: 2px 8px; border-radius: 10px; }
.admin-body { display: flex; flex: 1; }
.admin-sidebar { width: 200px; padding: 16px; background: #fafafa; border-right: 1px solid #f0f0f0; flex-shrink: 0; }
.admin-sidebar h4 { margin: 0 0 8px; font-size: 12px; color: #999; text-transform: uppercase; }
.nav-item { padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; margin-bottom: 2px; color: #555; transition: all .15s; }
.nav-item:hover { background: #f0f0f0; }
.nav-item.active { background: #e6f4ff; color: #1677ff; font-weight: 600; }
.nav-item.hidden { opacity: .4; cursor: default; font-style: italic; }
.sidebar-section h4 { margin-top: 20px; font-size: 11px; }
.admin-content { flex: 1; padding: 20px; overflow-x: auto; }
.admin-card { background: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.06); margin-bottom: 16px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.card-header h3 { margin: 0; font-size: 16px; }
.card-actions { display: flex; align-items: center; }
.perm-indicator { margin-bottom: 4px; }
.table-footer { font-size: 12px; color: #999; margin-top: 8px; }
.admin-footer { padding: 16px 20px; background: #fafafa; border-top: 1px solid #f0f0f0; }
.log-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.log-header h4 { margin: 0; font-size: 14px; }
.log-line { padding: 4px 0; font-size: 12px; color: #555; font-family: monospace; border-bottom: 1px solid #f5f5f5; }
@media (max-width: 768px) { .admin-body { flex-direction: column; } .admin-sidebar { width: 100%; border-right: none; border-bottom: 1px solid #f0f0f0; } }
</style>
