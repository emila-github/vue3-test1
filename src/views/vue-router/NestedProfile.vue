<script setup lang="ts"></script>

<template>
  <div class="child-page">
    <h4>👤 个人资料</h4>
    <p>
      这是嵌套子路由页面：个人资料。注意 URL 变成了
      <code>/vue-router/stage3/profile</code>，但页面的公共布局（顶栏和标签）保持不变。
    </p>
    <a-descriptions bordered size="small" :column="2">
      <a-descriptions-item label="用户名">张三</a-descriptions-item>
      <a-descriptions-item label="角色">前端开发</a-descriptions-item>
      <a-descriptions-item label="邮箱">zhangsan@example.com</a-descriptions-item>
      <a-descriptions-item label="手机">138****1234</a-descriptions-item>
    </a-descriptions>
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
