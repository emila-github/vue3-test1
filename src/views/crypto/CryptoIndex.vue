<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

interface Stage {
  id: number
  title: string
  desc: string
  path: string
  icon: string
  color: string
}

const stages: Stage[] = [
  {
    id: 1,
    title: 'crypto-js 基础入门',
    desc: 'MD5 / SHA 哈希、AES / DES 加解密、Hex / Base64 编码 — 对称加密核心操作',
    path: '/crypto/stage1',
    icon: '🔤',
    color: '#fa8c16',
  },
  {
    id: 2,
    title: 'crypto-js 进阶',
    desc: 'AES 多种模式（CBC/ECB/CTR）、填充策略、HMAC 消息认证、PBKDF2 密钥派生',
    path: '/crypto/stage2',
    icon: '⚙️',
    color: '#eb2f96',
  },
  {
    id: 3,
    title: 'jsencrypt 基础入门',
    desc: 'RSA 密钥对生成、公钥加密 / 私钥解密、PEM 格式解析 — 非对称加密入门',
    path: '/crypto/stage3',
    icon: '🔑',
    color: '#722ed1',
  },
  {
    id: 4,
    title: 'jsencrypt 进阶',
    desc: 'RSA 签名 / 验签、OAEP vs PKCS1 填充、长文本分段加解密、密钥长度选择',
    path: '/crypto/stage4',
    icon: '✍️',
    color: '#13c2c2',
  },
  {
    id: 5,
    title: '混合加密实战',
    desc: 'RSA + AES 混合加密方案：用 RSA 加密 AES 密钥，AES 加密数据 — 生产级安全通信',
    path: '/crypto/stage5',
    icon: '🛡️',
    color: '#52c41a',
  },
]

const concepts = [
  {
    title: '对称加密',
    icon: '🔐',
    desc: '加密和解密使用**同一把密钥**。速度快，适合大量数据加密。代表：AES、DES。',
  },
  {
    title: '非对称加密',
    icon: '🔓',
    desc: '使用**公钥 + 私钥**配对。公钥加密，私钥解密。安全性高，但速度慢。代表：RSA。',
  },
  {
    title: '哈希（Hash）',
    icon: '🔖',
    desc: '将任意长度数据映射为**固定长度摘要**。不可逆，用于校验完整性。代表：MD5、SHA-256。',
  },
  {
    title: '数字签名',
    icon: '✍️',
    desc: '用私钥对数据签名，公钥验证。保证**数据来源可信**和**内容未被篡改**。',
  },
]

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="crypto-index">
    <!-- Header -->
    <header class="page-header">
      <h1>🔐 加密技术学习教程</h1>
      <p class="subtitle">
        涵盖 crypto-js 对称加密与哈希、jsencrypt RSA 非对称加密、混合加密方案，5 阶段系统学习。
      </p>
    </header>

    <!-- 核心概念 -->
    <section>
      <h2>核心概念</h2>
      <div class="concept-grid">
        <div v-for="c in concepts" :key="c.title" class="concept-card">
          <div class="concept-icon">{{ c.icon }}</div>
          <h3>{{ c.title }}</h3>
          <p>{{ c.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 学习阶段 -->
    <section>
      <h2>学习阶段（共 {{ stages.length }} 个）</h2>
      <div class="stage-grid">
        <div
          v-for="s in stages"
          :key="s.id"
          class="stage-card"
          :style="{ borderTopColor: s.color }"
          @click="navigateTo(s.path)"
        >
          <span class="stage-badge" :style="{ background: s.color }">{{ s.id }}</span>
          <h3>{{ s.icon }} {{ s.title }}</h3>
          <p>{{ s.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 对比总结 -->
    <section>
      <h2>加密方案对比</h2>
      <a-table
        :columns="[
          { title: '特性', dataIndex: 'feature', key: 'feature' },
          { title: 'crypto-js（对称）', dataIndex: 'crypto', key: 'crypto' },
          { title: 'jsencrypt（非对称）', dataIndex: 'jsencrypt', key: 'jsencrypt' },
          { title: '混合加密', dataIndex: 'hybrid', key: 'hybrid' },
        ]"
        :data-source="[
          { feature: '密钥类型', crypto: '单一密钥', jsencrypt: '公钥 + 私钥', hybrid: 'AES密钥 + RSA密钥对' },
          { feature: '加密速度', crypto: '快 ⚡', jsencrypt: '慢 🐢', hybrid: '较快（仅RSA加密密钥）' },
          { feature: '适用数据量', crypto: '任意大小', jsencrypt: '受密钥长度限制', hybrid: '任意大小' },
          { feature: '密钥分发', crypto: '需安全信道', jsencrypt: '公钥可公开', hybrid: '公钥可公开' },
          { feature: '安全级别', crypto: '依赖密钥长度', jsencrypt: '高（2048位+）', hybrid: '高' },
          { feature: '典型场景', crypto: '本地存储加密、文件加密', jsencrypt: '登录密码加密、数字签名', hybrid: 'HTTPS通信、API安全' },
        ]"
        :pagination="false"
        size="small"
        bordered
      />
    </section>
  </div>
</template>

<style scoped>
.crypto-index {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px 64px;
}

/* ===== Header ===== */
.page-header {
  text-align: center;
  margin-bottom: 40px;
}
.page-header h1 {
  font-size: 32px;
  margin-bottom: 8px;
}
.subtitle {
  font-size: 15px;
  color: #888;
  max-width: 640px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ===== 核心概念 ===== */
.concept-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.concept-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 20px 16px;
  text-align: center;
  transition: box-shadow 0.2s;
}
.concept-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
.concept-icon {
  font-size: 36px;
  margin-bottom: 8px;
}
.concept-card h3 {
  font-size: 15px;
  margin-bottom: 6px;
}
.concept-card p {
  font-size: 13px;
  color: #888;
  line-height: 1.5;
}

/* ===== 阶段卡片 ===== */
.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.stage-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-top: 3px solid;
  border-radius: 10px;
  padding: 20px 16px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.stage-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
.stage-badge {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 10px;
}
.stage-card h3 {
  font-size: 15px;
  margin-bottom: 6px;
}
.stage-card p {
  font-size: 13px;
  color: #888;
  line-height: 1.5;
}

/* ===== Section ===== */
section {
  margin-bottom: 40px;
}
section h2 {
  font-size: 20px;
  margin-bottom: 4px;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 24px;
  }
  .concept-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stage-grid {
    grid-template-columns: 1fr;
  }
}
</style>
