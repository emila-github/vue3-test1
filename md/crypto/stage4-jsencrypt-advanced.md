# Stage 4：jsencrypt 进阶

## 学习目标
- 掌握 RSA 数字签名与验签
- 理解长文本分段加密方案
- 理解 PKCS#1 v1.5 vs OAEP 填充
- 掌握密钥安全实践

## 核心内容

### 1. 数字签名与验签

```ts
// 签名 — 使用私钥
const sign = new JSEncrypt()
sign.setPrivateKey(privateKey)
const signature = sign.sign(message, CryptoJS.SHA256, 'sha256')

// 验签 — 使用公钥
const verify = new JSEncrypt()
verify.setPublicKey(publicKey)
const isValid = verify.verify(message, signature, CryptoJS.SHA256)
```

**签名 vs 加密**：
- 签名：私钥签名 → 公钥验签（验证**来源**）
- 加密：公钥加密 → 私钥解密（保护**内容**）

### 2. 长文本分段加密

RSA 单次加密有长度限制（1024 位密钥最多 117 字节）。超出时需分段：

```ts
function chunkString(str: string, size: number): string[] {
  const chunks: string[] = []
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.substring(i, i + size))
  }
  return chunks
}

const chunks = chunkString(longText, 100)
const encrypted = chunks.map(ch => encrypt.encrypt(ch) || '')
// 用分隔符拼接
const result = encrypted.join('|||SEGMENT|||')
```

> ⚠️ 分段加密效率低，推荐使用 Stage 5 的混合加密方案。

### 3. 填充策略对比

| 特性 | PKCS#1 v1.5 | OAEP |
|------|-------------|------|
| 安全性 | 低（Bleichenbacher 攻击） | 高（抗选择密文攻击） |
| jsencrypt 支持 | ✅ 默认 | ⚠️ 需额外处理 |
| 最大明文（1024位） | 117 字节 | 86 字节 |
| 确定性 | 确定性加密 | 概率性加密 |
| 推荐 | 兼容旧系统 | 新系统推荐 |

### 4. 签名算法参数

jsencrypt 的 `sign()` 方法第三个参数：

```ts
// 常用签名算法
sign.sign(message, CryptoJS.SHA256, 'sha256')  // ✅ 推荐
sign.sign(message, CryptoJS.SHA1, 'sha1')       // ❌ 不推荐
sign.sign(message, CryptoJS.MD5, 'md5')         // ❌ 不推荐
```

## 应用场景

| 功能 | 场景 |
|------|------|
| 签名/验签 | JWT、软件授权、数字证书、区块链 |
| 分段加密 | 临时方案（不推荐，用混合加密） |
| PKCS#1 v1.5 | 兼容旧系统 |
| OAEP | 新系统加密方案 |

## 关键概念总结

| 概念 | 说明 |
|------|------|
| 签名 | 私钥签名 → 公钥验签，保证来源和完整性 |
| 验签 | 用公钥验证签名，确认数据未被篡改 |
| 分段加密 | 超出 RSA 长度限制时的处理方式 |
| OAEP | 更安全的填充方案，新系统推荐 |
| 密钥长度 | 2048 位是最佳安全/性能平衡点 |
