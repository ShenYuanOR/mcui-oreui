<script setup>
import { ref } from 'vue'
const active = ref('world')
const multipleActive = ref(['world'])
</script>

# ExpansionPanels

`McExpansionPanels` 管理展开状态，`McExpansionPanel` 提供单个可折叠区域，两者共同组成 accordion 组件族。

## 基础用法

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-expansion-panels v-model="active">
    <mc-expansion-panel value="world" title="世界设置">难度、生物群系与种子。</mc-expansion-panel>
    <mc-expansion-panel value="packs" title="资源包">资源包列表。</mc-expansion-panel>
    <mc-expansion-panel value="locked" title="已锁定" disabled>不可展开。</mc-expansion-panel>
  </mc-expansion-panels>
  <mc-expansion-panels v-model="multipleActive" multiple>
    <mc-expansion-panel value="world" title="世界设置">可与其他面板同时展开。</mc-expansion-panel>
    <mc-expansion-panel value="players" title="玩家设置">权限与多人游戏。</mc-expansion-panel>
  </mc-expansion-panels>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('world')
const multipleActive = ref(['world'])
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-expansion-panels v-model="active">
      <mc-expansion-panel value="world" title="世界设置">难度、生物群系与种子。</mc-expansion-panel>
      <mc-expansion-panel value="packs" title="资源包">资源包列表。</mc-expansion-panel>
      <mc-expansion-panel value="locked" title="已锁定" disabled>不可展开。</mc-expansion-panel>
    </mc-expansion-panels>
    <mc-expansion-panels v-model="multipleActive" multiple>
      <mc-expansion-panel value="world" title="世界设置">可与其他面板同时展开。</mc-expansion-panel>
      <mc-expansion-panel value="players" title="玩家设置">权限与多人游戏。</mc-expansion-panel>
    </mc-expansion-panels>
  </div>
</template>
```

## API

### McExpansionPanels Props

| 名称         | 类型                                               | 默认    | 说明                                                     |
| ------------ | -------------------------------------------------- | ------- | -------------------------------------------------------- |
| `modelValue` | `string \| number \| (string \| number)[] \| null` | `null`  | 当前展开项的 value；多选模式下使用数组，支持 `v-model`。 |
| `multiple`   | `boolean`                                          | `false` | 是否允许同时展开多个子面板。                             |

事件：`update:modelValue`、`change`。

### McExpansionPanel Props

| 名称       | 类型               | 默认     | 说明                                                |
| ---------- | ------------------ | -------- | --------------------------------------------------- |
| `value`    | `string \| number` | 自动生成 | 当前面板在父组件中的唯一值。                        |
| `title`    | `string`           | -        | 标题按钮文字；也可使用 `title` 插槽提供自定义内容。 |
| `disabled` | `boolean`          | `false`  | 是否禁用当前面板的展开操作和键盘焦点。              |

插槽：`title`、`default`。标题使用 accordion 键盘模型，支持上下方向键、Home 与 End。

内部语义标题会重置宿主 `h3` 的 margin 与排版覆盖，不会在面板边框和标题按钮之间产生额外空白。
