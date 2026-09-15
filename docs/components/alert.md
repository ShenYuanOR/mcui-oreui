# Alert

用于展示需要用户注意的状态消息。语义颜色由 `variant` 控制，错误状态使用 `role="alert"`，其他状态使用 `role="status"`。

## 基础用法

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-alert variant="info"><template #title>提示</template>新的资源包可供下载。</mc-alert>
  <mc-alert variant="success"><template #title>保存完成</template>世界数据已写入。</mc-alert>
  <mc-alert variant="warning" closable><template #title>注意</template>实验性玩法可能影响存档。</mc-alert>
  <mc-alert variant="error"><template #title>保存失败</template>请检查可用存储空间。</mc-alert>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-alert variant="info">
      <template #title>提示</template>
      新的资源包可供下载。
    </mc-alert>
    <mc-alert variant="success">
      <template #title>保存完成</template>
      世界数据已写入。
    </mc-alert>
    <mc-alert variant="warning" closable>
      <template #title>注意</template>
      实验性玩法可能影响存档。
    </mc-alert>
    <mc-alert variant="error">
      <template #title>保存失败</template>
      请检查可用存储空间。
    </mc-alert>
  </div>
</template>
```

## API

### Props

| 名称       | 类型                                  | 默认    | 说明                                               |
| ---------- | ------------------------------------- | ------- | -------------------------------------------------- |
| `variant`  | `info \| success \| warning \| error` | `info`  | 设置提示条的语义状态，并同步对应颜色与无障碍角色。 |
| `closable` | `boolean`                             | `false` | 是否显示关闭按钮；点击按钮时触发 `close` 事件。    |

`title` 插槽提供标题，默认插槽提供正文；关闭按钮触发 `close`。2.0 不再提供重复的 `title`、`text` Props，也不再使用 `type` 表示语义状态。
