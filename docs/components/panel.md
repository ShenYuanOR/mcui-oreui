# Panel 区域面板

Panel 用来划分页面或工作区，组织固定头部、可伸展正文和固定底部。它默认是静态区域，不提供整块点击或跳转能力。

> 一个东西代表“一条内容”就用 Card；代表“内容放置在哪里”就用 Panel。

## 可滚动工作区

给 Panel 或其父级明确高度后，正文会占满头尾之间的剩余空间，并在内容超出时独立滚动。

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-panel title="世界设置" subtitle="正文滚动，头部与底部保持可见" style="height:320px">
    <template #actions>
      <mc-button size="small">重载</mc-button>
    </template>
    <div style="display:grid;gap:10px">
      <div style="background:#48494a;padding:12px">游戏模式：生存</div>
      <div style="background:#48494a;padding:12px">难度：普通</div>
      <div style="background:#48494a;padding:12px">世界类型：无限</div>
      <div style="background:#48494a;padding:12px">坐标显示：开启</div>
      <div style="background:#48494a;padding:12px">友军伤害：关闭</div>
      <div style="background:#48494a;padding:12px">重生半径：5</div>
    </div>
    <template #footer>
      <mc-button variant="primary">保存设置</mc-button>
    </template>
  </mc-panel>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-panel title="世界设置" subtitle="正文滚动，头部与底部保持可见" style="height:320px">
      <template #actions>
        <mc-button size="small">重载</mc-button>
      </template>
      <div style="display:grid;gap:10px">
        <div style="background:#48494a;padding:12px">游戏模式：生存</div>
        <div style="background:#48494a;padding:12px">难度：普通</div>
        <div style="background:#48494a;padding:12px">世界类型：无限</div>
        <div style="background:#48494a;padding:12px">坐标显示：开启</div>
        <div style="background:#48494a;padding:12px">友军伤害：关闭</div>
        <div style="background:#48494a;padding:12px">重生半径：5</div>
      </div>
      <template #footer>
        <mc-button variant="primary">保存设置</mc-button>
      </template>
    </mc-panel>
  </div>
</template>
```

## 自定义区域

`header` 可以完全接管头部内容，`actions` 仍固定排列在头部右侧；没有 header 或 footer 时，默认正文依然占据中间的可伸展行。

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-panel style="min-height:220px">
    <template #header>
      <div>
        <strong>资源包工作区</strong>
        <div style="color:#d0d1d4;margin-top:4px">已启用 3 个资源包</div>
      </div>
    </template>
    <template #actions>
      <mc-button size="small">刷新</mc-button>
    </template>
    在这里放置表单、列表、详情视图或其他复杂内容。
    <template #footer>
      <mc-button>取消</mc-button>
      <mc-button variant="primary">应用</mc-button>
    </template>
  </mc-panel>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-panel style="min-height:220px">
      <template #header>
        <div>
          <strong>资源包工作区</strong>
          <div style="color:#d0d1d4;margin-top:4px">已启用 3 个资源包</div>
        </div>
      </template>
      <template #actions>
        <mc-button size="small">刷新</mc-button>
      </template>
      在这里放置表单、列表、详情视图或其他复杂内容。
      <template #footer>
        <mc-button>取消</mc-button>
        <mc-button variant="primary">应用</mc-button>
      </template>
    </mc-panel>
  </div>
</template>
```

## Props

| 名称       | 类型     | 默认 | 说明                           |
| ---------- | -------- | ---- | ------------------------------ |
| `title`    | `string` | `''` | 标题，作为 `header` 插槽简写   |
| `subtitle` | `string` | `''` | 副标题，作为 `header` 插槽简写 |

`bordered` 与 `elevated` 已删除。Panel 的 Ore UI 底色、外框和分区边线是默认视觉，不再作为职责变体；需要可重复点击或跳转的独立信息对象时使用 [Card](./card)。

## Slots

| 名称      | 说明                         |
| --------- | ---------------------------- |
| `default` | 可伸展、内容溢出时滚动的正文 |
| `header`  | 自定义头部                   |
| `actions` | 头部右侧操作区               |
| `footer`  | 固定在底部的区域             |
