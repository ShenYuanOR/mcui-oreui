# 快速开始

## 安装

```bash
npm install mcui-oreui
```

需要 Vue `^3.3`（peerDependency）。

## 全量注册（插件方式）

```ts
import { createApp } from 'vue'
import App from './App.vue'
import McUIVue from 'mcui-oreui'
import 'mcui-oreui/style.css'

createApp(App).use(McUIVue).mount('#app')
```

**导入一次，全局可用** —— `.use(McUIVue)` 后全部组件已按 `mc-` 标签全局注册，
此后任意组件（组合式或选项式）的 `<template>` 里直接写 `<mc-button>`、`<mc-switch v-model>` 等，
**无需再单独 import**。

> **ESM（Vite / 现代构建，绝大多数场景）**：`import McUIVue from 'mcui-oreui'` 直接拿到插件，默认导出即插件对象。
> **CommonJS（`require`）**：因库同时提供具名与默认导出，需写 `const McUIVue = require('mcui-oreui').default`。现代 Vue 项目走 ESM 一般无需关心此点。

## 按需引入

```vue
<script setup lang="ts">
import { McButton, McCheckbox } from 'mcui-oreui'
import 'mcui-oreui/style.css'
</script>

<template>
  <mc-button variant="green" @click="onStart">开始游戏</mc-button>
</template>
```

> 样式文件 `mcui-oreui/style.css` 必须引入一次（含 Minecraft 字体、配色与全部组件样式）。

## 组合式 / 选项式 API 都支持

组件库导出的是标准 Vue 组件，`props` / 事件 / `v-model` / 插槽均为标准接口，
**与你使用的 API 风格无关**（组件内部用 `<script setup>` 实现，对使用者透明，两种写法均可）。

**组合式 API（`<script setup>`）：**

```vue
<script setup lang="ts">
import { McButton, showPop } from 'mcui-oreui'
</script>

<template>
  <mc-button variant="green" @click="showPop('已保存', 2000, 'success')">保存</mc-button>
</template>
```

**选项式 API（Options API）：**

```vue
<script lang="ts">
import { McSwitch, showPop } from 'mcui-oreui'

export default {
  components: { McSwitch },
  data: () => ({ enabled: false }),
  methods: {
    save() {
      showPop('已保存', 2000, 'success')
    },
  },
}
</script>

<template>
  <mc-switch v-model="enabled" />
  <mc-button variant="green" @click="save">保存</mc-button>
</template>
```

> `showPop` / `playSound` / `playSoundType` / `setSoundEnabled` / `usePop` / `useSound`
> 都是**纯函数**，不依赖 `setup` 上下文（无 `onMounted` / `inject` 等），
> 因此在选项式的 `methods`、乃至普通 `.ts` / `.js` 文件中都能直接调用。
> 若已全量注册插件，则两种风格的 `<template>` 中都可直接使用组件而无需 import。

## 提示与遮罩

`Pop` 提示与全局 `LoadingMask` 通过组合式函数驱动，需在应用根部放置宿主组件：

```vue
<script setup lang="ts">
import { McPopHost, showPop } from 'mcui-oreui'
</script>

<template>
  <mc-pop-host />
  <mc-button @click="showPop('已保存', 2000, 'success')">保存</mc-button>
</template>
```

## 关于自定义元素

组件库在 **构建时** 已用正确的编译选项处理了原始样式中的自定义元素标签
（如 `<custom-dropdown>`、`<link-block>`）。你在自己的项目里**无需任何额外配置**，
直接使用编译产物即可。

## 音效

按键音效随组件自动播放（移植自原项目 7 个 ogg）。可全局开关：

```ts
import { setSoundEnabled } from 'mcui-oreui'
setSoundEnabled(false) // 静音
```
