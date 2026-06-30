<script setup lang="ts">
import { ref, computed } from 'vue'

// 模拟用户拥有的权限（通常从后端获取）
const userPermissions = ref([
  'btn:user-create',
  'btn:user-edit',
  'data:report-view-own',
])

// 模拟另一个角色（更多权限）
const userPermissionsB = ref([
  'btn:user-create',
  'btn:user-edit',
  'btn:user-delete',
  'btn:user-export',
  'data:report-view-all',
  'data:user-view-sensitive',
])

const activeUser = ref<'A' | 'B'>('A')
const currentPermissions = computed(() => activeUser.value === 'A' ? userPermissions.value : userPermissionsB.value)

function hasAny(...perms: string[]): boolean {
  return perms.some((p) => currentPermissions.value.includes(p))
}

function hasAll(...perms: string[]): boolean {
  return perms.every((p) => currentPermissions.value.includes(p))
}

function hasNone(...perms: string[]): boolean {
  return perms.every((p) => !currentPermissions.value.includes(p))
}

// 演示用例
const cases = ref([
  {
    name: '场景 1：单权限控制',
    desc: '删除用户需要 btn:user-delete',
    perms: ['btn:user-delete'],
    logic: 'hasAny',
    resource: '🗑️ 删除用户按钮',
  },
  {
    name: '场景 2：多权限 OR — 任一满足',
    desc: '管理者入口：menu:admin 或 admin:full 任一即可',
    perms: ['menu:admin', 'admin:full'],
    logic: 'hasAny',
    resource: '🔑 管理员面板入口',
  },
  {
    name: '场景 3：多权限 OR — 多个角色',
    desc: '导出报表：btn:report-export 或 data:report-view-all 任一即可',
    perms: ['btn:report-export', 'data:report-view-all'],
    logic: 'hasAny',
    resource: '📥 导出报表按钮',
  },
  {
    name: '场景 4：多权限 AND — 全部满足',
    desc: '敏感操作需同时有创建+编辑+删除权限',
    perms: ['btn:user-create', 'btn:user-edit', 'btn:user-delete'],
    logic: 'hasAll',
    resource: '⚡ 批量操作用户',
  },
  {
    name: '场景 5：层级权限 — 高权限覆盖低',
    desc: 'admin:full 覆盖所有权限，只需检查一个',
    perms: ['admin:full'],
    logic: 'hasAny',
    resource: '👑 超级管理功能',
  },
  {
    name: '场景 6：NONE 逻辑 — 都不满足',
    desc: '检查是否没有任何管理权限（访客校验）',
    perms: ['menu:admin', 'admin:full'],
    logic: 'hasNone',
    resource: '🚫 隐藏管理入口',
  },
  {
    name: '场景 7：复合 OR — 导出权限',
    desc: '导出数据需要导出按钮权限或全部数据权限',
    perms: ['btn:user-export', 'data:report-view-all'],
    logic: 'hasAny',
    resource: '📊 数据导出面板',
  },
])

// 自行添加权限测试
const customPerms = ref(['btn:user-create', 'btn:user-edit'])
const customResult = computed(() => {
  const anyOk = hasAny(...customPerms.value)
  const allOk = hasAll(...customPerms.value)
  return { anyOk, allOk }
})

</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>🔗 Stage 4：多权限组合逻辑</h1>
      <p>OR 任意满足 / AND 全部满足 / NONE 全部不满足</p>
    </header>

    <!-- 权限集合切换 -->
    <section class="card">
      <h2>当前权限集</h2>
      <a-space style="margin-bottom: 12px">
        <a-button :type="activeUser === 'A' ? 'primary' : 'default'" @click="activeUser = 'A'">用户 A（编辑权限）</a-button>
        <a-button :type="activeUser === 'B' ? 'primary' : 'default'" @click="activeUser = 'B'">用户 B（管理权限）</a-button>
      </a-space>
      <div style="display: flex; gap: 6px; flex-wrap: wrap">
        <a-tag v-for="p in currentPermissions" :key="p" color="blue">{{ p }}</a-tag>
      </div>
      <p class="small-desc" style="margin-top: 8px">
        用户 A 缺少 <code>btn:user-delete</code>、<code>btn:user-export</code>、<code>data:report-view-all</code> 等权限
      </p>
    </section>

    <!-- 三种逻辑说明 -->
    <section class="card">
      <h2>三种权限判断逻辑</h2>
      <div class="logic-grid">
        <div class="logic-card or">
          <h4>hasAny() — OR 逻辑</h4>
          <p>任意一个权限满足 ↦ 通过</p>
          <pre class="mini-code">hasAny('btn:edit', 'admin:full')</pre>
          <span class="result-tag">适用：多角色入口、宽泛授权</span>
        </div>
        <div class="logic-card and">
          <h4>hasAll() — AND 逻辑</h4>
          <p>全部权限满足 ↦ 通过</p>
          <pre class="mini-code">hasAll('btn:create', 'btn:edit', 'btn:delete')</pre>
          <span class="result-tag">适用：敏感操作、高危功能</span>
        </div>
        <div class="logic-card none">
          <h4>hasNone() — NONE 逻辑</h4>
          <p>全部不满足 ↦ 通过</p>
          <pre class="mini-code">hasNone('menu:admin', 'admin:full')</pre>
          <span class="result-tag">适用：排除特定角色</span>
        </div>
      </div>
    </section>

    <!-- 场景演示 -->
    <section class="card">
      <h2>多场景权限判断演示</h2>
      <div class="case-grid">
        <div v-for="c in cases" :key="c.name" class="case-card">
          <h4>{{ c.name }}</h4>
          <p class="case-desc">{{ c.desc }}</p>
          <div class="case-resource">{{ c.resource }}</div>
          <div class="case-perms">
            <a-tag v-for="p in c.perms" :key="p" :color="currentPermissions.includes(p) ? 'green' : 'default'" size="small">{{ p }}</a-tag>
          </div>
          <div class="case-logic">
            <span class="logic-label">{{ c.logic }}</span>
            <span v-if="c.logic === 'hasAny'" :class="['result', hasAny(...(c.perms as [string, ...string[]])) ? 'pass' : 'fail']">
              {{ hasAny(...(c.perms as [string, ...string[]])) ? '✓ 通过' : '✗ 拒绝' }}
            </span>
            <span v-else-if="c.logic === 'hasAll'" :class="['result', hasAll(...(c.perms as [string, ...string[]])) ? 'pass' : 'fail']">
              {{ hasAll(...(c.perms as [string, ...string[]])) ? '✓ 通过' : '✗ 拒绝' }}
            </span>
            <span v-else :class="['result', hasNone(...(c.perms as [string, ...string[]])) ? 'pass' : 'fail']">
              {{ hasNone(...(c.perms as [string, ...string[]])) ? '✓ 通过' : '✗ 拒绝' }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 自由组合测试 -->
    <section class="card">
      <h2>自由组合测试</h2>
      <p class="desc">用逗号分隔输入权限码，实时查看 hasAny 和 hasAll 结果：</p>
      <a-input
        :value="customPerms.join(', ')"
        placeholder="如：btn:user-create, btn:user-edit, btn:user-delete"
        @change="(e: any) => { customPerms = (e.target.value as string).split(',').map(s => s.trim()).filter(Boolean) }"
        style="margin-bottom: 12px"
      />
      <div class="custom-result">
        <div class="cr-item" :class="{ pass: customResult.anyOk, fail: !customResult.anyOk }">
          <strong>hasAny</strong> {{ customResult.anyOk ? '✓ 至少有一个权限匹配' : '✗ 没有权限匹配' }}
        </div>
        <div class="cr-item" :class="{ pass: customResult.allOk, fail: !customResult.allOk }">
          <strong>hasAll</strong> {{ customResult.allOk ? '✓ 全部权限都匹配' : '✗ 不是全部匹配' }}
        </div>
      </div>
    </section>

    <!-- 实现代码 -->
    <section class="card">
      <h2>核心实现代码</h2>
      <div class="code-block"><pre><code>// hasAny — 任一满足（OR）
function hasAny(...perms: string[]): boolean {
  return perms.some(p => userPermissions.includes(p))
}

// hasAll — 全部满足（AND）
function hasAll(...perms: string[]): boolean {
  return perms.every(p => userPermissions.includes(p))
}

// hasNone — 全部不满足（NAND）
function hasNone(...perms: string[]): boolean {
  return perms.every(p => !userPermissions.includes(p))
}</code></pre></div>
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
.card h4 { margin: 0 0 4px; font-size: 14px; color: #333; }
.desc { color: #555; font-size: 14px; line-height: 1.8; margin: 0 0 12px; }
.desc code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; }
.small-desc { font-size: 12px; color: #999; margin: 0; }
.logic-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.logic-card { padding: 16px; border-radius: 10px; border: 1px solid #f0f0f0; }
.logic-card.or { background: #f6ffed; border-color: #b7eb8f; }
.logic-card.and { background: #f0f5ff; border-color: #adc6ff; }
.logic-card.none { background: #fff2f0; border-color: #ffccc7; }
.logic-card p { font-size: 13px; color: #555; margin: 0 0 8px; }
.mini-code { background: rgba(0,0,0,.05); padding: 6px 10px; border-radius: 4px; font-size: 12px; margin: 8px 0; overflow-x: auto; }
.result-tag { font-size: 11px; color: #999; }
.case-grid { display: flex; flex-direction: column; gap: 12px; }
.case-card { padding: 14px 16px; border-radius: 8px; border: 1px solid #f0f0f0; background: #fafafa; }
.case-card h4 { margin: 0 0 4px; font-size: 13px; }
.case-desc { font-size: 12px; color: #999; margin: 0 0 8px; }
.case-resource { font-size: 14px; margin-bottom: 8px; }
.case-perms { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 6px; }
.case-logic { display: flex; align-items: center; gap: 8px; }
.logic-label { font-size: 11px; padding: 2px 8px; border-radius: 10px; background: #e6f4ff; color: #1677ff; }
.result { font-size: 13px; font-weight: 600; }
.result.pass { color: #52c41a; }
.result.fail { color: #ff4d4f; }
.custom-result { display: flex; flex-direction: column; gap: 8px; }
.cr-item { padding: 10px 14px; border-radius: 6px; font-size: 13px; }
.cr-item.pass { background: #f6ffed; color: #52c41a; }
.cr-item.fail { background: #fff2f0; color: #ff4d4f; }
.cr-item strong { margin-right: 8px; }
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; }
.code-block code { font-size: 13px; line-height: 1.8; white-space: pre; }
@media (max-width: 768px) { .logic-grid { grid-template-columns: 1fr; } }
</style>
