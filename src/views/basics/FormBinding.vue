<script setup lang="ts">
import { ref } from 'vue'

// ====================================================================
// 1. v-model 基本用法
// ====================================================================
// 核心思想：v-model 实现表单元素和数据之间的"双向绑定"
//   输入框内容变化 → 数据自动更新
//   数据变化 → 输入框内容自动更新
//
// 类比：v-model 就像"双面胶"🪞
//   数据 ↔ 视图，两面粘在一起
//   改了数据，视图自动变；改了视图，数据自动变

const message = ref('')
const textarea = ref('')
const checked = ref(false)
const checkboxGroup = ref<string[]>([])
const picked = ref('')
const selected = ref('')
const multiSelected = ref<string[]>([])

const vModelCode = `// v-model：双向绑定，数据与表单同步

// 文本输入
<input v-model="message" />
// message 和输入框内容始终一致

// 多行文本
<textarea v-model="textarea"></textarea>

// 单个复选框 → 绑定布尔值
<input type="checkbox" v-model="checked" />
// checked = true/false

// 多个复选框 → 绑定数组
<input type="checkbox" v-model="group" value="A" />
<input type="checkbox" v-model="group" value="B" />
// group = ['A', 'B']（选中的值）

// 单选按钮 → 绑定选中的 value
<input type="radio" v-model="picked" value="one" />
// picked = 'one'

// 下拉选择
<select v-model="selected">
  <option value="A">选项 A</option>
</select>

// 多选下拉
<select v-model="multi" multiple>
  <option value="A">A</option>
</select>`

// ====================================================================
// 2. v-model 修饰符
// ====================================================================
const lazyMsg = ref('')
const age = ref(0)
const trimMsg = ref('')

const modifierCode = `// v-model 修饰符

// .lazy → 不在 input 时更新，在 change 时更新（失去焦点）
<input v-model.lazy="msg" />
// 输入时不更新，按回车或失去焦点时才更新

// .number → 自动转为数字类型
<input v-model.number="age" type="number" />
// 输入 "25" → age = 25（number 类型）

// .trim → 自动去除首尾空格
<input v-model.trim="name" />
// 输入 " 张三 " → name = "张三"（去除首尾空格）`
</script>

<template>
  <div class="demo-page">
    <h1 class="page-title">📝 表单输入绑定</h1>
    <p class="page-subtitle">v-model — 数据与表单的双向同步</p>

    <!-- ==================== 前置说明 ==================== -->
    <section class="demo-section intro-section">
      <h2>📖 什么是表单绑定？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong><code>v-model</code> 让<em>表单元素的值和 JS 数据自动同步</em>，输入即更新，更新即显示。
        </p>

        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><code>v-model</code> 本质是 <code>:value</code> + <code>@input</code> 的语法糖</li>
            <li>不同表单元素有不同绑定规则：文本→字符串，复选框→布尔/数组</li>
            <li><strong>修饰符</strong>：<code>.lazy</code> 延迟更新、<code>.number</code> 转数字、<code>.trim</code> 去空格</li>
            <li><code>v-model</code> 只能用于表单元素，不能用于普通 div</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 1. 基本表单 -->
    <section class="demo-section">
      <h2>1. 基本表单元素 — v-model 双向绑定</h2>
      <p class="section-desc">
        输入即更新——右边实时显示绑定的数据值。
      </p>
      <pre class="code-block">{{ vModelCode }}</pre>

      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">文本输入：</label>
          <input v-model="message" placeholder="输入内容" />
          <span class="result">→ "{{ message }}"</span>
        </div>

        <div class="form-group">
          <label class="form-label">多行文本：</label>
          <textarea v-model="textarea" placeholder="多行输入"></textarea>
          <span class="result">→ "{{ textarea }}"</span>
        </div>

        <div class="form-group">
          <label class="form-label">
            <input type="checkbox" v-model="checked" />
            同意协议
          </label>
          <span class="result">→ {{ checked }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">多选框组：</label>
          <label class="check-label"><input type="checkbox" v-model="checkboxGroup" value="A" /> A</label>
          <label class="check-label"><input type="checkbox" v-model="checkboxGroup" value="B" /> B</label>
          <label class="check-label"><input type="checkbox" v-model="checkboxGroup" value="C" /> C</label>
          <span class="result">→ [{{ checkboxGroup.join(', ') }}]</span>
        </div>

        <div class="form-group">
          <label class="form-label">单选按钮：</label>
          <label class="check-label"><input type="radio" v-model="picked" value="one" /> One</label>
          <label class="check-label"><input type="radio" v-model="picked" value="two" /> Two</label>
          <span class="result">→ {{ picked || '(未选)' }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">下拉选择：</label>
          <select v-model="selected">
            <option disabled value="">请选择</option>
            <option value="A">选项 A</option>
            <option value="B">选项 B</option>
            <option value="C">选项 C</option>
          </select>
          <span class="result">→ {{ selected || '(未选)' }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">多选下拉：</label>
          <select v-model="multiSelected" multiple>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
          <span class="result">→ [{{ multiSelected.join(', ') }}]</span>
        </div>
      </div>
    </section>

    <!-- 2. 修饰符 -->
    <section class="demo-section">
      <h2>2. v-model 修饰符</h2>
      <p class="section-desc">
        <code>.lazy</code> 延迟更新、<code>.number</code> 转数字、<code>.trim</code> 去空格。
      </p>
      <pre class="code-block">{{ modifierCode }}</pre>

      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">.lazy：</label>
          <input v-model.lazy="lazyMsg" placeholder="失去焦点时更新" />
          <span class="result">→ "{{ lazyMsg }}"</span>
          <p class="hint">修改后点击其他地方（失去焦点）才更新</p>
        </div>

        <div class="form-group">
          <label class="form-label">.number：</label>
          <input v-model.number="age" type="number" placeholder="自动转数字" />
          <span class="result">→ age + 10 = {{ age + 10 }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">.trim：</label>
          <input v-model.trim="trimMsg" placeholder="自动去除首尾空格" />
          <span class="result">→ "{{ trimMsg }}"</span>
        </div>
      </div>
    </section>

    <!-- ==================== 速查表 ==================== -->
    <section class="demo-section summary-section">
      <h2>📋 v-model 速查表</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>表单元素</th>
            <th>v-model 绑定类型</th>
            <th>示例</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>文本输入</td>
            <td>string</td>
            <td><code>v-model="msg"</code></td>
          </tr>
          <tr>
            <td>多行文本</td>
            <td>string</td>
            <td><code>v-model="text"</code></td>
          </tr>
          <tr>
            <td>单个复选框</td>
            <td>boolean</td>
            <td><code>v-model="checked"</code></td>
          </tr>
          <tr>
            <td>多个复选框</td>
            <td>string[]</td>
            <td><code>v-model="arr"</code> + <code>value</code></td>
          </tr>
          <tr>
            <td>单选按钮</td>
            <td>string</td>
            <td><code>v-model="picked"</code> + <code>value</code></td>
          </tr>
          <tr>
            <td>下拉单选</td>
            <td>string</td>
            <td><code>v-model="selected"</code></td>
          </tr>
          <tr>
            <td>下拉多选</td>
            <td>string[]</td>
            <td><code>v-model="arr" multiple</code></td>
          </tr>
          <tr>
            <td>.lazy</td>
            <td>延迟到 change</td>
            <td><code>v-model.lazy</code></td>
          </tr>
          <tr>
            <td>.number</td>
            <td>转为数字</td>
            <td><code>v-model.number</code></td>
          </tr>
          <tr>
            <td>.trim</td>
            <td>去首尾空格</td>
            <td><code>v-model.trim</code></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
/* ===== 页面头部 ===== */
.demo-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.page-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 28px;
}

.page-subtitle {
  text-align: center;
  color: #888;
  font-size: 14px;
  margin-bottom: 30px;
}

/* ===== 通用 Section ===== */
.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  border-left: 4px solid #faad14;
}

.demo-section h2 {
  margin-top: 0;
  color: #1a1a1a;
  font-size: 18px;
}

.section-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.7;
  margin: 8px 0 14px;
}

.section-desc code {
  background: #e8e8e8;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 13px;
  color: #cf1322;
}

/* ===== 介绍区域 ===== */
.intro-section {
  border-left-color: #fa8c16;
  background: #fffbe6;
}

.explain-box {
  line-height: 1.8;
}

.explain-box p {
  margin: 6px 0;
  color: #444;
}

.key-points {
  background: #fff;
  border: 1px solid #ffd591;
  border-radius: 6px;
  padding: 12px 16px;
  margin-top: 12px;
}

.key-points p {
  margin: 0 0 6px;
  color: #d46b08;
}

.key-points ul {
  margin: 0;
  padding-left: 20px;
}

.key-points li {
  margin: 4px 0;
  font-size: 14px;
  color: #555;
}

.key-points code {
  background: #fff3e0;
  padding: 1px 5px;
  border-radius: 3px;
  color: #d46b08;
}

/* ===== 代码块 ===== */
.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 14px 16px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  margin: 0 0 12px;
  white-space: pre;
}

/* ===== 表单网格 ===== */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group {
  padding: 10px 14px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.form-label {
  font-weight: 500;
  color: #555;
  min-width: 100px;
}

.check-label {
  font-weight: normal;
  font-size: 14px;
  color: #555;
  white-space: nowrap;
}

.check-label input[type='checkbox'],
.check-label input[type='radio'] {
  margin-right: 4px;
  vertical-align: middle;
}

input[type='text'],
input[type='number'],
input[type='password'],
textarea,
select {
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

textarea {
  vertical-align: top;
  min-width: 200px;
}

select[multiple] {
  height: 80px;
}

.result {
  margin-left: 8px;
  color: #1890ff;
  font-weight: bold;
  font-family: monospace;
  font-size: 14px;
}

.hint {
  color: #999;
  font-size: 13px;
  width: 100%;
  margin: 2px 0 0 108px;
}

/* ===== 速查表 ===== */
.summary-section {
  border-left-color: #1890ff;
  background: #e6f7ff;
}

.summary-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 14px;
}

.summary-table th {
  background: #dbeafe;
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
  color: #1e40af;
  border-bottom: 2px solid #93c5fd;
}

.summary-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #e8e8e8;
  color: #444;
}

.summary-table code {
  background: #e8e8e8;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
  color: #cf1322;
  white-space: nowrap;
}

.summary-table tbody tr:hover {
  background: #f5f5f5;
}
</style>
