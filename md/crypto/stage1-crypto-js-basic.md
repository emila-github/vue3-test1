# Stage 1：crypto-js 基础入门

## 学习目标
- 掌握 MD5 / SHA 系列哈希的用法
- 掌握 AES / DES 对称加解密
- 理解 WordArray 核心数据结构
- 掌握 Hex / Base64 / Utf8 编码转换

## 核心内容

### 1. MD5 哈希
```ts
import CryptoJS from 'crypto-js'

const hash = CryptoJS.MD5('Hello World').toString()
// → 128 位摘要，32 字符 Hex
```

- 不可逆，常用于文件完整性校验
- 已被证明存在碰撞漏洞，不应用于安全场景
- 新项目推荐 SHA-256 及以上

### 2. SHA 系列
```ts
CryptoJS.SHA1('Hello World').toString()    // 160 位，40 Hex
CryptoJS.SHA256('Hello World').toString()  // 256 位，64 Hex
CryptoJS.SHA512('Hello World').toString()  // 512 位，128 Hex
```

- SHA-1 已不再安全，仅用于兼容
- SHA-256 是目前最推荐的单向哈希算法
- SHA-512 更安全但更长

### 3. AES 对称加密
```ts
// 加密
const encrypted = CryptoJS.AES.encrypt(
  plainText,
  CryptoJS.enc.Utf8.parse(key),  // 16 字节 = AES-128
  {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  },
).toString()

// 解密
const decrypted = CryptoJS.AES.decrypt(
  cipherText,
  CryptoJS.enc.Utf8.parse(key),
  {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  },
).toString(CryptoJS.enc.Utf8)
```

### 4. WordArray 与编码

crypto-js 的核心数据结构是 `WordArray`：

```ts
// 字符串 → WordArray
const wa = CryptoJS.enc.Utf8.parse('Hello')

// WordArray → 编码字符串
const hex = CryptoJS.enc.Hex.stringify(wa)     // Hex
const base64 = CryptoJS.enc.Base64.stringify(wa) // Base64

// 编码字符串 → WordArray
const wa2 = CryptoJS.enc.Hex.parse(hex)
const wa3 = CryptoJS.enc.Base64.parse(base64)

// WordArray → 原始字符串
wa2.toString(CryptoJS.enc.Utf8) // 'Hello'
```

## 关键概念

| 概念 | 说明 |
|------|------|
| WordArray | crypto-js 核心数据结构 `{words, sigBytes}` |
| CBC | 密码块链接模式，需要 IV，最常用的 AES 模式 |
| Pkcs7 | 标准填充方式，保证数据长度为块大小的整数倍 |
| IV | 初始化向量，CBC 模式必需，使相同明文产生不同密文 |
| MD5/SHA | 单向哈希，不可逆 |

## 注意事项

- 密钥和 IV **必须**用 `CryptoJS.enc.Utf8.parse()` 转换，否则默认为 Base64 密码短语模式
- DES 密钥仅 56 位有效，已被认为不安全，新项目应使用 AES
- 密钥长度：AES-128 = 16 字节，AES-192 = 24 字节，AES-256 = 32 字节
