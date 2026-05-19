# McUI Vue

> Minecraft 基岩版风格的 Vue 3 组件库 —— 像素质感、立体按钮、按键音效，开箱即用。

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#许可)
![Vue](https://img.shields.io/badge/Vue-3.3%2B-42b883)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6)

**📖 在线文档（组件实时 Demo + API）：<https://shenyuanor.github.io/mcui-oreui/>**

把 Minecraft 基岩版界面的观感（Minecraft 像素字体、灰色立体面板、绿/灰/红三态按钮、卡片扫光、按键音效）封装为 **24 个标准 Vue 3 组件**，并附带一套 VitePress 实时文档站。

> ⚠️ **非官方声明**：本项目为第三方复刻，与 Mojang Studios **无任何从属关系**，不含 Minecraft 官方代码或美术资产。设计语言移植自社区项目 [Spectrollay-OreUI/OreUI](https://github.com/Spectrollay-OreUI/OreUI)（MIT）。它与官方仓库 `Mojang/mc-ui`（仅开源 `@react-facet` 状态管理库）是完全不同的两个东西。

## 特性

- 🎮 **原汁原味** —— 直接复用原项目 1700+ 行 CSS 与 Minecraft 字体，零视觉偏差
- 🧩 **标准 Vue 3 + TypeScript** —— 全部 `<script setup lang="ts">`，`v-model` 受控、类型完整
- 🔌 **组合式 / 选项式 API 通用** —— 导入一次全局可用，两种风格皆可
- 🔊 **内置音效** —— 移植原项目 7 个按键音效，可全局开关
- 🎨 **Minecraft 格式化代码** —— 支持 `§` 颜色 / 样式代码解析与渲染，可用于 MOTD、世界名等文本预览
- 📦 **Vite 库模式打包** —— 产出 ESM / UMD / `.d.ts` 类型声明

## 安装

```bash
npm install mcui-oreui
```

需要 Vue `^3.3`（peerDependency）。

## 快速开始

### 全局注册（导入一次，全局可用）

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import McUIVue from 'mcui-oreui'
import 'mcui-oreui/style.css'   // 样式需引入一次

createApp(App).use(McUIVue).mount('#app')
```

之后任意组件（组合式或选项式）的 `<template>` 中直接使用，无需再 import：

```vue
<template>
  <mc-button variant="green" @click="onStart">开始游戏</mc-button>
  <mc-switch v-model="enabled" />
</template>
```

### 按需引入

```vue
<script setup lang="ts">
import { McButton, showPop } from 'mcui-oreui'
import 'mcui-oreui/style.css'
</script>

<template>
  <mc-button variant="green" @click="showPop('已保存', 2000, 'success')">保存</mc-button>
</template>
```

> CommonJS `require` 场景需 `require('mcui-oreui').default`；现代 ESM 工具链无需关心。

## 组件一览

| 类别 | 组件 |
|---|---|
| 基础 | `<mc-button>` · `<mc-card>` · `<mc-panel>` · `<mc-tooltip>` · `<mc-progress>` |
| 表单 | `<mc-checkbox>` · `<mc-radio>` · `<mc-radio-group>` · `<mc-form-field>` · `<mc-switch>` · `<mc-dropdown>` · `<mc-text-field>` · `<mc-slider>` |
| 布局 | `<mc-layout>` · `<mc-header>` · `<mc-tabs>` · `<mc-scroll-view>` |
| 反馈 | `<mc-modal>` · `<mc-confirm>` · `<mc-drawer>` · `<mc-loading-mask>` · `<mc-pop-host>` |
| 样式 | `<mc-tcode>` · `<mc-formatted-text>` · `parseMcFormatCodes` · `renderMcFormatCodes` · `stripMcFormatCodes` |

`<mc-tcode>` 默认按 Java 格式化代码解析，`§m` / `§n` 会显示为删除线 / 下划线；需要基岩版材料色时可使用 `edition="bedrock"`。
| 能力 | `useSound` / `playSound` / `setSoundEnabled` · `usePop` / `showPop` |

完整 Props / 事件 / 在线 Demo 见文档站。

## 本地开发

```bash
npm install           # 安装依赖

npm run docs:dev      # 启动 VitePress 文档站（默认 http://localhost:5175）
npm run docs:build    # 构建文档站静态产物
npm run docs:preview  # 预览已构建文档

npm run build         # 构建组件库（类型检查 + Vite 库打包 → dist/）
```

## 技术栈

Vue 3 · Vite 5（库模式）· TypeScript · vite-plugin-dts · VitePress

## 致谢

- 设计语言与原始 CSS / 字体 / 音效移植自 [Spectrollay-OreUI/OreUI](https://github.com/Spectrollay-OreUI/OreUI)
- 灵感源自 Minecraft 基岩版界面

## 许可

[MIT](./LICENSE) · © 2020 Spectrollay（原项目）· Vue 移植版

> 使用本库即表示你已知悉其为非官方第三方复刻，与 Mojang Studios 无从属关系。
