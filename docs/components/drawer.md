<script setup>
import { ref } from 'vue'

const open = ref(false)
const persistentOpen = ref(true)
</script>

# Drawer 抽屉

## 临时抽屉

<div class="mc-demo"><mc-drawer v-model="open" title="导航" position="start" mode="temporary"><template #activator="{ props }"><mc-button v-bind="props">打开 Drawer</mc-button></template>抽屉内容</mc-drawer></div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const persistentOpen = ref(true)
</script>

<template>
  <div class="mc-demo">
    <mc-drawer v-model="open" title="导航" position="start" mode="temporary"
      ><template #activator="{ props }"><mc-button v-bind="props">打开 Drawer</mc-button></template
      >抽屉内容</mc-drawer
    >
  </div>
</template>

<style scoped>
.mc-drawer-modes-demo {
  height: 280px;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.mc-drawer-modes-demo :deep(.mc-drawer) {
  position: absolute;
}
</style>
```

## 持久与永久模式

<div class="mc-demo mc-drawer-modes-demo">
  <mc-layout>
    <mc-drawer v-model="persistentOpen" title="持久导航" mode="persistent" :size="160" :teleport="false">
      可由用户关闭
    </mc-drawer>
    <mc-drawer title="永久工具" mode="permanent" position="end" :size="140" :teleport="false">
      始终占位
    </mc-drawer>
    <mc-main>
      <div style="padding:16px">
        <mc-button size="small" @click="persistentOpen = !persistentOpen">切换持久抽屉</mc-button>
      </div>
    </mc-main>
  </mc-layout>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const persistentOpen = ref(true)
</script>

<template>
  <div class="mc-demo mc-drawer-modes-demo">
    <mc-layout>
      <mc-drawer v-model="persistentOpen" title="持久导航" mode="persistent" :size="160" :teleport="false">
        可由用户关闭
      </mc-drawer>
      <mc-drawer title="永久工具" mode="permanent" position="end" :size="140" :teleport="false"> 始终占位 </mc-drawer>
      <mc-main>
        <div style="padding:16px">
          <mc-button size="small" @click="persistentOpen = !persistentOpen">切换持久抽屉</mc-button>
        </div>
      </mc-main>
    </mc-layout>
  </div>
</template>

<style scoped>
.mc-drawer-modes-demo {
  height: 280px;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.mc-drawer-modes-demo :deep(.mc-drawer) {
  position: absolute;
}
</style>
```

<style scoped>
.mc-drawer-modes-demo {
  height: 280px;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.mc-drawer-modes-demo :deep(.mc-drawer) {
  position: absolute;
}
</style>

| Prop                              | 类型                                   | 默认        |
| --------------------------------- | -------------------------------------- | ----------- |
| `modelValue`                      | `boolean`                              | `false`     |
| `mode`                            | `temporary \| persistent \| permanent` | `temporary` |
| `position`                        | `start \| end \| top \| bottom`        | `start`     |
| `size`                            | `number`                               | `320`       |
| `order`                           | `number`                               | `0`         |
| `closeOnOverlay`、`closeOnEscape` | `boolean`                              | `true`      |
| `teleport`                        | `string \| HTMLElement \| false`       | `body`      |

事件：`update:modelValue`、`close`。Persistent 在移动断点自动变为 temporary；Permanent 始终显示且忽略关闭操作。
