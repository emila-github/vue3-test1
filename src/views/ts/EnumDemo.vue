<script setup lang="ts">
import { ref } from 'vue'

// ====== 1. 数字枚举 ======
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

enum StatusCode {
  Success = 200,
  NotFound = 404,
  ServerError = 500,
}

const dirCode = `enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right,   // 3
}

enum StatusCode {
  Success = 200,
  NotFound = 404,
  ServerError = 500,
}`

// ====== 2. 字符串枚举 ======
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

const strEnumCode = `enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}`

// ====== 3. 枚举使用 ======
const selectedDirection = ref<Direction>(Direction.Up)
const selectedColor = ref<Color>(Color.Red)

function nextDirection() {
  const values = [Direction.Up, Direction.Down, Direction.Left, Direction.Right]
  const idx = values.indexOf(selectedDirection.value)
  selectedDirection.value = values[(idx + 1) % values.length]
}

function nextColor() {
  const values = [Color.Red, Color.Green, Color.Blue]
  const idx = values.indexOf(selectedColor.value)
  selectedColor.value = values[(idx + 1) % values.length]
}

const dirMap: Record<Direction, string> = {
  [Direction.Up]: '⬆️ 上',
  [Direction.Down]: '⬇️ 下',
  [Direction.Left]: '⬅️ 左',
  [Direction.Right]: '➡️ 右',
}

// ====== 4. 枚举的反向映射（仅数字枚举） ======
const reverseMapCode = `// 数字枚举支持反向映射
Direction[0]  // "Up"
Direction[1]  // "Down"

// 字符串枚举不支持反向映射
// Color['RED']  // ❌ 不存在`

// ====== 5. const 枚举 ======
const constEnumCode = `// const 枚举在编译时内联，不生成额外代码
const enum LogLevel {
  Debug,
  Info,
  Warn,
  Error,
}

// 编译后直接替换为字面量，减少代码量
const level = LogLevel.Info  // 编译为: const level = 1`
</script>

<template>
  <div>
    <!-- 数字枚举 -->
    <section class="demo-section">
      <h2>1. 数字枚举</h2>
      <pre class="code-block">{{ dirCode }}</pre>
      <div class="result-box">
        <p>Direction.Up = {{ Direction.Up }}</p>
        <p>Direction.Down = {{ Direction.Down }}</p>
        <p>StatusCode.Success = {{ StatusCode.Success }}</p>
        <p>StatusCode.NotFound = {{ StatusCode.NotFound }}</p>
        <p>StatusCode.ServerError = {{ StatusCode.ServerError }}</p>
      </div>
    </section>

    <!-- 字符串枚举 -->
    <section class="demo-section">
      <h2>2. 字符串枚举</h2>
      <pre class="code-block">{{ strEnumCode }}</pre>
      <div class="result-box">
        <p>Color.Red = "{{ Color.Red }}"</p>
        <p>Color.Green = "{{ Color.Green }}"</p>
        <p>Color.Blue = "{{ Color.Blue }}"</p>
      </div>
    </section>

    <!-- 枚举使用演示 -->
    <section class="demo-section">
      <h2>3. 枚举使用演示</h2>
      <div class="enum-demo">
        <div class="enum-item">
          <button @click="nextDirection" class="demo-btn">
            切换方向
          </button>
          <p>当前方向: {{ dirMap[selectedDirection] }} (Direction[{{ selectedDirection }}])</p>
        </div>
        <div class="enum-item">
          <button @click="nextColor" class="demo-btn">
            切换颜色
          </button>
          <p>当前颜色: {{ selectedColor }} (枚举值: "{{ selectedColor }}")</p>
          <div
            class="color-box"
            :style="{
              background:
                selectedColor === Color.Red ? '#f5222d' :
                selectedColor === Color.Green ? '#52c41a' : '#1890ff'
            }"
          ></div>
        </div>
      </div>
    </section>

    <!-- 反向映射 -->
    <section class="demo-section">
      <h2>4. 反向映射（仅数字枚举）</h2>
      <pre class="code-block">{{ reverseMapCode }}</pre>
      <div class="result-box">
        <p>Direction[0] = "{{ Direction[0] }}"</p>
        <p>Direction[1] = "{{ Direction[1] }}"</p>
        <p>Direction[2] = "{{ Direction[2] }}"</p>
        <p>Direction[3] = "{{ Direction[3] }}"</p>
        <p class="hint">数字枚举编译后生成双向映射对象，字符串枚举不支持</p>
      </div>
    </section>

    <!-- const 枚举 -->
    <section class="demo-section">
      <h2>5. const 枚举</h2>
      <pre class="code-block">{{ constEnumCode }}</pre>
      <p class="hint">const 枚举在编译时会被内联为字面量，不会生成额外 JS 代码，减小打包体积</p>
    </section>
  </div>
</template>

<style scoped>
.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #3178c6;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 14px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin: 0 0 12px;
}

.result-box {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px 16px;
  margin-top: 8px;
}

.result-box p {
  margin: 4px 0;
  font-size: 14px;
  color: #333;
}

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 6px;
}

.demo-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  transition: all 0.2s;
}

.demo-btn:hover {
  border-color: #3178c6;
  color: #3178c6;
}

.enum-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.enum-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.enum-item p {
  margin: 0;
  font-size: 14px;
}

.color-box {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #ddd;
}
</style>
