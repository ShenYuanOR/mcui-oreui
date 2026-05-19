# Panel 面板

通用内容面板，比 `<mc-card>` 更适合承载设置分组、详情区和复杂内容。

## 基础用法

<div class="mc-demo mc-demo--column">
  <mc-panel title="世界设置" subtitle="调整游戏体验与资源选项">
    <p style="margin:0;color:#fff">这里可以放置表单、列表或任意内容。</p>
  </mc-panel>
</div>

```vue
<mc-panel title="世界设置" subtitle="调整游戏体验与资源选项">
  这里可以放置表单、列表或任意内容。
</mc-panel>
```

## 操作区与底部

<div class="mc-demo mc-demo--column">
  <mc-panel title="资源包">
    <template #actions>
      <mc-button size="small">刷新</mc-button>
    </template>
    已启用 3 个资源包。
    <template #footer>
      <mc-button variant="green">保存</mc-button>
    </template>
  </mc-panel>
</div>

```vue
<mc-panel title="资源包">
  <template #actions>
    <mc-button size="small">刷新</mc-button>
  </template>

  已启用 3 个资源包。

  <template #footer>
    <mc-button variant="green">保存</mc-button>
  </template>
</mc-panel>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `title` | `string` | `''` | 面板标题 |
| `subtitle` | `string` | `''` | 副标题 |
| `bordered` | `boolean` | `true` | 是否显示描边 |
| `elevated` | `boolean` | `true` | 是否显示立体阴影 |

## Slots

| 名称 | 说明 |
|---|---|
| `default` | 面板主体内容 |
| `header` | 自定义头部 |
| `actions` | 头部右侧操作区 |
| `footer` | 底部区域 |
