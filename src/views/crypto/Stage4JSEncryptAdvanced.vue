<script setup lang="ts">
import { ref } from 'vue'
import JSEncrypt from 'jsencrypt'
import CryptoJS from 'crypto-js'

// ===== 签名与验签 =====
const signKeySize = ref(1024)
const signPubKey = ref('')
const signPrivKey = ref('')
const signMessage = ref('转账 100 元到账号 8888')
const signature = ref('')
const signVerifyResult = ref('')

function genSignKeys() {
  const encrypt = new JSEncrypt({ default_key_size: String(signKeySize.value) })
  signPubKey.value = encrypt.getPublicKey() || ''
  signPrivKey.value = encrypt.getPrivateKey() || ''
  signature.value = ''
  signVerifyResult.value = ''
}

function doSign() {
  if (!signPrivKey.value) return
  const sign = new JSEncrypt()
  sign.setPrivateKey(signPrivKey.value)
  signature.value = sign.sign(signMessage.value, CryptoJS.SHA256, 'sha256') || '签名失败'
  signVerifyResult.value = ''
}

function doVerify() {
  if (!signPubKey.value || !signature.value) return
  const verify = new JSEncrypt()
  verify.setPublicKey(signPubKey.value)
  const valid = verify.verify(signMessage.value, signature.value, CryptoJS.SHA256)
  signVerifyResult.value = valid ? '✅ 验签通过 — 签名有效，消息未被篡改' : '❌ 验签失败 — 签名无效或消息已被篡改'
}

// 防篡改演示
const tamperedMsg = ref('转账 10000 元到账号 8888')
const tamperResult = ref('')
function doTamperDemo() {
  if (!signPubKey.value || !signature.value) return
  const verify = new JSEncrypt()
  verify.setPublicKey(signPubKey.value)
  const valid = verify.verify(tamperedMsg.value, signature.value, CryptoJS.SHA256)
  tamperResult.value = valid
    ? '❓ 签名居然有效（理论上不应该）'
    : `❌ 验签失败 — 消息内容被篡改，签名无效！
  原始消息：${signMessage.value}
  篡改后：${tamperedMsg.value}`
}

// ===== 长文本分段加密 =====
const longText = ref('')
const longSegPubKey = ref('')
const longSegPrivKey = ref('')
const longSegEncrypted = ref('')
const longSegDecrypted = ref('')
const segmentInfo = ref('')

function genLongTextKeys() {
  const encrypt = new JSEncrypt({ default_key_size: '1024' })
  longSegPubKey.value = encrypt.getPublicKey() || ''
  longSegPrivKey.value = encrypt.getPrivateKey() || ''
  longSegEncrypted.value = ''
  longSegDecrypted.value = ''
  segmentInfo.value = ''
  longText.value =
    '这是一段比较长的文本数据，用于测试 RSA 分段加密。由于 RSA 1024 位密钥每次最多只能加密 117 字节的数据，超过这个长度就需要分段处理。实际生产环境中，推荐使用混合加密方案（RSA 加密 AES 密钥 + AES 加密数据）来处理大量数据，这样既安全又高效。'
}

function chunkString(str: string, size: number): string[] {
  const chunks: string[] = []
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.substring(i, i + size))
  }
  return chunks
}

function doLongTextEncrypt() {
  if (!longSegPubKey.value) return
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(longSegPubKey.value)

  // 1024 位密钥：PKCS#1 v1.5 填充下最多 117 字节
  // 这里是 UTF-8 字符串，中文 1 字符 = 3 字节，所以一次最多 39 个中文字符
  const maxChunk = 100 // 保守取值
  const chunks = chunkString(longText.value, maxChunk)

  const encryptedChunks = chunks.map((chunk) => encrypt.encrypt(chunk) || '')
  longSegEncrypted.value = encryptedChunks.join('|||SEGMENT|||')
  const totalLen = enc.encode(longText.value).byteLength
  segmentInfo.value = `原文：${longText.value.length} 字符 / ${totalLen} 字节（UTF-8） → 分为 ${chunks.length} 段加密`
}

function doLongTextDecrypt() {
  if (!longSegPrivKey.value || !longSegEncrypted.value) return
  const decrypt = new JSEncrypt()
  decrypt.setPrivateKey(longSegPrivKey.value)

  const chunks = longSegEncrypted.value.split('|||SEGMENT|||')
  const decryptedChunks = chunks.map((chunk) => decrypt.decrypt(chunk) || '')
  longSegDecrypted.value = decryptedChunks.join('')
}

const enc = new TextEncoder()

// ===== OAEP vs PKCS1 =====
const oaepInput = ref('OAEP 填充测试数据')
const oaepPubKey = ref('')
const oaepPrivKey = ref('')
const oaepEncrypted = ref('')
const oaepDecrypted = ref('')

function genOAEPKeys() {
  const encrypt = new JSEncrypt({ default_key_size: '1024' })
  oaepPubKey.value = encrypt.getPublicKey() || ''
  oaepPrivKey.value = encrypt.getPrivateKey() || ''
  oaepEncrypted.value = ''
  oaepDecrypted.value = ''
}

function doOAEPEncrypt() {
  if (!oaepPubKey.value) return
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(oaepPubKey.value)
  // jsencrypt 默认使用 PKCS#1 v1.5 填充
  // OAEP 需要特别设置（jsencrypt 可能不完全支持 OAEP）
  oaepEncrypted.value = encrypt.encrypt(oaepInput.value) || '加密失败'
}

function doOAEPDecrypt() {
  if (!oaepPrivKey.value || !oaepEncrypted.value) return
  const decrypt = new JSEncrypt()
  decrypt.setPrivateKey(oaepPrivKey.value)
  oaepDecrypted.value = decrypt.decrypt(oaepEncrypted.value) || '解密失败'
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>✍️ Stage 4：jsencrypt 进阶</h1>
      <p>RSA 签名/验签、长文本分段加解密、填充策略对比、密钥安全实践</p>
    </header>

    <!-- 签名与验签 -->
    <section class="card">
      <h2>1. RSA 数字签名与验签</h2>
      <p class="desc">
        <strong>签名</strong>：用私钥对数据摘要签名 →
        <strong>验签</strong>：用公钥验证签名。保证数据来源可信、未被篡改。
      </p>
      <div class="demo-row">
        <a-radio-group v-model:value="signKeySize">
          <a-radio :value="1024">1024</a-radio>
          <a-radio :value="2048">2048</a-radio>
        </a-radio-group>
        <a-button @click="genSignKeys">生成签名密钥对</a-button>
      </div>
      <div v-if="signPrivKey" style="margin-top: 12px">
        <div>
          <label>待签名消息</label>
          <a-textarea v-model:value="signMessage" :rows="2" />
        </div>
        <div class="btn-group">
          <a-button type="primary" @click="doSign">🔏 私钥签名</a-button>
          <a-button :disabled="!signature" @click="doVerify">🔍 公钥验签</a-button>
        </div>
        <div v-if="signature" class="result-box">
          <div>
            <span class="label">签名（Base64）：</span><code class="break-all">{{ signature }}</code>
          </div>
          <div v-if="signVerifyResult" v-html="signVerifyResult" style="font-size: 14px"></div>
        </div>

        <!-- 防篡改演示 -->
        <div v-if="signature" style="margin-top: 16px">
          <h3>🛡️ 防篡改演示</h3>
          <div class="demo-row">
            <a-input v-model:value="tamperedMsg" placeholder="输入篡改后的消息" style="flex: 1" />
            <a-button type="primary" danger @click="doTamperDemo">验证篡改</a-button>
          </div>
          <div v-if="tamperResult" class="result-box" style="margin-top: 8px" v-html="tamperResult"></div>
        </div>
      </div>
      <details class="code-details">
        <summary>查看代码</summary>
        <pre><code>// 签名 — 使用私钥
const sign = new JSEncrypt()
sign.setPrivateKey(privateKey)
const signature = sign.sign(message, CryptoJS.SHA256, 'sha256')

// 验签 — 使用公钥
const verify = new JSEncrypt()
verify.setPublicKey(publicKey)
const isValid = verify.verify(message, signature, CryptoJS.SHA256)

// 签名 vs 加密的区别：
// 签名：私钥签名 → 公钥验签（验证来源）
// 加密：公钥加密 → 私钥解密（保护内容）</code></pre>
      </details>
    </section>

    <!-- 长文本分段 -->
    <section class="card">
      <h2>2. 长文本分段加密</h2>
      <p class="desc">
        RSA 单次加密有长度限制（1024 位密钥最长 117
        字节）。超出时需<strong>分段加密</strong>，但更推荐使用混合加密（Stage 5）。
      </p>
      <div class="btn-group">
        <a-button @click="genLongTextKeys">生成密钥对（1024）</a-button>
      </div>
      <div v-if="longSegPubKey">
        <a-textarea v-model:value="longText" :rows="3" placeholder="输入长文本..." style="margin-top: 12px" />
        <div class="btn-group">
          <a-button type="primary" @click="doLongTextEncrypt">分段加密</a-button>
          <a-button :disabled="!longSegEncrypted" @click="doLongTextDecrypt">分段解密</a-button>
        </div>
        <div v-if="segmentInfo" class="result-box">
          <p style="font-size: 13px; color: #888">{{ segmentInfo }}</p>
        </div>
        <div v-if="longSegEncrypted" class="result-box">
          <div>
            <span class="label">分段密文（用 |||SEGMENT||| 分隔）：</span>
            <pre style="max-height: 120px; overflow: auto; font-size: 12px; word-break: break-all">{{
              longSegEncrypted
            }}</pre>
          </div>
          <div v-if="longSegDecrypted">
            <span class="label">解密结果：</span><code>{{ longSegDecrypted }}</code>
          </div>
        </div>
      </div>
      <details class="code-details">
        <summary>查看代码</summary>
        <pre><code>// 分段加密（仅演示，生产环境用混合加密）
function chunkString(str: string, size: number): string[] {
  const chunks: string[] = []
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.substring(i, i + size))
  }
  return chunks
}

const chunks = chunkString(longText, 100) // 100 字符一段
const encrypted = chunks.map(ch => encrypt.encrypt(ch))

// 分段解密
const decrypted = encryptedChunks.map(ch => decrypt.decrypt(ch)).join('')</code></pre>
      </details>
      <p class="tip-box">
        ⚠️ <strong>分段加密的缺点</strong>：RSA 很慢，每段都要做一次大数运算。对大量数据，推荐使用 Stage 5
        的<strong>混合加密</strong>方案。
      </p>
    </section>

    <!-- 填充策略 -->
    <section class="card">
      <h2>3. 填充策略：PKCS#1 v1.5 vs OAEP</h2>
      <p class="desc">
        jsencrypt 默认使用 PKCS#1 v1.5 填充。OAEP（Optimal Asymmetric Encryption Padding）更安全，能防止选择密文攻击。
      </p>
      <div class="demo-row">
        <a-button @click="genOAEPKeys">生成密钥对（1024）</a-button>
      </div>
      <div v-if="oaepPubKey" style="margin-top: 12px">
        <div>
          <label>明文</label>
          <a-textarea v-model:value="oaepInput" :rows="2" />
        </div>
        <div class="btn-group">
          <a-button type="primary" @click="doOAEPEncrypt">PKCS#1 v1.5 加密</a-button>
          <a-button :disabled="!oaepEncrypted" @click="doOAEPDecrypt">解密</a-button>
        </div>
        <div v-if="oaepEncrypted" class="result-box">
          <div>
            <span class="label">密文（PKCS#1 v1.5）：</span><code class="break-all">{{ oaepEncrypted }}</code>
          </div>
          <div v-if="oaepDecrypted">
            <span class="label">解密：</span><code>{{ oaepDecrypted }}</code>
          </div>
        </div>
      </div>
      <a-table
        :columns="[
          { title: '特性', dataIndex: 'feature' },
          { title: 'PKCS#1 v1.5', dataIndex: 'pkcs1' },
          { title: 'OAEP', dataIndex: 'oaep' },
        ]"
        :data-source="[
          { feature: '安全性', pkcs1: '较低（存在 Bleichenbacher 攻击）', oaep: '高（抗选择密文攻击）' },
          { feature: 'jsencrypt 支持', pkcs1: '✅ 默认支持', oaep: '⚠️ 需额外处理' },
          { feature: '最大明文长度（1024位）', pkcs1: '117 字节', oaep: '86 字节（因哈希开销）' },
          { feature: '确定性', pkcs1: '确定性（相同输入→相同密文）', oaep: '概率性（每次加密结果不同）' },
          { feature: '推荐场景', pkcs1: '兼容旧系统', oaep: '新系统推荐' },
        ]"
        :pagination="false"
        size="small"
        bordered
        style="margin-top: 12px"
      />
    </section>

    <!-- 概念总结 -->
    <section class="card">
      <h2>📖 进阶概念总结</h2>
      <a-table
        :columns="[
          { title: '概念', dataIndex: 'name', key: 'name', width: 130 },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
          { title: '应用场景', dataIndex: 'scene', key: 'scene' },
        ]"
        :data-source="[
          { name: '签名/验签', desc: '私钥签名 → 公钥验签，保证数据来源和完整性', scene: 'JWT、软件授权、数字证书' },
          { name: '分段加密', desc: 'RSA 有长度限制，长数据需分段处理', scene: '临时方案，推荐混合加密' },
          { name: 'PKCS#1 v1.5', desc: '传统填充方案，存在已知攻击', scene: '兼容旧系统' },
          { name: 'OAEP', desc: '更安全的填充方案，抗选择密文攻击', scene: '新系统推荐' },
          { name: '密钥长度', desc: '2048 位是目前平衡安全与性能的最佳选择', scene: '通用场景' },
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
.demo-grid label,
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
