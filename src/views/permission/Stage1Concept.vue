<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserPermissions, getAllPermissions } from '@/api/modules/permission'
import type { PermissionInfo, PermissionGroup } from '@/api/modules/permission'

const currentRole = ref('editor')
const permissionInfo = ref<PermissionInfo | null>(null)
const allPermissions = ref<PermissionGroup[]>([])
const loading = ref(false)

const roles = [
  { key: 'admin', label: '超级管理员', desc: '拥有所有权限' },
  { key: 'manager', label: '部门经理', desc: '用户管理 + 报表 + 创建/导出' },
  { key: 'editor', label: '内容编辑', desc: '用户管理只读 + 报表编辑' },
  { key: 'viewer', label: '访客', desc: '仅查看报表' },
]

async function fetchPermissions(role: string) {
  loading.value = true
  try {
    const [info, all] = await Promise.all([
      getUserPermissions(role),
      getAllPermissions(),
    ])
    permissionInfo.value = info
    allPermissions.value = all
  } finally {
    loading.value = false
  }
}

function switchRole(role: string) {
  currentRole.value = role
  fetchPermissions(role)
}

onMounted(() => {
  fetchPermissions(currentRole.value)
})
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>📐 Stage 1：权限模型与概念</h1>
      <p>RBAC 模型、权限码设计规范、后端获取权限的标准流程</p>
    </header>

    <!-- RBAC 模型介绍 -->
    <section class="card">
      <h2>什么是 RBAC？</h2>
      <p class="desc">
        <strong>RBAC</strong>（Role-Based Access Control）是基于角色的访问控制，核心理念是：
        <em>用户 ↔ 角色 ↔ 权限</em>，用户不直接绑定权限，而是通过角色间接获得。
      </p>
      <div class="rbac-diagram">
        <div class="rbac-node">
          <strong>用户</strong>
          <span>张三、李四</span>
        </div>
        <span class="rbac-arrow">→</span>
        <div class="rbac-node">
          <strong>角色</strong>
          <span>admin / manager / editor / viewer</span>
        </div>
        <span class="rbac-arrow">→</span>
        <div class="rbac-node">
          <strong>权限</strong>
          <span>menu:user / btn:create / data:salary</span>
        </div>
      </div>
      <div class="tip-box">
        <strong>优势：</strong>角色变动时只改角色-权限映射，不需要逐个用户修改；新人入职只需分配角色即可。
      </div>
    </section>

    <!-- 权限码设计 -->
    <section class="card">
      <h2>权限码命名规范</h2>
      <p class="desc">
        采用 <code>类型:模块:操作</code> 三段式语义化命名，便于理解和维护。
      </p>
      <a-table
        :columns="[
          { title: '前缀', dataIndex: 'prefix', key: 'prefix' },
          { title: '含义', dataIndex: 'meaning', key: 'meaning' },
          { title: '示例', dataIndex: 'example', key: 'example' },
        ]"
        :data-source="[
          { prefix: 'menu:', meaning: '菜单/导航权限', example: 'menu:user-manage, menu:report' },
          { prefix: 'btn:', meaning: '按钮操作权限', example: 'btn:user-create, btn:user-delete' },
          { prefix: 'data:', meaning: '数据级权限', example: 'data:user-view-sensitive, data:report-view-own' },
          { prefix: 'admin:', meaning: '超级管理员', example: 'admin:full' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- 角色切换 + 权限加载 -->
    <section class="card">
      <h2>后端获取权限流程</h2>
      <p class="desc">
        前端登录成功后，调用 <code>GET /api/permission/user-permissions?role=xxx</code> 获取当前用户的权限列表，存入状态管理中。
      </p>
      <div class="flow">
        <div class="flow-step"><span class="step-num">1</span><strong>登录</strong><span>JWT/OAuth</span></div>
        <span class="flow-arrow">→</span>
        <div class="flow-step"><span class="step-num">2</span><strong>获取权限</strong><span>API 返回权限数组</span></div>
        <span class="flow-arrow">→</span>
        <div class="flow-step"><span class="step-num">3</span><strong>存入 Store</strong><span>全局状态、持久化</span></div>
        <span class="flow-arrow">→</span>
        <div class="flow-step"><span class="step-num">4</span><strong>指令/组件</strong><span>读取权限控制 UI</span></div>
      </div>
    </section>

    <!-- 交互演示 -->
    <section class="card">
      <h2>交互演示：切换角色查看权限</h2>
      <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px">
        <a-button
          v-for="r in roles"
          :key="r.key"
          :type="currentRole === r.key ? 'primary' : 'default'"
          @click="switchRole(r.key)"
        >
          {{ r.label }}
        </a-button>
      </div>

      <a-spin :spinning="loading">
        <div v-if="permissionInfo" class="perm-result">
          <div class="perm-info">
            <strong>当前角色：</strong><a-tag color="blue">{{ permissionInfo.role }}</a-tag>
            <strong style="margin-left: 16px">用户名：</strong>{{ permissionInfo.username }}
            <strong style="margin-left: 16px">权限数：</strong>{{ permissionInfo.permissions.length }}
          </div>

          <div v-for="g in allPermissions" :key="g.group" style="margin-top: 16px">
            <h4 style="margin: 0 0 8px; font-size: 14px; color: #555">{{ g.group }}</h4>
            <div style="display: flex; gap: 8px; flex-wrap: wrap">
              <a-tag
                v-for="perm in g.items"
                :key="perm"
                :color="permissionInfo.permissions.includes(perm) ? 'green' : 'default'"
              >
                {{ perm }} {{ permissionInfo.permissions.includes(perm) ? '✓' : '✗' }}
              </a-tag>
            </div>
          </div>
        </div>
      </a-spin>
    </section>

    <!-- 各角色的权限说明 -->
    <section class="card">
      <h2>本教程的角色定义</h2>
      <div v-for="r in roles" :key="r.key" class="role-item">
        <strong>{{ r.label }}</strong> ({{ r.key }})：{{ r.desc }}
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page { max-width: 960px; margin: 0 auto; padding: 24px; }
.page-header { text-align: center; margin-bottom: 30px; }
.page-header h1 { font-size: 24px; color: #1a1a1a; margin: 0 0 6px; }
.page-header p { color: #999; font-size: 14px; }
.card { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.card h2 { margin: 0 0 12px; font-size: 18px; color: #333; }
.card h4 { margin: 0 0 6px; font-size: 14px; color: #555; }
.desc { color: #555; font-size: 14px; line-height: 1.8; margin: 0 0 12px; }
.desc code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 13px; }
.rbac-diagram { display: flex; align-items: center; gap: 12px; margin: 16px 0; flex-wrap: wrap; }
.rbac-node { display: flex; flex-direction: column; gap: 4px; padding: 14px 16px; background: #fafafa; border-radius: 8px; border: 1px solid #eee; text-align: center; min-width: 120px; }
.rbac-node strong { font-size: 14px; }
.rbac-node span { font-size: 11px; color: #999; }
.rbac-arrow { font-size: 20px; color: #bbb; }
.tip-box { background: #e6f4ff; border-left: 3px solid #1677ff; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #333; margin-top: 12px; }
.flow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.flow-step { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px; background: #fafafa; border-radius: 8px; flex: 1; min-width: 80px; text-align: center; }
.step-num { width: 26px; height: 26px; border-radius: 50%; background: #1677ff; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; }
.flow-step strong { font-size: 12px; }
.flow-step span { font-size: 11px; color: #999; }
.flow-arrow { font-size: 18px; color: #bbb; }
.perm-result { margin-top: 8px; }
.perm-info { font-size: 13px; color: #555; margin-bottom: 8px; display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
.role-item { padding: 8px 0; border-bottom: 1px solid #f5f5f5; font-size: 13px; color: #555; }
.role-item:last-child { border-bottom: none; }
.role-item strong { color: #333; }
@media (max-width: 768px) {
  .rbac-diagram, .flow { flex-direction: column; }
  .rbac-arrow, .flow-arrow { transform: rotate(90deg); }
}
</style>
