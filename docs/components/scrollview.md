# ScrollView 滚动区

## 固定高度滚动

McUI 风格的自定义滚动区。基于原生滚动 + 联动滚动条 thumb（可拖动）。

> 原项目滚动条 JS 与全局环境深度耦合，本库提供**等价的独立实现**。

<div class="mc-demo">
  <div style="width:100%;height:220px;border:2px solid #1E1E1F;background:#48494A">
    <mc-scroll-view>
      <div style="padding:16px;color:#D0D1D4;font-family:'NotoSans Bold',sans-serif">
        <p v-for="i in 20" :key="i">这是第 {{ i }} 行内容，滚动查看右侧 McUI 滚动条。</p>
      </div>
    </mc-scroll-view>
  </div>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo">
    <div style="width:100%;height:220px;border:2px solid #1E1E1F;background:#48494A">
      <mc-scroll-view>
        <div style="padding:16px;color:#D0D1D4;font-family:'NotoSans Bold',sans-serif">
          <p v-for="i in 20" :key="i">这是第 {{ i }} 行内容，滚动查看右侧 McUI 滚动条。</p>
        </div>
      </mc-scroll-view>
    </div>
  </div>
</template>
```

`<mc-scroll-view>` 会撑满父容器高度（父容器需有确定高度）。无 Props，默认插槽为可滚动内容。
根节点会裁剪越过固定外框的内容，内部原生滚动层负责滚轮、触摸和键盘滚动；右侧 Ore UI thumb 与 `scrollTop` 联动并支持拖动。内容或窗口尺寸变化时会通过 `ResizeObserver` 自动重算。
