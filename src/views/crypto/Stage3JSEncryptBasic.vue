<script setup lang="ts">
import { ref } from 'vue'
import JSEncrypt from 'jsencrypt'

// ===== 密钥对生成 =====
const keySize = ref(1024) // 1024 仅用于演示，生产用 2048+
const publicKey = ref('')
const privateKey = ref('')
function generateKeyPair() {
  const encrypt = new JSEncrypt({ default_key_size: String(keySize.value) })
  publicKey.value = encrypt.getPublicKey() || ''
  privateKey.value = encrypt.getPrivateKey() || ''
  rsaEncrypted.value = ''
  rsaDecrypted.value = ''
}

// ===== RSA 加密解密 =====
const rsaInput = ref('你好，这是需要加密传输的敏感数据')
const rsaEncrypted = ref('')
const rsaDecrypted = ref('')
function doRSAEncrypt() {
  if (!publicKey.value) return
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey.value)
  rsaEncrypted.value = encrypt.encrypt(rsaInput.value) || '加密失败'
  rsaDecrypted.value = ''
}
function doRSADecrypt() {
  if (!privateKey.value || !rsaEncrypted.value) return
  const decrypt = new JSEncrypt()
  decrypt.setPrivateKey(privateKey.value)
  rsaDecrypted.value = decrypt.decrypt(rsaEncrypted.value) || '解密失败'
}

// ===== 预设密钥对（1024 位固定密钥，方便测试） =====
const presetPubKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDRWraCk8AHJhY0xHKaoVWy+HLN
mTFXdbiBvS/GBuRE6hHjIPZPZ4VKJfX3dSO2qHLCrGpMHoYm1EJPIsO7a2eD45KR
dBHQrWB+IEqHNFk2r5Hh/Ckq4CqTDxJEnMlI5Jz8Cw9dLfCwgW8SHMPHhXLw1iyD
5J+chPSGj+GR8zjMGQIDAQAB
-----END PUBLIC KEY-----`
const presetPrivKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDRWraCk8AHJhY0xHKaoVWy+HLNmTFXdbiBvS/GBuRE6hHjIPZP
Z4VKJfX3dSO2qHLCrGpMHoYm1EJPIsO7a2eD45KRdBHQrWB+IEqHNFk2r5Hh/Ckq
4CqTDxJEnMlI5Jz8Cw9dLfCwgW8SHMPHhXLw1iyD5J+chPSGj+GR8zjMGQIDAQAB
AoGBAIkvAU9cXPFhnK3FEYRQPJ6K4L0BiR7QHEC5M3mYNkMlvKqLHC5ZCSsAeIcL
GcF8DxPNRkQqDNC5ZhONyGC4B2xLmHLBtYNCDxHURwJMYkZQKNZvXnK8wKSbPMET
sXHQJtK+LiCp3sSZtSKOXPyKeApFx5xopzB6eFmNFLZJvCwBAkEA+UY7CrUqYNvM
H0ZGLFQwJfFRDqLQKz4HNXCzqXKqZYk0OFf0Z9RkNcOoFYOQDwDQRxXqEHLPFZOD
K8KjGyYhAQJBANevQ+QMqVSiXY0RwH0YQJoYlCq4K3WCYDKXGQXwGQLzXQqZCwf0
k5HGFLxR3FJh5YKqCj0KpNvSFNqWbFh1SwkCQQCqE0GfQOEwlYpRmKLNlBkHpWKj
RCTHhZPjQCxkZwZXOlgmYKjJdE6sOVEEbGQvJxFPTLqKqQFuWAmpDRcLqOABAkAq
iDZNQ+5xRQDhCqKqJNFKqNFKqNFKqNFKqNFKqNFKqNFKqNFKqNFKqNFKqNFKqNFK
qNFKqNFKqNFKqNFKqNFKqNFKqNFAkAJEmOJpKqNFKqNFKqNFKqNFKqNFKqNFKqNF
KqNFKqNFKqNFKqNFKqNFKqNFKqNFKqNFKqNFKqNFKqNFKqNFKqNFKqNFKqNFKqN
-----END RSA PRIVATE KEY-----`

function usePresetKeys() {
  publicKey.value = presetPubKey
  privateKey.value = presetPrivKey
  rsaEncrypted.value = ''
  rsaDecrypted.value = ''
}

// ===== PEM 格式解析 =====
const pemCheck = ref('')
const pemResult = ref('')
function checkPEM() {
  if (pemCheck.value.includes('BEGIN PUBLIC KEY')) {
    pemResult.value = '✅ 识别到 <strong>公钥</strong>（PUBLIC KEY）格式'
  } else if (pemCheck.value.includes('BEGIN RSA PRIVATE KEY')) {
    pemResult.value = '✅ 识别到 <strong>私钥</strong>（RSA PRIVATE KEY）格式'
  } else if (pemCheck.value.includes('BEGIN PRIVATE KEY')) {
    pemResult.value = '✅ 识别到 <strong>私钥</strong>（PRIVATE KEY）格式'
  } else {
    pemResult.value = '❌ 未识别到有效的 PEM 密钥格式'
  }
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>🔑 Stage 3：jsencrypt 基础入门</h1>
      <p>RSA 密钥对生成、公钥加密/私钥解密、PEM 格式解析</p>
    </header>

    <!-- 背景知识 -->
    <section class="card">
      <h2>📖 RSA 非对称加密原理</h2>
      <p class="desc">
        RSA 基于大整数因子分解的数学难题。通信双方：
      </p>
      <ol style="font-size:14px; color:#666; line-height:2">
        <li>服务端生成<strong>公钥 + 私钥</strong>对</li>
        <li>公钥<strong>公开发送</strong>给前端（可内嵌在页面中）</li>
        <li>前端用<strong>公钥加密</strong>敏感数据（如密码）发送给服务端</li>
        <li>服务端用<strong>私钥解密</strong>，因为只有服务端拥有私钥</li>
        <li>即使公钥被拦截，也无法解密数据（需要私钥）</li>
      </ol>
      <p class="tip-box">
        💡 <strong>核心优势</strong>：公钥可以公开分发，无需安全信道传输密钥。解决了对称加密中"密钥如何安全共享"的难题。
      </p>
    </section>

    <!-- 密钥生成 -->
    <section class="card">
      <h2>1. 生成 RSA 密钥对</h2>
      <p class="desc">
        使用 jsencrypt 在前端生成密钥对。注意：生产环境中密钥对应在<strong>服务端</strong>生成，前端只持有公钥。
      </p>
      <div class="demo-row">
        <label>密钥长度：</label>
        <a-radio-group v-model:value="keySize">
          <a-radio :value="1024">1024（演示用）</a-radio>
          <a-radio :value="2048">2048（推荐）</a-radio>
          <a-radio :value="4096">4096（高安全）</a-radio>
        </a-radio-group>
        <a-button type="primary" @click="generateKeyPair">生成密钥对</a-button>
        <a-button @click="usePresetKeys">使用预设密钥</a-button>
      </div>
      <div v-if="publicKey" style="margin-top:16px">
        <div class="key-box">
          <p class="key-title">📋 公钥（可公开）：</p>
          <pre><code>{{ publicKey }}</code></pre>
        </div>
        <div class="key-box">
          <p class="key-title">🔐 私钥（请勿泄露！仅演示）：</p>
          <pre><code>{{ privateKey }}</code></pre>
        </div>
      </div>
      <details class="code-details">
        <summary>查看代码</summary>
        <pre><code>import JSEncrypt from 'jsencrypt'

// 生成 RSA 密钥对
const encrypt = new JSEncrypt({ default_key_size: '2048' })
const publicKey = encrypt.getPublicKey()
const privateKey = encrypt.getPrivateKey()</code></pre>
      </details>
    </section>

    <!-- 加密解密 -->
    <section class="card">
      <h2>2. RSA 公钥加密 / 私钥解密</h2>
      <p class="desc">
        前端使用公钥加密数据 → 传输密文 → 服务端使用私钥解密。即使传输被拦截，没有私钥也无法解密。
      </p>
      <div>
        <label>原文</label>
        <a-textarea v-model:value="rsaInput" :rows="2" />
      </div>
      <div class="btn-group">
        <a-button type="primary" :disabled="!publicKey" @click="doRSAEncrypt">🔒 公钥加密</a-button>
        <a-button :disabled="!rsaEncrypted" @click="doRSADecrypt">🔓 私钥解密</a-button>
      </div>
      <div v-if="rsaEncrypted" class="result-box">
        <div><span class="label">密文（Base64）：</span><code class="break-all">{{ rsaEncrypted }}</code></div>
        <div v-if="rsaDecrypted"><span class="label">解密结果：</span><code>{{ rsaDecrypted }}</code></div>
      </div>
      <details class="code-details">
        <summary>查看代码</summary>
        <pre><code>// 公钥加密
const encrypt = new JSEncrypt()
encrypt.setPublicKey(publicKey)
const ciphertext = encrypt.encrypt('敏感数据')

// 私钥解密
const decrypt = new JSEncrypt()
decrypt.setPrivateKey(privateKey)
const plaintext = decrypt.decrypt(ciphertext)</code></pre>
      </details>
    </section>

    <!-- PEM 格式 -->
    <section class="card">
      <h2>3. PEM 密钥格式</h2>
      <p class="desc">
        PEM（Privacy Enhanced Mail）是密钥的标准文本格式，以 <code>-----BEGIN ...-----</code> 开头。
      </p>
      <a-textarea v-model:value="pemCheck" :rows="4" placeholder="粘贴 PEM 格式的公钥或私钥..." />
      <div class="btn-group">
        <a-button type="primary" @click="checkPEM">识别格式</a-button>
      </div>
      <div v-if="pemResult" class="result-box">
        <p v-html="pemResult" style="font-size:14px"></p>
      </div>
      <details class="code-details">
        <summary>PEM 格式说明</summary>
        <pre><code>// PEM 公钥格式
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD...
-----END PUBLIC KEY-----

// PEM 私钥格式
-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDR...
-----END RSA PRIVATE KEY-----

// PKCS#8 私钥格式（另一种常见格式）
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0B...
-----END PRIVATE KEY-----</code></pre>
      </details>
    </section>

    <!-- 概念总结 -->
    <section class="card">
      <h2>📖 基础概念总结</h2>
      <a-table
        :columns="[
          { title: '概念', dataIndex: 'name', key: 'name', width: 120 },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="[
          { name: '公钥', desc: '可以公开分发，用于加密数据或验证签名' },
          { name: '私钥', desc: '必须保密！用于解密数据或生成签名' },
          { name: '密钥长度', desc: '1024（不安全）、2048（推荐）、4096（高安全但慢）' },
          { name: 'PEM', desc: '密钥的标准文本格式，以 BEGIN/END 包裹 Base64 编码' },
          { name: 'encrypt()', desc: '使用公钥加密，返回 Base64 密文' },
          { name: 'decrypt()', desc: '使用私钥解密，返回原文' },
          { name: '加密长度限制', desc: '1024位密钥最多加密 117 字节；2048位最多 245 字节（PKCS#1 v1.5）' },
        ]"
        :pagination="false"
        size="small"
        bordered
      />
    </section>
  </div>
</template>

<style scoped>
.stage-page { max-width: 860px; margin: 0 auto; padding: 32px 16px 64px; }
.page-header { text-align: center; margin-bottom: 32px; }
.page-header h1 { font-size: 26px; margin-bottom: 6px; }
.page-header p { font-size: 14px; color: #888; }
.card { background: #fff; border: 1px solid #f0f0f0; border-radius: 10px; padding: 24px; margin-bottom: 24px; }
.card h2 { font-size: 18px; margin-bottom: 4px; }
.desc { font-size: 14px; color: #888; margin-bottom: 16px; line-height: 1.6; }
.demo-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin: 12px 0; }
.demo-row label { font-size: 13px; color: #666; }
.btn-group { display: flex; gap: 10px; margin: 12px 0; }
.result-box { margin: 12px 0; padding: 12px; background: #fafafa; border-radius: 6px; border: 1px solid #f0f0f0; }
.result-box .label { font-size: 13px; color: #666; font-weight: 600; }
.result-box code { font-size: 13px; word-break: break-all; }
.break-all { word-break: break-all; }
.tip-box { margin-top: 12px; padding: 10px 14px; background: #fffbe6; border: 1px solid #ffe58f; border-radius: 6px; font-size: 13px; color: #9a6e00; }
.key-box { margin: 10px 0; padding: 12px; background: #f6f8fa; border-radius: 6px; border: 1px solid #e8e8e8; }
.key-title { font-size: 13px; font-weight: 600; color: #333; margin-bottom: 6px; }
.key-box pre { margin: 0; font-size: 11px; max-height: 100px; overflow: auto; }
.code-details { margin-top: 12px; }
.code-details summary { font-size: 13px; color: #1677ff; cursor: pointer; }
.code-details pre { margin-top: 8px; padding: 12px; background: #f6f8fa; border-radius: 6px; overflow-x: auto; font-size: 13px; }
</style>
