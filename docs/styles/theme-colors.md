# 主题颜色 / Theme Colors

每个内置 Ore UI 语义 Token 都生成 `text-*`、`bg-*` 和 `border-*`。这些类直接引用同名 `--mc-*` 变量，因此运行时切换 Theme 会立即更新。

## 背景与文字

<div class="mc-demo mc-demo--column">
  <div class="mc-utility-demo__grid">
    <div class="mc-utility-demo__swatch bg-primary">bg-primary</div>
    <div class="mc-utility-demo__swatch bg-error">bg-error</div>
    <div class="mc-utility-demo__swatch bg-warning text-inverse">bg-warning</div>
    <div class="mc-utility-demo__swatch bg-info">bg-info</div>
    <div class="mc-utility-demo__swatch bg-surface text-primary">surface + text-primary</div>
    <div class="mc-utility-demo__swatch bg-secondary text-inverse">bg-secondary</div>
  </div>
</div>

## 边框色与运行时变量

<div class="mc-demo">
  <div class="mc-utility-demo__box border-md border-primary">border-primary</div>
  <div class="mc-utility-demo__box border-md border-error border-opacity-50">error 50%</div>
  <div class="mc-utility-demo__box text-primary border-md border-primary" style="--mc-primary:#b36a3c">局部 --mc-primary</div>
</div>

```ts
createMcUI({
  theme: {
    themes: { copper: { colors: { primary: '#b36a3c' } } },
  },
})
```

完全任意的新 Token 名称没有静态类，需要直接使用 CSS 变量或自定义样式。

## 本章类名

<mc-utility-catalog section="theme-colors" />
