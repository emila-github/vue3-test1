<script setup lang="ts">
import { ref } from 'vue'
import CryptoJS from 'crypto-js'
import JSEncrypt from 'jsencrypt'

// ===== 混合加密核心 =====
const plainText = ref('用户密码：P@ssw0rd! 身份证号：110101199001011234')
const rsaPubKey = ref('')
const rsaPrivKey = ref('')
const aesKey = ref('')
const aesIv = ref('')
const encryptedPackage = ref('')
const decryptedText = ref('')
const stepLog = ref<string[]>([])
const timing = ref('')

// 预设密钥对（1024 位，方便演示）
const demoPubKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXzZtQcKMdxrT8T3oDiW8k+Pou
YqLo8RoGmkgFAVhqJbsaWEqFap5Gv7oXCjC2OIYSJdBhNILhDFEHBLMn4wT0XEq3
eMvA9wLrJEm8oDS5MnFnFBBPJyLNCrnGpSLPBpkmYgFMGJSMHGbSWeKWFHJCRQSC
ZKVhPkDGLFE3LF5hYQIDAQAB
-----END PUBLIC KEY-----`
const demoPrivKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQCXzZtQcKMdxrT8T3oDiW8k+PouYqLo8RoGmkgFAVhqJbsaWEqF
ap5Gv7oXCjC2OIYSJdBhNILhDFEHBLMn4wT0XEq3eMvA9wLrJEm8oDS5MnFnFBBP
JyLNCrnGpSLPBpkmYgFMGJSMHGbSWeKWFHJCRQSCZKVhPkDGLFE3LF5hYQIDAQAB
AoGBAIxFWlU8KLCNZHQULVQZBPhKMqKrGqPHikFGhkLWLKzGKwOJLzLbYQIKgPRn
UIKkYFpSZCJDPTLYVXGAPhgQMMeWUBFRhzqCrJBKVMmLJNRvHhFKNGRCSgQLKqJg
OpRRWLKLBtFQJLQfNdUBFmKEPjqLazCQFMJXkYoFPKExYFDBAkEAwuGMSD1yKQfq
UQKOjAVWlJWfFJPEMGFLLEOKFjLFKTqNxAJLCJAQJAkBrJHiFWCGpQPJgMMlMMwY
MQMMLGMClzJfAkEAyfL3KUn0uLhExCPhhLBpkJLGMwLSLBjmLzBqQLlBHJMKYqBg
nJFkZJILJUjEGjCkSHKQYLGMKMLjYPrGPKBLyQJBAKMlJyGJjHGGySCQBrCmLFZI
SHKGSMlJHSIMjgHpMjKQLCQJoCQBkKJFPLZJnLPBpljGGlBFPMDgMFJGIoKMMwJB
ALBGJoLjQKpKpJMkZIpFpHJGnMJmYMpLJKLJJBqFLKMQnGSDJMYGIJHKoJJMKMGq
ZFLGKmLKZMJMGQnHmKHFJHICQQCdGpLJHCLJQMJQPLySnJgLJGiJCoPMonPLJKLI
ZLILqIHKZFnKJHKHjJmSHMoJGIoMjIQmZBJpKIKKMFnKqIPn
-----END RSA PRIVATE KEY-----`

function useDemoKeys() {
  rsaPubKey.value = demoPubKey
  rsaPrivKey.value = demoPrivKey
}

// ===== 加密流程 =====
function doHybridEncrypt() {
  stepLog.value = []
  const start = performance.now()

  // Step 1: 生成随机 AES 密钥（256 位）和 IV
  aesKey.value = CryptoJS.lib.WordArray.random(32).toString()
  aesIv.value = CryptoJS.lib.WordArray.random(16).toString()
  stepLog.value.push(`[1/5] 生成随机 AES-256 密钥：${aesKey.value.substring(0, 32)}...`)
  stepLog.value.push(`[2/5] 生成随机 IV：${aesIv.value}`)

  // Step 2: AES 加密数据
  const encrypted = CryptoJS.AES.encrypt(plainText.value, CryptoJS.enc.Hex.parse(aesKey.value), {
    iv: CryptoJS.enc.Hex.parse(aesIv.value),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString()
  stepLog.value.push(`[3/5] AES-256-CBC 加密数据（密文长度：${encrypted.length} 字符）`)

  // Step 3: RSA 加密 AES 密钥
  const rsa = new JSEncrypt()
  rsa.setPublicKey(rsaPubKey.value)
  const encryptedKey = rsa.encrypt(aesKey.value + '::' + aesIv.value) || ''
  stepLog.value.push(`[4/5] RSA 公钥加密 AES 密钥 + IV（密文长度：${encryptedKey.length} 字符）`)

  // Step 4: 打包
  const pkg = JSON.stringify({ ek: encryptedKey, data: encrypted, algo: 'AES-256-CBC' })
  encryptedPackage.value = pkg
  decryptedText.value = ''
  stepLog.value.push(`[5/5] 打包完成 ✓（总长度：${pkg.length} 字符）`)

  timing.value = `总耗时：${(performance.now() - start).toFixed(2)} ms`
}

// ===== 解密流程 =====
function doHybridDecrypt() {
  stepLog.value = []
  const start = performance.now()

  try {
    // Step 1: 解包
    const pkg = JSON.parse(encryptedPackage.value)
    stepLog.value.push('[1/4] 解包 JSON 密文包')

    // Step 2: RSA 解密获取 AES 密钥
    const rsa = new JSEncrypt()
    rsa.setPrivateKey(rsaPrivKey.value)
    const keyIv = rsa.decrypt(pkg.ek) || ''
    stepLog.value.push('[2/4] RSA 私钥解密，获取 AES 密钥 + IV')

    if (!keyIv) {
      stepLog.value.push('❌ RSA 解密失败！私钥可能不匹配')
      return
    }

    const [key, iv] = keyIv.split('::')
    stepLog.value.push(`[3/4] AES 密钥：${key.substring(0, 32)}...  IV：${iv}`)

    // Step 3: AES 解密数据
    const decrypted = CryptoJS.AES.decrypt(pkg.data, CryptoJS.enc.Hex.parse(key), {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8)
    decryptedText.value = decrypted || '解密失败'
    stepLog.value.push(`[4/4] AES 解密数据完成 ✓→ ${decryptedText.value}`)
  } catch (e) {
    stepLog.value.push(`❌ 解密异常：${e}`)
  }

  timing.value = `总耗时：${(performance.now() - start).toFixed(2)} ms`
}

// ===== 性能对比 =====
const perfData = ref('')
const perfRsaEncrypt = ref('')
const perfHybridEncrypt = ref('')
const perfRsaTime = ref('')
const perfHybridTime = ref('')

function doPerfCompare() {
  if (!rsaPubKey.value) return

  // 生成 1KB 测试数据
  const testData = 'A'.repeat(1024)
  perfData.value = `测试数据大小：${testData.length} 字符（${new TextEncoder().encode(testData).length} 字节）`

  // RSA 直接加密（分段）
  const rsaStart = performance.now()
  const rsa = new JSEncrypt()
  rsa.setPublicKey(rsaPubKey.value)
  const chunks: string[] = []
  for (let i = 0; i < testData.length; i += 100) {
    const c = rsa.encrypt(testData.substring(i, i + 100))
    if (c) chunks.push(c)
  }
  perfRsaEncrypt.value = `分段数：${chunks.length} 段，总密文长度：${chunks.join('').length} 字符`
  perfRsaTime.value = `${(performance.now() - rsaStart).toFixed(2)} ms`

  // 混合加密
  const hyStart = performance.now()
  const aesKey1 = CryptoJS.lib.WordArray.random(32).toString()
  const aesIv1 = CryptoJS.lib.WordArray.random(16).toString()
  const aesEnc = CryptoJS.AES.encrypt(testData, CryptoJS.enc.Hex.parse(aesKey1), {
    iv: CryptoJS.enc.Hex.parse(aesIv1),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString()
  const keyEnc = rsa.encrypt(aesKey1 + '::' + aesIv1) || ''
  const pkg = JSON.stringify({ ek: keyEnc, data: aesEnc })
  perfHybridEncrypt.value = `AES 密文：${aesEnc.length} 字符，DSA 密钥密文：${keyEnc.length} 字符，总包：${pkg.length} 字符`
  perfHybridTime.value = `${(performance.now() - hyStart).toFixed(2)} ms`
}

// 初始化预设密钥
useDemoKeys()
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>🛡️ Stage 5：RSA + AES 混合加密实战</h1>
      <p>生产级安全通信方案 — RSA 加密 AES 密钥，AES 加密实际数据</p>
    </header>

    <!-- 方案原理 -->
    <section class="card">
      <h2>📖 混合加密方案原理</h2>
      <p class="desc">取 RSA（安全密钥交换）和 AES（高效数据加密）两者的优势：</p>
      <div class="flow-diagram">
        <div class="flow-step flow-sender">
          <h4>🔒 加密（前端）</h4>
          <div class="flow-item">① 生成随机 AES 密钥 + IV</div>
          <div class="flow-item">② AES 加密明文数据 → 密文</div>
          <div class="flow-item">③ RSA 公钥加密 AES 密钥 → 加密密钥</div>
          <div class="flow-item">④ 打包 { ek, data } 发送</div>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step flow-receiver">
          <h4>🔓 解密（后端）</h4>
          <div class="flow-item">① 从 { ek, data } 解包</div>
          <div class="flow-item">② RSA 私钥解密 ek → AES 密钥</div>
          <div class="flow-item">③ AES 密钥解密 data → 明文</div>
          <div class="flow-item">④ 得到原始数据 ✓</div>
        </div>
      </div>
      <p class="tip-box">
        💡 <strong>为什么这样设计？</strong> RSA 很慢但能安全交换密钥，AES 很快但不能安全分发密钥。两者结合：RSA 只加密
        32 字节的 AES 密钥（很快），AES 处理任意大小的数据（也很快）。
      </p>
    </section>

    <!-- 交互演示 -->
    <section class="card">
      <h2>1. 混合加密交互演示</h2>
      <p class="desc">输入明文 → 查看完整的加密/解密过程，每步都显示日志。</p>
      <div class="btn-group">
        <a-button type="primary" @click="useDemoKeys">加载演示密钥</a-button>
      </div>
      <div v-if="rsaPubKey" style="margin-top: 12px">
        <div>
          <label>明文（可包含密码、身份证号等敏感信息）</label>
          <a-textarea v-model:value="plainText" :rows="3" />
        </div>
        <div class="btn-group">
          <a-button type="primary" @click="doHybridEncrypt" :disabled="!rsaPubKey">🔒 混合加密</a-button>
          <a-button @click="doHybridDecrypt" :disabled="!encryptedPackage || !rsaPrivKey">🔓 解密</a-button>
        </div>

        <!-- 步骤日志 -->
        <div v-if="stepLog.length" class="log-box">
          <div v-for="(log, i) in stepLog" :key="i" class="log-line">{{ log }}</div>
          <div v-if="timing" class="log-timing">{{ timing }}</div>
        </div>

        <!-- 密文包 -->
        <div v-if="encryptedPackage" class="result-box" style="margin-top: 12px">
          <details>
            <summary style="font-size: 13px; color: #1677ff; cursor: pointer">查看密文包（JSON）</summary>
            <pre style="max-height: 150px; overflow: auto; font-size: 12px">{{ encryptedPackage }}</pre>
          </details>
        </div>

        <!-- 解密结果 -->
        <div v-if="decryptedText" class="result-box">
          <div>
            <span class="label">解密结果：</span><code>{{ decryptedText }}</code>
          </div>
        </div>
      </div>
      <details class="code-details">
        <summary>查看代码</summary>
        <pre><code>// ===== 加密端（前端） =====
// 1. 生成 AES 密钥
const aesKey = CryptoJS.lib.WordArray.random(32).toString() // 256 位
const aesIv = CryptoJS.lib.WordArray.random(16).toString()

// 2. AES 加密数据
const ciphertext = CryptoJS.AES.encrypt(
  plainText, CryptoJS.enc.Hex.parse(aesKey),
  { iv: CryptoJS.enc.Hex.parse(aesIv), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
).toString()

// 3. RSA 加密 AES 密钥
const rsa = new JSEncrypt(); rsa.setPublicKey(publicKey)
const encryptedKey = rsa.encrypt(aesKey + '::' + aesIv)

// 4. 打包发送
const payload = JSON.stringify({ ek: encryptedKey, data: ciphertext })

// ===== 解密端（后端） =====
// 1. 解包
const pkg = JSON.parse(payload)

// 2. RSA 解密获取 AES 密钥
const rsa = new JSEncrypt(); rsa.setPrivateKey(privateKey)
const [key, iv] = rsa.decrypt(pkg.ek).split('::')

// 3. AES 解密数据
const plainText = CryptoJS.AES.decrypt(
  pkg.data, CryptoJS.enc.Hex.parse(key),
  { iv: CryptoJS.enc.Hex.parse(iv), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
).toString(CryptoJS.enc.Utf8)</code></pre>
      </details>
    </section>

    <!-- 性能对比 -->
    <section class="card">
      <h2>2. 性能对比：纯 RSA vs 混合加密</h2>
      <p class="desc">使用 1KB 数据进行加密，对比纯 RSA 分段加密与混合加密的耗时差异。</p>
      <div class="btn-group">
        <a-button type="primary" @click="doPerfCompare" :disabled="!rsaPubKey">开始对比</a-button>
      </div>
      <div v-if="perfData" class="result-box" style="margin-top: 12px">
        <div style="font-size: 13px; color: #888; margin-bottom: 8px">{{ perfData }}</div>
        <a-table
          :columns="[
            { title: '方案', dataIndex: 'scheme' },
            { title: '详情', dataIndex: 'detail' },
            { title: '耗时', dataIndex: 'time', width: 100 },
          ]"
          :data-source="[
            { scheme: '纯 RSA 分段', detail: perfRsaEncrypt, time: perfRsaTime },
            { scheme: 'RSA + AES 混合', detail: perfHybridEncrypt, time: perfHybridTime },
          ]"
          :pagination="false"
          size="small"
          bordered
        />
      </div>
    </section>

    <!-- 最佳实践 -->
    <section class="card">
      <h2>3. 生产环境最佳实践</h2>
      <a-table
        :columns="[
          { title: '要点', dataIndex: 'point', width: 180 },
          { title: '推荐做法', dataIndex: 'practice' },
        ]"
        :data-source="[
          { point: '密钥长度', practice: 'RSA 2048 位 + AES 256 位（GCM 模式优于 CBC）' },
          { point: '密钥生成', practice: 'RSA 密钥对在<strong>服务端</strong>生成，前端只获取公钥（通过 API）' },
          { point: 'AES 模式', practice: '优先使用 GCM 模式（认证加密），其次 CBC+HMAC' },
          { point: '密钥轮换', practice: '定期更换 RSA 密钥对，每次加密使用新的随机 AES 密钥' },
          { point: '传输格式', practice: 'JSON { ek: string, data: string, algo: string, iv?: string }' },
          { point: '安全强化', practice: 'HTTPS + 混合加密 = 纵深防御；即使 HTTPS 被破解，还有一层应用层加密' },
          { point: '前端安全', practice: '公钥应从服务端 API 获取，<strong>不要硬编码</strong>，方便更换' },
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
label {
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
.log-box {
  margin: 12px 0;
  padding: 12px;
  background: #1e1e1e;
  border-radius: 6px;
  color: #d4d4d4;
  font-family: monospace;
  font-size: 13px;
}
.log-line {
  padding: 2px 0;
  word-break: break-all;
}
.log-timing {
  margin-top: 8px;
  color: #6a9955;
  font-weight: 600;
}

/* ===== 流程图 ===== */
.flow-diagram {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin: 16px 0;
}
.flow-step {
  flex: 1;
  padding: 16px;
  border-radius: 8px;
}
.flow-sender {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
}
.flow-receiver {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
}
.flow-step h4 {
  margin: 0 0 8px;
  font-size: 14px;
}
.flow-item {
  font-size: 13px;
  color: #555;
  padding: 3px 0;
}
.flow-arrow {
  font-size: 28px;
  color: #1890ff;
  padding-top: 40px;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .flow-diagram {
    flex-direction: column;
  }
  .flow-arrow {
    display: none;
  }
}
</style>
