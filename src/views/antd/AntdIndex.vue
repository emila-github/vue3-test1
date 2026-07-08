<script setup lang="ts">
/**
 * Ant Design Vue 4.2.6 学习入口
 */
import { RouterLink } from 'vue-router'
import {
  RocketOutlined,
  AppstoreOutlined,
  ToolOutlined,
  BgColorsOutlined,
  ThunderboltOutlined,
  TableOutlined,
  FormOutlined,
} from '@ant-design/icons-vue'

const stages = [
  {
    title: '阶段一：技术选型与项目起步',
    description: 'Button、Icon、Select、Radio、Switch、DatePicker、Tag 等基础组件',
    icon: RocketOutlined,
    route: '/antd/stage1',
    color: '#1677ff',
  },
  {
    title: '阶段二：核心组件与开发规范',
    description: 'Form 表单校验、Table 表格、Modal/Drawer 弹框，v-model vs :value+@change',
    icon: AppstoreOutlined,
    route: '/antd/stage2',
    color: '#52c41a',
  },
  {
    title: '阶段三：组件二次封装与原子设计',
    description: 'AddButton 封装、v-model 双向绑定协议、destroyOnClose 避坑、useFormModal',
    icon: ToolOutlined,
    route: '/antd/stage3',
    color: '#fa8c16',
  },
  {
    title: '阶段四：主题定制与样式隔离',
    description: 'CSS-in-JS 动态主题、ConfigProvider、reset.css、UnocCSS 语义色',
    icon: BgColorsOutlined,
    route: '/antd/stage4',
    color: '#722ed1',
  },
  {
    title: '阶段五：性能优化与工程化实践',
    description: '按需加载、虚拟滚动、gzip 压缩、图标优化、自动化测试',
    icon: ThunderboltOutlined,
    route: '/antd/stage5',
    color: '#13c2c2',
  },
  {
    title: '阶段六：全控件 Table CRUD 实战',
    description: '覆盖全部数据录入控件、查询展开/收起、表单校验联动、批量操作、服务端分页',
    icon: TableOutlined,
    route: '/antd/stage6',
    color: '#eb2f96',
  },
  {
    title: '阶段七：表单校验进阶',
    description: '内置规则、自定义校验、动态校验、异步校验、表单联动、computed rules',
    icon: FormOutlined,
    route: '/antd/stage7',
    color: '#2f54eb',
  },
]
</script>

<template>
  <div class="antd-index">
    <h1>🎨 Ant Design Vue 4.2.6 学习</h1>
    <p class="subtitle">
      基于 <strong>Vue 3.5 + Vite 8 + TypeScript 6</strong>，从 0 到 1 系统学习 Ant Design Vue 4.x。
    </p>

    <div class="stage-grid">
      <RouterLink
        v-for="stage in stages"
        :key="stage.route"
        :to="stage.route"
        class="stage-card"
        :style="{ borderTopColor: stage.color }"
      >
        <component :is="stage.icon" class="stage-icon" :style="{ color: stage.color }" />
        <h3>{{ stage.title }}</h3>
        <p>{{ stage.description }}</p>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.antd-index {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
}

h1 {
  font-size: 28px;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 12px;
}

.subtitle {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 36px;
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.stage-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 28px 20px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-top: 4px solid #1677ff;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.25s ease;
}

.stage-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.stage-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.stage-card h3 {
  font-size: 15px;
  color: #333;
  margin: 0 0 8px 0;
}

.stage-card p {
  font-size: 13px;
  color: #888;
  margin: 0;
  line-height: 1.5;
}
</style>
