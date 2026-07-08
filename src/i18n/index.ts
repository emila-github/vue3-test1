import { createI18n } from 'vue-i18n'

const messages = {
  'zh-CN': {
    hello: '你好，世界！',
    welcome: '欢迎来到 Vue 3 学习站点',
    langSwitched: '语言已切换为{lang}',
    app: {
      title: 'Vue 3 学习示例',
      description: '涵盖 Vue 3 Composition API、TypeScript、状态管理等核心知识点',
    },
    user: {
      greeting: '你好，{name}！',
      info: '年龄：{age}，城市：{city}',
    },
    product: {
      list: '商品列表',
      item: '#{id} — {name}',
      count: '共 {count} 件商品 | 共 1 件商品 | 共 {count} 件商品',
      add: '添加商品',
      remove: '移除商品',
    },
    apple: '没有苹果 | 1个苹果 | {count}个苹果',
    car: '没有车 | 1辆车 | {count}辆车',
    fruit: {
      apple: '苹果',
      banana: '香蕉',
      orange: '橙子',
      grape: '葡萄',
      selected: '已选择：{list}',
      none: '未选择任何水果',
    },
    terms: {
      service: '服务条款',
      privacy: '隐私政策',
      prompt: '点击即表示同意我们的{terms}和{privacy}',
    },
  },
  en: {
    hello: 'Hello, World!',
    welcome: 'Welcome to Vue 3 Learning Station',
    langSwitched: 'Language switched to {lang}',
    app: {
      title: 'Vue 3 Learning Examples',
      description:
        'Covering Vue 3 Composition API, TypeScript, State Management and more',
    },
    user: {
      greeting: 'Hello, {name}!',
      info: 'Age: {age}, City: {city}',
    },
    product: {
      list: 'Product List',
      item: '#{id} — {name}',
      count: 'No products | 1 product | {count} products',
      add: 'Add Product',
      remove: 'Remove Product',
    },
    apple: 'no apples | 1 apple | {count} apples',
    car: 'no cars | 1 car | {count} cars',
    fruit: {
      apple: 'Apple',
      banana: 'Banana',
      orange: 'Orange',
      grape: 'Grape',
      selected: 'Selected: {list}',
      none: 'No fruit selected',
    },
    terms: {
      service: 'Terms of Service',
      privacy: 'Privacy Policy',
      prompt: 'By clicking, you agree to our {terms} and {privacy}',
    },
  },
}

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages,
})
