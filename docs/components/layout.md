<script setup lang="ts"></script>

# 布局 / Layout

`McLayout` 是页面区域的布局父组件。它建立独立的布局上下文、填满可用空间，并允许内部内容沿纵向伸展；它不负责应用主题、顶部栏或侧边栏。

## 基础布局

下面只展示 `McLayout` 自身。示例使用原生语义元素划分顶部、内容和底部区域，内容区域会占用剩余高度。

<div class="mc-demo mc-layout-basic-demo">
  <mc-layout>
    <header class="mc-layout-basic-demo__header">区域标题</header>
    <main class="mc-layout-basic-demo__main">
      <strong>主要内容</strong>
      <span>此区域随父容器伸展。</span>
    </main>
    <footer class="mc-layout-basic-demo__footer">区域状态</footer>
  </mc-layout>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-layout-basic-demo">
    <mc-layout>
      <header class="mc-layout-basic-demo__header">区域标题</header>
      <main class="mc-layout-basic-demo__main">
        <strong>主要内容</strong>
        <span>此区域随父容器伸展。</span>
      </main>
      <footer class="mc-layout-basic-demo__footer">区域状态</footer>
    </mc-layout>
  </div>
</template>
```

`height: 100%` 需要父级提供明确高度。可伸展或可滚动的内容区域应设置 `min-height: 0`，避免内容把布局撑破。

## 布局上下文

`McLayout` 会为后代提供布局注册上下文。支持注册的组件可以声明所占方向和尺寸，消费该上下文的内容组件据此避让，但这些组合方式应分别在对应组件页面中查看：

- [应用栏 / Appbar](./appbar)
- [侧边抽屉 / Drawer](./drawer)

## API

`McLayout` 没有 Props。默认插槽提供只读的 `offsets`，包含 `top`、`bottom`、`start`、`end` 四个数字，用于需要自行读取布局占位的高级场景。例如 `offsets.start` 表示起始侧已经注册的占位宽度。

<style scoped>
.mc-layout-basic-demo {
  height: 280px;
  overflow: hidden;
  border: 2px solid #1e1e1f;
}

.mc-layout-basic-demo__header,
.mc-layout-basic-demo__footer {
  flex: 0 0 auto;
  padding: 10px 14px;
  background: #313233;
}

.mc-layout-basic-demo__header {
  border-bottom: 2px solid #1e1e1f;
  font-weight: 700;
}

.mc-layout-basic-demo__main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  padding: 16px;
  background: #48494a;
}

.mc-layout-basic-demo__footer {
  border-top: 2px solid #1e1e1f;
  color: #d0d1d4;
}
</style>
