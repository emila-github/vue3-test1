<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  likes: { type: Number, default: 0 },
  tags: { type: Array<string>, default: () => [] },
  status: {
    type: String,
    validator: (value: string) => ['active', 'inactive'].includes(value),
  },
  isActive: Boolean,
  disabled: Boolean,
})

// ✅ 正确：使用 computed 派生
const displayLikes = computed(() => `${props.likes} 人喜欢`)

// ✅ 正确：复制到本地状态
const localCount = ref(props.likes)

// 在模板中验证 status
const statusLabel = computed(() => (props.status === 'active' ? '✅ 激活' : '⛔ 未激活'))
</script>

<template>
  <div class="props-child">
    <h3>{{ title }}</h3>

    <div class="prop-list">
      <p><span class="label">likes (computed)：</span>{{ displayLikes }}</p>
      <p><span class="label">localCount (ref)：</span>{{ localCount }}</p>
      <p><span class="label">status：</span>{{ statusLabel }}</p>
      <p><span class="label">isActive：</span>{{ isActive }}</p>
      <p><span class="label">disabled：</span>{{ disabled }}</p>
      <p>
        <span class="label">tags：</span>
        <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.props-child {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e8e8e8;
}

h3 {
  margin: 0 0 12px 0;
  color: #1890ff;
}

.prop-list p {
  margin: 6px 0;
  font-size: 14px;
}

.label {
  color: #999;
  font-size: 13px;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  background: #f0f5ff;
  color: #2f54eb;
  border-radius: 3px;
  font-size: 12px;
  margin-right: 4px;
}
</style>
