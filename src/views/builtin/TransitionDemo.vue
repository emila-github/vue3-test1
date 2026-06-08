<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import TransitionFadeChild from './TransitionFadeChild.vue'
import TransitionBounceChild from './TransitionBounceChild.vue'
import TransitionSlideChild from './TransitionSlideChild.vue'

const show = ref(true)
const showBounce = ref(false)
const showSlide = ref(false)

// 过渡模式演示
const modeView = ref(1)

// 组件间过渡
const tabs = [
  { key: 'fade', component: TransitionFadeChild, label: '淡入淡出' },
  { key: 'bounce', component: TransitionBounceChild, label: '弹跳' },
  { key: 'slide', component: TransitionSlideChild, label: '滑动' },
]
const currentTab = shallowRef(tabs[0])
const currentTabKey = ref(tabs[0].key)

function switchTab(key: string) {
  const tab = tabs.find((t) => t.key === key)
  if (tab) {
    currentTabKey.value = key
    currentTab.value = tab
  }
}
</script>

<template>
  <div>
    <!-- 基本 Transition -->
    <section class="demo-section">
      <h2>1. 基本过渡 (opacity)</h2>
      <button @click="show = !show" class="demo-btn">
        {{ show ? '隐藏' : '显示' }}
      </button>
      <Transition name="fade">
        <div v-if="show" class="box box-blue">
          <p>淡入淡出</p>
        </div>
      </Transition>
      <pre class="code-hint">.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }</pre>
    </section>

    <!-- CSS Animation -->
    <section class="demo-section">
      <h2>2. CSS Animation (弹跳)</h2>
      <button @click="showBounce = !showBounce" class="demo-btn">
        {{ showBounce ? '隐藏' : '显示' }}
      </button>
      <Transition name="bounce">
        <div v-if="showBounce" class="box box-green">
          <p>弹跳动画</p>
        </div>
      </Transition>
      <pre class="code-hint">.bounce-enter-active { animation: bounce-in 0.5s; }
.bounce-leave-active { animation: bounce-in 0.5s reverse; }

@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1); }
}</pre>
    </section>

    <!-- 滑动 + 过渡模式 -->
    <section class="demo-section">
      <h2>3. 滑动 + mode="out-in"</h2>
      <div class="mode-btns">
        <button @click="showSlide = !showSlide" class="demo-btn">
          Toggle
        </button>
        <button @click="modeView = modeView === 1 ? 2 : 1" class="demo-btn">
          mode="out-in" 演示 (当前: View {{ modeView }})
        </button>
      </div>
      <Transition name="slide" mode="out-in">
        <div :key="modeView" class="box box-orange">
          <p>View {{ modeView }}</p>
        </div>
      </Transition>
      <p class="hint">out-in: 先离开再进入，避免两个元素同时出现</p>
    </section>

    <!-- 组件间过渡 -->
    <section class="demo-section">
      <h2>4. 组件间过渡</h2>
      <div class="tab-btns">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="switchTab(tab.key)"
          :class="{ 'tab-active': currentTabKey === tab.key }"
          class="tab-btn"
        >
          {{ tab.label }}
        </button>
      </div>
      <Transition name="component-fade" mode="out-in">
        <component :is="currentTab.component" :key="currentTab.key" />
      </Transition>
    </section>
  </div>
</template>

<style scoped>
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

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 8px;
}

.demo-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  margin-bottom: 12px;
  margin-right: 8px;
  transition: all 0.2s;
}

.demo-btn:hover {
  border-color: #13c2c2;
  color: #13c2c2;
}

.code-hint {
  background: #f0f0f0;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  font-family: monospace;
  white-space: pre-wrap;
  margin: 8px 0 0;
}

.box {
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.box-blue { background: #e6f7ff; border: 1px solid #91d5ff; color: #1890ff; }
.box-green { background: #f6ffed; border: 1px solid #b7eb8f; color: #52c41a; }
.box-orange { background: #fff7e6; border: 1px solid #ffd591; color: #fa8c16; }

.mode-btns {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

/* 组件间过渡 Tab */
.tab-btns {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.tab-btn {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 13px;
  transition: all 0.2s;
}

.tab-btn:hover { border-color: #13c2c2; }
.tab-btn.tab-active {
  background: #13c2c2;
  color: #fff;
  border-color: #13c2c2;
}
</style>

<!-- 非 scoped 样式：Transition 类名需要全局生效 -->
<style>
/* ====== 基本过渡 ====== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ====== 弹跳动画 ====== */
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1); }
}

/* ====== 滑动 ====== */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* ====== 组件间过渡 ====== */
.component-fade-enter-active,
.component-fade-leave-active {
  transition: all 0.35s ease;
}
.component-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.component-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
