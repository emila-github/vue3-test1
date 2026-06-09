<script setup lang="ts">
// ====== 1. Partial / Required / Readonly ======
interface User {
  name: string
  age: number
  email: string
}

const user: User = { name: '张三', age: 25, email: 'zhang@test.com' }

const partialCode = `interface User {
  name: string; age: number; email: string
}

// Partial — 所有属性变为可选
type PartialUser = Partial<User>
// { name?: string; age?: number; email?: string }

// Required — 所有属性变为必选
type RequiredUser = Required<PartialUser>

// Readonly — 所有属性变为只读
type ReadonlyUser = Readonly<User>`

// ====== 2. Pick / Omit ======
type UserPreview = Pick<User, 'name' | 'age'>
type UserWithoutEmail = Omit<User, 'email'>

const pickOmitCode = `// Pick — 选取部分属性
type UserPreview = Pick<User, 'name' | 'age'>
// { name: string; age: number }

// Omit — 排除部分属性
type UserWithoutEmail = Omit<User, 'email'>
// { name: string; age: number }`

// ====== 3. Record ======
type PageNames = 'home' | 'about' | 'contact'
type PageInfo = Record<PageNames, { title: string; path: string }>

const pages: PageInfo = {
  home: { title: '首页', path: '/' },
  about: { title: '关于', path: '/about' },
  contact: { title: '联系', path: '/contact' },
}

const recordCode = `type PageNames = 'home' | 'about' | 'contact'
type PageInfo = Record<PageNames, { title: string; path: string }>

const pages: PageInfo = {
  home: { title: '首页', path: '/' },
  about: { title: '关于', path: '/about' },
  contact: { title: '联系', path: '/contact' },
}`

// ====== 4. Exclude / Extract ======
type AllStatus = 'success' | 'error' | 'loading' | 'idle'
type ErrorStatus = Exclude<AllStatus, 'loading' | 'idle'>
type LoadStatus = Extract<AllStatus, 'loading' | 'idle'>

const excludeCode = `type AllStatus = 'success' | 'error' | 'loading' | 'idle'

// Exclude — 从联合类型中排除
type ErrorStatus = Exclude<AllStatus, 'loading' | 'idle'>
// 'success' | 'error'

// Extract — 从联合类型中提取
type LoadStatus = Extract<AllStatus, 'loading' | 'idle'>
// 'loading' | 'idle'`

// ====== 5. NonNullable / Parameters / ReturnType ======
type NullableString = string | null | undefined
type SafeString = NonNullable<NullableString> // string

function createUser(name: string, age: number): { name: string; age: number } {
  return { name, age }
}

type CreateUserParams = Parameters<typeof createUser> // [string, number]
type CreateUserReturn = ReturnType<typeof createUser>  // { name: string; age: number }

const utilCode = `// NonNullable — 排除 null 和 undefined
type Nullable = string | null | undefined
type Safe = NonNullable<Nullable>  // string

// Parameters — 获取函数参数类型元组
type P = Parameters<(a: string, b: number) => void>
// [string, number]

// ReturnType — 获取函数返回值类型
type R = ReturnType<() => string>
// string`

// ====== 6. 自定义工具类型 ======
const customCode = `// DeepPartial — 深层可选
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? DeepPartial<T[K]>
    : T[K]
}

// NonEmptyArray — 非空数组
type NonEmptyArray<T> = [T, ...T[]]

// Merge — 合并两个类型
type Merge<F, S> = Omit<F, keyof S> & S

// ValueOf — 获取对象值的联合类型
type ValueOf<T> = T[keyof T]`
</script>

<template>
  <div>
    <!-- Partial / Required / Readonly -->
    <section class="demo-section">
      <h2>1. Partial / Required / Readonly</h2>
      <pre class="code-block">{{ partialCode }}</pre>
      <div class="result-box">
        <p><strong>User 实例:</strong></p>
        <p>name: {{ user.name }}, age: {{ user.age }}, email: {{ user.email }}</p>
      </div>
    </section>

    <!-- Pick / Omit -->
    <section class="demo-section">
      <h2>2. Pick / Omit</h2>
      <pre class="code-block">{{ pickOmitCode }}</pre>
      <p class="hint">Pick 和 Omit 是互补操作：Pick 取子集，Omit 排除子集</p>
    </section>

    <!-- Record -->
    <section class="demo-section">
      <h2>3. Record&lt;K, T&gt;</h2>
      <pre class="code-block">{{ recordCode }}</pre>
      <div class="result-box">
        <p v-for="(info, key) in pages" :key="key">
          pages.{{ key }} = {{ '{' }} title: "{{ info.title }}", path: "{{ info.path }}" {{ '}' }}
        </p>
      </div>
    </section>

    <!-- Exclude / Extract -->
    <section class="demo-section">
      <h2>4. Exclude / Extract</h2>
      <pre class="code-block">{{ excludeCode }}</pre>
      <div class="result-box">
        <p>AllStatus = <code>'success' | 'error' | 'loading' | 'idle'</code></p>
        <p>Exclude&lt;AllStatus, 'loading' | 'idle'&gt; → <code>'success' | 'error'</code></p>
        <p>Extract&lt;AllStatus, 'loading' | 'idle'&gt; → <code>'loading' | 'idle'</code></p>
      </div>
    </section>

    <!-- 函数相关工具类型 -->
    <section class="demo-section">
      <h2>5. NonNullable / Parameters / ReturnType</h2>
      <pre class="code-block">{{ utilCode }}</pre>
    </section>

    <!-- 自定义工具类型 -->
    <section class="demo-section">
      <h2>6. 自定义工具类型</h2>
      <pre class="code-block">{{ customCode }}</pre>
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

code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
  color: #d63384;
}
</style>
