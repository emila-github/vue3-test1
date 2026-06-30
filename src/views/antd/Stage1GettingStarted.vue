<script setup lang="ts">
/**
 * 阶段一：技术选型与项目起步
 * 演示 Ant Design Vue 4.2.6 基础组件的使用
 */
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { SmileOutlined, HomeOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons-vue'

// ===== Button 示例 =====
const btnLoading = ref(false)

function handleClick() {
  btnLoading.value = true
  setTimeout(() => {
    btnLoading.value = false
    message.success('操作成功！')
  }, 1500)
}

// ===== Select 示例 =====
const selected = ref<string>('vue')
const selectOptions = [
  { value: 'vue', label: 'Vue 3' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
]

// ===== Radio 示例 =====
const size = ref<string>('default')

// ===== Switch 示例 =====
const checked = ref(true)

// ===== DatePicker 示例 =====
const dateValue = ref<string>('')

// ===== Tag 示例 =====
const tags = ref(['Vue 3', 'TypeScript', 'Vite', 'Pinia'])

function handleClose(removedTag: string) {
  tags.value = tags.value.filter((t) => t !== removedTag)
}
</script>

<template>
  <div class="stage-page">
    <h1>阶段一：技术选型与项目起步</h1>
    <p class="subtitle">锁定技术栈 Vue 3.5 + Vite 6 + Ant Design Vue 4.2.6，全局注册后可直接使用所有组件。</p>

    <!-- Button 按钮 -->
    <section class="card">
      <h2>1.1 Button 按钮</h2>
      <p>支持多种类型、尺寸、加载状态。</p>
      <div class="demo-row">
        <a-button type="primary">Primary</a-button>
        <a-button type="default">Default</a-button>
        <a-button type="dashed">Dashed</a-button>
        <a-button type="text">Text</a-button>
        <a-button type="link">Link</a-button>
        <a-button danger>Danger</a-button>
      </div>
      <div class="demo-row">
        <a-button type="primary" :loading="btnLoading" @click="handleClick"> 点击加载 </a-button>
        <a-button type="primary" shape="circle">
          <template #icon><SmileOutlined /></template>
        </a-button>
        <a-button type="primary" disabled>Disabled</a-button>
      </div>
    </section>

    <!-- Icon 图标 -->
    <section class="card">
      <h2>1.2 Icon 图标</h2>
      <p>使用 <code>@ant-design/icons-vue</code> 按需引入。</p>
      <div class="demo-row icon-row">
        <HomeOutlined style="font-size: 24px; color: #1677ff" />
        <SettingOutlined style="font-size: 24px; color: #52c41a" />
        <UserOutlined style="font-size: 24px; color: #fa8c16" />
        <SmileOutlined style="font-size: 24px; color: #eb2f96" />
      </div>
    </section>

    <!-- Select 选择器 -->
    <section class="card">
      <h2>1.3 Select 选择器</h2>
      <div class="demo-row">
        <a-select v-model:value="selected" :options="selectOptions" style="width: 200px" />
        <span class="result-text">选中值：{{ selected }}</span>
      </div>
    </section>

    <!-- Radio 单选框 -->
    <section class="card">
      <h2>1.4 Radio 单选框</h2>
      <a-radio-group v-model:value="size">
        <a-radio-button value="small">Small</a-radio-button>
        <a-radio-button value="default">Default</a-radio-button>
        <a-radio-button value="large">Large</a-radio-button>
      </a-radio-group>
    </section>

    <!-- Switch 开关 -->
    <section class="card">
      <h2>1.5 Switch 开关</h2>
      <div class="demo-row">
        <a-switch v-model:checked="checked" />
        <span class="result-text">{{ checked ? '开启' : '关闭' }}</span>
      </div>
    </section>

    <!-- DatePicker 日期选择器 -->
    <section class="card">
      <h2>1.6 DatePicker 日期选择器</h2>
      <div class="demo-row">
        <a-date-picker v-model:value="dateValue" placeholder="请选择日期" />
        <span class="result-text">{{ dateValue || '未选择' }}</span>
      </div>
    </section>

    <!-- Tag 标签 -->
    <section class="card">
      <h2>1.7 Tag 标签</h2>
      <div class="demo-row">
        <a-tag v-for="tag in tags" :key="tag" closable @close="handleClose(tag)">
          {{ tag }}
        </a-tag>
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

h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: #f6f8fa;
  border-radius: 8px;
}

.card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.card h2 {
  font-size: 16px;
  color: #333;
  margin: 0 0 8px 0;
}

.card p {
  color: #888;
  font-size: 13px;
  margin: 0 0 12px 0;
}

.card p code {
  background: #f5f5f5;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.demo-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.icon-row {
  gap: 24px;
}

.result-text {
  font-size: 13px;
  color: #1677ff;
  margin-left: 12px;
}
</style>
