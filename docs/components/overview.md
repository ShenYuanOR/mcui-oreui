<script setup>
import { ref } from 'vue'
const enabled = ref(true)
const checked = ref(false)
const mode = ref('survival')
const volume = ref(60)
const dialog = ref(false)
const tab = ref('worlds')
const tabs = [{ label: '世界', value: 'worlds' }, { label: '服务器', value: 'servers' }]
const modes = [{ title: '生存', value: 'survival' }, { title: '创造', value: 'creative' }]
</script>

# 组件总览

2.0 提供全局插件和逐组件入口，组件必要 CSS 会自动按需加载。下列 Demo 使用隔离的组件样式；Utilities 与 `base.css` 均为显式可选，Minecraft 字体由文档站单独导入 `fonts.css`。

## 基础与反馈预览

<div class="mc-demo">
  <mc-button variant="primary">主按钮</mc-button>
  <mc-button>默认按钮</mc-button>
  <mc-chip selected closable>生存模式</mc-chip>
  <mc-badge content="3"><mc-button>消息</mc-button></mc-badge>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const enabled = ref(true)
const checked = ref(false)
const mode = ref('survival')
const volume = ref(60)
const dialog = ref(false)
const tab = ref('worlds')
const tabs = [
  { label: '世界', value: 'worlds' },
  { label: '服务器', value: 'servers' },
]
const modes = [
  { title: '生存', value: 'survival' },
  { title: '创造', value: 'creative' },
]
</script>

<template>
  <div class="mc-demo">
    <mc-button variant="primary">主按钮</mc-button>
    <mc-button>默认按钮</mc-button>
    <mc-chip selected closable>生存模式</mc-chip>
    <mc-badge content="3"><mc-button>消息</mc-button></mc-badge>
  </div>
</template>
```

## 状态反馈预览

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-alert variant="success"><template #title>保存完成</template>世界数据已写入</mc-alert>
  <mc-skeleton height="34" />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const enabled = ref(true)
const checked = ref(false)
const mode = ref('survival')
const volume = ref(60)
const dialog = ref(false)
const tab = ref('worlds')
const tabs = [
  { label: '世界', value: 'worlds' },
  { label: '服务器', value: 'servers' },
]
const modes = [
  { title: '生存', value: 'survival' },
  { title: '创造', value: 'creative' },
]
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-alert variant="success"><template #title>保存完成</template>世界数据已写入</mc-alert>
    <mc-skeleton height="34" />
  </div>
</template>
```

## 表单

<div class="mc-demo mc-demo--column" style="width:360px">
  <mc-checkbox v-model="checked" label="允许作弊" />
  <mc-switch v-model="enabled" label="启用音效" />
  <mc-select v-model="mode" label="游戏模式" :options="modes" />
  <mc-text-field label="世界名称" hint="至少 3 个字符" />
  <mc-textarea label="描述" />
  <mc-slider v-model="volume" label="音量" show-value />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const enabled = ref(true)
const checked = ref(false)
const mode = ref('survival')
const volume = ref(60)
const dialog = ref(false)
const tab = ref('worlds')
const tabs = [
  { label: '世界', value: 'worlds' },
  { label: '服务器', value: 'servers' },
]
const modes = [
  { title: '生存', value: 'survival' },
  { title: '创造', value: 'creative' },
]
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:360px">
    <mc-checkbox v-model="checked" label="允许作弊" />
    <mc-switch v-model="enabled" label="启用音效" />
    <mc-select v-model="mode" label="游戏模式" :options="modes" />
    <mc-text-field label="世界名称" hint="至少 3 个字符" />
    <mc-textarea label="描述" />
    <mc-slider v-model="volume" label="音量" show-value />
  </div>
</template>
```

## 布局与导航

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-tabs v-model="tab" :items="tabs"><div>当前：{{ tab }}</div></mc-tabs>
  <mc-list mode="single" v-model="mode">
    <mc-list-item label="生存模式" value="survival" />
    <mc-list-item label="创造模式" value="creative" />
  </mc-list>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const enabled = ref(true)
const checked = ref(false)
const mode = ref('survival')
const volume = ref(60)
const dialog = ref(false)
const tab = ref('worlds')
const tabs = [
  { label: '世界', value: 'worlds' },
  { label: '服务器', value: 'servers' },
]
const modes = [
  { title: '生存', value: 'survival' },
  { title: '创造', value: 'creative' },
]
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-tabs v-model="tab" :items="tabs"
      ><div>当前：{{ tab }}</div></mc-tabs
    >
    <mc-list mode="single" v-model="mode">
      <mc-list-item label="生存模式" value="survival" />
      <mc-list-item label="创造模式" value="creative" />
    </mc-list>
  </div>
</template>
```

## 浮层预览

<div class="mc-demo">
  <mc-dialog v-model="dialog" title="世界设置">
    <template #activator="{ props }"><mc-button v-bind="props">打开 Dialog</mc-button></template>
    Dialog、Menu 与 Drawer 共享 Escape、焦点、滚动策略和叠层服务。
  </mc-dialog>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const enabled = ref(true)
const checked = ref(false)
const mode = ref('survival')
const volume = ref(60)
const dialog = ref(false)
const tab = ref('worlds')
const tabs = [
  { label: '世界', value: 'worlds' },
  { label: '服务器', value: 'servers' },
]
const modes = [
  { title: '生存', value: 'survival' },
  { title: '创造', value: 'creative' },
]
</script>

<template>
  <div class="mc-demo">
    <mc-dialog v-model="dialog" title="世界设置">
      <template #activator="{ props }"><mc-button v-bind="props">打开 Dialog</mc-button></template>
      Dialog、Menu 与 Drawer 共享 Escape、焦点、滚动策略和叠层服务。
    </mc-dialog>
  </div>
</template>
```

## 按职责浏览

侧边栏统一使用“中文 / English”格式，中文说明用途，英文对应公开组件名。每个独立功能组件均使用单独页面和实时 Demo；Grid、ExpansionPanels 等紧密协作的组件族保留在同页。

- 基础：[Button](./button)、[Icon](./icon)、[Card](./card)、[Panel](./panel)、[Divider](./divider)
- 表单：[Form](./form)、[FormField](./formfield)、[TextField](./textfield)、[Textarea](./textarea)、[Select](./select)、[Autocomplete](./autocomplete)、[Checkbox](./checkbox)、[Radio](./radio)、[RadioGroup](./radio-group)、[Switch](./switch)、[Slider](./slider)、[FileInput](./file-input)、[NumberInput](./number-input)
- 导航：[Tabs](./tabs)、[ButtonTabs](./button-tabs)、[List](./list)、[Breadcrumbs](./breadcrumbs)、[Pagination](./pagination)、[ExpansionPanels](./expansion-panels)、[Stepper](./stepper)
- 布局：[Layout](./layout)、[Grid](./grid)、[Appbar](./appbar)、[AppbarButton](./appbar-button)、[AppbarIcon](./appbar-icon)、[Drawer](./drawer)、[ScrollView](./scrollview)、[VirtualScroll](./virtual-scroll)
- 数据展示：[Table](./table)、[DataTable](./data-table)、[Badge](./badge)、[Chip](./chip)、[SkinViewer](./skinviewer)
- 浮层：[Overlay](./overlay)、[Dialog](./dialog)、[Menu](./menu)、[Tooltip](./tooltip)、[Confirm](./confirm)
- 反馈：[Alert](./alert)、[Snackbar](./snackbar)、[Progress](./progress)、[Spinner](./spinner)、[Skeleton](./skeleton)、[LoadingMask](./loadingmask)、[Pop](./pop)
