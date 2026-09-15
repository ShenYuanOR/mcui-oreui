# 边框与圆角 / Border & Radius

边框工具覆盖整体边、逻辑方向边、宽度、样式、透明度和主题色；圆角覆盖整体、四边、四个逻辑角、pill、circle 与 shaped。

## 基础用法

<div class="mc-demo">
  <div class="mc-utility-demo__box border">border</div>
  <div class="mc-utility-demo__box border-md border-dashed">border-md dashed</div>
  <div class="mc-utility-demo__box border-lg border-primary border-opacity-50">主题色 50%</div>
  <div class="mc-utility-demo__box border-s-xl" dir="rtl">RTL border-s-xl</div>
</div>

## Radius

<div class="mc-demo">
  <div class="mc-utility-demo__box rounded-sm">sm</div>
  <div class="mc-utility-demo__box rounded-lg">lg</div>
  <div class="mc-utility-demo__box rounded-xl">xl</div>
  <div class="mc-utility-demo__box rounded-pill px-6">pill</div>
  <div class="mc-utility-demo__box rounded-circle" style="height:76px;width:76px">circle</div>
  <div class="mc-utility-demo__box rounded-shaped">shaped</div>
</div>

逻辑圆角使用 `rounded-s/e` 和 `rounded-ts/te/bs/be`，会随 RTL 自动映射。

## 本章类名

<mc-utility-catalog section="borders" />
