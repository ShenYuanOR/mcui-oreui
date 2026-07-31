---
layout: page
title: McUI Vue
sidebar: false
aside: false
---

<script setup>
import { useRouter, withBase } from 'vitepress'
const router = useRouter()
const go = (p) => router.go(withBase(p))
</script>

<div class="mc-landing">

<div class="mc-demo mc-hero">
  <div class="mc-hero-title">McUI Vue</div>
  <div class="mc-hero-sub">Minecraft 风格 Vue 3 组件库</div>
  <div class="mc-hero-tagline">把 Minecraft 基岩版风格的像素质感、立体按钮与音效带进 Vue 工程（第三方复刻）</div>
  <div class="mc-hero-actions">
    <mc-button variant="primary" size="large" @click="go('/guide/getting-started.html')">快速开始</mc-button>
    <mc-button variant="normal" size="large" @click="go('/components/button.html')">浏览组件</mc-button>
  </div>
</div>

```vue
<script setup lang="ts">
import { useRouter, withBase } from 'vitepress'

const router = useRouter()
const go = (path: string) => router.go(withBase(path))
</script>

<template>
  <div class="mc-demo mc-hero">
    <div class="mc-hero-title">McUI Vue</div>
    <div class="mc-hero-sub">Minecraft 风格 Vue 3 组件库</div>
    <div class="mc-hero-tagline">把 Minecraft 基岩版风格的像素质感、立体按钮与音效带进 Vue 工程</div>
    <div class="mc-hero-actions">
      <mc-button variant="primary" size="large" @click="go('/guide/getting-started.html')">快速开始</mc-button>
      <mc-button variant="normal" size="large" @click="go('/components/button.html')">浏览组件</mc-button>
    </div>
  </div>
</template>
```

<div class="mc-demo mc-hero-features">
  <mc-card clickable @click="go('/guide/design-tokens.html')"><template #title>原汁原味的设计语言</template>以固定 Spectrollay-OreUI revision 为视觉基准，字体保持可选。</mc-card>
  <mc-card clickable @click="go('/guide/getting-started.html')"><template #title>标准 Vue 3 + TypeScript</template>script setup + 完整类型，v-model 受控，Vite 库模式打包。</mc-card>
  <mc-card clickable @click="go('/components/overview.html')"><template #title>60+ 组件 + 音效</template>按钮 / 表单 / 数据 / 布局 / 反馈 / 样式组件可组合使用。</mc-card>
</div>

```html
<div class="mc-demo mc-hero-features">
  <mc-card clickable @click="go('/guide/design-tokens.html')"
    ><template #title>原汁原味的设计语言</template>以固定 Spectrollay-OreUI revision 为视觉基准。</mc-card
  >
  <mc-card clickable @click="go('/guide/getting-started.html')"
    ><template #title>标准 Vue 3 + TypeScript</template>script setup + 完整类型，v-model 受控。</mc-card
  >
  <mc-card clickable @click="go('/components/button.html')"
    ><template #title>组件 + 音效</template>按钮 / 表单 / 布局 / 反馈组件可组合使用。</mc-card
  >
</div>
```

<div class="mc-hero-note">
本页 Hero 与卡片均由本组件库的 <code>&lt;mc-button&gt;</code> / <code>&lt;mc-card&gt;</code> 构建 —— 即组件库自身的活样例。<br />
⚠️ 非官方。设计语言移植自第三方项目 Spectrollay-OreUI，与 Mojang 无从属关系，详见 <a @click="go('/guide/about.html')">与 OreUI 的区别</a>。
</div>

</div>
