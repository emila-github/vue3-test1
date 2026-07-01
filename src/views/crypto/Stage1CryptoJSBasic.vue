<script setup lang="ts">
import { ref } from 'vue'
import CryptoJS from 'crypto-js'

// ===== MD5 =====
const md5Input = ref('Hello World')
const md5Result = ref('')
function doMD5() {
  md5Result.value = CryptoJS.MD5(md5Input.value).toString()
}

// ===== SHA =====
const shaInput = ref('Hello World')
const sha1Result = ref('')
const sha256Result = ref('')
const sha512Result = ref('')
function doSHA() {
  sha1Result.value = CryptoJS.SHA1(shaInput.value).toString()
  sha256Result.value = CryptoJS.SHA256(shaInput.value).toString()
  sha512Result.value = CryptoJS.SHA512(shaInput.value).toString()
}

// ===== AES 加密 =====
const aesInput = ref('你好，这是需要加密的数据')
const aesKey = ref('my-secret-key-16')
const aesIv = ref('1234567890abcdef')
const aesEncrypted = ref('')
const aesDecrypted = ref('')
function doAESEncrypt() {
  const encrypted = CryptoJS.AES.encrypt(
    aesInput.value,
    CryptoJS.enc.Utf8.parse(aesKey.value),
    {
      iv: CryptoJS.enc.Utf8.parse(aesIv.value),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  )
  aesEncrypted.value = encrypted.toString()
  aesDecrypted.value = ''
}
function doAESDecrypt() {
  const decrypted = CryptoJS.AES.decrypt(
    aesEncrypted.value,
    CryptoJS.enc.Utf8.parse(aesKey.value),
    {
      iv: CryptoJS.enc.Utf8.parse(aesIv.value),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  )
  aesDecrypted.value = decrypted.toString(CryptoJS.enc.Utf8)
}

// ===== DES =====
const desInput = ref('DES 测试数据')
const desKey = ref('my-desk8')
const desEncrypted = ref('')
const desDecrypted = ref('')
function doDESEncrypt() {
  const encrypted = CryptoJS.DES.encrypt(
    desInput.value,
    CryptoJS.enc.Utf8.parse(desKey.value),
    {
      iv: CryptoJS.enc.Utf8.parse(desKey.value),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  )
  desEncrypted.value = encrypted.toString()
  desDecrypted.value = ''
}
function doDESDecrypt() {
  const decrypted = CryptoJS.DES.decrypt(
    desEncrypted.value,
    CryptoJS.enc.Utf8.parse(desKey.value),
    {
      iv: CryptoJS.enc.Utf8.parse(desKey.value),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  )
  desDecrypted.value = decrypted.toString(CryptoJS.enc.Utf8)
}

// ===== 编码 =====
const encodeInput = ref('你好 World')
const encodeHex = ref('')
const encodeBase64 = ref('')
const encodeUtf8Len = ref(0)
function doEncode() {
  const wordArray = CryptoJS.enc.Utf8.parse(encodeInput.value)
  encodeHex.value = CryptoJS.enc.Hex.stringify(wordArray)
  encodeBase64.value = CryptoJS.enc.Base64.stringify(wordArray)
  encodeUtf8Len.value = wordArray.sigBytes
}

// ===== 常用 WordArray 操作 =====
const waDemo = ref('')
function showWordArray() {
  const wa = CryptoJS.enc.Utf8.parse('Hi')
  waDemo.value = `WordArray 内容：
- words: [${wa.words.slice(0, 1)}]
- sigBytes: ${wa.sigBytes}
- toString(Utf8): ${wa.toString(CryptoJS.enc.Utf8)}
- toString(Hex): ${wa.toString(CryptoJS.enc.Hex)}
- toString(Base64): ${wa.toString(CryptoJS.enc.Base64)}`
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>🔤 Stage 1：crypto-js 基础入门</h1>
      <p>MD5 / SHA 哈希摘要、AES / DES 对称加解密、Hex / Base64 编码转换</p>
    </header>

    <!-- MD5 -->
    <section class="card">
      <h2>1. MD5 哈希（Message Digest 5）</h2>
      <p class="desc">生成 128 位（32 字符 Hex）的固定长度摘要。不可逆，常用于校验文件完整性。</p>
      <div class="demo-row">
        <a-input v-model:value="md5Input" placeholder="输入文本" style="flex:1" />
        <a-button type="primary" @click="doMD5">计算 MD5</a-button>
      </div>
      <div v-if="md5Result" class="result-box">
        <span class="label">MD5：</span>
        <code>{{ md5Result }}</code>
      </div>
      <details class="code-details">
        <summary>查看代码</summary>
        <pre><code>import CryptoJS from 'crypto-js'
const hash = CryptoJS.MD5('Hello World').toString()
// → 128位摘要，32字符Hex</code></pre>
      </details>
    </section>

    <!-- SHA -->
    <section class="card">
      <h2>2. SHA 系列哈希</h2>
      <p class="desc">SHA-1（160位）、SHA-256（256位）、SHA-512（512位），安全性递增，速度递减。</p>
      <div class="demo-row">
        <a-input v-model:value="shaInput" placeholder="输入文本" style="flex:1" />
        <a-button type="primary" @click="doSHA">计算 SHA</a-button>
      </div>
      <div v-if="sha1Result" class="result-box">
        <div><span class="label">SHA-1（40 Hex）：</span><code>{{ sha1Result }}</code></div>
        <div><span class="label">SHA-256（64 Hex）：</span><code>{{ sha256Result }}</code></div>
        <div><span class="label">SHA-512（128 Hex）：</span><code>{{ sha512Result }}</code></div>
      </div>
      <details class="code-details">
        <summary>查看代码</summary>
        <pre><code>const sha1 = CryptoJS.SHA1('Hello World').toString()
const sha256 = CryptoJS.SHA256('Hello World').toString()
const sha512 = CryptoJS.SHA512('Hello World').toString()</code></pre>
      </details>
    </section>

    <!-- AES 加密 -->
    <section class="card">
      <h2>3. AES 对称加密（Advanced Encryption Standard）</h2>
      <p class="desc">
        AES 是最常用的对称加密算法。此处使用 <strong>CBC 模式 + PKCS7 填充</strong>，key 16 字节对应 AES-128。
      </p>
      <div class="demo-grid">
        <div>
          <label>明文</label>
          <a-textarea v-model:value="aesInput" :rows="2" />
        </div>
        <div>
          <label>密钥（16 字节）</label>
          <a-input v-model:value="aesKey" />
        </div>
        <div>
          <label>IV（16 字节）</label>
          <a-input v-model:value="aesIv" />
        </div>
      </div>
      <div class="btn-group">
        <a-button type="primary" @click="doAESEncrypt">加密</a-button>
        <a-button @click="doAESDecrypt" :disabled="!aesEncrypted">解密</a-button>
      </div>
      <div v-if="aesEncrypted" class="result-box">
        <div><span class="label">密文：</span><code class="break-all">{{ aesEncrypted }}</code></div>
        <div v-if="aesDecrypted"><span class="label">解密：</span><code>{{ aesDecrypted }}</code></div>
      </div>
      <details class="code-details">
        <summary>查看代码</summary>
        <pre><code>// 加密
const encrypted = CryptoJS.AES.encrypt(
  plainText,
  CryptoJS.enc.Utf8.parse(key),
  { iv: CryptoJS.enc.Utf8.parse(iv), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
).toString()

// 解密
const decrypted = CryptoJS.AES.decrypt(
  cipherText,
  CryptoJS.enc.Utf8.parse(key),
  { iv: CryptoJS.enc.Utf8.parse(iv), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
).toString(CryptoJS.enc.Utf8)</code></pre>
      </details>
      <p class="tip-box">⚠️ <strong>注意</strong>：密钥和 IV 必须用 <code>CryptoJS.enc.Utf8.parse()</code> 转换成 WordArray，否则默认为 Base64 编码的密码短语模式。</p>
    </section>

    <!-- DES -->
    <section class="card">
      <h2>4. DES 对称加密</h2>
      <p class="desc">DES 使用 56 位密钥，现已被认为不安全，仅用于兼容旧系统。新项目应使用 AES。</p>
      <div class="demo-row">
        <a-input v-model:value="desInput" placeholder="明文" style="flex:1" />
        <a-input v-model:value="desKey" placeholder="密钥（8字节）" style="max-width:200px" />
        <a-button type="primary" @click="doDESEncrypt">加密</a-button>
        <a-button @click="doDESDecrypt" :disabled="!desEncrypted">解密</a-button>
      </div>
      <div v-if="desEncrypted" class="result-box">
        <div><span class="label">密文：</span><code class="break-all">{{ desEncrypted }}</code></div>
        <div v-if="desDecrypted"><span class="label">解密：</span><code>{{ desDecrypted }}</code></div>
      </div>
    </section>

    <!-- 编码 -->
    <section class="card">
      <h2>5. 编码转换（Hex / Base64 / Utf8）</h2>
      <p class="desc">crypto-js 内部使用 <strong>WordArray</strong> 作为核心数据结构，通过编码方法在不同格式间转换。</p>
      <div class="demo-row">
        <a-input v-model:value="encodeInput" placeholder="输入文本" style="flex:1" />
        <a-button type="primary" @click="doEncode">编码转换</a-button>
        <a-button @click="showWordArray">查看 WordArray</a-button>
      </div>
      <div v-if="encodeHex" class="result-box">
        <div><span class="label">UTF-8 字节数：</span><code>{{ encodeUtf8Len }}</code></div>
        <div><span class="label">Hex：</span><code class="break-all">{{ encodeHex }}</code></div>
        <div><span class="label">Base64：</span><code class="break-all">{{ encodeBase64 }}</code></div>
      </div>
      <div v-if="waDemo" class="result-box">
        <pre><code>{{ waDemo }}</code></pre>
      </div>
      <details class="code-details">
        <summary>查看代码</summary>
        <pre><code>// 字符串 → WordArray
const wa = CryptoJS.enc.Utf8.parse('Hello')

// WordArray → 编码字符串
const hex = CryptoJS.enc.Hex.stringify(wa)
const base64 = CryptoJS.enc.Base64.stringify(wa)

// 编码字符串 → WordArray
const wa2 = CryptoJS.enc.Hex.parse(hex)
const wa3 = CryptoJS.enc.Base64.parse(base64)

// WordArray → 字符串
wa2.toString(CryptoJS.enc.Utf8) // 'Hello'</code></pre>
      </details>
    </section>

    <!-- 关键概念 -->
    <section class="card">
      <h2>📖 关键概念总结</h2>
      <a-table
        :columns="[
          { title: '概念', dataIndex: 'name', key: 'name', width: 140 },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
          { title: '示例', dataIndex: 'example', key: 'example' },
        ]"
        :data-source="[
          { name: 'WordArray', desc: 'crypto-js 核心数据结构，{words, sigBytes}', example: 'CryptoJS.enc.Utf8.parse(str)' },
          { name: 'mode.CBC', desc: '密码块链接模式，需要 IV，安全性好', example: 'CryptoJS.mode.CBC' },
          { name: 'pad.Pkcs7', desc: 'PKCS7 填充标准，最常用的填充方式', example: 'CryptoJS.pad.Pkcs7' },
          { name: 'IV', desc: '初始化向量，CBC 模式必需，需与密钥一起传递', example: 'iv: CryptoJS.enc.Utf8.parse(ivStr)' },
          { name: 'MD5/SHA', desc: '单向哈希，不可逆，用于完整性校验', example: 'CryptoJS.MD5(data)' },
        ]"
        :pagination="false"
        size="small"
        bordered
      />
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 32px 16px 64px;
}
.page-header {
  text-align: center;
  margin-bottom: 32px;
}
.page-header h1 {
  font-size: 26px;
  margin-bottom: 6px;
}
.page-header p {
  font-size: 14px;
  color: #888;
}
.card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 24px;
}
.card h2 {
  font-size: 18px;
  margin-bottom: 4px;
}
.desc {
  font-size: 14px;
  color: #888;
  margin-bottom: 16px;
  line-height: 1.6;
}
.demo-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  margin: 12px 0;
}
.demo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 12px 0;
}
.demo-grid label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}
.btn-group {
  display: flex;
  gap: 10px;
  margin: 12px 0;
}
.result-box {
  margin: 12px 0;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}
.result-box .label {
  font-size: 13px;
  color: #666;
  font-weight: 600;
}
.result-box code {
  font-size: 13px;
  word-break: break-all;
}
.break-all {
  word-break: break-all;
}
.tip-box {
  margin-top: 12px;
  padding: 10px 14px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 6px;
  font-size: 13px;
  color: #9a6e00;
}
.code-details {
  margin-top: 12px;
}
.code-details summary {
  font-size: 13px;
  color: #1677ff;
  cursor: pointer;
}
.code-details pre {
  margin-top: 8px;
  padding: 12px;
  background: #f6f8fa;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 13px;
}
.code-details pre code {
  font-size: 13px;
}
</style>
