# Radio

用于声明单个原生 radio 选项；声明式选项组请查看 [RadioGroup](./radio-group)。

<script setup>
import { ref } from 'vue'
const mode = ref('survival')
</script>

## 单个 Radio

<div class="mc-demo">
  <mc-radio v-model="mode" value="survival">生存</mc-radio>
  <mc-radio v-model="mode" value="creative">创造</mc-radio>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const mode = ref('survival')
</script>

<template>
  <div class="mc-demo">
    <mc-radio v-model="mode" value="survival">生存</mc-radio>
    <mc-radio v-model="mode" value="creative">创造</mc-radio>
  </div>
</template>
```

## 旋转显示

设置 `rotate` 可将单选控件旋转 45 度，适合需要菱形视觉风格的场景。

<div class="mc-demo">
  <mc-radio v-model="mode" value="survival" rotate>生存</mc-radio>
  <mc-radio v-model="mode" value="creative" rotate>创造</mc-radio>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const mode = ref('survival')
</script>

<template>
  <div class="mc-demo">
    <mc-radio v-model="mode" value="survival" rotate>生存</mc-radio>
    <mc-radio v-model="mode" value="creative" rotate>创造</mc-radio>
  </div>
</template>
```

## 自定义颜色

通过 `color` 属性设置选中时的背景色，覆盖默认绿色，hover 时自动变暗。

<div class="mc-demo">
  <mc-radio v-model="mode" value="survival" color="#2E6BE5">生存</mc-radio>
  <mc-radio v-model="mode" value="creative" color="#e52e2e">创造</mc-radio>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const mode = ref('survival')
</script>

<template>
  <div class="mc-demo">
    <mc-radio v-model="mode" value="survival" color="#2E6BE5">生存</mc-radio>
    <mc-radio v-model="mode" value="creative" color="#e52e2e">创造</mc-radio>
  </div>
</template>
```

## 交互与校验状态

<div class="mc-demo">
  <mc-radio v-model="mode" value="survival" readonly>只读选中</mc-radio>
  <mc-radio v-model="mode" value="disabled" disabled>禁用</mc-radio>
  <mc-radio v-model="mode" value="required" error-messages="请选择模式">校验错误</mc-radio>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const mode = ref('survival')
</script>

<template>
  <div class="mc-demo">
    <mc-radio v-model="mode" value="survival" readonly>只读选中</mc-radio>
    <mc-radio v-model="mode" value="disabled" disabled>禁用</mc-radio>
    <mc-radio v-model="mode" value="required" error-messages="请选择模式">校验错误</mc-radio>
  </div>
</template>
```

## Props

| 名称                                                  | 类型                          | 默认    | 说明                     |
| ----------------------------------------------------- | ----------------------------- | ------- | ------------------------ |
| `modelValue`                                          | `string \| number \| boolean` | `''`    | 当前选中值（v-model）    |
| `value`                                               | `string \| number \| boolean` | `''`    | 当前单选项值             |
| `disabled`                                            | `boolean`                     | `false` | 是否禁用                 |
| `rotate`                                              | `boolean`                     | `false` | 控件是否旋转 45 度       |
| `color`                                               | `string`                      | -       | 选中时的自定义背景色     |
| `description` / `hint`                                | `string`                      | -       | 描述与状态提示           |
| `required` / `rules` / `errorMessages` / `validateOn` | 表单契约                      | -       | 与其他输入一致的校验 API |

标准原生属性、`aria-*` 和交互监听器直接写在 `<mc-radio>` 上并转发到内部 radio input；`class`、`style`、`data-*` 保留在组件外层。

## Events

| 事件                | 参数                          | 说明         |
| ------------------- | ----------------------------- | ------------ |
| `update:modelValue` | `string \| number \| boolean` | v-model 更新 |
| `change`            | `string \| number \| boolean` | 值变化       |
