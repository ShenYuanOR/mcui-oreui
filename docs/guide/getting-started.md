# 快速开始

本页只介绍 mcui-oreui 的安装、注册和基础使用。主题、默认值、语言、断点、图标、音效及可选样式请统一查看[配置选项](./configuration)。

## 基础用法

mcui-oreui 2.0 需要 Vue `^3.5.0`：

```bash
npm install mcui-oreui
```

测试线安装 `npm i mcui-oreui@next`（当前 `2.0.1-dev.23`）。

## 注册组件库

在消费应用的客户端入口（通常是 `src/main.ts`）创建并安装一次插件：

```ts
// src/main.ts
import { createApp } from 'vue'
import { createMcUI } from 'mcui-oreui'
import App from './App.vue'

createApp(App).use(createMcUI()).mount('#app')
```

`createMcUI()` 会注册全部公共组件，并自动加载组件必要样式；基础使用不需要额外导入 `components.css`。插件只在传给 `app.use()` 后生效，不会自动读取项目中的配置文件。

## 使用第一个组件

在根组件中使用 `<mc-app>` 包裹内容，让主题变量与页面方向应用到组件树：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const worldName = ref('新的世界')
</script>

<template>
  <mc-app>
    <mc-panel title="创建世界">
      <mc-text-field v-model="worldName" label="世界名称" />
      <mc-button variant="primary">开始游戏</mc-button>
    </mc-panel>
  </mc-app>
</template>
```

组件使用 Vue 常规的 Props、插槽、事件与 `v-model`。每个组件的完整状态和 API 示例可在[组件总览](../components/overview)中查找。

## 下一步

- [配置选项](./configuration)：Theme、Defaults、Locale、Display、Icons、Sounds、按需入口和可选样式。
- [设计 Token](./design-tokens)：主题变量与 CSS Token。
- [组件总览](../components/overview)：浏览全部组件与可复制示例。
- [2.0 迁移指南](./migration-2)：从 1.x 升级时需要处理的 API 变化。
