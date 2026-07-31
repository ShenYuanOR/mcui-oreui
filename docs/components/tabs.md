<script setup>
import { ref } from 'vue'
const tab = ref('worlds')
const manualTab = ref('worlds')
const items = [{ label: '世界', value: 'worlds' }, { label: '服务器', value: 'servers' }, { label: '禁用', value: 'disabled', disabled: true }]
</script>

# Tabs 标签页

## 自动激活与禁用项

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-tabs v-model="tab" :items="items"><div>当前面板：{{ tab }}</div></mc-tabs>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const tab = ref('worlds')
const manualTab = ref('worlds')
const items = [
  { label: '世界', value: 'worlds' },
  { label: '服务器', value: 'servers' },
  { label: '禁用', value: 'disabled', disabled: true },
]
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-tabs v-model="tab" :items="items"
      ><div>当前面板：{{ tab }}</div></mc-tabs
    >
  </div>
</template>
```

## 纵向与手动激活

<div class="mc-demo" style="width:100%">
  <mc-tabs v-model="manualTab" :items="items" direction="vertical" activation="manual">
    <div>按方向键移动焦点，Enter 或 Space 激活：{{ manualTab }}</div>
  </mc-tabs>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const tab = ref('worlds')
const manualTab = ref('worlds')
const items = [
  { label: '世界', value: 'worlds' },
  { label: '服务器', value: 'servers' },
  { label: '禁用', value: 'disabled', disabled: true },
]
</script>

<template>
  <div class="mc-demo" style="width:100%">
    <mc-tabs v-model="manualTab" :items="items" direction="vertical" activation="manual">
      <div>按方向键移动焦点，Enter 或 Space 激活：{{ manualTab }}</div>
    </mc-tabs>
  </div>
</template>
```

Tabs 实现 roving tabindex、方向键、Home/End、禁用项跳过，以及 tab 与 tabpanel 的 `aria-controls` / `aria-labelledby` 关联。`activation="automatic | manual"` 控制聚焦时是否立即切换。
