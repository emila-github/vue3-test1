学习 Ant Design Vue 4.2.6 需要结合 Vue 3 生态的最新特性。为你整理了一份从 0 到 1 的系统学习路线，分为五个阶段：

### 阶段一：技术选型与项目起步

1. **锁定技术栈**：推荐使用 `Vue ≥3.5`、`Vite ≥6` 以及 `Ant Design Vue ≥4.2.6`。4.2.6 版本修复了 Select 虚拟滚动的内存泄漏问题，是目前非常推荐的稳定版本。
2. **包管理器**：推荐使用 `pnpm`，不仅节省磁盘空间，依赖提升（hoist）也更可控。
3. **脚手架初始化**：推荐使用官方模板 `antdv-pro`，它已集成了按需加载、Pinia、Vue-Router、UnoCSS、Axios 拦截器及代码规范工具等。
   ```bash
   npm i -g degit
   degit antdv-pro/antdv-pro my-project
   cd my-project && pnpm i
   pnpm dev
   ```
4. **手动引入（备选）**：如果不用脚手架，可通过 `npm i --save ant-design-vue@4.x` 安装，并在 `main.ts` 中全局注册并引入 `reset.css`。

### 阶段二：核心组件与开发规范

1. **拥抱组合式 API**：遵循 Vue 3 规范，使用 `<script setup lang="ts">` 进行开发。
2. **表单组件（Form）**：
   - 避免在表单内过度依赖 `v-model`，推荐通过 `:value` 和 `@change` 事件控制数据流。
   - 自定义校验规则必须返回 `Promise`，否则会触发 “async-validator” 警告。
   - 编辑场景下，表单回显建议在 `mounted` 钩子结合 `$nextTick` 使用 `form.setFieldsValue()`。
3. **表格组件（Table）**：掌握 `BasicTable` 的内置分页、列密度和拖拽功能，确保 `dataSource` 与后端字段严格对应。
4. **弹框组件（Modal/Drawer）**：注意 4.x 版本的 API 变更，控制弹框显示隐藏的属性由 `visible` 统一变更为 `open`。

### 阶段三：组件二次封装与原子设计

1. **目录规范**：按业务模块拆分 `api/`，全局通用组件放 `components/`，业务 Hook 放 `hooks/`。
2. **原子设计原则**：将基础组件再封装，例如把「按钮+图标」封装为 `<AddButton>`，统一使用 `<BasicTable>` 和 `useFormModal`。
3. **双向绑定协议**：二次封装组件时，接收 `value` prop，触发 `change` 或 `input` 事件回传新值，使其能无缝作为标准表单项使用。
4. **避坑提示**：若组件内部封装了 Modal，务必加上 `destroyOnClose` 属性，否则第二次打开会残留上次的校验状态。

### 阶段四：主题定制与样式隔离

1. **CSS-in-JS 方案**：Ant Design Vue 4.x 弃用了 Less，默认采用 CSS-in-JS，支持运行时动态切换主题色，无需 less-loader。
2. **动态主题**：安装 `@ant-design/colors` 库，通过修改 `theme.defaultConfig.token.colorPrimary` 变量即可实现全局主题更新。
3. **样式隔离**：推荐使用 UnoCSS 的语义色系统，避免手动覆盖底层样式变量。
4. **全局样式重置**：由于产物不再包含全量 CSS，如需重置基本样式，请引入 `ant-design-vue/dist/reset.css`，或使用 `<App>` 组件包裹应用以防止全局样式污染。

### 阶段五：性能优化与工程化实践

1. **按需加载**：使用 `unplugin-vue-components` 插件，它会自动将组件导入转为单文件引入，可使打包体积减少约 42%。
2. **生产环境优化**：开启 `vite-plugin-compression` 预生成 `.gz` 文件，配合 Nginx 直接返回压缩资源。
3. **图标优化**：使用 `@ant-design/icons-vue` 按需引入，配合 Iconify 在线 CDN，可显著减少首屏加载体积。
4. **自动化测试**：利用官方模板集成的 `vitest`（单元测试）和 `cypress`（E2E 测试）保障业务组件的稳定性。

按照这条路线，你可以从基础配置平滑过渡到企业级项目的架构与性能优化，建议在学习过程中随时对照官方文档，以 4.2.6 版本的 API 为准。

---

需要我针对某个阶段或组件（比如表单校验、表格封装）整理一份实战示例代码吗？
