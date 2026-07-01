# Stage 3：jsencrypt 基础入门

## 学习目标
- 理解 RSA 非对称加密原理
- 掌握密钥对生成
- 掌握公钥加密 / 私钥解密
- 理解 PEM 密钥格式

## 核心内容

### 1. RSA 加密原理

```
服务端生成密钥对 → 公钥发送给前端 → 前端公钥加密数据 → 
服务端私钥解密 → 即使公钥被截获也无法解密
```

### 2. 生成密钥对

```ts
import JSEncrypt from 'jsencrypt'

const encrypt = new JSEncrypt({ default_key_size: '2048' })
const publicKey = encrypt.getPublicKey()
const privateKey = encrypt.getPrivateKey()
```

| 密钥长度 | 安全性 | 性能 | 推荐 |
|----------|--------|------|------|
| 1024 位 | 低（已被破解风险） | 快 | ❌ 不推荐 |
| 2048 位 | 高 | 适中 | ✅ 推荐 |
| 4096 位 | 极高 | 慢 | 高安全场景 |

> ⚠️ 生产环境中密钥对应在**服务端**生成，前端只获取公钥。

### 3. 公钥加密 / 私钥解密

```ts
// 公钥加密
const encrypt = new JSEncrypt()
encrypt.setPublicKey(publicKey)
const ciphertext = encrypt.encrypt('敏感数据')

// 私钥解密
const decrypt = new JSEncrypt()
decrypt.setPrivateKey(privateKey)
const plaintext = decrypt.decrypt(ciphertext)
```

### 4. 加密长度限制

| 密钥长度 | 最大加密字节（PKCS#1 v1.5） |
|----------|---------------------------|
| 1024 位 | 117 字节 |
| 2048 位 | 245 字节 |
| 4096 位 | 501 字节 |

超出限制需分段加密或使用混合加密（见 Stage 5）。

### 5. PEM 格式

```pem
# 公钥
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD...
-----END PUBLIC KEY-----

# 私钥（PKCS#1）
-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDR...
-----END RSA PRIVATE KEY-----

# 私钥（PKCS#8）
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0B...
-----END PRIVATE KEY-----
```

## 概念总结

| 概念 | 说明 |
|------|------|
| 公钥 | 可公开分发，用于加密或验签 |
| 私钥 | 必须保密，用于解密或签名 |
| PEM | 密钥标准文本格式，BEGIN/END 包裹 |
| encrypt() | 公钥加密 → Base64 密文 |
| decrypt() | 私钥解密 → 原文 |

## 注意事项

- 不要在前端生成生产用的 RSA 密钥对（应在后端生成）
- 公钥可以从服务端 API 获取，方便轮换
- 加密数据有长度限制，大量数据用混合加密
