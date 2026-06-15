<script setup lang="ts">
import { ref } from 'vue'

// ====== 基本表单 ======
const message = ref('')
const textarea = ref('')
const checked = ref(false)
const checkboxGroup = ref<string[]>([])
const picked = ref('')
const selected = ref('')
const multiSelected = ref<string[]>([])

// ====== 修饰符 ======
const lazyMsg = ref('')
const age = ref(0)
const trimMsg = ref('')
</script>

<template>
  <div class="demo-page">
    <h1>表单输入绑定</h1>

    <!-- 1. 基本表单 -->
    <section class="demo-section">
      <h2>1. 基本表单元素</h2>

      <div class="form-group">
        <label>文本输入：</label>
        <input v-model="message" placeholder="输入内容" />
        <span class="result">→ {{ message }}</span>
      </div>

      <div class="form-group">
        <label>多行文本：</label>
        <textarea v-model="textarea" placeholder="多行输入"></textarea>
        <span class="result">→ {{ textarea }}</span>
      </div>

      <div class="form-group">
        <label>
          <input type="checkbox" v-model="checked" />
          同意协议
        </label>
        <span class="result">→ {{ checked }}</span>
      </div>

      <div class="form-group">
        <label>多选框组：</label>
        <label><input type="checkbox" v-model="checkboxGroup" value="A" /> A</label>
        <label><input type="checkbox" v-model="checkboxGroup" value="B" /> B</label>
        <label><input type="checkbox" v-model="checkboxGroup" value="C" /> C</label>
        <span class="result">→ [{{ checkboxGroup.join(', ') }}]</span>
      </div>

      <div class="form-group">
        <label>单选按钮：</label>
        <label><input type="radio" v-model="picked" value="one" /> One</label>
        <label><input type="radio" v-model="picked" value="two" /> Two</label>
        <span class="result">→ {{ picked }}</span>
      </div>

      <div class="form-group">
        <label>下拉选择：</label>
        <select v-model="selected">
          <option disabled value="">请选择</option>
          <option value="A">选项 A</option>
          <option value="B">选项 B</option>
          <option value="C">选项 C</option>
        </select>
        <span class="result">→ {{ selected }}</span>
      </div>

      <div class="form-group">
        <label>多选下拉：</label>
        <select v-model="multiSelected" multiple>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
        <span class="result">→ [{{ multiSelected.join(', ') }}]</span>
      </div>
    </section>

    <!-- 2. 修饰符 -->
    <section class="demo-section">
      <h2>2. v-model 修饰符</h2>

      <div class="form-group">
        <label>.lazy：</label>
        <input v-model.lazy="lazyMsg" placeholder="失去焦点时更新" />
        <span class="result">→ "{{ lazyMsg }}"</span>
        <p class="hint">修改后点击其他地方（失去焦点）才更新</p>
      </div>

      <div class="form-group">
        <label>.number：</label>
        <input v-model.number="age" type="number" placeholder="自动转数字" />
        <span class="result">→ age + 10 = {{ age + 10 }}</span>
      </div>

      <div class="form-group">
        <label>.trim：</label>
        <input v-model.trim="trimMsg" placeholder="自动去除首尾空格" />
        <span class="result">→ "{{ trimMsg }}"</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #faad14;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

.form-group {
  margin: 12px 0;
  padding: 10px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

.form-group label {
  display: inline-block;
  min-width: 100px;
  font-weight: 500;
  color: #555;
  margin-right: 8px;
}

.form-group label + label {
  min-width: auto;
  font-weight: normal;
}

input[type='text'],
input[type='number'],
textarea,
select {
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

textarea {
  vertical-align: top;
}

.result {
  margin-left: 10px;
  color: #1890ff;
  font-weight: bold;
  font-family: monospace;
}

.hint {
  color: #999;
  font-size: 13px;
  margin: 4px 0 0 0;
}

select[multiple] {
  height: 80px;
}
</style>
