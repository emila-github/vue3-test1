<script setup lang="ts">
import { ref } from 'vue'
import { usePiccSkin } from '../../composables/usePiccSkin'

// 皮肤开关：演示如何即时套用 / 撤销 PICC 皮肤
const { active, toggle } = usePiccSkin()

// 演示用表单数据
const phone = ref('')
const agreed = ref(true)
const showPrice = ref(true)
</script>

<template>
  <div class="picc-page">
    <!-- NavBar 红色渐变变体（首页风格） -->
    <van-nav-bar class="van-nav-bar--picc-primary" title="PICC 车险投保" left-text="返回" left-arrow />

    <!-- 红色渐变头部 -->
    <div class="picc-header-gradient">
      <p class="header-title">人保车险 · 极速报价</p>
      <p class="header-sub">3 分钟完成，最高立省 30%</p>
    </div>

    <!-- 暖色合规提示 -->
    <div class="picc-notice-warm">为保障您的权益，投保前请完成实名认证与条款确认。</div>

    <div class="picc-section-title">保费测算</div>

    <!-- 白卡：价格展示 -->
    <div class="picc-card">
      <div class="price-row">
        <span class="price-label">预估保费</span>
        <span class="picc-price">¥<span class="picc-number-display">1,288</span></span>
      </div>
      <div class="price-row">
        <span class="price-label">最高保额</span>
        <span class="picc-number-display">2,000,000</span>
      </div>
    </div>

    <!-- 白卡：表单 -->
    <div class="picc-card">
      <van-field v-model="phone" label="手机号" placeholder="请输入投保手机号" type="tel" />
      <van-cell title="已阅读并同意《投保须知》" center>
        <template #right-icon>
          <van-switch v-model="agreed" />
        </template>
      </van-cell>
    </div>

    <!-- 主 CTA：PILL 全圆角 + 48px + 红色投影（皮肤默认生效） -->
    <div class="cta-wrap">
      <van-button type="primary" block round @click="showPrice = !showPrice"> 立即报价 </van-button>
      <van-button class="mt-btn" plain type="primary" block round @click="toggle">
        切换皮肤：{{ active ? '已开启 PICC' : '已关闭' }}
      </van-button>
    </div>
  </div>
</template>

<style scoped>
.header-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}
.header-sub {
  margin: 6px 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}
.price-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 8px 0;
}
.price-row + .price-row {
  border-top: 1px solid #f2f2f2;
}
.price-label {
  font-size: 14px;
  color: #666;
}
.cta-wrap {
  padding: 16px;
}
.mt-btn {
  margin-top: 12px;
}
</style>
