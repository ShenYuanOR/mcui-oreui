# Table

只负责语义化表格结构与 Ore UI 展示，不接管数据状态。

## 条纹与悬停行

<div class="mc-demo mc-demo--column" style="width:100%">
  <mc-table caption="玩家" striped hover>
    <template #header><tr><th>名称</th><th>分数</th></tr></template>
    <template #body><tr><td>Alex</td><td>2</td></tr><tr><td>Steve</td><td>5</td></tr></template>
  </mc-table>
</div>

```vue
<script setup lang="ts"></script>

<template>
  <div class="mc-demo mc-demo--column" style="width:100%">
    <mc-table caption="玩家" striped hover>
      <template #header
        ><tr>
          <th>名称</th>
          <th>分数</th>
        </tr></template
      >
      <template #body
        ><tr>
          <td>Alex</td>
          <td>2</td>
        </tr>
        <tr>
          <td>Steve</td>
          <td>5</td>
        </tr></template
      >
    </mc-table>
  </div>
</template>
```

| Prop      | 类型      | 默认    |
| --------- | --------- | ------- |
| `caption` | `string`  | -       |
| `hover`   | `boolean` | `false` |
| `striped` | `boolean` | `false` |

插槽：`caption`、`header`、`body` / `default`、`footer`。需要排序、分页和选择时使用 [DataTable](./data-table)。
