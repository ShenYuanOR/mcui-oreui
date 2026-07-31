# 文本与排版 / Text & Typography

文本工具类包含对齐、装饰、换行、截断、大小写、字重、斜体和等宽字体；排版标尺使用 Vuetify 4 的 display、headline、title、body、label 名称，并支持[分辨率](./breakpoints)中定义的响应式中缀。

## 排版标尺

<div class="mc-demo mc-demo--column">
  <div class="text-display-small">Display small</div>
  <div class="text-headline-small">Headline small</div>
  <div class="text-title-large">Title large</div>
  <div class="text-body-medium">Body medium</div>
  <div class="text-label-small">Label small</div>
</div>

`display/headline` 使用 `--mc-font-title`，`title/label` 使用 `--mc-font-ui`，body 使用 `--mc-font-body`。

## 文本行为

<div class="mc-demo mc-demo--column">
  <div class="text-center text-uppercase font-weight-bold">center · uppercase · bold</div>
  <div class="text-decoration-underline font-italic">underline · italic</div>
  <div class="text-mono">monospace: /give @s diamond 64</div>
  <div class="text-truncate w-50">这是一段会在固定宽度内产生省略号的很长文本内容</div>
  <div class="text-break" style="max-width:220px">averyveryveryveryveryverylongunbrokenword</div>
</div>

```html
<h2 class="text-title-large text-md-headline-small">响应式标题</h2>
```

## 本章类名

<mc-utility-catalog section="typography" />
