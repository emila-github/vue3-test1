<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: '权限模型与概念',
    desc: 'RBAC 模型、权限码设计、后端获取权限流程、权限数据建模',
    path: '/permission/stage1',
    icon: '📐',
    color: '#1677ff',
  },
  {
    id: 2,
    title: '指令控制：菜单与按钮',
    desc: 'v-permission 自定义指令、菜单显隐、按钮禁用/移除、组件级权限',
    path: '/permission/stage2',
    icon: '🔐',
    color: '#52c41a',
  },
  {
    id: 3,
    title: '数据权限控制',
    desc: '行级过滤、字段脱敏、只读模式、数据级权限粒度',
    path: '/permission/stage3',
    icon: '📊',
    color: '#fa8c16',
  },
  {
    id: 4,
    title: '多权限组合逻辑',
    desc: 'OR 任意满足、AND 全部满足、权限组、角色多权限叠加',
    path: '/permission/stage4',
    icon: '🔗',
    color: '#722ed1',
  },
  {
    id: 5,
    title: '完整权限实战',
    desc: '模拟管理后台：切换角色 → 菜单 + 按钮 + 数据全维度联动',
    path: '/permission/stage5',
    icon: '🛡️',
    color: '#eb2f96',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="permission-index">
    <header class="page-header">
      <h1>🛡️ 权限控制学习教程</h1>
      <p class="subtitle">
        涵盖 RBAC 模型、后端获取权限、指令控制（菜单/按钮/组件）、数据级权限、多权限组合逻辑，5 阶段系统学习。
      </p>
    </header>

    <!-- 核心概念 -->
    <section class="card">
      <h2>权限控制体系总览</h2>
      <div class="concept-grid">
        <div class="concept-item">
          <strong>RBAC</strong>
          <span>基于角色的访问控制：用户 → 角色 → 权限</span>
        </div>
        <div class="concept-item">
          <strong>权限码</strong>
          <span>menu:user / btn:delete / data:salary 语义化编码</span>
        </div>
        <div class="concept-item">
          <strong>菜单权限</strong>
          <span>控制侧边栏/导航的可见性</span>
        </div>
        <div class="concept-item">
          <strong>按钮权限</strong>
          <span>控制操作按钮：显示/隐藏/禁用</span>
        </div>
        <div class="concept-item">
          <strong>组件权限</strong>
          <span>控制整个组件/区域的渲染</span>
        </div>
        <div class="concept-item">
          <strong>数据权限</strong>
          <span>行级过滤 + 字段脱敏 + 只读模式</span>
        </div>
        <div class="concept-item">
          <strong>OR 逻辑</strong>
          <span>多权限中任意一个满足即可访问</span>
        </div>
        <div class="concept-item">
          <strong>AND 逻辑</strong>
          <span>多个权限必须全部满足才能访问</span>
        </div>
      </div>
    </section>

    <!-- 学习阶段 -->
    <section class="stages">
      <h2>学习阶段（共 5 个）</h2>
      <div class="stage-grid">
        <div
          v-for="s in stages"
          :key="s.id"
          class="stage-card"
          :style="{ borderTopColor: s.color }"
          @click="navigateTo(s.path)"
        >
          <span class="stage-icon">{{ s.icon }}</span>
          <h3>{{ s.title }}</h3>
          <p class="stage-desc">{{ s.desc }}</p>
          <div class="stage-badge" :style="{ background: s.color }">Stage {{ s.id }}</div>
        </div>
      </div>
    </section>

    <!-- 权限粒度对比 -->
    <section class="card">
      <h2>权限控制粒度对比</h2>
      <a-table
        :columns="[
          { title: '粒度层级', dataIndex: 'level', key: 'level' },
          { title: '控制对象', dataIndex: 'target', key: 'target' },
          { title: '实现方式', dataIndex: 'method', key: 'method' },
          { title: '失败表现', dataIndex: 'fail', key: 'fail' },
        ]"
        :data-source="[
          { level: '路由级', target: '整个页面/模块', method: 'router.beforeEach + meta', fail: '重定向到 403' },
          { level: '菜单级', target: '导航菜单项', method: 'v-permission + 过滤', fail: '菜单不显示' },
          { level: '组件级', target: '整个组件/区块', method: 'v-if + 权限判断', fail: '组件不渲染' },
          { level: '按钮级', target: '操作按钮', method: 'v-permission + display: none', fail: '按钮不可见' },
          { level: '行级', target: '表格行', method: '数据源过滤', fail: '看不到该行' },
          { level: '字段级', target: '单元格数据', method: '脱敏/占位符替换', fail: '显示 ****' },
          { level: '模式级', target: '输入框/表单', method: ':disabled 绑定', fail: '只读不可编辑' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>
  </div>
</template>

<style scoped>
.permission-index {
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
.concept-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.concept-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}
.concept-item strong {
  font-size: 14px;
  color: #333;
}
.concept-item span {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
}
.stages h2 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
}
.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.stage-card {
  position: relative;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-top: 3px solid;
  border-radius: 10px;
  padding: 20px 16px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}
.stage-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
.stage-icon {
  font-size: 28px;
}
.stage-card h3 {
  margin: 10px 0 6px;
  font-size: 15px;
  color: #333;
}
.stage-desc {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
  margin: 0;
}
.stage-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 11px;
  color: #fff;
  padding: 2px 8px;
  border-radius: 10px;
}
@media (max-width: 768px) {
  .concept-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stage-grid {
    grid-template-columns: 1fr;
  }
}
</style>
