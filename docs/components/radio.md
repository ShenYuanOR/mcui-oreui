# Radio 单选

用于在一组选项中选择一个值，提供单个 `<mc-radio>` 与选项组 `<mc-radio-group>`。

<script setup>
import { ref } from 'vue'
const mode = ref('survival')
const difficulty = ref('normal')
</script>

## 单选组

<div class="mc-demo mc-demo--column">
  <mc-radio-group
    v-model="mode"
    :options="[
      { label: '生存', value: 'survival' },
      { label: '创造', value: 'creative' },
      { label: '冒险', value: 'adventure' },
      { label: '旁观', value: 'spectator', disabled: true }
    ]"
  />
  <span style="color:#fff">mode = {{ mode }}</span>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const mode = ref('survival')
</script>

<template>
  <mc-radio-group
    v-model="mode"
    :options="[
      { label: '生存', value: 'survival' },
      { label: '创造', value: 'creative' }
    ]"
  />
</template>
```

## 垂直排列

<div class="mc-demo mc-demo--column">
  <mc-radio-group
    v-model="difficulty"
    direction="vertical"
    :options="[
      { label: '和平', value: 'peaceful' },
      { label: '简单', value: 'easy' },
      { label: '普通', value: 'normal' },
      { label: '困难', value: 'hard' }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const difficulty = ref('normal')
</script>

<template>
  <mc-radio-group
    v-model="difficulty"
    direction="vertical"
    :options="[
      { label: '和平', value: 'peaceful' },
      { label: '简单', value: 'easy' },
      { label: '普通', value: 'normal' },
      { label: '困难', value: 'hard' }
    ]"
  />
</template>
```

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
  <mc-radio v-model="mode" value="survival">生存</mc-radio>
  <mc-radio v-model="mode" value="creative">创造</mc-radio>
</template>
```

## 旋转显示

设置 `rotate` 可将单选控件旋转 45 度，适合需要菱形视觉风格的场景。

<div class="mc-demo">
  <mc-radio v-model="mode" value="survival" rotate>生存</mc-radio>
  <mc-radio v-model="mode" value="creative" rotate>创造</mc-radio>
</div>

```vue
<mc-radio v-model="mode" value="survival" rotate>生存</mc-radio>
<mc-radio v-model="mode" value="creative" rotate>创造</mc-radio>
```

## mc-radio Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `modelValue` | `string \| number \| boolean` | `''` | 当前选中值（v-model） |
| `value` | `string \| number \| boolean` | `''` | 当前单选项值 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `rotate` | `boolean` | `false` | 控件是否旋转 45 度 |

## mc-radio-group Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `modelValue` | `string \| number \| boolean` | `''` | 当前选中值（v-model） |
| `options` | `McRadioOption[]` | `[]` | 选项列表 |
| `direction` | `'horizontal' \| 'vertical'` | `horizontal` | 排列方向 |
| `disabled` | `boolean` | `false` | 是否整组禁用 |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `string \| number \| boolean` | v-model 更新 |
| `change` | `string \| number \| boolean` | 值变化 |
