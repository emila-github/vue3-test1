<script setup lang="ts">
import { ref } from 'vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

const activeTab = ref('A')

// 模拟 tabs 切换
const tabs = ref([
  { key: 'A', label: 'Tab A - 表单', comp: 'TabAForm' },
  { key: 'B', label: 'Tab B - 列表', comp: 'TabBList' },
  { key: 'C', label: 'Tab C - 设置', comp: 'TabCSettings' },
])

function switchTab(key: string) {
  activeTab.value = key
  addLog(`切换到 Tab ${key}`)
}

// 模拟表单输入（演示 KeepAlive 状态保持）
const formData = ref({ name: '', email: '' })

// 模拟列表数据
const listCount = ref(0)
function addItem() {
  listCount.value++
  addLog(`列表新增项 #${listCount.value}`)
}

const keepAliveCode = `// KeepAlive — 缓存不活跃组件实例，避免重新渲染
<template>
  <KeepAlive>
    <component :is="activeTab" />
  </KeepAlive>
</template>

// 配合动态组件使用最典型的 Tab 切换场景
// 切换 Tab 时组件不会被销毁/重建，状态完整保留`

const includeExcludeCode = `// 精确控制缓存策略
<KeepAlive
  :include="['TabAForm', 'TabBList']"   // 只缓存这些组件（按 name）
  :exclude="['TabCSettings']"           // 排除这些组件（按 name）
  :max="5"                              // 最多缓存 5 个实例
>
  <component :is="activeTab" />
</KeepAlive>

// 生命周期钩子
// activated：组件被激活（从缓存中取出显示）
// deactivated：组件被停用（放入缓存隐藏）`

const excludeDemoCode = `// 组件中使用
<script setup lang="ts">
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  console.log('组件被激活，可以刷新数据')
})

onDeactivated(() => {
  console.log('组件被停用，可以保存草稿')
})
</` + 'script>'
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 4：KeepAlive 缓存策略</h1>
      <p>掌握 KeepAlive 组件缓存机制、include/exclude/max 配置、activated/deactivated 生命周期。</p>
    </header>

    <!-- KeepAlive 基础 -->
    <section class="card">
      <h2>KeepAlive 基本用法</h2>
      <p class="intro">
        <code>KeepAlive</code> 缓存不活跃的组件实例，避免销毁和重新创建，保持组件状态（表单输入、滚动位置等）。
      </p>
      <pre class="code-block"><code>{{ keepAliveCode }}</code></pre>
    </section>

    <!-- include/exclude/max -->
    <section class="card">
      <h2>include / exclude / max 配置</h2>
      <pre class="code-block"><code>{{ includeExcludeCode }}</code></pre>

      <h3>activated / deactivated 生命周期</h3>
      <pre class="code-block"><code>{{ excludeDemoCode }}</code></pre>
    </section>

    <!-- 交互演示：Tab 切换模拟 KeepAlive -->
    <section class="card">
      <h2>交互演示：Tab 切换（模拟 KeepAlive）</h2>
      <p class="intro">切换 Tab 时模拟 KeepAlive 行为 — 各组件的状态会被保留。</p>

      <div class="demo-area">
        <div class="tab-bar">
          <button
            v-for="t in tabs"
            :key="t.key"
            :class="['tab-btn', { active: activeTab === t.key }]"
            @click="switchTab(t.key)"
          >
            {{ t.label }}
          </button>
        </div>

        <div class="tab-content">
          <!-- Tab A: 表单 -->
          <div v-show="activeTab === 'A'" class="tab-panel">
            <h4>📝 表单（状态保持演示）</h4>
            <p style="font-size: 12px; color: #999;">
              填入内容后切换到其他 Tab 再回来，表单内容不会丢失（模拟 KeepAlive 行为）
            </p>
            <div class="form-group">
              <label>姓名：</label>
              <input v-model="formData.name" placeholder="输入姓名" class="demo-input" />
            </div>
            <div class="form-group">
              <label>邮箱：</label>
              <input v-model="formData.email" placeholder="输入邮箱" class="demo-input" />
            </div>
            <p style="font-size: 12px; color: #52c41a; margin-top: 8px;">
              当前值：name="{{ formData.name }}", email="{{ formData.email }}"
            </p>
          </div>

          <!-- Tab B: 列表 -->
          <div v-show="activeTab === 'B'" class="tab-panel">
            <h4>📋 列表（动态数据演示）</h4>
            <p style="font-size: 12px; color: #999;">
              切换 Tab 不会重置列表数据（模拟 KeepAlive 状态保持）
            </p>
            <button class="btn" @click="addItem">添加项目</button>
            <p style="font-size: 14px; margin-top: 8px;">
              当前列表项数：<strong>{{ listCount }}</strong>
            </p>
          </div>

          <!-- Tab C: 设置 -->
          <div v-show="activeTab === 'C'" class="tab-panel">
            <h4>⚙️ 设置</h4>
            <p style="font-size: 13px; color: #999;">
              此 Tab 的内容也会被 KeepAlive 缓存，切换不会丢失状态。
            </p>
            <div class="info-grid">
              <div class="info-item">
                <strong>include</strong>
                <span>指定缓存哪些组件（按组件 name）</span>
              </div>
              <div class="info-item">
                <strong>exclude</strong>
                <span>排除不需要缓存的组件</span>
              </div>
              <div class="info-item">
                <strong>max</strong>
                <span>最大缓存实例数，超出时淘汰最早缓存的</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 适用场景 -->
    <section class="card">
      <h2>KeepAlive 适用与不适用场景</h2>
      <div class="compare-grid">
        <div class="compare-col good">
          <h4>✅ 适用场景</h4>
          <ul>
            <li>Tab 切换频繁的页面</li>
            <li>包含表单填写的步骤流程</li>
            <li>列表-详情反复切换</li>
            <li>开销大的渲染组件</li>
          </ul>
        </div>
        <div class="compare-col bad">
          <h4>⚠️ 注意</h4>
          <ul>
            <li>缓存过多会导致内存增长</li>
            <li>注意使用 max 限制数量</li>
            <li>及时清理不需要的数据</li>
            <li>数据变更时需手动刷新</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 日志 -->
    <section class="card" v-if="log.length">
      <h2>操作日志</h2>
      <div class="log-panel">
        <div v-for="(l, i) in log" :key="i">{{ l }}</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page { max-width: 960px; margin: 0 auto; padding: 24px; }
.page-header { text-align: center; margin-bottom: 32px; }
.page-header h1 { font-size: 28px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; line-height: 1.6; }
.card { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; }
.card h3 { margin: 20px 0 10px; font-size: 15px; color: #555; }
.intro { color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
.intro code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 13px; }
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.6; margin: 12px 0; }

.demo-area { padding: 16px; background: #fafafa; border-radius: 8px; }
.tab-bar { display: flex; gap: 8px; margin-bottom: 16px; }
.tab-btn { padding: 8px 20px; border: 1px solid #d9d9d9; border-radius: 6px 6px 0 0; background: #f5f5f5; cursor: pointer; font-size: 14px; color: #666; transition: all 0.2s; }
.tab-btn.active { background: #fff; color: #1890ff; border-bottom-color: #fff; font-weight: 600; }
.tab-btn:hover { color: #1890ff; }
.tab-content { padding: 16px; background: #fff; border: 1px solid #f0f0f0; border-radius: 0 8px 8px 8px; min-height: 150px; }
.tab-panel h4 { margin: 0 0 10px; font-size: 15px; color: #333; }
.form-group { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.form-group label { font-size: 13px; color: #666; width: 50px; }
.demo-input { padding: 6px 10px; border: 1px solid #d9d9d9; border-radius: 4px; font-size: 13px; flex: 1; }
.btn { padding: 8px 16px; background: #52c41a; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
.btn:hover { background: #45a418; }

.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; margin-top: 12px; }
.info-item { padding: 12px; background: #f8f8f8; border-radius: 6px; }
.info-item strong { display: block; margin-bottom: 4px; font-size: 14px; color: #333; }
.info-item span { font-size: 12px; color: #999; }

.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.compare-col { padding: 16px; border-radius: 8px; }
.compare-col.good { background: #f6ffed; border: 1px solid #b7eb8f; }
.compare-col.bad { background: #fff2f0; border: 1px solid #ffccc7; }
.compare-col h4 { margin: 0 0 8px; font-size: 14px; }
.compare-col ul { margin: 0; padding-left: 18px; font-size: 13px; color: #666; }
.compare-col li { margin-bottom: 4px; }

.log-panel { background: #fafafa; border: 1px solid #f0f0f0; border-radius: 8px; padding: 12px; max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 12px; color: #666; }

@media (max-width: 768px) {
  .compare-grid { grid-template-columns: 1fr; }
  .tab-bar { overflow-x: auto; }
}
</style>
