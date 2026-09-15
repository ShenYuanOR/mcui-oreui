# 尺寸 / Sizing

尺寸工具控制宽度和高度，支持 auto、0、百分比、动态视口宽高与[分辨率](./breakpoints)中定义的响应式中缀。

## 基础用法

<div class="mc-demo mc-demo--column">
  <div class="mc-utility-demo__surface">
    <div class="bg-primary pa-2 w-25" data-sizing="width">w-25</div>
    <div class="bg-primary pa-2 w-50 mt-2">w-50</div>
    <div class="bg-primary pa-2 w-100 mt-2">w-100</div>
  </div>
</div>

## 高度

<div class="mc-demo mc-demo--column">
  <div class="mc-utility-demo__surface d-flex align-end ga-2" style="height:180px">
    <div class="mc-utility-demo__box h-25">h-25</div>
    <div class="mc-utility-demo__box h-50">h-50</div>
    <div class="mc-utility-demo__box h-100">h-100</div>
  </div>
</div>

```html
<aside class="w-100 w-lg-25">小屏全宽，lg 以上四分之一宽</aside>
<section class="h-screen">占满动态视口高度</section>
```

`w-screen` 使用 `100dvw`，`h-screen` 使用 `100dvh`；`fill-height` 将高度设置为 100%。百分比高度需要父容器具有可计算高度。

## 本章类名

<mc-utility-catalog section="sizing" />
