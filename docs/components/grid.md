# Grid 栅格

仿 Vuetify 的 12 列响应式 Flex 栅格：`<mc-container>` 控制页面宽度，`<mc-row>` 负责换行与 gutter，`<mc-col>` 声明列宽，`<mc-spacer>` 用于占据剩余空间。

断点采用移动优先策略：`sm >= 600px`、`md >= 960px`、`lg >= 1280px`、`xl >= 1920px`、`xxl >= 2560px`。未命中的断点会继承更小断点的布局。

## 基础 12 列

<div class="mc-demo mc-demo--column">
  <mc-container fluid class="mc-grid-demo__surface">
    <mc-row>
      <mc-col cols="12">
        <div class="mc-grid-demo__cell">12</div>
      </mc-col>
      <mc-col cols="6">
        <div class="mc-grid-demo__cell mc-grid-demo__cell--moss">6</div>
      </mc-col>
      <mc-col cols="6">
        <div class="mc-grid-demo__cell mc-grid-demo__cell--moss">6</div>
      </mc-col>
      <mc-col cols="4">
        <div class="mc-grid-demo__cell mc-grid-demo__cell--copper">4</div>
      </mc-col>
      <mc-col cols="4">
        <div class="mc-grid-demo__cell mc-grid-demo__cell--copper">4</div>
      </mc-col>
      <mc-col cols="4">
        <div class="mc-grid-demo__cell mc-grid-demo__cell--copper">4</div>
      </mc-col>
    </mc-row>
  </mc-container>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column">
    <mc-container fluid class="mc-grid-demo__surface">
      <mc-row>
        <mc-col cols="12">
          <div class="mc-grid-demo__cell">12</div>
        </mc-col>
        <mc-col cols="6">
          <div class="mc-grid-demo__cell mc-grid-demo__cell--moss">6</div>
        </mc-col>
        <mc-col cols="6">
          <div class="mc-grid-demo__cell mc-grid-demo__cell--moss">6</div>
        </mc-col>
        <mc-col cols="4">
          <div class="mc-grid-demo__cell mc-grid-demo__cell--copper">4</div>
        </mc-col>
        <mc-col cols="4">
          <div class="mc-grid-demo__cell mc-grid-demo__cell--copper">4</div>
        </mc-col>
        <mc-col cols="4">
          <div class="mc-grid-demo__cell mc-grid-demo__cell--copper">4</div>
        </mc-col>
      </mc-row>
    </mc-container>
  </div>
</template>

<style scoped>
.mc-grid-demo__surface {
  background: #242526;
  border: 2px solid #1e1e1f;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
}

.mc-grid-demo__cell {
  align-items: center;
  background: #4f6f8f;
  border: 2px solid #1d2b38;
  box-shadow:
    inset 0 2px rgba(255, 255, 255, 0.22),
    inset 0 -3px rgba(0, 0, 0, 0.24);
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-family: 'Minecraft Seven', sans-serif;
  justify-content: center;
  min-height: 40px;
  padding: 10px;
  text-align: center;
}

.mc-grid-demo__cell--moss {
  background: #5f7d4b;
  border-color: #25351d;
}

.mc-grid-demo__cell--copper {
  background: #9b6a43;
  border-color: #3d2618;
}

.mc-grid-demo__cell--short {
  min-height: 34px;
}

.mc-grid-demo__cell--tall {
  min-height: 84px;
}

.mc-grid-demo__align-row {
  min-height: 116px;
}

.mc-grid-demo__toolbar {
  background: #3b3c40;
  border: 2px solid #1e1e1f;
  padding: 8px;
}
</style>
```

## 响应式列宽

<div class="mc-demo mc-demo--column">
  <mc-container fluid class="mc-grid-demo__surface">
    <mc-row>
      <mc-col cols="12" md="6" lg="4">
        <div class="mc-grid-demo__cell">cols=12 md=6 lg=4</div>
      </mc-col>
      <mc-col cols="12" md="6" lg="4">
        <div class="mc-grid-demo__cell mc-grid-demo__cell--moss">cols=12 md=6 lg=4</div>
      </mc-col>
      <mc-col cols="12" md="6" lg="4">
        <div class="mc-grid-demo__cell mc-grid-demo__cell--copper">cols=12 md=6 lg=4</div>
      </mc-col>
    </mc-row>
  </mc-container>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column">
    <mc-container fluid class="mc-grid-demo__surface">
      <mc-row>
        <mc-col cols="12" md="6" lg="4">
          <div class="mc-grid-demo__cell">cols=12 md=6 lg=4</div>
        </mc-col>
        <mc-col cols="12" md="6" lg="4">
          <div class="mc-grid-demo__cell mc-grid-demo__cell--moss">cols=12 md=6 lg=4</div>
        </mc-col>
        <mc-col cols="12" md="6" lg="4">
          <div class="mc-grid-demo__cell mc-grid-demo__cell--copper">cols=12 md=6 lg=4</div>
        </mc-col>
      </mc-row>
    </mc-container>
  </div>
</template>

<style scoped>
.mc-grid-demo__surface {
  background: #242526;
  border: 2px solid #1e1e1f;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
}

.mc-grid-demo__cell {
  align-items: center;
  background: #4f6f8f;
  border: 2px solid #1d2b38;
  box-shadow:
    inset 0 2px rgba(255, 255, 255, 0.22),
    inset 0 -3px rgba(0, 0, 0, 0.24);
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-family: 'Minecraft Seven', sans-serif;
  justify-content: center;
  min-height: 40px;
  padding: 10px;
  text-align: center;
}

.mc-grid-demo__cell--moss {
  background: #5f7d4b;
  border-color: #25351d;
}

.mc-grid-demo__cell--copper {
  background: #9b6a43;
  border-color: #3d2618;
}

.mc-grid-demo__cell--short {
  min-height: 34px;
}

.mc-grid-demo__cell--tall {
  min-height: 84px;
}

.mc-grid-demo__align-row {
  min-height: 116px;
}

.mc-grid-demo__toolbar {
  background: #3b3c40;
  border: 2px solid #1e1e1f;
  padding: 8px;
}
</style>
```

## Offset 与 Order

<div class="mc-demo mc-demo--column">
  <mc-container fluid class="mc-grid-demo__surface">
    <mc-row>
      <mc-col cols="4" offset="2">
        <div class="mc-grid-demo__cell">offset=2</div>
      </mc-col>
      <mc-col cols="4">
        <div class="mc-grid-demo__cell mc-grid-demo__cell--moss">cols=4</div>
      </mc-col>
    </mc-row>
    <mc-row>
      <mc-col cols="4" order="last">
        <div class="mc-grid-demo__cell">order=last</div>
      </mc-col>
      <mc-col cols="4">
        <div class="mc-grid-demo__cell mc-grid-demo__cell--moss">默认顺序</div>
      </mc-col>
      <mc-col cols="4" order="first">
        <div class="mc-grid-demo__cell mc-grid-demo__cell--copper">order=first</div>
      </mc-col>
    </mc-row>
  </mc-container>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column">
    <mc-container fluid class="mc-grid-demo__surface">
      <mc-row>
        <mc-col cols="4" offset="2">
          <div class="mc-grid-demo__cell">offset=2</div>
        </mc-col>
        <mc-col cols="4">
          <div class="mc-grid-demo__cell mc-grid-demo__cell--moss">cols=4</div>
        </mc-col>
      </mc-row>
      <mc-row>
        <mc-col cols="4" order="last">
          <div class="mc-grid-demo__cell">order=last</div>
        </mc-col>
        <mc-col cols="4">
          <div class="mc-grid-demo__cell mc-grid-demo__cell--moss">默认顺序</div>
        </mc-col>
        <mc-col cols="4" order="first">
          <div class="mc-grid-demo__cell mc-grid-demo__cell--copper">order=first</div>
        </mc-col>
      </mc-row>
    </mc-container>
  </div>
</template>

<style scoped>
.mc-grid-demo__surface {
  background: #242526;
  border: 2px solid #1e1e1f;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
}

.mc-grid-demo__cell {
  align-items: center;
  background: #4f6f8f;
  border: 2px solid #1d2b38;
  box-shadow:
    inset 0 2px rgba(255, 255, 255, 0.22),
    inset 0 -3px rgba(0, 0, 0, 0.24);
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-family: 'Minecraft Seven', sans-serif;
  justify-content: center;
  min-height: 40px;
  padding: 10px;
  text-align: center;
}

.mc-grid-demo__cell--moss {
  background: #5f7d4b;
  border-color: #25351d;
}

.mc-grid-demo__cell--copper {
  background: #9b6a43;
  border-color: #3d2618;
}

.mc-grid-demo__cell--short {
  min-height: 34px;
}

.mc-grid-demo__cell--tall {
  min-height: 84px;
}

.mc-grid-demo__align-row {
  min-height: 116px;
}

.mc-grid-demo__toolbar {
  background: #3b3c40;
  border: 2px solid #1e1e1f;
  padding: 8px;
}
</style>
```

## 对齐与 Gutter

<div class="mc-demo mc-demo--column">
  <mc-container fluid class="mc-grid-demo__surface">
    <mc-row align="center" justify="space-between" dense class="mc-grid-demo__align-row">
      <mc-col cols="3">
        <div class="mc-grid-demo__cell mc-grid-demo__cell--short">start</div>
      </mc-col>
      <mc-col cols="3">
        <div class="mc-grid-demo__cell mc-grid-demo__cell--tall mc-grid-demo__cell--moss">center</div>
      </mc-col>
      <mc-col cols="3">
        <div class="mc-grid-demo__cell mc-grid-demo__cell--short mc-grid-demo__cell--copper">end</div>
      </mc-col>
    </mc-row>
  </mc-container>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column">
    <mc-container fluid class="mc-grid-demo__surface">
      <mc-row align="center" justify="space-between" dense class="mc-grid-demo__align-row">
        <mc-col cols="3">
          <div class="mc-grid-demo__cell mc-grid-demo__cell--short">start</div>
        </mc-col>
        <mc-col cols="3">
          <div class="mc-grid-demo__cell mc-grid-demo__cell--tall mc-grid-demo__cell--moss">center</div>
        </mc-col>
        <mc-col cols="3">
          <div class="mc-grid-demo__cell mc-grid-demo__cell--short mc-grid-demo__cell--copper">end</div>
        </mc-col>
      </mc-row>
    </mc-container>
  </div>
</template>

<style scoped>
.mc-grid-demo__surface {
  background: #242526;
  border: 2px solid #1e1e1f;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
}

.mc-grid-demo__cell {
  align-items: center;
  background: #4f6f8f;
  border: 2px solid #1d2b38;
  box-shadow:
    inset 0 2px rgba(255, 255, 255, 0.22),
    inset 0 -3px rgba(0, 0, 0, 0.24);
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-family: 'Minecraft Seven', sans-serif;
  justify-content: center;
  min-height: 40px;
  padding: 10px;
  text-align: center;
}

.mc-grid-demo__cell--moss {
  background: #5f7d4b;
  border-color: #25351d;
}

.mc-grid-demo__cell--copper {
  background: #9b6a43;
  border-color: #3d2618;
}

.mc-grid-demo__cell--short {
  min-height: 34px;
}

.mc-grid-demo__cell--tall {
  min-height: 84px;
}

.mc-grid-demo__align-row {
  min-height: 116px;
}

.mc-grid-demo__toolbar {
  background: #3b3c40;
  border: 2px solid #1e1e1f;
  padding: 8px;
}
</style>
```

`dense` 会把 gutter 缩小到 8px，`no-gutters` 会完全移除行列间距。

## Spacer

<div class="mc-demo mc-demo--column">
  <mc-container fluid class="mc-grid-demo__surface">
    <mc-row align="center" no-gutters class="mc-grid-demo__toolbar">
      <mc-col cols="auto">
        <mc-button size="small">返回</mc-button>
      </mc-col>
      <mc-spacer />
      <mc-col cols="auto">
        <mc-button size="small" variant="primary">保存</mc-button>
      </mc-col>
    </mc-row>
  </mc-container>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column">
    <mc-container fluid class="mc-grid-demo__surface">
      <mc-row align="center" no-gutters class="mc-grid-demo__toolbar">
        <mc-col cols="auto">
          <mc-button size="small">返回</mc-button>
        </mc-col>
        <mc-spacer />
        <mc-col cols="auto">
          <mc-button size="small" variant="primary">保存</mc-button>
        </mc-col>
      </mc-row>
    </mc-container>
  </div>
</template>

<style scoped>
.mc-grid-demo__surface {
  background: #242526;
  border: 2px solid #1e1e1f;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
}

.mc-grid-demo__cell {
  align-items: center;
  background: #4f6f8f;
  border: 2px solid #1d2b38;
  box-shadow:
    inset 0 2px rgba(255, 255, 255, 0.22),
    inset 0 -3px rgba(0, 0, 0, 0.24);
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-family: 'Minecraft Seven', sans-serif;
  justify-content: center;
  min-height: 40px;
  padding: 10px;
  text-align: center;
}

.mc-grid-demo__cell--moss {
  background: #5f7d4b;
  border-color: #25351d;
}

.mc-grid-demo__cell--copper {
  background: #9b6a43;
  border-color: #3d2618;
}

.mc-grid-demo__cell--short {
  min-height: 34px;
}

.mc-grid-demo__cell--tall {
  min-height: 84px;
}

.mc-grid-demo__align-row {
  min-height: 116px;
}

.mc-grid-demo__toolbar {
  background: #3b3c40;
  border: 2px solid #1e1e1f;
  padding: 8px;
}
</style>
```

## mc-container Props

| 名称    | 类型      | 默认    | 说明                                   |
| ------- | --------- | ------- | -------------------------------------- |
| `fluid` | `boolean` | `false` | 是否使用 100% 宽度，不套用断点最大宽度 |
| `tag`   | `string`  | `'div'` | 渲染的 HTML 标签                       |

默认插槽放置 `mc-row` 或任意内容。

## mc-row Props

| 名称                                                                      | 类型                                                                                  | 默认    | 说明                                   |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------- | -------------------------------------- |
| `tag`                                                                     | `string`                                                                              | `'div'` | 渲染的 HTML 标签                       |
| `dense`                                                                   | `boolean`                                                                             | `false` | 使用 8px gutter                        |
| `no-gutters`                                                              | `boolean`                                                                             | `false` | 移除 row 负边距和 col 内边距           |
| `align`                                                                   | `'start' \| 'center' \| 'end' \| 'baseline' \| 'stretch'`                             | -       | 设置 `align-items`                     |
| `align-sm` / `align-md` / `align-lg` / `align-xl` / `align-xxl`           | 同 `align`                                                                            | -       | 在指定断点及以上设置 `align-items`     |
| `justify`                                                                 | `'start' \| 'center' \| 'end' \| 'space-around' \| 'space-between' \| 'space-evenly'` | -       | 设置 `justify-content`                 |
| `justify-sm` / `justify-md` / `justify-lg` / `justify-xl` / `justify-xxl` | 同 `justify`                                                                          | -       | 在指定断点及以上设置 `justify-content` |

默认插槽放置 `mc-col`、`mc-spacer` 或其他 flex 子元素。

## mc-col Props

| 名称                                                                                     | 类型                                                                | 默认    | 说明                                                  |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------- | ----------------------------------------------------- |
| `tag`                                                                                    | `string`                                                            | `'div'` | 渲染的 HTML 标签                                      |
| `cols`                                                                                   | `boolean \| number \| string`                                       | -       | 默认列宽，支持 `1` - `12` 与 `'auto'`；不传时为等分列 |
| `sm` / `md` / `lg` / `xl` / `xxl`                                                        | `boolean \| number \| string`                                       | -       | 指定断点及以上的列宽                                  |
| `offset`                                                                                 | `number \| string`                                                  | -       | 默认左侧偏移，支持 `0` - `12`                         |
| `offset-sm` / `offset-md` / `offset-lg` / `offset-xl` / `offset-xxl`                     | `number \| string`                                                  | -       | 指定断点及以上的左侧偏移                              |
| `order`                                                                                  | `number \| string`                                                  | -       | 默认排序，支持 `0` - `12`、`'first'`、`'last'`        |
| `order-sm` / `order-md` / `order-lg` / `order-xl` / `order-xxl`                          | `number \| string`                                                  | -       | 指定断点及以上的排序                                  |
| `align-self`                                                                             | `'auto' \| 'start' \| 'center' \| 'end' \| 'baseline' \| 'stretch'` | -       | 设置当前列的 `align-self`                             |
| `align-self-sm` / `align-self-md` / `align-self-lg` / `align-self-xl` / `align-self-xxl` | 同 `align-self`                                                     | -       | 指定断点及以上的 `align-self`                         |

默认插槽放置列内容。

## mc-spacer Props

| 名称  | 类型     | 默认    | 说明             |
| ----- | -------- | ------- | ---------------- |
| `tag` | `string` | `'div'` | 渲染的 HTML 标签 |

默认插槽可留空；组件本身会通过 `flex-grow: 1` 占据剩余空间。

<style scoped>
.mc-grid-demo__surface {
  background: #242526;
  border: 2px solid #1e1e1f;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
}

.mc-grid-demo__cell {
  align-items: center;
  background: #4f6f8f;
  border: 2px solid #1d2b38;
  box-shadow: inset 0 2px rgba(255, 255, 255, 0.22), inset 0 -3px rgba(0, 0, 0, 0.24);
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-family: 'Minecraft Seven', sans-serif;
  justify-content: center;
  min-height: 40px;
  padding: 10px;
  text-align: center;
}

.mc-grid-demo__cell--moss {
  background: #5f7d4b;
  border-color: #25351d;
}

.mc-grid-demo__cell--copper {
  background: #9b6a43;
  border-color: #3d2618;
}

.mc-grid-demo__cell--short {
  min-height: 34px;
}

.mc-grid-demo__cell--tall {
  min-height: 84px;
}

.mc-grid-demo__align-row {
  min-height: 116px;
}

.mc-grid-demo__toolbar {
  background: #3b3c40;
  border: 2px solid #1e1e1f;
  padding: 8px;
}
</style>
