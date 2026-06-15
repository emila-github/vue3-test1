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
  <div class="enum-demo-page">
    <header class="page-header">
      <h1>TypeScript 枚举 (Enum)</h1>
      <p class="page-subtitle">枚举是一组<strong>命名常量</strong>的集合，让你用有意义的名称代替魔法数字/字符串。</p>
    </header>

    <!-- ==================== 引言：什么是枚举 ==================== -->
    <section class="demo-section intro-section">
      <h2 class="section-title">📖 什么是枚举？为什么需要它？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong>枚举（<code>enum</code>）让你给一组相关常量起<em>有意义的名字</em>，而不是在代码里写 <code>0</code>、<code>1</code>、<code>2</code> 这种"魔法数字"。
        </p>
        <h3>没有枚举的痛苦 😫</h3>
        <pre class="code-block">
// 用字面量表示状态 — 难读、难维护、容易写错
function setStatus(status: number) {
  if (status === 0) { /* 活跃 */ }
  else if (status === 1) { /* 非活跃 */ }
  else if (status === 2) { /* 待审核 */ }
}
setStatus(3)  // ❌ 编译通过，但 3 不是合法状态！</pre>
        <h3>有了枚举之后 😎</h3>
        <pre class="code-block">
// 枚举让状态有名字 — 清晰、安全、自文档化
enum Status { Active, Inactive, Pending }

function setStatus(status: Status) {
  if (status === Status.Active) { /* ... */ }
}
setStatus(Status.Active)    // ✅
// setStatus(3)              // ❌ TS 5.x+ 不兼容数字枚举直接传数字</pre>
        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><strong>数字枚举</strong>从 0 开始自增，支持<strong>反向映射</strong></li>
            <li><strong>字符串枚举</strong>每个成员必须初始化，调试时能看到有意义的值</li>
            <li><strong>const 枚举</strong>编译时内联为字面量，零运行时开销</li>
            <li>推荐：优先用<strong>字符串枚举</strong>或<strong>字面量联合类型</strong></li>
          </ul>
        </div>
      </div>
    </section>
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

    <!-- ==================== 速查表 ==================== -->
    <section class="demo-section summary-section">
      <h2 class="section-title">📋 枚举速查表</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>类型</th>
            <th>语法</th>
            <th>编译后</th>
            <th>通俗理解</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>数字枚举</strong></td>
            <td><code>enum D { Up, Down }</code></td>
            <td>双向映射对象</td>
            <td>"0=Up, 1=Down，还能反查"</td>
          </tr>
          <tr>
            <td><strong>字符串枚举</strong></td>
            <td><code>enum C { Red='RED' }</code></td>
            <td>单向映射对象</td>
            <td>"Red 就是 'RED'，调试友好"</td>
          </tr>
          <tr>
            <td><strong>const 枚举</strong></td>
            <td><code>const enum L { Debug }</code></td>
            <td>内联为字面量</td>
            <td>"编译后完全消失，零开销"</td>
          </tr>
          <tr>
            <td><strong>反向映射</strong></td>
            <td><code>Direction[0]</code></td>
            <td>仅数字枚举支持</td>
            <td>"通过数字反查名称"</td>
          </tr>
          <tr>
            <td><strong>手动赋值</strong></td>
            <td><code>enum S { Ok=200, NF=404 }</code></td>
            <td>使用指定值</td>
            <td>"不用默认自增，自己定数字"</td>
          </tr>
        </tbody>
      </table>
      <div class="hint-box" style="margin-top: 16px;">
        <p>💡 <strong>建议：</strong>实际项目中，优先使用<strong>字符串枚举</strong>（调试友好）或<strong>字面量联合类型</strong> <code>type Status = 'active' | 'inactive'</code>（更轻量）。</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ===== 页面布局 ===== */
.enum-demo-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 20px 60px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  color: #1a1a2e;
  margin: 0 0 8px;
}

.page-subtitle {
  color: #666;
  font-size: 15px;
  line-height: 1.7;
  max-width: 640px;
  margin: 0 auto;
}

.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #3178c6;
}

.section-title {
  margin: 0 0 8px;
  color: #1a1a2e;
  font-size: 19px;
  display: flex;
  align-items: center;
  gap: 10px;
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
  white-space: pre;
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

/* ===== 介绍区域 ===== */
.intro-section {
  border-left-color: #fa8c16;
  background: #fffbe6;
}

.explain-box {
  line-height: 1.8;
}

.explain-box h3 {
  font-size: 15px;
  margin: 16px 0 8px;
  color: #333;
}

.explain-box p {
  margin: 6px 0;
  color: #444;
}

.key-points {
  background: #fff;
  border: 1px solid #ffd591;
  border-radius: 6px;
  padding: 12px 16px;
  margin-top: 12px;
}

.key-points p {
  margin: 0 0 6px;
  color: #d46b08;
}

.key-points ul {
  margin: 0;
  padding-left: 20px;
}

.key-points li {
  margin: 4px 0;
  font-size: 14px;
  color: #555;
}

.key-points code {
  background: #fff3e0;
  padding: 1px 5px;
  border-radius: 3px;
  color: #d46b08;
}

/* ===== 总结区 ===== */
.summary-section {
  border-left-color: #52c41a;
  background: #f6ffed;
}

.summary-section .section-title {
  color: #065f46;
}

.summary-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 14px;
}

.summary-table th {
  background: #e8f5e9;
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
  color: #2e7d32;
  border-bottom: 2px solid #c8e6c9;
}

.summary-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #e8e8e8;
  color: #444;
}

.summary-table code {
  background: #e8e8e8;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
  color: #cf1322;
  white-space: nowrap;
}

.summary-table tbody tr:hover {
  background: #f5f5f5;
}

.hint-box {
  background: #fff;
  border: 1px solid #c8e6c9;
  border-radius: 6px;
  padding: 12px 16px;
  color: #2e7d32;
  font-size: 14px;
}
</style>
