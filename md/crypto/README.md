# 🔐 加密技术学习教程

## 概述

本教程涵盖前端加密两大核心库 **crypto-js**（对称加密与哈希）和 **jsencrypt**（RSA 非对称加密），以及生产级的混合加密方案。

## 学习路径（5 阶段）

| 阶段 | 内容 | 核心库 |
|------|------|--------|
| Stage 1 | 基础入门：MD5/SHA 哈希、AES/DES 加密、编码转换 | crypto-js |
| Stage 2 | 进阶：AES 模式对比、填充策略、HMAC、PBKDF2 | crypto-js |
| Stage 3 | 基础入门：RSA 密钥对、公钥加密/私钥解密、PEM 格式 | jsencrypt |
| Stage 4 | 进阶：RSA 签名/验签、长文本分段、填充策略 | jsencrypt |
| Stage 5 | 混合加密实战：RSA + AES 生产级安全通信方案 | crypto-js + jsencrypt |

## 核心概念

### 对称加密（crypto-js）
- 加密和解密使用**同一把密钥**
- 速度快，适合大量数据加密
- 代表算法：AES（推荐）、DES（已过时）
- 密钥分发是核心难题

### 非对称加密（jsencrypt）
- 使用**公钥 + 私钥**配对
- 公钥加密 → 私钥解密
- 私钥签名 → 公钥验签
- 安全性高，但速度慢
- 解决了密钥分发问题

### 哈希（crypto-js）
- 将任意长度数据映射为固定长度摘要
- 不可逆，用于校验完整性
- MD5（已不安全）、SHA-256（推荐）

### 混合加密
- **RSA 加密 AES 密钥** + **AES 加密数据**
- 兼顾 RSA 的安全性和 AES 的速度
- HTTPS、API 加密等生产场景的标准方案

## 知识体系

```
加密技术
├── 对称加密 (crypto-js)
│   ├── 哈希: MD5, SHA-1, SHA-256, SHA-512
│   ├── 加密: AES (CBC/ECB/CFB/OFB/CTR), DES
│   ├── 编码: Hex, Base64, Utf8
│   ├── 认证: HMAC (HmacSHA256, HmacSHA512)
│   └── 密钥派生: PBKDF2
├── 非对称加密 (jsencrypt)
│   ├── 密钥生成: 1024/2048/4096 位
│   ├── 加密解密: 公钥加密 / 私钥解密
│   ├── 签名验签: 私钥签名 / 公钥验签
│   └── 填充: PKCS#1 v1.5, OAEP
└── 混合加密 (crypto-js + jsencrypt)
    ├── RSA 加密 AES 密钥
    └── AES 加密实际数据
```

## 安装依赖

```bash
pnpm add crypto-js jsencrypt
pnpm add -D @types/crypto-js
```
