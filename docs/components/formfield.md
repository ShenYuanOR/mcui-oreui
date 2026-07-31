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
<script setup lang="ts">
import { ref } from 'vue'
const name = ref('Steve')
const sound = ref(true)
</script>

<template>
  <div class="mc-demo mc-demo--column">
    <mc-form-field label="玩家名" description="用于多人游戏和本地存档展示" required>
      <mc-text-field v-model="name" hint="请输入玩家名" />
    </mc-form-field>
  </div>
</template>
```

## 错误状态

<div class="mc-demo mc-demo--column">
  <mc-form-field label="服务器地址" error="服务器地址不能为空" required>
    <mc-text-field hint="play.example.com" />
  </mc-form-field>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const name = ref('Steve')
const sound = ref(true)
</script>

<template>
  <div class="mc-demo mc-demo--column">
    <mc-form-field label="服务器地址" error="服务器地址不能为空" required>
      <mc-text-field hint="play.example.com" />
    </mc-form-field>
  </div>
</template>
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
const name = ref('Steve')
const sound = ref(true)
</script>

<template>
  <div class="mc-demo mc-demo--column">
    <mc-form-field label="启用音效" description="关闭后组件交互不再播放按键音。">
      <mc-switch v-model="sound" />
    </mc-form-field>
  </div>
</template>
```

## Props

| 名称          | 类型      | 默认     | 说明           |
| ------------- | --------- | -------- | -------------- |
| `label`       | `string`  | `''`     | 标签文本       |
| `description` | `string`  | `''`     | 辅助说明       |
| `error`       | `string`  | `''`     | 错误信息       |
| `hint`        | `string`  | `''`     | 辅助提示       |
| `success`     | `string`  | `''`     | 成功信息       |
| `id`          | `string`  | 自动生成 | 控件 ID 基础值 |
| `required`    | `boolean` | `false`  | 是否必填       |
| `disabled`    | `boolean` | `false`  | 是否禁用展示   |

## Slots

| 名称          | 说明                                                       |
| ------------- | ---------------------------------------------------------- |
| `default`     | 表单控件；提供 `id`、`descriptionId`、`messageId` 插槽参数 |
| `label`       | 自定义标签                                                 |
| `description` | 自定义说明                                                 |
| `message`     | 自定义错误、提示或成功信息                                 |
