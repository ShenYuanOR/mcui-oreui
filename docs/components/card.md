# Card 卡片

Card 根据配置使用静态、按钮或链接语义，避免给不可交互内容伪造按钮角色。

## 内容与交互模式

<div class="mc-demo mc-demo--column" style="width:360px">
  <mc-card><template #title>静态卡片</template>默认渲染 article</mc-card>
  <mc-card clickable><template #title>按钮卡片</template>可执行操作</mc-card>
  <mc-card href="https://example.com"><template #title>链接卡片</template>前往页面</mc-card>
  <mc-card clickable disabled><template #title>禁用卡片</template>暂不可操作</mc-card>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width:360px">
    <mc-card><template #title>静态卡片</template>默认渲染 article</mc-card>
    <mc-card clickable><template #title>按钮卡片</template>可执行操作</mc-card>
    <mc-card href="https://example.com"><template #title>链接卡片</template>前往页面</mc-card>
    <mc-card clickable disabled><template #title>禁用卡片</template>暂不可操作</mc-card>
  </div>
</template>
```

| Prop          | 类型      | 默认      | 说明              |
| ------------- | --------- | --------- | ----------------- |
| `clickable`   | `boolean` | `false`   | 渲染为原生 button |
| `href` / `to` | `string`  | -         | 渲染为链接        |
| `tag`         | `string`  | `article` | 静态模式标签      |
| `disabled`    | `boolean` | `false`   | 禁用交互模式      |

内容使用 `title`、默认和 `actions` 插槽；2.0 不再提供与这些插槽重复的 `title` / `description` 文本 Props。
