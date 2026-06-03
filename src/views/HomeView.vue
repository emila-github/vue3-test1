<script setup lang="ts">
import { RouterLink } from 'vue-router'

const demos = [
  { path: '/template-syntax', title: '模板语法', desc: '文本插值、v-html、v-bind、表达式', color: '#1890ff' },
  { path: '/reactivity', title: '响应式基础', desc: 'ref()、reactive()、toRefs、shallowRef', color: '#52c41a' },
  { path: '/computed', title: '计算属性', desc: 'computed、可写计算属性、搜索过滤', color: '#fa8c16' },
  { path: '/class-style', title: '类与样式绑定', desc: ':class 对象/数组语法、:style 绑定', color: '#722ed1' },
  { path: '/conditional', title: '条件渲染', desc: 'v-if/v-else-if/v-else、v-show', color: '#13c2c2' },
  { path: '/list', title: '列表渲染', desc: 'v-for、key、数组变更、过滤排序', color: '#eb2f96' },
  { path: '/events', title: '事件处理', desc: 'v-on、事件修饰符、按键修饰符', color: '#2f54eb' },
  { path: '/form', title: '表单输入绑定', desc: 'v-model、修饰符 .lazy .number .trim', color: '#faad14' },
  { path: '/watchers', title: '侦听器', desc: 'watch、watchEffect、监听多个数据源', color: '#a0d911' },
  { path: '/template-refs', title: '模板引用', desc: 'ref DOM 元素、组件实例、defineExpose', color: '#f5222d' },
  { path: '/components-demo', title: '组件基础', desc: 'Props、Emits、Slots、作用域插槽', color: '#1890ff' },
  { path: '/lifecycle', title: '生命周期', desc: 'onMounted、onUpdated、onBeforeUnmount...', color: '#597ef7' },
]
</script>

<template>
  <div class="home-page">
    <h1>Vue 3 学习示例</h1>
    <p class="subtitle">点击下方卡片查看各知识点的交互示例</p>

    <div class="demo-grid">
      <RouterLink
        v-for="demo in demos"
        :key="demo.path"
        :to="demo.path"
        class="demo-card"
        :style="{ borderLeftColor: demo.color }"
      >
        <h2 class="demo-title">{{ demo.title }}</h2>
        <p class="demo-desc">{{ demo.desc }}</p>
        <span class="demo-arrow">→</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 30px 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 28px;
}

.subtitle {
  text-align: center;
  color: #999;
  margin-bottom: 30px;
  font-size: 15px;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.demo-card {
  display: block;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #1890ff;
  text-decoration: none;
  color: #333;
  transition: all 0.2s;
  position: relative;
}

.demo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.demo-title {
  margin: 0 0 6px 0;
  font-size: 17px;
  color: #2c3e50;
}

.demo-desc {
  margin: 0;
  font-size: 13px;
  color: #999;
}

.demo-arrow {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #ccc;
  font-size: 18px;
  transition: color 0.2s;
}

.demo-card:hover .demo-arrow {
  color: #1890ff;
}
</style>
