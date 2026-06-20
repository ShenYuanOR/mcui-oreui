<script setup>
import { ref } from 'vue'
const selected = ref('world1')
</script>

# List 列表

可选中列表，用于展示一组选项供用户挑选。

## 基础用法

<div class="mc-demo mc-demo--column">
  <mc-list
    v-model="selected"
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
  :items="[
    { label: '世界一 · 生存存档', value: 'world1' },
    { label: '世界二 · 创造模式', value: 'world2' },
  ]"
/>
```

## 带副标题

<div class="mc-demo mc-demo--column">
  <mc-list
    v-model="selected"
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
  subtitle="选择世界"
  :items="[...]"
/>
```

通过 `subtitle` 在列表内部左上角放置副标题文字。

## 带图标

<div class="mc-demo mc-demo--column">
  <mc-list
    v-model="selected"
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
  :items="[
    { label: '生存模式', value: 'survival', icon: 'sword' },
    { label: '设置', value: 'settings', iconRight: 'gear' },
  ]"
/>
```

通过 `icon` 在左侧放置图标，`iconRight` 在右侧放置图标。

## 带禁用项

<div class="mc-demo mc-demo--column">
  <mc-list
    v-model="selected"
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
  :items="[
    { label: '可用的选项', value: 'a' },
    { label: '已锁定的选项', value: 'b', disabled: true },
  ]"
/>
```

## 交互状态

- **悬浮**：顶部凸起高光、底部阴影，背景变亮
- **选中**：顶部凹陷、底部高光，背景加深
- **按下**：顶部更深凹陷、底部更暗阴影，背景最深

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `modelValue` | `string \| number` | `''` | 当前选中值（v-model） |
| `subtitle` | `string` | `''` | 列表内部左上角副标题 |
| `items` | `McListItem[]` | `[]` | 列表项 `{ label, value, disabled?, icon?, iconRight? }` |
