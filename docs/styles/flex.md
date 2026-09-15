# 弹性布局 / Flex

Flex 工具类包含方向、换行、grow/shrink、flex shorthand、justify、justify-items、align-items/content/self 和 order；全部提供响应式变体，尺寸中缀统一见[分辨率](./breakpoints)。

## 基础用法

<div class="mc-demo mc-demo--column">
  <div class="d-flex flex-wrap ga-3 w-100">
    <div class="mc-utility-demo__box">A</div><div class="mc-utility-demo__box">B</div><div class="mc-utility-demo__box">C</div><div class="mc-utility-demo__box">D</div>
  </div>
  <div class="d-flex flex-column flex-md-row ga-2 w-100">
    <div class="mc-utility-demo__box flex-grow-1">flex-grow-1</div><div class="mc-utility-demo__box">固定内容</div>
  </div>
</div>

## 对齐与顺序

<div class="mc-demo mc-demo--column">
  <div class="d-flex justify-space-between align-center ga-2 w-100" style="min-height:120px">
    <div class="mc-utility-demo__box order-last">order-last</div>
    <div class="mc-utility-demo__box align-self-start">start</div>
    <div class="mc-utility-demo__box align-self-end">end</div>
  </div>
</div>

```html
<div class="d-flex flex-column flex-md-row justify-space-between align-center ga-4">
  <main class="flex-1-1-100">主内容</main>
  <aside class="flex-shrink-0 order-md-first">侧栏</aside>
</div>
```

## 本章类名

<mc-utility-catalog section="flex" />
