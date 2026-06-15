<script setup lang="ts">
import { ref } from 'vue'

// ====== v-if / v-else-if / v-else ======
const type = ref('A')
const types = ['A', 'B', 'C', 'D']

function changeType() {
  const index = types.indexOf(type.value)
  type.value = types[(index + 1) % types.length]
}

// ====== v-show ======
const isVisible = ref(true)

// ====== template 上使用 v-if ======
const isLoggedIn = ref(false)
const userName = ref('张三')

function login() {
  isLoggedIn.value = true
}
function logout() {
  isLoggedIn.value = false
}
</script>

<template>
  <div class="demo-page">
    <h1>条件渲染</h1>

    <!-- 1. v-if / v-else-if / v-else -->
    <section class="demo-section">
      <h2>1. v-if / v-else-if / v-else</h2>
      <p>当前类型：<strong>{{ type }}</strong></p>
      <div v-if="type === 'A'" class="type-box type-a">类型 A 的内容</div>
      <div v-else-if="type === 'B'" class="type-box type-b">类型 B 的内容</div>
      <div v-else-if="type === 'C'" class="type-box type-c">类型 C 的内容</div>
      <div v-else class="type-box type-other">其他类型的内容</div>
      <button @click="changeType">切换类型</button>
    </section>

    <!-- 2. v-show -->
    <section class="demo-section">
      <h2>2. v-show</h2>
      <div v-show="isVisible" class="type-box type-a">
        这个元素通过 v-show 控制
      </div>
      <p>isVisible: <strong>{{ isVisible }}</strong></p>
      <button @click="isVisible = !isVisible">切换显示</button>
      <p class="hint">元素始终存在于 DOM 中，只是通过 CSS display 切换</p>
    </section>

    <!-- 3. v-if vs v-show -->
    <section class="demo-section">
      <h2>3. v-if vs v-show 对比</h2>
      <table class="compare-table">
        <thead>
          <tr>
            <th>特性</th>
            <th>v-if</th>
            <th>v-show</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>渲染方式</td>
            <td>条件为 false 时不渲染</td>
            <td>始终渲染，CSS 隐藏</td>
          </tr>
          <tr>
            <td>切换开销</td>
            <td>高（销毁/重建）</td>
            <td>低（CSS 切换）</td>
          </tr>
          <tr>
            <td>初始开销</td>
            <td>低（false 时不渲染）</td>
            <td>高（始终渲染）</td>
          </tr>
          <tr>
            <td>适用场景</td>
            <td>条件很少改变</td>
            <td>频繁切换显示/隐藏</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 4. template 上使用 v-if -->
    <section class="demo-section">
      <h2>4. template 上使用 v-if</h2>
      <template v-if="isLoggedIn">
        <div class="logged-in">
          <h3>🎉 欢迎回来，{{ userName }}</h3>
          <button @click="logout">退出登录</button>
        </div>
      </template>
      <template v-else>
        <div class="logged-out">
          <p>请先登录</p>
          <button @click="login">登录</button>
        </div>
      </template>
      <p class="hint">template 标签本身不会渲染到 DOM 中</p>
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
  border-left: 4px solid #13c2c2;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

.type-box {
  padding: 12px 16px;
  border-radius: 6px;
  margin: 8px 0;
  font-weight: bold;
}

.type-a {
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.type-b {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.type-c {
  background: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.type-other {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #d9d9d9;
}

button {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  margin-top: 8px;
}

button:hover {
  border-color: #13c2c2;
  color: #13c2c2;
}

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 8px;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
}

.compare-table th,
.compare-table td {
  border: 1px solid #e8e8e8;
  padding: 8px 12px;
  text-align: left;
  font-size: 14px;
}

.compare-table th {
  background: #fafafa;
  font-weight: bold;
}

.logged-in {
  padding: 16px;
  background: #f6ffed;
  border-radius: 6px;
  border: 1px solid #b7eb8f;
}

.logged-in h3 {
  margin: 0 0 8px 0;
}

.logged-out {
  padding: 16px;
  background: #fff2f0;
  border-radius: 6px;
  border: 1px solid #ffccc7;
}
</style>
