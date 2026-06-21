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
    <div class="mc-hero-tagline">
      把 Minecraft 基岩版风格的像素质感、立体按钮与音效带进 Vue 工程
    </div>
    <div class="mc-hero-actions">
      <mc-button variant="primary" size="large" @click="go('/guide/getting-started.html')">快速开始</mc-button>
      <mc-button variant="normal" size="large" @click="go('/components/button.html')">浏览组件</mc-button>
    </div>
  </div>
</template>
```

<div class="mc-demo mc-hero-features">
  <mc-card title="原汁原味的设计语言" description="直接复用 1700+ 行原始 CSS 与 Minecraft 像素字体，零视觉偏差。" @click="go('/guide/design-tokens.html')" />
  <mc-card title="标准 Vue 3 + TypeScript" description="script setup + 完整类型，v-model 受控，Vite 库模式打包。" @click="go('/guide/getting-started.html')" />
  <mc-card title="29 组件 + 音效" description="按钮 / 表单 / 布局 / 反馈 / 样式组件可组合使用。" @click="go('/components/button.html')" />
</div>

```vue
<div class="mc-demo mc-hero-features">
  <mc-card
    title="原汁原味的设计语言"
    description="直接复用原始 CSS 与 Minecraft 像素字体。"
    @click="go('/guide/design-tokens.html')"
  />
  <mc-card
    title="标准 Vue 3 + TypeScript"
    description="script setup + 完整类型，v-model 受控。"
    @click="go('/guide/getting-started.html')"
  />
  <mc-card
    title="组件 + 音效"
    description="按钮 / 表单 / 布局 / 反馈组件可组合使用。"
    @click="go('/components/button.html')"
  />
</div>
```

<div class="mc-hero-note">
本页 Hero 与卡片均由本组件库的 <code>&lt;mc-button&gt;</code> / <code>&lt;mc-card&gt;</code> 构建 —— 即组件库自身的活样例。<br />
⚠️ 非官方。设计语言移植自第三方项目 Spectrollay-OreUI，与 Mojang 无从属关系，详见 <a @click="go('/guide/about.html')">与 OreUI 的区别</a>。
</div>

</div>
