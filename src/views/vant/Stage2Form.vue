<script setup lang="ts">
/**
 * Vant Stage 2: 表单与数据展示
 * 演示 Form、Field、Picker、DatetimePicker、Uploader、List、Swipe 等
 */
import { ref, reactive } from 'vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// ============ Form 表单 ============
const formData = reactive({
  username: '',
  password: '',
  phone: '',
  sms: '',
  gender: '',
  birthday: '',
})

function submitForm() {
  addLog(`表单提交：${JSON.stringify(formData)}`)
}

// ============ Picker ============
const pickerVisible = ref(false)
const pickerValue = ref<string[]>([])
const pickerColumns = [
  { text: '北京', value: 'beijing' },
  { text: '上海', value: 'shanghai' },
  { text: '广州', value: 'guangzhou' },
  { text: '深圳', value: 'shenzhen' },
  { text: '杭州', value: 'hangzhou' },
]

function onPickerConfirm({ selectedOptions }: any) {
  pickerVisible.value = false
  formData.gender = selectedOptions[0]?.text || ''
  addLog(`选择了：${selectedOptions[0]?.text}`)
}

// ============ Swipe 轮播 ============
const swipeImages = [
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg',
]
const swipeIndex = ref(0)

// ============ List 列表数据 ============
const listData = ref([
  { id: 1, title: '订单 20240101', desc: '已完成', price: 99.0 },
  { id: 2, title: '订单 20240102', desc: '配送中', price: 158.0 },
  { id: 3, title: '订单 20240103', desc: '待付款', price: 299.0 },
])
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 2：表单与数据展示</h1>
      <p>掌握 Form 表单校验、Field 输入框、Picker 选择器、DatetimePicker、List 列表、Swipe 轮播等组件。</p>
    </header>

    <!-- 2.1 Form + Field -->
    <section class="card">
      <h2>2.1 Form 表单 &amp; Field 输入框</h2>
      <van-form @submit="submitForm">
        <van-cell-group inset>
          <van-field v-model="formData.username" name="username" label="用户名" placeholder="请输入用户名" required :rules="[{ required: true, message: '请输入用户名' }]" />
          <van-field v-model="formData.password" name="password" label="密码" type="password" placeholder="请输入密码" required :rules="[{ required: true, message: '请输入密码' }]" />
          <van-field v-model="formData.phone" name="phone" label="手机号" placeholder="请输入手机号" type="tel">
            <template #extra>
              <van-button size="small" type="primary" @click="addLog('发送验证码')">发送验证码</van-button>
            </template>
          </van-field>
          <van-field v-model="formData.sms" name="sms" label="验证码" placeholder="请输入验证码" center clearable>
            <template #button>
              <van-button size="small" type="primary">发送验证码</van-button>
            </template>
          </van-field>
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </section>

    <!-- 2.2 Picker 选择器 -->
    <section class="card">
      <h2>2.2 Picker 选择器</h2>
      <div class="demo-row">
        <van-button @click="pickerVisible = true">选择城市</van-button>
        <span v-if="formData.gender" style="color:#1989fa">已选：{{ formData.gender }}</span>
      </div>
      <van-popup v-model:show="pickerVisible" position="bottom" round>
        <van-picker :columns="pickerColumns" @confirm="onPickerConfirm" @cancel="pickerVisible = false" title="选择城市" />
      </van-popup>
      <pre class="code-block">{{ `const columns = [
  { text: '北京', value: 'beijing' },
  { text: '上海', value: 'shanghai' },
]

<van-popup v-model:show="visible" position="bottom">
  <van-picker :columns="columns" @confirm="onConfirm" />
</van-popup>` }}</pre>
    </section>

    <!-- 2.3 Swipe 轮播 -->
    <section class="card">
      <h2>2.3 Swipe 轮播</h2>
      <van-swipe :autoplay="3000" lazy-render indicator-color="white" style="border-radius:8px;overflow:hidden">
        <van-swipe-item v-for="(img, i) in swipeImages" :key="i">
          <img :src="img" style="width:100%;height:180px;object-fit:cover" />
        </van-swipe-item>
      </van-swipe>
      <pre class="code-block">{{ `<van-swipe :autoplay="3000" indicator-color="white">
  <van-swipe-item v-for="img in images" :key="img">
    <img :src="img" />
  </van-swipe-item>
</van-swipe>` }}</pre>
    </section>

    <!-- 2.4 数据列表 -->
    <section class="card">
      <h2>2.4 List 列表 + Tag 标签</h2>
      <van-cell-group inset>
        <van-cell v-for="item in listData" :key="item.id" :title="item.title" :label="item.desc" :value="`¥${item.price}`">
          <template #icon>
            <van-tag :type="item.desc === '已完成' ? 'success' : item.desc === '配送中' ? 'primary' : 'danger'" size="medium" style="margin-right:8px">
              {{ item.desc }}
            </van-tag>
          </template>
        </van-cell>
      </van-cell-group>
      <p class="note">Vant List 支持上拉加载更多和下拉刷新，需配合 <code>van-list</code> 和 <code>van-pull-refresh</code> 使用。</p>
    </section>

    <!-- 2.5 其他常用组件 -->
    <section class="card">
      <h2>2.5 其他常用组件速览</h2>
      <div class="api-grid">
        <div class="api-item"><code>&lt;van-search&gt;</code><span>搜索框</span></div>
        <div class="api-item"><code>&lt;van-stepper&gt;</code><span>步进器</span></div>
        <div class="api-item"><code>&lt;van-slider&gt;</code><span>滑块</span></div>
        <div class="api-item"><code>&lt;van-rate&gt;</code><span>评分</span></div>
        <div class="api-item"><code>&lt;van-uploader&gt;</code><span>上传</span></div>
        <div class="api-item"><code>&lt;van-checkbox&gt;</code><span>复选框</span></div>
        <div class="api-item"><code>&lt;van-radio&gt;</code><span>单选框</span></div>
        <div class="api-item"><code>&lt;van-switch&gt;</code><span>开关</span></div>
        <div class="api-item"><code>&lt;van-dropdown-menu&gt;</code><span>下拉菜单</span></div>
        <div class="api-item"><code>&lt;van-grid&gt;</code><span>宫格</span></div>
      </div>
    </section>

    <!-- 操作日志 -->
    <section class="card">
      <h2>操作日志</h2>
      <div class="log-area">
        <div v-if="log.length === 0" class="log-empty">暂无操作记录</div>
        <div v-for="(item, i) in log" :key="i" class="log-item">{{ item }}</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page { max-width: 960px; margin: 0 auto; padding: 24px; }
.page-header { text-align: center; margin-bottom: 24px; }
.page-header h1 { font-size: 24px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; }
.card { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; padding-bottom: 6px; border-bottom: 1px solid #f0f0f0; }
.demo-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.note { font-size: 13px; color: #999; margin: 8px 0; }
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; font-size: 13px; line-height: 1.6; overflow-x: auto; white-space: pre; margin-top: 12px; }
.api-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
.api-item { display: flex; flex-direction: column; gap: 4px; padding: 10px; background: #f7f8fa; border-radius: 8px; }
.api-item code { font-size: 13px; color: #1989fa; font-weight: 500; }
.api-item span { font-size: 12px; color: #999; }
.log-area { max-height: 200px; overflow-y: auto; background: #fafafa; border-radius: 8px; padding: 12px; }
.log-empty { color: #ccc; text-align: center; padding: 20px; }
.log-item { font-size: 12px; color: #666; padding: 3px 0; font-family: monospace; border-bottom: 1px dashed #f0f0f0; }
@media (max-width: 768px) { .api-grid { grid-template-columns: repeat(3, 1fr); } }
</style>
