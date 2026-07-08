<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePermission } from '@/composables/usePermission'

const { currentRole, hasAny, setRole } = usePermission()

const roleOptions = ['admin', 'manager', 'editor', 'viewer']

onMounted(async () => {
  setRole('admin')
})

// ===== 模拟站点模块权限映射 =====
const siteModules = [
  {
    name: 'Vue 3 基础',
    desc: '模板语法、响应式、计算属性等核心知识点',
    perms: ['demo:vue-basics'],
    roles: ['admin', 'manager', 'editor', 'viewer'],
  },
  {
    name: '深入组件',
    desc: '注册、Props、事件、v-model、插槽等',
    perms: ['demo:deep-components'],
    roles: ['admin', 'manager', 'editor'],
  },
  {
    name: '逻辑复用',
    desc: '组合式函数、自定义指令、插件',
    perms: ['demo:logic-reuse'],
    roles: ['admin', 'manager', 'editor'],
  },
  {
    name: '内置组件',
    desc: 'Transition、KeepAlive、Teleport、Suspense',
    perms: ['demo:builtin-components'],
    roles: ['admin', 'manager', 'editor'],
  },
  {
    name: '应用规模化',
    desc: 'SFC、路由、状态管理、测试、SSR',
    perms: ['demo:app-scale'],
    roles: ['admin', 'manager', 'editor'],
  },
  {
    name: 'Vite 学习教程',
    desc: '快速上手、插件系统、构建优化',
    perms: ['demo:vite'],
    roles: ['admin', 'manager', 'editor'],
  },
  {
    name: 'ESLint 学习教程',
    desc: 'Flat Config、Vue/TS 实战、进阶生态',
    perms: ['demo:eslint'],
    roles: ['admin', 'manager', 'editor'],
  },
  {
    name: 'Prettier 学习教程',
    desc: '核心配置、忽略与覆盖、ESLint 集成',
    perms: ['demo:prettier'],
    roles: ['admin', 'manager', 'editor'],
  },
  {
    name: 'TypeScript 学习',
    desc: '基础类型、接口、泛型、工具类型',
    perms: ['demo:typescript'],
    roles: ['admin', 'manager', 'editor', 'viewer'],
  },
  {
    name: '用户管理 CRUD',
    desc: 'Pinia Store、表单校验、批量操作',
    perms: ['demo:user-crud'],
    roles: ['admin', 'manager'],
  },
  {
    name: 'API Demo',
    desc: '请求拦截、响应拦截、错误处理',
    perms: ['demo:api-demo'],
    roles: ['admin', 'manager', 'editor'],
  },
  {
    name: 'Ant Design Vue 学习',
    desc: '核心组件、二次封装、主题定制',
    perms: ['demo:antd'],
    roles: ['admin', 'manager', 'editor'],
  },
  {
    name: 'VueRequest 学习',
    desc: 'useRequest 基础/分页/高级特性',
    perms: ['demo:vue-request'],
    roles: ['admin', 'manager', 'editor'],
  },
  {
    name: 'Vue Router 学习',
    desc: '动态路由、嵌套路由、导航守卫',
    perms: ['demo:vue-router'],
    roles: ['admin', 'manager', 'editor'],
  },
  {
    name: 'Pinia 学习',
    desc: 'Setup Store、State/Getter/Action',
    perms: ['demo:pinia'],
    roles: ['admin', 'manager', 'editor'],
  },
  {
    name: '权限控制学习',
    desc: 'RBAC 模型、指令控制、数据权限 — 本教程',
    perms: ['demo:permission'],
    roles: ['admin', 'manager', 'editor', 'viewer'],
  },
]

const roleDesc: Record<string, string> = {
  admin: '超级管理员 — 全部模块可见',
  manager: '经理 — 核心 + 实战模块',
  editor: '编辑者 — 核心模块',
  viewer: '查看者 — 仅基础模块',
}

// 可见模块
const visibleModules = computed(() => siteModules.filter((m) => hasAny(...m.perms)))

// ===== 代码块内容 =====
const permsStoreCode = `// src/composables/usePermission.ts
import { ref } from 'vue'

// 模块级变量 = 全局单例
const currentRole = ref('admin')
const permissions = ref<string[]>([])

export function usePermission() {
  async function setRole(role: string) {
    const data = await getUserPermissions(role)
    permissions.value = data.permissions
  }
  function hasAny(...perms: string[]) {
    return perms.some(p => permissions.value.includes(p))
  }
  return { currentRole, permissions, setRole, hasAny }
}`

const homeViewCode = `// src/views/HomeView.vue
const demos = [
  {
    path: '/vue-basics',
    title: 'Vue 3 基础',
    requiredPermissions: ['demo:vue-basics'], // ← 绑定权限
  },
  // ... 更多卡片
]

// 权限过滤
const permittedDemos = computed(() =>
  demos.filter(d => hasAny(...d.requiredPermissions))
)`

const routerGuardCode = `// src/router/index.ts
router.beforeEach((to, from, next) => {
  const { hasAny } = usePermission()
  const perms = to.meta.requiredPermissions as string[]
  if (perms?.length && !hasAny(...perms)) {
    next('/403')   // 无权限 → 403
  } else {
    next()
  }
})`

const globalDirectiveCode = `// main.ts — 注册全局指令
app.directive('permission', {
  mounted(el, binding) {
    const { hasAny } = usePermission()
    const perms = Array.isArray(binding.value) ? binding.value : [binding.value]
    if (!hasAny(...perms)) {
      el.parentNode?.removeChild(el) // 无权限 → 移除 DOM
    }
  }
})
// 使用：<a-button v-permission="'btn:delete'">删除</a-button>`

const sidebarCode = `// 菜单从后端按角色过滤
const { data } = await getMenusByRole(currentRole.value)
// data.menus 已经是过滤后的可见菜单
sidebarMenus.value = data.menus`

const serverDefenseCode = `// 后端接口：不信任前端传入的权限标记
// 行级过滤：根据角色权限添加 WHERE 条件
// 字段脱敏：根据角色权限决定是否返回敏感字段
// 前端权限只是 UI 层面的便利，不是安全边界

if (!canViewAll && canViewOwn) {
  rows = rows.filter(r => r.dept === currentUser.dept)
}
return rows.map(r => ({
  ...r,
  phone: canViewSensitive ? r.phone : '****',
  salary: canViewSalary ? r.salary : '***',
}))`

// 日志
const log = ref<string[]>([])
function logMsg(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
  if (log.value.length > 30) log.value.shift()
}
</script>

<template>
  <div class="stage6">
    <header class="page-header">
      <h1>Stage 6：站点级权限整合</h1>
      <p class="subtitle">将权限控制应用到整个站点：导航菜单、首页示例卡片、路由守卫、全局指令 — 全维度覆盖。</p>
    </header>

    <!-- 角色切换 -->
    <section class="card role-section">
      <h2>切换角色（全局生效）</h2>
      <div class="role-tabs">
        <button
          v-for="role in roleOptions"
          :key="role"
          :class="['role-btn', { active: currentRole === role }]"
          @click="setRole(role); logMsg(`切换角色为 ${role}`)"
        >
          {{ role }}
        </button>
      </div>
      <div class="role-info" v-if="roleDesc[currentRole]">
        <span class="role-badge">{{ currentRole }}</span>
        <span>{{ roleDesc[currentRole] }}</span>
      </div>
    </section>

    <!-- 站点模块权限矩阵 -->
    <section class="card">
      <h2>站点模块权限矩阵</h2>
      <p class="card-tip">
        当前角色 <strong>{{ currentRole }}</strong> 可访问 <strong>{{ visibleModules.length }}</strong> /
        {{ siteModules.length }} 个模块
      </p>
      <a-table
        :columns="[
          { title: '模块名称', dataIndex: 'name', key: 'name', width: 180 },
          { title: '描述', dataIndex: 'desc', key: 'desc' },
          { title: '权限码', dataIndex: 'permissions', key: 'permissions' },
          { title: '可访问角色', dataIndex: 'roles', key: 'roles' },
          { title: '当前状态', dataIndex: 'status', key: 'status', width: 120 },
        ]"
        :data-source="
          siteModules.map((m) => ({
            key: m.name,
            name: m.name,
            desc: m.desc,
            permissions: m.perms.join(', '),
            roles: m.roles.join(' / '),
            status: hasAny(...m.perms) ? '✅ 可见' : '❌ 隐藏',
            visible: hasAny(...m.perms),
          }))
        "
        :pagination="false"
        size="small"
        :row-class-name="(r: any) => (r.visible ? '' : 'row-hidden')"
      />
    </section>

    <!-- 集成关键点 -->
    <section class="card">
      <h2>站点级权限整合 6 大关键点</h2>

      <div class="key-point">
        <strong>1. 全局权限状态（usePermission Composable）</strong>
        <p>创建全局单例 composable，所有组件共享同一个权限状态。角色切换后，所有页面同步响应。</p>
        <pre class="code-block">{{ permsStoreCode }}</pre>
      </div>

      <div class="key-point">
        <strong>2. 首页示例卡片权限控制</strong>
        <p>每个 HomeView 卡片绑定 <code>requiredPermissions</code>，根据当前角色动态过滤可见卡片。</p>
        <pre class="code-block">{{ homeViewCode }}</pre>
      </div>

      <div class="key-point">
        <strong>3. 路由守卫（router.beforeEach）</strong>
        <p>在导航守卫中检查目标路由的权限，无权限则重定向到 403 页面或首页。</p>
        <pre class="code-block">{{ routerGuardCode }}</pre>
      </div>

      <div class="key-point">
        <strong>4. 全局 v-permission 指令</strong>
        <p>
          注册为 Vue 全局指令，任意页面/组件直接使用 <code>v-permission="'btn:delete'"</code> 或
          <code>v-permission="['menu:admin', 'admin:full']"</code>。
        </p>
        <pre class="code-block">{{ globalDirectiveCode }}</pre>
      </div>

      <div class="key-point">
        <strong>5. 侧边栏菜单过滤</strong>
        <p>从后端获取菜单列表时携带角色参数，服务端根据权限过滤后返回仅可见菜单。</p>
        <pre class="code-block">{{ sidebarCode }}</pre>
      </div>

      <div class="key-point">
        <strong>6. 数据请求防线</strong>
        <p>后端作为最终防线，同样检查权限进行行级过滤和字段脱敏。前端不能依赖隐藏按钮做安全。</p>
        <pre class="code-block">{{ serverDefenseCode }}</pre>
      </div>
    </section>

    <!-- 操作日志 -->
    <section class="card">
      <h2>操作日志</h2>
      <div class="log-box">
        <p v-for="(msg, i) in log" :key="i" class="log-line">{{ msg }}</p>
        <p v-if="log.length === 0" class="log-empty">暂无日志</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage6 {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}
.page-header {
  text-align: center;
  margin-bottom: 32px;
}
.page-header h1 {
  font-size: 28px;
  color: #1a1a1a;
  margin: 0 0 8px;
}
.subtitle {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.card h2 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
}
.card-tip {
  margin: 0 0 12px;
  font-size: 13px;
  color: #666;
  padding: 8px 12px;
  background: #f6ffed;
  border-radius: 6px;
}

/* 角色切换 */
.role-section {
  padding-bottom: 20px;
}
.role-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.role-btn {
  padding: 8px 24px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: capitalize;
}
.role-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
}
.role-btn.active {
  background: #1677ff;
  color: #fff;
  border-color: #1677ff;
}
.role-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}
.role-badge {
  padding: 2px 12px;
  background: #e6f4ff;
  color: #1677ff;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
}

/* 表格 */
:deep(.row-hidden) {
  opacity: 0.35;
  text-decoration: line-through;
}

/* 关键点 */
.key-point {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f5f5f5;
}
.key-point:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}
.key-point strong {
  display: block;
  font-size: 15px;
  color: #1a1a1a;
  margin-bottom: 8px;
}
.key-point p {
  font-size: 13px;
  color: #666;
  margin: 0 0 10px;
  line-height: 1.6;
}
.key-point p code {
  background: #f5f5f5;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
}
.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 14px 16px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.8;
  overflow-x: auto;
  white-space: pre;
  margin: 0;
}

/* 日志 */
.log-box {
  max-height: 200px;
  overflow-y: auto;
  background: #fafafa;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
}
.log-line {
  margin: 0 0 2px;
  color: #555;
  font-family: monospace;
}
.log-empty {
  color: #ccc;
  text-align: center;
  margin: 10px 0;
}

@media (max-width: 768px) {
  .stage6 {
    padding: 16px;
  }
  .role-tabs {
    flex-wrap: wrap;
  }
  .role-btn {
    padding: 6px 16px;
    font-size: 13px;
  }
}
</style>
