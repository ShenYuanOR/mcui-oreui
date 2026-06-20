<script setup>
import { reactive, ref } from 'vue'
const selected = ref('world1')
const multiSelected = ref(['world1', 'world3'])
const switchStates = reactive({
  music: true,
  sfx: true,
  ambient: false,
})
</script>

# List 列表

可选中列表，用于展示一组选项供用户挑选。支持**无选中状态**、**单选**和**多选**三种模式。单选和多选模式分别使用 `McRadio` 和 `McCheckbox` 作为选中指示器。

不设置 `mode` 时默认为无选中模式，列表项可正常点击触发事件，但不显示选中状态、无选中指示器。

## 无选中模式（默认）

不设置 `mode` 时，列表项可点击并触发 `change` 事件，但不会高亮选中项、不显示选中指示器。适用于导航菜单、命令入口等场景。

<div class="mc-demo mc-demo--column">
  <mc-list
    subtitle="快捷操作"
    :items="[
      { label: '打开存档', value: 'open' },
      { label: '新建世界', value: 'new', icon: 'plus' },
      { label: '导入地图', value: 'import', icon: 'download' },
    ]"
    @change="(v) => console.log('点击了', v)"
  />
  <p style="color:#b1b2b5;font-size:12px;margin:8px 0 0;text-align:center">
    列表项可点击（查看控制台输出），但没有选中高亮
  </p>
</div>

```vue
<mc-list
  subtitle="快捷操作"
  :items="[
    { label: '打开存档', value: 'open' },
    { label: '新建世界', value: 'new', icon: 'plus' },
    { label: '导入地图', value: 'import', icon: 'download' },
  ]"
  @change="(v) => console.log('点击了', v)"
/>
```

## 基础用法（单选）

设置 `mode="single"`，使用 `v-model` 绑定选中值。每个选项左侧显示单选指示器。

<div class="mc-demo mc-demo--column">
  <mc-list
    v-model="selected"
    mode="single"
    :items="[
      { label: '世界一 · 生存存档', value: 'world1' },
      { label: '世界二 · 创造模式', value: 'world2' },
      { label: '世界三 · 服务器入口', value: 'world3' },
    ]"
  />
  <p style="color:#b1b2b5;font-size:12px;margin:8px 0 0;text-align:center">
    当前选中：<strong style="color:#ffffff">{{ selected }}</strong>
  </p>
</div>

```vue
<mc-list
  v-model="selected"
  mode="single"
  :items="[
    { label: '世界一 · 生存存档', value: 'world1' },
    { label: '世界二 · 创造模式', value: 'world2' },
    { label: '世界三 · 服务器入口', value: 'world3' },
  ]"
/>
```

## 多选模式

设置 `mode="multiple"`，`v-model` 绑定一个数组。每个选项左侧显示复选框指示器。

<div class="mc-demo mc-demo--column">
  <mc-list
    v-model="multiSelected"
    mode="multiple"
    :items="[
      { label: '显示坐标', value: 'coords', subtitle: '在 HUD 上显示玩家坐标' },
      { label: '显示帧率', value: 'fps' },
      { label: '自动保存', value: 'autosave', subtitle: '每 5 分钟自动保存世界' },
    ]"
  />
  <p style="color:#b1b2b5;font-size:12px;margin:8px 0 0;text-align:center">
    当前选中：<strong style="color:#ffffff">{{ multiSelected.join(', ') || '无' }}</strong>
  </p>
</div>

```vue
<mc-list
  v-model="multiSelected"
  mode="multiple"
  :items="[
    { label: '显示坐标', value: 'coords', subtitle: '在 HUD 上显示玩家坐标' },
    { label: '显示帧率', value: 'fps' },
    { label: '自动保存', value: 'autosave', subtitle: '每 5 分钟自动保存世界' },
  ]"
/>
```

## 带列表副标题

<div class="mc-demo mc-demo--column">
  <mc-list
    v-model="selected"
    mode="single"
    subtitle="选择世界"
    :items="[
      { label: '世界一 · 生存存档', value: 'world1' },
      { label: '世界二 · 创造模式', value: 'world2' },
    ]"
  />
</div>

```vue
<mc-list
  v-model="selected"
  mode="single"
  subtitle="选择世界"
  :items="[
    { label: '世界一 · 生存存档', value: 'world1' },
    { label: '世界二 · 创造模式', value: 'world2' },
  ]"
/>
```

通过 `subtitle` 在列表内部左上角放置副标题文字。

## 带选项副标题

每个 `McListItem` 支持 `subtitle` 属性，在选项标签下方显示灰色辅助说明文字。

<div class="mc-demo mc-demo--column">
  <mc-list
    v-model="selected"
    mode="single"
    :items="[
      { label: '生存模式', value: 'survival', subtitle: '收集资源、合成物品、生存下去' },
      { label: '创造模式', value: 'creative', subtitle: '无限资源，自由建造' },
      { label: '冒险模式', value: 'adventure', subtitle: '探索世界，无法破坏方块' },
    ]"
  />
</div>

```vue
<mc-list
  v-model="selected"
  mode="single"
  :items="[
    { label: '生存模式', value: 'survival', subtitle: '收集资源、合成物品、生存下去' },
    { label: '创造模式', value: 'creative', subtitle: '无限资源，自由建造' },
    { label: '冒险模式', value: 'adventure', subtitle: '探索世界，无法破坏方块' },
  ]"
/>
```

## 带图标

<div class="mc-demo mc-demo--column">
  <mc-list
    v-model="selected"
    mode="single"
    :items="[
      { label: '生存模式', value: 'survival', icon: 'sword' },
      { label: '创造模式', value: 'creative', icon: 'pickaxe' },
      { label: '设置', value: 'settings', iconRight: 'gear' },
    ]"
  />
</div>

```vue
<mc-list
  v-model="selected"
  mode="single"
  :items="[
    { label: '生存模式', value: 'survival', icon: 'sword' },
    { label: '创造模式', value: 'creative', icon: 'pickaxe' },
    { label: '设置', value: 'settings', iconRight: 'gear' },
  ]"
/>
```

通过 `icon` 在左侧放置图标，`iconRight` 在右侧放置图标。

## 自定义左右侧插槽

使用 `#item-left` 和 `#item-right` 具名作用域插槽，可以在列表项左右侧放置任意组件（如 `McSwitch`、`McButton` 等），插槽会覆盖 `icon` / `iconRight` 属性。

<div class="mc-demo mc-demo--column">
  <mc-list
    subtitle="音频设置"
    :items="[
      { label: '音乐', value: 'music', subtitle: '背景音乐音量' },
      { label: '音效', value: 'sfx', subtitle: '游戏内音效' },
      { label: '环境音', value: 'ambient', subtitle: '洞穴、天气等环境音效' },
    ]"
  >
    <template #item-right="{ item }">
      <mc-switch v-model="switchStates[item.value]" />
    </template>
  </mc-list>
</div>

```vue
<mc-list
  subtitle="音频设置"
  :items="[
    { label: '音乐', value: 'music', subtitle: '背景音乐音量' },
    { label: '音效', value: 'sfx', subtitle: '游戏内音效' },
    { label: '环境音', value: 'ambient', subtitle: '洞穴、天气等环境音效' },
  ]"
>
  <template #item-right="{ item }">
    <mc-switch v-model="switchStates[item.value]" />
  </template>
</mc-list>
```

插槽参数 `{ item }` 为当前行的 `McListItem` 对象，可据此条件渲染不同内容。

## 隐藏单选框指示器

单选模式下可通过 `:show-radio="false"` 隐藏左侧单选框，仅通过高亮背景表示选中状态。

<div class="mc-demo mc-demo--column">
  <mc-list
    v-model="selected"
    mode="single"
    :show-radio="false"
    :items="[
      { label: '世界一 · 生存存档', value: 'world1', subtitle: '最后游玩：2 小时前' },
      { label: '世界二 · 创造模式', value: 'world2', subtitle: '最后游玩：昨天' },
      { label: '世界三 · 服务器入口', value: 'world3', subtitle: '最后游玩：3 天前' },
    ]"
  />
</div>

```vue
<mc-list
  v-model="selected"
  mode="single"
  :show-radio="false"
  :items="[
    { label: '世界一 · 生存存档', value: 'world1', subtitle: '最后游玩：2 小时前' },
    { label: '世界二 · 创造模式', value: 'world2', subtitle: '最后游玩：昨天' },
    { label: '世界三 · 服务器入口', value: 'world3', subtitle: '最后游玩：3 天前' },
  ]"
/>
```

## 带禁用项

<div class="mc-demo mc-demo--column">
  <mc-list
    v-model="selected"
    mode="single"
    :items="[
      { label: '可用的选项', value: 'a' },
      { label: '已锁定的选项', value: 'b', disabled: true },
      { label: '另一个选项', value: 'c' },
    ]"
  />
</div>

```vue
<mc-list
  v-model="selected"
  mode="single"
  :items="[
    { label: '可用的选项', value: 'a' },
    { label: '已锁定的选项', value: 'b', disabled: true },
    { label: '另一个选项', value: 'c' },
  ]"
/>
```

## 交互状态

- **悬浮**：顶部凸起高光、底部阴影，背景变亮
- **选中**：顶部凹陷、底部高光，背景加深（仅 `mode="single"` / `mode="multiple"` 时显示）
- **按下**：顶部更深凹陷、底部更暗阴影，背景最深

`mode` 为空时，悬浮和按下效果正常显示，但不会出现选中高亮。

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `modelValue` | `string \| number \| (string \| number)[]` | `''` | 当前选中值，多选模式为数组（v-model） |
| `subtitle` | `string` | `''` | 列表内部左上角副标题 |
| `mode` | `'single' \| 'multiple' \| ''` | `''` | 选择模式：空为无选中（可点击），`single` 单选 / `multiple` 多选 |
| `showRadio` | `boolean` | `true` | 单选模式下是否显示单选框指示器 |
| `items` | `McListItem[]` | `[]` | 列表项 `{ label, value, disabled?, icon?, iconRight?, subtitle? }` |

## Events

| 名称 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `(value: McListValue \| McListValue[])` | v-model 更新事件 |
| `change` | `(value: McListValue \| McListValue[])` | 选中值变化时触发 |

## Slots

| 名称 | 作用域 | 说明 |
|---|---|---|
| `item-left` | `{ item: McListItem }` | 自定义列表项左侧内容，覆盖 `icon` 属性 |
| `item-right` | `{ item: McListItem }` | 自定义列表项右侧内容，覆盖 `iconRight` 属性 |
