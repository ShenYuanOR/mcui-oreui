<script setup>
import { reactive, ref } from 'vue'

const selected = ref('world1')
const multiSelected = ref(['coords', 'autosave'])
const switchStates = reactive({
  music: true,
  sfx: true,
  ambient: false,
})
const dynamicItems = [
  { label: '世界一 · 生存模式', value: 'w1', subtitle: '本地存档' },
  { label: '世界二 · 创造模式', value: 'w2', subtitle: '测试地图' },
  { label: '服务器入口', value: 'server', iconRight: 'mc-server' },
]
</script>

# List 列表

可选中列表，用于展示一组选项供用户挑选。支持**无选中状态**、**单选**和**多选**三种模式。单选和多选模式分别使用 `McRadio` 和 `McCheckbox` 作为选中指示器。

列表项作为 `McList` 的子节点声明：在 `<mc-list>` 内使用 `<mc-list-item>`，让结构更接近组件本身的层级关系。

不设置 `mode` 时默认为无选中模式，列表项可正常点击触发事件，但不显示选中状态、无选中指示器。

## 无选中模式（默认）

不设置 `mode` 时，列表项可点击并触发 `change` 事件，但不会高亮选中项、不显示选中指示器。适用于导航菜单、命令入口等场景。

<div class="mc-demo mc-demo--column">
  <mc-list @change="(v) => console.log('点击了', v)">
    <mc-list-item label="打开存档" value="open" />
    <mc-list-item label="新建世界" value="new" icon="mc-plus" />
    <mc-list-item label="导入地图" value="import" icon="mc-download" />
  </mc-list>
  <p style="color:#b1b2b5;font-size:12px;margin:8px 0 0;text-align:center">
    列表项可点击（查看控制台输出），但没有选中高亮
  </p>
</div>

```html
<mc-list @change="(v) => console.log('点击了', v)">
  <mc-list-item label="打开存档" value="open" />
  <mc-list-item label="新建世界" value="new" icon="mc-plus" />
  <mc-list-item label="导入地图" value="import" icon="mc-download" />
</mc-list>
```

## 基础用法（单选）

设置 `mode="single"`，使用 `v-model` 绑定选中值。每个选项左侧显示单选指示器。

<div class="mc-demo mc-demo--column">
  <mc-list v-model="selected" mode="single">
    <mc-list-item label="世界一 · 生存存档" value="world1" />
    <mc-list-item label="世界二 · 创造模式" value="world2" />
    <mc-list-item label="世界三 · 服务器入口" value="world3" />
  </mc-list>
  <p style="color:#b1b2b5;font-size:12px;margin:8px 0 0;text-align:center">
    当前选中：<strong style="color:#ffffff">{{ selected }}</strong>
  </p>
</div>

```html
<mc-list v-model="selected" mode="single">
  <mc-list-item label="世界一 · 生存存档" value="world1" />
  <mc-list-item label="世界二 · 创造模式" value="world2" />
  <mc-list-item label="世界三 · 服务器入口" value="world3" />
</mc-list>
```

## 多选模式

设置 `mode="multiple"`，`v-model` 绑定一个数组。每个选项左侧显示复选框指示器。

<div class="mc-demo mc-demo--column">
  <mc-list v-model="multiSelected" mode="multiple">
    <mc-list-item label="显示坐标" value="coords" subtitle="在 HUD 上显示玩家坐标" />
    <mc-list-item label="显示帧率" value="fps" />
    <mc-list-item label="自动保存" value="autosave" subtitle="每 5 分钟自动保存世界" />
  </mc-list>
  <p style="color:#b1b2b5;font-size:12px;margin:8px 0 0;text-align:center">
    当前选中：<strong style="color:#ffffff">{{ multiSelected.join(', ') || '无' }}</strong>
  </p>
</div>

```html
<mc-list v-model="multiSelected" mode="multiple">
  <mc-list-item label="显示坐标" value="coords" subtitle="在 HUD 上显示玩家坐标" />
  <mc-list-item label="显示帧率" value="fps" />
  <mc-list-item label="自动保存" value="autosave" subtitle="每 5 分钟自动保存世界" />
</mc-list>
```

## 带选项副标题

每个 `mc-list-item` 支持 `subtitle` 属性，在选项标签下方显示灰色辅助说明文字。

<div class="mc-demo mc-demo--column">
  <mc-list v-model="selected" mode="single">
    <mc-list-item label="生存模式" value="survival" subtitle="收集资源、合成物品、生存下去" />
    <mc-list-item label="创造模式" value="creative" subtitle="无限资源，自由建造" />
    <mc-list-item label="冒险模式" value="adventure" subtitle="探索世界，无法破坏方块" />
  </mc-list>
</div>

```html
<mc-list v-model="selected" mode="single">
  <mc-list-item label="生存模式" value="survival" subtitle="收集资源、合成物品、生存下去" />
  <mc-list-item label="创造模式" value="creative" subtitle="无限资源，自由建造" />
  <mc-list-item label="冒险模式" value="adventure" subtitle="探索世界，无法破坏方块" />
</mc-list>
```

## 带图标

<div class="mc-demo mc-demo--column">
  <mc-list v-model="selected" mode="single">
    <mc-list-item label="生存模式" value="survival" icon="mc-heart-outline" />
    <mc-list-item label="创造模式" value="creative" icon="mc-cube" />
    <mc-list-item label="设置" value="settings" icon-right="mc-settings" />
  </mc-list>
</div>

```html
<mc-list v-model="selected" mode="single">
  <mc-list-item label="生存模式" value="survival" icon="mc-heart-outline" />
  <mc-list-item label="创造模式" value="creative" icon="mc-cube" />
  <mc-list-item label="设置" value="settings" icon-right="mc-settings" />
</mc-list>
```

通过 `icon` 在左侧放置图标，`icon-right` 在右侧放置图标。

## 自定义左右侧插槽

在单个 `mc-list-item` 内使用 `#left` 和 `#right` 插槽，可以在列表项左右侧放置任意组件（如 `McSwitch`、`McButton` 等），插槽会覆盖 `icon` / `icon-right` 属性。

插槽区域会与列表项选择事件隔离：点击或键盘操作插槽内的交互组件时，只触发插槽组件自身事件，不会额外触发列表项的 `change` 事件或列表点击音效。

<div class="mc-demo mc-demo--column">
  <mc-list>
    <mc-list-item label="音乐" value="music" subtitle="背景音乐音量">
      <template #right="{ item }">
        <mc-switch v-model="switchStates[item.value]" />
      </template>
    </mc-list-item>
    <mc-list-item label="音效" value="sfx" subtitle="游戏内音效">
      <template #right="{ item }">
        <mc-switch v-model="switchStates[item.value]" />
      </template>
    </mc-list-item>
    <mc-list-item label="环境音" value="ambient" subtitle="洞穴、天气等环境音效">
      <template #right="{ item }">
        <mc-switch v-model="switchStates[item.value]" />
      </template>
    </mc-list-item>
  </mc-list>
</div>

```html
<mc-list>
  <mc-list-item label="音乐" value="music" subtitle="背景音乐音量">
    <template #right="{ item }">
      <mc-switch v-model="switchStates[item.value]" />
    </template>
  </mc-list-item>
  <mc-list-item label="音效" value="sfx" subtitle="游戏内音效">
    <template #right="{ item }">
      <mc-switch v-model="switchStates[item.value]" />
    </template>
  </mc-list-item>
  <mc-list-item label="环境音" value="ambient" subtitle="洞穴、天气等环境音效">
    <template #right="{ item }">
      <mc-switch v-model="switchStates[item.value]" />
    </template>
  </mc-list-item>
</mc-list>
```

插槽参数 `{ item }` 为当前行的 `McListItemProps` 对象，可据此条件渲染不同内容。

## 动态列表

需要从数组渲染列表项时，直接使用 Vue 的 `v-for`。

<div class="mc-demo mc-demo--column">
  <mc-list>
    <mc-list-item
      v-for="item in dynamicItems"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :subtitle="item.subtitle"
      :icon-right="item.iconRight"
    />
  </mc-list>
</div>

```html
<mc-list>
  <mc-list-item
    v-for="item in dynamicItems"
    :key="item.value"
    :label="item.label"
    :value="item.value"
    :subtitle="item.subtitle"
    :icon-right="item.iconRight"
  />
</mc-list>
```

## 隐藏单选框指示器

单选模式下可通过 `:show-radio="false"` 隐藏左侧单选框，仅通过高亮背景表示选中状态。

<div class="mc-demo mc-demo--column">
  <mc-list v-model="selected" mode="single" :show-radio="false">
    <mc-list-item label="世界一 · 生存存档" value="world1" subtitle="最后游玩：2 小时前" />
    <mc-list-item label="世界二 · 创造模式" value="world2" subtitle="最后游玩：昨天" />
    <mc-list-item label="世界三 · 服务器入口" value="world3" subtitle="最后游玩：3 天前" />
  </mc-list>
</div>

```html
<mc-list v-model="selected" mode="single" :show-radio="false">
  <mc-list-item label="世界一 · 生存存档" value="world1" subtitle="最后游玩：2 小时前" />
  <mc-list-item label="世界二 · 创造模式" value="world2" subtitle="最后游玩：昨天" />
  <mc-list-item label="世界三 · 服务器入口" value="world3" subtitle="最后游玩：3 天前" />
</mc-list>
```

## 带禁用项

<div class="mc-demo mc-demo--column">
  <mc-list v-model="selected" mode="single">
    <mc-list-item label="可用的选项" value="a" />
    <mc-list-item label="已锁定的选项" value="b" disabled />
    <mc-list-item label="另一个选项" value="c" />
  </mc-list>
</div>

```html
<mc-list v-model="selected" mode="single">
  <mc-list-item label="可用的选项" value="a" />
  <mc-list-item label="已锁定的选项" value="b" disabled />
  <mc-list-item label="另一个选项" value="c" />
</mc-list>
```

## 关闭点击响应样式

每个列表项可设置 `:interactive="false"`，关闭该项的鼠标指针、悬浮、按下和焦点响应样式。该属性只影响视觉反馈，不会禁用点击、键盘选择或 `change` 事件；如需彻底禁用请使用 `disabled`。

<div class="mc-demo mc-demo--column">
  <mc-list @change="(v) => console.log('点击了', v)">
    <mc-list-item label="正常响应样式" value="normal" subtitle="悬浮和按下时有反馈" />
    <mc-list-item label="不响应点击样式" value="quiet" subtitle="仍可点击，但没有悬浮/按下反馈" :interactive="false" />
    <mc-list-item label="已禁用" value="disabled" subtitle="不可点击" disabled />
  </mc-list>
</div>

```html
<mc-list @change="(v) => console.log('点击了', v)">
  <mc-list-item label="正常响应样式" value="normal" />
  <mc-list-item label="不响应点击样式" value="quiet" :interactive="false" />
  <mc-list-item label="已禁用" value="disabled" disabled />
</mc-list>
```

## 交互状态

- **悬浮**：顶部凸起高光、底部阴影，背景变亮
- **选中**：顶部凹陷、底部高光，背景加深（仅 `mode="single"` / `mode="multiple"` 时显示）
- **按下**：顶部更深凹陷、底部更暗阴影，背景最深

`mode` 为空时，悬浮和按下效果正常显示，但不会出现选中高亮。

列表项设置 `:interactive="false"` 时，不显示悬浮、按下、焦点和鼠标指针响应样式。

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `modelValue` | `string \| number \| (string \| number)[]` | `''` | 当前选中值，多选模式为数组（v-model） |
| `mode` | `'single' \| 'multiple' \| ''` | `''` | 选择模式：空为无选中（可点击），`single` 单选 / `multiple` 多选 |
| `showRadio` | `boolean` | `true` | 单选模式下是否显示单选框指示器 |

## Item Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `label` | `string` | - | 列表项主文本 |
| `value` | `string \| number` | - | 列表项值 |
| `disabled` | `boolean` | `false` | 是否禁用该项 |
| `interactive` | `boolean` | `true` | 是否显示鼠标悬浮、按下、焦点等响应样式 |
| `icon` | `string` | - | 左侧图标名称 |
| `icon-right` | `string` | - | 右侧图标名称 |
| `subtitle` | `string` | - | 列表项副标题 |

## Events

| 名称 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `(value: McListValue \| McListValue[])` | v-model 更新事件 |
| `change` | `(value: McListValue \| McListValue[])` | 选中值变化时触发 |

## Slots

| 名称 | 作用域 | 说明 |
|---|---|---|
| `default` | - | 放置 `<mc-list-item>` 子节点 |

## Item Slots

| 名称 | 作用域 | 说明 |
|---|---|---|
| `left` | `{ item: McListItemProps }` | 自定义当前列表项左侧内容，覆盖 `icon` 属性 |
| `right` | `{ item: McListItemProps }` | 自定义当前列表项右侧内容，覆盖 `icon-right` 属性 |
