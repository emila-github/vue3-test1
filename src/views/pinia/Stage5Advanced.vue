<script setup lang="ts">
import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'

// ─── 持久化 Store（手动 localStorage） ───
const useSettingsStore = defineStore('settings-demo', () => {
  // 从 localStorage 读取初始值
  const saved = localStorage.getItem('app-settings')
  const defaults = { theme: 'light' as 'light' | 'dark', lang: 'zh' as 'zh' | 'en' }
  const initial = saved ? { ...defaults, ...JSON.parse(saved) } : defaults

  const theme = ref(initial.theme)
  const lang = ref(initial.lang)

  function setTheme(t: 'light' | 'dark') {
    theme.value = t
  }

  function setLang(l: 'zh' | 'en') {
    lang.value = l
  }

  function resetSettings() {
    theme.value = 'light'
    lang.value = 'zh'
  }

  return { theme, lang, setTheme, setLang, resetSettings }
})

const settingsStore = useSettingsStore()
const { theme, lang } = storeToRefs(settingsStore)

// 手动持久化（watch 监听变化写入 localStorage）
watch(
  () => ({ theme: settingsStore.theme, lang: settingsStore.lang }),
  (val) => {
    localStorage.setItem('app-settings', JSON.stringify(val))
  },
  { deep: true },
)

// ─── Options Store 演示 ───
const useProfileStore = defineStore('profile-demo', {
  state: () => ({
    nickname: '小明',
    email: 'xiaoming@example.com',
    bio: '',
  }),
  getters: {
    displayName: (state) => state.nickname || '匿名用户',
    hasBio: (state) => state.bio.length > 0,
  },
  actions: {
    updateProfile(data: { nickname?: string; email?: string; bio?: string }) {
      if (data.nickname !== undefined) this.nickname = data.nickname
      if (data.email !== undefined) this.email = data.email
      if (data.bio !== undefined) this.bio = data.bio
    },
    resetProfile() {
      this.$reset()
    },
  },
})

const profileStore = useProfileStore()
const { nickname, email, bio, displayName, hasBio } = storeToRefs(profileStore)

const editForm = ref({ nickname: '', email: '', bio: '' })

function openEditForm() {
  editForm.value = { nickname: nickname.value, email: email.value, bio: bio.value }
}

function saveProfile() {
  profileStore.updateProfile(editForm.value)
  message.success('个人资料已更新')
}

// ─── 动态 Store 演示 ───
const dynamicStores = ref<ReturnType<typeof createCountStore>[]>([])

function createCountStore(label: string) {
  return defineStore(`dynamic-${label}`, () => {
    const count = ref(0)
    function add() {
      count.value++
    }
    return { count, add }
  })()
}

function addDynamicStore() {
  const label = String.fromCharCode(65 + dynamicStores.value.length) // A, B, C...
  dynamicStores.value.push(createCountStore(label))
  message.success(`动态 Store "${label}" 已创建`)
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 5：进阶与最佳实践</h1>
      <p>Options Store、持久化、插件体系、DevTools、常见陷阱与解决方案。</p>
    </header>

    <!-- 5.1 Options Store -->
    <section class="card">
      <h2>5.1 Options Store 语法</h2>
      <p>
        Pinia 同时支持类 Vuex 的 Options Store 语法，使用 <code>state</code>、<code>getters</code>、<code>actions</code>
        定义。 <code>this</code> 可以访问所有内容。
      </p>
      <pre class="code-block">
// Options Store — 类 Vuex 风格
export const useProfileStore = defineStore('profile', {
  state: () => ({
    nickname: '小明',
    email: 'xiaoming@example.com',
    bio: '',
  }),
  getters: {
    displayName: (state) => state.nickname || '匿名用户',
    hasBio: (state) => state.bio.length > 0,
  },
  actions: {
    updateProfile(data) {
      if (data.nickname) this.nickname = data.nickname
      if (data.email) this.email = data.email
      if (data.bio) this.bio = data.bio
    },
    resetProfile() {
      this.$reset()
    },
  },
})</pre
      >

      <div class="demo-box" style="margin-top: 12px">
        <h4>Options Store 演示 — 个人资料：</h4>
        <div class="profile-display">
          <p><strong>昵称：</strong>{{ displayName }}（{{ nickname }}）</p>
          <p><strong>邮箱：</strong>{{ email }}</p>
          <p><strong>简介：</strong>{{ hasBio ? bio : '(未填写)' }}</p>
        </div>

        <a-collapse ghost>
          <a-collapse-panel key="form" header="编辑资料">
            <div style="display: flex; flex-direction: column; gap: 8px">
              <a-input v-model:value="editForm.nickname" placeholder="昵称" size="small" />
              <a-input v-model:value="editForm.email" placeholder="邮箱" size="small" />
              <a-textarea v-model:value="editForm.bio" placeholder="个人简介" :rows="2" size="small" />
              <a-space>
                <a-button type="primary" size="small" @click="saveProfile">保存</a-button>
                <a-button size="small" @click="profileStore.resetProfile()">重置</a-button>
              </a-space>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </section>

    <!-- 5.2 状态持久化 -->
    <section class="card">
      <h2>5.2 状态持久化（localStorage）</h2>
      <p>
        Pinia 不自带持久化，但可以通过 <code>watch</code> + <code>localStorage</code> 或第三方插件
        <code>pinia-plugin-persistedstate</code> 实现。
      </p>
      <pre class="code-block">
// 方案一：手动 watch（适合简单场景）
import { watch } from 'vue'

const store = useSettingsStore()
watch(
  () => ({ theme: store.theme, lang: store.lang }),
  (val) => localStorage.setItem('app-settings', JSON.stringify(val)),
  { deep: true },
)

// 方案二：插件（推荐）
// import { createPersistedState } from 'pinia-plugin-persistedstate'
// const pinia = createPinia()
// pinia.use(createPersistedState())</pre
      >

      <div class="demo-box">
        <h4>演示 — 应用设置（刷新后保留）：</h4>
        <a-space wrap>
          <span>主题：</span>
          <a-button
            :type="theme === 'light' ? 'primary' : 'default'"
            size="small"
            @click="settingsStore.setTheme('light')"
          >
            ☀ 浅色
          </a-button>
          <a-button
            :type="theme === 'dark' ? 'primary' : 'default'"
            size="small"
            @click="settingsStore.setTheme('dark')"
          >
            🌙 深色
          </a-button>
          <span style="margin-left: 16px">语言：</span>
          <a-button :type="lang === 'zh' ? 'primary' : 'default'" size="small" @click="settingsStore.setLang('zh')">
            中文
          </a-button>
          <a-button :type="lang === 'en' ? 'primary' : 'default'" size="small" @click="settingsStore.setLang('en')">
            English
          </a-button>
          <a-button danger size="small" @click="settingsStore.resetSettings()">重置</a-button>
        </a-space>
        <p style="margin-top: 12px; font-size: 13px; color: #999">
          当前：theme={{ theme }}, lang={{ lang }} &nbsp;—&nbsp;<em>刷新页面后设置仍然保留</em>
        </p>
      </div>
    </section>

    <!-- 5.3 插件体系 -->
    <section class="card">
      <h2>5.3 Pinia 插件</h2>
      <p>Pinia 插件可以拦截所有 Store 的创建，实现全局功能扩展（如日志、持久化、重置）。</p>
      <pre class="code-block">
// 自定义 Pinia 插件
function myPlugin({ store }) {
  // 在 state 上添加公共属性
  store.apiUrl = 'https://api.example.com'

  // 为每个 store 添加公共 action
  store.resetAll = () => {
    store.$reset()
  }
}

const pinia = createPinia()
pinia.use(myPlugin)
app.use(pinia)</pre
      >

      <div class="tip-box">
        <strong>常用 Pinia 插件：</strong>
        <ul>
          <li><code>pinia-plugin-persistedstate</code> — 持久化到 localStorage/sessionStorage</li>
          <li><code>pinia-plugin-loading</code> — 自动跟踪 action 加载状态</li>
          <li><code>pinia-shared-state</code> — 跨标签页同步 state</li>
        </ul>
      </div>
    </section>

    <!-- 5.4 动态 Store -->
    <section class="card">
      <h2>5.4 动态创建 Store 实例</h2>
      <p>
        Pinia 的 <code>defineStore</code> 返回的是一个
        <strong>hook 函数</strong>，可以在运行时多次调用，每次创建独立实例。
      </p>
      <div class="demo-box">
        <h4>演示 — 动态计数器：</h4>
        <a-button type="primary" size="small" @click="addDynamicStore">创建 Store 实例</a-button>
        <div v-if="dynamicStores.length > 0" style="margin-top: 12px">
          <div
            v-for="(store, i) in dynamicStores"
            :key="i"
            style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px"
          >
            <span style="font-weight: 500; width: 40px">Store {{ String.fromCharCode(65 + i) }}:</span>
            <span style="font-size: 18px; font-weight: 700; color: #fa541c">{{ store.count }}</span>
            <a-button size="small" @click="store.add()">+1</a-button>
          </div>
        </div>
      </div>
    </section>

    <!-- 5.5 常见陷阱 -->
    <section class="card">
      <h2>5.5 常见陷阱与解决方案</h2>
      <a-table
        :columns="[
          { title: '陷阱', dataIndex: 'trap', key: 'trap', width: 160 },
          { title: '错误做法', dataIndex: 'bad', key: 'bad' },
          { title: '正确做法', dataIndex: 'good', key: 'good' },
        ]"
        :data-source="[
          { trap: '解构丢失响应式', bad: 'const { count } = store', good: 'const { count } = storeToRefs(store)' },
          { trap: 'reactive 整体替换', bad: 'state = newObj', good: '用 ref 包装对象，或 Object.assign()' },
          { trap: 'SSR 状态污染', bad: '单例 store 跨请求共享', good: '每次请求重新 useStore()' },
          { trap: '循环依赖', bad: 'A store 顶层 import B store', good: '在 getter/action 内部惰性调用' },
          { trap: '$reset 不可用', bad: 'Option Store 自动支持', good: 'Setup Store 需手动实现重置逻辑' },
          { trap: 'action 用箭头函数', bad: 'Options Store 箭头丢失 this', good: 'Options Store 用普通函数' },
        ]"
        :pagination="false"
        size="small"
        :bordered="false"
      />
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin: 0 0 6px;
}

.page-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
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

.card p {
  font-size: 14px;
  color: #555;
  line-height: 1.7;
  margin: 0 0 12px;
}

.card p code,
.card li code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
  color: #d63384;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  margin: 12px 0;
  white-space: pre;
  tab-size: 2;
}

.demo-box {
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
}

.demo-box h4 {
  margin: 0 0 10px;
  font-size: 13px;
  color: #999;
  font-weight: 400;
}

.profile-display p {
  margin: 0 0 4px;
  font-size: 14px;
}

.tip-box {
  background: #fffbe6;
  border-left: 3px solid #faad14;
  padding: 12px 16px;
  border-radius: 4px;
  margin: 12px 0;
  font-size: 13px;
  color: #595959;
}

.tip-box ul {
  margin: 6px 0 0;
  padding-left: 20px;
}

.tip-box li {
  margin-bottom: 4px;
}
</style>
