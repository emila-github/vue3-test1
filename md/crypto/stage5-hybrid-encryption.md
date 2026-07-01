# Stage 5：RSA + AES 混合加密实战

## 学习目标
- 理解混合加密的设计原理
- 掌握完整的加解密流程
- 了解生产环境最佳实践

## 核心原理

混合加密结合了两者的优势：

| 特性 | RSA | AES | 混合加密 |
|------|-----|-----|----------|
| 速度 | 慢 | 快 | 快（仅 RSA 加密 32 字节密钥） |
| 安全性 | 高 | 依赖密钥分发 | 高 |
| 数据量 | 受密钥长度限制 | 无限制 | 无限制 |
| 密钥分发 | 公钥可公开 | 需要安全信道 | 公钥可公开 |

## 加密流程

```
前端（加密）
  ① 生成随机 AES-256 密钥 + IV
  ② AES 加密明文 → 密文
  ③ RSA 公钥加密 AES 密钥 → 加密密钥
  ④ 打包 { ek, data } 发送

服务端（解密）
  ① 从 { ek, data } 解包
  ② RSA 私钥解密 ek → AES 密钥 + IV
  ③ AES 密钥解密 data → 明文
  ④ 得到原始数据
```

## 代码实现

### 加密端（前端）

```ts
// 1. 生成随机 AES 密钥
const aesKey = CryptoJS.lib.WordArray.random(32).toString() // 256 位
const aesIv = CryptoJS.lib.WordArray.random(16).toString()

// 2. AES 加密数据
const ciphertext = CryptoJS.AES.encrypt(
  plainText,
  CryptoJS.enc.Hex.parse(aesKey),
  {
    iv: CryptoJS.enc.Hex.parse(aesIv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  },
).toString()

// 3. RSA 加密 AES 密钥
const rsa = new JSEncrypt()
rsa.setPublicKey(publicKey)
const encryptedKey = rsa.encrypt(aesKey + '::' + aesIv)

// 4. 打包
const payload = JSON.stringify({
  ek: encryptedKey,      // 加密后的密钥
  data: ciphertext,       // AES 密文
  algo: 'AES-256-CBC',    // 算法标识
})
```

### 解密端（服务端）

```ts
// 1. 解包
const pkg = JSON.parse(payload)

// 2. RSA 解密获取 AES 密钥
const rsa = new JSEncrypt()
rsa.setPrivateKey(privateKey)
const [key, iv] = rsa.decrypt(pkg.ek).split('::')

// 3. AES 解密数据
const plainText = CryptoJS.AES.decrypt(
  pkg.data,
  CryptoJS.enc.Hex.parse(key),
  {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  },
).toString(CryptoJS.enc.Utf8)
```

## 生产环境最佳实践

| 要点 | 推荐做法 |
|------|----------|
| 密钥长度 | RSA 2048 位 + AES 256 位 |
| AES 模式 | GCM（认证加密）优于 CBC+HMAC |
| 密钥来源 | RSA 密钥对在**服务端**生成，公钥通过 API 下发 |
| 密钥管理 | 每次加密用新的随机 AES 密钥，定期轮换 RSA 密钥对 |
| 传输格式 | `{ ek, data, algo, iv? }` JSON 结构 |
| 纵深防御 | HTTPS + 混合加密，即使 HTTPS 被破解仍有应用层保护 |
| 公钥管理 | 从 API 获取，不要硬编码，方便轮换 |

## 为什么这样设计？

- **RSA 很慢但安全**：只用来加密 32 字节的 AES 密钥，代价可忽略
- **AES 很快但不安全分发**：用来加密任意大小的数据，但密钥需要用 RSA 安全传输
- **两者结合**：RSA 解决密钥分发难题，AES 解决加密效率问题

这就是 HTTPS（TLS）的核心设计思路：握手阶段用 RSA/ECDHE 交换对称密钥，之后用 AES 加密通信数据。
