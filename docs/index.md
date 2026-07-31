---
layout: page
title: McUI Vue
sidebar: false
aside: false
---

<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<main class="mc-landing">
  <section class="mc-home-hero" aria-labelledby="mc-home-title">
    <p class="mc-home-kicker">Ore UI · Vue 3 · TypeScript</p>
    <h1 id="mc-home-title" class="mc-home-title">McUI Vue</h1>
    <p class="mc-home-subtitle">Minecraft 风格 Vue 3 组件库</p>
    <p class="mc-home-tagline">
      把 Minecraft 基岩版风格的像素边框、立体控件与可选音效带进现代 Vue 工程，同时保留严格类型、SSR
      和按需加载能力。
    </p>
    <div class="mc-home-actions">
      <a class="mc-home-action mc-home-action--primary" :href="withBase('/guide/getting-started.html')">快速开始</a>
      <a class="mc-home-action" :href="withBase('/components/overview.html')">浏览组件</a>
    </div>
  </section>

  <section class="mc-home-features" aria-label="项目特性">
    <mc-card :href="withBase('/guide/design-tokens.html')">
      <template #title>全沉浸 OreUI</template>
      文档外壳、正文、代码块与 API 表格共享像素边框、分层阴影和 MCUI Token。
    </mc-card>
    <mc-card :href="withBase('/guide/configuration.html')">
      <template #title>Vue 3 + TypeScript</template>
      插件、服务与组件均提供完整类型，支持 SSR、多 App 隔离和局部 Provider。
    </mc-card>
    <mc-card :href="withBase('/components/overview.html')">
      <template #title>63 个公共组件</template>
      从表单、导航和数据展示到 Overlay、布局与反馈组件，支持全量注册和按需入口。
    </mc-card>
  </section>

  <p class="mc-home-note">
    非 Minecraft 官方产品。设计语言移植自第三方项目 Spectrollay-OreUI，与 Mojang 无从属关系；详见
    <a :href="withBase('/guide/about.html')">与 OreUI 的区别</a>。
  </p>
</main>
