# Card 卡片

Card 采用与 Vuetify `VCard` 相同的组合式结构：`McCard` 只负责表面、链接与交互语义，标题、正文和操作区由独立子组件组成，不再由父组件把任意默认内容强行包装成固定区块。它表示可重复排列的一条独立内容；需要承载复杂内容的页面工作区时使用 [Panel](./panel)。

## 基础用法

<div class="mc-demo mc-demo--column" style="width:420px">
  <mc-card>
    <mc-card-item>
      <template #prepend><mc-icon name="mc-star" /></template>
      <mc-card-title>Realm 存档</mc-card-title>
      <mc-card-subtitle>最后游玩：今天 18:40</mc-card-subtitle>
      <template #append><mc-badge content="3"><span>资源</span></mc-badge></template>
    </mc-card-item>
    <mc-card-text>主世界已启用实验性玩法，进入前请确认资源包版本一致。</mc-card-text>
    <mc-card-actions>
      <mc-button size="small">管理</mc-button>
      <mc-button size="small" variant="primary">进入世界</mc-button>
    </mc-card-actions>
  </mc-card>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width: 420px">
    <mc-card>
      <mc-card-item>
        <template #prepend><mc-icon name="mc-star" /></template>
        <mc-card-title>Realm 存档</mc-card-title>
        <mc-card-subtitle>最后游玩：今天 18:40</mc-card-subtitle>
        <template #append>
          <mc-badge content="3"><span>资源</span></mc-badge>
        </template>
      </mc-card-item>
      <mc-card-text>主世界已启用实验性玩法，进入前请确认资源包版本一致。</mc-card-text>
      <mc-card-actions>
        <mc-button size="small">管理</mc-button>
        <mc-button size="small" variant="primary">进入世界</mc-button>
      </mc-card-actions>
    </mc-card>
  </div>
</template>
```

## 交互模式

整张卡片承担点击或链接行为时，只在卡片内放展示内容；需要独立按钮时使用静态 `McCard` + `McCardActions`，避免在按钮卡片中嵌套按钮。

<div class="mc-demo mc-demo--column" style="width:360px">
  <mc-card clickable>
    <mc-card-item>
      <mc-card-title>按钮卡片</mc-card-title>
      <mc-card-subtitle>点击整张卡片执行操作</mc-card-subtitle>
    </mc-card-item>
  </mc-card>
  <mc-card href="https://example.com">
    <mc-card-item>
      <mc-card-title>链接卡片</mc-card-title>
      <mc-card-subtitle>使用原生链接语义</mc-card-subtitle>
    </mc-card-item>
  </mc-card>
  <mc-card clickable disabled>
    <mc-card-item>
      <mc-card-title>禁用卡片</mc-card-title>
      <mc-card-subtitle>暂不可操作</mc-card-subtitle>
    </mc-card-item>
  </mc-card>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width: 360px">
    <mc-card clickable>
      <mc-card-item>
        <mc-card-title>按钮卡片</mc-card-title>
        <mc-card-subtitle>点击整张卡片执行操作</mc-card-subtitle>
      </mc-card-item>
    </mc-card>
    <mc-card href="https://example.com">
      <mc-card-item>
        <mc-card-title>链接卡片</mc-card-title>
        <mc-card-subtitle>使用原生链接语义</mc-card-subtitle>
      </mc-card-item>
    </mc-card>
    <mc-card clickable disabled>
      <mc-card-item>
        <mc-card-title>禁用卡片</mc-card-title>
        <mc-card-subtitle>暂不可操作</mc-card-subtitle>
      </mc-card-item>
    </mc-card>
  </div>
</template>
```

## API

### McCard Props

| 名称        | 类型      | 默认      | 说明                                                     |
| ----------- | --------- | --------- | -------------------------------------------------------- |
| `clickable` | `boolean` | `false`   | 是否将没有链接目标的卡片渲染为原生 `button`。            |
| `href`      | `string`  | -         | 原生链接目标；提供后卡片渲染为 `a`。                     |
| `to`        | `string`  | -         | 链接目标别名；当前实现同样渲染为原生 `a`，不依赖路由器。 |
| `tag`       | `string`  | `article` | 静态模式下使用的根元素标签。                             |
| `disabled`  | `boolean` | `false`   | 是否禁用点击或链接导航，并设置对应禁用语义。             |

### 子组件

| 组件             | 职责                                 | 默认标签 | 插槽                                           |
| ---------------- | ------------------------------------ | -------- | ---------------------------------------------- |
| `McCardItem`     | 编排头部 prepend、内容和 append 三列 | `div`    | `prepend`、`title`、`subtitle`、`append`、默认 |
| `McCardTitle`    | Card 标题                            | `div`    | 默认                                           |
| `McCardSubtitle` | Card 副标题                          | `div`    | 默认                                           |
| `McCardText`     | 正文区与统一正文内边距               | `div`    | 默认                                           |
| `McCardActions`  | 横向操作区                           | `div`    | 默认                                           |

所有子组件都提供 `tag?: string`，用于在不改变视觉结构的情况下替换根标签。

`McCard` 仍提供 `prepend`、`title`、`subtitle`、`append`、`item`、`text`、`actions` 命名插槽作为简写，并在内部使用上述子组件渲染；新代码优先使用显式子组件，让结构在模板中保持可读。默认插槽直接承载组合式子组件，不再自动包装正文。
