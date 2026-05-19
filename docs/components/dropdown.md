# Dropdown 下拉选择

<script setup>
import { ref } from 'vue'
const sel = ref(2)
const opts = ['简单', '普通', '困难', '极限']
</script>

<div class="mc-demo mc-demo--column">
  <mc-dropdown :options="opts" v-model="sel" unselected-text="选择难度" />
  <span style="color:#fff">选中序号：{{ sel }}（{{ opts[sel-1] }}）</span>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const sel = ref(2) // 1 起；0 表示未选
const opts = ['简单', '普通', '困难', '极限']
</script>

<template>
  <mc-dropdown :options="opts" v-model="sel" unselected-text="选择难度" />
</template>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `options` | `string[]` | `[]` | 选项文本数组 |
| `modelValue` | `number` | `0` | 选中序号（**1 起**；0 未选）v-model |
| `unselectedText` | `string` | `'选择一个选项'` | 未选占位 |
| `disabled` | `boolean` | `false` | 是否禁用 |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `number` | v-model 更新 |
| `change` | `number` | 选择变化 |

点击外部自动收起；展开/收起播 `click` 音效。
