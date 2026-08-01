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
    <mc-drawer v-model="open" title="导航" position="start" mode="temporary">
      <template #activator="{ props }"><mc-button v-bind="props">打开 Drawer</mc-button></template>
      抽屉内容
    </mc-drawer>
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
      <mc-drawer title="永久工具" mode="permanent" position="end" :size="140" :teleport="false">始终占位</mc-drawer>
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

## Props

| 名称             | 类型                                   | 默认        | 说明                                                           |
| ---------------- | -------------------------------------- | ----------- | -------------------------------------------------------------- |
| `modelValue`     | `boolean`                              | `false`     | 控制临时或持久抽屉是否打开，支持通过 `v-model` 双向绑定。      |
| `title`          | `string`                               | -           | 抽屉标题；也可使用 `header` 插槽自定义标题区。                 |
| `mode`           | `temporary \| persistent \| permanent` | `temporary` | 抽屉模式：覆盖内容、参与布局且可关闭，或参与布局且始终显示。   |
| `position`       | `start \| end \| top \| bottom`        | `start`     | 抽屉相对于布局或视口的停靠位置，`start/end` 会跟随 RTL。       |
| `size`           | `number`                               | `320`       | 抽屉在停靠方向上的尺寸，单位为 px。                            |
| `order`          | `number`                               | `0`         | 多个布局项在同一方向上的排列顺序。                             |
| `closeOnOverlay` | `boolean`                              | `true`      | 临时模式下点击遮罩时是否关闭抽屉。                             |
| `closeOnEscape`  | `boolean`                              | `true`      | 临时模式下按 Escape 时是否关闭抽屉。                           |
| `teleport`       | `string \| HTMLElement \| false`       | `body`      | 临时模式的 Teleport 目标；设为 `false` 时保留在当前 DOM 层级。 |

事件：`update:modelValue`、`close`。Persistent 在移动断点自动变为 temporary；Permanent 始终显示且忽略关闭操作。
