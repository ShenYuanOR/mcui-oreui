---
layout: page
title: OreUI Vue
sidebar: false
aside: false
---

<script setup>
import { useRouter, withBase } from 'vitepress'
const router = useRouter()
const go = (p) => router.go(withBase(p))
</script>

<div class="ore-landing">

<div class="ore-demo ore-hero">
  <div class="ore-hero-title">OreUI Vue</div>
  <div class="ore-hero-sub">Minecraft 风格 Vue 3 组件库</div>
  <div class="ore-hero-tagline">把基岩版 Ore UI 的像素质感、立体按钮与音效带进 Vue 工程（第三方复刻）</div>
  <div class="ore-hero-actions">
    <OreButton variant="green" size="large" @click="go('/guide/getting-started.html')">快速开始</OreButton>
    <OreButton variant="normal" size="large" @click="go('/components/button.html')">浏览组件</OreButton>
  </div>
</div>

<div class="ore-demo ore-hero-features">
  <OreCard title="原汁原味的设计语言" description="直接复用 1700+ 行原始 CSS 与 Minecraft 像素字体，零视觉偏差。" @click="go('/guide/design-tokens.html')" />
  <OreCard title="标准 Vue 3 + TypeScript" description="script setup + 完整类型，v-model 受控，Vite 库模式打包。" @click="go('/guide/getting-started.html')" />
  <OreCard title="13 组件 + 音效" description="按钮 / 复选框 / 开关 / 下拉 / 文本框 / 滑块 / 卡片 / 布局 / 弹窗 / 提示 / 遮罩。" @click="go('/components/button.html')" />
</div>

<div class="ore-hero-note">
本页 Hero 与卡片均由本组件库的 <code>&lt;OreButton&gt;</code> / <code>&lt;OreCard&gt;</code> 构建 —— 即组件库自身的活样例。<br />
⚠️ 非官方。设计语言移植自第三方项目 Spectrollay-OreUI，与 Mojang 无从属关系，详见 <a @click="go('/guide/about.html')">与官方 ore-ui 的区别</a>。
</div>

</div>
