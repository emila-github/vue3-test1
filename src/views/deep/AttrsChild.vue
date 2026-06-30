<script setup lang="ts">
import { useAttrs } from 'vue'

// 使用 defineOptions 禁用自动透传（展示 useAttrs 用途）
defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()
const attrsList = Object.entries(attrs).filter(([key]) => !key.startsWith('on') && key !== 'style')
</script>

<template>
  <div class="attrs-child">
    <!-- 手动绑定 $attrs -->
    <button v-bind="$attrs" class="inner-btn">手动 v-bind="$attrs"</button>

    <div class="attrs-display">
      <p class="label">透传属性列表（useAttrs()）：</p>
      <div v-if="attrsList.length">
        <p v-for="[key, value] in attrsList" :key="key" class="attr-item">
          <code>{{ key }}</code> = {{ value }}
        </p>
      </div>
      <p v-else class="hint">无额外透传属性</p>
    </div>
  </div>
</template>

<style scoped>
.attrs-child {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e8e8e8;
}

.inner-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
}

.inner-btn:hover {
  border-color: #eb2f96;
  color: #eb2f96;
}

.attrs-display {
  margin-top: 12px;
  padding: 10px;
  background: #1e1e1e;
  border-radius: 6px;
  font-family: monospace;
  font-size: 13px;
}

.label {
  color: #888;
  margin: 0 0 6px 0;
}

.attr-item {
  margin: 2px 0;
  color: #a0d911;
}

.attr-item code {
  color: #ffa940;
}

.hint {
  color: #666;
}
</style>
