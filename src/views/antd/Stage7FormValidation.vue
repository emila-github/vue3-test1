<script setup lang="ts">
/**
 * 阶段七：Ant Design Vue 表单校验进阶
 * 深入演示 Form 校验体系：内置规则、自定义校验、动态校验、嵌套表单、异步校验
 */
import { ref, reactive, computed, h } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance, FormItemRule } from 'ant-design-vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(msg)
  message.info(msg)
}

// ============ 1. 基础表单校验 ============
interface BasicForm {
  username: string
  password: string
  confirmPassword: string
  email: string
  phone: string
  age: number | null
  agree: boolean
}

const basicFormRef = ref<FormInstance>()
const basicForm = reactive<BasicForm>({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
  age: null,
  agree: false,
})

// 内置校验规则 + 自定义校验
const validatePassword = (_rule: FormItemRule, value: string) => {
  if (!value) return Promise.reject('请输入密码')
  if (value.length < 6) return Promise.reject('密码长度至少 6 位')
  if (!/[a-z]/.test(value)) return Promise.reject('密码需要包含小写字母')
  if (!/\d/.test(value)) return Promise.reject('密码需要包含数字')
  return Promise.resolve()
}

const validateConfirmPassword = (_rule: FormItemRule, value: string) => {
  if (!value) return Promise.reject('请再次输入密码')
  if (value !== basicForm.password) return Promise.reject('两次输入的密码不一致')
  return Promise.resolve()
}

const basicFormRules: Record<string, FormItemRule[]> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度 3-20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' },
  ],
  password: [
    { required: true, validator: validatePassword, trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 1, max: 150, message: '年龄范围 1-150', trigger: 'blur' },
  ],
  agree: [
    {
      validator: (_rule, value) => {
        if (!value) return Promise.reject('请同意用户协议')
        return Promise.resolve()
      },
      trigger: 'change',
    },
  ],
}

function handleBasicSubmit() {
  basicFormRef.value?.validate().then(() => {
    message.success('表单校验通过！')
    addLog('基础表单校验通过: ' + JSON.stringify(basicForm))
  }).catch((err) => {
    message.error('表单校验失败，请检查红色提示')
    addLog('表单校验失败')
  })
}

function handleBasicReset() {
  basicFormRef.value?.resetFields()
  addLog('基础表单已重置')
}

// ============ 2. 动态表单校验 ============
interface DynamicItem {
  name: string
  value: string
}

const dynamicFormRef = ref<FormInstance>()
const dynamicItems = reactive<DynamicItem[]>([
  { name: '', value: '' },
])

function addItem() {
  dynamicItems.push({ name: '', value: '' })
  addLog('添加表单项（动态校验规则自动生效）')
}

function removeItem(index: number) {
  dynamicItems.splice(index, 1)
  addLog('移除表单项')
}

function handleDynamicSubmit() {
  dynamicFormRef.value?.validate().then(() => {
    message.success('动态表单校验通过！')
    addLog('动态表单校验通过')
  }).catch(() => {
    message.error('动态表单校验失败')
  })
}

// ============ 3. 异步校验 ============
const asyncFormRef = ref<FormInstance>()
const asyncForm = reactive({
  username: '',
})

// 模拟后端校验用户名是否已存在
const validateUsernameUnique = async (_rule: FormItemRule, value: string) => {
  if (!value) return Promise.reject('请输入用户名')
  // 模拟异步请求（300-800ms 延迟）
  await new Promise((r) => setTimeout(r, 500 + Math.random() * 500))
  const existingNames = ['admin', 'root', 'test', 'user']
  if (existingNames.includes(value.toLowerCase())) {
    return Promise.reject(`用户名 "${value}" 已被占用`)
  }
  return Promise.resolve()
}

const asyncFormRules: Record<string, FormItemRule[]> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { validator: validateUsernameUnique, trigger: 'blur' },
  ],
}

function handleAsyncSubmit() {
  asyncFormRef.value?.validate().then(() => {
    message.success('用户名可用！')
    addLog(`异步校验通过：${asyncForm.username} 可用`)
  }).catch(() => {
    addLog('异步校验失败')
  })
}

// ============ 4. 表单联动校验 ============
const linkedFormRef = ref<FormInstance>()
const linkedForm = reactive({
  type: 'individual' as 'individual' | 'company',
  name: '',
  companyName: '',
  taxId: '',
})

// type 为 company 时，companyName 和 taxId 必填
const linkedFormRules = computed<Record<string, FormItemRule[]>>(() => ({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  companyName: [
    {
      required: linkedForm.type === 'company',
      message: '请输入公司名称',
      trigger: 'blur',
    },
  ],
  taxId: [
    {
      required: linkedForm.type === 'company',
      message: '请输入税号',
      trigger: 'blur',
    },
  ],
}))

function handleTypeChange() {
  // 切换类型时清除公司相关字段
  linkedForm.companyName = ''
  linkedForm.taxId = ''
  linkedFormRef.value?.clearValidate()
  addLog(`表单类型切换到：${linkedForm.type === 'individual' ? '个人' : '公司'}`)
}

function handleLinkedSubmit() {
  linkedFormRef.value?.validate().then(() => {
    message.success('联动表单校验通过！')
    addLog('联动表单校验通过')
  }).catch(() => {
    message.error('联动表单校验失败')
  })
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 7：Ant Design Vue 表单校验进阶</h1>
      <p>深入掌握 <code>a-form</code> 校验体系：内置规则、自定义校验、动态校验、异步校验、表单联动。</p>
    </header>

    <!-- 1. 校验规则体系总览 -->
    <section class="card">
      <h2>7.1 校验规则体系总览</h2>
      <pre class="code-block">
const rules = {
  field: [
    // 1. 必填
    { required: true, message: '必填项', trigger: 'blur' },

    // 2. 类型校验 (string/number/boolean/email/url/...)
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },

    // 3. 长度校验
    { min: 3, max: 20, message: '长度 3-20', trigger: 'blur' },

    // 4. 正则校验
    { pattern: /^[a-zA-Z]+$/, message: '仅限字母', trigger: 'blur' },

    // 5. 自定义校验函数
    { validator: (rule, value) => { /* 同步或异步 */ }, trigger: 'blur' },

    // 6. 长度/数值范围
    { type: 'number', min: 1, max: 100, message: '范围 1-100', trigger: 'blur' },
  ],
}</pre>
      <div class="tip-box">
        <strong>要点：</strong>
        <ul>
          <li>每个字段的校验规则是一个<strong>数组</strong>，按顺序执行</li>
          <li><code>trigger</code> 可设为 <code>'blur'</code>（失焦）或 <code>'change'</code>（变化时）</li>
          <li>自定义 <code>validator</code> 返回 <code>Promise.resolve()</code> 表示通过，<code>Promise.reject(msg)</code> 表示失败</li>
          <li>使用 <code>computed</code> 可实现动态校验规则（见 7.5）</li>
        </ul>
      </div>
    </section>

    <!-- 2. 基础表单校验 -->
    <section class="card">
      <h2>7.2 基础表单校验（内置规则 + 自定义）</h2>
      <div class="demo-box">
        <a-form ref="basicFormRef" :model="basicForm" :rules="basicFormRules" layout="vertical">
          <div class="form-grid">
            <a-form-item label="用户名" name="username">
              <a-input v-model:value="basicForm.username" placeholder="3-20个字符，字母/数字/下划线" />
            </a-form-item>
            <a-form-item label="邮箱" name="email">
              <a-input v-model:value="basicForm.email" placeholder="example@mail.com" />
            </a-form-item>
            <a-form-item label="密码" name="password">
              <a-input-password v-model:value="basicForm.password" placeholder="至少6位，包含字母和数字" />
            </a-form-item>
            <a-form-item label="确认密码" name="confirmPassword">
              <a-input-password v-model:value="basicForm.confirmPassword" placeholder="再次输入密码" />
            </a-form-item>
            <a-form-item label="手机号" name="phone">
              <a-input v-model:value="basicForm.phone" placeholder="11位大陆手机号" />
            </a-form-item>
            <a-form-item label="年龄" name="age">
              <a-input-number v-model:value="basicForm.age" :min="1" :max="150" placeholder="1-150" style="width: 100%" />
            </a-form-item>
          </div>
          <a-form-item name="agree">
            <a-checkbox v-model:checked="basicForm.agree">
              我已阅读并同意<a href="javascript:void(0)">《用户协议》</a>
            </a-checkbox>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="handleBasicSubmit">提交</a-button>
              <a-button @click="handleBasicReset">重置</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
    </section>

    <!-- 3. 动态表单校验 -->
    <section class="card">
      <h2>7.3 动态表单校验</h2>
      <p>动态增加/删除表单项，校验规则自动应用。<code>v-for</code> 配合 <code>:name</code> 索引绑定。</p>
      <div class="demo-box">
        <a-form ref="dynamicFormRef" layout="vertical">
          <div v-for="(item, i) in dynamicItems" :key="i" class="dynamic-row">
            <a-form-item :label="`配置项 #${i + 1}`" :name="['items', i, 'name']" :rules="[{ required: true, message: `请输入名称`, trigger: 'blur' }]">
              <a-input v-model:value="item.name" placeholder="名称" />
            </a-form-item>
            <a-form-item :name="['items', i, 'value']" :rules="[{ required: true, message: '请输入值', trigger: 'blur' }]">
              <a-input v-model:value="item.value" placeholder="值" />
            </a-form-item>
            <a-button v-if="dynamicItems.length > 1" danger size="small" @click="removeItem(i)">删除</a-button>
          </div>
        </a-form>
        <div class="btn-row mt8">
          <a-button @click="addItem">+ 添加配置项</a-button>
          <a-button type="primary" @click="handleDynamicSubmit">提交动态表单</a-button>
        </div>
      </div>
    </section>

    <!-- 4. 异步校验 -->
    <section class="card">
      <h2>7.4 异步校验（模拟后端请求）</h2>
      <p>通过 <code>async validator</code> 实现用户名唯一性检查。</p>
      <pre class="code-block">
const validateUnique = async (_rule, value) => {
  if (!value) return Promise.reject('请输入')
  // 模拟后端请求
  const exists = await api.checkUsername(value)
  if (exists) return Promise.reject('用户名已被占用')
  return Promise.resolve()
}</pre>
      <div class="demo-box">
        <a-form ref="asyncFormRef" :model="asyncForm" :rules="asyncFormRules" layout="inline">
          <a-form-item label="用户名" name="username">
            <a-input v-model:value="asyncForm.username" placeholder="输入 admin/root/test 会失败" style="width: 280px" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleAsyncSubmit">校验</a-button>
          </a-form-item>
        </a-form>
        <p class="hint">输入 admin、root、test、user 等用户名会被判定为已占用</p>
      </div>
    </section>

    <!-- 5. 表单联动校验 -->
    <section class="card">
      <h2>7.5 表单联动校验（动态规则）</h2>
      <p>使用 <code>computed</code> 定义校验规则，根据表单状态动态调整必填项。</p>
      <pre class="code-block">
const rules = computed(() => ({
  companyName: [{
    required: form.type === 'company',  // 动态 required
    message: '公司名称必填', trigger: 'blur',
  }]
}))</pre>
      <div class="demo-box">
        <a-form ref="linkedFormRef" :model="linkedForm" :rules="linkedFormRules" layout="vertical" style="max-width: 400px">
          <a-form-item label="类型" name="type">
            <a-radio-group v-model:value="linkedForm.type" @change="handleTypeChange">
              <a-radio value="individual">个人</a-radio>
              <a-radio value="company">公司</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="名称" name="name">
            <a-input v-model:value="linkedForm.name" placeholder="您的名称" />
          </a-form-item>
          <template v-if="linkedForm.type === 'company'">
            <a-form-item label="公司名称" name="companyName">
              <a-input v-model:value="linkedForm.companyName" placeholder="公司全称" />
            </a-form-item>
            <a-form-item label="税号" name="taxId">
              <a-input v-model:value="linkedForm.taxId" placeholder="统一社会信用代码" />
            </a-form-item>
          </template>
          <a-form-item>
            <a-button type="primary" @click="handleLinkedSubmit">提交</a-button>
          </a-form-item>
        </a-form>
      </div>
    </section>

    <!-- 日志 -->
    <section class="card">
      <h2>操作日志</h2>
      <div class="log-area">
        <div v-for="(item, i) in log" :key="i" class="log-item">[{{ i + 1 }}] {{ item }}</div>
        <div v-if="log.length === 0" class="log-empty">暂无操作记录</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}
.page-header h1 { font-size: 26px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; }
.page-header code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 13px; }

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.card h2 { margin: 0 0 12px; font-size: 18px; color: #333; }
.card p { font-size: 14px; color: #666; line-height: 1.6; margin: 0 0 12px; }

.code-block {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin-bottom: 16px;
  white-space: pre-wrap;
}

.tip-box {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #389e0d;
}
.tip-box strong { display: block; margin-bottom: 4px; }
.tip-box ul { margin: 4px 0 0; padding-left: 18px; }
.tip-box li { margin-bottom: 2px; }

.demo-box {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.mt8 { margin-top: 8px; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 20px;
}

.btn-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.hint {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.dynamic-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 8px;
}

.log-area { max-height: 200px; overflow-y: auto; font-size: 13px; }
.log-item { padding: 4px 0; color: #555; border-bottom: 1px dashed #f0f0f0; }
.log-empty { color: #ccc; text-align: center; padding: 20px; }

@media (max-width: 640px) {
  .stage-page { padding: 16px; }
  .form-grid { grid-template-columns: 1fr; }
  .dynamic-row { flex-direction: column; }
}
</style>
