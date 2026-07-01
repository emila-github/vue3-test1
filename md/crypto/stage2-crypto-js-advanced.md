# Stage 2：crypto-js 进阶

## 学习目标
- 理解 AES 五种工作模式的区别
- 掌握不同填充策略的适用场景
- 掌握 HMAC 消息认证码
- 掌握 PBKDF2 密钥派生

## 核心内容

### 1. AES 工作模式

| 模式 | 描述 | 需要 IV | 安全性 | 推荐 |
|------|------|---------|--------|------|
| CBC | 密码块链接，密文块互相关联 | ✅ 是 | 高 | ✅ 推荐 |
| ECB | 电子密码本，每块独立加密 | ❌ 否 | 低 | ❌ 避免 |
| CFB | 密文反馈，转流模式 | ✅ 是 | 中 | 可用 |
| OFB | 输出反馈，转流模式 | ✅ 是 | 中 | 可用 |
| CTR | 计数器模式，可并行 | ✅ 是 | 高 | ✅ 推荐 |

```ts
// ECB 模式（不推荐 — 相同明文 → 相同密文）
CryptoJS.AES.encrypt(data, key, {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7,
})

// CTR 模式（推荐 — 可并行处理）
CryptoJS.AES.encrypt(data, key, {
  iv: iv,
  mode: CryptoJS.mode.CTR,
  padding: CryptoJS.pad.Pkcs7,
})
```

### 2. 填充策略

```ts
// Pkcs7 — 最常用（n 字节填充 n 次值为 n 的字节）
CryptoJS.pad.Pkcs7

// ZeroPadding — 填充 0x00（不适合以 0 结尾的数据）
CryptoJS.pad.ZeroPadding

// NoPadding — 不填充（要求数据是 16 字节倍数）
CryptoJS.pad.NoPadding

// Iso97971 — ISO 标准（首字节 0x80 后跟 0x00）
CryptoJS.pad.Iso97971
```

### 3. HMAC 消息认证码

```ts
// 生成 HMAC
const hmac = CryptoJS.HmacSHA256(message, secret).toString()

// 验证（服务端重新计算并比对）
const serverHMAC = CryptoJS.HmacSHA256(receivedMsg, secret).toString()
const isValid = serverHMAC === clientHMAC

// 可选算法
CryptoJS.HmacMD5(message, secret)      // 不推荐
CryptoJS.HmacSHA1(message, secret)     // 不推荐
CryptoJS.HmacSHA256(message, secret)   // ✅ 推荐
CryptoJS.HmacSHA512(message, secret)   // 高安全需求
```

**应用场景**：API 请求签名、JWT、消息完整性验证

### 4. PBKDF2 密钥派生

```ts
const derived = CryptoJS.PBKDF2(
  password,
  CryptoJS.enc.Hex.parse(salt),
  { keySize: 256 / 32, iterations: 10000 }
).toString()
```

**最佳实践**：
- 盐（salt）：每个用户独立，16 字节以上随机值
- 迭代次数：至少 10000，推荐 100000+
- 存储格式：`$pbkdf2-sha256$iterations$salt$hash`

## 概念总结

| 概念 | 说明 | 场景 |
|------|------|------|
| CBC | 密码块链接，需要 IV | 文件加密、数据库加密 |
| ECB | 电子密码本，不推荐 | ❌ 避免使用 |
| CTR | 计数器模式，可并行 | 网络流数据加密 |
| HMAC | 带密钥哈希，验证完整性 | API 签名、JWT |
| PBKDF2 | 密码 → 安全密钥 | 密码哈希存储 |
