<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserPermissions, getUsersByRole } from '@/api/modules/permission'
import type { UserRecord, UserListResult } from '@/api/modules/permission'

const currentRole = ref('editor')
const permissions = ref<string[]>([])
const users = ref<UserRecord[]>([])
const dataPermissions = ref<UserListResult['permissions']>({
  canViewAll: false,
  canViewOwn: false,
  canViewSensitive: false,
  canViewSalary: false,
})
const loading = ref(false)

const roles = [
  { key: 'admin', label: '超级管理员' },
  { key: 'manager', label: '部门经理' },
  { key: 'editor', label: '内容编辑' },
  { key: 'viewer', label: '访客' },
]

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '部门', dataIndex: 'dept', key: 'dept' },
  { title: '手机号', dataIndex: 'phone', key: 'phone' },
  { title: '身份证', dataIndex: 'idCard', key: 'idCard' },
  { title: '薪资', dataIndex: 'salary', key: 'salary' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
]

async function fetchData(role: string) {
  loading.value = true
  try {
    const [permInfo, userData] = await Promise.all([getUserPermissions(role), getUsersByRole(role)])
    permissions.value = permInfo.permissions
    users.value = userData.list
    dataPermissions.value = userData.permissions
  } finally {
    loading.value = false
  }
}

function switchRole(role: string) {
  currentRole.value = role
  fetchData(role)
}

onMounted(() => fetchData(currentRole.value))
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>📊 Stage 3：数据权限控制</h1>
      <p>行级过滤 + 字段脱敏，实现细粒度数据控制</p>
    </header>

    <!-- 角色切换 -->
    <section class="card">
      <h2>切换角色查看数据变化</h2>
      <a-space>
        <a-button
          v-for="r in roles"
          :key="r.key"
          :type="currentRole === r.key ? 'primary' : 'default'"
          @click="switchRole(r.key)"
          >{{ r.label }}</a-button
        >
      </a-space>
    </section>

    <!-- 实际数据权限状态 -->
    <section class="card">
      <h2>当前数据权限状态</h2>
      <div class="perm-status-grid">
        <div class="perm-status" :class="{ active: dataPermissions.canViewAll }">
          <strong>全部数据</strong>
          <span>{{ dataPermissions.canViewAll ? '✓ 可看全部' : '✗ 不可看全部' }}</span>
        </div>
        <div class="perm-status" :class="{ active: dataPermissions.canViewOwn }">
          <strong>本部门数据</strong>
          <span>{{ dataPermissions.canViewOwn ? '✓ 可看本部门' : '✗ 不可看本部门' }}</span>
        </div>
        <div class="perm-status" :class="{ active: dataPermissions.canViewSensitive }">
          <strong>敏感字段</strong>
          <span>{{ dataPermissions.canViewSensitive ? '✓ 可见手机/身份证' : '✗ 已脱敏' }}</span>
        </div>
        <div class="perm-status" :class="{ active: dataPermissions.canViewSalary }">
          <strong>薪资数据</strong>
          <span>{{ dataPermissions.canViewSalary ? '✓ 可见薪资' : '✗ 已隐藏' }}</span>
        </div>
      </div>
    </section>

    <!-- 用户数据表格 -->
    <section class="card">
      <h2>用户数据表（后端已做权限过滤）</h2>
      <p class="desc">
        后端根据当前角色的数据权限自动过滤：
        <strong>行级</strong>（仅返回有权限的行）、 <strong>字段级</strong>（敏感字段脱敏为 <code>****</code> 或
        <code>***</code>）。 共 <strong>{{ users.length }}</strong> 条记录。
      </p>
      <a-spin :spinning="loading">
        <a-table
          :columns="columns"
          :data-source="users"
          :pagination="false"
          size="small"
          :row-key="(r: UserRecord) => r.id"
          bordered
        >
          <template #bodyCell="{ column, text }">
            <template v-if="['phone', 'idCard'].includes(column.key)">
              <span :class="{ masked: text === '****' }">{{ text }}</span>
              <a-tag v-if="text === '****'" color="orange" style="margin-left: 4px; font-size: 10px">脱敏</a-tag>
            </template>
            <template v-else-if="column.key === 'salary'">
              <span :class="{ masked: text === '***' }">{{ text }}</span>
              <a-tag v-if="text === '***'" color="red" style="margin-left: 4px; font-size: 10px">隐藏</a-tag>
            </template>
          </template>
        </a-table>
      </a-spin>
    </section>

    <!-- 数据权限方案对比 -->
    <section class="card">
      <h2>数据权限实现方案对比</h2>
      <a-table
        :columns="[
          { title: '方案', dataIndex: 'plan', key: 'plan' },
          { title: '原理', dataIndex: 'principle', key: 'principle' },
          { title: '安全性', dataIndex: 'safety', key: 'safety' },
          { title: '性能', dataIndex: 'perf', key: 'perf' },
          { title: '推荐场景', dataIndex: 'scene', key: 'scene' },
        ]"
        :data-source="[
          {
            plan: '后端过滤+脱敏',
            principle: '后端在 SQL/ORM 层面加 where 条件，返回脱敏数据',
            safety: '⭐⭐⭐ 最高',
            perf: '⭐⭐⭐',
            scene: '生产环境（推荐）',
          },
          {
            plan: '前端 v-if 过滤',
            principle: '后端返回全量，前端根据权限 show/hide',
            safety: '⭐ 不安全',
            perf: '⭐',
            scene: 'Demo/原型（不推荐）',
          },
          {
            plan: '后端分权限接口',
            principle: '不同接口返回不同字段集',
            safety: '⭐⭐⭐',
            perf: '⭐⭐',
            scene: '敏感系统（金融/医疗）',
          },
        ]"
        :pagination="false"
        size="small"
      />
      <div class="tip-box" style="margin-top: 12px">
        <strong>最佳实践：</strong>敏感数据始终在后端做权限校验，前端只是辅助展示。不能仅依赖前端 v-if 来保护数据安全。
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
.perm-status-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.perm-status {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #f0f0f0;
}
.perm-status.active {
  background: #f6ffed;
  border-color: #b7eb8f;
}
.perm-status strong {
  font-size: 13px;
}
.perm-status span {
  font-size: 12px;
  color: #999;
}
.perm-status.active span {
  color: #52c41a;
}
.masked {
  color: #fa8c16;
  font-style: italic;
}
.tip-box {
  background: #fffbe6;
  border-left: 3px solid #faad14;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
}
@media (max-width: 768px) {
  .perm-status-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
