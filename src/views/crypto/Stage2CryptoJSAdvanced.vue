<script setup lang="ts">
import { ref } from 'vue'
import CryptoJS from 'crypto-js'

// ===== AES 多种模式对比 =====
const aesModeInput = ref('同一段明文数据用于对比不同模式')
const aesModeKey = ref('my-secret-key-16')
const aesModeIv = ref('1234567890abcdef')

interface AesModeResult {
  mode: string
  encrypted: string
  decrypted: string
}

const aesModeResults = ref<AesModeResult[]>([])
function doAesModeCompare() {
  aesModeResults.value = []
  const modes = [
    { name: 'CBC', mode: CryptoJS.mode.CBC },
    { name: 'ECB', mode: CryptoJS.mode.ECB },
    { name: 'CFB', mode: CryptoJS.mode.CFB },
    { name: 'OFB', mode: CryptoJS.mode.OFB },
    { name: 'CTR', mode: CryptoJS.mode.CTR },
  ]
  for (const m of modes) {
    const encrypted = CryptoJS.AES.encrypt(aesModeInput.value, CryptoJS.enc.Utf8.parse(aesModeKey.value), {
      iv: CryptoJS.enc.Utf8.parse(aesModeIv.value),
      mode: m.mode,
      padding: CryptoJS.pad.Pkcs7,
    }).toString()
    const decrypted = CryptoJS.AES.decrypt(encrypted, CryptoJS.enc.Utf8.parse(aesModeKey.value), {
      iv: CryptoJS.enc.Utf8.parse(aesModeIv.value),
      mode: m.mode,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8)
    aesModeResults.value.push({ mode: m.name, encrypted, decrypted })
  }
}

// ===== ECB 模式安全性演示 =====
const ecbInput1 = ref('AAAA')
const ecbInput2 = ref('AAAA')
const ecbInput3 = ref('BBBB')
const ecbKey = ref('my-secret-key-16')
const ecbResults = ref<{ name: string; encrypted: string; short: string }[]>([])
function doEcbDemo() {
  const names = ['明文1 (AAAA)', '明文2 (AAAA)', '明文3 (BBBB)']
  const inputs = [ecbInput1.value, ecbInput2.value, ecbInput3.value]
  ecbResults.value = names.map((name, i) => {
    const encrypted = CryptoJS.AES.encrypt(inputs[i], CryptoJS.enc.Utf8.parse(ecbKey.value), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString()
    // 取加密结果中间部分展示
    const short = encrypted.substring(20, 40)
    return { name, encrypted, short }
  })
}

// ===== 填充策略对比 =====
const padInput = ref('短数据')
const padKey = ref('my-secret-key-16')
const padIv = ref('1234567890abcdef')
const padResults = ref<{ name: string; encrypted: string }[]>([])
function doPadCompare() {
  padResults.value = []
  const pads = [
    { name: 'Pkcs7', pad: CryptoJS.pad.Pkcs7 },
    { name: 'NoPadding', pad: CryptoJS.pad.NoPadding },
    { name: 'ZeroPadding', pad: CryptoJS.pad.ZeroPadding },
    { name: 'Iso97971', pad: CryptoJS.pad.Iso97971 },
  ]
  for (const p of pads) {
    try {
      const encrypted = CryptoJS.AES.encrypt(padInput.value, CryptoJS.enc.Utf8.parse(padKey.value), {
        iv: CryptoJS.enc.Utf8.parse(padIv.value),
        mode: CryptoJS.mode.CBC,
        padding: p.pad,
      }).toString()
      padResults.value.push({ name: p.name, encrypted })
    } catch {
      padResults.value.push({ name: p.name, encrypted: '加密失败（可能是输入长度不对齐）' })
    }
  }
}

// ===== HMAC 消息认证码 =====
const hmacInput = ref('要验证完整性的消息')
const hmacSecret = ref('my-hmac-secret')
const hmacSHA256 = ref('')
const hmacSHA512 = ref('')
const hmacMD5 = ref('')

function doHMAC() {
  hmacSHA256.value = CryptoJS.HmacSHA256(hmacInput.value, hmacSecret.value).toString()
  hmacSHA512.value = CryptoJS.HmacSHA512(hmacInput.value, hmacSecret.value).toString()
  hmacMD5.value = CryptoJS.HmacMD5(hmacInput.value, hmacSecret.value).toString()
}

const hmacVerifyMsg = ref('被篡改的消息')
const hmacVerifyResult = ref('')
function doHMACVerify() {
  const original = CryptoJS.HmacSHA256(hmacInput.value, hmacSecret.value).toString()
  const tampered = CryptoJS.HmacSHA256(hmacVerifyMsg.value, hmacSecret.value).toString()
  hmacVerifyResult.value =
    original === tampered
      ? '✅ HMAC 匹配 — 消息未被篡改'
      : `❌ HMAC 不匹配 — 消息已被篡改！
  原始 HMAC: ${original.substring(0, 32)}...
  篡改后 HMAC: ${tampered.substring(0, 32)}...`
}

// ===== PBKDF2 密钥派生 =====
const pbkdf2Password = ref('user-password-123')
const pbkdf2Salt = ref(CryptoJS.lib.WordArray.random(16).toString())
const pbkdf2Key128 = ref('')
const pbkdf2Key256 = ref('')
const pbkdf2Iterations = ref(10000)

function doPBKDF2() {
  pbkdf2Key128.value = CryptoJS.PBKDF2(pbkdf2Password.value, CryptoJS.enc.Hex.parse(pbkdf2Salt.value), {
    keySize: 128 / 32,
    iterations: pbkdf2Iterations.value,
  }).toString()
  pbkdf2Key256.value = CryptoJS.PBKDF2(pbkdf2Password.value, CryptoJS.enc.Hex.parse(pbkdf2Salt.value), {
    keySize: 256 / 32,
    iterations: pbkdf2Iterations.value,
  }).toString()
}

function genNewSalt() {
  pbkdf2Salt.value = CryptoJS.lib.WordArray.random(16).toString()
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>⚙️ Stage 2：crypto-js 进阶</h1>
      <p>AES 多种模式对比、填充策略、HMAC 消息认证、PBKDF2 密钥派生</p>
    </header>

    <!-- AES 模式对比 -->
    <section class="card">
      <h2>1. AES 加密模式对比</h2>
      <p class="desc">
        AES 支持多种工作模式。CBC 最常用（需要 IV），ECB 不安全（相同明文 → 相同密文），CTR 将分组密码转为流模式。
      </p>
      <div class="demo-grid">
        <div>
          <label>明文</label>
          <a-textarea v-model:value="aesModeInput" :rows="2" />
        </div>
        <div>
          <label>密钥（16 字节）</label>
          <a-input v-model:value="aesModeKey" />
        </div>
        <div>
          <label>IV（16 字节）</label>
          <a-input v-model:value="aesModeIv" />
        </div>
      </div>
      <a-button type="primary" @click="doAesModeCompare" style="margin-top: 12px">对比所有模式</a-button>
      <div v-if="aesModeResults.length" class="result-box" style="margin-top: 12px">
        <a-table
          :columns="[
            { title: '模式', dataIndex: 'mode', width: 70 },
            { title: '密文', dataIndex: 'encrypted', ellipsis: true },
            { title: '解密结果', dataIndex: 'decrypted', width: 120 },
          ]"
          :data-source="aesModeResults"
          :pagination="false"
          size="small"
          bordered
        />
      </div>
      <details class="code-details">
        <summary>查看代码</summary>
        <pre><code>// CBC（密码块链接，需要 IV，最安全常用）
CryptoJS.AES.encrypt(data, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })

// ECB（电子密码本，相同明文 → 相同密文，不安全）
CryptoJS.AES.encrypt(data, key, { mode: CryptoJS.mode.ECB })

// CTR（计数器模式，可并行，转流密码）
CryptoJS.AES.encrypt(data, key, { iv, mode: CryptoJS.mode.CTR })</code></pre>
      </details>
      <p class="tip-box">
        ⚠️ <strong>ECB 模式</strong>：相同明文块产生相同密文块，可被统计分析攻击。只要可能，应避免使用 ECB。
      </p>
    </section>

    <!-- ECB 安全性演示 -->
    <section class="card">
      <h2>2. ECB 模式安全性演示</h2>
      <p class="desc">输入两段相同的明文（AAAA），观察 ECB 模式下密文是否也相同，从而理解为何 ECB 不安全。</p>
      <div class="demo-row">
        <a-input v-model:value="ecbInput1" placeholder="明文1" style="max-width: 120px" />
        <a-input v-model:value="ecbInput2" placeholder="明文2" style="max-width: 120px" />
        <a-input v-model:value="ecbInput3" placeholder="明文3" style="max-width: 120px" />
        <a-button type="primary" @click="doEcbDemo">加密对比</a-button>
      </div>
      <div v-if="ecbResults.length" class="result-box" style="margin-top: 12px">
        <div v-for="r in ecbResults" :key="r.name" style="margin-bottom: 6px">
          <span class="label">{{ r.name }}：</span>
          <code class="break-all">{{ r.encrypted }}</code>
          <br />
          <span style="color: #888; font-size: 12px"
            >中间片段：<code>{{ r.short }}</code></span
          >
        </div>
        <p style="font-size: 13px; color: #cf1322; margin-top: 8px">
          👆 注意：明文1 和 明文2 都是 "AAAA"，它们的密文<strong>完全相同</strong>！这就是 ECB 的安全隐患。
        </p>
      </div>
    </section>

    <!-- 填充策略 -->
    <section class="card">
      <h2>3. 填充策略对比</h2>
      <p class="desc">分组密码要求输入是块大小的整数倍，不足时需要填充。Pkcs7 最常用，NoPadding 要求数据长度对齐。</p>
      <div class="demo-row">
        <a-input v-model:value="padInput" placeholder="输入文本" style="max-width: 200px" />
        <a-button type="primary" @click="doPadCompare">对比所有填充</a-button>
      </div>
      <div v-if="padResults.length" class="result-box" style="margin-top: 12px">
        <div v-for="r in padResults" :key="r.name" style="margin-bottom: 6px">
          <span class="label">{{ r.name }}：</span>
          <code class="break-all">{{ r.encrypted }}</code>
        </div>
      </div>
      <details class="code-details">
        <summary>查看代码</summary>
        <pre><code>// Pkcs7 — 最常用，填充 n 个值为 n 的字节
CryptoJS.AES.encrypt(data, key, { padding: CryptoJS.pad.Pkcs7 })

// ZeroPadding — 填充 0x00，不适合进制为 0 的数据
CryptoJS.AES.encrypt(data, key, { padding: CryptoJS.pad.ZeroPadding })

// NoPadding — 不填充，要求数据长度是 16 字节倍数
CryptoJS.AES.encrypt(data, key, { padding: CryptoJS.pad.NoPadding })</code></pre>
      </details>
    </section>

    <!-- HMAC -->
    <section class="card">
      <h2>4. HMAC 消息认证码</h2>
      <p class="desc">
        HMAC 是带密钥的哈希，用于验证消息的<strong>完整性</strong>和<strong>来源真实性</strong>。常用于 API 签名。
      </p>
      <div class="demo-grid">
        <div>
          <label>消息内容</label>
          <a-textarea v-model:value="hmacInput" :rows="2" />
        </div>
        <div>
          <label>密钥（Secret）</label>
          <a-input v-model:value="hmacSecret" />
        </div>
      </div>
      <div class="btn-group">
        <a-button type="primary" @click="doHMAC">生成 HMAC</a-button>
      </div>
      <div v-if="hmacSHA256" class="result-box">
        <div>
          <span class="label">HmacSHA256：</span><code class="break-all">{{ hmacSHA256 }}</code>
        </div>
        <div>
          <span class="label">HmacSHA512：</span><code class="break-all">{{ hmacSHA512 }}</code>
        </div>
        <div>
          <span class="label">HmacMD5（不推荐）：</span><code class="break-all">{{ hmacMD5 }}</code>
        </div>
      </div>

      <h3 style="margin-top: 20px">验证完整性（防篡改演示）</h3>
      <div class="demo-row">
        <a-input v-model:value="hmacVerifyMsg" placeholder="输入「被篡改」的消息" style="flex: 1" />
        <a-button type="primary" @click="doHMACVerify">验证</a-button>
      </div>
      <div v-if="hmacVerifyResult" class="result-box">
        <pre>{{ hmacVerifyResult }}</pre>
      </div>
      <details class="code-details">
        <summary>查看代码</summary>
        <pre><code>// 生成 HMAC
const hmac = CryptoJS.HmacSHA256(message, secret).toString()

// 验证消息完整性（服务端应重新计算 HMAC 并比对）
const serverHMAC = CryptoJS.HmacSHA256(receivedMsg, secret).toString()
const isValid = serverHMAC === clientHMAC

// 常见应用：API 请求签名
// Authorization: HMAC-SHA256 apiKey:timestamp:signature</code></pre>
      </details>
    </section>

    <!-- PBKDF2 -->
    <section class="card">
      <h2>5. PBKDF2 密钥派生</h2>
      <p class="desc">
        PBKDF2 从密码 + 随机盐 +
        多轮迭代派生安全密钥。用于<strong>密码哈希存储</strong>和<strong>密钥材质生成</strong>。
      </p>
      <div class="demo-grid">
        <div>
          <label>密码</label>
          <a-input v-model:value="pbkdf2Password" />
        </div>
        <div>
          <label>随机盐 (Hex)</label>
          <div class="demo-row" style="gap: 6px; margin: 0">
            <a-input v-model:value="pbkdf2Salt" style="flex: 1; font-family: monospace; font-size: 12px" />
            <a-button size="small" @click="genNewSalt">生成新盐</a-button>
          </div>
        </div>
        <div>
          <label>迭代次数</label>
          <a-input-number v-model:value="pbkdf2Iterations" :min="1000" :max="100000" :step="1000" style="width: 100%" />
        </div>
      </div>
      <div class="btn-group">
        <a-button type="primary" @click="doPBKDF2">派生密钥</a-button>
      </div>
      <div v-if="pbkdf2Key128" class="result-box">
        <div>
          <span class="label">128 位密钥：</span><code class="break-all">{{ pbkdf2Key128 }}</code>
        </div>
        <div>
          <span class="label">256 位密钥：</span><code class="break-all">{{ pbkdf2Key256 }}</code>
        </div>
        <div style="font-size: 12px; color: #888; margin-top: 8px">
          💡 相同密码 + 相同盐 + 相同迭代次数 → 始终产生相同密钥
        </div>
      </div>
      <details class="code-details">
        <summary>查看代码</summary>
        <pre><code>// PBKDF2 密钥派生
const derived = CryptoJS.PBKDF2(
  password,
  CryptoJS.enc.Hex.parse(salt),  // 随机盐（Hex 格式）
  { keySize: 256 / 32, iterations: 10000 }
).toString()  // → 派生出的 256 位密钥（Hex）

// 最佳实践：
// - 盐：每个用户独立，16 字节以上随机值
// - iterations：至少 10000，推荐 100000+
// - 存储格式：$pbkdf2-sha256$iterations$salt$hash</code></pre>
      </details>
    </section>

    <!-- 关键概念 -->
    <section class="card">
      <h2>📖 进阶概念总结</h2>
      <a-table
        :columns="[
          { title: '概念', dataIndex: 'name', key: 'name', width: 120 },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
          { title: '使用场景', dataIndex: 'scene', key: 'scene' },
        ]"
        :data-source="[
          { name: 'CBC', desc: '密码块链接，需要 IV，最常用的 AES 模式', scene: '文件加密、数据库加密' },
          { name: 'ECB', desc: '电子密码本，不推荐使用', scene: '❌ 避免使用' },
          { name: 'CTR', desc: '计数器模式，可并行加密，转流密码', scene: '网络流数据加密' },
          { name: 'HMAC', desc: '带密钥哈希，验证完整性和来源', scene: 'API 签名、JWT' },
          { name: 'PBKDF2', desc: '密码 → 安全密钥，防暴力破解', scene: '密码哈希存储' },
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
.card h3 {
  font-size: 16px;
  margin-bottom: 8px;
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
</style>
