<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useUserCrud } from './useUserCrud'

const store = useUserStore()
const {
  searchKeyword,
  sortField,
  sortOrder,
  showDialog,
  dialogMode,
  formData,
  formErrors,
  selectedIds,
  filteredUsers,
  isFormValid,
  isAllSelected,
  openCreateDialog,
  openEditDialog,
  closeDialog,
  submitForm,
  deleteUser,
  batchDelete,
  toggleSort,
  toggleSelect,
  toggleSelectAll,
  exportCSV,
} = useUserCrud()

/** 排序指示器 */
function sortIcon(field: string): string {
  if (sortField.value !== field) return '↕'
  return sortOrder.value === 'asc' ? '↑' : '↓'
}

/** 确认删除 */
function confirmDelete(id: number, name: string) {
  if (confirm(`确定要删除用户「${name}」吗？此操作不可撤销。`)) {
    deleteUser(id)
  }
}

/** 确认批量删除 */
function confirmBatchDelete() {
  if (selectedIds.value.size === 0) return
  if (confirm(`确定要删除选中的 ${selectedIds.value.size} 个用户吗？此操作不可撤销。`)) {
    batchDelete()
  }
}

/** 角色标签颜色 */
function roleBadgeClass(role: string): string {
  return role === 'admin' ? 'role-admin' : role === 'editor' ? 'role-editor' : 'role-viewer'
}
function roleLabel(role: string): string {
  return role === 'admin' ? '管理员' : role === 'editor' ? '编辑者' : '观察者'
}

/** 状态标签 */
function statusLabel(status: string): string {
  return status === 'active' ? '启用' : '禁用'
}
function statusBadgeClass(status: string): string {
  return status === 'active' ? 'status-active' : 'status-inactive'
}
</script>

<template>
  <div class="crud-page">
    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-value">{{ store.totalCount }}</span>
        <span class="stat-label">用户总数</span>
      </div>
      <div class="stat-card stat-active">
        <span class="stat-value">{{ store.activeCount }}</span>
        <span class="stat-label">启用</span>
      </div>
      <div class="stat-card stat-inactive">
        <span class="stat-value">{{ store.inactiveCount }}</span>
        <span class="stat-label">禁用</span>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <input v-model.trim="searchKeyword" type="text" class="search-input" placeholder="搜索姓名、邮箱、角色..." />
        <span class="search-result" v-if="searchKeyword"> 找到 {{ filteredUsers.length }} 条结果 </span>
      </div>
      <div class="toolbar-right">
        <button v-if="selectedIds.size > 0" class="btn btn-danger-outline" @click="confirmBatchDelete">
          删除选中 ({{ selectedIds.size }})
        </button>
        <button class="btn btn-outline" @click="exportCSV">导出 CSV</button>
        <button class="btn btn-primary" @click="openCreateDialog">+ 新增用户</button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-check">
              <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
            </th>
            <th class="col-id sortable" @click="toggleSort('id')">
              ID <span class="sort-icon">{{ sortIcon('id') }}</span>
            </th>
            <th class="sortable" @click="toggleSort('name')">
              姓名 <span class="sort-icon">{{ sortIcon('name') }}</span>
            </th>
            <th class="sortable" @click="toggleSort('email')">
              邮箱 <span class="sort-icon">{{ sortIcon('email') }}</span>
            </th>
            <th class="sortable" @click="toggleSort('role')">
              角色 <span class="sort-icon">{{ sortIcon('role') }}</span>
            </th>
            <th class="sortable" @click="toggleSort('status')">
              状态 <span class="sort-icon">{{ sortIcon('status') }}</span>
            </th>
            <th class="sortable" @click="toggleSort('createdAt')">
              创建时间 <span class="sort-icon">{{ sortIcon('createdAt') }}</span>
            </th>
            <th class="col-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" :class="{ 'row-selected': selectedIds.has(user.id) }">
            <td>
              <input type="checkbox" :checked="selectedIds.has(user.id)" @change="toggleSelect(user.id)" />
            </td>
            <td class="col-id">{{ user.id }}</td>
            <td class="user-name">{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="badge" :class="roleBadgeClass(user.role)">
                {{ roleLabel(user.role) }}
              </span>
            </td>
            <td>
              <button class="status-toggle" :class="statusBadgeClass(user.status)" @click="store.toggleStatus(user.id)">
                {{ statusLabel(user.status) }}
              </button>
            </td>
            <td>{{ user.createdAt }}</td>
            <td class="action-btns">
              <button class="btn-action btn-edit" @click="openEditDialog(user)">编辑</button>
              <button class="btn-action btn-delete" @click="confirmDelete(user.id, user.name)">删除</button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="8" class="empty-cell">
              <p v-if="searchKeyword">未找到匹配 "{{ searchKeyword }}" 的用户</p>
              <p v-else>暂无用户数据，点击「新增用户」开始</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 弹窗遮罩 -->
    <Teleport to="body">
      <Transition name="dialog">
        <div v-if="showDialog" class="dialog-overlay" @click.self="closeDialog">
          <div class="dialog-panel">
            <div class="dialog-header">
              <h3>{{ dialogMode === 'create' ? '新增用户' : '编辑用户' }}</h3>
              <button class="dialog-close" @click="closeDialog">&times;</button>
            </div>

            <form class="dialog-body" @submit.prevent="submitForm">
              <!-- 姓名 -->
              <div class="form-group">
                <label for="user-name">姓名 <span class="required">*</span></label>
                <input
                  id="user-name"
                  v-model="formData.name"
                  type="text"
                  placeholder="请输入姓名（至少 2 个字符）"
                  :class="{ 'input-error': formErrors.name }"
                />
                <p v-if="formErrors.name" class="error-text">{{ formErrors.name }}</p>
              </div>

              <!-- 邮箱 -->
              <div class="form-group">
                <label for="user-email">邮箱 <span class="required">*</span></label>
                <input
                  id="user-email"
                  v-model="formData.email"
                  type="email"
                  placeholder="请输入邮箱"
                  :class="{ 'input-error': formErrors.email }"
                />
                <p v-if="formErrors.email" class="error-text">{{ formErrors.email }}</p>
              </div>

              <!-- 角色 -->
              <div class="form-group">
                <label for="user-role">角色</label>
                <select id="user-role" v-model="formData.role" class="form-select">
                  <option value="admin">管理员</option>
                  <option value="editor">编辑者</option>
                  <option value="viewer">观察者</option>
                </select>
              </div>

              <!-- 状态 -->
              <div class="form-group">
                <label>状态</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input type="radio" v-model="formData.status" value="active" />
                    启用
                  </label>
                  <label class="radio-label">
                    <input type="radio" v-model="formData.status" value="inactive" />
                    禁用
                  </label>
                </div>
              </div>

              <div class="dialog-footer">
                <button type="button" class="btn btn-outline" @click="closeDialog">取消</button>
                <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
                  {{ dialogMode === 'create' ? '创建' : '保存' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ===== 页面布局 ===== */
.crud-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px;
}

/* ===== 统计卡片 ===== */
.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 18px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-left: 4px solid #4096ff;
}

.stat-active {
  border-left-color: #52c41a;
}

.stat-inactive {
  border-left-color: #ff4d4f;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.stat-label {
  font-size: 13px;
  color: #888;
}

/* ===== 工具栏 ===== */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 260px;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #4096ff;
  box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.15);
}

.search-result {
  font-size: 13px;
  color: #888;
  white-space: nowrap;
}

.toolbar-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ===== 按钮系统 ===== */
.btn {
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #4096ff;
  color: #fff;
  border-color: #4096ff;
}

.btn-primary:hover:not(:disabled) {
  background: #1677ff;
  border-color: #1677ff;
}

.btn-outline {
  background: #fff;
  color: #555;
  border-color: #d9d9d9;
}

.btn-outline:hover {
  color: #4096ff;
  border-color: #4096ff;
}

.btn-danger-outline {
  background: #fff;
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.btn-danger-outline:hover {
  background: #fff1f0;
}

.btn-action {
  padding: 4px 10px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  color: #4096ff;
  background: #e6f4ff;
}

.btn-edit:hover {
  background: #bae0ff;
}

.btn-delete {
  color: #ff4d4f;
  background: #fff1f0;
}

.btn-delete:hover {
  background: #ffccc7;
}

/* ===== 表格 ===== */
.table-wrapper {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table thead {
  background: #fafafa;
  border-bottom: 2px solid #f0f0f0;
}

.data-table th {
  padding: 12px 14px;
  text-align: left;
  font-weight: 600;
  color: #555;
  white-space: nowrap;
  user-select: none;
}

.data-table th.sortable {
  cursor: pointer;
}

.data-table th.sortable:hover {
  color: #4096ff;
}

.sort-icon {
  font-size: 12px;
  color: #bbb;
  margin-left: 2px;
}

.data-table td {
  padding: 12px 14px;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
}

.data-table tbody tr:hover {
  background: #fafafa;
}

.data-table tbody tr.row-selected {
  background: #e6f4ff;
}

.col-check {
  width: 40px;
}

.col-id {
  width: 60px;
  color: #888;
  font-variant-numeric: tabular-nums;
}

.col-actions {
  width: 140px;
}

.user-name {
  font-weight: 500;
}

.action-btns {
  display: flex;
  gap: 6px;
}

.empty-cell {
  text-align: center;
  padding: 48px 20px !important;
  color: #999;
}

.empty-cell p {
  margin: 0;
}

/* ===== 徽章 ===== */
.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.role-admin {
  background: #fff7e6;
  color: #d46b08;
  border: 1px solid #ffd591;
}

.role-editor {
  background: #e6f4ff;
  color: #1677ff;
  border: 1px solid #91caff;
}

.role-viewer {
  background: #f6ffed;
  color: #389e0d;
  border: 1px solid #b7eb8f;
}

/* ===== 状态切换按钮 ===== */
.status-toggle {
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.status-active {
  background: #f6ffed;
  color: #389e0d;
  border-color: #b7eb8f;
}

.status-active:hover {
  background: #d9f7be;
}

.status-inactive {
  background: #fff1f0;
  color: #cf1322;
  border-color: #ffa39e;
}

.status-inactive:hover {
  background: #ffccc7;
}

/* ===== 弹窗 ===== */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-panel {
  background: #fff;
  border-radius: 10px;
  width: 460px;
  max-width: 90vw;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.dialog-header h3 {
  margin: 0;
  font-size: 17px;
  color: #1a1a1a;
}

.dialog-close {
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  font-size: 22px;
  color: #999;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.dialog-close:hover {
  background: #f5f5f5;
  color: #333;
}

.dialog-body {
  padding: 20px 24px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* ===== 表单 ===== */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.required {
  color: #ff4d4f;
}

.form-group input[type='text'],
.form-group input[type='email'],
.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-select:focus {
  outline: none;
  border-color: #4096ff;
  box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.15);
}

.input-error {
  border-color: #ff4d4f !important;
}

.input-error:focus {
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.15) !important;
}

.error-text {
  margin: 4px 0 0;
  font-size: 12px;
  color: #ff4d4f;
}

.radio-group {
  display: flex;
  gap: 20px;
  padding-top: 4px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  cursor: pointer;
  color: #555;
}

.radio-label input[type='radio'] {
  accent-color: #4096ff;
}

.form-select {
  background: #fff;
  cursor: pointer;
}

/* ===== 弹窗过渡动画 ===== */
.dialog-enter-active {
  transition: all 0.25s ease;
}

.dialog-leave-active {
  transition: all 0.2s ease;
}

.dialog-enter-from {
  opacity: 0;
}

.dialog-enter-from .dialog-panel {
  transform: scale(0.92);
}

.dialog-leave-to {
  opacity: 0;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .stats-row {
    flex-direction: column;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left {
    width: 100%;
  }

  .search-input {
    flex: 1;
  }

  .toolbar-right {
    justify-content: flex-start;
  }

  .data-table th,
  .data-table td {
    padding: 8px 10px;
    font-size: 13px;
  }
}
</style>
