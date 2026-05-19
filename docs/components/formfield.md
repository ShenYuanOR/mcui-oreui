# FormField 表单项

统一表单字段的标签、说明、错误提示和控件布局。

<script setup>
import { ref } from 'vue'
const name = ref('Steve')
const sound = ref(true)
</script>

## 基础用法

<div class="mc-demo mc-demo--column">
  <mc-form-field label="玩家名" description="用于多人游戏和本地存档展示" required>
    <mc-text-field v-model="name" hint="请输入玩家名" />
  </mc-form-field>
</div>

```vue
<mc-form-field label="玩家名" description="用于多人游戏和本地存档展示" required>
  <mc-text-field v-model="name" hint="请输入玩家名" />
</mc-form-field>
```

## 错误状态

<div class="mc-demo mc-demo--column">
  <mc-form-field label="服务器地址" error="服务器地址不能为空" required>
    <mc-text-field hint="play.example.com" />
  </mc-form-field>
</div>

```vue
<mc-form-field label="服务器地址" error="服务器地址不能为空" required>
  <mc-text-field hint="play.example.com" />
</mc-form-field>
```

## 搭配其他控件

<div class="mc-demo mc-demo--column">
  <mc-form-field label="启用音效" description="关闭后组件交互不再播放按键音。">
    <mc-switch v-model="sound" />
  </mc-form-field>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const sound = ref(true)
</script>

<template>
  <mc-form-field label="启用音效" description="关闭后组件交互不再播放按键音。">
    <mc-switch v-model="sound" />
  </mc-form-field>
</template>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `label` | `string` | `''` | 标签文本 |
| `description` | `string` | `''` | 辅助说明 |
| `error` | `string` | `''` | 错误信息 |
| `required` | `boolean` | `false` | 是否必填 |
| `disabled` | `boolean` | `false` | 是否禁用展示 |

## Slots

| 名称 | 说明 |
|---|---|
| `default` | 表单控件 |
| `label` | 自定义标签 |
| `description` | 自定义说明 |
| `error` | 自定义错误信息 |
