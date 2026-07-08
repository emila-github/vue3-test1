<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { shallowRef, computed, onMounted } from 'vue'
import { usePermission } from '@/composables/usePermission'

const { currentRole, hasAny, setRole, loadPermissions } = usePermission()

interface DemoItem {
  path: string
  title: string
  desc: string
  color: string
  icon: string
  tags: string[]
  requiredPermissions: string[]
}

const demos: DemoItem[] = [
  // ══════════════════════ 第一层：基础入门 ══════════════════════
  {
    path: '/vue-basics',
    title: 'Vue 3 基础',
    desc: '模板语法、响应式、计算属性、类与样式、条件/列表渲染、事件处理、表单绑定、侦听器、模板引用、组件基础、生命周期',
    color: '#1890ff',
    icon: 'V',
    tags: ['基础'],
    requiredPermissions: ['demo:vue-basics'],
  },
  {
    path: '/typescript-demo',
    title: 'TypeScript 学习',
    desc: '基础类型、接口、泛型、类、枚举、工具类型、类型守卫',
    color: '#3178c6',
    icon: 'TS',
    tags: ['基础', '进阶'],
    requiredPermissions: ['demo:typescript'],
  },
  // ══════════════════════ 第二层：核心机制 ══════════════════════
  {
    path: '/reactivity-deep',
    title: '响应式系统深入',
    desc: 'ref/reactive API 家族、computed/watch 进阶、effectScope、customRef、性能优化 — 5 阶段彻底掌握 Vue 3 响应式',
    color: '#1890ff',
    icon: '⚛',
    tags: ['核心', '进阶'],
    requiredPermissions: ['demo:reactivity-deep'],
  },
  {
    path: '/deep-components',
    title: '深入组件',
    desc: '注册、Props、事件、v-model、透传、插槽、依赖注入、异步组件',
    color: '#cf1322',
    icon: '◆',
    tags: ['进阶'],
    requiredPermissions: ['demo:deep-components'],
  },
  {
    path: '/builtin-components',
    title: '内置组件',
    desc: 'Transition、TransitionGroup、KeepAlive、Teleport、Suspense',
    color: '#13c2c2',
    icon: '⊞',
    tags: ['进阶'],
    requiredPermissions: ['demo:builtin-components'],
  },
  {
    path: '/logic-reuse',
    title: '逻辑复用',
    desc: '组合式函数、自定义指令、插件',
    color: '#597ef7',
    icon: '⚙',
    tags: ['进阶'],
    requiredPermissions: ['demo:logic-reuse'],
  },
  // ══════════════════════ 第三层：路由与状态管理 ══════════════════════
  {
    path: '/vue-router',
    title: 'Vue Router 5.x 学习',
    desc: '快速上手、动态路由、嵌套路由、导航守卫、进阶特性 — Composition API 风格',
    color: '#e74c3c',
    icon: '🗺',
    tags: ['核心', '实战'],
    requiredPermissions: ['demo:vue-router'],
  },
  {
    path: '/pinia',
    title: 'Pinia 状态管理 v3',
    desc: 'Setup Store、State/Getter/Action、多 Store 协作、持久化、DevTools — 5 阶段完整学习',
    color: '#ffd700',
    icon: '🍍',
    tags: ['核心', '实战'],
    requiredPermissions: ['demo:pinia'],
  },
  {
    path: '/pinia-persist',
    title: '💾 Pinia 持久化学习',
    desc: 'pinia-plugin-persistedstate：localStorage/sessionStorage 自动持久化、自定义策略、安全存储',
    color: '#52c41a',
    icon: '💾',
    tags: ['核心', '库'],
    requiredPermissions: ['demo:pinia-persist'],
  },
  // ══════════════════════ 第四层：常用库与工具 ══════════════════════
  {
    path: '/vueuse',
    title: '🎯 VueUse 工具库学习',
    desc: '四阶段：状态管理工具 → 浏览器 API → 防抖节流 → 综合实战，200+ composable 工具函数',
    color: '#10b981',
    icon: '⚡',
    tags: ['核心', '库'],
    requiredPermissions: ['demo:vueuse'],
  },
  {
    path: '/axios',
    title: '📡 Axios 学习教程',
    desc: '快速上手、拦截器与封装、取消请求与上传下载、高级特性、实战封装 — 5 阶段系统学习',
    color: '#5a67d8',
    icon: 'AX',
    tags: ['核心', '实战'],
    requiredPermissions: ['demo:axios'],
  },
  {
    path: '/vue-request',
    title: 'VueRequest 请求库 v2',
    desc: 'useRequest 基础/分页/加载更多/高级特性 — 基于真实 Mock + Axios 完整示例',
    color: '#52c41a',
    icon: '⚡',
    tags: ['实战', '库'],
    requiredPermissions: ['demo:vue-request'],
  },
  {
    path: '/dayjs',
    title: '📅 Day.js 日期库学习',
    desc: '2KB 轻量日期库：解析、格式化、diff、locale、UTC、duration、插件系统',
    color: '#f59e0b',
    icon: '📅',
    tags: ['核心', '库'],
    requiredPermissions: ['demo:dayjs'],
  },
  {
    path: '/i18n',
    title: '🌍 Vue I18n 国际化学习',
    desc: '多语言翻译、复数消息、日期/数字格式化、组件插值、懒加载语言包',
    color: '#3b82f6',
    icon: '🌍',
    tags: ['核心', '库'],
    requiredPermissions: ['demo:i18n'],
  },
  {
    path: '/crypto',
    title: '🔐 加密技术学习',
    desc: 'crypto-js 对称加密/MD5/AES、jsencrypt RSA 非对称加密、签名验签、混合加密 — 5 阶段系统学习',
    color: '#fa8c16',
    icon: '🔐',
    tags: ['核心', '实战'],
    requiredPermissions: ['demo:crypto'],
  },
  // ══════════════════════ 第五层：实战项目 ══════════════════════
  {
    path: '/antd',
    title: 'Ant Design Vue 4.2.6 学习',
    desc: '七阶段：快速上手 → 核心组件 → 二次封装 → 主题定制 → 性能优化 → Table CRUD → 表单校验进阶',
    color: '#1677ff',
    icon: '🐜',
    tags: ['实战'],
    requiredPermissions: ['demo:antd'],
  },
  {
    path: '/element',
    title: 'Element Plus 学习',
    desc: '三阶段：安装配置 → 核心组件（Form/Table/Dialog） → 主题定制与暗黑模式',
    color: '#409eff',
    icon: '🧩',
    tags: ['实战', '库'],
    requiredPermissions: ['demo:element'],
  },
  {
    path: '/vant',
    title: 'Vant 4 移动端 UI 学习',
    desc: '三阶段：快速上手与适配 → 表单与数据展示 → 反馈与交互组件（Toast/Dialog/Notify）',
    color: '#1989fa',
    icon: '📱',
    tags: ['实战', '库'],
    requiredPermissions: ['demo:vant'],
  },
  {
    path: '/echarts',
    title: 'ECharts 数据可视化学习',
    desc: '三阶段：基础图表（折线/柱状/饼图） → 进阶（雷达/散点/仪表盘） → 高级特性（DataZoom/深色主题/动态刷新）',
    color: '#5470c6',
    icon: '📊',
    tags: ['实战', '库'],
    requiredPermissions: ['demo:echarts'],
  },
  {
    path: '/api-demo',
    title: '📡 API Demo（接口示例）',
    desc: '获取数据、请求拦截、响应拦截、取消请求、错误处理、封装工具函数',
    color: '#4096ff',
    icon: '▦',
    tags: ['实战'],
    requiredPermissions: ['demo:api-demo'],
  },
  {
    path: '/user-crud',
    title: '用户管理 CRUD',
    desc: 'Pinia Store、Composable、表单校验、搜索排序、批量操作、导出',
    color: '#4096ff',
    icon: '▦',
    tags: ['实战'],
    requiredPermissions: ['demo:user-crud'],
  },
  {
    path: '/permission',
    title: '🛡️ 权限控制学习',
    desc: 'RBAC 模型、指令控制、数据权限、多权限组合 — 后端获取权限完整实战',
    color: '#1677ff',
    icon: '🔒',
    tags: ['核心', '实战'],
    requiredPermissions: ['demo:permission'],
  },
  // ══════════════════════ 第六层：工程化工具链 ══════════════════════
  {
    path: '/app-scale',
    title: '应用规模化',
    desc: 'SFC 编写、工具链、路由、状态管理、测试、SSR — 6 大主题完整覆盖',
    color: '#4ecdc4',
    icon: '📐',
    tags: ['核心', '进阶'],
    requiredPermissions: ['demo:app-scale'],
  },
  {
    path: '/nuxt',
    title: 'Nuxt 3 / SSR 学习',
    desc: '三阶段：SSR 同构渲染原理 → Nuxt 3 核心（自动导入/路由/数据获取） → 进阶（中间件/插件/部署）',
    color: '#00dc82',
    icon: '🟢',
    tags: ['核心', '进阶'],
    requiredPermissions: ['demo:nuxt'],
  },
  {
    path: '/vite',
    title: '⚡ Vite 学习教程',
    desc: '快速上手、配置环境、插件系统、构建优化、进阶特性 — 5 阶段系统学习',
    color: '#646cff',
    icon: 'V',
    tags: ['核心', '进阶'],
    requiredPermissions: ['demo:vite'],
  },
  {
    path: '/eslint',
    title: '🔍 ESLint 学习教程',
    desc: '快速上手、Flat Config、插件系统、Vue/TS 实战、进阶生态 — 5 阶段系统学习',
    color: '#4b32c3',
    icon: 'ES',
    tags: ['核心', '进阶'],
    requiredPermissions: ['demo:eslint'],
  },
  {
    path: '/prettier',
    title: '✨ Prettier 学习教程',
    desc: '快速上手、核心配置、忽略与覆盖、ESLint 集成、进阶生态 — 5 阶段系统学习',
    color: '#1a2b5a',
    icon: 'PR',
    tags: ['核心', '进阶'],
    requiredPermissions: ['demo:prettier'],
  },
]

const tagFilter = shallowRef<string | null>(null)
const allTags = computed(() => {
  const set = new Set<string>()
  demos.forEach((d) => d.tags.forEach((t) => set.add(t)))
  return Array.from(set)
})

// 权限过滤：仅显示当前角色有权限的卡片
const permittedDemos = computed(() => demos.filter((d) => hasAny(...d.requiredPermissions)))

const filteredDemos = computed(() => {
  const base = permittedDemos.value
  if (!tagFilter.value) return base
  return base.filter((d) => d.tags.includes(tagFilter.value!))
})

const roleOptions = ['admin', 'manager', 'editor', 'viewer']
const roleLabels: Record<string, string> = {
  admin: '管理员',
  manager: '经理',
  editor: '编辑者',
  viewer: '查看者',
}

onMounted(() => {
  loadPermissions()
})
</script>

<template>
  <div class="home-page">
    <!-- 顶部标题区 -->
    <section class="hero">
      <h1 class="hero-title">
        <span class="hero-icon">☰</span>
        Vue 3 学习示例
      </h1>
      <p class="hero-desc">涵盖 Vue 3 Composition API、TypeScript、组件深入、状态管理等核心知识点</p>
      <div class="hero-stats">
        <span class="stat-item">
          <strong>{{ demos.length }}</strong> 个模块
        </span>
        <span class="stat-divider">·</span>
        <span class="stat-item"> <strong>3</strong> 个难度等级 </span>
        <span class="stat-divider">·</span>
        <span class="stat-item"> 涵盖 <strong>Vue 3 + TS</strong> </span>
      </div>
    </section>

    <!-- 角色切换（权限控制演示） -->
    <div class="role-bar">
      <span class="role-label">当前角色：</span>
      <div class="role-tabs">
        <button
          v-for="role in roleOptions"
          :key="role"
          :class="['role-btn', { active: currentRole === role }]"
          @click="setRole(role)"
        >
          {{ roleLabels[role] || role }}
        </button>
      </div>
      <span class="role-hint">← 切换角色，下方卡片将根据权限动态显示/隐藏</span>
    </div>

    <!-- 标签筛选 -->
    <div class="filter-bar">
      <button :class="['filter-btn', { active: tagFilter === null }]" @click="tagFilter = null">全部</button>
      <button
        v-for="tag in allTags"
        :key="tag"
        :class="['filter-btn', { active: tagFilter === tag }]"
        @click="tagFilter = tag"
      >
        {{ tag }}
      </button>
    </div>

    <!-- 卡片网格 -->
    <div class="demo-grid">
      <RouterLink
        v-for="demo in filteredDemos"
        :key="demo.path"
        :to="demo.path"
        class="demo-card"
        :style="{ '--card-color': demo.color }"
      >
        <div class="card-top">
          <span class="card-icon" :style="{ background: demo.color }">
            {{ demo.icon }}
          </span>
          <div class="card-tags">
            <span v-for="tag in demo.tags" :key="tag" class="card-tag" :class="`tag-${tag}`">{{ tag }}</span>
          </div>
        </div>
        <h2 class="card-title">{{ demo.title }}</h2>
        <p class="card-desc">{{ demo.desc }}</p>
        <span class="card-arrow">→</span>
      </RouterLink>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredDemos.length === 0" class="empty-state">
      <p>没有匹配的示例</p>
      <button class="reset-btn" @click="tagFilter = null">重置筛选</button>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

/* ===== Hero 区域 ===== */
.hero {
  text-align: center;
  margin-bottom: 36px;
}

.hero-title {
  font-size: 32px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.hero-icon {
  font-size: 30px;
}

.hero-desc {
  font-size: 15px;
  color: #888;
  margin: 0 0 16px;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  color: #aaa;
}

.stat-item strong {
  color: #3178c6;
  font-weight: 700;
}

.stat-divider {
  color: #ddd;
}

/* ===== 角色切换栏 ===== */
.role-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 10px;
  border: 1px dashed #e0e0e0;
}
.role-label {
  font-size: 13px;
  color: #888;
  font-weight: 600;
}
.role-tabs {
  display: flex;
  gap: 6px;
}
.role-btn {
  padding: 4px 16px;
  border: 1.5px solid #e0e0e0;
  border-radius: 16px;
  background: #fff;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}
.role-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
}
.role-btn.active {
  background: #1677ff;
  color: #fff;
  border-color: #1677ff;
  font-weight: 600;
}
.role-hint {
  font-size: 12px;
  color: #bbb;
  margin-left: 4px;
}

/* ===== 筛选栏 ===== */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 5px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  background: #fff;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #3178c6;
  color: #3178c6;
}

.filter-btn.active {
  background: #3178c6;
  color: #fff;
  border-color: #3178c6;
}

/* ===== 卡片网格 ===== */
.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}

.demo-card {
  display: flex;
  flex-direction: column;
  padding: 22px 24px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  text-decoration: none;
  color: #333;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.demo-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--card-color);
  opacity: 0;
  transition: opacity 0.25s;
}

.demo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border-color: var(--card-color);
}

.demo-card:hover::before {
  opacity: 1;
}

.demo-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* 卡片顶部：图标 + 标签 */
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.card-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.tag-基础 {
  background: #e6f7ff;
  color: #1890ff;
}

.tag-核心 {
  background: #f6ffed;
  color: #52c41a;
}

.tag-进阶 {
  background: #fff7e6;
  color: #fa8c16;
}

.tag-实战 {
  background: #f9f0ff;
  color: #722ed1;
}

.tag-Antd {
  background: #e6f4ff;
  color: #1677ff;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.card-desc {
  font-size: 13px;
  color: #999;
  margin: 0;
  line-height: 1.5;
  flex: 1;
}

.card-arrow {
  position: absolute;
  right: 20px;
  bottom: 20px;
  font-size: 20px;
  color: var(--card-color);
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== 空状态 ===== */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state p {
  margin: 0 0 16px;
  font-size: 15px;
}

.reset-btn {
  padding: 8px 24px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  border-color: #3178c6;
  color: #3178c6;
}

/* ===== 响应式 ===== */
@media (max-width: 640px) {
  .home-page {
    padding: 24px 16px 40px;
  }

  .hero-title {
    font-size: 24px;
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
