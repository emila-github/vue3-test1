<script setup lang="ts">
import { ref } from 'vue'

const notifications = ref(true)
const darkMode = ref(false)
const language = ref('zh-CN')
</script>

<template>
  <div class="child-page">
    <h4>⚙️ 账号设置</h4>
    <p>这是嵌套子路由页面：设置。URL：<code>/vue-router/stage3/settings</code></p>
    <a-form layout="vertical" :model="{ notifications, darkMode, language }">
      <a-form-item label="消息通知">
        <a-switch v-model:checked="notifications" />
      </a-form-item>
      <a-form-item label="深色模式">
        <a-switch v-model:checked="darkMode" />
      </a-form-item>
      <a-form-item label="语言偏好">
        <a-select v-model:value="language" style="width: 120px">
          <a-select-option value="zh-CN">简体中文</a-select-option>
          <a-select-option value="en">English</a-select-option>
          <a-select-option value="ja">日本語</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.child-page {
  padding: 4px;
}

.child-page h4 {
  margin: 0 0 8px;
  font-size: 15px;
  color: #333;
}

.child-page p {
  font-size: 13px;
  color: #666;
  margin: 0 0 12px;
}

.child-page code {
  background: #f0f0f0;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  color: #d63384;
}
</style>
