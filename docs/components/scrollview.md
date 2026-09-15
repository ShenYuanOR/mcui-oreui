<script setup lang="ts">
import { ref } from 'vue'

const demoHeight = ref(340)
</script>

# ScrollView 滚动区

## 基础用法

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

`<mc-scroll-view>` 会撑满父容器高度（父容器需有确定高度）。默认插槽为可滚动内容。
根节点会裁剪越过固定外框的内容，内部原生滚动层负责滚轮、触摸和键盘滚动；右侧 Ore UI thumb 与 `scrollTop` 联动并支持拖动。内容或窗口尺寸变化时会通过 `ResizeObserver` 自动重算。

## 自动撑满剩余高度

当父容器使用纵向 flex 布局并提供明确高度时，`McScrollView` 会自动占用固定区域之外的全部剩余高度。拖动滑块改变父容器高度，可以看到顶部区域保持不变，滚动区实时伸缩。

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-slider v-model="demoHeight" label="父容器高度" :min="260" :max="500" :step="20" show-value />
  <div class="mc-scroll-view-fill-demo" :style="{ height: `${demoHeight}px` }">
    <header class="mc-scroll-view-fill-demo__header">
      固定区域 · 48px
    </header>
    <mc-scroll-view>
      <div class="mc-scroll-view-fill-demo__content">
        <p v-for="i in 24" :key="i">第 {{ i }} 条内容 · 滚动区自动占用剩余高度</p>
      </div>
    </mc-scroll-view>
  </div>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const demoHeight = ref(340)
</script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-slider v-model="demoHeight" label="父容器高度" :min="260" :max="500" :step="20" show-value />
    <div class="mc-scroll-view-fill-demo" :style="{ height: `${demoHeight}px` }">
      <header class="mc-scroll-view-fill-demo__header">固定区域 · 48px</header>
      <mc-scroll-view>
        <div class="mc-scroll-view-fill-demo__content">
          <p v-for="i in 24" :key="i">第 {{ i }} 条内容 · 滚动区自动占用剩余高度</p>
        </div>
      </mc-scroll-view>
    </div>
  </div>
</template>
```

这个机制依赖父级的剩余空间可计算：父级需要设置明确高度、`display: flex` 和 `flex-direction: column`。如果父级本身也是可伸展区域，同样应设置 `min-height: 0`。

## API

### Props

`McScrollView` 暂无公开 Props。通过父容器尺寸控制可视高度，默认插槽提供滚动内容。

<style scoped>
.mc-scroll-view-fill-demo {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  width: 100%;
  border: 2px solid #1e1e1f;
  background: #48494a;
}

.mc-scroll-view-fill-demo__header {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex: 0 0 48px;
  min-height: 0;
  padding: 0 16px;
  border-bottom: 2px solid #1e1e1f;
  background: #313233;
  font-weight: 700;
}

.mc-scroll-view-fill-demo__content {
  padding: 12px 16px;
  color: #d0d1d4;
}

.mc-scroll-view-fill-demo__content p {
  margin: 0;
  padding: 8px 0;
  border-bottom: 1px solid #58585a;
}
</style>
