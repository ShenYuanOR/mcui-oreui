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
    <h1 id="mc-home-title" class="mc-home-title">McUI Vue</h1>
    <p class="mc-home-subtitle">给 Vue 项目用的 Minecraft 界面</p>
    <div class="mc-home-actions">
      <a class="mc-home-action mc-home-action--primary" :href="withBase('/guide/getting-started.html')">开始使用</a>
      <a class="mc-home-action" :href="withBase('/components/overview.html')">看看组件</a>
    </div>
  </section>
</main>
