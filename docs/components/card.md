# Card 链接卡片

对应原 `link-block`，悬停时有 McUI 标志性的斜向扫光动画。

<div class="mc-demo">
  <mc-card title="纯原生实现" description="不依赖任何第三方库，轻量高效。" style="width:220px" />
  <mc-card title="模块化构建" description="组件可独立或组合使用。" style="width:220px" />
</div>

```html
<mc-card title="纯原生实现" description="不依赖任何第三方库，轻量高效。" @click="go" />

<!-- 或使用插槽 -->
<mc-card>
  <template #title>自定义标题</template>
  自定义描述内容
</mc-card>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `title` | `string` | `''` | 标题（也可用 `#title` 插槽） |
| `description` | `string` | `''` | 描述（也可用默认插槽） |

## Events

| 事件 | 参数 | 说明 |
|---|---|---|
| `click` | `MouseEvent` | 点击，自动播放 `click` 音效 |
