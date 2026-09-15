# 溢出 / Overflow

整体、X 轴和 Y 轴分别使用 `overflow-*`、`overflow-x-*`、`overflow-y-*`，支持 `auto`、`hidden`、`visible`、`scroll` 和 `clip`。

## 基础用法

<div class="mc-demo">
  <div><span class="mc-utility-demo__label">overflow-auto</span><div class="mc-utility-demo__overflow overflow-auto"><div class="mc-utility-demo__overflow-content">可以滚动查看完整内容</div></div></div>
  <div><span class="mc-utility-demo__label">overflow-hidden</span><div class="mc-utility-demo__overflow overflow-hidden"><div class="mc-utility-demo__overflow-content">超出内容被裁剪</div></div></div>
  <div><span class="mc-utility-demo__label">overflow-clip</span><div class="mc-utility-demo__overflow overflow-clip"><div class="mc-utility-demo__overflow-content">裁剪且不创建滚动容器</div></div></div>
</div>

```html
<div class="overflow-y-auto">纵向自动滚动</div>
<div class="overflow-x-hidden">隐藏横向溢出</div>
```

## 本章类名

<mc-utility-catalog section="overflow" />
